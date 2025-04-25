<template>
  <a-modal
    v-model:visible="visible"
    :title="t('editMusicInfo')"
    :footer="null"
    @cancel="handleCancel"
    width="600px"
  >
    <a-form :model="formState" :label-col="{ span: 4 }" :wrapper-col="{ span: 20 }">
      <a-form-item :label="t('musicName')" name="name">
        <a-input v-model:value="formState.name" :placeholder="t('pleaseEnterMusicName')" />
      </a-form-item>

      <a-form-item :label="t('artist')" name="artist">
        <a-input v-model:value="formState.artist" :placeholder="t('pleaseEnterArtist')" />
      </a-form-item>

      <a-form-item :label="t('album')" name="album">
        <a-input v-model:value="formState.album" :placeholder="t('pleaseEnterAlbumName')" />
      </a-form-item>

      <a-form-item :label="t('category')" name="category">
        <a-select 
          v-model:value="formState.category" 
          :placeholder="t('pleaseSelectOrEnterCategory')" 
          style="width: 100%"
          mode="tags"
          :tokenSeparators="[',']"
          :options="categories"
          :maxTagCount="1"
          :tokenProps="{
            onKeyDown: (e)=>{e.stopPropagation()},
          }"
          @change="handleCategoryChange"
        >
        </a-select>
      </a-form-item>

      <a-form-item :label="t('tags')" name="tags">
        <a-select
          v-model:value="formState.tags"
          mode="tags"
          :placeholder="t('pleaseSelectOrEnterTags')"
          style="width: 100%"
          :options="defaultTags"
          :tokenSeparators="[',']"
        >
        </a-select>
      </a-form-item>

      <div class="flex justify-end mt-4">
        <interactive-hover-button
          :text="t('confirm')"
          @click="handleOk"
          :class="{ 'opacity-50 cursor-not-allowed': confirmLoading }"
          :disabled="confirmLoading"
        />
      </div>
    </a-form>
  </a-modal>
</template>

<script lang="ts">
import { defineComponent, ref, reactive, PropType, watch } from 'vue'
import { message } from 'ant-design-vue'
import {
  updateMusicFileUsingPost,
  listMusicFileTagCategoryUsingGet,
} from '@/api/musicFileController.ts'
import { useI18n } from 'vue-i18n'
import InteractiveHoverButton from '@/components/ui/interactive-hover-button/InteractiveHoverButton.vue'
import { useMusicStore } from '@/stores/musicStore'

