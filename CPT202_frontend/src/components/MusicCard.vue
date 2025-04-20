<template>
  <div class="music-card-component">
    <div v-if="loading" class="loading-container">Loading...</div>
    <div v-else-if="detail" class="music-card">
      <!-- 音乐封面图部分 -->
      <div class="cover-container">
        <img :src="detail.coverUrl" alt="Cover" class="cover" />
        
        <!-- 播放状态覆盖图标 -->
        <div v-if="isCurrentlyPlaying" class="playing-indicator">
          <div class="playing-icon">▶</div>
        </div>
      </div>
      
      <!-- 信息部分 -->
      <div class="music-info">
        <h3 class="music-title">{{ detail.name }}</h3>
        <p class="music-artist">{{ detail.artist || '未知艺术家' }}</p>
      </div>
      
      <!-- 播放按钮部分 -->
      <div class="action-buttons">
        <a-button 
          @click="handlePlay" 
          type="primary"
          :class="{ 'playing-button': isCurrentlyPlaying }">
          <template #icon>
            <play-circle-outlined v-if="!isCurrentlyPlaying" />
            <pause-circle-outlined v-else />
          </template>
          {{ isCurrentlyPlaying ? '播放中' : '播放' }}
        </a-button>
      </div>
    
    </div>
    <div v-else class="error-container">No data available</div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { message } from 'ant-design-vue';
import { PlayCircleOutlined, PauseCircleOutlined } from '@ant-design/icons-vue';
import { getMusicFileByIdUsingGet } from '@/api/musicFileController'
import { currentMusic, playMusic, isPlaying } from '@/utils/audioPlayerStore'
import bus from '@/utils/eventBus'

interface MusicDetail {
  id: number | string;
  name: string;
  artist?: string;
  coverUrl?: string;
  url?: string;
}

const props = defineProps<{ id: number }>();
const detail = ref<MusicDetail | null>(null);
const loading = ref(true);
const showDebug = ref(true); // 设置为false可隐藏调试信息

// 计算当前卡片是否正在播放
const isCurrentlyPlaying = computed(() => {
  return isPlaying.value && String(currentMusic.id) === String(props.id);
});

// 截断长URL用于显示
const truncateUrl = (url?: string) => {
  if (!url) return '';
  return url.length > 40 ? url.substring(0, 40) + '...' : url;
};

// 测试事件总线
const testEventBus = () => {
  console.log('发送测试事件...');
  bus.emit('test', { message: '从MusicCard发送的测试' });
  message.info('已发送测试事件，请查看控制台');
};

const fetchDetail = async () => {
  try {
    console.log(`获取ID为${props.id}的音乐详情...`);
    const res = await getMusicFileByIdUsingGet({ id: props.id });
    console.log('API响应:', res);
    
    if (res.data.code === 0 && res.data.data) {
      detail.value = res.data.data;
      console.log('音乐详情:', detail.value);
      
      // 检查URL
      if (!detail.value.url) {
        console.warn('警告: 音乐URL为空');
      } else {
        console.log('音乐URL:', detail.value.url);
      }
    } else {
      console.error('获取详情失败:', res.data.message);
      message.error(res.data.message || '加载详情失败');
    }
  } catch (err: any) {
    console.error('获取详情出错:', err);
    message.error('错误: ' + err.message);
  } finally {
    loading.value = false;
  }
};

onMounted(fetchDetail);

// 处理播放事件
const handlePlay = () => {
  console.log('播放按钮被点击');
  
  if (!detail.value) {
    console.error('错误: 没有音乐详情数据');
    message.error('没有可播放的音乐数据');
    return;
  }
  
  if (!detail.value.url) {
    console.error('错误: 音乐URL为空');
    message.error('音乐URL不存在，无法播放');
    return;
  }
  
  console.log('准备播放音乐:', detail.value.name);
  
  // 调用全局播放函数
  const success = playMusic({
    id: detail.value.id,
    name: detail.value.name,
    artist: detail.value.artist,
    coverUrl: detail.value.coverUrl,
    url: detail.value.url
  });
  
  if (success) {
    console.log('播放成功:', detail.value.name);
    message.success(`正在播放: ${detail.value.name}`);
  } else {
    console.error('播放失败:', detail.value.name);
    message.error('播放失败，请重试');
  }
};
</script>

<style scoped>
.music-card-component {
  width: 100%;
  margin-bottom: 20px;
}

.loading-container,
.error-container {
  padding: 20px;
  text-align: center;
  color: #888;
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

.cover-container {
  position: relative;
  width: 100%;
  padding-top: 100%; /* Maintains aspect ratio */
  overflow: hidden;
  background-color: #f0f0f0;
}

.cover {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.playing-indicator {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.3);
  display: flex;
  align-items: center;
  justify-content: center;
}

.playing-icon {
  font-size: 48px;
  color: white;
  opacity: 0.8;
}

.music-info {
  padding: 12px;
  text-align: left;
}

.music-title {
  margin: 5px 0;
  font-size: 16px;
  font-weight: 600;
  color: #333;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.music-artist {
  margin: 0;
  font-size: 14px;
  color: #666;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.action-buttons {
  padding: 0 12px 12px;
  text-align: center;
}

.playing-button {
  background-color: #1890ff;
  color: white;
}

.debug-info {
  margin-top: 10px;
  padding: 5px;
  background: #f0f0f0;
  border-radius: 4px;
  font-size: 12px;
}

.debug-info p {
  margin: 2px 0;
  word-break: break-all;
}

.debug-info button {
  background: #4e89ff;
  color: white;
  border: none;
  padding: 3px 8px;
  border-radius: 3px;
  margin-top: 5px;
  cursor: pointer;
}
</style>
