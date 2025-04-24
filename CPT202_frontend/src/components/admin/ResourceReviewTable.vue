<template>
  <div class="resource-review-table">
    <!-- 添加搜索表单 -->
    <div class="search-form">
      <a-row :gutter="16">
        <a-col :span="6">
          <a-input
            v-model:value="searchParams.name"
            placeholder="Resource Name"
            allow-clear
            @pressEnter="handleSearch"
          />
        </a-col>
        <a-col :span="6">
          <a-select
            v-model:value="searchParams.category"
            placeholder="Category"
            style="width: 100%"
            allow-clear
          >
            <a-select-option v-for="category in categories" :key="category" :value="category">
              {{ category }}
            </a-select-option>
          </a-select>
        </a-col>
        <a-col :span="6">
          <a-input
            v-model:value="searchParams.uploader"
            placeholder="User Account"
            allow-clear
            @pressEnter="handleSearch"
          />
        </a-col>
        <a-col :span="6">
          <a-space>
            <InteractiveHoverButton :text="'Search'" @click="handleSearch" />
            <InteractiveHoverButton :text="'Reset'" @click="handleReset" />
          </a-space>
        </a-col>
      </a-row>
    </div>

    <a-table
      :columns="columns"
      :data-source="dataList"
      :pagination="pagination"
      :loading="loading"
      @change="handleTableChange"
      rowKey="id"
    >
      <!-- 资源名称列 -->
      <template #bodyCell="{ column, record }">
        <template v-if="column.dataIndex === 'name'">
          <a @click="playMusic(record)">{{ record.name }}</a>
        </template>

        <!-- 封面图片列 -->
        <template v-if="column.dataIndex === 'coverUrl'">
          <a-image v-if="record.coverUrl" :src="record.coverUrl" :width="60" :preview="false" />
          <span v-else>No Cover</span>
        </template>

        <!-- 资源类型列 -->
        <template v-if="column.dataIndex === 'fileFormat'">
          <a-tag>{{ record.fileFormat }}</a-tag>
        </template>

        <!-- 状态列 -->
        <template v-if="column.dataIndex === 'reviewStatus'">
          <a-tag :color="getStatusColor(record.reviewStatus)">
            {{ getStatusText(record.reviewStatus) }}
          </a-tag>
        </template>

        <!-- 操作列 -->
        <template v-if="column.dataIndex === 'action'">
          <div class="action-buttons">
            <InteractiveHoverButton
              v-if="record.reviewStatus === 0"
              :text="t('message.approve') || 'Approve'"
              @click="approveResource(record)"
            />
            <InteractiveHoverButton
              v-if="record.reviewStatus === 0"
              :text="t('message.reject') || 'Reject'"
              @click="showRejectModal(record)"
            />
            <InteractiveHoverButton
              v-if="record.reviewStatus === 1"
              :text="t('message.reject') || 'Reject'"
              @click="showRejectModal(record)"
            />
            <InteractiveHoverButton
              :text="'Details'"
              @click="showDetailsModal(record)"
            />
          </div>
        </template>
      </template>
    </a-table>

    <!-- 拒绝理由弹窗 -->
    <a-modal
      v-model:visible="rejectModalVisible"
      title="Rejection Reason"
      @ok="handleRejectOk"
      :confirmLoading="confirmLoading"
    >
      <a-form :model="rejectForm">
        <a-form-item label="Rejection Reason" name="reviewMessage">
          <a-textarea
            v-model:value="rejectForm.reviewMessage"
            placeholder="Please enter rejection reason"
            :rows="4"
          />
        </a-form-item>
      </a-form>
    </a-modal>

    <!-- 资源详情弹窗 -->
    <a-modal v-model:visible="detailsModalVisible" title="Resource Details" width="700px" :footer="null">
      <div v-if="currentResource" class="resource-details">
        <div class="resource-cover">
          <a-image v-if="currentResource.coverUrl" :src="currentResource.coverUrl" :width="200" />
          <div v-else class="no-cover">No Cover</div>
        </div>
        <div class="resource-info">
          <a-descriptions :column="1" bordered>
            <a-descriptions-item label="Resource Name">{{ currentResource.name }}</a-descriptions-item>
            <a-descriptions-item label="Artist">{{
              currentResource.artist || 'Unknown'
            }}</a-descriptions-item>
            <a-descriptions-item label="Album">{{
              currentResource.album || 'Unknown'
            }}</a-descriptions-item>
            <a-descriptions-item label="Category">{{
              currentResource.category || 'Uncategorized'
            }}</a-descriptions-item>
            <a-descriptions-item label="File Format">{{
              currentResource.fileFormat
            }}</a-descriptions-item>
            <a-descriptions-item label="File Size">{{
              formatFileSize(currentResource.fileSize)
            }}</a-descriptions-item>
            <a-descriptions-item label="Duration">{{
              formatDuration(currentResource.duration)
            }}</a-descriptions-item>
            <a-descriptions-item label="Upload Time">{{
              formatTime(currentResource.createTime)
            }}</a-descriptions-item>
            <a-descriptions-item label="Uploader">
              <template v-if="currentResource.user && currentResource.user.userName">
                {{ currentResource.user.userName }}
                <a-tag v-if="currentResource.user.userAccount" color="blue" style="margin-left: 4px">
                  Account: {{ currentResource.user.userAccount }}
                </a-tag>
              </template>
              <template v-else-if="loadingUserInfo">
                <a-spin size="small" /> Loading...
              </template>
              <template v-else>
                <InteractiveHoverButton :text="'Load User Info'" @click="loadUserInfo(currentResource.userId)" />
              </template>
            </a-descriptions-item>
            <a-descriptions-item label="Description">{{
              currentResource.introduction || 'No description'
            }}</a-descriptions-item>
            <a-descriptions-item label="Review Status">
              <a-tag :color="getStatusColor(currentResource.reviewStatus)">
                {{ getStatusText(currentResource.reviewStatus) }}
              </a-tag>
            </a-descriptions-item>
            <a-descriptions-item v-if="currentResource.reviewTime" label="Review Time">
              {{ formatTime(currentResource.reviewTime) }}
            </a-descriptions-item>
            <a-descriptions-item v-if="currentResource.reviewMessage" label="Review Notes">
              {{ currentResource.reviewMessage }}
            </a-descriptions-item>
          </a-descriptions>
        </div>
        <div class="resource-actions">
          <InteractiveHoverButton :text="'Play'" @click="playMusic(currentResource)" />
          <InteractiveHoverButton
            v-if="currentResource.reviewStatus === 0"
            :text="t('message.approve') || 'Approve'"
            @click="approveResource(currentResource)"
          />
          <InteractiveHoverButton
            v-if="currentResource.reviewStatus === 0"
            :text="t('message.reject') || 'Reject'"
            @click="showRejectModal(currentResource)"
          />
          <InteractiveHoverButton
            v-if="currentResource.reviewStatus === 1"
            :text="t('message.reject') || 'Reject'"
            @click="showRejectModal(currentResource)"
          />
        </div>
      </div>
    </a-modal>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, defineProps, defineEmits, onMounted, computed } from 'vue'
