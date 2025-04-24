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

    <!-- 编辑模态框 -->
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

    <!-- 添加播放器组件 -->
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

// 直接从路由参数获取ID
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

// 计算当前卡片是否正在播放
const isCurrentlyPlaying = computed(() => {
  return isPlaying.value && String(currentMusic.id) === String(musicId)
})

// 解析标签的计算属性
const parsedTags = computed(() => {
  if (!detail.value?.tags) return []
  return Array.isArray(detail.value.tags) ? detail.value.tags : [detail.value.tags]
})

// 表单数据
const musicForm = reactive({
  id: null as number | string | null,
  category: '',
  tags: [] as string[],
})

// 编辑表单数据
const editForm = reactive({
  id: null as number | string | null,
  name: '',
  artist: '',
  introduction: '',
  category: '',
  tags: [] as string[],
})

// 可用的类别和标签列表
const availableCategories = ['Pop', 'Rock', 'Electronic', 'Jazz', 'Indie', 'Classical', 'R&B']
const availableTags = [
  t('message.genreHot'), 
  t('message.genrePop'), 
  t('message.genreClassical'), 
  t('message.genreModern'), 
  t('message.genreSoothing'), 
  t('message.genreEnergetic'), 
  t('message.genreParty'), 
  t('message.genreWork'), 
  t('message.genreRelaxing')
]

// 添加默认标签选项
const defaultTags = ref([
  { label: t('message.genreHot'), value: t('message.genreHot') },
  { label: t('message.genrePop'), value: t('message.genrePop') },
  { label: t('message.genreClassical'), value: t('message.genreClassical') },
  { label: t('message.genreModern'), value: t('message.genreModern') },
  { label: t('message.genreSoothing'), value: t('message.genreSoothing') },
  { label: t('message.genreEnergetic'), value: t('message.genreEnergetic') },
  { label: t('message.genreParty'), value: t('message.genreParty') },
  { label: t('message.genreWork'), value: t('message.genreWork') },
  { label: t('message.genreRelaxing'), value: t('message.genreRelaxing') },
  { label: t('message.genrePop'), value: 'Pop Music' },
  { label: t('message.genreRock'), value: 'Rock' },
  { label: t('message.genreClassical'), value: 'Classical' },
  { label: t('message.genreJazz'), value: 'Jazz' },
  { label: t('message.genreHipHop'), value: 'Hip Hop' },
  { label: t('message.genreRnB'), value: 'R&B' },
  { label: t('message.genreCountry'), value: 'Country' },
  { label: t('message.genreElectronic'), value: 'Electronic' },
])

// 获取用户信息 - 与MusicCard完全相同
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
      // 使用默认值
      userInfo.value = {
        userId: userId,
        userName: t('message.noName'),
        userAvatar: 'https://via.placeholder.com/40',
      }
    }
  } catch (err: any) {
    console.error(t('message.errorGettingUserInfo'), err)
    // 使用默认值
    userInfo.value = {
      userId: userId,
      userName: t('message.noName'),
      userAvatar: 'https://via.placeholder.com/40',
    }
  }
}

// 解析标签 - 与MusicCard完全相同
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

// 获取详情 - 采用MusicCard的方式
const fetchDetail = async () => {
  error.value = false
  loading.value = true

  try {
    // 直接使用路由参数传递的ID
    const res = await getMusicFileByIdUsingGet({ id: musicId })

    if (res.data.code === 0 && res.data.data) {
      detail.value = res.data.data

      // 如果有userId，则获取用户信息
      if (detail.value.userId) {
        await fetchUserInfo(detail.value.userId)
      } else {
        // 没有userId，使用默认值
        userInfo.value = {
          userName: t('message.noName'),
          userAvatar: 'https://via.placeholder.com/40',
        }
      }

      // 解析标签
      detail.value.tags = parseTags(detail.value.tags)

      // 初始化表单数据
      musicForm.id = detail.value.id
      musicForm.category = detail.value.category || ''
      musicForm.tags = detail.value.tags || []
    } else {
      // 设置错误状态
      error.value = true
      errorMessage.value = res.data.message || t('message.requestDataNotExist')
      console.error(t('message.failedToGetDetails'), res.data)
      message.error(res.data.message || t('message.failedToLoadDetails'))
    }
  } catch (err: any) {
    // 设置错误状态
    error.value = true
    errorMessage.value = err.message || t('message.requestError')
    console.error(t('message.getDetailsError'), err)
    message.error(t('message.error') + ': ' + err.message)
  } finally {
    loading.value = false
  }
}

// 组件挂载时获取详情
onMounted(fetchDetail)

// 返回列表页
const backToList = () => {
  router.back()
}

// 保存音乐修改
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

      // 更新当前显示的音乐信息
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

// 显示编辑模态框
const showEditModal = () => {
  if (!detail.value) return

  // 初始化编辑表单数据
  editForm.id = detail.value.id
  editForm.name = detail.value.name || ''
  editForm.artist = detail.value.artist || ''
  editForm.introduction = detail.value.introduction || ''
  editForm.category = detail.value.category || ''
  editForm.tags = detail.value.tags || []

  editModalVisible.value = true
}

// 处理取消
const handleCancel = () => {
  editModalVisible.value = false
}

// 提交编辑
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

      // 刷新数据
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

// 删除音乐
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

// 播放音乐
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

// 添加重试方法
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
  font-size: 14px;
  color: #666;
}

/* 标签容器样式 */
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

/* 添加新的样式 */
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
