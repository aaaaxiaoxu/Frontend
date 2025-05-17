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
            class="search-input"
          />
        </a-col>
        <a-col :span="6">
          <a-select
            v-model:value="searchParams.category"
            placeholder="Category"
            style="width: 100%"
            allow-clear
            class="search-input"
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
            class="search-input"
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


const { t } = useI18n()


const props = defineProps({
  status: {
    type: Number,
    required: true,
  },
})


const emit = defineEmits(['refresh'])


const dataList = ref<any[]>([])
const loading = ref(false)
const pagination = reactive({
  current: 1,
  pageSize: 10,
  total: 0,
  showSizeChanger: true,
  showTotal: (total: number) => `Total ${total} items`,
})


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


const rejectModalVisible = ref(false)
const confirmLoading = ref(false)
const rejectForm = reactive({
  id: 0,
  reviewStatus: 2,
  reviewMessage: '',
})


const detailsModalVisible = ref(false)
const currentResource = ref<any>(null)


const loadingUserInfo = ref(false)


const searchParams = reactive({
  name: '',
  category: undefined,
  uploader: '',
})


const categories = ref<string[]>([])


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


const handleSearch = () => {
  pagination.current = 1


  if (searchParams.uploader && searchParams.uploader.trim()) {
    searchByUserAccount()
  } else {
    fetchData()
  }
}


