<template>
  <div id="userLoginPage">
    <div class="page-container">
      <!-- 登录表单区域 -->
      <div class="form-container">
        <div class="logo">
          <img src="/logo.png" alt="MelodyHub Logo" class="logo-image" />
        </div>
        <h2 class="title">登录</h2>

        <a-form
          :model="formState"
          name="basic"
          autocomplete="off"
          @finish="handleSubmit"
          class="login-form"
        >
          <div class="form-label">账号</div>
          <a-form-item name="userAccount" :rules="[{ required: true, message: '请输入您的账号' }]">
            <a-input
              v-model:value="formState.userAccount"
              placeholder="请输入账号"
              class="custom-input"
            />
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

          <a-form-item>
            <a-button type="primary" html-type="submit" class="login-button">登录</a-button>
          </a-form-item>
        </a-form>

        <div class="register-link">
          还没有账号？
          <RouterLink to="/user/register" class="link">注册</RouterLink>
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
import { reactive } from 'vue'
import { useRouter } from 'vue-router'
import { useLoginUserStore } from '@/stores/useLoginUserStore.ts'
import { userLoginUsingPost } from '@/api/userController.ts'
import { message } from 'ant-design-vue'

const formState = reactive<API.UserLoginRequest>({
  userAccount: '',
  userPassword: '',
})

// 获取路由实例
const router = useRouter()
const loginUserStore = useLoginUserStore()

/**
 * 提交表单
 * @param values
 */
const handleSubmit = async (values: any) => {
  const res = await userLoginUsingPost(values)
  // 登录成功，把登录态保存到全局状态中
  if (res.data.code === 0 && res.data.data) {
    await loginUserStore.fetchLoginUser()
    message.success('登录成功')
    router.push({
      path: '/',
      replace: true,
    })
  } else {
    message.error('登录失败，' + res.data.message)
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

.login-form {
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

.login-button {
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

.login-button:hover {
  background-color: #40a9ff;
}

.register-link {
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
