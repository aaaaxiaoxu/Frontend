<template>
  <div class="music-card-component">
    <div class="music-card">
      <!-- 波形图部分 -->
      <div class="waveform-container">
        <div class="music-note-icon">
          <span class="music-note">♫</span>
        </div>
        <div class="waveform-image">
          <img 
            src="https://img.picui.cn/free/2025/04/16/67ffc996a79ef.png" 
            alt="波形图"
            class="waveform"
          />
        </div>
        <div class="controls">
          <span class="control-icon">◀◀</span>
          <span class="control-icon">▶</span>
          <span class="control-icon">▶▶</span>
        </div>
      </div>
      
      <!-- 音乐可视化部分 -->
      <div class="visualization-container">
        <!-- 这部分是音乐可视化的示意图，实际应用中可能需要Canvas或其他技术 -->
        <div class="track-lines">
          <div v-for="i in 6" :key="i" class="track-line" 
            :style="{width: `${Math.random() * 40 + 40}%`, opacity: Math.random() * 0.5 + 0.5}"></div>
        </div>
      </div>
      
      <!-- 底部信息部分 -->
      <div class="music-info">
        <h3 class="music-title">{{ name }}</h3>
        <div class="tags-container">
          <a-tag v-if="year" class="year-tag">{{ year }}</a-tag>
          <a-tag v-if="category" class="category-tag">{{ category }}</a-tag>
          <a-tag v-if="language" class="language-tag">{{ language }}</a-tag>
          <a-tag v-if="isInstrumental" class="instrumental-tag">Instrumental</a-tag>
        </div>
        <div class="users-container" v-if="users && users.length">
          <a-avatar 
            v-for="(user, index) in users" 
            :key="index" 
            :src="user.avatar" 
            size="small"
            class="user-avatar"
          />
        </div>
      </div>
      
      <!-- 蓝色按钮 -->
      <div class="blue-button">
        <span>c</span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { defineProps } from 'vue';
import { Tag as ATag, Avatar as AAvatar } from 'ant-design-vue';

const props = defineProps({
  id: Number,
  name: {
    type: String,
    default: 'Summer Vibes Mix'
  },
  year: {
    type: String,
    default: '1990s'
  },
  category: {
    type: String,
    default: 'Mood'
  },
  language: {
    type: String,
    default: 'English'
  },
  isInstrumental: {
    type: Boolean,
    default: false
  },
  users: {
    type: Array as () => { name: string; avatar: string }[],
    default: () => [
      { name: 'User 1', avatar: 'https://randomuser.me/api/portraits/men/1.jpg' },
      { name: 'User 2', avatar: 'https://randomuser.me/api/portraits/men/2.jpg' }
    ]
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
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  overflow: hidden;
  position: relative;
  transition: transform 0.3s, box-shadow 0.3s;
}

.music-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

.waveform-container {
  background-color: #f0f8ff;
  padding: 8px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  border-bottom: 1px solid #e6e6e6;
}

.music-note-icon {
  width: 30px;
  height: 30px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #4e89ff;
  font-size: 18px;
}

.waveform-image {
  flex: 1;
  height: 30px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.waveform {
  width: 100%;
  height: 20px;
  object-fit: contain;
}

.controls {
  display: flex;
  gap: 8px;
  color: #666;
  font-size: 12px;
}

.control-icon {
  cursor: pointer;
}

.visualization-container {
  background-color: #f9f9f9;
  padding: 15px;
  border-bottom: 1px solid #e6e6e6;
}

.track-lines {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.track-line {
  height: 6px;
  background-color: #4e89ff;
  border-radius: 3px;
}

.music-info {
  padding: 12px;
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
  margin-bottom: 10px;
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

.blue-button {
  position: absolute;
  bottom: 10px;
  left: 10px;
  width: 24px;
  height: 24px;
  background-color: #4e89ff;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 14px;
  cursor: pointer;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
}
</style>