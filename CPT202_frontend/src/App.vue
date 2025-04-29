<template>
  <div id="app">
    <EmptyLayout v-if="shouldUseEmptyLayout" />
    <BasicLayout v-else />
  </div>
</template>

<script setup lang="ts">

import { computed } from 'vue'
import { useRoute } from 'vue-router'
import BasicLayout from '@/layouts/BasicLayout.vue'
import EmptyLayout from '@/layouts/EmptyLayout.vue'


const route = useRoute()

// Determine if you should use an empty layout (no navigation bar)
const shouldUseEmptyLayout = computed(() => {
  return route.path === '/'
})
</script>

<style scoped></style>
