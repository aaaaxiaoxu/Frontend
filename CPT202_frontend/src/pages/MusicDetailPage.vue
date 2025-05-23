<template>
  <div class="music-detail-page">
    <div class="detail-container" v-if="detail">
      <div class="detail-header">
        <interactive-hover-button @click="backToList" :text="t('message.back')">
          <arrow-left-outlined />
        </interactive-hover-button>
        <h2>{{ detail.name }}</h2>
        <div class="header-actions">
          <interactive-hover-button @click="showEditModal" :text="t('message.edit')" class="mr-2">
            <edit-outlined />
          </interactive-hover-button>
          <a-popconfirm
            :title="t('message.confirmDelete')"
            :ok-text="t('message.confirm')"
            :cancel-text="t('message.cancel')"
            @confirm="handleDelete"
          >
            <interactive-hover-button :text="t('message.delete')" class="delete-btn">
              <delete-outlined />
            </interactive-hover-button>
          </a-popconfirm>
        </div>
      </div>

      <div class="detail-content">
        <div class="detail-left">
          <div class="music-cover">
            <img :src="detail.coverUrl || 'https://via.placeholder.com/300'" alt="Cover" />
          </div>
          <interactive-hover-button
            @click="handlePlay"
            :text="isCurrentlyPlaying ? t('message.playing') : t('message.play')"
            class="detail-play-btn"
            :class="{ 'playing-button': isCurrentlyPlaying }"
          >
            <play-circle-outlined v-if="!isCurrentlyPlaying" />
            <pause-circle-outlined v-else />
          </interactive-hover-button>
        </div>

        <div class="detail-right">
          <a-form :model="musicForm" :label-col="{ span: 4 }" :wrapper-col="{ span: 20 }">
            <a-form-item :label="t('message.tit')">
              <span>{{ detail.name }}</span>
            </a-form-item>
            <a-form-item :label="t('message.artist')">
              <span>{{ detail.artist || t('message.unknownArtist') }}</span>
            </a-form-item>
            <a-form-item :label="t('message.uploader')">
              <div class="uploader-info">
                <div class="avatar">
                  <img :src="userInfo.userAvatar || 'https://via.placeholder.com/40'" alt="User" />
                </div>
                <div class="uploader-name">{{ userInfo.userName || t('message.noName') }}</div>
              </div>
            </a-form-item>
            <a-form-item :label="t('message.category')">
              <span>{{ detail.category || t('message.unknownCategory') }}</span>
            </a-form-item>
            <a-form-item :label="t('message.introduction')" v-if="detail.introduction">
              <span>{{ detail.introduction }}</span>
            </a-form-item>
            <a-form-item :label="t('message.tags')">
              <div class="tags-container">
                <span v-if="!parsedTags.length" class="no-tags">{{ t('message.noTags') }}</span>
                <span v-else v-for="tag in parsedTags" :key="tag" class="tag-item">{{ tag }}</span>
              </div>
            </a-form-item>
            <a-form-item :label="t('message.updateTags')">
              <a-select
                v-model:value="musicForm.tags"
                mode="tags"
                :placeholder="t('message.addTags')"
                style="width: 100%"
                :options="defaultTags"
                :tokenSeparators="[',']"
              >
              </a-select>
            </a-form-item>
            <a-form-item :wrapper-col="{ span: 20, offset: 4 }">
              <interactive-hover-button
                :text="t('message.saveChanges')"
                @click="saveMusicChanges"
                :class="{ 'opacity-50 cursor-not-allowed': loading }"
                :disabled="loading"
              />
            </a-form-item>
          </a-form>
        </div>
      </div>
    </div>
    <div v-else-if="error" class="error-container">
      <a-result status="warning" :title="t('message.failedToGetMusicDetail')" :sub-title="errorMessage">
        <template #extra>
          <interactive-hover-button :text="t('message.backToList')" @click="backToList" />
          <interactive-hover-button :text="t('message.retry')" @click="retryFetch" class="ml-2" />
        </template>
      </a-result>
    </div>
    <div v-else class="loading-container">
      <a-spin :tip="t('message.loading')"></a-spin>
    </div>

    <!-- Edit modal -->
    <a-modal
      v-model:open="editModalVisible"
      :title="t('message.editMusicInfo')"
      :footer="null"
      @cancel="handleCancel"
    >
      <a-form :model="editForm" :label-col="{ span: 4 }" :wrapper-col="{ span: 20 }">
        <a-form-item :label="t('message.tit')" name="name">
          <a-input v-model:value="editForm.name" />
        </a-form-item>
        <a-form-item :label="t('message.artist')" name="artist">
          <a-input v-model:value="editForm.artist" />
        </a-form-item>
        <a-form-item :label="t('message.introduction')" name="introduction">
          <a-textarea v-model:value="editForm.introduction" :rows="4" />
        </a-form-item>
        <a-form-item :label="t('message.category')" name="category">
          <a-select v-model:value="editForm.category" :placeholder="t('message.selectCategory')">
            <a-select-option v-for="cat in availableCategories" :key="cat" :value="cat">
              {{ cat }}
            </a-select-option>
          </a-select>
        </a-form-item>
        <a-form-item :label="t('message.tags')" name="tags">
          <a-select v-model:value="editForm.tags" mode="tags" :placeholder="t('message.addTags')">
            <a-select-option v-for="tag in availableTags" :key="tag" :value="tag">
              {{ tag }}
            </a-select-option>
          </a-select>
        </a-form-item>
        <a-form-item :wrapper-col="{ span: 20, offset: 4 }">
          <div class="flex justify-end">
            <interactive-hover-button
              :text="t('message.cancel')"
              @click="handleCancel"
              class="mr-2"
            />
            <interactive-hover-button
              :text="t('message.confirm')"
              @click="handleEditSubmit"
              :class="{ 'opacity-50 cursor-not-allowed': editLoading }"
              :disabled="editLoading"
            />
          </div>
        </a-form-item>
      </a-form>
    </a-modal>

    <!-- Add player component -->
    <player-bar />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, reactive, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import {
  Spin as ASpin,
  Form as AForm,
  FormItem as AFormItem,
  Select as ASelect,
  SelectOption as ASelectOption,
  Modal as AModal,
  Popconfirm as APopconfirm,
  Input as AInput,
  Textarea as ATextarea,
  Result as AResult,
  message,
} from 'ant-design-vue'
import {
  PlayCircleOutlined,
  PauseCircleOutlined,
  ArrowLeftOutlined,
  EditOutlined,
  DeleteOutlined,
} from '@ant-design/icons-vue'
import {
  getMusicFileByIdUsingGet,
  updateMusicFileUsingPost,
  deleteMusicFileUsingPost,
  editMusicFileUsingPost,
} from '@/api/musicFileController'
import { getUserByIdUsingGet } from '@/api/userController'
import PlayerBar from '@/components/PlayerBar.vue'
import { currentMusic, playMusic, isPlaying } from '@/utils/audioPlayerStore'
import { useMusicStore } from '@/stores/musicStore'
import InteractiveHoverButton from '@/components/ui/interactive-hover-button/InteractiveHoverButton.vue'

