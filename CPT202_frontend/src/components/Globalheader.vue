<template>
  <div class="navbar-wrapper fixed left-0 right-0 z-50 w-full" :style="{ top: visible ? '10px' : '0' }">
    <div class="w-full">
      <div class="max-w-6xl mx-auto">
        <!-- 桌面导航 -->
        <div
          class="relative z-[60] mx-auto hidden w-full flex-row items-center justify-between self-start rounded-full px-3 py-1 lg:flex"
          :class="[visible ? (themeStore.theme === 'dark' ? 'bg-black/80 shadow-lg' : 'bg-white/80 shadow-lg') : 'bg-transparent']"
          :style="{
            backdropFilter: visible ? 'blur(10px)' : 'none',
            boxShadow: visible ? '0 0 24px rgba(34, 42, 53, 0.06), 0 1px 1px rgba(0, 0, 0, 0.05), 0 0 0 1px rgba(34, 42, 53, 0.04), 0 0 4px rgba(34, 42, 53, 0.08), 0 16px 68px rgba(47, 48, 55, 0.05), 0 1px 0 rgba(255, 255, 255, 0.1) inset' : 'none',
            transition: 'all 0.3s',
            transform: visible ? 'translateY(5px)' : 'translateY(0)'
          }"
        >
          <!-- Logo -->
          <router-link to="/" class="relative z-20 mr-3 flex items-center space-x-1 px-1 py-1 text-sm font-normal">
            <img src="../assets/logo.png" alt="logo" width="40" height="40" />
            <span class="site-logo font-medium text-base">MelodyHub</span>
          </router-link>

          <!-- 导航项 -->
          <div class="flex-1 flex-row items-center justify-center space-x-1 text-sm font-medium transition duration-200 lg:flex lg:space-x-1">
            <router-link
              v-for="(item, idx) in filteredItems"
              :key="idx"
              :to="item.key"
              class="relative px-3 py-1 main-nav-item"
              @mouseenter="hoveredItem = idx"
              @mouseleave="hoveredItem = null"
            >
              <div v-if="hoveredItem === idx" class="absolute inset-0 h-full w-full rounded-full" :class="themeStore.theme === 'dark' ? 'bg-gray-800' : 'bg-gray-100'"></div>
              <span class="relative z-20 nav-text">{{ t(item.label) }}</span>
            </router-link>
          </div>

          <!-- 右侧功能区 -->
          <div class="relative z-20 flex flex-row items-center">
            <!-- 搜索框 -->
            <div class="flex items-center mr-3">
              <VanishingInput
                v-model="searchValue"
                :placeholders="searchPlaceholders"
                @submit="onSearch"
                class="w-[280px] h-[46px] search-input-wrapper"
              />
            </div>

            <!-- 主题切换按钮 -->
            <div class="theme-toggle mx-2 cursor-pointer" @click="toggleTheme">
              <SunIcon v-if="themeStore.theme === 'dark'" class="h-5 w-5 text-white" />
              <MoonIcon v-else class="h-5 w-5 text-black" />
            </div>

            <!-- 上传按钮 -->
            <GradientButton 
              :bgColor="themeStore.theme === 'dark' ? '#000' : '#fff'" 
              class="upload-btn" 
              @click="showUploadModal"
            >
              <upload-outlined></upload-outlined>
              <span>{{ t('message.upload') }}</span>
            </GradientButton>

            <!-- 用户信息/登录按钮 -->
            <div class="user-login-status ml-3">
              <div v-if="loginUserStore.loginUser.id" class="user-info">
                <a-dropdown>
                  <a-space>
                    <a-avatar
                      :size="32"
                      :src="loginUserStore.loginUser.userAvatar"
                      class="user-avatar"
                    />
                    <span class="user-name">{{ loginUserStore.loginUser.userName ?? t('message.noName') }}</span>
                  </a-space>

                  <template #overlay>
                    <a-menu>
                      <a-menu-item @click="goToUserEdit">
                        <UserOutlined />
                        {{ t('message.personalInfo') }}
                      </a-menu-item>
                      <a-menu-item @click="goToUserUploads">
                        <upload-outlined />
                        {{ t('message.myUploads') }}
                      </a-menu-item>
                      <a-menu-item @click="doLogout">
                        <LogoutOutlined />
                        {{ t('message.logout') }}
                      </a-menu-item>
                    </a-menu>
                  </template>
                </a-dropdown>
              </div>
              <div v-else>
                <GradientButton 
                  href="/user/login" 
                  :bgColor="themeStore.theme === 'dark' ? '#000' : '#fff'" 
                  class="upload-btn"
                  @click="router.push('/user/login')"
                >
                  <span>{{ t('message.login') }}</span>
                </GradientButton>
              </div>
            </div>
          </div>
        </div>

        <!-- 移动导航 -->
        <div
          class="relative z-50 mx-auto flex w-full flex-col items-center justify-between px-0 py-1 lg:hidden"
          :class="[visible ? (themeStore.theme === 'dark' ? 'bg-black/80 shadow-lg' : 'bg-white/80 shadow-lg') : 'bg-transparent']"
          :style="{
            backdropFilter: visible ? 'blur(10px)' : 'none',
            boxShadow: visible ? '0 0 24px rgba(34, 42, 53, 0.06), 0 1px 1px rgba(0, 0, 0, 0.05), 0 0 0 1px rgba(34, 42, 53, 0.04), 0 0 4px rgba(34, 42, 53, 0.08), 0 16px 68px rgba(47, 48, 55, 0.05), 0 1px 0 rgba(255, 255, 255, 0.1) inset' : 'none',
            paddingRight: visible ? '10px' : '0px',
            paddingLeft: visible ? '10px' : '0px',
            transition: 'all 0.3s',
            transform: visible ? 'translateY(5px)' : 'translateY(0)'
          }"
        >
          <!-- 移动导航头部 -->
          <div class="flex w-full flex-row items-center justify-between px-3">
            <router-link to="/" class="relative z-20 mr-3 flex items-center space-x-1 px-1 py-1 text-sm font-normal">
              <img src="../assets/logo.svg" alt="logo" width="36" height="36" />
              <span class="site-logo font-medium text-base">MelodyHub</span>
            </router-link>

            <!-- 搜索框 - 移动视图 -->
            <div class="flex items-center flex-1 max-w-[180px] mr-2">
              <VanishingInput
                v-model="searchValue"
                :placeholders="searchPlaceholders"
                @submit="onSearch"
                class="w-full h-[42px] search-input-wrapper"
              />
            </div>

            <!-- 移动导航切换按钮 -->
            <div @click="isMenuOpen = !isMenuOpen" class="cursor-pointer">
              <svg v-if="isMenuOpen" xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="menu-icon">
                <line x1="18" y1="6" x2="6" y2="18"></line>
                <line x1="6" y1="6" x2="18" y2="18"></line>
              </svg>
              <svg v-else xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="menu-icon">
                <line x1="4" y1="12" x2="20" y2="12"></line>
                <line x1="4" y1="6" x2="20" y2="6"></line>
                <line x1="4" y1="18" x2="20" y2="18"></line>
              </svg>
            </div>
          </div>

          <!-- 移动导航菜单 -->
          <transition name="menu">
            <div v-if="isMenuOpen" 
                 class="absolute inset-x-0 top-14 z-50 flex w-full flex-col items-start justify-start gap-3 rounded-lg px-3 py-6 mobile-menu"
                 :class="themeStore.theme === 'dark' ? 'bg-dark-menu' : 'bg-white'"
                 :style="{
                  boxShadow: '0 0 24px rgba(34, 42, 53, 0.06), 0 1px 1px rgba(0, 0, 0, 0.05), 0 0 0 1px rgba(34, 42, 53, 0.04), 0 0 4px rgba(34, 42, 53, 0.08), 0 16px 68px rgba(47, 48, 55, 0.05), 0 1px 0 rgba(255, 255, 255, 0.1) inset'
                 }">
              <router-link
                v-for="(item, idx) in filteredItems"
                :key="idx"
                :to="item.key"
                class="mobile-nav-item hover:text-gray-500 transition duration-200 w-full p-2"
                @click="isMenuOpen = false"
              >
                <span class="mobile-nav-text">{{ t(item.label) }}</span>
              </router-link>

              <!-- 添加主题切换选项 -->
              <div class="flex items-center w-full p-2 cursor-pointer" @click="toggleTheme">
                <div v-if="themeStore.theme === 'dark'" class="flex items-center space-x-2">
                  <SunIcon class="h-5 w-5 text-white" />
                  <span class="text-white">{{ t('message.lightMode') }}</span>
                </div>
                <div v-else class="flex items-center space-x-2">
                  <MoonIcon class="h-5 w-5" />
                  <span>{{ t('message.darkMode') }}</span>
                </div>
              </div>

              <div class="flex w-full">
                <!-- 上传按钮 - 移动视图 -->
                <GradientButton 
                  :bgColor="themeStore.theme === 'dark' ? '#000' : '#fff'" 
                  class="my-2 mr-2"
                  @click="showUploadModal"
                >
                  <upload-outlined></upload-outlined>
                  <span>{{ t('message.upload') }}</span>
                </GradientButton>

                <!-- 用户信息/登录按钮 - 移动视图 -->
                <div class="user-login-status my-2">
                  <div v-if="loginUserStore.loginUser.id" class="user-info">
                    <a-dropdown>
                      <a-space>
                        <a-avatar
                          :size="32"
                          :src="loginUserStore.loginUser.userAvatar"
                          class="user-avatar"
                        />
                        <span class="user-name">{{ loginUserStore.loginUser.userName ?? t('message.noName') }}</span>
                      </a-space>

                      <template #overlay>
                        <a-menu>
                          <a-menu-item @click="goToUserEdit">
                            <UserOutlined />
                            {{ t('message.personalInfo') }}
                          </a-menu-item>
                          <a-menu-item @click="goToUserUploads">
                            <upload-outlined />
                            {{ t('message.myUploads') }}
                          </a-menu-item>
                          <a-menu-item @click="doLogout">
                            <LogoutOutlined />
                            {{ t('message.logout') }}
                          </a-menu-item>
                        </a-menu>
                      </template>
                    </a-dropdown>
                  </div>
                  <div v-else>
                    <GradientButton 
                      href="/user/login" 
                      :bgColor="themeStore.theme === 'dark' ? '#000' : '#fff'" 
                      class="upload-btn"
                      @click="router.push('/user/login')"
                    >
                      <span>{{ t('message.login') }}</span>
                    </GradientButton>
                  </div>
              </div>
            </div>
            </div>
          </transition>
        </div>
      </div>
    </div>

    <!-- 为了防止内容被固定导航栏遮挡 -->
    <div class="h-14"></div>

    <!-- 上传模态框 -->
    <a-modal
      v-model:visible="uploadModalVisible"
      :title="t('message.uploadMusic')"
      @cancel="handleCancel"
      :footer="null"
      :class="themeStore.theme === 'dark' ? 'dark-modal' : ''"
      :headStyle="themeStore.theme === 'dark' ? { backgroundColor: '#121212', borderBottom: '1px solid #303030', color: 'rgba(255, 255, 255, 0.85)' } : {}"
    >
      <music-file-upload @upload-success="handleUploadSuccess"></music-file-upload>
      <div class="modal-custom-footer">
        <InteractiveHoverButton
          :text="t('message.cancel')"
          @click="handleCancel"
          :class="themeStore.theme === 'dark' ? 'dark-mode-cancel-button' : 'cancel-button'"
        />
      </div>
    </a-modal>
  </div>
