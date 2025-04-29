<template>
  <a-layout class="music-page-layout">
    <!-- Category Sidebar -->
    <a-layout-sider width="200" style="background: #fff">
      <a-menu
        mode="inline"
        :style="{ height: '100%', borderRight: 0 }"
        v-model:selectedKeys="selectedCategoryKeys"
        @click="handleCategoryClick"
      >
        <a-menu-item key="uploaded">
          {{ t('message.uploaded') }}
        </a-menu-item>

        
        <a-sub-menu key="popular" :title="t('message.popularCategory')">
          <a-menu-item key="genrePop">{{ t('message.genrePop') }}</a-menu-item>
          <a-menu-item key="genreRock">{{ t('message.genreRock') }}</a-menu-item>
          <a-menu-item key="genreHipHop">{{ t('message.genreHipHop') }}</a-menu-item>
          <a-menu-item key="genreRnB">{{ t('message.genreRnB') }}</a-menu-item>
          <a-menu-item key="genreCountry">{{ t('message.genreCountry') }}</a-menu-item>
          <a-menu-item key="genreElectronic">{{ t('message.genreElectronic') }}</a-menu-item>
          <a-menu-item key="genreJazz">{{ t('message.genreJazz') }}</a-menu-item>
          <a-menu-item key="genreClassical">{{ t('message.genreClassical') }}</a-menu-item>
          <a-menu-item key="genreBlues">{{ t('message.genreBlues') }}</a-menu-item>
          <a-menu-item key="genreMetal">{{ t('message.genreMetal') }}</a-menu-item>
        </a-sub-menu>

        
        <a-sub-menu key="international" :title="t('message.internationalPop')">
          <a-menu-item key="genreLatin">{{ t('message.genreLatin') }}</a-menu-item>
          <a-menu-item key="genreKpop">{{ t('message.genreKpop') }}</a-menu-item>
          <a-menu-item key="genreJpop">{{ t('message.genreJpop') }}</a-menu-item>
          <a-menu-item key="genreCpop">{{ t('message.genreCpop') }}</a-menu-item>
        </a-sub-menu>

        
        <a-sub-menu key="electronic" :title="t('message.electronicMusic')">
          <a-menu-item key="genreEDM">{{ t('message.genreEDM') }}</a-menu-item>
          <a-menu-item key="genreTechno">{{ t('message.genreTechno') }}</a-menu-item>
          <a-menu-item key="genreTrance">{{ t('message.genreTrance') }}</a-menu-item>
          <a-menu-item key="genreHouse">{{ t('message.genreHouse') }}</a-menu-item>
          <a-menu-item key="genreDubstep">{{ t('message.genreDubstep') }}</a-menu-item>
          <a-menu-item key="genreDrumAndBass">{{ t('message.genreDrumAndBass') }}</a-menu-item>
          <a-menu-item key="genreAmbient">{{ t('message.genreAmbient') }}</a-menu-item>
        </a-sub-menu>

        
        <a-sub-menu key="rockAlt" :title="t('message.rockAndAlternative')">
          <a-menu-item key="genreAlternative">{{ t('message.genreAlternative') }}</a-menu-item>
          <a-menu-item key="genreIndie">{{ t('message.genreIndie') }}</a-menu-item>
          <a-menu-item key="genrePunk">{{ t('message.genrePunk') }}</a-menu-item>
          <a-menu-item key="genreHardRock">{{ t('message.genreHardRock') }}</a-menu-item>
          <a-menu-item key="genreHeavyMetal">{{ t('message.genreHeavyMetal') }}</a-menu-item>
          <a-menu-item key="genreGrunge">{{ t('message.genreGrunge') }}</a-menu-item>
        </a-sub-menu>

       
        <a-sub-menu key="urbanHipHop" :title="t('message.urbanAndHipHop')">
          <a-menu-item key="genreRap">{{ t('message.genreRap') }}</a-menu-item>
          <a-menu-item key="genreTrap">{{ t('message.genreTrap') }}</a-menu-item>
          <a-menu-item key="genreSoul">{{ t('message.genreSoul') }}</a-menu-item>
          <a-menu-item key="genreFunk">{{ t('message.genreFunk') }}</a-menu-item>
          <a-menu-item key="genreReggae">{{ t('message.genreReggae') }}</a-menu-item>
          <a-menu-item key="genreDisco">{{ t('message.genreDisco') }}</a-menu-item>
        </a-sub-menu>

        
        <a-sub-menu key="classical" :title="t('message.classicalAndTraditional')">
          <a-menu-item key="genreSymphonic">{{ t('message.genreSymphonic') }}</a-menu-item>
          <a-menu-item key="genreOrchestral">{{ t('message.genreOrchestral') }}</a-menu-item>
          <a-menu-item key="genreOpera">{{ t('message.genreOpera') }}</a-menu-item>
          <a-menu-item key="genreBaroque">{{ t('message.genreBaroque') }}</a-menu-item>
          <a-menu-item key="genreBigBand">{{ t('message.genreBigBand') }}</a-menu-item>
          <a-menu-item key="genreJazz_Fusion">{{ t('message.genreJazz_Fusion') }}</a-menu-item>
        </a-sub-menu>

        
        <a-sub-menu key="other" :title="t('message.otherStyles')">
          <a-menu-item key="genreFolk">{{ t('message.genreFolk') }}</a-menu-item>
          <a-menu-item key="genreGospel">{{ t('message.genreGospel') }}</a-menu-item>
          <a-menu-item key="genreDance">{{ t('message.genreDance') }}</a-menu-item>
          <a-menu-item key="genreAcoustic">{{ t('message.genreAcoustic') }}</a-menu-item>
          <a-menu-item key="genreWorldMusic">{{ t('message.genreWorldMusic') }}</a-menu-item>
          <a-menu-item key="genreExperimental">{{ t('message.genreExperimental') }}</a-menu-item>
          <a-menu-item key="genreChillout">{{ t('message.genreChillout') }}</a-menu-item>
          <a-menu-item key="genreLofi">{{ t('message.genreLofi') }}</a-menu-item>
          <a-menu-item key="genreNewAge">{{ t('message.genreNewAge') }}</a-menu-item>
          <a-menu-item key="genreBluegrass">{{ t('message.genreBluegrass') }}</a-menu-item>
          <a-menu-item key="genreAcappella">{{ t('message.genreAcappella') }}</a-menu-item>
        </a-sub-menu>

       
        <a-sub-menu key="custom" :title="t('message.customCategory')">
          <a-menu-item key="addCustom">
            <div @click.stop="showAddCustomCategoryModal">
              <PlusOutlined /> {{ t('message.addCustomCategory') }}
            </div>
          </a-menu-item>
         
          <a-menu-item 
            v-for="category in musicStore.customCategories" 
            :key="`custom_${category}`"
            class="custom-category-item"
          >
            <div class="custom-category-wrapper">
              <span>{{ category }}</span>
              <div class="icon-group">
                <EditOutlined 
                  class="edit-icon" 
                  @click.stop="handleEditCustomCategory(category)" 
                />
                <DeleteOutlined 
                  class="delete-icon" 
                  @click.stop="handleDeleteCustomCategory(category)" 
                />
              </div>
            </div>
          </a-menu-item>
        </a-sub-menu>

        
        <a-sub-menu key="tags" :title="t('message.tagsFilter')">
          <a-menu-item key="addTag">
            <div @click.stop="showAddCustomTagModal">
              <PlusOutlined /> {{ t('message.addCustomTag') }}
            </div>
          </a-menu-item>
         
          <a-menu-item 
            v-for="tag in musicStore.customTags" 
            :key="`tag_${tag}`"
            class="custom-tag-item"
          >
            <div class="custom-category-wrapper">
              <span>{{ tag }}</span>
              <div class="icon-group">
                <EditOutlined 
                  class="edit-icon" 
                  @click.stop="handleEditCustomTag(tag)" 
                />
                <DeleteOutlined 
                  class="delete-icon" 
                  @click.stop="handleDeleteCustomTag(tag)" 
                />
              </div>
            </div>
          </a-menu-item>
        </a-sub-menu>
      </a-menu>
    </a-layout-sider>

    <!-- Main Content Area -->
    <a-layout-content :style="{ padding: '0 24px', minHeight: '280px' }">
      <div :style="{ background: '#fff', padding: '24px', margin: 0 }">
        <div class="category-header text-left">
          <h2 class="category-title">{{ selectedCategoryLabel }}</h2>
        </div>

        
        <a-row :gutter="[16, 16]">
          <a-col :xs="24" :sm="12" :md="8" :lg="6">
            <div class="music-card-wrapper upload-wrapper" @click="showUploadModal">
              <div class="upload-card">
                <div class="upload-content">
                  <div class="upload-icon">
                    <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                      <polyline points="17 8 12 3 7 8"></polyline>
                      <line x1="12" y1="3" x2="12" y2="15"></line>
                    </svg>
                  </div>
                  <div class="upload-text">
                    <h3>{{ t('message.uploadMusic') }}</h3>
                    <p>{{ t('message.clickToUpload') }}</p>
                  </div>
                </div>
              </div>
            </div>
          </a-col>

          
          <a-col :xs="24" :sm="12" :md="8" :lg="6" v-for="item in musicList" :key="item.id">
            <div class="music-card-wrapper" @click="showMusicDetails(item)">
              <music-card
                :id="item.id"
                :name="item.name"
                :coverUrl="item.coverUrl"
                :url="item.url"
                :artist="item.artist || t('message.unknownArtist')"
                :category="item.category"
                @download.stop="handleDownload(item)"
                @edit.stop="handleEdit(item)"
                @delete.stop="handleDelete(item.id)"
                @play.stop="handlePlay(item)"
              />
            </div>
          </a-col>
        </a-row>
        <a-pagination
          v-model:current="pagination.current"
          :total="pagination.total"
          :pageSize="pagination.pageSize"
          :pageSizeOptions="['12', '24', '36', '48']"
          showSizeChanger
          @change="(page, pageSize) => handlePaginationChange(page, pageSize)"
          style="text-align: center; margin-top: 24px"
        />
      </div>
    </a-layout-content>

    
    <player-bar />

    
    <a-modal 
      v-model:visible="uploadModalVisible" 
      :title="t('message.uploadMusic')" 
      @cancel="handleCancel"
      :footer="null"
    >
      <div class="modal-content">
        <music-file-upload @upload-success="handleUploadSuccess"></music-file-upload>
      </div>
      <div class="modal-custom-footer">
        <InteractiveHoverButton 
          :text="t('message.cancel')" 
          @click="handleCancel"
          class="cancel-button"
        />
      </div>
    </a-modal>

    
    <a-modal
      v-model:visible="customCategoryModalVisible"
      :title="t('message.addCustomCategory')"
      @ok="handleAddCustomCategory"
      @cancel="handleCustomCategoryCancel"
    >
      <a-form layout="vertical">
        <a-form-item :label="t('message.categoryName')">
          <a-input v-model:value="newCustomCategory" />
        </a-form-item>
      </a-form>
    </a-modal>

    
    <a-modal
      v-model:visible="customTagModalVisible"
      :title="t('message.addCustomTag')"
      @ok="handleAddCustomTag"
      @cancel="handleCustomTagCancel"
    >
      <a-form layout="vertical">
        <a-form-item :label="t('message.tagName')">
          <a-input v-model:value="newCustomTag" />
        </a-form-item>
      </a-form>
    </a-modal>

    <!-- 添加编辑类别的模态框 -->
    <a-modal
      v-model:visible="editCategoryModalVisible"
      :title="t('message.editCustomCategory')"
      @ok="handleUpdateCustomCategory"
      @cancel="handleEditCategoryCancel"
    >
      <a-form layout="vertical">
        <a-form-item :label="t('message.newCategoryName')">
          <a-input v-model:value="editedCategoryName" />
        </a-form-item>
      </a-form>
    </a-modal>

    <!-- 添加编辑标签的模态框 -->
    <a-modal
      v-model:visible="editTagModalVisible"
      :title="t('message.editCustomTag')"
      @ok="handleUpdateCustomTag"
      @cancel="handleEditTagCancel"
    >
      <a-form layout="vertical">
        <a-form-item :label="t('message.newTagName')">
          <a-input v-model:value="editedTagName" />
        </a-form-item>
      </a-form>
    </a-modal>
  </a-layout>
