<template>
  <div id="emptyLayout">
    <a-layout style="min-height: 100vh">
      <a-layout-content class="content">
        <router-view />
      </a-layout-content>
    </a-layout>
  </div>
</template>

<script setup lang="ts">
</script>

<style scoped>
#emptyLayout .content {
  height: 100vh;
  padding: 0;
  margin: 0;
}
</style>