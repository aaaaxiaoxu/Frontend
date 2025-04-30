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
      name: 'Landing Page',
      component: LandingPage,
      meta: {
        access: ACCESS_ENUM.NOT_LOGIN,
      },
    },
    {
      path: '/home',
      name: 'Home Page',
      component: HomePage,
      meta: {
        access: ACCESS_ENUM.NOT_LOGIN,
      },
    },
    {
      path: '/user/login',
      name: 'UserLogin',
      component: UserLoginPage,
      meta: {
        access: ACCESS_ENUM.NOT_LOGIN,
      },
    },
    {
      path: '/user/register',
      name: 'UserRegister',
      component: UserRegisterPage,
      meta: {
        access: ACCESS_ENUM.NOT_LOGIN,
      },
    },
    {
      path: '/admin/userManage',
      name: 'UserManagement',
      component: UserManagePage,
      meta: {
        access: ACCESS_ENUM.ADMIN,
      },
    },
    {
      path: '/admin/resourceReview',
      name: 'ResourceReview',
      component: ResourceReviewPage,
      meta: {
        access: ACCESS_ENUM.ADMIN,
      },
    },
    {
      path: '/user/edit',
      name: 'PersonalInformation',
      component: UserEditPage,
      meta: {
        access: ACCESS_ENUM.USER,
      },
    },
    {
      path: '/user/uploads',
      name: 'Myupload',
      component: UserUploadStatus,
      meta: {
        access: ACCESS_ENUM.USER,
      },
    },
    {
      path: '/noAuth',
      name: 'NoAuth',
      component: NoAuth,
      meta: {
        access: ACCESS_ENUM.NOT_LOGIN,
      },
    },
    {
      path: '/add_musicFile',
      name: 'CreatMusicFile',
      component: AddMusicFilePage,
      meta: {
        access: ACCESS_ENUM.NOT_LOGIN,
      },
    },
    {
      path: '/music',
      name: 'MusicList',
      component: MusicPage,
      meta: {
        access: ACCESS_ENUM.NOT_LOGIN,
      },
    },
    {
      path: '/search',
      name: 'SearchResult',
      component: SearchedMusicPage,
      meta: {
        access: ACCESS_ENUM.NOT_LOGIN,
      },
    },
    {
      path: '/music/detail/:id',
      name: 'MusicDetail',
      component: MusicDetailPage,
      meta: {
        access: ACCESS_ENUM.NOT_LOGIN,
      },
    },
    {
      path: '/user/upload-avatar',
      name: 'UploadAvatar',
      component: UserAvatarUploadPage,
      meta: {
        access: ACCESS_ENUM.NOT_LOGIN,
      },
    },
  ],
})

export default router
