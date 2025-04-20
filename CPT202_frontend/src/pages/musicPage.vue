<template>
  <a-layout class="music-page-layout">
    <!-- Category Sidebar -->
    <a-layout-sider width="200" style="background: #fff">
      <a-menu
        mode="inline"
        :style="{ height: '100%', borderRight: 0 }"
        v-model:selectedKeys="selectedCategoryKeys"
        @click="handleCategoryClick"
      >
        <a-menu-item key="uploaded">Uploaded</a-menu-item>
        <a-sub-menu key="popular" title="Popular Category">
          <a-menu-item key="rock">Rock</a-menu-item>
          <a-menu-item key="pop">Pop</a-menu-item>
          <a-menu-item key="electronic">Electronic</a-menu-item>
          <a-menu-item key="jazz">Jazz</a-menu-item>
          <a-menu-item key="indie">Indie</a-menu-item>
          <a-menu-item key="classical">Classical</a-menu-item>
          <a-menu-item key="rnb">R&B</a-menu-item>
        </a-sub-menu>
        <a-sub-menu key="custom" title="Custom Category">
          <!-- Custom categories can be added here later -->
        </a-sub-menu>
      </a-menu>
    </a-layout-sider>

    <!-- Main Content Area -->
    <a-layout-content :style="{ padding: '0 24px', minHeight: '280px' }">
      <div :style="{ background: '#fff', padding: '24px', margin: 0 }">
        <a-breadcrumb :style="{ margin: '16px 0' }">
          <a-breadcrumb-item>{{ selectedCategoryLabel }}</a-breadcrumb-item>
        </a-breadcrumb>
        <a-row :gutter="[16, 16]">
          <a-col :xs="24" :sm="12" :md="8" :lg="6" v-for="item in musicList" :key="item.id">
            <music-card :id="item.id" />
          </a-col>
        </a-row>
        <a-pagination
          v-model:current="pagination.current"
          :total="pagination.total"
          :pageSize="pagination.pageSize"
          :pageSizeOptions="['12', '24', '36', '48']"
          showSizeChanger
          @change="(page, pageSize) => handlePaginationChange(page, pageSize)"
          style="text-align: center; margin-top: 24px;"
        />
      </div>
    </a-layout-content>

    <!-- 添加播放器组件 -->
    <player-bar />
  </a-layout>
</template>

<script setup lang="ts">
import { ref, onMounted, reactive, computed, provide } from 'vue'
import type { MenuInfo } from 'ant-design-vue/es/menu/src/interface';
import {
  Layout as ALayout,
  LayoutSider as ALayoutSider,
  LayoutContent as ALayoutContent,
  Menu as AMenu,
  MenuItem as AMenuItem,
  SubMenu as ASubMenu,
  List as AList,
  ListItem as AListItem,
  Card as ACard,
  Breadcrumb as ABreadcrumb,
  BreadcrumbItem as ABreadcrumbItem,
  Popconfirm as APopconfirm,
  Tooltip as ATooltip,
  message,
  Row as ARow,
  Col as ACol,
  Pagination as APagination,
} from 'ant-design-vue';
import {
  DownloadOutlined,
  EditOutlined,
  DeleteOutlined,
  PlayCircleOutlined,
} from '@ant-design/icons-vue';
import { listMusicFileVoByPageUsingPost, listMusicFileVoByCategoryPageUsingGet } from '@/api/musicFileController';
import MusicCard from '@/components/MusicCard.vue';
import PlayerBar from '@/components/PlayerBar.vue';

const musicList = ref<API.MusicFileVO[]>([]);
const loading = ref(false);
const selectedCategoryKeys = ref<string[]>(['uploaded']);
const selectedCategoryLabel = ref<string>('Uploaded');

const pagination = reactive({
  current: 1,
  pageSize: 12,
  total: 0,
});

const paginationProps = computed(() => ({
  current: pagination.current,
  pageSize: pagination.pageSize,
  total: pagination.total || 0,
  onChange: (page: number, pageSize: number) => {
    pagination.current = page;
    pagination.pageSize = pageSize;
    fetchMusicData();
  },
  showSizeChanger: true,
  pageSizeOptions: ['12', '24', '36', '48'],
}))

