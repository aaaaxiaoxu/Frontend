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
              <music-card
                :id="item.id"
                :name="item.name"
                :coverUrl="item.coverUrl"
                :url="item.url"
                :artist="item.artist || '未知艺术家'"
                :category="item.category"
                :language="item.language"
                @download="handleDownload(item)"
                @edit="handleEdit(item)"
                @delete="handleDelete(item.id)"
                @play="handlePlay(item)"
              />
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
  </a-layout>
</template>

<script setup lang="ts">
import { ref, onMounted, reactive, computed } from 'vue';
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
import { listMusicFileVoByPageUsingPost } from '@/api/musicFileController';
import MusicCard from '@/components/MusicCard.vue';

const musicList = ref<API.MusicFileVO[]>([]);
const loading = ref(false);
const selectedCategoryKeys = ref<string[]>(['pop']);
const selectedCategoryLabel = ref<string>('Pop');

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

const searchParams = reactive<API.MusicFileQueryRequest>({
  current: pagination.current,
  pageSize: pagination.pageSize,
  category: selectedCategoryKeys.value[0] === 'uploaded' ? undefined : selectedCategoryKeys.value[0],
});

const fetchMusicData = async () => {
  loading.value = true;
  try {
    searchParams.current = pagination.current;
    searchParams.pageSize = pagination.pageSize;
    const categoryKey = selectedCategoryKeys.value[0];
    searchParams.category = (categoryKey === 'uploaded' || categoryKey === 'popular' || categoryKey === 'custom') ? undefined : categoryKey;

    const res = await listMusicFileVoByPageUsingPost(searchParams);
    if (res.data.code === 0 && res.data.data) {
      musicList.value = res.data.data.records || [];
      pagination.total = parseInt(String(res.data.data.total ?? '0'), 10);
    } else {
      message.error('Failed to load music: ' + (res.data.message || 'Unknown error'));
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

const handleDownload = (item: API.MusicFileVO) => {
  console.log('Download:', item);
  if (item.url) {
      window.open(item.url, '_blank');
  } else {
      message.warning('No download URL available.')
  }
};

const handleEdit = (item: API.MusicFileVO) => {
  console.log('Edit:', item);
  message.info(`Edit functionality not implemented for ${item.name}`);
};

const handleDelete = async (id?: number) => {
  if (!id) return;
  console.log('Delete:', id);
   message.success(`Delete confirmed for ID: ${id} (API call not implemented)`);
   fetchMusicData();
};

const cancelDelete = () => {
  message.info('Delete cancelled');
};

const handlePlay = (item: API.MusicFileVO) => {
   console.log('Play:', item);
   message.info(`Play functionality not implemented for ${item.name}`);
}

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