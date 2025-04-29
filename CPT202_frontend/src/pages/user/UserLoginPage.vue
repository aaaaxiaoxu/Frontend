<template>
  <div id="userLoginPage">
    <!-- Keep particle background -->
    <MultiColorParticlesBg
      class="particles-background"
      :colors="['#1890FF', '#722ED1', '#52C41A', '#FA8C16', '#F5222D']"
      :quantity="1080"
    />

    <div class="form-card">
      <h2 class="title">{{ $t('message.welcomeToMelodyHub') }}</h2>
      <p class="subtitle">{{ $t('message.loginToAccount') }}</p>

      <a-form
        :model="formState"
        name="basic"
        autocomplete="off"
        @finish="handleSubmit"
        class="login-form"
        layout="vertical"
      >
        <div class="form-label">{{ $t('message.accountLabel') }}</div>
        <a-form-item name="userAccount" :rules="[{ required: true, message: $t('message.enterAccount') }]">
          <IInput
            v-model="formState.userAccount"
            :placeholder="$t('message.enterAccount')"
            class="custom-input"
          />
        </a-form-item>

        <div class="form-label">{{ $t('message.passwordLabel') }}</div>
        <a-form-item
          name="userPassword"
          :rules="[
            { required: true, message: $t('message.enterPassword') },
            { min: 8, message: 'Password must be at least 8 characters' },
          ]"
        >
          <IInput
            v-model="formState.userPassword"
            type="password"
            :placeholder="$t('message.enterPassword')"
            class="custom-input"
          />
        </a-form-item>

        <a-form-item>
          <a-button type="primary" html-type="submit" class="submit-button">
            {{ $t('message.loginButton') }} →
          </a-button>
        </a-form-item>
      </a-form>

      <div class="register-link">
        {{ $t('message.noAccount') }}
        <RouterLink to="/user/register" class="link">{{ $t('message.register') }}</RouterLink>
      </div>

      <div class="language-switch">
        <a @click="changeLanguage" class="language-link">
          {{ locale === 'en' ? '中文' : 'English' }}
        </a>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
// For receiving form input values
import { reactive } from 'vue'
import { useRouter } from 'vue-router'
import { useLoginUserStore } from '@/stores/useLoginUserStore.ts'
import { userLoginUsingPost } from '@/api/userController.ts'
import { message } from 'ant-design-vue'
// Import multicolor particle background component
import MultiColorParticlesBg from '@/components/ui/particles-bg/MultiColorParticlesBg.vue'
// Import i18n
import { useI18n } from 'vue-i18n'
// Import custom input component
import IInput from '@/components/ui/input/IInput.vue'

const { t, locale } = useI18n()

// Language switch method
const changeLanguage = () => {
  locale.value = locale.value === 'en' ? 'zh' : 'en'
}

const formState = reactive<API.UserLoginRequest>({
  userAccount: '',
  userPassword: '',
})

// Get router instance
const router = useRouter()
const loginUserStore = useLoginUserStore()

/**
 * Submit form
 * @param values
 */
const handleSubmit = async (values: any) => {
  const res = await userLoginUsingPost(values)
  // If login successful, save login state to global state
  if (res.data.code === 0 && res.data.data) {
    await loginUserStore.fetchLoginUser()
    message.success(t('message.loginSuccess'))
    router.push({
      path: '/home',
      replace: true,
    })
  } else {
    message.error(t('message.loginFailed') + res.data.message)
  }
}
</script>

<style scoped>
#userLoginPage {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  width: 100%;
  margin: 0;
  padding: 0;
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: #f5f5f5;
}

/* Particle background styles */
.particles-background {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 0;
}

/* Form card styles */
.form-card {
  width: 100%;
  max-width: 450px;
  background-color: #ffffff;
  border-radius: 8px;
  padding: 30px;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
  position: relative;
  z-index: 1;
}

.title {
  font-size: 24px;
  font-weight: 600;
  color: #333;
  margin-bottom: 10px;
}

.subtitle {
  font-size: 16px;
  color: #666;
  margin-bottom: 30px;
}

.form-label {
  font-size: 14px;
  font-weight: 500;
  color: #333;
  margin-bottom: 8px;
}

.login-form {
  width: 100%;
}

.custom-input {
  width: 100%;
  border-radius: 4px;
  transition: all 0.3s;
}

.submit-button {
  width: 100%;
  height: 45px;
  border-radius: 4px;
  background-color: #000;
  border: none;
  font-weight: 500;
  font-size: 16px;
  margin-top: 20px;
  transition: all 0.3s;
  display: flex;
  align-items: center;
  justify-content: center;
}

.submit-button:hover {
  background-color: #333;
}

.register-link {
  text-align: center;
  margin-top: 20px;
  font-size: 14px;
  color: #666;
}

.link {
  color: #1890ff;
  text-decoration: none;
  font-weight: 500;
}

.link:hover {
  text-decoration: underline;
}

/* Language switch button */
.language-switch {
  position: absolute;
  top: 15px;
  right: 15px;
}

.language-link {
  color: #1890ff;
  cursor: pointer;
  font-size: 14px;
}

.language-link:hover {
  text-decoration: underline;
}
</style>
