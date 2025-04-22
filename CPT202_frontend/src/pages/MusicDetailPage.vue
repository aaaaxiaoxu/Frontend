<template>
  <div class="music-detail-page">
    <div class="detail-container" v-if="detail">
      <div class="detail-header">
        <a-button @click="backToList" type="primary"> <arrow-left-outlined /> 返回 </a-button>
        <h2>{{ detail.name }}</h2>
        <div class="header-actions">
          <a-button type="primary" @click="showEditModal" style="margin-right: 10px">
            <edit-outlined /> 编辑
          </a-button>
          <a-popconfirm
            title="确定要删除这个音乐文件吗？"
            ok-text="确定"
            cancel-text="取消"
            @confirm="handleDelete"
          >
            <a-button type="danger"> <delete-outlined /> 删除 </a-button>
          </a-popconfirm>
        </div>
      </div>

      <div class="detail-content">
        <div class="detail-left">
          <div class="music-cover">
            <img :src="detail.coverUrl || 'https://via.placeholder.com/300'" alt="Cover" />
          </div>
          <a-button
            @click="handlePlay"
            type="primary"
            class="detail-play-btn"
            :class="{ 'playing-button': isCurrentlyPlaying }"
          >
            <play-circle-outlined v-if="!isCurrentlyPlaying" />
            <pause-circle-outlined v-else />
            {{ isCurrentlyPlaying ? '播放中' : '播放' }}
          </a-button>
        </div>

        <div class="detail-right">
          <a-form :model="musicForm" :label-col="{ span: 4 }" :wrapper-col="{ span: 20 }">
            <a-form-item label="标题">
              <span>{{ detail.name }}</span>
            </a-form-item>
            <a-form-item label="艺术家">
              <span>{{ detail.artist || '未知艺术家' }}</span>
            </a-form-item>
            <a-form-item label="上传者">
              <div class="uploader-info">
                <div class="avatar">
                  <img :src="userInfo.userAvatar || 'https://via.placeholder.com/40'" alt="User" />
                </div>
                <div class="uploader-name">{{ userInfo.userName || '无名' }}</div>
              </div>
            </a-form-item>
            <a-form-item label="类别">
              <span>{{ detail.category || '未知类别' }}</span>
            </a-form-item>
            <a-form-item label="简介" v-if="detail.introduction">
              <span>{{ detail.introduction }}</span>
            </a-form-item>
            <a-form-item label="标签">
              <div class="tags-container">
                <span v-if="!parsedTags.length" class="no-tags">无标签</span>
                <span v-else v-for="tag in parsedTags" :key="tag" class="tag-item">{{ tag }}</span>
              </div>
            </a-form-item>
            <a-form-item label="更新标签">
              <a-select
                v-model:value="musicForm.tags"
                mode="tags"
                placeholder="添加标签"
                style="width: 100%"
              >
                <a-select-option v-for="tag in availableTags" :key="tag" :value="tag">
                  {{ tag }}
                </a-select-option>
              </a-select>
            </a-form-item>
            <a-form-item :wrapper-col="{ span: 20, offset: 4 }">
              <a-button type="primary" @click="saveMusicChanges">保存标签更改</a-button>
            </a-form-item>
          </a-form>
        </div>
      </div>
    </div>
    <div v-else-if="error" class="error-container">
      <a-result status="warning" title="获取音乐详情失败" :sub-title="errorMessage">
        <template #extra>
          <a-button type="primary" @click="backToList"> 返回列表 </a-button>
          <a-button @click="retryFetch" style="margin-left: 8px"> 重试 </a-button>
        </template>
      </a-result>
    </div>
    <div v-else class="loading-container">
      <a-spin tip="加载中..."></a-spin>
    </div>

    <!-- 编辑模态框 -->
    <a-modal
      v-model:open="editModalVisible"
      title="编辑音乐信息"
      :confirmLoading="editLoading"
      @ok="handleEditSubmit"
    >
      <a-form :model="editForm" :label-col="{ span: 4 }" :wrapper-col="{ span: 20 }">
        <a-form-item label="标题" name="name">
          <a-input v-model:value="editForm.name" />
        </a-form-item>
        <a-form-item label="艺术家" name="artist">
          <a-input v-model:value="editForm.artist" />
        </a-form-item>
        <a-form-item label="简介" name="introduction">
          <a-textarea v-model:value="editForm.introduction" :rows="4" />
        </a-form-item>
        <a-form-item label="类别" name="category">
          <a-select v-model:value="editForm.category" placeholder="选择类别">
            <a-select-option v-for="cat in availableCategories" :key="cat" :value="cat">
              {{ cat }}
            </a-select-option>
          </a-select>
        </a-form-item>
        <a-form-item label="标签" name="tags">
          <a-select v-model:value="editForm.tags" mode="tags" placeholder="添加标签">
            <a-select-option v-for="tag in availableTags" :key="tag" :value="tag">
              {{ tag }}
            </a-select-option>
          </a-select>
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
import {
  Spin as ASpin,
  Form as AForm,
  FormItem as AFormItem,
  Button as AButton,
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

// 直接从路由参数获取ID
const musicId = route.params.id

const detail = ref<MusicDetail | null>(null)
const userInfo = ref<UserInfo>({
  userName: '无名',
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
const availableTags = ['热门', '流行', '经典', '现代', '舒缓', '激情', '派对', '工作', '放松']

// 获取用户信息 - 与MusicCard完全相同
const fetchUserInfo = async (userId: number) => {
  try {
    const res = await getUserByIdUsingGet({ id: userId })

    if (res.data.code === 0 && res.data.data) {
      userInfo.value = {
        userId: userId,
        userName: res.data.data.userName || '无名',
        userAvatar: res.data.data.userAvatar || 'https://via.placeholder.com/40',
      }
    } else {
      console.error('获取用户信息失败:', res.data.message)
      // 使用默认值
      userInfo.value = {
        userId: userId,
        userName: '无名',
        userAvatar: 'https://via.placeholder.com/40',
      }
    }
  } catch (err: any) {
    console.error('获取用户信息出错:', err)
    // 使用默认值
    userInfo.value = {
      userId: userId,
      userName: '无名',
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
      console.error('解析标签失败:', e)
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
          userName: '无名',
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
      errorMessage.value = res.data.message || '请求数据不存在'
      console.error('获取详情失败:', res.data)
      message.error(res.data.message || '加载详情失败')
    }
  } catch (err: any) {
    // 设置错误状态
    error.value = true
    errorMessage.value = err.message || '请求发生错误'
    console.error('获取详情出错:', err)
    message.error('错误: ' + err.message)
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
    const updateData = {
      id: musicForm.id,
      tags: musicForm.tags,
    }

    const response = await updateMusicFileUsingPost(updateData)

    if (response.data.code === 0 && response.data.data) {
      message.success('标签更新成功')

      // 更新当前显示的音乐信息
      if (detail.value) {
        detail.value.tags = musicForm.tags
      }
    } else {
      message.error('更新失败: ' + (response.data.message || '未知错误'))
    }
  } catch (error: any) {
    message.error('更新出错: ' + error.message)
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
      message.success('音乐信息编辑成功')
      editModalVisible.value = false

      // 刷新数据
      fetchDetail()
    } else {
      message.error('编辑失败: ' + (response.data.message || '未知错误'))
    }
  } catch (error: any) {
    message.error('编辑出错: ' + error.message)
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
      message.success('音乐已成功删除')
      router.push('/music')
    } else {
      message.error('删除失败: ' + (response.data.message || '未知错误'))
    }
  } catch (error: any) {
    message.error('删除出错: ' + error.message)
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
    message.error('无法播放：无效的音乐数据或URL')
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
</style>
