<template>
  <div id="userRegisterPage">
    <div class="Register-container">
      <div class="logo">
        <img src="/logo.png" alt="MelodyHub Logo" class="logo-image" />
      </div>
      <h2 class="title">注册</h2>

      <a-form :model="formState" name="basic" autocomplete="off" @finish="handleSubmit" class="login-form">
        <div class="form-label">账号</div>
        <a-form-item name="userAccount" :rules="[{ required: true, message: '请输入您的账号' }]">
          <a-input v-model:value="formState.userAccount" placeholder="请输入账号" class="custom-input" />
        </a-form-item>

        <div class="form-label">密码</div>
        <a-form-item
          name="userPassword"
          :rules="[
            { required: true, message: '请输入您的密码' },
            { min: 8, message: '密码长度至少为8个字符' },
          ]"
        >
          <a-input-password v-model:value="formState.userPassword" placeholder="请输入密码" class="custom-input" />
        </a-form-item>

        <div class="form-label">确认密码</div>
        <a-form-item
          name="checkPassword"
          :rules="[
            { required: true, message: '请确认您的密码' },
            { min: 8, message: '确认密码长度至少为8个字符' },
          ]"
        >
          <a-input-password v-model:value="formState.checkPassword" placeholder="请确认密码" class="custom-input" />
        </a-form-item>


        <a-form-item>
          <a-button type="primary" html-type="submit" class="login-button">登录</a-button>
        </a-form-item>
      </a-form>

      <div class="register-link">
        已经有账号？
        <RouterLink to="/user/login" class="link">登录</RouterLink>
      </div>
    </div>
  </div>
</template>


<script setup lang="ts">
// 用于接收表单输入的值
import { reactive } from 'vue'
import { useRouter } from 'vue-router'
import { useLoginUserStore } from '@/stores/useLoginUserStore.ts'
import { userLoginUsingPost, userRegisterUsingPost } from '@/api/userController.ts'
import { message } from 'ant-design-vue'

const formState = reactive<API.UserRegisterRequest>({
  userAccount: '',
  userPassword: '',
  checkPassword: '',
})

// 获取路由实例
const router = useRouter()
const loginUserStore = useLoginUserStore()

/**
 * 提交表单
 * @param values
 */
const handleSubmit = async (values: any) => {
  //校验两次输入的密码是否一致
  if (values.userPassword != values.checkPassword) {
    message.error("两次密码不一致")
  }
  const res = await userRegisterUsingPost(values)
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
}
</script>


<style scoped>
#userRegisterPage {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  background-color: #f5f5f5;
  color: #333;
}

.Register-container {
  background-color: white;
  border-radius: 8px;
  width: 380px;
  padding: 30px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
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
}

.custom-input {
  height: 40px;
  border-radius: 4px;
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
</style>
