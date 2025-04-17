<template>
  <div id="globalHeader">
    <a-row :wrap="false" align="middle">
      <a-col flex="250px">
        <router-link to="/">
          <div class="title-bar">
            <img src="../assets/logo.svg" alt="logo" class="logo" />
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
      <!-- 用户信息展示栏和上传按钮 -->
      <a-col>
        <div class="right-section">
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
import { HomeOutlined, LogoutOutlined, UserOutlined, UploadOutlined } from '@ant-design/icons-vue'
import { MenuProps, message } from 'ant-design-vue'
import { useRouter } from 'vue-router'
import { useLoginUserStore } from '@/stores/useLoginUserStore.ts'
import { userLogoutUsingPost } from '@/api/userController.ts'
import checkAccess from '@/access/checkAccess'
import MusicFileUpload from '@/components/MusicFileUpload.vue'

const loginUserStore = useLoginUserStore()

const current = ref<string[]>([])
const menus = ref<MenuProps['items']>([
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
    key: '/add_musicFile',
    label: 'Upload Music',
    title: 'Upload Music',
    meta: {
      access: 'notLogin',
    },
  },
])

// 过滤菜单项
const filteredItems = computed(() => {
  return menus.value.filter((menu) => {
    // 如果菜单项设置了 hideInMenu，则不显示
    if (menu?.meta?.hideInMenu) {
      return false
    }
    // 根据登录用户的权限过滤菜单项
    return checkAccess(loginUserStore.loginUser, menu?.meta?.access as string)
  })
})

const router = useRouter()
// 路由跳转事件
const doMenuClick = ({ key }) => {
  router.push({
    path: key,
  })
}

// 跳转到用户编辑页面
const goToUserEdit = () => {
  router.push({
    path: '/user/edit',
  })
}

// 用户注销
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

// 监听路由变化，更新当前选中菜单
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
</style>
