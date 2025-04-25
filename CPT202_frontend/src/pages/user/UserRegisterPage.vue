<template>
  <div id="userRegisterPage">
    <!-- 使用多彩粒子背景，可以设置不同的颜色组合 -->
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
            { type: 'email', message: '请输入有效的邮箱地址' },
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
            { min: 8, message: '密码长度至少为8个字符' },
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
            { min: 8, message: '确认密码长度至少为8个字符' },
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

        <!-- 修改头像上传部分 -->
        <div class="form-label">{{ $t('message.avatarLabel') }}</div>
        <a-form-item name="avatar">
          <a-upload
            v-model:file-list="avatarFileList"
            name="file"
            :beforeUpload="beforeAvatarUpload"
            :maxCount="1"
            :showUploadList="false"
            accept="image/*"
          >
            <div class="avatar-upload-box">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="upload-icon">
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                <polyline points="17 8 12 3 7 8"></polyline>
                <line x1="12" y1="3" x2="12" y2="15"></line>
              </svg>
            </div>
          </a-upload>
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

      <!-- 添加语言切换按钮 -->
      <div class="language-switch">
        <a @click="changeLanguage" class="language-link">
          {{ locale === 'en' ? '中文' : 'English' }}
        </a>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
// 用于接收表单输入的值
import { reactive, ref } from 'vue'
import { useRouter } from 'vue-router'
import { useLoginUserStore } from '@/stores/useLoginUserStore.ts'
import { userRegisterUsingPost, uploadAvatarUsingPost } from '@/api/userController.ts'
import { sendVerificationCodeUsingPost } from '@/api/emailController.ts'
import { message } from 'ant-design-vue'
// 导入多彩粒子背景组件
import MultiColorParticlesBg from '@/components/ui/particles-bg/MultiColorParticlesBg.vue'
// 导入i18n
import { useI18n } from 'vue-i18n'
// 导入自定义输入框组件
import IInput from '@/components/ui/input/IInput.vue'

const { t, locale } = useI18n()

// 切换语言方法
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

// 获取路由实例
const router = useRouter()
const loginUserStore = useLoginUserStore()

// 头像文件列表
const avatarFileList = ref([])

// 预处理头像上传
const beforeAvatarUpload = (file) => {
  // 检查文件类型
  const isImage = file.type.startsWith('image/')
  if (!isImage) {
    message.error(t('message.pleaseUploadImageFile'))
    return false
  }

  // 保存文件到列表中
  avatarFileList.value = [{ ...file, status: 'done', url: URL.createObjectURL(file) }]

  return false // 阻止自动上传
}

// 验证码发送按钮状态管理
const sendCodeDisabled = ref(false)
const sendCodeText = ref('Send')
const countdown = ref(60)
let timer: number | null = null

// 发送验证码
const sendVerificationCode = async () => {
  if (!formState.email) {
    message.error(t('message.enterEmail'))
    return
  }

  // 验证邮箱格式
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

// 倒计时功能
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
 * 提交表单
 * @param values
 */
const handleSubmit = async (values: any) => {
  // 校验两次输入的密码是否一致
  if (values.userPassword != values.checkPassword) {
    message.error(t('message.passwordMismatch'))
    return
  }

  // 构建注册请求数据
  const registerData = {
    userAccount: values.email, // 使用邮箱作为账号
    userPassword: values.userPassword,
    checkPassword: values.checkPassword,
    email: values.email,
    code: values.code,
  }

  try {
    // 先进行注册
    const res = await userRegisterUsingPost(registerData)

    // 注册成功
    if (res.data.code === 0 && res.data.data) {
      const userId = res.data.data
      let avatarUrl = ''

      // 如果有上传头像，则调用上传头像API
      if (avatarFileList.value.length > 0) {
        try {
          const avatarFile = avatarFileList.value[0].originFileObj || avatarFileList.value[0]
          const avatarRes = await uploadAvatarUsingPost({}, avatarFile)
          if (avatarRes.data.code === 0 && avatarRes.data.data) {
            avatarUrl = avatarRes.data.data
            message.success(t('message.avatarUploadSuccess'))
          }
        } catch (error) {
          message.error(t('message.avatarUploadFailed'))
        }
      }

      message.success(t('message.registerSuccess'))
      router.push({
        path: '/user/login',
        replace: true,
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

/* 粒子背景样式 */
.particles-background {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 0;
}

/* 表单卡片样式 */
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

/* 头像上传样式 */
.avatar-upload-box {
  width: 100px;
  height: 100px;
  border-radius: 8px;
  background-color: #fafafa;
  border: 1px dashed #d9d9d9;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.3s;
}

.avatar-upload-box:hover {
  border-color: #1890ff;
  background-color: #f0f7ff;
}

.upload-icon {
  color: #999;
  transition: color 0.3s;
}

.avatar-upload-box:hover .upload-icon {
  color: #1890ff;
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

/* 语言切换按钮 */
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