</template>

<script setup lang="ts">
import { ref, onMounted, reactive, computed, provide } from 'vue'
import type { MenuInfo } from 'ant-design-vue/es/menu/src/interface'
import {
  Layout as ALayout,
  LayoutSider as ALayoutSider,
  LayoutContent as ALayoutContent,
  Menu as AMenu,
  MenuItem as AMenuItem,
  SubMenu as ASubMenu,
  List as AList,
  ListItem as AListItem,
  Card as ACard,
  Breadcrumb as ABreadcrumb,
  BreadcrumbItem as ABreadcrumbItem,
  Popconfirm as APopconfirm,
  Tooltip as ATooltip,
  message,
  Row as ARow,
  Col as ACol,
  Pagination as APagination,
  Modal as AModal,
  Button as AButton,
  Form as AForm,
  FormItem as AFormItem,
  Input as AInput,
} from 'ant-design-vue'
import {
  DownloadOutlined,
  EditOutlined,
  DeleteOutlined,
  PlayCircleOutlined,
  UploadOutlined,
  PlusOutlined,
} from '@ant-design/icons-vue'
import {
  listMusicFileByPageUsingPost,
  listMusicFileVoByCategoryPageUsingGet,
  getMusicFileVoByIdUsingGet,
  getMusicFileByIdUsingGet,
} from '@/api/musicFileController'
import MusicCard from '@/components/MusicCard.vue'
import PlayerBar from '@/components/PlayerBar.vue'
import RadiantText from '@/components/ui/radiant-text/RadiantText.vue'
import { useRouter } from 'vue-router'
import { useMusicStore } from '@/stores/musicStore'
import { useI18n } from 'vue-i18n'
import MusicFileUpload from '@/components/MusicFileUpload.vue'
import FileUpload from '@/components/ui/file-upload/FileUpload.vue'
import InteractiveHoverButton from '@/components/ui/interactive-hover-button/InteractiveHoverButton.vue'
import { Motion } from 'motion-v'
import { Icon } from '@iconify/vue'

