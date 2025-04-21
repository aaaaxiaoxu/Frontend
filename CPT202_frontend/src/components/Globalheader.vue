<template>
  <div id="globalHeader">
    <a-row :wrap="false" align="middle">
      <a-col flex="250px">
        <router-link to="/">
          <div class="title-bar">
            <img src="../assets/logo.png" alt="logo" class="logo" />
            <div class="title">MelodyHub</div>
          </div>
        </router-link>
      </a-col>
      <a-col flex="auto">
        <a-menu
          v-model:selectedKeys="current"
          mode="horizontal"
          :items="filteredItems"
          @click="doMenuClick"
        />
      </a-col>
      <a-col>
        <div class="right-section">
          <a-input-search
            v-model:value="searchValue"
            placeholder="input search text"
            style="width: 240px; margin-right: 16px;"
            enter-button
            @search="onSearch"
          />
          <a-button type="primary" class="upload-btn" @click="showUploadModal">
            <upload-outlined></upload-outlined>
            upload
          </a-button>
          <div class="user-login-status">
            <div v-if="loginUserStore.loginUser.id" class="user-info">
              <a-dropdown>
                <a-space>
                  <a-avatar
                    :size="36"
                    :src="loginUserStore.loginUser.userAvatar"
                    class="user-avatar"
                  />
                  <span class="user-name">{{ loginUserStore.loginUser.userName ?? '无名' }}</span>
                </a-space>

                <template #overlay>
                  <a-menu>
                    <a-menu-item @click="goToUserEdit">
                      <UserOutlined />
                      Personal Information
                    </a-menu-item>
                    <a-menu-item @click="doLogout">
                      <LogoutOutlined />
                      Logout
                    </a-menu-item>
                  </a-menu>
                </template>
              </a-dropdown>
            </div>
            <div v-else>
              <a-button type="primary" href="/user/login"> Login </a-button>
            </div>
          </div>
        </div>
      </a-col>
    </a-row>
    <!-- 上传模态框 -->
    <a-modal v-model:visible="uploadModalVisible" title="上传音乐" @cancel="handleCancel">
      <music-file-upload @upload-success="handleUploadSuccess"></music-file-upload>
    </a-modal>
  </div>
</template>

<script lang="ts" setup>
import { h, ref, computed } from 'vue'
import { HomeOutlined, LogoutOutlined, UserOutlined, UploadOutlined, CustomerServiceOutlined } from '@ant-design/icons-vue'
import type { MenuProps } from 'ant-design-vue'
import { message, InputSearch } from 'ant-design-vue'
import { useRouter } from 'vue-router'
import { useLoginUserStore } from '@/stores/useLoginUserStore.ts'
import { userLogoutUsingPost } from '@/api/userController.ts'
import checkAccess from '@/access/checkAccess'
import MusicFileUpload from '@/components/MusicFileUpload.vue'
import type { VNode } from 'vue'

// Define a custom type for menu items including meta
interface CustomMenuItem {
  key: string
  icon?: () => VNode
  label: string
  title: string
  meta?: {
    access: string
    hideInMenu?: boolean
  }
}

const loginUserStore = useLoginUserStore()

const current = ref<string[]>([])
// Use the custom type for the menus ref
const menus = ref<CustomMenuItem[]>([
  {
    key: '/',
    icon: () => h(HomeOutlined),
    label: '主页',
    title: '主页',
    meta: {
      access: 'notLogin',
    },
  },
  {
    key: '/admin/userManage',
    label: '用户管理',
    title: 'about',
    meta: {
      access: 'admin',
    },
  },
  {
    key: '/admin/resourceReview',
    label: '资源审核',
    title: 'Resource Review',
    meta: {
      access: 'admin',
    },
  },
  {
    key: '/music',
    icon: () => h(CustomerServiceOutlined),
    label: 'Listening Music',
    title: 'Listening Music',
    meta: {
      access: 'user',
    },
  },
  {
    key: '/add_musicFile',
    label: 'Upload Music',
    title: 'Upload Music',
    meta: {
      access: 'notLogin',
    },
  },
])

// Filter menu items using the custom type
const filteredItems = computed(() => {
  return menus.value.filter((menu: CustomMenuItem) => {
    // If the menu item is set to hideInMenu, do not display it
    if (menu?.meta?.hideInMenu) {
      return false
    }
    // Filter menu items based on the logged-in user's permissions
    return checkAccess(loginUserStore.loginUser, menu?.meta?.access as string)
  })
})

const router = useRouter()
// Route jump event
const doMenuClick = ({ key }: { key: string }) => {
  router.push({
    path: key,
  })
}

// Jump to the user edit page
const goToUserEdit = () => {
  router.push({
    path: '/user/edit',
  })
}

// User logout
const doLogout = async () => {
  const res = await userLogoutUsingPost()
  if (res.data.code === 0) {
    loginUserStore.setLoginUser({
      userName: '未登录',
    })
    message.success('退出登录成功')
    await router.push({
      path: '/user/login',
    })
  } else {
    message.error('退出登录失败' + res.data.message)
  }
}

// Listen for route changes, update current selected menu
router.afterEach((to, from, next) => {
  current.value = [to.path]
})

const uploadModalVisible = ref(false)
const handleCancel = () => {
  uploadModalVisible.value = false
}
const handleUploadSuccess = () => {
  message.success('音乐上传成功')
  uploadModalVisible.value = false
}

const showUploadModal = () => {
  uploadModalVisible.value = true
}

// Add search functionality
const searchValue = ref<string>('');

const onSearch = (value: string) => {
  if (value.trim()) {
    router.push({
      path: '/search',
      query: { q: value.trim() }
    });
  }
};
</script>

<style scoped>
#globalHeader .title-bar {
  display: flex;
  align-items: center;
}

.title {
  color: black;
  font-size: 18px;
  margin-left: 16px;
}

.logo {
  height: 48px;
}

.right-section {
  display: flex;
  align-items: center;
  gap: 16px;
  padding-right: 28px;
}

.upload-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 32px;
}

.user-login-status {
  display: flex;
  align-items: center;
  height: 100%;
}

.user-info {
  display: flex;
  align-items: center;
  cursor: pointer;
}

.user-avatar {
  margin-right: 16px; /* 增加头像与用户名之间的间距 */
}

.user-name {
  font-size: 16px; /* 增加字体大小 */
  font-weight: 500; /* 增加字体粗细 */
  color: rgba(0, 0, 0, 0.85);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  max-width: 90px; /* 增加最大宽度 */
}

.custom-search-input {
  width: 240px;
  height: 40px;
  margin-right: 16px;
  margin-top: 8px;
  border-radius: 24px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.custom-search-input :deep(.ant-btn) {
  border-radius: 0 24px 24px 0;
  background-color: #1890ff;
}

.custom-search-input :deep(.ant-input) {
  border-radius: 24px 0 0 24px;
}

.custom-search-input:hover {
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}
</style>