interface MusicDetail {
  id: number | string
  name: string
  artist?: string
  coverUrl?: string
  url?: string
  category?: string
  userId?: number
  tags?: string[]
  introduction?: string
}

interface UserInfo {
  userId?: number
  userName?: string
  userAvatar?: string
}

const route = useRoute()
const router = useRouter()
const { t } = useI18n()

// Get ID directly from route parameters
const musicId = route.params.id

const detail = ref<MusicDetail | null>(null)
const userInfo = ref<UserInfo>({
  userName: t('message.noName'),
  userAvatar: 'https://via.placeholder.com/40',
})

const loading = ref(true)
const error = ref(false)
const errorMessage = ref('')
const editModalVisible = ref(false)
const editLoading = ref(false)

// Calculate if the current card is playing
const isCurrentlyPlaying = computed(() => {
  return isPlaying.value && String(currentMusic.id) === String(musicId)
})

// Computed property for parsing tags
const parsedTags = computed(() => {
  if (!detail.value?.tags) return []
  return Array.isArray(detail.value.tags) ? detail.value.tags : [detail.value.tags]
})

// Form data
const musicForm = reactive({
  id: null as number | string | null,
  category: '',
  tags: [] as string[],
})

// Edit form data
const editForm = reactive({
  id: null as number | string | null,
  name: '',
  artist: '',
  introduction: '',
  category: '',
  tags: [] as string[],
})

