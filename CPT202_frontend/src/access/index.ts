import router from '@/router'
import { useLoginUserStore } from '@/stores/useLoginUserStore'
import ACCESS_ENUM from './accessEnum'
import checkAccess from './checkAccess'

router.beforeEach(async (to, from, next) => {
  const loginUserStore = useLoginUserStore()
  let loginUser = loginUserStore.loginUser
  console.log('User login information', loginUser)

  // If not logged in before, auto login
  if (!loginUser || !loginUser.userRole) {
    // Adding await to ensure that subsequent code executes after user login is successful
    await loginUserStore.fetchLoginUser()
    loginUser = loginUserStore.loginUser
  }

  const needAccess = (to.meta?.access as string) ?? ACCESS_ENUM.NOT_LOGIN
  // The page to navigate to requires login
  if (needAccess !== ACCESS_ENUM.NOT_LOGIN) {
    // If not logged in, redirect to login page
    if (!loginUser || !loginUser.userRole || loginUser.userRole === ACCESS_ENUM.NOT_LOGIN) {
      next(`/user/login?redirect=${to.fullPath}`)
      return
    }
    // If already logged in but insufficient permissions, redirect to no authorization page
    if (!checkAccess(loginUser, needAccess)) {
      next('/noAuth')
      return
    }
  }
  next()
})
