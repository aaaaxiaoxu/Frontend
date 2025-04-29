<template>
  <div id="add_musicFile">
    <MusicFileUpload />
  </div>
</template>

<script lang="ts">
import MusicFileUpload from '@/components/MusicFileUpload.vue'

export default {
  name: 'AddMusicFilePage',
  components: {
    MusicFileUpload
  }
}
</script>

<style scoped>
#add_musicFile {
  display: flex;
}
</style>