</template>

<script lang="ts" setup>
import { h, ref, computed, onMounted, onUnmounted } from 'vue'
import {
  HomeOutlined,
  LogoutOutlined,
  UserOutlined,
  UploadOutlined,
  CustomerServiceOutlined,
  SearchOutlined,
} from '@ant-design/icons-vue'
import type { MenuProps } from 'ant-design-vue'
import { message, InputSearch } from 'ant-design-vue'
import { useRouter } from 'vue-router'
import { useLoginUserStore } from '@/stores/useLoginUserStore.ts'
import { userLogoutUsingPost } from '@/api/userController.ts'
import checkAccess from '@/access/checkAccess'
import MusicFileUpload from '@/components/MusicFileUpload.vue'
import type { VNode } from 'vue'
import { useI18n } from 'vue-i18n'
import GradientButton from '@/components/ui/gradient-button/GradientButton.vue'
import VanishingInput from '@/components/ui/vanishing-input/VanishingInput.vue'
import InteractiveHoverButton from '@/components/ui/interactive-hover-button/InteractiveHoverButton.vue'
import { getUserByIdUsingGet } from '@/api/userController.ts'
import { useThemeStore } from '@/stores/useThemeStore'

const { t } = useI18n()

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
    key: '/home',
    icon: () => h(HomeOutlined),
    label: 'message.homePage',
    title: 'message.homePage',
    meta: {
      access: 'notLogin',
    },
  },
  {
    key: '/admin/userManage',
    label: 'message.userManagement',
    title: 'message.userManagement',
    meta: {
      access: 'admin',
    },
  },
  {
    key: '/admin/resourceReview',
    label: 'message.resourceReview',
    title: 'message.resourceReview',
    meta: {
      access: 'admin',
    },
  },
  {
    key: '/music',
    icon: () => h(CustomerServiceOutlined),
    label: 'message.listeningMusic',
    title: 'message.listeningMusic',
    meta: {
      access: 'user',
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

// Jump to the user uploads page
const goToUserUploads = () => {
  router.push({
    path: '/user/uploads',
  })
}

// User logout
const doLogout = async () => {
  const res = await userLogoutUsingPost()
  if (res.data.code === 0) {
    loginUserStore.setLoginUser({
      userName: t('message.noName'),
    })
    message.success(t('message.logoutSuccess'))
    await router.push({
      path: '/user/login',
    })
  } else {
    message.error(t('message.logoutFailed') + res.data.message)
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
  message.success(t('message.uploadSuccess'))
  uploadModalVisible.value = false
}

const showUploadModal = async () => {
  // 检查用户是否已登录
  if (!loginUserStore.loginUser.id) {
    message.warning(t('message.noAccount'))
    router.push('/user/login')
    return
  }

  // 检查用户上传权限
  try {
    const res = await getUserByIdUsingGet({ id: loginUserStore.loginUser.id })
    if (res.data.code === 0 && res.data.data) {
      const userStatus = res.data.data.user_status || 0
      if (userStatus === 1) {
        message.error(t('message.uploadForbidden'))
        return
      }
    }
    // 用户状态正常，显示上传模态框
    uploadModalVisible.value = true
  } catch (error) {
    console.error('获取用户状态失败:', error)
    // 出错时默认显示上传模态框
    uploadModalVisible.value = true
  }
}

// Add search functionality
const searchValue = ref<string>('')

// 添加搜索提示词数组，使用音乐类别
const searchPlaceholders = [
  t('message.genrePop'),
  t('message.genreRock'),
  t('message.genreClassical'),
  t('message.genreJazz'),
  t('message.genreHipHop'),
  t('message.genreRnB'),
  t('message.genreCountry'),
  t('message.genreElectronic'),
  t('message.genreKpop'),
  t('message.genreJpop'),
  t('message.genreCpop')
]

const onSearch = (value: string) => {
  if (value && value.trim()) {
    router.push({
      path: '/search',
      query: { q: value.trim() },
    })
  }
}

// 新增导航栏相关状态
const visible = ref(false)
const isMenuOpen = ref(false)
const hoveredItem = ref<number | null>(null)

// 滚动事件处理
const handleScroll = () => {
  if (window.scrollY > 100) {
    visible.value = true
  } else {
    visible.value = false
  }
}

const themeStore = useThemeStore()

// 添加主题切换方法
const toggleTheme = () => {
  themeStore.toggleTheme()
}

onMounted(() => {
  window.addEventListener('scroll', handleScroll)
  themeStore.initTheme() // 初始化主题
})

onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll)
})