// Available categories and tags lists
const availableCategories = ['Pop', 'Rock', 'Electronic', 'Jazz', 'Indie', 'Classical', 'R&B']
const availableTags = [
  // 情绪标签
  t('message.tagHappy'),
  t('message.tagRelaxed'),
  t('message.tagPensive'),
  t('message.tagMotivational'),
  t('message.tagMelancholic'),
  
  // 场景标签
  t('message.tagMorning'),
  t('message.tagNight'),
  t('message.tagOnTheRoad'),
  t('message.tagWorking'),
  t('message.tagParty'),
  t('message.tagPreSleep'),
  t('message.tagWorkout'),
  t('message.tagStudy'),
  t('message.tagLateNight'),
  t('message.tagMeditation'),
  
  // 风格标签
  t('message.tagMinimalist'),
  t('message.tagAmbient'),
  t('message.tagClassicalElectronic'),
  t('message.tagElectroFantasy'),
  t('message.tagGroovy'),
  t('message.tagRetro'),
  t('message.tagFuturistic'),
  t('message.tagWorldSounds'),
  t('message.tagNature'),
  t('message.tagYouthful'),
  t('message.tagNostalgic'),
  t('message.tagWarm'),
  t('message.tagRebellious')
]

// Add default tag options
const defaultTags = ref([
  // 情绪标签
  { label: t('message.tagHappy'), value: 'Happy' },
  { label: t('message.tagRelaxed'), value: 'Relaxed' },
  { label: t('message.tagPensive'), value: 'Pensive' },
  { label: t('message.tagMotivational'), value: 'Motivational' },
  { label: t('message.tagMelancholic'), value: 'Melancholic' },
  
  // 场景标签
  { label: t('message.tagMorning'), value: 'Morning' },
  { label: t('message.tagNight'), value: 'Night' },
  { label: t('message.tagOnTheRoad'), value: 'On the Road' },
  { label: t('message.tagWorking'), value: 'While Working' },
  { label: t('message.tagParty'), value: 'Party' },
  { label: t('message.tagPreSleep'), value: 'Pre-Sleep' },
  { label: t('message.tagWorkout'), value: 'Workout' },
  { label: t('message.tagStudy'), value: 'Study' },
  { label: t('message.tagLateNight'), value: 'Late Night Thoughts' },
  { label: t('message.tagMeditation'), value: 'Deep Meditation' },
  
  // 风格标签
  { label: t('message.tagMinimalist'), value: 'Minimalist' },
  { label: t('message.tagAmbient'), value: 'Ambient' },
  { label: t('message.tagClassicalElectronic'), value: 'Classical-Electronic Fusion' },
  { label: t('message.tagElectroFantasy'), value: 'Electro Fantasy' },
  { label: t('message.tagGroovy'), value: 'Groovy' },
  { label: t('message.tagRetro'), value: 'Retro' },
  { label: t('message.tagFuturistic'), value: 'Futuristic' },
  { label: t('message.tagWorldSounds'), value: 'World Sounds' },
  { label: t('message.tagNature'), value: 'Nature Sounds' },
  { label: t('message.tagYouthful'), value: 'Youthful' },
  { label: t('message.tagNostalgic'), value: 'Nostalgic' },
  { label: t('message.tagWarm'), value: 'Warm' },
  { label: t('message.tagRebellious'), value: 'Rebellious' },
])

