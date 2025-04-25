import { defineStore } from 'pinia'

export const useMusicStore = defineStore('music', {
  state: () => ({
    currentMusic: null,
    customCategories: [],  // 存储用户自定义类别
    customTags: [],       // 存储用户自定义标签
  }),
  actions: {
    setCurrentMusic(music) {
      this.currentMusic = music
    },
    // 添加自定义类别
    addCustomCategory(category) {
      if (!this.customCategories.includes(category)) {
        this.customCategories.push(category)
        // 保存到本地存储
        localStorage.setItem('customCategories', JSON.stringify(this.customCategories))
      }
    },
    // 删除自定义类别
    removeCustomCategory(category) {
      this.customCategories = this.customCategories.filter(item => item !== category)
      // 更新本地存储
      localStorage.setItem('customCategories', JSON.stringify(this.customCategories))
    },
    // 初始化自定义类别（从本地存储加载）
    initCustomCategories() {
      const savedCategories = localStorage.getItem('customCategories')
      if (savedCategories) {
        this.customCategories = JSON.parse(savedCategories)
      }
    },
    
    // 添加自定义标签
    addCustomTag(tag) {
      if (!this.customTags.includes(tag)) {
        this.customTags.push(tag)
        // 保存到本地存储
        localStorage.setItem('customTags', JSON.stringify(this.customTags))
      }
    },
    // 删除自定义标签
    removeCustomTag(tag) {
      this.customTags = this.customTags.filter(item => item !== tag)
      // 更新本地存储
      localStorage.setItem('customTags', JSON.stringify(this.customTags))
    },
    // 初始化自定义标签（从本地存储加载）
    initCustomTags() {
      const savedTags = localStorage.getItem('customTags')
      if (savedTags) {
        this.customTags = JSON.parse(savedTags)
      }
    },
  },
})