// 导入自定义图标或使用内联SVG
const SunIcon = {
  render() {
    return h('svg', { 
      xmlns: 'http://www.w3.org/2000/svg', 
      fill: 'none', 
      viewBox: '0 0 24 24', 
      stroke: 'currentColor', 
      class: 'h-5 w-5' 
    }, [
      h('path', { 
        'stroke-linecap': 'round',
        'stroke-linejoin': 'round',
        'stroke-width': '2',
        'd': 'M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z'
      })
    ])
  }
}

const MoonIcon = {
  render() {
    return h('svg', { 
      xmlns: 'http://www.w3.org/2000/svg', 
      fill: 'none', 
      viewBox: '0 0 24 24', 
      stroke: 'currentColor', 
      class: 'h-5 w-5' 
    }, [
      h('path', { 
        'stroke-linecap': 'round',
        'stroke-linejoin': 'round',
        'stroke-width': '2',
        'd': 'M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z'
      })
    ])
  }
}
</script>

<style scoped>
.navbar-wrapper {
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
}

.menu-enter-active,
.menu-leave-active {
  transition: opacity 0.3s ease, transform 0.3s ease;
}

.menu-enter-from,
.menu-leave-to {
  opacity: 0;
  transform: translateY(-10px);
}

.upload-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 32px;
}