// Get user information - identical to MusicCard
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
      console.error(t('message.failedToGetUserInfo'), res.data.message)
      // Use default values
      userInfo.value = {
        userId: userId,
        userName: t('message.noName'),
        userAvatar: 'https://via.placeholder.com/40',
      }
    }
  } catch (err: any) {
    console.error(t('message.errorGettingUserInfo'), err)
    // Use default values
    userInfo.value = {
      userId: userId,
      userName: t('message.noName'),
      userAvatar: 'https://via.placeholder.com/40',
    }
  }
}

// Parse tags - identical to MusicCard
const parseTags = (tagsData) => {
  if (!tagsData) return []
  if (typeof tagsData === 'string') {
    try {
      return JSON.parse(tagsData)
    } catch (e) {
      console.error(t('message.failedToParseTag'), e)
      return []
    }
  }
  return Array.isArray(tagsData) ? tagsData : [tagsData]
}

// Get details - using MusicCard's approach
const fetchDetail = async () => {
  error.value = false
  loading.value = true

  try {
    // Use ID passed through route params directly
    const res = await getMusicFileByIdUsingGet({ id: musicId })

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

      // Initialize form data
      musicForm.id = detail.value.id
      musicForm.category = detail.value.category || ''
      musicForm.tags = detail.value.tags || []
    } else {
      // Set error state
      error.value = true
      errorMessage.value = res.data.message || t('message.requestDataNotExist')
      console.error(t('message.failedToGetDetails'), res.data)
      message.error(res.data.message || t('message.failedToLoadDetails'))
    }
  } catch (err: any) {
    // Set error state
    error.value = true
    errorMessage.value = err.message || t('message.requestError')
    console.error(t('message.getDetailsError'), err)
    message.error(t('message.error') + ': ' + err.message)
  } finally {
    loading.value = false
  }
}

// Get details when component is mounted
onMounted(fetchDetail)

// Return to list page
const backToList = () => {
  router.back()
}

// Save music changes
const saveMusicChanges = async () => {
  try {
    loading.value = true
    const updateData = {
      id: musicForm.id,
      tags: musicForm.tags,
    }

    const response = await updateMusicFileUsingPost(updateData)

    if (response.data.code === 0 && response.data.data) {
      message.success(t('message.tagsUpdateSuccess'))

      // Update currently displayed music information
      if (detail.value) {
        detail.value.tags = musicForm.tags
      }
    } else {
      message.error(t('message.updateFailed') + ': ' + (response.data.message || t('message.unknownError')))
    }
  } catch (error: any) {
    message.error(t('message.updateError') + ': ' + error.message)
  } finally {
    loading.value = false
  }
}

// Show edit modal
const showEditModal = () => {
  if (!detail.value) return

  // Initialize edit form data
  editForm.id = detail.value.id
  editForm.name = detail.value.name || ''
  editForm.artist = detail.value.artist || ''
  editForm.introduction = detail.value.introduction || ''
  editForm.category = detail.value.category || ''
  editForm.tags = detail.value.tags || []

  editModalVisible.value = true
}

// Handle cancel
const handleCancel = () => {
  editModalVisible.value = false
}

// Submit edit
const handleEditSubmit = async () => {
  editLoading.value = true
  try {
    const editData = {
      id: editForm.id,
      name: editForm.name,
      artist: editForm.artist,
      introduction: editForm.introduction,
      category: editForm.category,
      tags: editForm.tags,
    }

    const response = await editMusicFileUsingPost(editData)

    if (response.data.code === 0 && response.data.data) {
      message.success(t('message.musicInfoEditSuccess'))
      editModalVisible.value = false

      // Refresh data
      fetchDetail()
    } else {
      message.error(t('message.editFailed') + ': ' + (response.data.message || t('message.unknownError')))
    }
  } catch (error: any) {
    message.error(t('message.editError') + ': ' + error.message)
  } finally {
    editLoading.value = false
  }
}

