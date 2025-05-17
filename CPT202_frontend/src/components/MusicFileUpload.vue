<template>
  <div class="upload-container">
    <div class="upload-item">
      <div class="upload-label">{{ t('message.musicFile') }}</div>
      <a-upload
        v-model:file-list="musicFileList"
        name="file"
        :beforeUpload="beforeMusicUpload"
        :maxCount="1"
      >
        <InteractiveHoverButton :text="t('message.selectMusicFile')">
          <template #prefix>
            <upload-outlined></upload-outlined>
          </template>
        </InteractiveHoverButton>
      </a-upload>
    </div>

    <div class="upload-item">
      <div class="upload-label">{{ t('message.coverImage') }}</div>
      <FileUpload @onChange="handleCoverChange" class="cover-upload" />
    </div>

    <div class="upload-actions">
      <InteractiveHoverButton
        :text="uploading ? t('message.uploading') : t('message.startUpload')"
        :class="'primary-button'"
        @click="handleUpload"
      />
    </div>

    <!-- Edit modal -->
    <music-edit-modal
      v-model:visible="editModalVisible"
      :musicFile="uploadedMusic"
      @success="handleEditSuccess"
    />
  </div>
</template>

<script lang="ts">
import { message } from 'ant-design-vue'
import { UploadOutlined } from '@ant-design/icons-vue'
import { defineComponent, ref, onMounted } from 'vue'
import { uploadMusicFileUsingPost } from '@/api/musicFileController.ts'
import { getUserByIdUsingGet } from '@/api/userController.ts'
import MusicEditModal from './MusicEditModal.vue'
import FileUpload from './ui/file-upload/FileUpload.vue'
import InteractiveHoverButton from './ui/interactive-hover-button/InteractiveHoverButton.vue'
import { useI18n } from 'vue-i18n'
import { useLoginUserStore } from '@/stores/useLoginUserStore.ts'

export default defineComponent({
  components: {
    UploadOutlined,
    MusicEditModal,
    FileUpload,
    InteractiveHoverButton
  },
  emits: ['upload-success'],
  setup(props, { emit }) {
    const { t } = useI18n()

    const musicFileList = ref([])
    const coverFile = ref(null)
    const uploading = ref(false)
    const editModalVisible = ref(false)
    const uploadedMusic = ref(null)
    const loginUserStore = useLoginUserStore()
    const userStatus = ref(0) // Default is 0, allowed to upload

    // Get user status
    const getUserStatus = async () => {
      if (!loginUserStore.loginUser.id) return

      try {
        const res = await getUserByIdUsingGet({ id: loginUserStore.loginUser.id })
        if (res.data.code === 0 && res.data.data) {
          userStatus.value = res.data.data.user_status || 0
        }
      } catch (error) {
        console.error('Failed to get user status:', error)
      }
    }

    // Get user status when component is mounted
    onMounted(() => {
      getUserStatus()
    })

    // Pre-process music file upload
    const beforeMusicUpload = (file) => {
      // Check file type
      const isAudio = file.type.startsWith('audio/')
      if (!isAudio) {
        message.error(t('message.pleaseUploadAudioFile'))
      }
      return false // Prevent automatic upload
    }

    // Handle cover image change
    const handleCoverChange = (files) => {
      if (files && files.length > 0) {
        coverFile.value = files[files.length - 1]
      }
    }

    // Handle file upload
    const handleUpload = async () => {
      // Check if user has upload permission
      if (userStatus.value === 1) {
        message.error(t('message.uploadForbidden'))
        return
      }

      const musicFile = musicFileList.value[0]?.originFileObj

      if (!musicFile) {
        message.error(t('message.pleaseSelectMusic'))
        return
      }

      uploading.value = true

      try {
        const result = await uploadMusicFileUsingPost(
          {}, // params
          {}, // body - ID and artist fields have been removed
          coverFile.value, // coverFile
          musicFile, // file
        )

        if (result.data.code === 0) {
          message.success(t('message.uploadSuccess'))

          // Save uploaded music info and open edit modal
          uploadedMusic.value = result.data.data
          editModalVisible.value = true

          // Clear form
          musicFileList.value = []
          coverFile.value = null
        } else {
          message.error(t('message.uploadFailed') + ': ' + result.data.message)
        }
      } catch (error) {
        message.error(t('message.uploadError') + ': ' + error.message)
      } finally {
        uploading.value = false
      }
    }

    // Handle edit success
    const handleEditSuccess = () => {
      emit('upload-success', uploadedMusic.value)
    }

    return {
      t,
      musicFileList,
      uploading,
      editModalVisible,
      uploadedMusic,
      userStatus,
      beforeMusicUpload,
      handleCoverChange,
      handleUpload,
      handleEditSuccess,
      getUserStatus,
    }
  },
})
</script>

<style scoped>
.upload-container {
  padding: 16px 0;
}

.upload-item {
  margin-bottom: 24px;
}

.upload-label {
  margin-bottom: 12px;
  font-weight: 500;
}

.cover-upload {
  width: 100%;
  max-height: 160px;
  border: 1px dashed #d9d9d9;
  border-radius: 4px;
  background-color: #fafafa;
}

.cover-upload:hover {
  border-color: #1890ff;
}

.upload-actions {
  margin-top: 24px;
  display: flex;
  justify-content: center;
}

.primary-button {
  background-color: #1890ff;
  color: white;
  border: none;
}

.primary-button:hover {
  background-color: #40a9ff;
}

/* 黑暗模式样式 */
:deep([data-theme='dark']) .upload-label {
  color: rgba(255, 255, 255, 0.85);
}

:deep([data-theme='dark']) .ant-upload-list-text-container {
  color: rgba(255, 255, 255, 0.85);
}

:deep([data-theme='dark']) .ant-upload-list-item {
  color: rgba(255, 255, 255, 0.85);
}

:deep([data-theme='dark']) .ant-upload-list-item-name {
  color: rgba(255, 255, 255, 0.85);
}

:deep([data-theme='dark']) .ant-upload-text {
  color: rgba(255, 255, 255, 0.85);
}

:deep([data-theme='dark']) .ant-upload-hint {
  color: rgba(255, 255, 255, 0.45);
}

:deep([data-theme='dark']) .ant-upload-drag {
  background-color: #1e1e1e;
  border: 1px dashed #303030;
}

:deep([data-theme='dark']) .ant-upload-drag:hover {
  border-color: #177ddc;
}

:deep([data-theme='dark']) .cover-upload {
  background-color: #1e1e1e;
  border: 1px dashed #303030;
}

:deep([data-theme='dark']) .cover-upload:hover {
  border-color: #177ddc;
}
</style>