// i18n
const { t } = useI18n()

const musicList = ref<API.MusicFileVO[]>([])
const loading = ref(false)
const selectedCategoryKeys = ref<string[]>(['uploaded'])
const selectedCategoryLabel = ref<string>(t('message.uploaded'))

const pagination = reactive({
  current: 1,
  pageSize: 12,
  total: 0,
})

const paginationProps = computed(() => ({
  current: pagination.current,
  pageSize: pagination.pageSize,
  total: pagination.total || 0,
  onChange: (page: number, pageSize: number) => {
    pagination.current = page
    pagination.pageSize = pageSize
    fetchMusicData()
  },
  showSizeChanger: true,
  pageSizeOptions: ['12', '24', '36', '48'],
}))

const router = useRouter()
const musicStore = useMusicStore()


const customCategoryModalVisible = ref(false)
const newCustomCategory = ref('')


const customTagModalVisible = ref(false)
const newCustomTag = ref('')

// 编辑类别相关变量和方法
const editCategoryModalVisible = ref(false)
const editedCategoryName = ref('')
const currentEditingCategory = ref('')

const handleEditCustomCategory = (category) => {
  currentEditingCategory.value = category
  editedCategoryName.value = category
  editCategoryModalVisible.value = true
}

const handleUpdateCustomCategory = () => {
  if (editedCategoryName.value.trim()) {
    const success = musicStore.updateCustomCategory(
      currentEditingCategory.value, 
      editedCategoryName.value.trim()
    )
    
    if (success) {
      // 如果当前选中的是被编辑的类别，更新选中的类别
      if (selectedCategoryKeys.value[0] === `custom_${currentEditingCategory.value}`) {
        selectedCategoryKeys.value = [`custom_${editedCategoryName.value.trim()}`]
        selectedCategoryLabel.value = editedCategoryName.value.trim()
        fetchMusicData()
      }
      message.success(t('message.categoryUpdatedSuccess'))
    } else {
      message.error(t('message.categoryNameAlreadyExists'))
    }
  } else {
    message.error(t('message.categoryNameRequired'))
  }
  editCategoryModalVisible.value = false
}