const fetchMusicData = async () => {
  loading.value = true;
  const currentCategory = selectedCategoryKeys.value[0];
  let response = null;

  try {
    if (currentCategory === 'uploaded') {
      // Fetch all music using POST endpoint
      const queryParams: API.MusicFileQueryRequest = {
        current: pagination.current,
        pageSize: pagination.pageSize,
        category: undefined, // Ensure category is not sent when fetching all
        // Add other necessary sort/filter params if needed for "Uploaded"
      };
      response = await listMusicFileVoByPageUsingPost(queryParams);
    } else if (currentCategory && currentCategory !== 'popular' && currentCategory !== 'custom') {
      // Fetch music by specific category using GET endpoint
      const params: API.listMusicFileVOByCategoryPageUsingGETParams = {
        category: currentCategory,
        current: pagination.current,
        pageSize: pagination.pageSize,
      };
      response = await listMusicFileVoByCategoryPageUsingGet(params);
    } else {
      // Handle cases for 'popular' or 'custom' parent items if they shouldn't fetch data
      console.log('No data fetch for category:', currentCategory);
      musicList.value = [];
      pagination.total = 0;
      loading.value = false;
      return; // Exit fetch function
    }

    // Process the response (same logic for both endpoints)
    if (response && response.data.code === 0 && response.data.data) {
      musicList.value = response.data.data.records || [];
      pagination.total = parseInt(String(response.data.data.total ?? '0'), 10);
    } else {
      message.error('Failed to load music: ' + (response?.data.message || 'Unknown error'));
      musicList.value = [];
      pagination.total = 0;
    }
  } catch (error: any) {
    message.error('Error fetching music data: ' + error.message);
    musicList.value = [];
    pagination.total = 0;
  } finally {
    loading.value = false;
  }
};

const categoryLabels: { [key: string]: string } = {
  uploaded: 'Uploaded',
  popular: 'Popular Category',
  rock: 'Rock',
  pop: 'Pop',
  electronic: 'Electronic',
  jazz: 'Jazz',
  indie: 'Indie',
  classical: 'Classical',
  rnb: 'R&B',
  custom: 'Custom Category'
};

const handleCategoryClick = (info: MenuInfo) => {
  const key = info.key as string;
  if (key === 'popular' || key === 'custom') return;

  selectedCategoryKeys.value = [key];
  selectedCategoryLabel.value = categoryLabels[key] || 'Unknown Category';
  pagination.current = 1;
  fetchMusicData();
};

const currentPlayingId = ref<number | null>(null);
provide('currentPlayingId', currentPlayingId);
const handlePlay = (id: number) => {
  currentPlayingId.value = id;
};

const handlePaginationChange = (page: number, pageSize: number) => {
  pagination.current = page;
  pagination.pageSize = pageSize;
  fetchMusicData();
};

onMounted(() => {
  selectedCategoryLabel.value = categoryLabels[selectedCategoryKeys.value[0]] || 'Unknown Category';
  fetchMusicData();
});

</script>

<style scoped>
.music-page-layout {
  min-height: calc(100vh - 64px);
  padding-bottom: 70px;
}

.music-grid {
  margin-top: 16px;
}

.music-card {
  position: relative;
  overflow: hidden;
  border-radius: 8px;
}

.music-cover-wrapper {
  position: relative;
  width: 100%;
  padding-top: 100%;
  overflow: hidden;
  background-color: #f0f0f0;
}

.music-cover {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.3s ease;
}

.music-cover-placeholder {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #e9e9e9;
  color: #999;
  font-size: 2.5em;
  font-weight: bold;
}

.music-card:hover .music-cover {
  transform: scale(1.1);
}

.music-info-overlay {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  background: rgba(0, 0, 0, 0.6);
  color: white;
  padding: 8px 12px;
  opacity: 0;
  transition: opacity 0.3s ease;
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  height: 100%;
  box-sizing: border-box;
}

.music-card:hover .music-info-overlay {
  opacity: 1;
}

.music-title {
  font-size: 1em;
  font-weight: bold;
  margin-bottom: 2px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.music-artist {
  font-size: 0.85em;
  margin-bottom: 8px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.action-buttons {
  display: flex;
  justify-content: space-around;
  align-items: center;
  margin-top: auto;
}

.action-icon {
  font-size: 1.3em;
  color: rgba(255, 255, 255, 0.8);
  cursor: pointer;
  transition: color 0.2s ease;
}

.action-icon:hover {
  color: white;
}

.action-icon-delete:hover {
  color: #ff4d4f;
}
.action-icon-play:hover {
  color: #1890ff;
}

:deep(.ant-card-cover) {
  padding: 0;
  margin: 0;
}
:deep(.ant-card-body) {
  padding: 0;
  min-height: 0;
}

:deep(.ant-list-item) {
}

:deep(.ant-pagination) {
  text-align: center;
  margin-top: 24px;
}

:deep(.ant-layout-sider) {
  border-right: 1px solid #f0f0f0;
}

:deep(.ant-breadcrumb) {
  background-color: #fafafa;
  padding: 8px 16px;
  border-radius: 4px;
  margin-bottom: 16px !important;
}
</style>