/* 暗黑模式按钮样式 */
.dark-mode-btn {
  color: white !important;
  border-color: #333 !important;
}

/* 暗黑模式下用户名称 */
:deep([data-theme='dark'] .user-name) {
  color: rgba(255, 255, 255, 0.85) !important;
}

/* 暗黑模式下移动菜单项 */
:deep([data-theme='dark'] .text-black) {
  color: rgba(255, 255, 255, 0.85) !important;
}

/* 暗黑模式下SVG图标 */
:deep([data-theme='dark'] svg) {
  color: white;
}

/* 暗黑模式下取消按钮 */
.dark-mode-cancel-button {
  border-color: #333;
  background-color: #121212;
  color: rgba(255, 255, 255, 0.85);
}

/* 暗黑模式下下拉菜单 */
:deep([data-theme='dark'] .ant-dropdown-menu) {
  background-color: var(--color-card-background) !important;
}

:deep([data-theme='dark'] .ant-dropdown-menu-item) {
  color: rgba(255, 255, 255, 0.85) !important;
}

:deep([data-theme='dark'] .ant-dropdown-menu-item .anticon) {
  color: rgba(255, 255, 255, 0.85) !important;
}

:deep([data-theme='dark'] .ant-dropdown-menu-item:hover) {
  background-color: #333 !important;
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
  margin-right: 8px;
}

