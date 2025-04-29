<template>
  <a-layout class="music-page-layout">
    <!-- Main Content Area -->
    <a-layout-content :style="{ padding: '0 24px', minHeight: '280px' }">
      <div :style="{ background: '#fff', padding: '24px', margin: 0 }">
        <a-breadcrumb :style="{ margin: '16px 0' }">
          <a-breadcrumb-item>Search Results for: {{ searchKeyword }}</a-breadcrumb-item>
        </a-breadcrumb>
        <a-row :gutter="[16, 16]">
          <a-col :xs="24" :sm="12" :md="8" :lg="6" v-for="item in musicList" :key="item.id">
            <div class="music-card-wrapper" @click="showMusicDetails(item)">
              <music-card
                :id="item.id"
                :name="item.name"
                :coverUrl="item.coverUrl"
                :url="item.url"
                :artist="item.artist || '未知艺术家'"
                :category="item.category"
                @download.stop="handleDownload(item)"
                @edit.stop="handleEdit(item)"
                @delete.stop="handleDelete(item.id)"
                @play.stop="handlePlay(item)"
              />
            </div>
          </a-col>
        </a-row>
        <a-pagination
          v-model:current="pagination.current"
          :total="pagination.total"
          :pageSize="pagination.pageSize"
          :pageSizeOptions="['12', '24', '36', '48']"
          showSizeChanger
          @change="(page, pageSize) => handlePaginationChange(page, pageSize)"
          style="text-align: center; margin-top: 24px"
        />
      </div>
    </a-layout-content>
  </a-layout>
</template>

<script setup lang="ts">
import { ref, onMounted, reactive, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import {
  Layout as ALayout,
  LayoutContent as ALayoutContent,
  Breadcrumb as ABreadcrumb,
  BreadcrumbItem as ABreadcrumbItem,
  message,
  Row as ARow,
  Col as ACol,
  Pagination as APagination,
} from 'ant-design-vue'
import MusicCard from '@/components/MusicCard.vue'
import { searchMusicFilesUsingGet } from '@/api/musicFileController'
import { useMusicStore } from '@/stores/musicStore'

const route = useRoute()
const router = useRouter()
const musicList = ref<API.MusicFileVO[]>([])
const loading = ref(false)
const searchKeyword = ref('')
const musicStore = useMusicStore()

const pagination = reactive({
  current: 1,
  pageSize: 12,
  total: 0,
})

const paginationProps = computed(() => ({
  current: pagination.current,
  pageSize: pagination.pageSize,
  total: pagination.total || 0,
  onChange: (page: number, pageSize: number) => {
    pagination.current = page
    pagination.pageSize = pageSize
    fetchSearchResults()
  },
  showSizeChanger: true,
  pageSizeOptions: ['12', '24', '36', '48'],
}))

const fetchSearchResults = async () => {
  loading.value = true
  try {
    searchKeyword.value = (route.query.q as string) || ''
    if (!searchKeyword.value) {
      musicList.value = []
      pagination.total = 0
      loading.value = false
      return
    }

    const params: API.searchMusicFilesUsingGETParams = {
      searchText: searchKeyword.value,
      current: pagination.current,
      pageSize: pagination.pageSize,
    }

    const response = await searchMusicFilesUsingGet(params)

    if (response && response.data.code === 0 && response.data.data) {
      musicList.value = response.data.data.records || []
      pagination.total = parseInt(String(response.data.data.total ?? '0'), 10)
    } else {
      message.error('Failed to load search results: ' + (response?.data.message || 'Unknown error'))
      musicList.value = []
      pagination.total = 0
    }
  } catch (error: any) {
    message.error('Error fetching search results: ' + error.message)
    musicList.value = []
    pagination.total = 0
  } finally {
    loading.value = false
  }
}

const handleDownload = (item: API.MusicFileVO) => {
  if (item.url) {
    window.open(item.url, '_blank')
  } else {
    message.warning('No download URL available.')
  }
}

const handleEdit = (item: API.MusicFileVO) => {
  message.info(`Edit functionality not implemented for ${item.name}`)
}

const handleDelete = async (id?: number) => {
  if (!id) return
  message.success(`Delete confirmed for ID: ${id} (API call not implemented)`)
  fetchSearchResults()
}

const handlePlay = (item: API.MusicFileVO) => {
  message.info(`Play functionality not implemented for ${item.name}`)
}

const handlePaginationChange = (page: number, pageSize: number) => {
  pagination.current = page
  pagination.pageSize = pageSize
  fetchSearchResults()
}

const handleRouteChange = () => {
  searchKeyword.value = (route.query.q as string) || ''
  pagination.current = 1
  fetchSearchResults()
}

const showMusicDetails = (item) => {
  if (item && item.id) {
    console.log('Navigating to detail:', item.id)

    musicStore.setCurrentMusic(item)

    router.push(`/music/detail/${item.id}`)
  } else {
    message.error('Invalid music ID')
  }
}

onMounted(() => {
  searchKeyword.value = (route.query.q as string) || ''
  fetchSearchResults()
})

router.afterEach((to, from) => {
  if (to.path === '/search' && to.query.q !== from.query.q) {
    handleRouteChange()
  }
})
</script>

<style scoped>
.music-page-layout {
  min-height: calc(100vh - 64px);
}

.music-grid {
  margin-top: 16px;
}

:deep(.ant-breadcrumb) {
  background-color: #fafafa;
  padding: 8px 16px;
  border-radius: 4px;
  margin-bottom: 16px !important;
}

:deep(.ant-pagination) {
  text-align: center;
  margin-top: 24px;
}

.music-card-wrapper {
  cursor: pointer;
  transition: transform 0.2s;
}

.music-card-wrapper:hover {
  transform: translateY(-5px);
}
</style>
