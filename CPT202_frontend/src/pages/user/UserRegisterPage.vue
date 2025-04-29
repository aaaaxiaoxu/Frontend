<template>
  <div id="userRegisterPage">
    <!-- Using colorful particle background, can set different color combinations -->
    <MultiColorParticlesBg
      class="particles-background"
      :colors="['#2F54EB', '#EB2F96', '#FAAD14', '#13C2C2', '#52C41A']"
      :quantity="1080"
    />

    <div class="form-card">
      <h2 class="title">{{ $t('message.welcomeToMelodyHub') }}</h2>
      <p class="subtitle">{{ $t('message.createAccount') }}</p>

      <a-form
        :model="formState"
        name="basic"
        autocomplete="off"
        @finish="handleSubmit"
        class="register-form"
        layout="vertical"
      >
        <div class="form-label">{{ $t('message.emailLabel') }}</div>
        <a-form-item
          name="email"
          :rules="[
            { required: true, message: $t('message.enterEmail') },
            { type: 'email', message: 'Please enter a valid email address' },
          ]"
        >
          <div class="input-with-button">
            <IInput
              v-model="formState.email"
              :placeholder="$t('message.enterEmail')"
              class="custom-input"
            />
            <a-button
              type="primary"
              class="send-code-button"
              :disabled="sendCodeDisabled"
              @click="sendVerificationCode"
            >
              {{ sendCodeDisabled ? sendCodeText : $t('message.sendCode') }}
            </a-button>
          </div>
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

        <div class="form-label">{{ $t('message.confirmPasswordLabel') }}</div>
        <a-form-item
          name="checkPassword"
          :rules="[
            { required: true, message: $t('message.enterConfirmPassword') },
            { min: 8, message: 'Confirm password must be at least 8 characters' },
          ]"
        >
          <IInput
            v-model="formState.checkPassword"
            type="password"
            :placeholder="$t('message.enterConfirmPassword')"
            class="custom-input"
          />
        </a-form-item>

        <div class="form-label">{{ $t('message.verificationCodeLabel') }}</div>
        <a-form-item name="code" :rules="[{ required: true, message: $t('message.enterVerificationCode') }]">
          <IInput
            v-model="formState.code"
            :placeholder="$t('message.enterVerificationCode')"
            class="custom-input"
          />
        </a-form-item>

        <a-form-item>
          <a-button type="primary" html-type="submit" class="submit-button">
            {{ $t('message.registerButton') }} →
          </a-button>
        </a-form-item>
      </a-form>

      <div class="login-link">
        {{ $t('message.hasAccount') }}
        <RouterLink to="/user/login" class="link">{{ $t('message.login') }}</RouterLink>
      </div>

      <!-- Add language switch button -->
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
import { reactive, ref } from 'vue'
import { useRouter } from 'vue-router'
import { useLoginUserStore } from '@/stores/useLoginUserStore.ts'
import { userRegisterUsingPost } from '@/api/userController.ts'
import { sendVerificationCodeUsingPost } from '@/api/emailController.ts'
import { message } from 'ant-design-vue'
// Import colorful particle background component
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

const formState = reactive({
  email: '',
  userPassword: '',
  checkPassword: '',
  code: '',
  userAccount: '',
})

// Get router instance
const router = useRouter()
const loginUserStore = useLoginUserStore()

// Verification code button state management
const sendCodeDisabled = ref(false)
const sendCodeText = ref('Send')
const countdown = ref(60)
let timer: number | null = null

// Send verification code
const sendVerificationCode = async () => {
  if (!formState.email) {
    message.error(t('message.enterEmail'))
    return
  }

  // Validate email format
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  if (!emailRegex.test(formState.email)) {
    message.error(t('message.invalidEmail'))
    return
  }

  try {
    const res = await sendVerificationCodeUsingPost({
      email: formState.email,
    })

    if (res.data.code === 0) {
      message.success(t('message.codeSent'))
      startCountdown()
    } else {
      message.error(t('message.sendCodeFailed') + res.data.message)
    }
  } catch (error) {
    message.error(t('message.sendCodeFailed'))
  }
}

// Countdown functionality
const startCountdown = () => {
  sendCodeDisabled.value = true
  countdown.value = 60
  sendCodeText.value = `${countdown.value}s`

  timer = window.setInterval(() => {
    countdown.value--
    sendCodeText.value = `${countdown.value}s`

    if (countdown.value <= 0) {
      clearInterval(timer as number)
      sendCodeDisabled.value = false
      sendCodeText.value = 'Send'
    }
  }, 1000)
}

/**
 * Submit form
 * @param values
 */
const handleSubmit = async (values: any) => {
  // Check if the two passwords match
  if (values.userPassword != values.checkPassword) {
    message.error(t('message.passwordMismatch'))
    return
  }

  // Build registration request data
  const registerData = {
    userAccount: values.email, // Use email as account
    userPassword: values.userPassword,
    checkPassword: values.checkPassword,
    email: values.email,
    code: values.code,
  }

  try {
    // First register
    const res = await userRegisterUsingPost(registerData)

    // Registration successful
    if (res.data.code === 0 && res.data.data) {
      // Get user account from registration response
      const userAccount = res.data.data.userAccount
      
      message.success(t('message.registerSuccess'))
      // Redirect to avatar upload page and pass user account
      router.push({
        path: '/user/upload-avatar',
        query: { userAccount: userAccount },
      })
    } else {
      message.error(t('message.registerFailed') + res.data.message)
    }
  } catch (error) {
    message.error(t('message.registerFailed'))
  }
}
</script>

<style scoped>
#userRegisterPage {
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
  overflow-y: auto;
  max-height: 90vh;
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

.register-form {
  width: 100%;
}

.custom-input {
  width: 100%;
  border-radius: 4px;
  transition: all 0.3s;
}

.input-with-button {
  display: flex;
  gap: 8px;
}

.input-with-button .custom-input {
  flex-grow: 1;
}

.send-code-button {
  border-radius: 4px;
  min-width: 60px;
  background-color: #1890ff;
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

.login-link {
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