.user-name {
  font-size: 14px;
  font-weight: 500;
  color: rgba(0, 0, 0, 0.85);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  max-width: 80px;
}

.search-input-wrapper {
  position: relative;
}

/* 调整搜索框内部元素位置 */
:deep(.search-input-wrapper p) {
  padding-top: 30px; /* 提示词向下移动 */
}

:deep(.search-input-wrapper button) {
  margin-top: 8px; /* 按钮向下移动 */
}

.modal-custom-footer {
  display: flex;
  justify-content: flex-end;
  padding-top: 12px;
  border-top: 1px solid #f0f0f0;
}

.cancel-button {
  border-color: #d9d9d9;
  background-color: white;
  color: rgba(0, 0, 0, 0.85);
}

/* 加强暗黑模式下用户名的白色显示 */
:deep([data-theme='dark'] .user-info .user-name) {
  color: white !important;
}

:deep([data-theme='dark'] .a-dropdown .user-name) {
  color: white !important;
}

/* 确保移动端导航中的用户名也是白色 */
:deep([data-theme='dark'] .navbar-wrapper .user-name) {
  color: white !important;
}

/* 优化暗黑模式下下拉菜单 */
:deep([data-theme='dark'] .ant-dropdown-menu-item) {
  color: white !important;
}

:deep([data-theme='dark'] .ant-dropdown-menu-item .anticon) {
  color: white !important;
}