import { message } from 'ant-design-vue'
import {
  listPendingMusicFilesUsingGet,
  listApprovedMusicFilesUsingGet,
  listRejectedMusicFilesUsingGet,
  reviewMusicFileUsingPost,
  streamAudioUsingGet,
  listMusicFileTagCategoryUsingGet,
  searchMusicFilesUsingGet,
  listMusicFileByPageUsingPost
} from '@/api/musicFileController'
import dayjs from 'dayjs'
import { playMusic as globalPlayMusic } from '@/utils/audioPlayerStore'
import { useI18n } from 'vue-i18n'
import InteractiveHoverButton from '@/components/ui/interactive-hover-button/InteractiveHoverButton.vue'

// 初始化i18n
const { t } = useI18n()

// 定义组件属性
const props = defineProps({
  status: {
    type: Number,
    required: true,
  },
})

// 定义事件
const emit = defineEmits(['refresh'])

// 表格数据
const dataList = ref<any[]>([])
const loading = ref(false)
const pagination = reactive({
  current: 1,
  pageSize: 10,
  total: 0,
  showSizeChanger: true,
  showTotal: (total: number) => `Total ${total} items`,
})

// 表格列定义
const columns = computed(() => [
  {
    title: 'ID',
    dataIndex: 'id',
    width: 80,
  },
  {
    title: 'Resource Name',
    dataIndex: 'name',
    width: 180,
  },
  {
    title: 'Cover',
    dataIndex: 'coverUrl',
    width: 100,
  },
  {
    title: 'Artist',
    dataIndex: 'artist',
    width: 120,
  },
  {
    title: 'Category',
    dataIndex: 'category',
    width: 100,
  },
  {
    title: 'Format',
    dataIndex: 'fileFormat',
    width: 80,
  },
  {
    title: 'Upload Time',
    dataIndex: 'createTime',
    width: 170,
    customRender: ({ text }: { text: string }) => formatTime(text),
  },
  {
    title: 'Status',
    dataIndex: 'reviewStatus',
    width: 100,
  },
  {
    title: 'Actions',
    dataIndex: 'action',
    width: 180,
  },
])

