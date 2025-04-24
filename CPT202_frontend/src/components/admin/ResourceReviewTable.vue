<template>
  <div class="resource-review-table">
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
          <span v-else>{{ t('message.noCover') }}</span>
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
              :text="t('message.approve')"
              @click="approveResource(record)"
              class="mr-2"
            />
            <InteractiveHoverButton
              v-if="record.reviewStatus === 0"
              :text="t('message.reject')"
              @click="showRejectModal(record)"
              class="mr-2"
            />
            <InteractiveHoverButton 
              :text="t('message.details')" 
              @click="showDetailsModal(record)" 
            />
          </div>
        </template>
      </template>
    </a-table>

    <!-- 拒绝理由弹窗 -->
    <a-modal
      v-model:visible="rejectModalVisible"
      :title="t('message.rejectReason')"
      @ok="handleRejectOk"
      :confirmLoading="confirmLoading"
    >
      <a-form :model="rejectForm">
        <a-form-item :label="t('message.rejectReason')" name="reviewMessage">
          <a-textarea
            v-model:value="rejectForm.reviewMessage"
            :placeholder="t('message.enterRejectReason')"
            :rows="4"
          />
        </a-form-item>
      </a-form>
    </a-modal>

    <!-- 资源详情弹窗 -->
    <a-modal v-model:visible="detailsModalVisible" :title="t('message.resourceDetails')" width="700px" :footer="null">
      <div v-if="currentResource" class="resource-details">
        <div class="resource-cover">
          <a-image v-if="currentResource.coverUrl" :src="currentResource.coverUrl" :width="200" />
          <div v-else class="no-cover">{{ t('message.noCover') }}</div>
        </div>
        <div class="resource-info">
          <a-descriptions :column="1" bordered>
            <a-descriptions-item :label="t('message.resourceName')">{{ currentResource.name }}</a-descriptions-item>
            <a-descriptions-item :label="t('message.artist')">{{
              currentResource.artist || t('message.unknown')
            }}</a-descriptions-item>
            <a-descriptions-item :label="t('message.album')">{{
              currentResource.album || t('message.unknown')
            }}</a-descriptions-item>
            <a-descriptions-item :label="t('message.category')">{{
              currentResource.category || t('message.uncategorized')
            }}</a-descriptions-item>
            <a-descriptions-item :label="t('message.fileFormat')">{{
              currentResource.fileFormat
            }}</a-descriptions-item>
            <a-descriptions-item :label="t('message.fileSize')">{{
              formatFileSize(currentResource.fileSize)
            }}</a-descriptions-item>
            <a-descriptions-item :label="t('message.duration')">{{
              formatDuration(currentResource.duration)
            }}</a-descriptions-item>
            <a-descriptions-item :label="t('message.uploadTime')">{{
              formatTime(currentResource.createTime)
            }}</a-descriptions-item>
            <a-descriptions-item :label="t('message.uploader')">{{
              currentResource.user?.userName || t('message.unknownUser')
            }}</a-descriptions-item>
            <a-descriptions-item :label="t('message.introduction')">{{
              currentResource.introduction || t('message.noIntroduction')
            }}</a-descriptions-item>
            <a-descriptions-item :label="t('message.reviewStatus')">
              <a-tag :color="getStatusColor(currentResource.reviewStatus)">
                {{ getStatusText(currentResource.reviewStatus) }}
              </a-tag>
            </a-descriptions-item>
            <a-descriptions-item v-if="currentResource.reviewTime" :label="t('message.reviewTime')">
              {{ formatTime(currentResource.reviewTime) }}
            </a-descriptions-item>
            <a-descriptions-item v-if="currentResource.reviewMessage" :label="t('message.reviewNote')">
              {{ currentResource.reviewMessage }}
            </a-descriptions-item>
          </a-descriptions>
        </div>
        <div class="resource-actions">
          <InteractiveHoverButton :text="t('message.play')" @click="playMusic(currentResource)" class="mr-2" />
          <InteractiveHoverButton
            v-if="currentResource.reviewStatus === 0"
            :text="t('message.approve')"
            @click="approveResource(currentResource)"
            class="mr-2"
          />
          <InteractiveHoverButton
            v-if="currentResource.reviewStatus === 0"
            :text="t('message.reject')"
            @click="showRejectModal(currentResource)"
          />
        </div>
      </div>
    </a-modal>

    <!-- 音频播放器弹窗 -->
    <a-modal v-model:visible="audioPlayerVisible" :title="t('message.audioPlayer')" :footer="null" width="500px">
      <div v-if="currentPlayingUrl" class="audio-player-container">
        <audio controls autoplay style="width: 100%">
          <source :src="currentPlayingUrl" :type="`audio/${currentPlayingFormat}`" />
          {{ t('message.browserNotSupport') }}
        </audio>
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
} from '@/api/musicFileController'
import dayjs from 'dayjs'
import { useI18n } from 'vue-i18n'
import InteractiveHoverButton from '@/components/ui/interactive-hover-button/InteractiveHoverButton.vue'

// i18n
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
const dataList = ref([])
const loading = ref(false)
const pagination = reactive({
  current: 1,
  pageSize: 10,
  total: 0,
  showSizeChanger: true,
  showTotal: (total: number) => `${t('message.total')}: ${total}`,
})

