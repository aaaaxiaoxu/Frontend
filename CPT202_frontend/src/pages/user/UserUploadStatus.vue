<template>
  <div class="container mx-auto py-8 px-4">
    <h1 class="text-2xl font-bold mb-6">{{ t('message.myUploads') }}</h1>

    <!-- 搜索和过滤区域 -->
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
          <a-button type="primary" @click="handleSearch">{{ t('message.search') }}</a-button>
          <a-button @click="handleReset">{{ t('message.reset') }}</a-button>
        </div>
      </div>

      <!-- 状态过滤器 -->
      <div>
        <a-radio-group v-model:value="filterStatus" button-style="solid" @change="handleFilterChange">
          <a-radio-button value="all">{{ t('message.allStatus') }}</a-radio-button>
          <a-radio-button value="0">{{ t('message.pending') }}</a-radio-button>
          <a-radio-button value="1">{{ t('message.approved') }}</a-radio-button>
          <a-radio-button value="2">{{ t('message.rejected') }}</a-radio-button>
        </a-radio-group>
      </div>
    </div>

    <!-- 上传资源列表 -->
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

        <!-- 审核失败原因 -->
        <div v-if="getItemReviewStatus(item) === 2" class="mt-4 border-t pt-4">
          <div class="text-red-600 mb-2 font-medium">{{ t('message.rejectReason') }}:</div>
          <p class="text-gray-700">{{ getItemReviewMessage(item) || t('message.noRejectReason') }}</p>
        </div>

        <!-- 操作按钮 -->
        <div class="mt-4 flex justify-end">
          <a-button
            v-if="getItemReviewStatus(item) === 2"
            type="primary"
            @click="openEditModal(item)"
          >
            {{ t('message.edit') }}
          </a-button>
          <a-button
            class="ml-2"
            danger
            @click="confirmDelete(item.id)"
          >
            {{ t('message.delete') }}
          </a-button>
        </div>
      </a-card>
    </div>

    <!-- 分页 -->
    <div class="mt-6 flex justify-center">
      <a-pagination
        v-model:current="current"
        :total="total"
        :pageSize="pageSize"
        @change="handlePageChange"
        show-quick-jumper
      />
    </div>

    <!-- 编辑弹窗 -->
    <music-edit-modal
      v-if="selectedMusic"
      v-model:visible="editModalVisible"
      :musicFile="selectedMusic"
      @success="handleEditSuccess"
    />
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
import MusicEditModal from '@/components/MusicEditModal.vue'

// 扩展 MusicFile 类型来包含 reviewStatus 和 reviewMessage
type ExtendedMusicFileVO = API.MusicFileVO & {
  reviewStatus?: number;
  reviewMessage?: string;
}

export default defineComponent({
  components: {
    InboxOutlined,
    MusicEditModal
  },
  setup() {
    const { t } = useI18n()
    const loginUserStore = useLoginUserStore()

    // 状态和数据
    const loading = ref(true)
    const musicList = ref<ExtendedMusicFileVO[]>([])
    const current = ref(1)
    const pageSize = ref(10)
    const total = ref(0)
    const filterStatus = ref('all')
    const editModalVisible = ref(false)
    const selectedMusic = ref<ExtendedMusicFileVO | null>(null)
    const categories = ref<string[]>([])

    // 搜索参数
    const searchParams = reactive({
      name: '',
      category: undefined as string | undefined
    })

    // 获取分类列表
    const fetchCategories = async () => {
      try {
        const res = await listMusicFileTagCategoryUsingGet()
        if (res.data && res.data.data && res.data.data.categoryList) {
          categories.value = res.data.data.categoryList
        }
      } catch (error) {
        console.error('获取分类失败:', error)
      }
    }

    // 处理搜索
    const handleSearch = () => {
      current.value = 1 // 重置到第一页
      fetchUserUploads()
    }

    // 重置搜索表单
    const handleReset = () => {
      searchParams.name = ''
      searchParams.category = undefined
      current.value = 1
      fetchUserUploads()
    }

    // 获取用户上传的音乐资源
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

        // 添加状态过滤
        if (filterStatus.value !== 'all') {
          params.reviewStatus = parseInt(filterStatus.value)
        }

        const res = await listMusicFileByPageUsingPost(params)

        if (res.data.code === 0 && res.data.data) {
          // 直接使用返回的数据，因为 listMusicFileByPageUsingPost 已经包含了审核信息
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

    // 获取项目的审核状态
    const getItemReviewStatus = (item: ExtendedMusicFileVO): number => {
      return item.reviewStatus ?? 0
    }

    // 获取项目的审核消息
    const getItemReviewMessage = (item: ExtendedMusicFileVO): string => {
      return item.reviewMessage ?? ''
    }

    // 分页变化
    const handlePageChange = (page: number) => {
      current.value = page
      fetchUserUploads()
    }

    // 状态过滤变化
    const handleFilterChange = () => {
      current.value = 1 // 重置到第一页
      fetchUserUploads()
    }

    // 格式化日期
    const formatDate = (dateStr?: string) => {
      if (!dateStr) return ''
      return dayjs(dateStr).format('YYYY-MM-DD HH:mm')
    }

    // 获取状态文本
    const getStatusText = (status: number) => {
      switch (status) {
        case 0: return t('message.pending')
        case 1: return t('message.approved')
        case 2: return t('message.rejected')
        default: return t('message.unknown')
      }
    }

    // 获取状态颜色
    const getStatusColor = (status: number) => {
      switch (status) {
        case 0: return 'gold'
        case 1: return 'green'
        case 2: return 'red'
        default: return 'default'
      }
    }

    // 打开编辑弹窗
    const openEditModal = (music: ExtendedMusicFileVO) => {
      selectedMusic.value = music
      editModalVisible.value = true
    }

    // 处理编辑成功
    const handleEditSuccess = () => {
      message.success(t('message.editSuccess'))
      fetchUserUploads()
      editModalVisible.value = false
    }

    // 确认删除
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

    // 初始化时加载数据
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
      editModalVisible,
      selectedMusic,
      getItemReviewStatus,
      getItemReviewMessage,
      formatDate,
      getStatusText,
      getStatusColor,
      handleSearch,
      handleReset,
      handlePageChange,
      handleFilterChange,
      openEditModal,
      handleEditSuccess,
      confirmDelete
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
</style>
