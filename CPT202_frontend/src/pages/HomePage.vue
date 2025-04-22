<template>
  <div class="home-page">
    <!-- 头部 Banner -->
    <div class="hero-banner">
      <div class="banner-content">
        <h1>MelodyHub</h1>
        <p>您的个人音乐资源管理中心</p>
        <div class="banner-buttons">
          <a-button type="primary" size="large" @click="goToMusic"> 浏览音乐 </a-button>
          <a-button size="large" @click="goToUpload"> 上传音乐 </a-button>
        </div>
      </div>
    </div>

    <!-- 动态功能展示 -->
    <features-carousel />

    <!-- 热门音乐推荐 -->
    <div class="popular-music">
      <div class="container">
        <div class="section-title">
          <h2>热门推荐</h2>
          <p>探索用户最喜爱的音乐</p>
        </div>
        <div class="popular-grid">
          <!-- 热门音乐卡片 -->
          <!-- 您可以在这里添加音乐卡片 -->
        </div>
        <div class="view-more">
          <a-button type="primary" @click="goToMusic">查看更多</a-button>
        </div>
      </div>
    </div>

    <!-- 系统统计数据 -->
    <div class="stats-section">
      <div class="container">
        <div class="stats-grid">
          <div class="stat-item">
            <div class="stat-number">{{ stats.musicCount }}</div>
            <div class="stat-label">音乐资源</div>
          </div>
          <div class="stat-item">
            <div class="stat-number">{{ stats.userCount }}</div>
            <div class="stat-label">注册用户</div>
          </div>
          <div class="stat-item">
            <div class="stat-number">{{ stats.playCount }}</div>
            <div class="stat-label">播放次数</div>
          </div>
          <div class="stat-item">
            <div class="stat-number">{{ stats.categoryCount }}</div>
            <div class="stat-label">音乐类别</div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import FeaturesCarousel from '@/components/FeaturesCarousel.vue'

const router = useRouter()

// 模拟的统计数据
const stats = ref({
  musicCount: '10,000+',
  userCount: '1,500+',
  playCount: '50,000+',
  categoryCount: '20+',
})

const goToMusic = () => {
  router.push('/music')
}

const goToUpload = () => {
  router.push('/add_musicFile')
}
</script>

<style scoped>
.home-page {
  width: 100%;
  overflow-x: hidden;
}

.hero-banner {
  height: 500px;
  background: linear-gradient(135deg, #4e89ff, #8b5cf6);
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  text-align: center;
  position: relative;
  overflow: hidden;
}

.hero-banner::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: url('/path/to/music-pattern.png') repeat;
  opacity: 0.1;
}

.banner-content {
  max-width: 800px;
  padding: 0 20px;
  position: relative;
  z-index: 1;
}

.banner-content h1 {
  font-size: 3.5rem;
  font-weight: 700;
  margin-bottom: 20px;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.banner-content p {
  font-size: 1.5rem;
  margin-bottom: 30px;
  opacity: 0.9;
}

.banner-buttons {
  display: flex;
  gap: 15px;
  justify-content: center;
}

.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px;
}

.popular-music {
  padding: 60px 0;
  background-color: white;
}

.popular-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: 20px;
  margin-top: 40px;
}

.view-more {
  text-align: center;
  margin-top: 40px;
}

.stats-section {
  padding: 60px 0;
  background-color: #f0f4ff;
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 30px;
}

.stat-item {
  text-align: center;
  padding: 30px;
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.05);
}

.stat-number {
  font-size: 2.5rem;
  font-weight: 700;
  color: #4e89ff;
  margin-bottom: 10px;
}

.stat-label {
  font-size: 1rem;
  color: #666;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .hero-banner {
    height: 400px;
  }

  .banner-content h1 {
    font-size: 2.5rem;
  }

  .banner-content p {
    font-size: 1.2rem;
  }

  .stats-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width: 480px) {
  .banner-buttons {
    flex-direction: column;
    align-items: center;
  }

  .stats-grid {
    grid-template-columns: 1fr;
  }
}
</style>
