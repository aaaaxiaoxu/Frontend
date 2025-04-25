<template>
  <div class="container mx-auto py-8 px-4">
    <h1 class="text-2xl font-bold mb-6">{{ t('message.myUploads') }}</h1>

    <!-- Search and Filter Area -->
    <div class="mb-6 bg-white p-4 rounded-lg shadow-sm">
      <div class="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-4">
        <div>
          <a-input
            v-model:value="searchParams.name"
            :placeholder="t('message.resourceName')"
            allow-clear
            @pressEnter="handleSearch"
          />
        </div>
        <div>
          <a-select
            v-model:value="searchParams.category"
            :placeholder="t('message.category')"
            style="width: 100%"
            allow-clear
          >
            <a-select-option v-for="category in categories" :key="category" :value="category">
              {{ category }}
            </a-select-option>
          </a-select>
        </div>
        <div class="flex gap-2">
          <interactive-hover-button
            @click="handleSearch"
            text="Search"
            class="bg-white text-black border-gray-300"
          />
          <interactive-hover-button
            @click="handleReset"
            text="reset"
          />
        </div>
      </div>

      <!-- Status Filter -->
      <div>
        <a-radio-group v-model:value="filterStatus" button-style="solid" @change="handleFilterChange">
          <a-radio-button value="all">{{ t('message.allStatus') }}</a-radio-button>
          <a-radio-button value="0">{{ t('message.pending') }}</a-radio-button>
          <a-radio-button value="1">{{ t('message.approved') }}</a-radio-button>
          <a-radio-button value="2">{{ t('message.rejected') }}</a-radio-button>
        </a-radio-group>
      </div>
    </div>

    <!-- Upload Resource List -->
    <div v-if="loading" class="flex justify-center items-center py-20">
      <a-spin size="large" />
    </div>

    <div v-else-if="musicList.length === 0" class="text-center py-20">
      <inbox-outlined style="font-size: 48px; color: #ccc;" />
      <p class="mt-4 text-gray-500">{{ t('message.noUploads') }}</p>
    </div>

    <div v-else class="grid grid-cols-1 gap-6">
      <a-card v-for="item in musicList" :key="item.id" class="upload-card">
        <div class="flex items-center">
          <div class="flex-shrink-0 mr-4">
            <img
              :src="item.coverUrl || '/default-cover.png'"
              alt="Cover"
              class="w-24 h-24 object-cover rounded"
            />
          </div>
          <div class="flex-grow min-w-0">
            <h3 class="text-lg font-medium truncate">{{ item.name }}</h3>
            <p class="text-gray-600 truncate">{{ item.artist || t('message.unknownArtist') }}</p>
            <div class="flex items-center mt-2">
              <a-tag :color="getStatusColor(getItemReviewStatus(item))">
                {{ getStatusText(getItemReviewStatus(item)) }}
              </a-tag>
              <span class="text-gray-500 text-sm ml-2">{{ formatDate(item.createTime) }}</span>
            </div>
          </div>
        </div>

        <!-- Rejection Reason -->
        <div v-if="getItemReviewStatus(item) === 2" class="mt-4 border-t pt-4">
          <div class="text-red-600 mb-2 font-medium">{{ t('message.rejectReason') }}:</div>
          <p class="text-gray-700">{{ getItemReviewMessage(item) || t('message.noRejectReason') }}</p>
        </div>

        <!-- Music Player Controls -->
        <div class="mt-4 border-t pt-4" v-if="getItemReviewStatus(item) === 1 && item.url">
          <div class="flex items-center">
            <div class="mr-2">
              <button @click="playMusic(item)" class="text-blue-500 hover:text-blue-700">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-play-circle">
                  <circle cx="12" cy="12" r="10"></circle>
                  <polygon points="10 8 16 12 10 16 10 8"></polygon>
                </svg>
              </button>
            </div>
            <div class="flex-grow">
              <div v-if="currentMusic.id === item.id" class="text-sm text-gray-500">
                Now Playing...
              </div>
              <div v-else class="text-sm text-gray-500">
                Click to Play
              </div>
            </div>
          </div>
        </div>

        <!-- Action Buttons -->
        <div class="mt-4 flex justify-end">
          <interactive-hover-button
            @click="confirmDelete(item.id)"
            :text="t('message.delete')"
            class="bg-red-500 text-white hover:bg-red-600"
          />
        </div>
      </a-card>
    </div>

    <!-- Pagination -->
    <div class="mt-6 flex justify-center">
      <a-pagination
        v-model:current="current"
        :total="total"
        :pageSize="pageSize"
        @change="handlePageChange"
        show-quick-jumper
      />
    </div>

    <!-- Player Component -->
    <div class="player-bar" v-if="currentMusic.url">
      <div class="player-info">
        <img :src="currentMusic.coverUrl || '/default-cover.png'" alt="cover" class="cover" />
        <div class="info">
          <div class="title">{{ currentMusic.name }}</div>
          <div class="artist">{{ currentMusic.artist || t('message.unknownArtist') }}</div>
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
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, onMounted, reactive } from 'vue'
import { useI18n } from 'vue-i18n'
import { message, Modal } from 'ant-design-vue'
import { InboxOutlined } from '@ant-design/icons-vue'
import dayjs from 'dayjs'
import {
  listMusicFileByPageUsingPost,
  deleteMusicFileUsingPost,
  listMusicFileTagCategoryUsingGet
} from '@/api/musicFileController.ts'
import { useLoginUserStore } from '@/stores/useLoginUserStore.ts'
import InteractiveHoverButton from '@/components/ui/interactive-hover-button/InteractiveHoverButton.vue'
import {
  playMusic as playerPlayMusic,
  togglePlay,
  seekTo,
  setVolume,
  formatTime,
  currentMusic,
  isPlaying,
  currentTime,
  duration,
  volume,
} from '@/utils/audioPlayerStore'

