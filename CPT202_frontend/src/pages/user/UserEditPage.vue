<template>
  <div id="userEditPage">
    <a-card title="Personal Information" style="width: 600px; margin: 50px auto">
      <a-form
        :model="userForm"
        name="userForm"
        :label-col="{ span: 6 }"
        :wrapper-col="{ span: 16 }"
        autocomplete="off"
        @finish="onFinish"
      >
        <!-- User Avatar -->
        <a-form-item label="Avatar" name="userAvatar">
          <div class="avatar-wrapper">
            <a-avatar :size="100" :src="userForm.userAvatar" />
            <a-upload
              name="avatar"
              :show-upload-list="false"
              :before-upload="handleUpload"
              accept="image/*"
              style="margin-top: 16px"
            >
              <a-button
                style="background-color: #87ceeb; border-color: #87ceeb; color: white"
                :loading="uploading"
              >
                <template #icon><CloudUploadOutlined /></template>
                Upload
              </a-button>
            </a-upload>
          </div>
        </a-form-item>

        <!-- User Account (read-only) -->
        <a-form-item label="Account" name="userAccount">
          <a-input v-model:value="userForm.userAccount" disabled />
        </a-form-item>

        <!-- User Name -->
        <a-form-item
          label="Username"
          name="userName"
          :rules="[{ required: true, message: 'Please input your username!' }]"
        >
          <a-input v-model:value="userForm.userName" />
        </a-form-item>

        <!-- User Profile -->
        <a-form-item label="Profile" name="userProfile">
          <a-textarea
            v-model:value="userForm.userProfile"
            :rows="4"
            placeholder="Tell us about yourself"
          />
        </a-form-item>

        <!-- User Role (read-only) -->
        <a-form-item label="Role" name="userRole">
          <a-tag :color="userForm.userRole === 'admin' ? 'green' : 'blue'">
            {{ userForm.userRole }}
          </a-tag>
        </a-form-item>

        <!-- Submit Button -->
        <a-form-item :wrapper-col="{ offset: 6, span: 16 }">
          <a-button type="primary" html-type="submit" :loading="loading" style="margin-right: 10px"
            >Save Changes</a-button
          >
          <a-button
            style="background-color: #87ceeb; border-color: #87ceeb; color: white"
            @click="showPasswordModal"
          >
            <template #icon><AlertOutlined /></template>
            Change Password
          </a-button>
        </a-form-item>
      </a-form>
    </a-card>

    <!-- Change Password Modal -->
    <a-modal
      v-model:visible="isModalVisible"
      title="Change Password"
      ok-text="Confirm"
      cancel-text="Cancel"
      :confirm-loading="passwordLoading"
      @ok="handlePasswordChange"
      @cancel="resetPasswordForm"
    >
      <a-form ref="passwordFormRef" :model="passwordForm" :rules="passwordRules" layout="vertical">
        <a-form-item label="New Password" name="newPassword">
          <a-input-password
            v-model:value="passwordForm.newPassword"
            placeholder="Enter new password"
          >
            <template #prefix><LockOutlined /></template>
          </a-input-password>
        </a-form-item>
        <a-form-item label="Confirm New Password" name="confirmPassword">
          <a-input-password
            v-model:value="passwordForm.confirmPassword"
            placeholder="Confirm new password"
          >
            <template #prefix><LockOutlined /></template>
          </a-input-password>
        </a-form-item>
      </a-form>
    </a-modal>
  </div>
</template>

<script lang="ts" setup>
import { ref, reactive, onMounted } from 'vue'
import { message, UploadProps, Modal, Form, InputPassword } from 'ant-design-vue'
import type { FormInstance, FormRule } from 'ant-design-vue'
import { useLoginUserStore } from '@/stores/useLoginUserStore.ts'
import { updateUserUsingPost, uploadAvatarUsingPost } from '@/api/userController.ts'
import { CloudUploadOutlined, AlertOutlined, LockOutlined } from '@ant-design/icons-vue'
import { useRouter, useRoute } from 'vue-router'

const router = useRouter()
const route = useRoute()

// Get login user store
const loginUserStore = useLoginUserStore()
const loading = ref(false)
const uploading = ref(false)

// --- Start: Password Change Modal State ---
const isModalVisible = ref(false)
const passwordLoading = ref(false)
const passwordFormRef = ref<FormInstance>()
const passwordForm = reactive({
  newPassword: '',
  confirmPassword: '',
})

const validateConfirmPassword = async (_rule: FormRule, value: string) => {
  if (value === '') {
    return Promise.reject('Please confirm your new password!')
  } else if (value !== passwordForm.newPassword) {
    return Promise.reject('The confirmation password should be the same as the new password') // Confirm password should be the same as the new password
  } else {
    return Promise.resolve()
  }
}

