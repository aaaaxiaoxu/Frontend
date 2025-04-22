import { defineStore } from 'pinia'

export const useMusicStore = defineStore('music', {
  state: () => ({
    currentMusic: null,
  }),
  actions: {
    setCurrentMusic(music) {
      this.currentMusic = music
    },
  },
})