// 拒绝弹窗状态
const rejectModalVisible = ref(false)
const confirmLoading = ref(false)
const rejectForm = reactive({
  id: 0,
  reviewStatus: 2,
  reviewMessage: '',
})

// 详情弹窗状态
const detailsModalVisible = ref(false)
const currentResource = ref<any>(null)

// 用户信息相关
const loadingUserInfo = ref(false)

// 搜索参数
const searchParams = reactive({
  name: '',
  category: undefined,
  uploader: '',
})

// 分类列表
const categories = ref<string[]>([])

// 获取所有分类
const fetchCategories = async () => {
  try {
    const res = await listMusicFileTagCategoryUsingGet()
    if (res.data && res.data.data && res.data.data.categoryList) {
      categories.value = res.data.data.categoryList
    }
  } catch (error) {
    console.error('Failed to get categories:', error)
  }
}

// 处理搜索
const handleSearch = () => {
  pagination.current = 1 // 重置到第一页

  // 如果是搜索用户账户，使用专用搜索方法
  if (searchParams.uploader && searchParams.uploader.trim()) {
    searchByUserAccount()
  } else {
    fetchData()
  }
}

// 搜索用户账户的专用方法
const searchByUserAccount = async () => {
  loading.value = true

  try {
    // 首先获取所有资源
    const queryRequest: API.MusicFileQueryRequest = {
      current: 1,
      pageSize: 100, // 增大分页大小以获取更多结果
      reviewStatus: props.status,
    }

    const searchResponse = await listMusicFileByPageUsingPost(queryRequest)

    if (searchResponse?.data?.code === 0 && searchResponse.data.data) {
      const allRecords = searchResponse.data.data.records || []

      if (allRecords.length === 0) {
        dataList.value = []
        pagination.total = 0
        message.info('No resources found')
        loading.value = false
        return
      }

      message.loading('Searching for matching user accounts...', 0)

      // 引入用户接口
      const { getUserVoByIdUsingGet } = await import('@/api/userController')
      const matchedRecords = []
      const searchTerm = searchParams.uploader.trim().toLowerCase()

      // 处理每个资源记录
      for (const record of allRecords) {
        if (record.userId) {
          try {
            // 获取用户信息
            const userResponse = await getUserVoByIdUsingGet({ id: record.userId })

            if (userResponse.data.code === 0 && userResponse.data.data) {
              const userData = userResponse.data.data
              record.user = userData

              // 检查用户账户或用户名是否匹配
              const userAccount = (userData.userAccount || '').toLowerCase()
              const userName = (userData.userName || '').toLowerCase()

              if (userAccount.includes(searchTerm) || userName.includes(searchTerm)) {
                matchedRecords.push(record)
              }
            }
          } catch (error) {
            console.error('Failed to fetch user info:', error)
          }
        }
      }

      // 更新界面
      message.destroy()
      dataList.value = matchedRecords
      pagination.total = matchedRecords.length

      if (matchedRecords.length === 0) {
        message.info('No resources found with matching user account')
      } else {
        message.success(`Found ${matchedRecords.length} resources with matching user account`)
      }
    } else {
      dataList.value = []
      pagination.total = 0
      message.error('Failed to search resources')
    }
  } catch (error) {
    console.error('Search by user account failed:', error)
    message.error('Search failed')
    dataList.value = []
    pagination.total = 0
  } finally {
    loading.value = false
  }
}

