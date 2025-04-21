<template>
  <div class="features-carousel">
    <div class="section-title">
      <h2>MelodyHub 功能</h2>
      <p>探索我们音乐资源管理系统的强大功能</p>
    </div>

    <!-- 动态卡片区域 -->
    <div class="carousel-container">
      <div class="carousel-track" :style="{ transform: `translateX(${carouselTransform}px)` }">
        <!-- 功能卡片 -->
        <div 
          v-for="(feature, index) in features" 
          :key="index" 
          class="feature-card" 
          :class="{ active: currentIndex === index }"
          :style="{ transform: currentIndex === index ? 'scale(1.15)' : 'scale(0.9)', zIndex: currentIndex === index ? 5 : 1 }"
        >
          <div class="card-icon" :style="{ backgroundColor: feature.bgColor }">
            <component :is="feature.icon" class="icon" />
          </div>
          <div class="card-content">
            <h3>{{ feature.title }}</h3>
            <p class="description">{{ feature.description }}</p>
            <div class="card-footer" v-if="feature.details">
              <p class="details">{{ feature.details }}</p>
            </div>
          </div>
        </div>
      </div>

      <!-- 滚动控制按钮 -->
      <div class="carousel-controls">
        <button class="control-btn prev" @click="prevSlide">
          <left-outlined />
        </button>
        <div class="indicators">
          <span 
            v-for="(_, index) in features" 
            :key="index" 
            class="indicator" 
            :class="{ active: currentIndex === index }"
            @click="goToSlide(index)">
          </span>
        </div>
        <button class="control-btn next" @click="nextSlide">
          <right-outlined />
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount, computed } from 'vue';
import { 
  CustomerServiceOutlined, 
  CloudUploadOutlined, 
  AppstoreOutlined,
  SearchOutlined,
  TagsOutlined,
  UserOutlined,
  LeftOutlined,
  RightOutlined
} from '@ant-design/icons-vue';

// 音乐系统功能列表数据
const features = [
  {
    icon: CustomerServiceOutlined,
    title: '音乐播放',
    description: '流畅播放您收藏的音乐，支持多种格式',
    details: '内置播放控制、音量调节、播放列表管理',
    bgColor: '#4e89ff'
  },
  {
    icon: AppstoreOutlined,
    title: '分类浏览',
    description: '按流派、艺术家等分类浏览您的音乐',
    details: 'Pop、Rock、Electronic、Jazz、Indie、Classical等多种类别',
    bgColor: '#22c55e'
  },
  {
    icon: CloudUploadOutlined,
    title: '音乐上传',
    description: '轻松上传您的音乐文件并管理',
    details: '支持批量上传，自动提取音乐元数据',
    bgColor: '#f59e0b'
  },
  {
    icon: TagsOutlined,
    title: '标签管理',
    description: '为音乐添加自定义标签，便于整理',
    details: '可创建个性化标签体系，灵活管理音乐资源',
    bgColor: '#8b5cf6'
  },
  {
    icon: UserOutlined,
    title: '用户系统',
    description: '个性化的用户体验与权限管理',
    details: '支持用户登录、注册和个人资料管理',
    bgColor: '#ec4899'
  },
  {
    icon: SearchOutlined,
    title: '音乐搜索',
    description: '快速搜索并找到您想要的音乐',
    details: '支持按歌曲名、艺术家、专辑等多维度搜索',
    bgColor: '#06b6d4'
  }
];

// 控制滚动
const currentIndex = ref(0);
const autoSlideInterval = ref(null);
const autoSlideDelay = 1500; // 设置为1500毫秒
const cardWidth = 300; // 卡片宽度
const cardMargin = 20; // 卡片边距
const visibleCards = ref(3); // 可见卡片数量，默认为3

// 计算轮播图的移动距离，确保活动卡片始终居中
const carouselTransform = computed(() => {
  const containerWidth = typeof window !== 'undefined' ? window.innerWidth : 1200;
  const centerPosition = containerWidth / 2;
  const totalCardWidth = cardWidth + cardMargin * 2;
  
  // 计算所需的位移使当前活动卡片居中
  return centerPosition - ((currentIndex.value * totalCardWidth) + totalCardWidth / 2);
});

// 更新可见卡片数量
const updateVisibleCards = () => {
  if (window.innerWidth < 768) {
    visibleCards.value = 1;
  } else if (window.innerWidth < 1024) {
    visibleCards.value = 2;
  } else {
    visibleCards.value = 3;
  }
};

// 切换到下一张
const nextSlide = () => {
  currentIndex.value = (currentIndex.value + 1) % features.length;
  resetAutoSlide();
};

// 切换到上一张
const prevSlide = () => {
  currentIndex.value = (currentIndex.value - 1 + features.length) % features.length;
  resetAutoSlide();
};

// 跳转到指定幻灯片
const goToSlide = (index) => {
  currentIndex.value = index;
  resetAutoSlide();
};

