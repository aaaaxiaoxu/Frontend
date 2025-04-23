<template>
  <div class="my-16 flex w-full flex-col items-center justify-center">
    <!-- 标题部分 -->
    <h1 class="mb-3 text-center text-4xl font-bold text-gray-900 dark:text-gray-100">
      {{ t('message.mainTitle') }}
    </h1>
    <p class="mb-12 max-w-2xl text-center text-base text-gray-600 dark:text-gray-400">
       
    </p>
    
    <!-- 特性网格 - 添加容器以控制最大宽度 -->
    <div class="container max-w-5xl" style="margin-left: auto; margin-right: 180px;">
      <div class="grid w-full grid-cols-1 gap-x-12 gap-y-10 md:grid-cols-2 lg:grid-cols-3">
        <div v-for="feature in featuresData" :key="feature.id" class="flex flex-col">
          <div class="mb-3 h-10 w-10 flex items-center justify-center rounded-lg bg-red-500 text-white">
            <component :is="feature.icon" :size="iconSize" />
          </div>
          <h3 class="mb-2 text-lg font-semibold text-gray-900 dark:text-gray-100">
            {{ t(feature.nameKey) }}
          </h3>
          <p class="text-sm text-gray-600 dark:text-gray-400">
            {{ t(feature.descriptionKey) }}
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { Music, Library, Headphones, Smartphone, Heart, RefreshCw } from 'lucide-vue-next';
import { useI18n } from 'vue-i18n';

const { t } = useI18n();
const iconSize = 18;

const featuresData = [
  {
    id: 1,
    nameKey: 'music.features.easyUpload.title',
    descriptionKey: 'music.features.easyUpload.description',
    icon: Music
  },
  {
    id: 2,
    nameKey: 'music.features.personalization.title',
    descriptionKey: 'music.features.personalization.description',
    icon: Library
  },
  {
    id: 3,
    nameKey: 'music.features.highQuality.title',
    descriptionKey: 'music.features.highQuality.description',
    icon: Headphones
  },
  {
    id: 4,
    nameKey: 'music.features.responsive.title',
    descriptionKey: 'music.features.responsive.description',
    icon: Smartphone
  },
  {
    id: 5,
    nameKey: 'music.features.sharing.title',
    descriptionKey: 'music.features.sharing.description',
    icon: Heart
  },
  {
    id: 6,
    nameKey: 'music.features.updates.title',
    descriptionKey: 'music.features.updates.description',
    icon: RefreshCw
  }
];
</script>