const passwordRules: Record<string, FormRule[]> = {
  newPassword: [
    { required: true, message: 'Please input your new password!' },
    { min: 8, message: 'The password must be at least 8 characters long' }, // Password length must be at least 8 characters
  ],
  confirmPassword: [{ required: true, validator: validateConfirmPassword, trigger: 'change' }],
}

const showPasswordModal = () => {
  isModalVisible.value = true
}

const resetPasswordForm = () => {
  passwordFormRef.value?.resetFields()
  passwordForm.newPassword = ''
  passwordForm.confirmPassword = ''
}

const handlePasswordChange = async () => {
  try {
    await passwordFormRef.value?.validate()
    passwordLoading.value = true

    const updateRequest = {
      id: userForm.id,
      userPassword: passwordForm.newPassword,
    }

    const res = await updateUserUsingPost(updateRequest)

    if (res.data.code === 0) {
      message.success('Password updated successfully')
      isModalVisible.value = false
      resetPasswordForm()
    } else {
      message.error('Failed to update password: ' + (res.data.message || 'Unknown error'))
    }
  } catch (errorInfo) {
    // Validation failed or other error during validation
    console.log('Password form validation failed:', errorInfo)
    if (errorInfo instanceof Error) {
      message.error('An error occurred: ' + errorInfo.message)
    } else {
      // Handle specific validation errors if needed
    }
  } finally {
    passwordLoading.value = false
  }
}
// --- End: Password Change Modal State ---

// Initialize form with current user data
const userForm = reactive({
  id: loginUserStore.loginUser.id,
  userAccount: loginUserStore.loginUser.userAccount,
  userName: loginUserStore.loginUser.userName,
  userAvatar: loginUserStore.loginUser.userAvatar,
  userProfile: loginUserStore.loginUser.userProfile,
  userRole: loginUserStore.loginUser.userRole,
})

// Handle Avatar Upload
const handleUpload: UploadProps['beforeUpload'] = async (file) => {
  uploading.value = true
  try {
    const res = await uploadAvatarUsingPost({}, file)
    if (res.data.code === 0 && res.data.data) {
      message.success('Avatar uploaded successfully')
      // Update the avatar URL in the form and potentially the store
      userForm.userAvatar = res.data.data
      // Optionally trigger store update if needed elsewhere immediately
      // loginUserStore.loginUser.userAvatar = res.data.data
    } else {
      message.error('Avatar upload failed: ' + (res.data.message || 'Unknown error'))
    }
  } catch (error: any) {
    message.error('Avatar upload failed: ' + error.message)
  } finally {
    uploading.value = false
  }
  return false // Prevent default upload behavior
}

// Submit form handler
const onFinish = async () => {
  try {
    loading.value = true

    // Prepare update request
    const updateRequest = {
      id: userForm.id,
      userName: userForm.userName,
      userAvatar: userForm.userAvatar,
      userProfile: userForm.userProfile,
    }

    // Call API to update user
    const res = await updateUserUsingPost(updateRequest)

    if (res.data.code === 0) {
      message.success('Your information has been updated successfully')

      // Update local user data
      await loginUserStore.fetchLoginUser()

      // Redirect to previous page or home page
      if (route.query.redirect) {
        // If there's a redirect query parameter, use it
        router.push(route.query.redirect as string)
      } else if (route.query.from) {
        // If there's a from query parameter, use it
        router.push(route.query.from as string)
      } else {
        // Otherwise, go back to the previous page or home if no history
        router.go(-1)
      }
    } else {
      message.error('Failed to update: ' + res.data.message)
    }
  } catch (error) {
    message.error('An error occurred: ' + error)
  } finally {
    loading.value = false
  }
}

// Load user data when component mounts
onMounted(async () => {
  // Refresh user data from server
  await loginUserStore.fetchLoginUser()

  // Update form with fresh data
  Object.assign(userForm, {
    id: loginUserStore.loginUser.id,
    userAccount: loginUserStore.loginUser.userAccount,
    userName: loginUserStore.loginUser.userName,
    userAvatar: loginUserStore.loginUser.userAvatar,
    userProfile: loginUserStore.loginUser.userProfile,
    userRole: loginUserStore.loginUser.userRole,
  })
})
</script>

<style scoped>
.avatar-wrapper {
  display: flex;
  flex-direction: column;
  align-items: center;
}

#userEditPage {
  padding: 24px;
  background-color: #f0f2f5;
  min-height: calc(100vh - 64px);
}
</style>
