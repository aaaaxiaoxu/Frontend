<template>
  <div class="player-bar" v-if="currentMusic.url">
    <div class="player-info">
      <img :src="currentMusic.coverUrl || defaultCover" alt="cover" class="cover" />
      <div class="info">
        <div class="title">{{ currentMusic.name }}</div>
        <div class="artist">{{ currentMusic.artist || '未知艺术家' }}</div>
      </div>
    </div>
    
    <div class="controls">
      <button @click="togglePlay" class="play-button">
        {{ isPlaying ? '⏸️' : '▶️' }}
      </button>
    </div>
    
    <div class="progress-bar-container">
      <input
        type="range"
        min="0"
        :max="duration || 100"
        :value="currentTime"
        @input="handleSeek"
        class="progress-bar"
      />
      <span class="time-info">{{ formatTime(currentTime) }} / {{ formatTime(duration) }}</span>
    </div>
    
    <div class="volume-control">
      <button @click="toggleMute" class="volume-button">
        {{ isMuted ? '🔇' : '🔊' }}
      </button>
      <input
        type="range"
        min="0"
        max="1"
        step="0.01"
        :value="volume"
        @input="handleVolumeChange"
        class="volume-slider"
      />
      <span class="volume-percentage">{{ Math.round(volume * 100) }}%</span>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { 
  currentMusic, 
  isPlaying, 
  currentTime, 
  duration, 
  volume,
  togglePlay, 
  seekTo, 
  setVolume, 
  formatTime
} from '@/utils/audioPlayerStore';

const defaultCover = 'https://via.placeholder.com/300';
const isMuted = ref(false);
const previousVolume = ref(volume.value);

// 处理进度条拖动
const handleSeek = (e: Event) => {
  const target = e.target as HTMLInputElement;
  seekTo(Number(target.value));
};

// 处理音量调节
const handleVolumeChange = (e: Event) => {
  const target = e.target as HTMLInputElement;
  const newVolume = Number(target.value);
  setVolume(newVolume);
  
  if (newVolume > 0) {
    previousVolume.value = newVolume;
    if (isMuted.value) {
      isMuted.value = false;
    }
  } else if (newVolume === 0) {
    isMuted.value = true;
  }
};

// 切换静音
const toggleMute = () => {
  if (isMuted.value) {
    // 恢复音量
    setVolume(previousVolume.value > 0 ? previousVolume.value : 0.5);
    isMuted.value = false;
  } else {
    // 静音前保存当前音量
    previousVolume.value = volume.value;
    setVolume(0);
    isMuted.value = true;
  }
};
</script>

<style scoped>
.player-bar {
  position: fixed;
  bottom: 0;
  left: 0;
  width: 100%;
  background-color: #fff;
  padding: 10px 20px;
  display: flex;
  align-items: center;
  box-shadow: 0 -2px 10px rgba(0, 0, 0, 0.1);
  z-index: 999;
}

.player-info {
  display: flex;
  align-items: center;
  width: 250px;
}

.cover {
  width: 40px;
  height: 40px;
  object-fit: cover;
  border-radius: 4px;
  margin-right: 10px;
}

.info {
  flex: 1;
  overflow: hidden;
}

.title {
  font-weight: bold;
  font-size: 14px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.artist {
  font-size: 12px;
  color: #888;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.controls {
  margin: 0 15px;
}

.play-button, .volume-button {
  background: none;
  border: none;
  font-size: 24px;
  cursor: pointer;
  color: #4e89ff;
  padding: 0;
}

.progress-bar-container {
  flex: 1;
  display: flex;
  align-items: center;
  margin: 0 15px;
}

.progress-bar {
  flex: 1;
  height: 4px;
  margin-right: 10px;
}

.time-info {
  font-size: 12px;
  color: #888;
  width: 90px;
  text-align: center;
}

.volume-control {
  display: flex;
  align-items: center;
  width: 150px;
}

.volume-slider {
  width: 80px;
  margin: 0 10px;
}

.volume-percentage {
  font-size: 12px;
  color: #888;
  width: 35px;
}
</style>
