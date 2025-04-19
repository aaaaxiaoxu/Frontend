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
          <a-image
            v-if="record.coverUrl"
            :src="record.coverUrl"
            :width="60"
            :preview="false"
          />
          <span v-else>无封面</span>
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
            <a-button
              v-if="record.reviewStatus === 0"
              type="primary"
              size="small"
              @click="approveResource(record)"
            >
              通过
            </a-button>
            <a-button
              v-if="record.reviewStatus === 0"
              type="primary"
              danger
              size="small"
              style="margin-left: 8px"
              @click="showRejectModal(record)"
            >
              拒绝
            </a-button>
            <a-button
              type="link"
              size="small"
              @click="showDetailsModal(record)"
            >
              详情
            </a-button>
          </div>
        </template>
      </template>
    </a-table>

    <!-- 拒绝理由弹窗 -->
    <a-modal
      v-model:visible="rejectModalVisible"
      title="拒绝理由"
      @ok="handleRejectOk"
      :confirmLoading="confirmLoading"
    >
      <a-form :model="rejectForm">
        <a-form-item label="拒绝理由" name="reviewMessage">
          <a-textarea
            v-model:value="rejectForm.reviewMessage"
            placeholder="请输入拒绝理由"
            :rows="4"
          />
        </a-form-item>
      </a-form>
    </a-modal>

    <!-- 资源详情弹窗 -->
    <a-modal
      v-model:visible="detailsModalVisible"
      title="资源详情"
      width="700px"
      :footer="null"
    >
      <div v-if="currentResource" class="resource-details">
        <div class="resource-cover">
          <a-image
            v-if="currentResource.coverUrl"
            :src="currentResource.coverUrl"
            :width="200"
          />
          <div v-else class="no-cover">无封面</div>
        </div>
        <div class="resource-info">
          <a-descriptions :column="1" bordered>
            <a-descriptions-item label="资源名称">{{ currentResource.name }}</a-descriptions-item>
            <a-descriptions-item label="艺术家">{{ currentResource.artist || '未知' }}</a-descriptions-item>
            <a-descriptions-item label="专辑">{{ currentResource.album || '未知' }}</a-descriptions-item>
            <a-descriptions-item label="分类">{{ currentResource.category || '未分类' }}</a-descriptions-item>
            <a-descriptions-item label="文件格式">{{ currentResource.fileFormat }}</a-descriptions-item>
            <a-descriptions-item label="文件大小">{{ formatFileSize(currentResource.fileSize) }}</a-descriptions-item>
            <a-descriptions-item label="时长">{{ formatDuration(currentResource.duration) }}</a-descriptions-item>
            <a-descriptions-item label="上传时间">{{ formatTime(currentResource.createTime) }}</a-descriptions-item>
            <a-descriptions-item label="上传用户">{{ currentResource.user?.userName || '未知用户' }}</a-descriptions-item>
            <a-descriptions-item label="简介">{{ currentResource.introduction || '无简介' }}</a-descriptions-item>
            <a-descriptions-item label="审核状态">
              <a-tag :color="getStatusColor(currentResource.reviewStatus)">
                {{ getStatusText(currentResource.reviewStatus) }}
              </a-tag>
            </a-descriptions-item>
            <a-descriptions-item v-if="currentResource.reviewTime" label="审核时间">
              {{ formatTime(currentResource.reviewTime) }}
            </a-descriptions-item>
            <a-descriptions-item v-if="currentResource.reviewMessage" label="审核备注">
              {{ currentResource.reviewMessage }}
            </a-descriptions-item>
          </a-descriptions>
        </div>
        <div class="resource-actions">
          <a-button type="primary" @click="playMusic(currentResource)">播放</a-button>
          <a-button v-if="currentResource.reviewStatus === 0" type="primary" style="margin-left: 8px" @click="approveResource(currentResource)">通过</a-button>
          <a-button v-if="currentResource.reviewStatus === 0" type="primary" danger style="margin-left: 8px" @click="showRejectModal(currentResource)">拒绝</a-button>
        </div>
      </div>
    </a-modal>

    <!-- 音频播放器弹窗 -->
    <a-modal
      v-model:visible="audioPlayerVisible"
      title="音频播放"
      :footer="null"
      width="500px"
    >
      <div v-if="currentPlayingUrl" class="audio-player-container">
        <audio controls autoplay style="width: 100%">
          <source :src="currentPlayingUrl" :type="`audio/${currentPlayingFormat}`" />
          您的浏览器不支持音频播放
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
  reviewMusicFileUsingPost
} from '@/api/musicFileController'
import dayjs from 'dayjs'

