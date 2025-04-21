<template>
  <div class="music-card-component">
    <div v-if="loading" class="loading-container">Loading...</div>
    <div v-else-if="detail" class="music-card">
      <!-- 音乐封面图部分 - 缩小比例 -->
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
        <!-- 显示标签 -->
        <div class="tags-container">
          <span v-if="!parsedTags.length" class="no-tags">无标签</span>
          <span v-else v-for="tag in parsedTags" :key="tag" class="tag-item">{{ tag }}</span>
        </div>
      </div>

      <!-- 底部区域：上传者信息和播放按钮 -->
      <div class="card-footer">
        <!-- 上传者信息 -->
        <div class="uploader-info">
          <div class="avatar">
            <img :src="userInfo.userAvatar || 'https://via.placeholder.com/40'" alt="User" />
          </div>
          <div class="uploader-name">{{ userInfo.userName || '无名' }}</div>
        </div>

        <!-- 播放按钮 -->
        <div class="play-button-container">
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
    </div>
    <div v-else class="error-container">No data available</div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { message } from 'ant-design-vue';
import { PlayCircleOutlined, PauseCircleOutlined } from '@ant-design/icons-vue';
import { getMusicFileByIdUsingGet } from '@/api/musicFileController'
import { getUserByIdUsingGet } from '@/api/userController'
import { currentMusic, playMusic, isPlaying } from '@/utils/audioPlayerStore'
import bus from '@/utils/eventBus'

interface MusicDetail {
  id: number | string;
  name: string;
  artist?: string;
  coverUrl?: string;
  url?: string;
  category?: string;
  userId?: number;
  tags?: string[];
}

interface UserInfo {
  userId?: number;
  userName?: string;
  userAvatar?: string;
}

const props = defineProps<{ id: number }>();
const detail = ref<MusicDetail | null>(null);
const userInfo = ref<UserInfo>({
  userName: '无名',
  userAvatar: 'https://via.placeholder.com/40'
});
const loading = ref(true);
const showDebug = ref(false);

// 计算当前卡片是否正在播放
const isCurrentlyPlaying = computed(() => {
  return isPlaying.value && String(currentMusic.id) === String(props.id);
});

// 获取类别对应的CSS类名
// const getCategoryClass = (category?: string) => {
//   if (!category) return 'default';
//
//   const categoryMap: {[key: string]: string} = {
//     'Pop': 'pop',
//     'Rock': 'rock',
//     'Electronic': 'electronic',
//     'Jazz': 'jazz',
//     'Indie': 'indie',
//     'Classical': 'classical',
//     'R&B': 'rnb'
//   };
//
//   return categoryMap[category] || 'default';
// };

// 获取用户信息
const fetchUserInfo = async (userId: number) => {
  try {
    const res = await getUserByIdUsingGet({ id: userId });

    if (res.data.code === 0 && res.data.data) {
      userInfo.value = {
        userId: userId,
        userName: res.data.data.userName || '无名',
        userAvatar: res.data.data.userAvatar || 'https://via.placeholder.com/40'
      };
    } else {
      console.error('获取用户信息失败:', res.data.message);
      // 使用默认值
      userInfo.value = {
        userId: userId,
        userName: '无名',
        userAvatar: 'https://via.placeholder.com/40'
      };
    }
  } catch (err: any) {
    console.error('获取用户信息出错:', err);
    // 使用默认值
    userInfo.value = {
      userId: userId,
      userName: '无名',
      userAvatar: 'https://via.placeholder.com/40'
    };
  }
};

const fetchDetail = async () => {
  try {
    const res = await getMusicFileByIdUsingGet({ id: props.id });

    if (res.data.code === 0 && res.data.data) {
      detail.value = res.data.data;

      // 如果有userId，则获取用户信息
      if (detail.value.userId) {
        await fetchUserInfo(detail.value.userId);
      } else {
        // 没有userId，使用默认值
        userInfo.value = {
          userName: '无名',
          userAvatar: 'https://via.placeholder.com/40'
        };
      }

      // 解析标签
      detail.value.tags = parseTags(detail.value.tags);
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
  if (!detail.value) {
    message.error('没有可播放的音乐数据');
    return;
  }

  if (!detail.value.url) {
    message.error('音乐URL不存在，无法播放');
    return;
  }

  // 调用全局播放函数
  const success = playMusic({
    id: detail.value.id,
    name: detail.value.name,
    artist: detail.value.artist,
    coverUrl: detail.value.coverUrl,
    url: detail.value.url
  });

  if (success) {
    message.success(`正在播放: ${detail.value.name}`);
  } else {
    message.error('播放失败，请重试');
  }
};

// 解析标签的计算属性
const parsedTags = computed(() => {
  if (!detail.value?.tags) return [];
  return Array.isArray(detail.value.tags) ? detail.value.tags : [detail.value.tags];
});

// 在 fetchMusicDetail 或 initMusicDetail 函数中，添加标签解析逻辑
// 将字符串形式的 JSON 标签转换为数组
const parseTags = (tagsData) => {
  if (!tagsData) return [];
  if (typeof tagsData === 'string') {
    try {
      return JSON.parse(tagsData);
    } catch (e) {
      console.error('解析标签失败:', e);
      return [];
    }
  }
  return Array.isArray(tagsData) ? tagsData : [tagsData];
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
  display: flex;
  flex-direction: column;
  height: 100%;
}

.music-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

.cover-container {
  position: relative;
  width: 100%;
  /* 修改比例为80%，原来是100% */
  padding-top: 80%;
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
  flex-grow: 1;
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
  margin: 0 0 8px 0;
  font-size: 14px;
  color: #666;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

/* 类别标签样式 */
.category-tag {
  display: inline-block;
  padding: 2px 8px;
  border-radius: 4px;
  font-size: 12px;
  font-weight: 500;
  color: white;
  background-color: #888;
}

.category-pop {
  background-color: #ff4d94;
}

.category-rock {
  background-color: #ff6b22;
}

.category-electronic {
  background-color: #00bcd4;
}

.category-jazz {
  background-color: #9c27b0;
}

.category-indie {
  background-color: #4caf50;
}

.category-classical {
  background-color: #795548;
}

.category-rnb {
  background-color: #3f51b5;
}

.category-default {
  background-color: #888;
}

/* 卡片底部样式 */
.card-footer {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 10px 12px;
  border-top: 1px solid #f0f0f0;
}

/* 上传者信息样式 */
.uploader-info {
  display: flex;
  align-items: center;
}

.avatar {
  width: 30px;
  height: 30px;
  border-radius: 50%;
  overflow: hidden;
  margin-right: 8px;
}

.avatar img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.uploader-name {
  font-size: 13px;
  color: #666;
  max-width: 100px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

/* 播放按钮容器 */
.play-button-container {
  flex-shrink: 0;
}

.playing-button {
  background-color: #1890ff;
  color: white;
}

/* 标签容器样式 */
.tags-container {
  display: flex;
  flex-wrap: wrap;
  gap: 5px;
  margin-top: 5px;
}

.tag-item {
  padding: 2px 8px;
  background-color: #e6f7ff;
  border: 1px solid #91d5ff;
  border-radius: 2px;
  font-size: 12px;
  color: #1890ff;
}

.no-tags {
  font-size: 12px;
  color: #999;
}
</style>
