<template>
  <div class="my-16 flex w-full flex-col items-center justify-center features-section">
    <!-- 标题部分 -->
    <h1 class="mb-3 text-center text-4xl font-bold feature-title">
      {{ t('message.mainTitle') }}
    </h1>
    <p class="mb-12 max-w-2xl text-center text-base feature-text">
       
    </p>
    
    <!-- 特性网格 - 添加容器以控制最大宽度 -->
    <div class="container max-w-5xl" style="margin-left: auto; margin-right: 180px;">
      <div class="grid w-full grid-cols-1 gap-x-12 gap-y-10 md:grid-cols-2 lg:grid-cols-3">
        <div v-for="feature in featuresData" :key="feature.id" class="flex flex-col feature-card">
          <div class="mb-3 h-10 w-10 flex items-center justify-center rounded-lg bg-red-500 text-white">
            <component :is="feature.icon" :size="iconSize" />
          </div>
          <h3 class="mb-2 text-lg font-semibold feature-title">
            {{ t('message.' + feature.nameKey) }}
          </h3>
          <p class="text-sm feature-text">
            {{ t('message.' + feature.descriptionKey) }}
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
    nameKey: 'easyUploadTitle',
    descriptionKey: 'easyUploadDesc',
    icon: Music
  },
  {
    id: 2,
    nameKey: 'personalizationTitle',
    descriptionKey: 'personalizationDesc',
    icon: Library
  },
  {
    id: 3,
    nameKey: 'highQualityTitle',
    descriptionKey: 'highQualityDesc',
    icon: Headphones
  },
  {
    id: 4,
    nameKey: 'responsiveTitle',
    descriptionKey: 'responsiveDesc',
    icon: Smartphone
  },
  {
    id: 5,
    nameKey: 'sharingTitle',
    descriptionKey: 'sharingDesc',
    icon: Heart
  },
  {
    id: 6,
    nameKey: 'updatesTitle',
    descriptionKey: 'updatesDesc',
    icon: RefreshCw
  }
];
</script>

<style>
/* 直接使用非scoped样式避免选择器深度问题 */
/* 白天模式下的样式 */
.features-section {
  background-color: #ffffff;
  width: 100%;
  padding: 30px 0;
}

.feature-title {
  color: #333333;
}

.feature-text {
  color: #666666;
}

.feature-card {
  background-color: #f8f8f8;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
}

/* 黑夜模式下的样式 */
[data-theme='dark'] .features-section {
  background-color: #121212;
  color: #ffffff;
}

[data-theme='dark'] .feature-title {
  color: #ffffff !important;
}

[data-theme='dark'] .feature-text {
  color: #ffffff !important;
}

[data-theme='dark'] .feature-card {
  background-color: rgba(20, 20, 20, 0.8);
  padding: 15px;
  border-radius: 8px;
  margin-bottom: 10px;
  border: 1px solid #333;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.3);
}
</style>
