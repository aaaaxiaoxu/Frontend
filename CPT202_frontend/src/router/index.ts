import { createRouter, createWebHistory } from 'vue-router'

import HomePage from '@/pages/HomePage.vue'
import LandingPage from '@/pages/LandingPage.vue'
import UserLoginPage from '@/pages/user/UserLoginPage.vue'
import UserRegisterPage from '@/pages/user/UserRegisterPage.vue'
import UserManagePage from '@/pages/admin/UserManagePage.vue'
import ResourceReviewPage from '@/pages/admin/ResourceReviewPage.vue'
import UserEditPage from '@/pages/user/UserEditPage.vue'
import UserUploadStatus from '@/pages/user/UserUploadStatus.vue'
import NoAuth from '@/pages/NoAuth.vue'
import ACCESS_ENUM from '@/access/accessEnum.ts'
import AddMusicFilePage from '@/pages/AddMusicFilePage.vue'
import MusicPage from '@/pages/musicPage.vue'
import SearchedMusicPage from '@/pages/searchedMusicPage.vue'
import MusicDetailPage from '@/pages/MusicDetailPage.vue'
import UserAvatarUploadPage from '@/pages/user/UserAvatarUploadPage.vue'


const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: '入口页面',
      component: LandingPage,
      meta: {
        access: ACCESS_ENUM.NOT_LOGIN,
      },
    },
    {
      path: '/home',
      name: '主页',
      component: HomePage,
      meta: {
        access: ACCESS_ENUM.NOT_LOGIN,
      },
    },
    {
      path: '/user/login',
      name: '用户登录',
      component: UserLoginPage,
      meta: {
        access: ACCESS_ENUM.NOT_LOGIN,
      },
    },
    {
      path: '/user/register',
      name: '用户注册',
      component: UserRegisterPage,
      meta: {
        access: ACCESS_ENUM.NOT_LOGIN,
      },
    },
    {
      path: '/admin/userManage',
      name: '用户管理',
      component: UserManagePage,
      meta: {
        access: ACCESS_ENUM.ADMIN,
      },
    },
    {
      path: '/admin/resourceReview',
      name: '资源审核',
      component: ResourceReviewPage,
      meta: {
        access: ACCESS_ENUM.ADMIN,
      },
    },
    {
      path: '/user/edit',
      name: '个人信息',
      component: UserEditPage,
      meta: {
        access: ACCESS_ENUM.USER,
      },
    },
    {
      path: '/user/uploads',
      name: '我的上传',
      component: UserUploadStatus,
      meta: {
        access: ACCESS_ENUM.USER,
      },
    },
    {
      path: '/noAuth',
      name: '无权限',
      component: NoAuth,
      meta: {
        access: ACCESS_ENUM.NOT_LOGIN,
      },
    },
    {
      path: '/add_musicFile',
      name: '创建音乐文件',
      component: AddMusicFilePage,
      meta: {
        access: ACCESS_ENUM.NOT_LOGIN,
      },
    },
    {
      path: '/music',
      name: '音乐列表',
      component: MusicPage,
      meta: {
        access: ACCESS_ENUM.NOT_LOGIN,
      },
    },
    {
      path: '/search',
      name: '搜索结果',
      component: SearchedMusicPage,
      meta: {
        access: ACCESS_ENUM.NOT_LOGIN,
      },
    },
    {
      path: '/music/detail/:id',
      name: '音乐详情',
      component: MusicDetailPage,
      meta: {
        access: ACCESS_ENUM.NOT_LOGIN,
      },
    },
    {
      path: '/user/upload-avatar',
      name: '上传头像',
      component: UserAvatarUploadPage,
      meta: {
        access: ACCESS_ENUM.NOT_LOGIN,
      },
    },
  ],
})

export default router
