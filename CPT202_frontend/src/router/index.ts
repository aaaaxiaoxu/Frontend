import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import HomePage from '@/pages/HomePage.vue'
import UserLoginPage from '@/pages/user/UserLoginPage.vue'
import UserRegisterPage from '@/pages/user/UserRegisterPage.vue'
import UserManagePage from '@/pages/admin/UserManagePage.vue'
import UserEditPage from '@/pages/user/UserEditPage.vue'
import NoAuth from '@/pages/NoAuth.vue'
import ACCESS_ENUM from '@/access/accessEnum.ts'
import AddMusicFilePage from '@/pages/AddMusicFilePage.vue'
import MusicPage from '@/pages/musicPage.vue'
import SearchedMusicPage from '@/pages/searchedMusicPage.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
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
      path: '/user/edit',
      name: '个人信息',
      component: UserEditPage,
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
      path: '/',
      name: 'home',
      component: HomePage,
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
      path: '/about',
      name: 'about',
      // route level code-splitting
      // this generates a separate chunk (About.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () => import('../views/AboutView.vue'),
      meta: {
        access: ACCESS_ENUM.NOT_LOGIN,
      },
    },
  ],
})

export default router