const handleEditCategoryCancel = () => {
  editCategoryModalVisible.value = false
  currentEditingCategory.value = ''
  editedCategoryName.value = ''
}

// 编辑标签相关变量和方法
const editTagModalVisible = ref(false)
const editedTagName = ref('')
const currentEditingTag = ref('')

const handleEditCustomTag = (tag) => {
  currentEditingTag.value = tag
  editedTagName.value = tag
  editTagModalVisible.value = true
}

const handleUpdateCustomTag = () => {
  if (editedTagName.value.trim()) {
    const success = musicStore.updateCustomTag(
      currentEditingTag.value, 
      editedTagName.value.trim()
    )
    
    if (success) {
      // 如果当前选中的是被编辑的标签，更新选中的标签
      if (selectedCategoryKeys.value[0] === `tag_${currentEditingTag.value}`) {
        selectedCategoryKeys.value = [`tag_${editedTagName.value.trim()}`]
        selectedCategoryLabel.value = t('message.taggedAs') + ': ' + editedTagName.value.trim()
        fetchMusicData()
      }
      message.success(t('message.tagUpdatedSuccess'))
    } else {
      message.error(t('message.tagNameAlreadyExists'))
    }
  } else {
    message.error(t('message.tagNameRequired'))
  }
  editTagModalVisible.value = false
}

const handleEditTagCancel = () => {
  editTagModalVisible.value = false
  currentEditingTag.value = ''
  editedTagName.value = ''
}

