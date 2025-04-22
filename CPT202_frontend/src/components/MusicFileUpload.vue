<template>
  <div class="upload-container">
    <div class="upload-item">
      <div class="upload-label">音乐文件</div>
      <a-upload
        v-model:file-list="musicFileList"
        name="file"
        :beforeUpload="beforeMusicUpload"
        :maxCount="1"
      >
        <a-button>
          <upload-outlined></upload-outlined>
          选择音乐文件
        </a-button>
      </a-upload>
    </div>

    <div class="upload-item">
      <div class="upload-label">封面图片</div>
      <a-upload
        v-model:file-list="coverFileList"
        name="coverFile"
        :beforeUpload="beforeCoverUpload"
        :maxCount="1"
        list-type="picture-card"
      >
        <div v-if="!coverFileList.length">
          <plus-outlined />
          <div style="margin-top: 8px">上传封面</div>
        </div>
      </a-upload>
    </div>

    <a-form :model="formState" class="form-container">
      <a-form-item label="ID" name="id">
        <a-input v-model:value="formState.id" placeholder="请输入ID(可选)" />
      </a-form-item>
      <a-form-item label="艺术家" name="artist">
        <a-input v-model:value="formState.artist" placeholder="请输入艺术家" />
      </a-form-item>
    </a-form>

    <div class="upload-actions">
      <a-button type="primary" :loading="uploading" @click="handleUpload">
        {{ uploading ? '上传中...' : '开始上传' }}
      </a-button>
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
import { UploadOutlined, PlusOutlined } from '@ant-design/icons-vue'
import { defineComponent, ref, reactive } from 'vue'
import { uploadMusicFileUsingPost } from '@/api/musicFileController.ts'
import MusicEditModal from './MusicEditModal.vue'

export default defineComponent({
  components: {
    UploadOutlined,
    PlusOutlined,
    MusicEditModal,
  },
  emits: ['upload-success'],
  setup(props, { emit }) {
    const musicFileList = ref([])
    const coverFileList = ref([])
    const uploading = ref(false)
    const editModalVisible = ref(false)
    const uploadedMusic = ref(null)

    const formState = reactive({
      id: '',
      artist: '',
    })

    // 预处理音乐文件上传
    const beforeMusicUpload = (file) => {
      // 检查文件类型
      const isAudio = file.type.startsWith('audio/')
      if (!isAudio) {
        message.error('请上传音频文件!')
      }
      return false // 阻止自动上传
    }

    // 预处理封面图片上传
    const beforeCoverUpload = (file) => {
      // 检查文件类型
      const isImage = file.type.startsWith('image/')
      if (!isImage) {
        message.error('请上传图片文件!')
      }
      return false // 阻止自动上传
    }

    // 处理文件上传
    const handleUpload = async () => {
      const musicFile = musicFileList.value[0]?.originFileObj
      const coverFile = coverFileList.value[0]?.originFileObj

      if (!musicFile) {
        message.error('请选择音乐文件!')
        return
      }

      uploading.value = true

      try {
        const result = await uploadMusicFileUsingPost(
          {}, // params
          {
            id: formState.id || undefined,
            artist: formState.artist || undefined,
          }, // body
          coverFile, // coverFile
          musicFile, // file
        )

        if (result.data.code === 0) {
          message.success('上传成功!')

          // 保存上传的音乐信息，并打开编辑弹窗
          uploadedMusic.value = result.data.data
          editModalVisible.value = true

          // 清空表单
          musicFileList.value = []
          coverFileList.value = []
          formState.id = ''
          formState.artist = ''
        } else {
          message.error('上传失败: ' + result.data.message)
        }
      } catch (error) {
        message.error('上传出错: ' + error.message)
      } finally {
        uploading.value = false
      }
    }

    // 处理编辑成功
    const handleEditSuccess = () => {
      emit('upload-success', uploadedMusic.value)
    }

    return {
      musicFileList,
      coverFileList,
      formState,
      uploading,
      editModalVisible,
      uploadedMusic,
      beforeMusicUpload,
      beforeCoverUpload,
      handleUpload,
      handleEditSuccess,
    }
  },
})
</script>
