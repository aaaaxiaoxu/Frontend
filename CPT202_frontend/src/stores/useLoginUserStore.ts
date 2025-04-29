import { ref, computed } from 'vue'
import { defineStore } from 'pinia'
import { getLoginUserUsingGet } from '@/api/userController.ts'
import LoginUserVO = API.LoginUserVO

/**
 * Store for logged-in user information - each store represents a state
 */
export const useLoginUserStore = defineStore('loginUser', () => {
  const loginUser = ref<LoginUserVO>({
    userName: 'Not logged in',
  })

  /**
   * Fetch user remotely
   */
  async function fetchLoginUser() {
    const res = await getLoginUserUsingGet()
    if (res.data.code === 0 && res.data.data) {
      loginUser.value = res.data.data
    }
  }

  // Set logged-in user
  function setLoginUser(newloginUser: any) {
    loginUser.value = newloginUser
  }

  return { loginUser, fetchLoginUser, setLoginUser }
})