// 重置搜索表单
const handleReset = () => {
  searchParams.name = ''
  searchParams.category = undefined
  searchParams.uploader = ''
  pagination.current = 1
  fetchData()
}

// 获取表格数据
const fetchData = async () => {
  loading.value = true

  try {
    // 如果有名称或分类搜索参数，使用POST查询接口
    if (searchParams.name || searchParams.category) {
      // 构建查询请求
      const queryRequest: API.MusicFileQueryRequest = {
        current: pagination.current,
        pageSize: pagination.pageSize,
        reviewStatus: props.status, // 重要：指定审核状态
        name: searchParams.name || undefined,
        category: searchParams.category || undefined
      }

      // 使用POST查询接口
      const searchResponse = await listMusicFileByPageUsingPost(queryRequest)

      if (searchResponse?.data?.code === 0 && searchResponse.data.data) {
        dataList.value = searchResponse.data.data.records || []
        pagination.total = searchResponse.data.data.total || 0

        if (dataList.value.length === 0) {
          message.info('No matching results found')
        }
      } else {
        dataList.value = []
        pagination.total = 0
        message.info('No matching results found')
      }
    } else {
      // 不搜索时使用原来的API
      const queryParams = {
        current: pagination.current,
        pageSize: pagination.pageSize
      }

      let res
      if (props.status === 0) {
        res = await listPendingMusicFilesUsingGet(queryParams)
      } else if (props.status === 1) {
        res = await listApprovedMusicFilesUsingGet(queryParams)
      } else if (props.status === 2) {
        res = await listRejectedMusicFilesUsingGet(queryParams)
      }

      if (res?.data?.code === 0 && res.data.data) {
        dataList.value = res.data.data.records || []
        pagination.total = res.data.data.total || 0
      } else {
        dataList.value = []
        pagination.total = 0
      }
    }
  } catch (error) {
    console.error('Failed to fetch data:', error)
    message.error('Failed to fetch data')
  } finally {
    loading.value = false
  }
}

// 表格变化事件处理
const handleTableChange = (pag: any) => {
  pagination.current = pag.current
  pagination.pageSize = pag.pageSize
  fetchData()
}

// 审核状态相关函数
const getStatusText = (status: number) => {
  switch (status) {
    case 0:
      return 'Pending'
    case 1:
      return 'Approved'
    case 2:
      return 'Rejected'
    default:
      return 'Unknown'
  }
}

const getStatusColor = (status: number) => {
  switch (status) {
    case 0:
      return 'blue'
    case 1:
      return 'green'
    case 2:
      return 'red'
    default:
      return 'default'
  }
}

// 审核操作函数
const approveResource = async (record: any) => {
  try {
    const response = await reviewMusicFileUsingPost({
      id: record.id,
      reviewStatus: 1,
      reviewMessage: 'Approved',
    })

    if (response.data.code === 0) {
      message.success('Resource approved')
      fetchData()
      emit('refresh')
    } else {
      message.error('Operation failed: ' + response.data.message)
    }
  } catch (error) {
    console.error('Approval failed:', error)
    message.error('Approval failed')
  }
}

const showRejectModal = (record: any) => {
  rejectForm.id = record.id || 0
  rejectForm.reviewMessage = ''
  rejectModalVisible.value = true
}

const handleRejectOk = async () => {
  if (!rejectForm.reviewMessage.trim()) {
    message.warning('Please enter rejection reason')
    return
  }

  confirmLoading.value = true
  try {
    const response = await reviewMusicFileUsingPost({
      id: rejectForm.id,
      reviewStatus: 2,
      reviewMessage: rejectForm.reviewMessage,
    })

    if (response.data.code === 0) {
      message.success('Resource rejected')
      rejectModalVisible.value = false
      fetchData()
      emit('refresh')
    } else {
      message.error('Operation failed: ' + response.data.message)
    }
  } catch (error) {
    console.error('Rejection failed:', error)
    message.error('Rejection failed')
  } finally {
    confirmLoading.value = false
  }
}

