<template>
  <div id="basicLayout">
    <a-layout style="min-height: 100vh" class="main-layout">
      <a-layout-header class="header" v-if="!isUserPage">
        <GlobalHeader />
      </a-layout-header>

      <a-layout-content class="content">
        <router-view />
      </a-layout-content>
      <PlayerBar />
      <a-layout-footer class="footer"> MelodyHub </a-layout-footer>
    </a-layout>
  </div>
</template>

<script setup lang="ts">
import GlobalHeader from '@/components/Globalheader.vue'
import PlayerBar from '@/components/PlayerBar.vue'
import { computed, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { useThemeStore } from '@/stores/useThemeStore'

const route = useRoute()
const themeStore = useThemeStore()

// 组件挂载时初始化主题
onMounted(() => {
  themeStore.initTheme()
})

// Only hide navigation on user pages
const isUserPage = computed(() => {
  const path = route.path
  return path.includes('/user/')
})
</script>

<style scoped>
#basicLayout {
  background-color: var(--color-background);
  transition: background-color 0.3s;
}

#basicLayout .main-layout {
  background-color: var(--color-background);
  transition: background-color 0.3s;
}

#basicLayout .footer {
  background: var(--color-card-background);
  color: var(--color-text-primary);
  padding: 16px;
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  text-align: center;
  z-index: 99;
  transition: background-color 0.3s, color 0.3s;
}

#basicLayout .content {
  background: var(--color-background);
  margin-bottom: 60px;
  padding: 20px;
  transition: background-color 0.3s;
}

#basicLayout .header {
  padding-inline: 20px;
  margin-bottom: 0;
  color: var(--color-text-primary);
  background: var(--color-header-background);
  transition: background-color 0.3s, color 0.3s;
}
</style>
