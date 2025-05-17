import { defineStore } from 'pinia'
import { ref } from 'vue'
import { useRouter } from 'vue-router'

export const useThemeStore = defineStore('theme', () => {
  // 定义当前主题状态，从本地存储获取或默认为light
  const theme = ref(localStorage.getItem('theme') || 'light')
  
  // 切换主题方法
  function toggleTheme() {
    theme.value = theme.value === 'light' ? 'dark' : 'light'
    // 保存到本地存储
    localStorage.setItem('theme', theme.value)
    // 更新文档根元素的data-theme属性
    document.documentElement.setAttribute('data-theme', theme.value)
  }
  
  // 初始化主题方法
  function initTheme() {
    // 检查当前页面路径
    const path = window.location.pathname
    // 如果是登录或注册页面，不应用暗色主题
    if (path.includes('/user/login') || path.includes('/user/register')) {
      document.documentElement.setAttribute('data-theme', 'light')
    } else {
      // 将主题应用到文档根元素
      document.documentElement.setAttribute('data-theme', theme.value)
    }
  }

  return { theme, toggleTheme, initTheme }
}) 