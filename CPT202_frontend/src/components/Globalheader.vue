<template>
  <div class="navbar-wrapper fixed left-0 right-0 z-50 w-full" :style="{ top: visible ? '10px' : '0' }">
    <div class="w-full">
      <div class="max-w-6xl mx-auto">
        <!-- 桌面导航 -->
        <div
          class="relative z-[60] mx-auto hidden w-full flex-row items-center justify-between self-start rounded-full px-3 py-1 lg:flex"
          :class="[visible ? 'bg-white/80 shadow-lg' : 'bg-transparent']"
          :style="{
            backdropFilter: visible ? 'blur(10px)' : 'none',
            boxShadow: visible ? '0 0 24px rgba(34, 42, 53, 0.06), 0 1px 1px rgba(0, 0, 0, 0.05), 0 0 0 1px rgba(34, 42, 53, 0.04), 0 0 4px rgba(34, 42, 53, 0.08), 0 16px 68px rgba(47, 48, 55, 0.05), 0 1px 0 rgba(255, 255, 255, 0.1) inset' : 'none',
            transition: 'all 0.3s',
            transform: visible ? 'translateY(5px)' : 'translateY(0)'
          }"
        >
          <!-- Logo -->
          <router-link to="/" class="relative z-20 mr-3 flex items-center space-x-1 px-1 py-1 text-sm font-normal text-black">
            <img src="../assets/logo.png" alt="logo" width="40" height="40" />
            <span class="font-medium text-black text-base">MelodyHub</span>
          </router-link>

          <!-- 导航项 -->
          <div class="flex-1 flex-row items-center justify-center space-x-1 text-sm font-medium text-zinc-600 transition duration-200 lg:flex lg:space-x-1">
            <router-link
              v-for="(item, idx) in filteredItems"
              :key="idx"
              :to="item.key"
              class="relative px-3 py-1 text-neutral-600"
              @mouseenter="hoveredItem = idx"
              @mouseleave="hoveredItem = null"
            >
              <div v-if="hoveredItem === idx" class="absolute inset-0 h-full w-full rounded-full bg-gray-100"></div>
              <span class="relative z-20">{{ t(item.label) }}</span>
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

            <!-- 上传按钮 -->
            <GradientButton bgColor="#fff" class="upload-btn text-black" @click="showUploadModal">
              <upload-outlined></upload-outlined>
              {{ t('message.upload') }}
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
                      <a-menu-item @click="doLogout">
                        <LogoutOutlined />
                        {{ t('message.logout') }}
                      </a-menu-item>
                    </a-menu>
                  </template>
                </a-dropdown>
              </div>
              <div v-else>
                <GradientButton href="/user/login" bg-color="#fff" class="upload-btn text-black" @click="router.push('/user/login')">
                  {{ t('message.login') }}
                </GradientButton>
              </div>
            </div>
          </div>
        </div>

        <!-- 移动导航 -->
        <div
          class="relative z-50 mx-auto flex w-full flex-col items-center justify-between px-0 py-1 lg:hidden"
          :class="[visible ? 'bg-white/80 shadow-lg' : 'bg-transparent']"
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
            <router-link to="/" class="relative z-20 mr-3 flex items-center space-x-1 px-1 py-1 text-sm font-normal text-black">
              <img src="../assets/logo.png" alt="logo" width="36" height="36" />
              <span class="font-medium text-black text-base">MelodyHub</span>
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
              <svg v-if="isMenuOpen" xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="text-black">
                <line x1="18" y1="6" x2="6" y2="18"></line>
                <line x1="6" y1="6" x2="18" y2="18"></line>
              </svg>
              <svg v-else xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="text-black">
                <line x1="4" y1="12" x2="20" y2="12"></line>
                <line x1="4" y1="6" x2="20" y2="6"></line>
                <line x1="4" y1="18" x2="20" y2="18"></line>
              </svg>
            </div>
          </div>

          <!-- 移动导航菜单 -->
          <transition name="menu">
            <div v-if="isMenuOpen" class="absolute inset-x-0 top-14 z-50 flex w-full flex-col items-start justify-start gap-3 rounded-lg bg-white px-3 py-6 shadow-[0_0_24px_rgba(34,_42,_53,_0.06),_0_1px_1px_rgba(0,_0,_0,_0.05),_0_0_0_1px_rgba(34,_42,_53,_0.04),_0_0_4px_rgba(34,_42,_53,_0.08),_0_16px_68px_rgba(47,_48,_55,_0.05),_0_1px_0_rgba(255,_255,_255,_0.1)_inset]">
              <router-link
                v-for="(item, idx) in filteredItems"
                :key="idx"
                :to="item.key"
                class="text-black hover:text-gray-500 transition duration-200 w-full p-2"
                @click="isMenuOpen = false"
              >
                {{ t(item.label) }}
              </router-link>

              <div class="flex w-full">
                <!-- 上传按钮 - 移动视图 -->
                <GradientButton bgColor="#fff" class="upload-btn my-2 mr-2 text-black" @click="showUploadModal">
                  <upload-outlined></upload-outlined>
                  {{ t('message.upload') }}
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
                          <a-menu-item @click="doLogout">
                            <LogoutOutlined />
                            {{ t('message.logout') }}
                          </a-menu-item>
                        </a-menu>
                      </template>
                    </a-dropdown>
                  </div>
                  <div v-else>
                    <GradientButton bgColor="#fff" class="text-black" href="/user/login" @click="router.push('/user/login')">
                      {{ t('message.login') }}
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
    >
      <music-file-upload @upload-success="handleUploadSuccess"></music-file-upload>
      <div class="modal-custom-footer">
        <InteractiveHoverButton
          :text="t('message.cancel')"
          @click="handleCancel"
          class="cancel-button"
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

onMounted(() => {
  window.addEventListener('scroll', handleScroll)
})

onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll)
})
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
</style>