const searchByUserAccount = async () => {
  loading.value = true

  try {

    const queryRequest: API.MusicFileQueryRequest = {
      current: 1,
      pageSize: 100,
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


      const { getUserVoByIdUsingGet } = await import('@/api/userController')
      const matchedRecords = []
      const searchTerm = searchParams.uploader.trim().toLowerCase()


      for (const record of allRecords) {
        if (record.userId) {
          try {

            const userResponse = await getUserVoByIdUsingGet({ id: record.userId })

            if (userResponse.data.code === 0 && userResponse.data.data) {
              const userData = userResponse.data.data
              record.user = userData


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


const handleReset = () => {
  searchParams.name = ''
  searchParams.category = undefined
  searchParams.uploader = ''
  pagination.current = 1
  fetchData()
}


const fetchData = async () => {
  loading.value = true

  try {

    if (searchParams.name || searchParams.category) {

      const queryRequest: API.MusicFileQueryRequest = {
        current: pagination.current,
        pageSize: pagination.pageSize,
        reviewStatus: props.status,
        name: searchParams.name || undefined,
        category: searchParams.category || undefined
      }


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


const handleTableChange = (pag: any) => {
  pagination.current = pag.current
  pagination.pageSize = pag.pageSize
  fetchData()
}


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


const showDetailsModal = (record: any) => {
  currentResource.value = record
  detailsModalVisible.value = true


  if (record.userId && !record.user?.userName) {
    loadUserInfo(record.userId)
  }
}


const playMusic = async (record: any) => {
  if (!record || !record.id) {
    message.error('Invalid music file')
    return
  }

  try {

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


    message.loading('Loading audio...', 0)


    const streamUrl = `/api/musicfile/stream/${record.id}`


    const response = await fetch(streamUrl, {
      method: 'GET',
      headers: {
        'Accept': 'audio/*'
      }
    })

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }


    const blob = await response.blob()


    const audioUrl = URL.createObjectURL(blob)


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
    message.destroy()
  }
}


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


const loadUserInfo = async (userId: number) => {
  if (!userId) {
    message.warning('Cannot get uploader ID')
    return
  }

  loadingUserInfo.value = true
  try {

    const { getUserVoByIdUsingGet } = await import('@/api/userController')
    const response = await getUserVoByIdUsingGet({ id: userId })

    if (response.data.code === 0 && response.data.data) {

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


onMounted(() => {
  fetchCategories()
  fetchData()
})


defineExpose({
  fetchData,
})
</script>

<style scoped>
.resource-review-table {
  width: 100%;
  margin-bottom: 60px;
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
  text-align: center;
}

.no-cover {
  width: 200px;
  height: 200px;
  background-color: #f0f0f0;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto;
}

.resource-actions {
  margin-top: 16px;
  display: flex;
  gap: 8px;
}

.search-form {
  margin-bottom: 16px;
}

.search-input {
  width: 100%;
  border-radius: 4px;
  height: 32px;
  background-color: #ffffff !important;
  color: rgba(0, 0, 0, 0.85) !important;
  border: 1px solid #d9d9d9 !important;
}

.search-input::placeholder {
  color: rgba(0, 0, 0, 0.45) !important;
}

.search-input .ant-input {
  background-color: #ffffff !important;
  color: rgba(0, 0, 0, 0.85) !important;
}

.ant-select-selector {
  background-color: #ffffff !important;
  color: rgba(0, 0, 0, 0.85) !important;
  border-color: #d9d9d9 !important;
}

.ant-select-selection-placeholder {
  color: rgba(0, 0, 0, 0.45) !important;
}

/* 移除黑夜模式特定的搜索框样式，使搜索框样式在黑夜模式下也保持一致 */
/* 
[data-theme='dark'] .search-input,
[data-theme='dark'] .search-input .ant-input,
[data-theme='dark'] .ant-select-selector {
  background-color: #1f1f1f;
  color: rgba(255, 255, 255, 0.85);
  border-color: #303030;
}

[data-theme='dark'] .search-input::placeholder,
[data-theme='dark'] .ant-select-selection-placeholder {
  color: rgba(255, 255, 255, 0.45);
}
*/

[data-theme='dark'] .no-cover {
  background-color: #1e1e1e;
  color: rgba(255, 255, 255, 0.85);
}
</style>

<!-- 添加全局样式（不使用scoped）以覆盖Ant Design的默认行为 -->
<style>
/* 禁用黑夜模式下的表格行悬停效果 */
[data-theme='dark'] .ant-table-tbody > tr.ant-table-row:hover,
[data-theme='dark'] .ant-table-tbody > tr.ant-table-row:hover > td,
[data-theme='dark'] .ant-table-tbody > tr:hover,
[data-theme='dark'] .ant-table-tbody > tr:hover > td,
[data-theme='dark'] .ant-table-tbody > tr.ant-table-row-hover,
[data-theme='dark'] .ant-table-tbody > tr.ant-table-row-hover > td,
[data-theme='dark'] .ant-table-tbody > tr > td.ant-table-cell-row-hover {
  background-color: transparent !important;
}

/* 确保搜索框在黑夜模式下保持白色 */
.resource-review-table .ant-input,
.resource-review-table .ant-select .ant-select-selector {
  background-color: #ffffff !important;
  color: rgba(0, 0, 0, 0.85) !important;
  border-color: #d9d9d9 !important;
}

.resource-review-table .ant-input::placeholder,
.resource-review-table .ant-select-selection-placeholder {
  color: rgba(0, 0, 0, 0.45) !important;
}

.resource-review-table .ant-select-dropdown {
  background-color: #ffffff !important;
  color: rgba(0, 0, 0, 0.85) !important;
}

.resource-review-table .ant-select-item {
  color: rgba(0, 0, 0, 0.85) !important;
}

.resource-review-table .ant-select-item-option-selected {
  background-color: #e6f7ff !important;
}

.resource-review-table .ant-select-item-option-active {
  background-color: #f5f5f5 !important;
}

/* 黑夜模式下的表格样式 */
[data-theme='dark'] .resource-review-table {
  background-color: #141414;
  color: rgba(255, 255, 255, 0.85);
}

/* 黑夜模式下的模态框样式 */
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

/* 黑夜模式下的表单元素样式 */
[data-theme='dark'] .ant-form-item-label > label {
  color: rgba(255, 255, 255, 0.85);
}

[data-theme='dark'] .ant-form textarea.ant-input {
  background-color: #141414 !important;
  color: rgba(255, 255, 255, 0.85) !important;
  border-color: #434343 !important;
}

/* 黑夜模式下的描述列表样式 */
[data-theme='dark'] .ant-descriptions-bordered .ant-descriptions-item-label,
[data-theme='dark'] .ant-descriptions-bordered .ant-descriptions-item-content {
  background-color: #1f1f1f;
  border-color: #303030;
  color: rgba(255, 255, 255, 0.85);
}

/* 黑夜模式下的链接样式 */
[data-theme='dark'] a {
  color: #177ddc;
}

[data-theme='dark'] a:hover {
  color: #165996;
}

/* 黑夜模式下的加载指示器样式 */
[data-theme='dark'] .ant-spin-dot-item {
  background-color: #177ddc;
}
</style>