// 详情弹窗函数
const showDetailsModal = (record: any) => {
  currentResource.value = record
  detailsModalVisible.value = true

  // 如果有用户ID但没有用户信息，自动加载用户信息
  if (record.userId && !record.user?.userName) {
    loadUserInfo(record.userId)
  }
}

// 播放音乐
const playMusic = async (record: any) => {
  if (!record || !record.id) {
    message.error('Invalid music file')
    return
  }

  try {
    // 如果直接有URL，使用它
    if (record.url) {
      globalPlayMusic({
        id: record.id,
        name: record.name || 'Unknown music',
        artist: record.artist || 'Unknown artist',
        coverUrl: record.coverUrl || '',
        url: record.url
      })
      message.success(`Now playing: ${record.name}`)
      return
    }

    // 否则使用流API
    message.loading('Loading audio...', 0)

    // 构建完整的API URL
    const streamUrl = `/api/musicfile/stream/${record.id}`

    // 获取音频流
    const response = await fetch(streamUrl, {
      method: 'GET',
      headers: {
        'Accept': 'audio/*'
      }
    })

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    // 获取blob数据
    const blob = await response.blob()

    // 创建本地URL
    const audioUrl = URL.createObjectURL(blob)

    // 使用全局播放器
    globalPlayMusic({
      id: record.id,
      name: record.name || 'Unknown music',
      artist: record.artist || 'Unknown artist',
      coverUrl: record.coverUrl || '',
      url: audioUrl
    })

    message.success(`Now playing: ${record.name}`)
  } catch (error) {
    console.error('Playback failed:', error)
    message.error('Audio playback failed, please try again')
  } finally {
    message.destroy() // 清除loading消息
  }
}

// 格式化函数
const formatTime = (time: string | null | undefined) => {
  if (!time) return 'Unknown'
  return dayjs(time).format('YYYY-MM-DD HH:mm:ss')
}

const formatFileSize = (size: number | null | undefined) => {
  if (!size) return 'Unknown'
  if (size < 1024) return size + ' B'
  if (size < 1024 * 1024) return (size / 1024).toFixed(2) + ' KB'
  return (size / (1024 * 1024)).toFixed(2) + ' MB'
}

const formatDuration = (seconds: number | null | undefined) => {
  if (!seconds) return 'Unknown'
  const minutes = Math.floor(seconds / 60)
  const remainingSeconds = seconds % 60
  return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`
}

// 加载用户信息
const loadUserInfo = async (userId: number) => {
  if (!userId) {
    message.warning('Cannot get uploader ID')
    return
  }

  loadingUserInfo.value = true
  try {
    // 引入用户接口
    const { getUserVoByIdUsingGet } = await import('@/api/userController')
    const response = await getUserVoByIdUsingGet({ id: userId })

    if (response.data.code === 0 && response.data.data) {
      // 更新当前资源的用户信息
      currentResource.value.user = response.data.data
      message.success('User information loaded')
    } else {
      message.error('Failed to get user information: ' + response.data.message)
    }
  } catch (error) {
    console.error('Failed to get user information:', error)
    message.error('Failed to get user information')
  } finally {
    loadingUserInfo.value = false
  }
}

// 组件挂载时加载数据
onMounted(() => {
  fetchCategories()
  fetchData()
})

// 暴露fetchData方法给父组件调用
defineExpose({
  fetchData,
})
</script>

<style scoped>
.resource-review-table {
  width: 100%;
  margin-bottom: 60px; /* 为底部播放条留出空间 */
}

.action-buttons {
  display: flex;
  align-items: center;
}

.resource-details {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.resource-cover {
  display: flex;
  justify-content: center;
}

.no-cover {
  width: 200px;
  height: 200px;
  background-color: #f0f0f0;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #999;
}

.resource-actions {
  margin-top: 20px;
  display: flex;
  justify-content: center;
}

.search-form {
  margin-bottom: 16px;
}
</style>