const fetchMusicData = async () => {
  loading.value = true
  const currentCategory = selectedCategoryKeys.value[0]
  let response = null

  try {
    if (currentCategory === 'uploaded') {
      const queryParams: API.MusicFileQueryRequest = {
        current: pagination.current,
        pageSize: pagination.pageSize,
        category: undefined,
        reviewStatus: 1
      }
      response = await listMusicFileByPageUsingPost(queryParams)
    } else if (currentCategory.startsWith('custom_')) {
      
      const categoryName = currentCategory.replace('custom_', '')
      const params: API.listMusicFileVOByCategoryPageUsingGETParams = {
        category: categoryName,
        current: pagination.current,
        pageSize: pagination.pageSize,
      }
      response = await listMusicFileVoByCategoryPageUsingGet(params)
    } else if (currentCategory.startsWith('tag_')) {
      
      const tagName = currentCategory.replace('tag_', '')
      console.log('========== 标签筛选开始 ==========')
      console.log('当前选中的标签:', tagName)
      
      
      const queryParams = {
        current: pagination.current,
        pageSize: pagination.pageSize,
        

      }
      console.log('发送请求参数:', queryParams)
      
      try {
       
        const response = await listMusicFileByPageUsingPost(queryParams)
        console.log('API响应状态:', response?.data?.code)
        

        if (response && response.data.code === 0 && response.data.data) {
          const allMusic = response.data.data.records || []
          console.log(`获取到 ${allMusic.length} 条音乐记录`)
          
          if (allMusic.length > 0) {
            console.log('第一条音乐记录示例:', allMusic[0])
            console.log('第一条音乐的tags属性:', allMusic[0].tags, '类型:', typeof allMusic[0].tags)
          }
          
      
          const filteredMusic = []
          
          for (let i = 0; i < allMusic.length; i++) {
            const music = allMusic[i]
            console.log(`\n检查音乐[${i}]: "${music.name || '未命名'}"`)
            
          
            if (!music || !music.tags) {
              console.log(`  - 跳过: 没有tags属性`)
              continue
            }
            
            console.log(`  - tags原始值: ${music.tags}`)
            
            
            try {
              
              const tagsArray = JSON.parse(music.tags)
              console.log(`  - 解析后的标签数组:`, tagsArray)
              
              
              let found = false
              for (let j = 0; j < tagsArray.length; j++) {
                const tag = tagsArray[j]
                console.log(`    - 比较: "${tag.toLowerCase()}" vs "${tagName.toLowerCase()}"`)
                
                if (tag.toLowerCase() === tagName.toLowerCase()) {
                  found = true
                  console.log(`    - 匹配成功!`)
                  break
                }
              }
              
              if (found) {
                console.log(`  - 结果: 添加到筛选结果`)
                filteredMusic.push(music)
              } else {
                console.log(`  - 结果: 不包含目标标签`)
              }
            } catch (error) {
              console.error(`  - 解析出错:`, error)
              
              
              console.log(`  - 尝试替代解析方法`)
              const tagsString = String(music.tags)
                .replace(/^\[|\]$/g, '') // 移除开头和结尾的方括号
                .replace(/\\"/g, '"') // 处理转义的引号
                .replace(/"/g, '') // 移除所有引号
              
              const tagsArray = tagsString.split(',').map(tag => tag.trim())
              console.log(`  - 替代方法解析结果:`, tagsArray)
              
              // 查找是否有匹配的标签
              const found = tagsArray.some(tag => tag.toLowerCase() === tagName.toLowerCase())
              
              if (found) {
                console.log(`  - 结果: 通过替代方法找到匹配，添加到筛选结果`)
                filteredMusic.push(music)
              } else {
                console.log(`  - 结果: 替代方法也未找到匹配`)
              }
            }
          }
          
          console.log(`\n找到 ${filteredMusic.length} 条包含标签 "${tagName}" 的音乐`)
          
          
          musicList.value = filteredMusic
          pagination.total = filteredMusic.length
          console.log('========== 标签筛选完成 ==========')
        } else {
          console.error('API响应错误:', response?.data)
          message.error(t('message.failedToLoadMusic') + ': ' + (response?.data?.message || t('message.unknownError')))
          musicList.value = []
          pagination.total = 0
        }
      } catch (error) {
        console.error('发送请求时出错:', error)
        message.error(t('message.errorFetchingMusicData') + ': ' + error.message)
        musicList.value = []
        pagination.total = 0
      } finally {
        loading.value = false
      }
      
      return
    } else if (currentCategory && !['popular', 'international', 'electronic', 'rockAlt', 'urbanHipHop', 'classical', 'other', 'custom', 'addCustom', 'tags', 'addTag'].includes(currentCategory)) {
      
      let category = currentCategory
      if (category.startsWith('genre')) {
        category = category.replace('genre', '')
      }
      
      const params: API.listMusicFileVOByCategoryPageUsingGETParams = {
        category: category,
        current: pagination.current,
        pageSize: pagination.pageSize,
      }
      response = await listMusicFileVoByCategoryPageUsingGet(params)
    } else {
      
      console.log('No data fetch for category:', currentCategory)
      musicList.value = []
      pagination.total = 0
      loading.value = false
      return
    }

    
    if (response && response.data.code === 0 && response.data.data) {
      musicList.value = response.data.data.records || []
      pagination.total = parseInt(String(response.data.data.total ?? '0'), 10)
    } else {
      message.error(t('message.failedToLoadMusic') + ': ' + (response?.data.message || t('message.unknownError')))
      musicList.value = []
      pagination.total = 0
    }
  } catch (error: any) {
    message.error(t('message.errorFetchingMusicData') + ': ' + error.message)
    musicList.value = []
    pagination.total = 0
  } finally {
    loading.value = false
  }
}

const categoryLabels = computed(() => ({
  uploaded: t('message.uploaded'),
  popular: t('message.popularCategory'),
  international: t('message.internationalPop'),
  electronic: t('message.electronicMusic'),
  rockAlt: t('message.rockAndAlternative'),
  urbanHipHop: t('message.urbanAndHipHop'),
  classical: t('message.classicalAndTraditional'),
  other: t('message.otherStyles'),
  custom: t('message.customCategory'),
  addCustom: t('message.addCustomCategory'),
  tags: t('message.tagsFilter'),
  addTag: t('message.addCustomTag'),
  
  
  genrePop: t('message.genrePop'),
  genreRock: t('message.genreRock'),
  genreClassical: t('message.genreClassical'),
  genreJazz: t('message.genreJazz'),
  genreHipHop: t('message.genreHipHop'),
  genreRnB: t('message.genreRnB'),
  genreCountry: t('message.genreCountry'),
  genreElectronic: t('message.genreElectronic'),
  genreDance: t('message.genreDance'),
  genreMetal: t('message.genreMetal'),
  genreFolk: t('message.genreFolk'),
  genreBlues: t('message.genreBlues'),
  genreReggae: t('message.genreReggae'),
  genreSoul: t('message.genreSoul'),
  genreFunk: t('message.genreFunk'),
  genreIndie: t('message.genreIndie'),
  genrePunk: t('message.genrePunk'),
  genreAlternative: t('message.genreAlternative'),
  genreEDM: t('message.genreEDM'),
  genreAmbient: t('message.genreAmbient'),
  genreLatin: t('message.genreLatin'),
  genreKpop: t('message.genreKpop'),
  genreJpop: t('message.genreJpop'),
  genreCpop: t('message.genreCpop'),
  genreOpera: t('message.genreOpera'),
  genreDisco: t('message.genreDisco'),
  genreGospel: t('message.genreGospel'),
  genreRap: t('message.genreRap'),
  genreTrap: t('message.genreTrap'),
  genreTechno: t('message.genreTechno'),
  genreJazz_Fusion: t('message.genreJazz_Fusion'),
  genreHardRock: t('message.genreHardRock'),
  genreHeavyMetal: t('message.genreHeavyMetal'),
  genreDrumAndBass: t('message.genreDrumAndBass'),
  genreHouse: t('message.genreHouse'),
  genreTrance: t('message.genreTrance'),
  genreDubstep: t('message.genreDubstep'),
  genreAcoustic: t('message.genreAcoustic'),
  genreExperimental: t('message.genreExperimental'),
  genreWorldMusic: t('message.genreWorldMusic'),
  genreSymphonic: t('message.genreSymphonic'),
  genreChillout: t('message.genreChillout'),
  genreLofi: t('message.genreLofi'),
  genreBigBand: t('message.genreBigBand'),
  genreOrchestral: t('message.genreOrchestral'),
  genreNewAge: t('message.genreNewAge'),
  genreGrunge: t('message.genreGrunge'),
  genreBluegrass: t('message.genreBluegrass'),
  genreBaroque: t('message.genreBaroque'),
  genreAcappella: t('message.genreAcappella'),
}))

const handleCategoryClick = (info: MenuInfo) => {
  const key = info.key as string
  
  
  if (['popular', 'international', 'electronic', 'rockAlt', 'urbanHipHop', 'classical', 'other', 'custom', 'addCustom', 'tags', 'addTag'].includes(key)) {
    return
  }

  selectedCategoryKeys.value = [key]
  
  
  if (key.startsWith('custom_')) {
    const categoryName = key.replace('custom_', '')
    selectedCategoryLabel.value = categoryName
  } else if (key.startsWith('tag_')) {
    const tagName = key.replace('tag_', '')
    selectedCategoryLabel.value = t('message.taggedAs') + ': ' + tagName
  } else {
    selectedCategoryLabel.value = categoryLabels.value[key] || t('message.unknownCategory')
  }
  
  pagination.current = 1
  fetchMusicData()
}

const currentPlayingId = ref<number | null>(null)
provide('currentPlayingId', currentPlayingId)
const handlePlay = (id: number) => {
  currentPlayingId.value = id
}

const handlePaginationChange = (page: number, pageSize: number) => {
  pagination.current = page
  pagination.pageSize = pageSize
  fetchMusicData()
}

const showMusicDetails = (item) => {
  if (item && item.id) {
    console.log(t('message.navigatingToDetail') + ':', item.id)

    
    musicStore.setCurrentMusic(item)

    
    router.push(`/music/detail/${item.id}`)
  } else {
    message.error(t('message.invalidMusicId'))
  }
}


const uploadModalVisible = ref(false)
const handleCancel = () => {
  uploadModalVisible.value = false
}
const handleUploadSuccess = () => {
  message.success(t('message.uploadSuccess'))
  uploadModalVisible.value = false
  
  fetchMusicData()
}


const showUploadModal = () => {
  uploadModalVisible.value = true
}


const showAddCustomCategoryModal = (e) => {
  e.stopPropagation()
  customCategoryModalVisible.value = true
  newCustomCategory.value = ''
}


const handleAddCustomCategory = () => {
  if (newCustomCategory.value.trim()) {
    musicStore.addCustomCategory(newCustomCategory.value.trim())
    customCategoryModalVisible.value = false
    newCustomCategory.value = ''
    message.success(t('message.categoryAddedSuccess'))
  } else {
    message.error(t('message.categoryNameRequired'))
  }
}

const handleCustomCategoryCancel = () => {
  customCategoryModalVisible.value = false
  newCustomCategory.value = ''
}


const handleDeleteCustomCategory = (category) => {
  musicStore.removeCustomCategory(category)
  
  if (selectedCategoryKeys.value[0] === `custom_${category}`) {
    selectedCategoryKeys.value = ['uploaded']
    selectedCategoryLabel.value = categoryLabels.value.uploaded || t('message.uploaded')
    fetchMusicData()
  }
  message.success(t('message.categoryDeletedSuccess'))
}


const showAddCustomTagModal = (e) => {
  e.stopPropagation()
  customTagModalVisible.value = true
  newCustomTag.value = ''
}


const handleAddCustomTag = () => {
  if (newCustomTag.value.trim()) {
    musicStore.addCustomTag(newCustomTag.value.trim())
    customTagModalVisible.value = false
    newCustomTag.value = ''
    message.success(t('message.tagAddedSuccess'))
  } else {
    message.error(t('message.tagNameRequired'))
  }
}


const handleCustomTagCancel = () => {
  customTagModalVisible.value = false
  newCustomTag.value = ''
}


const handleDeleteCustomTag = (tag) => {
  musicStore.removeCustomTag(tag)
  // 如果当前选中的是要删除的标签，则重置为上传类别
  if (selectedCategoryKeys.value[0] === `tag_${tag}`) {
    selectedCategoryKeys.value = ['uploaded']
    selectedCategoryLabel.value = categoryLabels.value.uploaded || t('message.uploaded')
    fetchMusicData()
  }
  message.success(t('message.tagDeletedSuccess'))
}

onMounted(() => {
  
  musicStore.initCustomCategories()
  musicStore.initCustomTags()
  
  selectedCategoryKeys.value = ['uploaded']
  selectedCategoryLabel.value = categoryLabels.value.uploaded || t('message.uploaded')
  fetchMusicData()
})
</script>

<style scoped>
.music-page-layout {
  min-height: calc(100vh - 64px);
  padding-bottom: 70px;
}

.music-grid {
  margin-top: 16px;
}

.music-card {
  position: relative;
  overflow: hidden;
  border-radius: 8px;
}

.music-cover-wrapper {
  position: relative;
  width: 100%;
  padding-top: 100%;
  overflow: hidden;
  background-color: #f0f0f0;
}

.music-cover {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.3s ease;
}

.music-cover-placeholder {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #e9e9e9;
  color: #999;
  font-size: 2.5em;
  font-weight: bold;
}

.music-card:hover .music-cover {
  transform: scale(1.1);
}

.music-info-overlay {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  background: rgba(0, 0, 0, 0.6);
  color: white;
  padding: 8px 12px;
  opacity: 0;
  transition: opacity 0.3s ease;
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  height: 100%;
  box-sizing: border-box;
}

.music-card:hover .music-info-overlay {
  opacity: 1;
}

.music-title {
  font-size: 1em;
  font-weight: bold;
  margin-bottom: 2px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.music-artist {
  font-size: 0.85em;
  margin-bottom: 8px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.action-buttons {
  display: flex;
  justify-content: space-around;
  align-items: center;
  margin-top: auto;
}

.action-icon {
  font-size: 1.3em;
  color: rgba(255, 255, 255, 0.8);
  cursor: pointer;
  transition: color 0.2s ease;
}

.action-icon:hover {
  color: white;
}

.action-icon-delete:hover {
  color: #ff4d4f;
}
.action-icon-play:hover {
  color: #1890ff;
}

:deep(.ant-card-cover) {
  padding: 0;
  margin: 0;
}
:deep(.ant-card-body) {
  padding: 0;
  min-height: 0;
}

:deep(.ant-list-item) {
}

:deep(.ant-pagination) {
  text-align: center;
  margin-top: 24px;
}

:deep(.ant-layout-sider) {
  border-right: 1px solid #f0f0f0;
}

:deep(.ant-breadcrumb) {
  display: none !important;
}


.music-card-wrapper {
  cursor: pointer;
  transition: transform 0.2s;
}

.music-card-wrapper:hover {
  transform: translateY(-5px);
}


.sidebar-text {
  display: inline-block;
  font-weight: 500;
}

.customized-text {
  font-weight: 700 !important;
  background-color: transparent !important;
  border: none !important;
  box-shadow: none !important;
  padding: 0 !important;
  border-radius: 0 !important;
  max-width: none !important;
}

.customized-text :deep(p) {
  color: inherit !important;
  margin: 0 !important;
  padding: 0 !important;
}

.ultra-bold-text {
  font-weight: 900 !important; 
  font-size: 1.2em !important; 
}


.category-header {
  margin: 16px 0 24px 0;
  text-align: left;
  padding-left: 0;
}

.category-title {
  font-size: 1.5em;
  font-weight: normal;
  margin: 16px 0 24px 0;
}

.text-left :deep(p) {
  text-align: left !important;
  margin-left: 0 !important;
}


:deep(.ant-menu) {
  max-height: calc(100vh - 64px);
  overflow-y: auto;
}


:deep(.ant-menu)::-webkit-scrollbar {
  width: 6px;
}

:deep(.ant-menu)::-webkit-scrollbar-thumb {
  background-color: #d9d9d9;
  border-radius: 3px;
}

:deep(.ant-menu)::-webkit-scrollbar-track {
  background-color: #f0f0f0;
}


.upload-wrapper {
  cursor: pointer;
}

.upload-card {
  height: 100%;
  background-color: #f8f8f8;
  border-radius: 8px;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 20px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
  transition: all 0.3s ease;
  min-height: 320px;
}

.upload-card:hover {
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  background-color: #f0f0f0;
}

.upload-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
}

.upload-icon {
  margin-bottom: 16px;
  color: #1890ff;
}

.upload-text h3 {
  margin: 0 0 8px 0;
  font-size: 18px;
  color: #333;
}

.upload-text p {
  margin: 0;
  color: #666;
  font-size: 14px;
}


.music-card-wrapper {
  height: 100%;
  display: flex;
  flex-direction: column;
}

.upload-modal-content {
  padding: 16px 0;
}

.upload-section {
  margin-bottom: 24px;
}

.upload-section h4 {
  margin-bottom: 12px;
  font-weight: 500;
}

.select-file-button {
  margin-bottom: 8px;
}

.selected-file-info {
  margin-top: 8px;
  padding: 8px;
  background-color: #f5f5f5;
  border-radius: 4px;
}

.cover-upload {
  width: 100%;
  height: 120px;
}

.cover-upload-placeholder {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100%;
  border: 1px dashed #d9d9d9;
  border-radius: 4px;
  background-color: #fafafa;
  padding: 16px;
  text-align: center;
}

.cover-upload-placeholder:hover {
  border-color: #1890ff;
}

.upload-icon {
  font-size: 28px;
  color: #999;
  margin-bottom: 8px;
}

.upload-buttons {
  margin-top: 24px;
  display: flex;
  justify-content: center;
}


.disabled-button {
  pointer-events: none;
}


.modal-content {
  margin-bottom: 24px;
}

.modal-custom-footer {
  display: flex;
  justify-content: flex-end;
  padding-top: 12px;
  border-top: 1px solid #f0f0f0;
}

.cancel-button {
  border-color: #d9d9d9;
  background-color: white;
}


.custom-category-wrapper {
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
}

.icon-group {
  display: flex;
  gap: 8px;
}

.edit-icon, .delete-icon {
  opacity: 0.5;
  transition: all 0.3s;
}

.edit-icon:hover {
  opacity: 1;
  color: #1890ff;
}

.delete-icon:hover {
  opacity: 1;
  color: #ff4d4f;
}

.custom-category-item:hover .edit-icon,
.custom-category-item:hover .delete-icon,
.custom-tag-item:hover .edit-icon,
.custom-tag-item:hover .delete-icon {
  opacity: 0.8;
}


.custom-tag-item {
  
}


.custom-tag-item .custom-category-wrapper {
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
}

.custom-tag-item .delete-icon {
  opacity: 0.5;
  transition: all 0.3s;
}

.custom-tag-item .delete-icon:hover {
  opacity: 1;
  color: #ff4d4f;
}

.custom-tag-item:hover .delete-icon {
  opacity: 0.8;
}
</style>
