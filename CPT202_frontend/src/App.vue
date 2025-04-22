<template>
  <div id="app">
    <EmptyLayout v-if="shouldUseEmptyLayout" />
    <BasicLayout v-else />
  </div>
</template>

<script setup lang="ts">
import { RouterLink, RouterView } from 'vue-router'
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import HelloWorld from './components/HelloWorld.vue'
import BasicLayout from '@/layouts/BasicLayout.vue'
import EmptyLayout from '@/layouts/EmptyLayout.vue'
// import { healthUsingGet } from '@/api/mainController.ts'
// import { useLoginUserStore } from '@/stores/useLoginUserStore.ts'

//已经改为在权限校验文件当中获取
// const loginUserStore = useLoginUserStore()
// loginUserStore.fetchLoginUser()
//
//
// healthUsingGet().then(res => {
//   console.log(res)
// })

const route = useRoute()

// 判断是否应该使用空布局（没有导航栏）
const shouldUseEmptyLayout = computed(() => {
  return route.path === '/'
})
</script>

<style scoped></style>