// 重置自动滚动计时器
const resetAutoSlide = () => {
  if (autoSlideInterval.value) {
    clearInterval(autoSlideInterval.value);
  }
  startAutoSlide();
};

// 初始化自动滚动
const startAutoSlide = () => {
  // 清除可能存在的旧计时器
  if (autoSlideInterval.value) {
    clearInterval(autoSlideInterval.value);
  }
  
  // 设置新的计时器
  autoSlideInterval.value = setInterval(() => {
    nextSlide();
  }, autoSlideDelay);
};

// 暂停自动滚动
const pauseAutoSlide = () => {
  if (autoSlideInterval.value) {
    clearInterval(autoSlideInterval.value);
    autoSlideInterval.value = null;
  }
};

onMounted(() => {
  updateVisibleCards();
  window.addEventListener('resize', updateVisibleCards);
  
  // 确保在组件挂载后启动自动滚动
  setTimeout(() => {
    startAutoSlide();
    
    // 添加鼠标悬停暂停功能
    const container = document.querySelector('.carousel-container');
    if (container) {
      container.addEventListener('mouseenter', pauseAutoSlide);
      container.addEventListener('mouseleave', startAutoSlide);
    }
  }, 500);
});

onBeforeUnmount(() => {
  window.removeEventListener('resize', updateVisibleCards);
  
  // 清理所有计时器
  if (autoSlideInterval.value) {
    clearInterval(autoSlideInterval.value);
  }
  
  // 清理鼠标悬停事件
  const container = document.querySelector('.carousel-container');
  if (container) {
    container.removeEventListener('mouseenter', pauseAutoSlide);
    container.removeEventListener('mouseleave', startAutoSlide);
  }
});
</script>

<style scoped>
.features-carousel {
  padding: 60px 0;
  width: 100%;
  background-color: #f8f9fa;
  overflow: hidden;
}

.section-title {
  text-align: center;
  margin-bottom: 60px;
}

.section-title h2 {
  font-size: 2.5rem;
  font-weight: 600;
  color: #333;
  margin-bottom: 10px;
}

.section-title p {
  font-size: 1.2rem;
  color: #666;
}

.carousel-container {
  position: relative;
  width: 100%;
  overflow: hidden;
  padding: 40px 0;
  margin: 0 auto;
}

.carousel-track {
  display: flex;
  transition: transform 0.6s cubic-bezier(0.25, 1, 0.5, 1);
  will-change: transform;
  position: relative;
  padding: 20px 0;
}

.feature-card {
  flex: 0 0 auto;
  width: 300px;
  margin: 0 20px;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  background-color: #fff;
  transition: all 0.5s cubic-bezier(0.25, 1, 0.5, 1);
  height: 330px;
  display: flex;
  flex-direction: column;
  position: relative;
  transform-origin: center center;
  will-change: transform, box-shadow;
}

.feature-card.active {
  box-shadow: 0 12px 30px rgba(0, 0, 0, 0.15);
  z-index: 5;
}

.card-icon {
  height: 120px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
}

.icon {
  font-size: 48px;
}

.card-content {
  padding: 24px;
  flex-grow: 1;
  display: flex;
  flex-direction: column;
}

.card-content h3 {
  font-size: 1.35rem;
  font-weight: 600;
  margin-bottom: 12px;
  color: #333;
}

.description {
  color: #666;
  margin-bottom: 16px;
  line-height: 1.5;
  flex-grow: 1;
}

.card-footer {
  margin-top: auto;
  padding-top: 12px;
  border-top: 1px solid #f0f0f0;
}

.details {
  font-size: 0.9rem;
  color: #888;
}

.carousel-controls {
  display: flex;
  align-items: center;
  justify-content: center;
  margin-top: 40px;
}

.control-btn {
  background: white;
  border: none;
  width: 42px;
  height: 42px;
  border-radius: 50%;
  background-color: white;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: background-color 0.3s, transform 0.2s;
  color: #555;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.1);
  z-index: 2;
}

.control-btn:hover {
  background-color: #f5f5f5;
  transform: scale(1.1);
}

.indicators {
  display: flex;
  margin: 0 20px;
}

.indicator {
  width: 12px;
  height: 12px;
  border-radius: 50%;
  background-color: #d0d0d0;
  margin: 0 6px;
  cursor: pointer;
  transition: background-color 0.3s, transform 0.3s;
}

.indicator.active {
  background-color: #4e89ff;
  transform: scale(1.3);
  box-shadow: 0 0 8px rgba(78, 137, 255, 0.5);
}

/* 响应式设计 */
@media (max-width: 768px) {
  .section-title h2 {
    font-size: 2rem;
  }
  
  .feature-card {
    width: 280px;
    height: auto;
    min-height: 300px;
  }
  
  .card-icon {
    height: 100px;
  }
  
  .icon {
    font-size: 40px;
  }
  
  .card-content h3 {
    font-size: 1.2rem;
  }
  
  .carousel-controls {
    margin-top: 30px;
  }
}
</style>
