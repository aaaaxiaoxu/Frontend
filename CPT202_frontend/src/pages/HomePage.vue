<template>
  <div class="home-page">
    <!-- 头部 Banner -->
    <div class="hero-banner">
      <div class="banner-content">
        <TypingAnimation
          text="Upload your music, Listen to your heart"
          class="title-typing-animation"
          :duration="100"
          :delay="500"
          startOnView
        />

        <p>May the music be with you</p>
        <div class="banner-buttons">
          <InteractiveHoverButton
            :text="t('message.browseMusic')"
            @click="goToMusic"
            class="primary-button"
          />
          <InteractiveHoverButton
            :text="t('message.uploadMusic')"
            @click="showUploadModal"
          />
        </div>
      </div>
    </div>

    <!-- 动态功能展示 -->
    <!-- <features-carousel /> -->

    <!-- 热门音乐推荐 -->
    <div class="animated-testimonials-section">
      <AnimatedTestimonials :testimonials="testimonials" :autoplay="true" :duration="10000" />
    </div>

    <!-- 系统统计数据 -->
    <FeaturesWithHeading />

    <!-- 用户评价轮播 -->
    <div class="user-reviews">
      <div class="container">
        <div class="reviews-container">
          <!-- 上部分向左滚动 -->
          <Marquee pauseOnHover class="reviews-marquee">
            <div v-for="(review, index) in userReviews" :key="`top-${index}`" class="review-card">
              <div class="review-content">
                <div class="user-info">
                  <a-avatar :src="review.avatar || 'https://via.placeholder.com/40'" />
                  <div class="user-name">{{ review.userName }}</div>
                </div>
                <div class="review-text">{{ review.content }}</div>
                <div class="review-rating">
                  <a-rate :value="review.rating" disabled allow-half />
                </div>
              </div>
            </div>
          </Marquee>

          <!-- 下部分向右滚动 -->
          <Marquee pauseOnHover reverse class="reviews-marquee mt-6">
            <div v-for="(review, index) in userReviews.slice().reverse()" :key="`bottom-${index}`" class="review-card">
              <div class="review-content">
                <div class="user-info">
                  <a-avatar :src="review.avatar || 'https://via.placeholder.com/40'" />
                  <div class="user-name">{{ review.userName }}</div>
                </div>
                <div class="review-text">{{ review.content }}</div>
                <div class="review-rating">
                  <a-rate :value="review.rating" disabled allow-half />
                </div>
              </div>
            </div>
          </Marquee>
        </div>
      </div>
    </div>

    <!-- 上传模态框 -->
    <a-modal 
      v-model:visible="uploadModalVisible" 
      :title="t('message.uploadMusic')" 
      @cancel="handleCancel"
      :footer="null"
    >
      <music-file-upload @upload-success="handleUploadSuccess"></music-file-upload>
      <div class="modal-custom-footer">
        <InteractiveHoverButton 
          :text="t('message.cancel')" 
          @click="handleCancel"
          class="cancel-button"
        />
      </div>
    </a-modal>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import Marquee from '@/components/ui/marquee/Marquee.vue'

import TypingAnimation from '@/components/magicui/typing-animation.vue'
import InteractiveHoverButton from '@/components/ui/interactive-hover-button/InteractiveHoverButton.vue'
import FeaturesWithHeading from '@/components/FeaturesWithHeading.vue'
import AnimatedTestimonials from '@/components/ui/animated-testimonials/AnimatedTestimonials.vue'
import { useI18n } from 'vue-i18n'  // 添加这行
import MusicFileUpload from '@/components/MusicFileUpload.vue'
import { message } from 'ant-design-vue'

const { t } = useI18n()  // 添加这行
const router = useRouter()

// 模拟的统计数据
const stats = ref({
  musicCount: '10,000+',
  userCount: '1,500+',
  playCount: '50,000+',
  categoryCount: '20+',
})

// 用户评价数据
const userReviews = ref([
  {
    userName: 'Lisa',
    avatar: 'https://th.bing.com/th/id/OIP.wCHjR3fdzRp95TpntJCYeQAAAA?w=217&h=217&c=7&r=0&o=5&dpr=1.4&pid=1.7',
    content: 'This music platform is fantastic! I found a lot of music that I liked, and the interface was friendly.',
    rating: 5
  },
  {
    userName: 'Mike',
    avatar: 'https://th.bing.com/th/id/OIP.jEJ5VHWKGz4yifhACxNX8wAAAA?w=217&h=217&c=7&r=0&o=5&dpr=1.4&pid=1.7',
    content: 'The upload feature is handy, and I\'ve shared several of my original songs.',
    rating: 4.5
  },
  {
    userName: 'Jay',
    avatar: 'https://th.bing.com/th/id/R.62064938410d746f070625f3234a0f17?rik=rH%2bYiAjR7DFmzg&riu=http%3a%2f%2fi2.hdslb.com%2fbfs%2farchive%2f4b88fa2086bae4028a0d4d28be39f37691684576.png&ehk=KThk1mjzyGMAqj7TP3TA3K1o4%2b8ULc7VENn8kAEepC0%3d&risl=&pid=ImgRaw&r=0',
    content: 'The player is powerful and the sound quality is also very good, so it is recommended for all music lovers!',
    rating: 5
  },
  {
    userName: 'Mary',
    avatar: 'data:image/jpeg;base64,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',
    content: 'Discover a lot of niche but great music, and the recommendation system here is precise.',
    rating: 4
  },
  {
    userName: 'Ailce',
    avatar: 'https://th.bing.com/th/id/OIP.OWp1MIssXxGDBdNVV8A0bAHaHa?w=210&h=210&c=7&r=0&o=5&dpr=1.4&pid=1.7',
    content: 'The interface design is modern and the experience is very smooth.',
    rating: 4.5
  }
])