:deep([data-theme='dark'] .ant-dropdown .ant-dropdown-menu) {
  background-color: #1e1e1e !important;
  border: 1px solid #303030;
}

/* 导航样式优化 */
.logo-text {
  color: rgba(0, 0, 0, 0.85);
}

.nav-item {
  color: rgba(0, 0, 0, 0.85);
}

/* 暗黑模式下导航元素样式 */
:deep([data-theme='dark'] .logo-text) {
  color: white !important;
}

:deep([data-theme='dark'] .nav-item) {
  color: white !important;
}

:deep([data-theme='dark'] .navbar-wrapper) {
  background-color: transparent; 
}

/* 优化移动端导航在暗黑模式下的样式 */
:deep([data-theme='dark'] .navbar-wrapper .relative.z-50) {
  background-color: rgba(18, 18, 18, 0.8) !important;
}

/* 菜单图标样式 */
.menu-icon {
  color: rgba(0, 0, 0, 0.85);
}

:deep([data-theme='dark'] .menu-icon) {
  color: white !important;
}

/* 移动菜单样式 */
.bg-dark-menu {
  background-color: #1e1e1e;
  border: 1px solid #303030;
}

.mobile-menu-item {
  color: rgba(0, 0, 0, 0.85);
}

:deep([data-theme='dark'] .mobile-menu-item) {
  color: white !important;
}

:deep([data-theme='dark'] .mobile-menu-item:hover) {
  color: rgba(255, 255, 255, 0.65) !important;
}

/* 强制所有菜单文字在黑暗模式下为白色，但排除搜索框 */
:deep([data-theme='dark']) .navbar-wrapper .nav-item,
:deep([data-theme='dark']) .navbar-wrapper .nav-item span,
:deep([data-theme='dark']) .navbar-wrapper .logo-text,
:deep([data-theme='dark']) .navbar-wrapper .text-black:not(.search-input-wrapper):not(.search-input-wrapper *),
:deep([data-theme='dark']) .navbar-wrapper .text-neutral-600:not(.search-input-wrapper):not(.search-input-wrapper *),
:deep([data-theme='dark']) .navbar-wrapper .text-zinc-600:not(.search-input-wrapper):not(.search-input-wrapper *),
:deep([data-theme='dark']) .navbar-wrapper span:not(.search-input-wrapper span):not(.search-input-wrapper *),
:deep([data-theme='dark']) .navbar-wrapper a:not(.search-input-wrapper a):not(.search-input-wrapper *) {
  color: white !important;
}

/* 添加更强力的导航文字样式 */
.site-logo {
  color: rgba(0, 0, 0, 0.85);
}

.main-nav-item {
  color: rgba(0, 0, 0, 0.85);
}

.nav-text {
  color: rgba(0, 0, 0, 0.85);
}

/* 暗黑模式下通过HTML属性选择器提高优先级 */
html[data-theme='dark'] .site-logo {
  color: white !important;
}

html[data-theme='dark'] .main-nav-item,
html[data-theme='dark'] .nav-text {
  color: white !important;
}

/* 移动导航样式 */
.mobile-nav-item {
  color: rgba(0, 0, 0, 0.85);
}

.mobile-nav-text {
  color: rgba(0, 0, 0, 0.85);
}

