 <template>
  <a-modal
    v-model:visible="visible"
    title="编辑音乐信息"
    @ok="handleOk"
    @cancel="handleCancel"
    :confirmLoading="confirmLoading"
    width="600px"
  >
    <a-form
      :model="formState"
      :label-col="{ span: 4 }"
      :wrapper-col="{ span: 20 }"
    >
      <a-form-item label="名称" name="name">
        <a-input v-model:value="formState.name" placeholder="请输入音乐名称" />
      </a-form-item>
      
      <a-form-item label="艺术家" name="artist">
        <a-input v-model:value="formState.artist" placeholder="请输入艺术家" />
      </a-form-item>
      
      <a-form-item label="专辑" name="album">
        <a-input v-model:value="formState.album" placeholder="请输入专辑名称" />
      </a-form-item>
      
      <a-form-item label="类别" name="category">
        <a-select
          v-model:value="formState.category"
          placeholder="请选择类别"
          style="width: 100%"
        >
          <a-select-option v-for="category in categories" :key="category" :value="category">
            {{ category }}
          </a-select-option>
        </a-select>
      </a-form-item>
      
      <a-form-item label="标签" name="tags">
        <a-select
          v-model:value="formState.tags"
          mode="multiple"
          placeholder="请选择标签"
          style="width: 100%"
        >
          <a-select-option v-for="tag in tags" :key="tag" :value="tag">
            {{ tag }}
          </a-select-option>
        </a-select>
      </a-form-item>
    </a-form>
  </a-modal>
</template>

<script lang="ts">
import { defineComponent, ref, reactive, PropType, watch } from 'vue';
import { message } from 'ant-design-vue';
import { updateMusicFileUsingPost, listMusicFileTagCategoryUsingGet } from '@/api/musicFileController.ts';

export default defineComponent({
  props: {
    visible: {
      type: Boolean,
      default: false
    },
    musicFile: {
      type: Object as PropType<any>,
      default: () => ({})
    }
  },
  emits: ['update:visible', 'success'],
  setup(props, { emit }) {
    const confirmLoading = ref(false);
    const tags = ref<string[]>([]);
    const categories = ref<string[]>([]);
    
    const formState = reactive({
      id: '',
      name: '',
      artist: '',
      album: '',
      category: '',
      tags: [] as string[]
    });

    // 监听musicFile变化，更新表单
    watch(() => props.musicFile, (newVal) => {
      if (newVal && newVal.id) {
        formState.id = newVal.id;
        formState.name = newVal.name || '';
        formState.artist = newVal.artist || '';
        formState.album = newVal.album || '';
        formState.category = newVal.category || '';
        formState.tags = newVal.tags || [];
      }
    }, { immediate: true, deep: true });
    
    // 获取标签和类别列表
    const fetchTagsAndCategories = async () => {
      try {
        const res = await listMusicFileTagCategoryUsingGet();
        if (res.data.code === 0 && res.data.data) {
          tags.value = res.data.data.tagList || [];
          categories.value = res.data.data.categoryList || [];
        }
      } catch (error) {
        message.error('获取标签和类别失败');
        console.error(error);
      }
    };
    
    // 初始化时获取标签和类别
    fetchTagsAndCategories();
    
    // 确认更新
    const handleOk = async () => {
      if (!formState.id) {
        message.error('缺少音乐ID');
        return;
      }
      
      confirmLoading.value = true;
      try {
        const res = await updateMusicFileUsingPost({
          id: formState.id,
          name: formState.name,
          artist: formState.artist,
          album: formState.album,
          category: formState.category,
          tags: formState.tags
        });
        
        if (res.data.code === 0) {
          message.success('更新成功');
          emit('success');
          emit('update:visible', false);
        } else {
          message.error(`更新失败: ${res.data.message}`);
        }
      } catch (error) {
        message.error('更新失败');
        console.error(error);
      } finally {
        confirmLoading.value = false;
      }
    };
    
    // 取消
    const handleCancel = () => {
      emit('update:visible', false);
    };
    
    return {
      confirmLoading,
      formState,
      tags,
      categories,
      handleOk,
      handleCancel
    };
  }
});
</script>