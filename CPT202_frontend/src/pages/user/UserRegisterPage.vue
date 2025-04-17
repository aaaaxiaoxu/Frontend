<template>
  <div id="userRegisterPage">
    <div class="page-container">
      <!-- 注册表单区域 -->
      <div class="form-container">
        <div class="logo">
          <img src="/logo.png" alt="我们项目的Logo" class="logo-image" />
        </div>
        <h2 class="title">创建新账号</h2>

        <a-form
          :model="formState"
          name="basic"
          autocomplete="off"
          @finish="handleSubmit"
          class="register-form"
        >
          <div class="form-label">邮箱</div>
          <a-form-item name="email" :rules="[
            { required: true, message: '请输入您的邮箱' },
            { type: 'email', message: '请输入有效的邮箱地址' }
          ]">
            <div class="input-with-button">
              <a-input
                v-model:value="formState.email"
                placeholder="请输入邮箱地址"
                class="custom-input"
              />
              <a-button
                type="primary"
                class="send-code-button"
                :disabled="sendCodeDisabled"
                @click="sendVerificationCode"
              >
                {{ sendCodeText }}
              </a-button>
            </div>
          </a-form-item>

          <div class="form-label">密码</div>
          <a-form-item
            name="userPassword"
            :rules="[
              { required: true, message: '请输入您的密码' },
              { min: 8, message: '密码长度至少为8个字符' },
            ]"
          >
            <a-input-password
              v-model:value="formState.userPassword"
              placeholder="请输入密码"
              class="custom-input"
            />
          </a-form-item>

          <div class="form-label">确认密码</div>
          <a-form-item
            name="checkPassword"
            :rules="[
              { required: true, message: '请确认您的密码' },
              { min: 8, message: '确认密码长度至少为8个字符' },
            ]"
          >
            <a-input-password
              v-model:value="formState.checkPassword"
              placeholder="请再次输入密码"
              class="custom-input"
            />
          </a-form-item>

          <div class="form-label">验证码</div>
          <a-form-item
            name="code"
            :rules="[{ required: true, message: '请输入验证码' }]"
          >
            <a-input
              v-model:value="formState.code"
              placeholder="请输入验证码"
              class="custom-input"
            />
          </a-form-item>

          <a-form-item>
            <a-button type="primary" html-type="submit" class="register-button">注册</a-button>
          </a-form-item>
        </a-form>

        <div class="login-link">
          已有账号？
          <RouterLink to="/user/login" class="link">登录</RouterLink>
        </div>
      </div>
      
      <!-- 图片区域 -->
      <div class="music-image">
        <img src="https://img.picui.cn/free/2025/04/16/67ffc996a79ef.png" alt="Music tools" />
      </div>
      
      <!-- 文字区域 -->
      <div class="image-text">
        <h3>Music tools for efficient minds</h3>
        <p>MelodyHub帮助您轻松管理、组织和享受您的音乐。随时随地上传、标记和访问您的音乐，简单便捷。</p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
// 用于接收表单输入的值
import { reactive, ref } from 'vue'
import { useRouter } from 'vue-router'
import { useLoginUserStore } from '@/stores/useLoginUserStore.ts'
import { userRegisterUsingPost } from '@/api/userController.ts'
import { sendVerificationCodeUsingPost } from '@/api/emailController.ts'
import { message } from 'ant-design-vue'

const formState = reactive({
  email: '',
  userPassword: '',
  checkPassword: '',
  code: '',
  userAccount: ''
})

// 获取路由实例
const router = useRouter()
const loginUserStore = useLoginUserStore()

// 验证码发送按钮状态管理
const sendCodeDisabled = ref(false)
const sendCodeText = ref('Send')
const countdown = ref(60)
let timer: number | null = null

