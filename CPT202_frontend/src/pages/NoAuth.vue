<template>
  <div class="no-auth-container">
    <a-result status="403" title="403" sub-title="Sorry, you do not have access to this page">
      <template #extra>
        <a-button type="primary" @click="goHome"> back homepage </a-button>
      </template>
    </a-result>
  </div>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router'

const router = useRouter()

const goHome = () => {
  router.push('/')
}
</script>

<style scoped>
.no-auth-container {
  padding: 48px;
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: calc(100vh - 200px);
}
</style>
