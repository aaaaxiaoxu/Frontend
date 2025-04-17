<template>
  <div id="UserManagePage">
    <!-- Search -->
    <a-form layout="inline" :model="searchParams" @finish="doSearch">
      <a-form-item label="Account">
        <a-input
          v-model:value="searchParams.userAccount"
          placeholder="Please input account"
          allow-clear
        />
      </a-form-item>
      <a-form-item label="Username">
        <a-input
          v-model:value="searchParams.userName"
          placeholder="Please input username"
          allow-clear
        />
      </a-form-item>
      <a-form-item>
        <a-button type="primary" html-type="submit">Search</a-button>
      </a-form-item>
    </a-form>
    <div style="margin-bottom: 16px" />

    <!-- Table -->
    <a-table
      :columns="columns"
      :data-source="datalist"
      :pagination="pagination"
      @change="doTableChange"
    >
      <template #bodyCell="{ column, record }">
        <template v-if="column.dataIndex === 'userAvatar'">
          <div>
            <a-input
              v-if="editableData[record.id]"
              v-model:value="editableData[record.id].userAvatar"
              placeholder="Enter avatar URL"
              style="margin: -5px 0; width: 200px"
            />
            <template v-else>
              <a-image :src="record.userAvatar" :width="60"></a-image>
            </template>
          </div>
        </template>
        <template v-if="column.dataIndex === 'userName'">
          <div>
            <a-input
              v-if="editableData[record.id]"
              v-model:value="editableData[record.id].userName"
              style="margin: -5px 0"
            />
            <template v-else>
              {{ record.userName }}
            </template>
          </div>
        </template>
        <template v-if="column.dataIndex === 'userProfile'">
          <div>
            <a-input
              v-if="editableData[record.id]"
              v-model:value="editableData[record.id].userProfile"
              style="margin: -5px 0"
            />
            <template v-else>
              {{ record.userProfile }}
            </template>
          </div>
        </template>
        <template v-if="column.dataIndex === 'userRole'">
          <div v-if="editableData[record.id]">
            <a-select v-model:value="editableData[record.id].userRole" style="width: 100px">
              <a-select-option value="admin">admin</a-select-option>
              <a-select-option value="user">user</a-select-option>
            </a-select>
          </div>
          <div v-else>
            <a-tag :color="record.userRole === 'admin' ? 'green' : 'red'">
              {{ record.userRole }}
            </a-tag>
          </div>
        </template>
        <template v-if="column.dataIndex === 'createTime'">
          {{ dayjs(record.createTime).format('YYYY-MM-DD HH:mm:ss') }}
        </template>
        <template v-else-if="column.key === 'tags'">
          <span>
            <a-tag
              v-for="tag in record.tags"
              :key="tag"
              :color="tag === 'loser' ? 'volcano' : tag.length > 5 ? 'geekblue' : 'green'"
            >
              {{ tag.toUpperCase() }}
            </a-tag>
          </span>
        </template>
        <template v-else-if="column.key === 'action'">
          <div class="editable-row-operations">
            <span v-if="editableData[record.id]">
              <a-typography-link @click="save(record.id)">Save</a-typography-link>
              <a-popconfirm title="Sure to cancel?" @confirm="cancel(record.id)">
                <a>Cancel</a>
              </a-popconfirm>
            </span>
            <span v-else>
              <a @click="edit(record.id)">Edit</a>
              <a-button danger style="margin-left: 8px" @click="doDelete(record.id)"
                >Delete</a-button
              >
            </span>
          </div>
        </template>
      </template>
    </a-table>
  </div>
</template>
<script lang="ts" setup>
import { SmileOutlined, DownOutlined } from '@ant-design/icons-vue'
import { computed, onMounted, reactive, ref } from 'vue'
import {
  deleteUserUsingPost,
  listUserVoByPageUsingPost,
  updateUserUsingPost,
  getLoginUserUsingGet,
} from '@/api/userController.ts'
import { message } from 'ant-design-vue'
import dayjs from 'dayjs'
import { cloneDeep } from 'lodash-es'
import type { UnwrapRef } from 'vue'
import { useLoginUserStore } from '@/stores/useLoginUserStore.ts'

// Get login user store
const loginUserStore = useLoginUserStore()

const columns = [
  {
    title: 'id',
    dataIndex: 'id',
  },
  {
    title: 'UserAccount',
    dataIndex: 'userAccount',
  },
  {
    title: 'UserName',
    dataIndex: 'userName',
  },
  {
    title: 'UserAvatar',
    dataIndex: 'userAvatar',
  },
  {
    title: 'UserProfile',
    dataIndex: 'userProfile',
  },
  {
    title: 'UserRole',
    dataIndex: 'userRole',
  },
  {
    title: 'CreatedAt',
    dataIndex: 'createTime',
  },
  {
    title: 'Action',
    key: 'action',
  },
]

// Define data
const datalist = ref<API.UserVO>([])
const total = ref(0)

// Search parameters
const searchParams = reactive<API.UserQueryRequest>({
  current: 1,
  pageSize: 10,
})

const pagination = computed(() => {
  return {
    current: searchParams.current,
    pagesize: searchParams.pageSize,
    total: total.value,
    showSizeChanger: true,
    showTotal: (total) => `Total: ${total}`,
  }
})

// Get data
const doSearch = () => {
  // Reset page number
  searchParams.current = 1
  fetchData()
}

// Table change event
const doTableChange = (page: any) => {
  searchParams.current = page.current
  searchParams.pageSize = page.pageSize
  fetchData()
}

// Delete data
const doDelete = async (id: string) => {
  if (!id) return
  const res = await deleteUserUsingPost({ id })
  if (res.data.code === 0) {
    message.success(res.data.message)
    fetchData()
  } else {
    message.error('Delete failed')
  }
}

// Get data
const fetchData = async () => {
  const res = await listUserVoByPageUsingPost({
    ...searchParams,
  })
  if (res.data.code === 0 && res.data.data) {
    datalist.value = res.data.data.records ?? []
    total.value = res.data.data.total ?? 0
  } else {
    message.error('Failed to fetch data: ' + res.data.message)
  }
}

// Editable data
const editableData: UnwrapRef<Record<string, API.UserUpdateRequest>> = reactive({})

// Edit user
const edit = (id: string) => {
  const targetUser = datalist.value.find((item) => id === item.id)
  if (targetUser) {
    editableData[id] = {
      id: targetUser.id,
      userName: targetUser.userName,
      userAvatar: targetUser.userAvatar,
      userProfile: targetUser.userProfile,
      userRole: targetUser.userRole,
    }
  }
}

// Save user information
const save = async (id: string) => {
  try {
    const res = await updateUserUsingPost(editableData[id])
    if (res.data.code === 0) {
      message.success('User updated successfully')

      // Update local data
      const index = datalist.value.findIndex((item) => id === item.id)
      if (index !== -1) {
        Object.assign(datalist.value[index], editableData[id])
      }

      // If the updated user is the current login user, update the navigation bar
      if (loginUserStore.loginUser.id === id) {
        // Fetch the latest login user information
        await loginUserStore.fetchLoginUser()
        message.success('Navigation bar updated with latest user info')
      }

      // Remove edit status
      delete editableData[id]
    } else {
      message.error('Update failed: ' + res.data.message)
    }
  } catch (error) {
    message.error('Update failed: ' + error)
  }
}

// Cancel edit
const cancel = (id: string) => {
  delete editableData[id]
}

// Page mounted event
onMounted(() => {
  fetchData()
})
</script>

<style scoped>
.editable-row-operations a {
  margin-right: 8px;
}
</style>
