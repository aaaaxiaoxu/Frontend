<template>
  <div id="app">
    <BasicLayout />
  </div>
</template>

<script setup lang="ts">
import { RouterLink, RouterView } from 'vue-router'
import HelloWorld from './components/HelloWorld.vue'
import BasicLayout from '@/layouts/BasicLayout.vue'
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
</script>

<style scoped></style>
