import { defineStore } from 'pinia'

export const useMusicStore = defineStore('music', {
  state: () => ({
    currentMusic: null,
    customCategories: [],  // Store user-defined categories
    customTags: [],       // Store user-defined tags
  }),
  actions: {
    setCurrentMusic(music) {
      this.currentMusic = music
    },
    // Add custom category
    addCustomCategory(category) {
      if (!this.customCategories.includes(category)) {
        this.customCategories.push(category)
        // Save to local storage
        localStorage.setItem('customCategories', JSON.stringify(this.customCategories))
      }
    },
    // Remove custom category
    removeCustomCategory(category) {
      this.customCategories = this.customCategories.filter(item => item !== category)
      // Update local storage
      localStorage.setItem('customCategories', JSON.stringify(this.customCategories))
    },
    // Update custom category
    updateCustomCategory(oldCategory, newCategory) {
      if (oldCategory !== newCategory && !this.customCategories.includes(newCategory)) {
        const index = this.customCategories.indexOf(oldCategory)
        if (index !== -1) {
          this.customCategories[index] = newCategory
          // Update local storage
          localStorage.setItem('customCategories', JSON.stringify(this.customCategories))
          return true
        }
      }
      return false
    },
    // Initialize custom categories (load from local storage)
    initCustomCategories() {
      const savedCategories = localStorage.getItem('customCategories')
      if (savedCategories) {
        this.customCategories = JSON.parse(savedCategories)
      }
    },
    
    // Add custom tag
    addCustomTag(tag) {
      if (!this.customTags.includes(tag)) {
        this.customTags.push(tag)
        // Save to local storage
        localStorage.setItem('customTags', JSON.stringify(this.customTags))
      }
    },
    // Remove custom tag
    removeCustomTag(tag) {
      this.customTags = this.customTags.filter(item => item !== tag)
      // Update local storage
      localStorage.setItem('customTags', JSON.stringify(this.customTags))
    },
    // Update custom tag
    updateCustomTag(oldTag, newTag) {
      if (oldTag !== newTag && !this.customTags.includes(newTag)) {
        const index = this.customTags.indexOf(oldTag)
        if (index !== -1) {
          this.customTags[index] = newTag
          // Update local storage
          localStorage.setItem('customTags', JSON.stringify(this.customTags))
          return true
        }
      }
      return false
    },
    // Initialize custom tags (load from local storage)
    initCustomTags() {
      const savedTags = localStorage.getItem('customTags')
      if (savedTags) {
        this.customTags = JSON.parse(savedTags)
      }
    },
  },
})
