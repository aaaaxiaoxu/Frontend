<template>
  <div class="music-card-component">
    <div v-if="loading" class="loading-state">加载中...</div>
    <div v-else-if="error" class="error-state">加载失败</div>
    <div v-else class="music-card">
      <!-- 主图片部分 -->
      <div class="cover-image">
        <img :src="musicData.coverUrl || defaultCover" alt="音乐封面" />
      </div>
      
      <!-- 音乐信息部分 -->
      <div class="music-info">
        <h3 class="music-title">{{ musicData.name }}</h3>
        <div class="tags-container">
          <a-tag v-if="musicData.year" class="year-tag">{{ musicData.year }}</a-tag>
          <a-tag v-if="musicData.category" class="category-tag">{{ musicData.category }}</a-tag>
          <a-tag v-if="musicData.language" class="language-tag">{{ musicData.language }}</a-tag>
          <a-tag v-if="musicData.isInstrumental" class="instrumental-tag">Instrumental</a-tag>
        </div>
        <!-- 用户头像 -->
        <div class="users-container" v-if="users.length">
          <a-avatar 
            v-for="(user, index) in users" 
            :key="index" 
            :src="user.avatar" 
            size="small"
            class="user-avatar"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { defineProps, ref, onMounted, computed } from 'vue';
import { Tag as ATag, Avatar as AAvatar } from 'ant-design-vue';
import { getMusicFileByIdUsingGet } from '@/api/musicFileController';

const props = defineProps({
  musicId: {
    type: Number,
    required: true
  }
});

const loading = ref(true);
const error = ref(false);
const musicData = ref<any>({});
const defaultCover = 'https://via.placeholder.com/300x180?text=无封面';

const users = computed(() => {
  if (!musicData.value || !musicData.value.createUser) return [];
  
  return [{
    name: musicData.value.createUser.userName || '未知用户',
    avatar: musicData.value.createUser.userAvatar || 'https://via.placeholder.com/40?text=U'
  }];
});

onMounted(async () => {
  try {
    const response = await getMusicFileByIdUsingGet({
      id: props.musicId
    });
    
    if (response && response.data) {
      musicData.value = response.data;
    } else {
      error.value = true;
    }
  } catch (err) {
    console.error('获取音乐文件信息失败', err);
    error.value = true;
  } finally {
    loading.value = false;
  }
});
</script>

<style scoped>
.music-card-component {
  width: 100%;
  margin-bottom: 20px;
}

.music-card {
  background-color: #fff;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  overflow: hidden;
  position: relative;
  transition: transform 0.3s, box-shadow 0.3s;
}

.music-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

.cover-image {
  width: 100%;
  height: 180px;
  overflow: hidden;
}

.cover-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.3s;
}

.music-card:hover .cover-image img {
  transform: scale(1.05);
}

.music-info {
  padding: 15px;
}

.music-title {
  margin: 0 0 10px 0;
  font-size: 16px;
  font-weight: 600;
  color: #333;
}

.tags-container {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
  margin-bottom: 12px;
}

.year-tag {
  background-color: #ffe6e6 !important;
  border-color: #ffcccc !important;
  color: #ff6666 !important;
}

.category-tag {
  background-color: #e6f7ff !important;
  border-color: #bae7ff !important;
  color: #1890ff !important;
}

.language-tag {
  background-color: #f6ffed !important;
  border-color: #b7eb8f !important;
  color: #52c41a !important;
}

.instrumental-tag {
  background-color: #fff7e6 !important;
  border-color: #ffd591 !important;
  color: #fa8c16 !important;
}

.users-container {
  display: flex;
  gap: 5px;
  margin-top: 10px;
}

.user-avatar {
  border: 2px solid white;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

.loading-state, .error-state {
  padding: 20px;
  border-radius: 12px;
  text-align: center;
  background-color: #f9f9f9;
  margin-bottom: 20px;
}

.error-state {
  color: #ff4d4f;
}
</style>