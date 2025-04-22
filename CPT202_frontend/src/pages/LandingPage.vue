<template>
  <div class="landing-page">
    <FallingStarsBg class="stars-background" color="#333333" count="400" />
    <div class="content">
      <BlurReveal :delay="0.1" :duration="1.2">
        <h1 class="title">MelodyHub</h1>
        <p class="subtitle">{{$t('message.solgen')}}</p>
      </BlurReveal>
      <div class="buttons">
        <InteractiveHoverButton
          :text="$t('message.getStarted')"
          class="enter-btn"
          @click="goToHome"
        />
        <InteractiveHoverButton
          :text="$t('message.login')"
          class="login-btn"
          @click="goToLogin"
        />
        <InteractiveHoverButton
          :text="$t('message.register')"
          class="register-btn"
          @click="goToRegister"
        />
        <!-- 添加一个专门用于切换语言的按钮 -->
        <InteractiveHoverButton
        :text="locale === 'en' ? '中文' : 'English'"
        class="language-btn"
        @click="changeLanguage"
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router'
import FallingStarsBg from '@/components/ui/bg-falling-stars/FallingStarsBg.vue'
import InteractiveHoverButton from '@/components/ui/interactive-hover-button/InteractiveHoverButton.vue'
import BlurReveal from '@/components/ui/blur-reveal/BlurReveal.vue'
import {useI18n} from 'vue-i18n'
import { onMounted, ref } from 'vue'

const router = useRouter()

const goToHome = () => {
  router.push('/home')
}

const goToLogin = () => {
  router.push('/user/login')
}

const goToRegister = () => {
  router.push('/user/register')
}


onMounted(() => {
  change_language.value = locale.value
})

// 定义语言的状态
const {locale} = useI18n()
const change_language = ref('')

// 定义切换语言的方法 - 修改为切换中英文
const changeLanguage = () => {
  // 如果当前是英文，切换到中文；如果是中文，切换到英文
  locale.value = locale.value === 'en' ? 'zh' : 'en'
}
</script>

<style scoped>
.landing-page {
  position: relative;
  width: 100%;
  height: 100vh;
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  background-color: #ffffff;
}

.stars-background {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 0;
}

.content {
  position: relative;
  z-index: 1;
  text-align: center;
  padding: 2rem;
  max-width: 800px;
}

.title {
  font-size: 5rem;
  font-weight: 700;
  margin-bottom: 1rem;
  color: #000000;
  text-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
}

.subtitle {
  font-size: 1.5rem;
  margin-bottom: 3rem;
  color: #333333;
}

.buttons {
  display: flex;
  gap: 1rem;
  justify-content: center;
  margin-top: 2rem;
}

.enter-btn {
  border-color: #4e89ff;
}

.enter-btn :deep(.bg-primary) {
  background-color: #4e89ff;
}

.login-btn, .register-btn {
  border-color: rgba(0, 0, 0, 0.2);
}

.login-btn :deep(.bg-primary),
.register-btn :deep(.bg-primary) {
  background-color: #333333;
}

@media (max-width: 768px) {
  .title {
    font-size: 3.5rem;
  }

  .subtitle {
    font-size: 1.2rem;
  }

  .buttons {
    flex-direction: column;
    align-items: center;
  }

  .buttons button {
    margin-bottom: 1rem;
    width: 100%;
  }
}
</style>
