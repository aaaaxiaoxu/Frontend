import { ref, computed } from 'vue'
import { defineStore } from 'pinia'
import { getLoginUserUsingGet } from '@/api/userController.ts'
import LoginUserVO = API.LoginUserVO

/**
 * 存储登录用户信息的状态 这里一个store就是一个状态
 */
export const useLoginUserStore = defineStore('loginUser', () => {
  const loginUser = ref<LoginUserVO>({
    userName: '未登录',
  })

  /**
   * 远程获取用户
   */
  async function fetchLoginUser() {
    const res = await getLoginUserUsingGet()
    if (res.data.code === 0 && res.data.data) {
      loginUser.value = res.data.data
    }
  }

  // 设置登录用户
  function setLoginUser(newloginUser: any) {
    loginUser.value = newloginUser
  }

  return { loginUser, fetchLoginUser, setLoginUser }
})