// Delete music
const handleDelete = async () => {
  if (!detail.value) return

  try {
    const deleteData = {
      id: detail.value.id,
    }

    const response = await deleteMusicFileUsingPost(deleteData)

    if (response.data.code === 0 && response.data.data) {
      message.success(t('message.musicDeletedSuccess'))
      router.push('/music')
    } else {
      message.error(t('message.deleteFailed') + ': ' + (response.data.message || t('message.unknownError')))
    }
  } catch (error: any) {
    message.error(t('message.deleteError') + ': ' + error.message)
  }
}

// Play music
const handlePlay = () => {
  if (detail.value && detail.value.url) {
    playMusic({
      id: detail.value.id,
      name: detail.value.name,
      artist: detail.value.artist,
      coverUrl: detail.value.coverUrl,
      url: detail.value.url,
    })
  } else {
    message.error(t('message.cannotPlay'))
  }
}

// Add retry method
const retryFetch = () => {
  fetchDetail()
}
</script>

<style scoped>
.music-detail-page {
  min-height: calc(100vh - 140px);
  padding-bottom: 70px;
  background-color: #f8f8f8;
}

.detail-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 24px;
  background-color: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
}

.detail-header {
  display: flex;
  align-items: center;
  margin-bottom: 32px;
  padding-bottom: 16px;
  border-bottom: 1px solid #f0f0f0;
}

.detail-header h2 {
  margin: 0 0 0 16px;
  font-size: 24px;
  color: #333;
  flex: 1;
}

.header-actions {
  display: flex;
  margin-left: auto;
}

.detail-content {
  display: flex;
  flex-wrap: wrap;
  gap: 30px;
}

.detail-left {
  width: 300px;
  flex-shrink: 0;
}

.detail-right {
  flex: 1;
  min-width: 300px;
}