// 表格列定义
const columns = computed(() => [
  {
    title: 'ID',
    dataIndex: 'id',
    width: 80,
  },
  {
    title: t('message.resourceName'),
    dataIndex: 'name',
    width: 180,
  },
  {
    title: t('message.cover'),
    dataIndex: 'coverUrl',
    width: 100,
  },
  {
    title: t('message.artist'),
    dataIndex: 'artist',
    width: 120,
  },
  {
    title: t('message.category'),
    dataIndex: 'category',
    width: 100,
  },
  {
    title: t('message.format'),
    dataIndex: 'fileFormat',
    width: 80,
  },
  {
    title: t('message.uploadTime'),
    dataIndex: 'createTime',
    width: 170,
    customRender: ({ text }) => formatTime(text),
  },
  {
    title: t('message.reviewStatus'),
    dataIndex: 'reviewStatus',
    width: 100,
  },
  {
    title: t('message.action'),
    dataIndex: 'action',
    width: 180,
  },
])

// 拒绝弹窗状态
const rejectModalVisible = ref(false)
const confirmLoading = ref(false)
const rejectForm = reactive({
  id: null,
  reviewStatus: 2,
  reviewMessage: '',
})

// 详情弹窗状态
const detailsModalVisible = ref(false)
const currentResource = ref(null)

// 音频播放器状态
const audioPlayerVisible = ref(false)
const currentPlayingUrl = ref('')
const currentPlayingFormat = ref('mp3')

// 获取表格数据
const fetchData = async () => {
  loading.value = true
  try {
    const params = {
      current: pagination.current,
      pageSize: pagination.pageSize,
    }

    let response

    switch (props.status) {
      case 0: // 待审核
        response = await listPendingMusicFilesUsingGet(params)
        break
      case 1: // 已通过
        response = await listApprovedMusicFilesUsingGet(params)
        break
      case 2: // 已拒绝
        response = await listRejectedMusicFilesUsingGet(params)
        break
      default:
        response = await listPendingMusicFilesUsingGet(params)
    }

    if (response.data.code === 0) {
      dataList.value = response.data.data.records || []
      pagination.total = response.data.data.total || 0
    } else {
      message.error(t('message.fetchDataFailed') + ': ' + response.data.message)
    }
  } catch (error) {
    console.error(t('message.fetchDataError') + ':', error)
    message.error(t('message.fetchDataError'))
  } finally {
    loading.value = false
  }
}

// 表格变化事件处理
const handleTableChange = (pag) => {
  pagination.current = pag.current
  pagination.pageSize = pag.pageSize
  fetchData()
}

// 审核状态相关函数
const getStatusText = (status) => {
  switch (status) {
    case 0:
      return t('message.pending')
    case 1:
      return t('message.approved')
    case 2:
      return t('message.rejected')
    default:
      return t('message.unknown')
  }
}

const getStatusColor = (status) => {
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
const approveResource = async (record) => {
  try {
    const response = await reviewMusicFileUsingPost({
      id: record.id,
      reviewStatus: 1,
      reviewMessage: t('message.reviewApproved'),
    })

    if (response.data.code === 0) {
      message.success(t('message.resourceApproved'))
      fetchData()
      emit('refresh')
    } else {
      message.error(t('message.operationFailed') + ': ' + response.data.message)
    }
  } catch (error) {
    console.error(t('message.reviewFailed') + ':', error)
    message.error(t('message.reviewFailed'))
  }
}

const showRejectModal = (record) => {
  rejectForm.id = record.id
  rejectForm.reviewMessage = ''
  rejectModalVisible.value = true
}

const handleRejectOk = async () => {
  if (!rejectForm.reviewMessage.trim()) {
    message.warning(t('message.pleaseEnterRejectReason'))
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
      message.success(t('message.resourceRejected'))
      rejectModalVisible.value = false
      fetchData()
      emit('refresh')
    } else {
      message.error(t('message.operationFailed') + ': ' + response.data.message)
    }
  } catch (error) {
    console.error(t('message.rejectFailed') + ':', error)
    message.error(t('message.rejectFailed'))
  } finally {
    confirmLoading.value = false
  }
}

// 详情弹窗函数
const showDetailsModal = (record) => {
  currentResource.value = record
  detailsModalVisible.value = true
}

// 播放音乐
const playMusic = (record) => {
  currentPlayingUrl.value = record.url
  currentPlayingFormat.value = record.fileFormat || 'mp3'
  audioPlayerVisible.value = true
}

// 格式化函数
const formatTime = (time) => {
  if (!time) return t('message.unknown')
  return dayjs(time).format('YYYY-MM-DD HH:mm:ss')
}

const formatFileSize = (size) => {
  if (!size) return t('message.unknown')
  if (size < 1024) return size + ' B'
  if (size < 1024 * 1024) return (size / 1024).toFixed(2) + ' KB'
  return (size / (1024 * 1024)).toFixed(2) + ' MB'
}

const formatDuration = (seconds) => {
  if (!seconds) return t('message.unknown')
  const minutes = Math.floor(seconds / 60)
  const remainingSeconds = seconds % 60
  return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`
}

// 组件挂载时加载数据
onMounted(() => {
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

.audio-player-container {
  display: flex;
  justify-content: center;
  padding: 10px;
}

.mr-2 {
  margin-right: 8px;
}
</style>
