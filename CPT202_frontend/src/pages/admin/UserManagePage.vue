<template>
  <div id="UserManagePage">
    <!-- Search -->
    <a-form layout="inline" :model="searchParams" @finish="doSearch">
      <a-form-item :label="t('message.accountLabel')">
        <a-input
          v-model:value="searchParams.userAccount"
          :placeholder="t('message.enterAccount')"
          allow-clear
        />
      </a-form-item>
      <a-form-item :label="t('message.username')">
        <a-input
          v-model:value="searchParams.userName"
          :placeholder="t('message.enterUsername')"
          allow-clear
        />
      </a-form-item>
      <a-form-item>
        <InteractiveHoverButton
          :text="t('message.search')"
          @click="doSearch"
          type="submit"
          html-type="submit"
        />
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
              :placeholder="t('message.enterAvatarUrl')"
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
        <template v-if="column.dataIndex === 'user_status'">
          <div v-if="editableData[record.id]">
            <a-select v-model:value="editableData[record.id].user_status" style="width: 150px">
              <a-select-option :value="0">{{ t('message.allowUpload') }}</a-select-option>
              <a-select-option :value="1">{{ t('message.forbidUpload') }}</a-select-option>
            </a-select>
          </div>
          <div v-else>
            <a-tag :color="record.user_status === 1 ? 'red' : 'green'">
              {{ record.user_status === 1 ? t('message.forbidUpload') : t('message.allowUpload') }}
            </a-tag>
          </div>
        </template>
        <template v-if="column.dataIndex === 'banNumber'">
          <div>
            <a-tag :color="getBanNumberColor(record.banNumber)">
              {{ record.banNumber || 0 }}
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
              <InteractiveHoverButton :text="t('message.submit')" @click="save(record.id)" class="mr-2" />
              <a-popconfirm :title="t('message.sureToCancel')" @confirm="cancel(record.id)">
                <InteractiveHoverButton :text="t('message.cancel')" />
              </a-popconfirm>
            </span>
            <span v-else>
              <InteractiveHoverButton :text="t('message.edit')" @click="edit(record.id)" class="mr-2" />
              <InteractiveHoverButton :text="t('message.delete')" @click="doDelete(record.id)" />
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
  getUserByIdUsingGet,
} from '@/api/userController.ts'
import { message } from 'ant-design-vue'
import dayjs from 'dayjs'
import { cloneDeep } from 'lodash-es'
import type { UnwrapRef } from 'vue'
import { useLoginUserStore } from '@/stores/useLoginUserStore.ts'
import InteractiveHoverButton from '@/components/ui/interactive-hover-button/InteractiveHoverButton.vue'
import { useI18n } from 'vue-i18n'

// i18n
const { t } = useI18n()

// Get login user store
const loginUserStore = useLoginUserStore()

const columns = computed(() => [
  {
    title: 'id',
    dataIndex: 'id',
  },
  {
    title: t('message.userAccount'),
    dataIndex: 'userAccount',
  },
  {
    title: t('message.username'),
    dataIndex: 'userName',
  },
  {
    title: t('message.userAvatar'),
    dataIndex: 'userAvatar',
  },
  {
    title: t('message.userProfile'),
    dataIndex: 'userProfile',
  },
  {
    title: t('message.userRole'),
    dataIndex: 'userRole',
  },
  {
    title: t('message.uploadPermission'),
    dataIndex: 'user_status',
  },
  {
    title: t('message.banNumber'),
    dataIndex: 'banNumber',
  },
  {
    title: t('message.createdAt'),
    dataIndex: 'createTime',
  },
  {
    title: t('message.action'),
    key: 'action',
  },
])

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
    showTotal: (total) => `${t('message.total')}: ${total}`,
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
    message.error(t('message.deleteFailed'))
  }
}

// Get data
const fetchData = async () => {
  const res = await listUserVoByPageUsingPost({
    ...searchParams,
  })
  if (res.data.code === 0 && res.data.data) {
    const userList = res.data.data.records ?? []

    // Check whether you need to obtain complete user information (including user_status)
    // 1. Try to get the full user information directly from the backend
    for (let i = 0; i < userList.length; i++) {
      try {
        const userRes = await getUserByIdUsingGet({ id: userList[i].id })
        if (userRes.data.code === 0 && userRes.data.data) {
          // 从完整的User对象中获取user_status
          userList[i].user_status = userRes.data.data.user_status
          userList[i].banNumber = userRes.data.data.banNumber
        }
      } catch (error) {
        console.error(`获取用户 ${userList[i].id} 的完整信息失败:`, error)
      }
    }

    datalist.value = userList
    total.value = res.data.data.total ?? 0
  } else {
    message.error(t('message.fetchDataFailed') + ': ' + res.data.message)
  }
}

// Editable data
const editableData: UnwrapRef<Record<string, API.UserUpdateRequest>> = reactive({})

// Edit user
const edit = async (id: string) => {
  // Get complete user information directly from the backend, ensuring user_status is included
  try {
    const res = await getUserByIdUsingGet({ id })
    if (res.data.code === 0 && res.data.data) {
      const fullUser = res.data.data
      editableData[id] = {
        id: fullUser.id,
        userName: fullUser.userName,
        userAvatar: fullUser.userAvatar,
        userProfile: fullUser.userProfile,
        userRole: fullUser.userRole,
        user_status: fullUser.user_status === undefined || fullUser.user_status === null ? 0 : fullUser.user_status,
        banNumber: fullUser.banNumber || 0
      }
    }
  } catch (error) {
    console.error('获取完整用户信息失败:', error)

    // Fallback to the data in the usage list
    const targetUser = datalist.value.find((item) => id === item.id)
    if (targetUser) {
      editableData[id] = {
        id: targetUser.id,
        userName: targetUser.userName,
        userAvatar: targetUser.userAvatar,
        userProfile: targetUser.userProfile,
        userRole: targetUser.userRole,
        user_status: targetUser.user_status === undefined || targetUser.user_status === null ? 0 : targetUser.user_status,
        banNumber: targetUser.banNumber || 0
      }
    }
  }
}

// Save user information
const save = async (id: string) => {
  try {
    const res = await updateUserUsingPost(editableData[id])
    if (res.data.code === 0) {
      message.success(t('message.userUpdatedSuccess'))

      // 重Re-get data once, ensuring local data is synchronized with the database
      fetchData()

      // If the updated user is the current login user, update the navigation bar
      if (loginUserStore.loginUser.id === id) {
        // Fetch the latest login user information
        await loginUserStore.fetchLoginUser()
        message.success(t('message.navbarUpdated'))
      }

      // Remove edit status
      delete editableData[id]
    } else {
      message.error(t('message.updateFailed') + ': ' + res.data.message)
    }
  } catch (error) {
    message.error(t('message.updateFailed') + ': ' + error)
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

// 添加获取ban_number颜色的方法
const getBanNumberColor = (banNumber) => {
  if (!banNumber) return 'green'
  if (banNumber <= 2) return 'orange'
  return 'red'
}
</script>

<style scoped>
.editable-row-operations a {
  margin-right: 8px;
}

/* 修复搜索框无法点击的问题 */
#UserManagePage {
  position: relative;
}

#UserManagePage .ant-form {
  position: relative;
  z-index: 100;
  pointer-events: auto !important;
}

#UserManagePage .ant-input {
  position: relative;
  z-index: 100;
  pointer-events: auto !important;
}

#UserManagePage .ant-form-item {
  pointer-events: auto !important;
}
</style>