/* 移动导航黑暗模式样式 */
html[data-theme='dark'] .mobile-nav-item,
html[data-theme='dark'] .mobile-nav-text {
  color: white !important;
}

html[data-theme='dark'] .mobile-menu {
  background-color: #1e1e1e !important;
}

/* 上传模态框样式 */
:deep(.dark-modal) {
  color: rgba(255, 255, 255, 0.85);
}

:deep(.dark-modal .ant-modal-content) {
  background-color: #121212;
}

:deep(.dark-modal .ant-modal-header) {
  background-color: #121212 !important;
  border-bottom: 1px solid #303030;
}

:deep(.dark-modal .ant-modal-title) {
  color: rgba(255, 255, 255, 0.85);
}

/* 强制修复模态框标题栏背景色 */
:deep(.dark-modal) .ant-modal-header,
:deep(.dark-modal .ant-modal-header),
:deep(.dark-modal) .ant-modal-title,
:deep(.dark-modal) .ant-modal-content > div:first-child,
:deep(.dark-modal) div[role="dialog"] > div:first-child,
:deep(.dark-modal) .ant-modal-content > .ant-modal-header,
html[data-theme='dark'] .ant-modal-header,
html[data-theme='dark'] .dark-modal .ant-modal-header {
  background-color: #121212 !important;
  border-bottom-color: #303030 !important;
  color: rgba(255, 255, 255, 0.85) !important;
}

/* 全局覆盖所有模态框标题 */
html[data-theme='dark'] .ant-modal-root .ant-modal-header,
html[data-theme='dark'] .ant-modal-root .ant-modal-title {
  background-color: #121212 !important;
  color: rgba(255, 255, 255, 0.85) !important;
}

:deep(.dark-modal .ant-modal-close) {
  color: rgba(255, 255, 255, 0.85);
}

:deep(.dark-modal .ant-modal-close:hover) {
  color: rgba(255, 255, 255, 1);
}

:deep(.dark-modal .upload-label) {
  color: rgba(255, 255, 255, 0.85);
}

:deep(.dark-modal .ant-upload-list) {
  color: rgba(255, 255, 255, 0.85);
}

:deep(.dark-modal .ant-upload-list-item) {
  color: rgba(255, 255, 255, 0.85);
  background-color: #1e1e1e;
  border: 1px solid #303030;
}

/* 添加输入框暗黑模式样式 */
:deep(.dark-modal .ant-input),
:deep(.dark-modal .ant-input-affix-wrapper),
:deep(.dark-modal input[type="text"]),
:deep(.dark-modal .ant-select-selector) {
  background-color: #1e1e1e !important;
  border-color: #303030 !important;
  color: rgba(255, 255, 255, 0.85) !important;
}

/* 增强特定上传组件样式 */
:deep(.dark-modal .upload-box),
:deep(.dark-modal .upload-box-container *),
:deep(.dark-modal .title-field),
:deep(.dark-modal .title-input) {
  background-color: #1e1e1e !important;
  color: rgba(255, 255, 255, 0.85) !important;
}

:deep(.dark-modal .ant-input:hover),
:deep(.dark-modal .ant-input:focus),
:deep(.dark-modal .ant-input-affix-wrapper:hover),
:deep(.dark-modal .ant-input-affix-wrapper-focused),
:deep(.dark-modal .ant-input-affix-wrapper:focus) {
  border-color: #177ddc !important;
  box-shadow: 0 0 0 2px rgba(23, 125, 220, 0.1) !important;
}

:deep(.dark-modal .ant-input-prefix),
:deep(.dark-modal .ant-input-suffix) {
  color: rgba(255, 255, 255, 0.45) !important;
}

:deep(.dark-modal .modal-custom-footer) {
  border-top: 1px solid #303030;
}

:deep(.dark-modal .cover-upload) {
  background-color: #1e1e1e !important;
  border: 1px dashed #303030 !important;
}

:deep(.dark-modal .cover-upload:hover) {
  border-color: #177ddc !important;
}
</style>