// 发送验证码
const sendVerificationCode = async () => {
  if (!formState.email) {
    message.error('请先输入邮箱地址')
    return
  }

  // 验证邮箱格式
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  if (!emailRegex.test(formState.email)) {
    message.error('请输入有效的邮箱地址')
    return
  }

  try {
    const res = await sendVerificationCodeUsingPost({
      email: formState.email
    })

    if (res.data.code === 0) {
      message.success('验证码已发送，请查收邮件')
      startCountdown()
    } else {
      message.error('发送验证码失败：' + res.data.message)
    }
  } catch (error) {
    message.error('发送验证码失败，请稍后重试')
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
    message.error('两次密码不一致')
    return
  }

  // 构建注册请求数据
  const registerData = {
    userAccount: values.email, // 使用邮箱作为账号
    userPassword: values.userPassword,
    checkPassword: values.checkPassword,
    email: values.email,
    code: values.code
  }

  try {
    const res = await userRegisterUsingPost(registerData)

    // 注册成功，跳转至登录页
    if (res.data.code === 0 && res.data.data) {
      message.success('注册成功')
      router.push({
        path: '/user/login',
        replace: true,
      })
    } else {
      message.error('注册失败，' + res.data.message)
    }
  } catch (error) {
    message.error('注册失败，请稍后重试')
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

.page-container {
  display: grid;
  grid-template-columns: 380px 1fr;
  grid-template-rows: auto auto;
  grid-template-areas: 
    "form image"
    "form text";
  gap: 20px;
  width: 900px;
  max-width: 90%;
  background-color: white;
  padding: 20px;
}

.form-container {
  grid-area: form;
  padding: 20px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  border-right: 1px solid #f0f0f0;
  overflow-y: auto;
  max-height: 650px;
}

.music-image {
  grid-area: image;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;
}

.music-image img {
  width: 100%;
  height: auto;
  max-height: 300px;
  object-fit: contain;
}

.image-text {
  grid-area: text;
  padding: 0 20px 20px 20px;
  border-top: 1px solid #f0f0f0;
}

.image-text h3 {
  font-size: 24px;
  font-weight: 600;
  margin-bottom: 15px;
  color: #333;
}

.image-text p {
  font-size: 16px;
  color: #666;
  line-height: 1.6;
}

.logo {
  text-align: center;
  margin-bottom: 20px;
}

.logo-image {
  width: 50px;
  height: 50px;
}

.title {
  text-align: center;
  font-size: 24px;
  font-weight: 600;
  margin-bottom: 30px;
  color: #333;
}

.form-label {
  font-size: 14px;
  margin-bottom: 8px;
  color: #666;
  font-weight: 500;
}

.register-form {
  margin-bottom: 20px;
  width: 100%;
}

.custom-input {
  height: 40px;
  border-radius: 4px;
  background-color: #f7f9fc;
  border: 1px solid #e0e0e0;
  transition: all 0.3s;
}

.custom-input:hover {
  border-color: #1890ff;
}

.custom-input:focus {
  border-color: #1890ff;
  box-shadow: 0 0 0 2px rgba(24, 144, 255, 0.2);
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
}

.register-button {
  width: 100%;
  height: 40px;
  border-radius: 4px;
  background-color: #1890ff;
  border: none;
  font-weight: 500;
  font-size: 16px;
  margin-top: 10px;
  transition: all 0.3s;
}

.register-button:hover {
  background-color: #40a9ff;
}

.login-link {
  text-align: center;
  font-size: 14px;
  color: #666;
  margin-top: 16px;
}

.link {
  color: #1890ff;
  text-decoration: none;
  font-weight: 500;
}

.link:hover {
  color: #40a9ff;
  text-decoration: underline;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .page-container {
    grid-template-columns: 1fr;
    grid-template-rows: auto auto auto;
    grid-template-areas: 
      "form"
      "image"
      "text";
    width: 100%;
    max-width: 380px;
  }
  
  .form-container {
    border-right: none;
    border-bottom: 1px solid #f0f0f0;
    padding-bottom: 30px;
    max-height: none;
  }
  
  .music-image {
    padding: 30px 20px;
  }
  
  .image-text {
    border-top: 1px solid #f0f0f0;
    padding: 20px;
  }
}
</style>
