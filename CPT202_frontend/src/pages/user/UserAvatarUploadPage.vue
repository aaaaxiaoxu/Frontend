<template>
  <div id="userAvatarUploadPage">
    <!-- Using colorful particle background, can set different color combinations -->
    <MultiColorParticlesBg
      class="particles-background"
      :colors="['#2F54EB', '#EB2F96', '#FAAD14', '#13C2C2', '#52C41A']"
      :quantity="1080"
    />

    <div class="form-card">
      <h2 class="title">{{ $t('message.uploadAvatar') || 'Upload Avatar' }}</h2>
      <p class="subtitle">{{ $t('message.uploadAvatarDesc') || 'Choose an avatar for your account (optional)' }}</p>

      <div class="avatar-upload-container">
        <a-upload
          v-model:file-list="avatarFileList"
          name="file"
          :beforeUpload="beforeAvatarUpload"
          :maxCount="1"
          :showUploadList="false"
          accept="image/*"
        >
          <div class="avatar-upload-box">
            <div v-if="avatarPreview" class="avatar-preview">
              <img :src="avatarPreview" alt="Avatar Preview" />
            </div>
            <div v-else>
              <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="upload-icon">
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                <polyline points="17 8 12 3 7 8"></polyline>
                <line x1="12" y1="3" x2="12" y2="15"></line>
              </svg>
              <p class="upload-text">{{ $t('message.clickToUpload') || 'Click to upload' }}</p>
            </div>
          </div>
        </a-upload>
      </div>

      <div class="button-group">
        <a-button
          type="primary"
          @click="handleUploadAvatar"
          :loading="uploading"
          :disabled="avatarFileList.length === 0"
          class="upload-button"
        >
          {{ $t('message.confirm') || 'Confirm' }}
        </a-button>
        <a-button @click="skipUpload" class="skip-button">
          {{ $t('message.skip') || 'Skip this step' }}
        </a-button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { uploadAvatarByAccountUsingPost } from '@/api/userController.ts'
import { message } from 'ant-design-vue'
import MultiColorParticlesBg from '@/components/ui/particles-bg/MultiColorParticlesBg.vue'
import { useI18n } from 'vue-i18n'

const { t, locale } = useI18n()
const router = useRouter()
const route = useRoute()

// Get user account from URL
const userAccount = ref('')

onMounted(() => {
  if (route.query.userAccount) {
    userAccount.value = route.query.userAccount as string
  } else {
    // If no user account is found, redirect back to login page
    message.error(t('message.sessionExpired') || 'Session expired, please login again')
    router.push('/user/login')
  }
})

// Avatar file list
const avatarFileList = ref([])
const avatarPreview = ref('')
const uploading = ref(false)

// Pre-process avatar upload
const beforeAvatarUpload = (file) => {
  // Check file type
  const isImage = file.type.startsWith('image/')
  if (!isImage) {
    message.error(t('message.pleaseUploadImageFile') || 'Please upload an image file')
    return false
  }

  // Save file to list
  avatarFileList.value = [{ ...file, status: 'done', url: URL.createObjectURL(file) }]

  // Set preview image
  avatarPreview.value = URL.createObjectURL(file)

  return false // Prevent automatic upload
}

const handleUploadAvatar = async () => {
  if (avatarFileList.value.length === 0) {
    return
  }

  uploading.value = true

  try {
    const avatarFile = avatarFileList.value[0].originFileObj || avatarFileList.value[0]
    // Use account to upload avatar
    const avatarRes = await uploadAvatarByAccountUsingPost(
      { userAccount: userAccount.value }, // Use string account
      {},
      avatarFile,
      { timeout: 30000 } // Increase timeout
    )

    if (avatarRes.data.code === 0 && avatarRes.data.data) {
      message.success(t('message.avatarUploadSuccess') || 'Avatar uploaded successfully')
      router.push('/user/login')
    } else {
      message.error(t('message.avatarUploadFailed') || 'Avatar upload failed: ' + (avatarRes.data.message || ''))
    }
  } catch (error) {
    console.error('Avatar upload failed:', error)
    // Add more detailed error information
    if (error.code === 'ECONNABORTED') {
      message.error('Connection timeout. Please try again later.')
    } else if (error.response && error.response.status === 404) {
      message.error('Avatar upload service not found. Please contact administrator.')
    } else {
      message.error(`Upload failed: ${error.message || 'Unknown error'}`)
    }
  } finally {
    uploading.value = false
  }
}

// Skip upload
const skipUpload = () => {
  message.info(t('message.skipAvatarUpload') || 'Skipped avatar upload')
  router.push('/user/login')
}
</script>

<style scoped>
#userAvatarUploadPage {
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
  text-align: center;
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

.avatar-upload-container {
  display: flex;
  justify-content: center;
  margin: 30px 0;
}

.avatar-upload-box {
  width: 150px;
  height: 150px;
  border-radius: 8px;
  background-color: #fafafa;
  border: 1px dashed #d9d9d9;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.3s;
  overflow: hidden;
}

.avatar-upload-box:hover {
  border-color: #1890ff;
  background-color: #f0f7ff;
}

.avatar-preview {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
}

.avatar-preview img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.upload-icon {
  color: #999;
  transition: color 0.3s;
}

.upload-text {
  margin-top: 8px;
  color: #999;
  font-size: 14px;
}

.avatar-upload-box:hover .upload-icon,
.avatar-upload-box:hover .upload-text {
  color: #1890ff;
}

.button-group {
  display: flex;
  flex-direction: column;
  gap: 12px;
  margin-top: 20px;
}

.upload-button {
  width: 100%;
  height: 45px;
  border-radius: 4px;
  background-color: #000;
  border: none;
  font-weight: 500;
  font-size: 16px;
  transition: all 0.3s;
  color: white !important; /* 添加 !important 确保样式优先级 */
}

.upload-button :deep(span) {
  color: white !important;
}

.upload-button:hover {
  background-color: #333;
}

.skip-button {
  width: 100%;
  height: 45px;
  border-radius: 4px;
  background-color: transparent;
  border: 1px solid #d9d9d9;
  font-weight: 500;
  font-size: 16px;
  color: #666;
  transition: all 0.3s;
}

.skip-button:hover {
  border-color: #1890ff;
  color: #1890ff;
}
</style>