// Extended MusicFile type to include reviewStatus and reviewMessage
type ExtendedMusicFileVO = API.MusicFileVO & {
  reviewStatus?: number;
  reviewMessage?: string;
}

export default defineComponent({
  components: {
    InboxOutlined,
    InteractiveHoverButton
  },
  setup() {
    const { t } = useI18n()
    const loginUserStore = useLoginUserStore()

    // States and data
    const loading = ref(true)
    const musicList = ref<ExtendedMusicFileVO[]>([])
    const current = ref(1)
    const pageSize = ref(10)
    const total = ref(0)
    const filterStatus = ref('all')
    const categories = ref<string[]>([])
    const isMuted = ref(false)
    const previousVolume = ref(volume.value)

    // Search parameters
    const searchParams = reactive({
      name: '',
      category: undefined as string | undefined
    })

    // Fetch category list
    const fetchCategories = async () => {
      try {
        const res = await listMusicFileTagCategoryUsingGet()
        if (res.data && res.data.data && res.data.data.categoryList) {
          categories.value = res.data.data.categoryList
        }
      } catch (error) {
        console.error('Failed to fetch categories:', error)
      }
    }

    // Handle search
    const handleSearch = () => {
      current.value = 1 // Reset to first page
      fetchUserUploads()
    }

    // Reset search form
    const handleReset = () => {
      searchParams.name = ''
      searchParams.category = undefined
      current.value = 1
      fetchUserUploads()
    }

    // Get user uploaded music resources
    const fetchUserUploads = async () => {
      if (!loginUserStore.loginUser.id) return

      try {
        loading.value = true

        const params: API.MusicFileQueryRequest = {
          userId: loginUserStore.loginUser.id,
          current: current.value,
          pageSize: pageSize.value,
          name: searchParams.name || undefined,
          category: searchParams.category || undefined
        }

        // Add status filter
        if (filterStatus.value !== 'all') {
          params.reviewStatus = parseInt(filterStatus.value)
        }

        const res = await listMusicFileByPageUsingPost(params)

        if (res.data.code === 0 && res.data.data) {
          // Use the returned data directly, as listMusicFileByPageUsingPost already includes review information
          musicList.value = (res.data.data.records || []) as ExtendedMusicFileVO[]
          total.value = res.data.data.total || 0

          if (musicList.value.length === 0 && (searchParams.name || searchParams.category)) {
            message.info(t('message.noMatchingResults'))
          }
        } else {
          message.error(t('message.fetchFailed'))
        }
      } catch (error: any) {
        message.error(t('message.fetchError') + ': ' + error.message)
      } finally {
        loading.value = false
      }
    }

    // Get item review status
    const getItemReviewStatus = (item: ExtendedMusicFileVO): number => {
      return item.reviewStatus ?? 0
    }

    // Get item review message
    const getItemReviewMessage = (item: ExtendedMusicFileVO): string => {
      return item.reviewMessage ?? ''
    }

    // Page change
    const handlePageChange = (page: number) => {
      current.value = page
      fetchUserUploads()
    }

    // Status filter change
    const handleFilterChange = () => {
      current.value = 1 // Reset to first page
      fetchUserUploads()
    }

    // Format date
    const formatDate = (dateStr?: string) => {
      if (!dateStr) return ''
      return dayjs(dateStr).format('YYYY-MM-DD HH:mm')
    }

    // Get status text
    const getStatusText = (status: number) => {
      switch (status) {
        case 0: return t('message.pending')
        case 1: return t('message.approved')
        case 2: return t('message.rejected')
        default: return t('message.unknown')
      }
    }

    // Get status color
    const getStatusColor = (status: number) => {
      switch (status) {
        case 0: return 'gold'
        case 1: return 'green'
        case 2: return 'red'
        default: return 'default'
      }
    }

    // Confirm delete
    const confirmDelete = (id?: number) => {
      if (!id) return

      Modal.confirm({
        title: t('message.confirmDelete'),
        content: t('message.deleteConfirmText'),
        okText: t('message.confirm'),
        cancelText: t('message.cancel'),
        onOk: async () => {
          try {
            const res = await deleteMusicFileUsingPost({ id })

            if (res.data.code === 0 && res.data.data) {
              message.success(t('message.deleteSuccess'))
              fetchUserUploads()
            } else {
              message.error(t('message.deleteFailed') + ': ' + res.data.message)
            }
          } catch (error: any) {
            message.error(t('message.deleteError') + ': ' + error.message)
          }
        }
      })
    }

    // Play music
    const playMusic = (item: ExtendedMusicFileVO) => {
      if (!item.url) {
        message.error(t('message.noAudioSource'))
        return
      }

      const musicData = {
        id: item.id,
        name: item.name || t('message.unknownTrack'),
        artist: item.artist || t('message.unknownArtist'),
        coverUrl: item.coverUrl || '',
        url: item.url
      }

      playerPlayMusic(musicData)
    }

    // Handle seek
    const handleSeek = (e: Event) => {
      const target = e.target as HTMLInputElement
      seekTo(Number(target.value))
    }

    // Handle volume change
    const handleVolumeChange = (e: Event) => {
      const target = e.target as HTMLInputElement
      const newVolume = Number(target.value)
      setVolume(newVolume)

      if (newVolume > 0) {
        previousVolume.value = newVolume
        if (isMuted.value) {
          isMuted.value = false
        }
      } else if (newVolume === 0) {
        isMuted.value = true
      }
    }

    // Toggle mute
    const toggleMute = () => {
      if (isMuted.value) {
        // Restore volume
        setVolume(previousVolume.value > 0 ? previousVolume.value : 0.5)
        isMuted.value = false
      } else {
        // Save current volume before muting
        previousVolume.value = volume.value
        setVolume(0)
        isMuted.value = true
      }
    }

    // Initialize data when mounted
    onMounted(() => {
      fetchCategories()
      fetchUserUploads()
    })

    return {
      t,
      loading,
      musicList,
      current,
      pageSize,
      total,
      filterStatus,
      categories,
      searchParams,
      getItemReviewStatus,
      getItemReviewMessage,
      formatDate,
      getStatusText,
      getStatusColor,
      handleSearch,
      handleReset,
      handlePageChange,
      handleFilterChange,
      confirmDelete,
      // Audio player related
      currentMusic,
      isPlaying,
      currentTime,
      duration,
      volume,
      isMuted,
      playMusic,
      togglePlay,
      handleSeek,
      handleVolumeChange,
      toggleMute,
      formatTime
    }
  }
})
</script>

<style scoped>
.upload-card {
  transition: transform 0.2s ease;
}

.upload-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
}

/* Player Styles */
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

.play-button,
.volume-button {
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
