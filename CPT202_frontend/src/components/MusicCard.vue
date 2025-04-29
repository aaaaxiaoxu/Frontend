<template>
  <div class="music-card-component">
    <div v-if="loading" class="loading-container">{{ t('message.loading') }}</div>
    <div v-else-if="detail" class="music-card">
      <!-- Music cover image section - reduced scale -->
      <div class="cover-container">
        <img :src="detail.coverUrl" alt="Cover" class="cover" />

        <!-- Play status overlay icon -->
        <div v-if="isCurrentlyPlaying" class="playing-indicator">
          <div class="playing-icon">▶</div>
        </div>
      </div>

      <!-- Information section -->
      <div class="music-info">
        <h3 class="music-title">{{ detail.name }}</h3>
        <p class="music-artist">{{ detail.artist || t('message.unknownArtist') }}</p>
        <!-- Display tags -->
        <div class="tags-container">
          <span v-if="!parsedTags.length" class="no-tags">{{ t('message.noTags') }}</span>
          <span v-else v-for="tag in parsedTags" :key="tag" class="tag-item">{{ tag }}</span>
        </div>
      </div>

      <!-- Bottom area: uploader information and play button -->
      <div class="card-footer">
        <!-- Uploader information -->
        <div class="uploader-info">
          <div class="avatar">
            <img :src="userInfo.userAvatar || 'https://via.placeholder.com/40'" alt="User" />
          </div>
          <div class="uploader-name">{{ userInfo.userName || t('message.noName') }}</div>
        </div>

        <!-- Play button -->
        <div class="play-button-container">
          <InteractiveHoverButton 
            @click="handlePlay" 
            :text="isCurrentlyPlaying ? t('message.playing') : t('message.play')"
            :class="{ 'playing-button': isCurrentlyPlaying }"
          />
        </div>
      </div>
    </div>
    <div v-else class="error-container">{{ t('message.noDataAvailable') }}</div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { message } from 'ant-design-vue'
import { PlayCircleOutlined, PauseCircleOutlined } from '@ant-design/icons-vue'
import { getMusicFileByIdUsingGet } from '@/api/musicFileController'
import { getUserByIdUsingGet } from '@/api/userController'
import { currentMusic, playMusic, isPlaying } from '@/utils/audioPlayerStore'
import bus from '@/utils/eventBus'
import InteractiveHoverButton from '@/components/ui/interactive-hover-button/InteractiveHoverButton.vue'
import { useI18n } from 'vue-i18n'

// i18n
const { t } = useI18n()

interface MusicDetail {
  id: number | string
  name: string
  artist?: string
  coverUrl?: string
  url?: string
  category?: string
  userId?: number
  tags?: string[]
}

interface UserInfo {
  userId?: number
  userName?: string
  userAvatar?: string
}

const props = defineProps<{ id: number }>()
const detail = ref<MusicDetail | null>(null)
const userInfo = ref<UserInfo>({
  userName: t('message.noName'),
  userAvatar: 'https://via.placeholder.com/40',
})
const loading = ref(true)
const showDebug = ref(false)

// Calculate if the current card is playing
const isCurrentlyPlaying = computed(() => {
  return isPlaying.value && String(currentMusic.id) === String(props.id)
})

// Get CSS class name corresponding to category
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

// Get user information
const fetchUserInfo = async (userId: number) => {
  try {
    const res = await getUserByIdUsingGet({ id: userId })

    if (res.data.code === 0 && res.data.data) {
      userInfo.value = {
        userId: userId,
        userName: res.data.data.userName || t('message.noName'),
        userAvatar: res.data.data.userAvatar || 'https://via.placeholder.com/40',
      }
    } else {
      console.error(t('message.getUserInfoFailed') + ':', res.data.message)
      // Use default values
      userInfo.value = {
        userId: userId,
        userName: t('message.noName'),
        userAvatar: 'https://via.placeholder.com/40',
      }
    }
  } catch (err: any) {
    console.error(t('message.getUserInfoError') + ':', err)
    // Use default values
    userInfo.value = {
      userId: userId,
      userName: t('message.noName'),
      userAvatar: 'https://via.placeholder.com/40',
    }
  }
}

const fetchDetail = async () => {
  try {
    const res = await getMusicFileByIdUsingGet({ id: props.id })

    if (res.data.code === 0 && res.data.data) {
      detail.value = res.data.data

      // If there is a userId, get user information
      if (detail.value.userId) {
        await fetchUserInfo(detail.value.userId)
      } else {
        // No userId, use default values
        userInfo.value = {
          userName: t('message.noName'),
          userAvatar: 'https://via.placeholder.com/40',
        }
      }

      // Parse tags
      detail.value.tags = parseTags(detail.value.tags)
    } else {
      console.error(t('message.getDetailFailed') + ':', res.data.message)
      message.error(res.data.message || t('message.loadDetailFailed'))
    }
  } catch (err: any) {
    console.error(t('message.getDetailError') + ':', err)
    message.error(t('message.error') + ': ' + err.message)
  } finally {
    loading.value = false
  }
}

onMounted(fetchDetail)

// Handle play event
const handlePlay = () => {
  if (!detail.value) {
    message.error(t('message.noPlayableMusic'))
    return
  }

  if (!detail.value.url) {
    message.error(t('message.musicUrlNotExist'))
    return
  }

  // Call global play function
  const success = playMusic({
    id: detail.value.id,
    name: detail.value.name,
    artist: detail.value.artist,
    coverUrl: detail.value.coverUrl,
    url: detail.value.url,
  })

  if (success) {
    message.success(`${t('message.nowPlaying')}: ${detail.value.name}`)
  } else {
    message.error(t('message.playFailed'))
  }
}

// Computed property for parsing tags
const parsedTags = computed(() => {
  if (!detail.value?.tags) return []
  return Array.isArray(detail.value.tags) ? detail.value.tags : [detail.value.tags]
})

// In fetchMusicDetail or initMusicDetail function, add tag parsing logic
// Convert string format JSON tags to array
const parseTags = (tagsData) => {
  if (!tagsData) return []
  if (typeof tagsData === 'string') {
    try {
      return JSON.parse(tagsData)
    } catch (e) {
      console.error(t('message.parseTagsFailed') + ':', e)
      return []
    }
  }
  return Array.isArray(tagsData) ? tagsData : [tagsData]
}
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
  transition:
    transform 0.3s,
    box-shadow 0.3s;
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
  /* Changed ratio to 80%, was 100% before */
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

/* Category tag styles */
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

/* Card footer styles */
.card-footer {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 10px 12px;
  border-top: 1px solid #f0f0f0;
}

/* Uploader information styles */
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

/* Play button container */
.play-button-container {
  flex-shrink: 0;
}

.playing-button {
  background-color: #1890ff;
  color: white;
}

/* Tags container styles */
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