.music-cover {
  width: 100%;
  height: 300px;
  overflow: hidden;
  border-radius: 8px;
  margin-bottom: 16px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.music-cover img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.detail-play-btn {
  width: 100%;
  height: 44px;
  font-size: 16px;
  border-radius: 4px;
}

.playing-button {
  background-color: #1890ff;
  color: white;
}

.loading-container {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 300px;
}

.error-container {
  margin-top: 50px;
  display: flex;
  justify-content: center;
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
  font-size: 14px;
  color: #666;
}

/* Tags container styles */
.tags-container {
  display: flex;
  flex-wrap: wrap;
  gap: 5px;
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

/* Add new styles */
.opacity-50 {
  opacity: 0.5;
}

.cursor-not-allowed {
  cursor: not-allowed;
}

.ml-2 {
  margin-left: 0.5rem;
}

.mr-2 {
  margin-right: 0.5rem;
}

.flex {
  display: flex;
}

.justify-end {
  justify-content: flex-end;
}

.delete-btn :deep(.bg-primary) {
  background-color: #ff4d4f;
}

.detail-play-btn :deep(.bg-primary) {
  background-color: #1890ff;
}

.playing-button :deep(.bg-primary) {
  background-color: #52c41a;
}
</style>

<!-- 添加黑夜模式样式 -->
<style>
/* 黑夜模式下的整体页面样式 */
[data-theme='dark'] .music-detail-page {
  background-color: #121212;
}

[data-theme='dark'] .detail-container {
  background-color: #1f1f1f;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.3);
}

[data-theme='dark'] .detail-header {
  border-bottom-color: #303030;
}

[data-theme='dark'] .detail-header h2 {
  color: rgba(255, 255, 255, 0.85);
}

/* 表单和文本样式 */
[data-theme='dark'] .ant-form-item-label > label {
  color: rgba(255, 255, 255, 0.85);
}

[data-theme='dark'] .ant-form-item span,
[data-theme='dark'] .uploader-name {
  color: rgba(255, 255, 255, 0.65);
}

[data-theme='dark'] .ant-input,
[data-theme='dark'] .ant-select-selector,
[data-theme='dark'] .ant-select-selection-search-input {
  background-color: #141414;
  border-color: #434343;
  color: rgba(255, 255, 255, 0.85);
}

[data-theme='dark'] .ant-input:hover,
[data-theme='dark'] .ant-select:hover .ant-select-selector {
  border-color: #165996;
}

[data-theme='dark'] .ant-input:focus,
[data-theme='dark'] .ant-select-focused .ant-select-selector {
  border-color: #177ddc;
  box-shadow: 0 0 0 2px rgba(23, 125, 220, 0.2);
}

/* 按钮样式 */
[data-theme='dark'] .interactive-hover-button {
  background-color: #1f1f1f;
  color: rgba(255, 255, 255, 0.85);
}

[data-theme='dark'] .interactive-hover-button:hover {
  background-color: #303030;
  color: #177ddc;
}

[data-theme='dark'] .playing-button {
  background-color: #177ddc;
  color: white;
}

[data-theme='dark'] .delete-btn :deep(.bg-primary) {
  background-color: #a61d24;
}

[data-theme='dark'] .playing-button :deep(.bg-primary) {
  background-color: #3f6600;
}

/* 标签样式 */
[data-theme='dark'] .tag-item {
  background-color: #111b26;
  border-color: #153450;
  color: #177ddc;
}

[data-theme='dark'] .no-tags {
  color: rgba(255, 255, 255, 0.45);
}

/* 音乐封面样式 */
[data-theme='dark'] .music-cover {
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
}

/* 模态框样式 */
[data-theme='dark'] .ant-modal-content,
[data-theme='dark'] .ant-modal-header {
  background-color: #1f1f1f;
  color: rgba(255, 255, 255, 0.85);
  border-color: #303030;
}

[data-theme='dark'] .ant-modal-title {
  color: rgba(255, 255, 255, 0.85);
}

[data-theme='dark'] .ant-modal-close {
  color: rgba(255, 255, 255, 0.45);
}

[data-theme='dark'] .ant-modal-close:hover {
  color: rgba(255, 255, 255, 0.75);
}

[data-theme='dark'] .ant-modal-footer {
  border-top-color: #303030;
}

/* 下拉菜单样式 */
[data-theme='dark'] .ant-select-dropdown {
  background-color: #1f1f1f;
}

[data-theme='dark'] .ant-select-item {
  color: rgba(255, 255, 255, 0.85);
}

[data-theme='dark'] .ant-select-item-option-selected {
  background-color: #111b26;
}

[data-theme='dark'] .ant-select-item-option-active {
  background-color: #111b26;
}

/* 结果和确认对话框样式 */
[data-theme='dark'] .ant-result-title,
[data-theme='dark'] .ant-result-subtitle {
  color: rgba(255, 255, 255, 0.85);
}

[data-theme='dark'] .ant-popconfirm-message-title {
  color: rgba(255, 255, 255, 0.85);
}

[data-theme='dark'] .ant-popconfirm-buttons .ant-btn {
  background-color: #1f1f1f;
  border-color: #434343;
  color: rgba(255, 255, 255, 0.85);
}

[data-theme='dark'] .ant-popconfirm-buttons .ant-btn-primary {
  background-color: #177ddc;
  border-color: #177ddc;
  color: white;
}

/* 加载状态样式 */
[data-theme='dark'] .ant-spin-text {
  color: rgba(255, 255, 255, 0.85);
}

[data-theme='dark'] .ant-spin-dot-item {
  background-color: #177ddc;
}
</style>
