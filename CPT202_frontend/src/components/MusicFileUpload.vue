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

    <!-- 编辑弹窗 -->
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
import { defineComponent, ref } from 'vue'
import { uploadMusicFileUsingPost } from '@/api/musicFileController.ts'
import MusicEditModal from './MusicEditModal.vue'
import FileUpload from './ui/file-upload/FileUpload.vue'
import InteractiveHoverButton from './ui/interactive-hover-button/InteractiveHoverButton.vue'
import { useI18n } from 'vue-i18n'

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

    // 预处理音乐文件上传
    const beforeMusicUpload = (file) => {
      // 检查文件类型
      const isAudio = file.type.startsWith('audio/')
      if (!isAudio) {
        message.error(t('message.pleaseUploadAudioFile'))
      }
      return false // 阻止自动上传
    }

    // 处理封面图片变更
    const handleCoverChange = (files) => {
      if (files && files.length > 0) {
        coverFile.value = files[files.length - 1]
      }
    }

    // 处理文件上传
    const handleUpload = async () => {
      const musicFile = musicFileList.value[0]?.originFileObj

      if (!musicFile) {
        message.error(t('message.pleaseSelectMusic'))
        return
      }

      uploading.value = true

      try {
        const result = await uploadMusicFileUsingPost(
          {}, // params
          {}, // body - 已移除ID和艺术家字段
          coverFile.value, // coverFile
          musicFile, // file
        )

        if (result.data.code === 0) {
          message.success(t('message.uploadSuccess'))

          // 保存上传的音乐信息，并打开编辑弹窗
          uploadedMusic.value = result.data.data
          editModalVisible.value = true

          // 清空表单
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

    // 处理编辑成功
    const handleEditSuccess = () => {
      emit('upload-success', uploadedMusic.value)
    }

    return {
      t,
      musicFileList,
      uploading,
      editModalVisible,
      uploadedMusic,
      beforeMusicUpload,
      handleCoverChange,
      handleUpload,
      handleEditSuccess,
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
</style>