// 定义组件属性
const props = defineProps({
  status: {
    type: Number,
    required: true
  }
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
  showTotal: (total: number) => `共 ${total} 条`
})

// 表格列定义
const columns = [
  {
    title: 'ID',
    dataIndex: 'id',
    width: 80
  },
  {
    title: '资源名称',
    dataIndex: 'name',
    width: 180
  },
  {
    title: '封面',
    dataIndex: 'coverUrl',
    width: 100
  },
  {
    title: '艺术家',
    dataIndex: 'artist',
    width: 120
  },
  {
    title: '分类',
    dataIndex: 'category',
    width: 100
  },
  {
    title: '格式',
    dataIndex: 'fileFormat',
    width: 80
  },
  {
    title: '上传时间',
    dataIndex: 'createTime',
    width: 170,
    customRender: ({ text }) => formatTime(text)
  },
  {
    title: '审核状态',
    dataIndex: 'reviewStatus',
    width: 100
  },
  {
    title: '操作',
    dataIndex: 'action',
    width: 180
  }
]

// 拒绝弹窗状态
const rejectModalVisible = ref(false)
const confirmLoading = ref(false)
const rejectForm = reactive({
  id: null,
  reviewStatus: 2,
  reviewMessage: ''
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
      pageSize: pagination.pageSize
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
      message.error('获取数据失败：' + response.data.message)
    }
  } catch (error) {
    console.error('获取数据出错：', error)
    message.error('获取数据出错')
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
    case 0: return '待审核'
    case 1: return '已通过'
    case 2: return '已拒绝'
    default: return '未知'
  }
}

const getStatusColor = (status) => {
  switch (status) {
    case 0: return 'blue'
    case 1: return 'green'
    case 2: return 'red'
    default: return 'default'
  }
}

// 审核操作函数
const approveResource = async (record) => {
  try {
    const response = await reviewMusicFileUsingPost({
      id: record.id,
      reviewStatus: 1,
      reviewMessage: '审核通过'
    })

    if (response.data.code === 0) {
      message.success('资源审核通过')
      fetchData()
      emit('refresh')
    } else {
      message.error('操作失败：' + response.data.message)
    }
  } catch (error) {
    console.error('审核失败：', error)
    message.error('审核失败')
  }
}

const showRejectModal = (record) => {
  rejectForm.id = record.id
  rejectForm.reviewMessage = ''
  rejectModalVisible.value = true
}

const handleRejectOk = async () => {
  if (!rejectForm.reviewMessage.trim()) {
    message.warning('请输入拒绝理由')
    return
  }

  confirmLoading.value = true
  try {
    const response = await reviewMusicFileUsingPost({
      id: rejectForm.id,
      reviewStatus: 2,
      reviewMessage: rejectForm.reviewMessage
    })

    if (response.data.code === 0) {
      message.success('已拒绝该资源')
      rejectModalVisible.value = false
      fetchData()
      emit('refresh')
    } else {
      message.error('操作失败：' + response.data.message)
    }
  } catch (error) {
    console.error('拒绝失败：', error)
    message.error('拒绝失败')
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
  if (!time) return '未知'
  return dayjs(time).format('YYYY-MM-DD HH:mm:ss')
}

const formatFileSize = (size) => {
  if (!size) return '未知'
  if (size < 1024) return size + ' B'
  if (size < 1024 * 1024) return (size / 1024).toFixed(2) + ' KB'
  return (size / (1024 * 1024)).toFixed(2) + ' MB'
}

const formatDuration = (seconds) => {
  if (!seconds) return '未知'
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
  fetchData
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
</style>