// 添加在现有的 ref 定义旁边
const testimonials = ref([
  {
    quote: t('message.taylor_quote'),
    name: t('message.taylor_name'),
    designation: t('message.taylor_genre'),
    image: "/swift.jpg"
  },
  {
    quote: t('message.jay_quote'),
    name: t('message.jay_name'),
    designation: t('message.jay_genre'),
    image: "/周杰伦.jpg"
  },
  {
    quote: t('message.michael_quote'),
    name: t('message.michael_name'),
    designation: t('message.michael_genre'),
    image: "/Michael.jpg"
  },
  {
    quote: t('message.justin_quote'),
    name: t('message.justin_name'),
    designation: t('message.justin_genre'),
    image: "/比伯.jpeg"
  },
  {
    quote: t('message.oasis_quote'),
    name: t('message.oasis_name'),
    designation: t('message.oasis_genre'),
    image: "/绿洲乐队.jpg"
  }
])

// 上传模态框相关
const uploadModalVisible = ref(false)
const handleCancel = () => {
  uploadModalVisible.value = false
}
const handleUploadSuccess = () => {
  message.success(t('message.uploadSuccess'))
  uploadModalVisible.value = false
}

const goToMusic = () => {
  router.push('/music')
}

const showUploadModal = () => {
  uploadModalVisible.value = true
}

const goToUpload = () => {
  router.push('/add_musicFile')
}
</script>

<style scoped>
.primary-button :deep(.bg-primary) {
  background-color: #4e89ff !important;
}
.title-typing-animation {
  font-size: 100px !important;
  font-weight: 900 !important;
  height: 300px;
  margin-bottom: 30px;
  line-height: 1.2 !important;
}

@media (max-width: 768px) {
  .title-typing-animation {
    font-size: 80px !important;
    height: 150px;
  }
}

@media (max-width: 480px) {
  .title-typing-animation {
    font-size: 60px !important;
    height: 100px;
  }
}
.home-page {
  width: 100%;
  overflow-x: hidden;
}

.hero-banner {
  height: 600px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: black;
  text-align: center;
  position: relative;
  overflow: hidden;
}

.banner-content {
  max-width: 1000px;
  padding: 0 20px;
  position: relative;
  z-index: 1;
}

.title-video-text {
  height: 200px;
  margin-bottom: 30px;
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
    height: 500px;
  }

  .title-video-text {
    height: 150px;
  }

  .banner-content p {
    font-size: 1.2rem;
  }

  .stats-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width: 480px) {
  .title-video-text {
    height: 100px;
  }

  .banner-buttons {
    flex-direction: column;
    align-items: center;
  }

  .stats-grid {
    grid-template-columns: 1fr;
  }
}

.user-reviews {
  padding: 60px 0;
  background-color: #ffffff;
}

.reviews-container {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.mt-6 {
  margin-top: 20px;
}

.reviews-marquee {
  margin-top: 0;
}

.review-card {
  width: 300px;
  min-height: 180px;
  margin: 0 15px;
  padding: 20px;
  background-color: white;
  border-radius: 10px;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.05);
  transition: transform 0.3s;
}

.review-card:hover {
  transform: translateY(-5px);
}

.review-content {
  display: flex;
  flex-direction: column;
}

.user-info {
  display: flex;
  align-items: center;
  margin-bottom: 10px;
}

.user-name {
  margin-left: 10px;
  font-weight: 600;
}

.review-text {
  margin-bottom: 15px;
  line-height: 1.5;
  color: #555;
}

.review-rating {
  text-align: right;
}

.section-title {
  text-align: center;
  margin-bottom: 30px;
}

.section-title h2 {
  font-size: 2rem;
  margin-bottom: 10px;
  color: #333;
}

.section-title p {
  color: #777;
  font-size: 1.1rem;
}

.animated-testimonials-section {
  padding: 60px 0;
  background-color: white;
}

.animated-testimonials-section .view-more {
  text-align: center;
  margin-top: 20px;
}

.modal-custom-footer {
  display: flex;
  justify-content: flex-end;
  padding-top: 12px;
  border-top: 1px solid #f0f0f0;
}

.cancel-button {
  border-color: #d9d9d9;
  background-color: white;
  color: rgba(0, 0, 0, 0.85);
}
</style>