export default defineComponent({
  components: {
    InteractiveHoverButton
  },
  props: {
    visible: {
      type: Boolean,
      default: false,
    },
    musicFile: {
      type: Object as PropType<any>,
      default: () => ({}),
    },
  },
  emits: ['update:visible', 'success'],
  setup(props, { emit }) {
    const { t } = useI18n()
    const confirmLoading = ref(false)
    const categories = ref<{ label: string; value: string }[]>([])
    const musicStore = useMusicStore()
    
    // 预设的默认标签选项
    const defaultTags = ref([
      { label: t('genreRock'), value: t('genreRock') },
      { label: t('genrePop'), value: t('genrePop') },
      { label: t('genreJazz'), value: t('genreJazz') },
      { label: t('genreClassical'), value: t('genreClassical') },
      { label: t('genreElectronic'), value: t('genreElectronic') },
      { label: t('genreFolk'), value: t('genreFolk') },
      { label: t('genreHipHop'), value: t('genreHipHop') },
      { label: t('genreRnB'), value: t('genreRnB') },
      { label: t('genreCountry'), value: t('genreCountry') },
      { label: t('genreBlues'), value: t('genreBlues') },
    ])

    // 从语言包获取音乐类型
    const getMusicGenres = () => {
      return [
        { label: 'Pop Music', value: 'Pop Music' },
        { label: 'Rock', value: 'Rock' },
        { label: 'Classical', value: 'Classical' },
        { label: 'Jazz', value: 'Jazz' },
        { label: 'Hip Hop', value: 'Hip Hop' },
        { label: 'R&B', value: 'R&B' },
        { label: 'Country', value: 'Country' },
        { label: 'Electronic', value: 'Electronic' },
        { label: 'Dance', value: 'Dance' },
        { label: 'Metal', value: 'Metal' },
        { label: 'Folk', value: 'Folk' },
        { label: 'Blues', value: 'Blues' },
        { label: 'Reggae', value: 'Reggae' },
        { label: 'Soul', value: 'Soul' },
        { label: 'Funk', value: 'Funk' },
        { label: 'Indie', value: 'Indie' },
        { label: 'Punk', value: 'Punk' },
        { label: 'Alternative', value: 'Alternative' },
        { label: 'EDM', value: 'EDM' },
        { label: 'Ambient', value: 'Ambient' },
        { label: 'Latin', value: 'Latin' },
        { label: 'K-pop', value: 'K-pop' },
        { label: 'J-pop', value: 'J-pop' },
        { label: 'C-pop', value: 'C-pop' },
        { label: 'Opera', value: 'Opera' },
        { label: 'Disco', value: 'Disco' },
        { label: 'Gospel', value: 'Gospel' },
        { label: 'Rap', value: 'Rap' },
        { label: 'Trap', value: 'Trap' },
        { label: 'Techno', value: 'Techno' },
        { label: 'Jazz Fusion', value: 'Jazz Fusion' },
        { label: 'Hard Rock', value: 'Hard Rock' },
        { label: 'Heavy Metal', value: 'Heavy Metal' },
        { label: 'Drum and Bass', value: 'Drum and Bass' },
        { label: 'House', value: 'House' },
        { label: 'Trance', value: 'Trance' },
        { label: 'Dubstep', value: 'Dubstep' },
        { label: 'Acoustic', value: 'Acoustic' },
        { label: 'Experimental', value: 'Experimental' },
        { label: 'World Music', value: 'World Music' },
        { label: 'Symphonic', value: 'Symphonic' },
        { label: 'Chillout', value: 'Chillout' },
        { label: 'Lo-fi', value: 'Lo-fi' },
        { label: 'Big Band', value: 'Big Band' },
        { label: 'Orchestral', value: 'Orchestral' },
        { label: 'New Age', value: 'New Age' },
        { label: 'Grunge', value: 'Grunge' },
        { label: 'Bluegrass', value: 'Bluegrass' },
        { label: 'Baroque', value: 'Baroque' },
        { label: 'A cappella', value: 'A cappella' }
      ]
    }

    const formState = reactive({
      id: '',
      name: '',
      artist: '',
      album: '',
      category: '',
      tags: [] as string[],
    })

    // 处理类别变化 - 当用户自定义类别时添加到Store
    const handleCategoryChange = (value) => {
      if (Array.isArray(value) && value.length > 0) {
        // 限制只能选择一个类别
        const category = value[value.length - 1]
        formState.category = category
        
        // 检查是否是自定义类别，如果是新的自定义类别则添加到MusicStore
        const existingCategory = categories.value.find(cat => cat.value === category)
        if (!existingCategory) {
          musicStore.addCustomCategory(category)
          message.success(t('categoryAddedSuccess'))
        }
      } else if (value === '') {
        formState.category = ''
      }
    }

    // 监听musicFile变化，更新表单
    watch(
      () => props.musicFile,
      (newVal) => {
        if (newVal && newVal.id) {
          formState.id = newVal.id
          formState.name = newVal.name || ''
          formState.artist = newVal.artist || ''
          formState.album = newVal.album || ''
          formState.category = newVal.category || ''
          formState.tags = newVal.tags || []
        }
      },
      { immediate: true, deep: true },
    )

    // 获取标签和类别列表
    const fetchTagsAndCategories = async () => {
      try {
        const res = await listMusicFileTagCategoryUsingGet()
        if (res.data.code === 0 && res.data.data) {
          // 合并API返回的类别、音乐类型和自定义类别
          const apiCategories = (res.data.data.categoryList || []).map(cat => ({
            label: cat,
            value: cat
          }))
          const genreCategories = getMusicGenres()
          
          // 添加用户自定义类别
          const customCategories = musicStore.customCategories.map(cat => ({
            label: cat,
            value: cat
          }))
          
          categories.value = [...new Set([...apiCategories, ...genreCategories, ...customCategories])]
        }
      } catch (error) {
        message.error(t('fetchCategoriesFailed'))
        console.error(error)
      }
    }

    // 初始化时获取类别
    fetchTagsAndCategories()

    // 确认更新
    const handleOk = async () => {
      if (!formState.id) {
        message.error(t('missingMusicId'))
        return
      }

      confirmLoading.value = true
      try {
        const res = await updateMusicFileUsingPost({
          id: formState.id,
          name: formState.name,
          artist: formState.artist,
          album: formState.album,
          category: formState.category,
          tags: formState.tags,
        })

        if (res.data.code === 0) {
          message.success(t('updateSuccess'))
          emit('success')
          emit('update:visible', false)
        } else {
          message.error(`${t('updateFailed')}: ${res.data.message}`)
        }
      } catch (error) {
        message.error(t('updateFailed'))
        console.error(error)
      } finally {
        confirmLoading.value = false
      }
    }

    // 取消
    const handleCancel = () => {
      emit('update:visible', false)
    }

    return {
      t,
      confirmLoading,
      formState,
      defaultTags,
      categories,
      handleOk,
      handleCancel,
      handleCategoryChange,
    }
  },
})
</script>

<style scoped>
.ant-divider {
  margin: 4px 0;
}
</style>
