<template>
  <div id="aplayer"></div>
</template>

<script setup lang="ts">
import 'aplayer/dist/APlayer.min.css'
import APlayer from 'aplayer'
import Hls from 'hls.js'
import { onMounted, ref, onUnmounted } from 'vue'
import bus from '@/utils/eventBus'

// APlayer实例
const aplayer = ref<any>(null)
// 当前音乐列表
const musicList = ref<any[]>([])

// 初始化APlayer
const initAPlayer = () => {
  aplayer.value = new APlayer({
    container: document.getElementById('aplayer'),
    audio: [],
    mini: false,
    autoplay: false,
    theme: '#4e89ff',
    loop: 'all',
    order: 'list',
    preload: 'auto',
    volume: 0.7,
    mutex: true,
    listFolded: false,
    listMaxHeight: 90,
    lrcType: 0,
    fixed: true,
  })
}

// 添加音频
const addMyAudio = (musicData: any) => {
  // 首先检查是否已存在该音乐
  const existIndex = musicList.value.findIndex((item) => item.url === musicData.url)
  if (existIndex !== -1) {
    // 如果已存在，直接切换到该曲目
    aplayer.value.list.switch(existIndex)
    aplayer.value.play()
    return
  }

  // 构建音乐对象
  const tempMusic = {
    name: musicData.name,
    artist: musicData.singerName || '未知艺术家',
    url: musicData.url,
    cover: musicData.pic || 'https://via.placeholder.com/300',
    lrc: musicData.lyric || '',
    theme: '#4e89ff',
  }

  // 添加到播放器和列表
  musicList.value.push(tempMusic)
  aplayer.value.list.add(tempMusic)

  // 切换到新添加的曲目
  aplayer.value.list.switch(musicList.value.length - 1)
  aplayer.value.play()
}

// 使用Hls处理m3u8格式的音频流
const customAudioInit = (audio: HTMLAudioElement, player: any) => {
  const src = audio.src
  if (src.endsWith('.m3u8')) {
    if (Hls.isSupported()) {
      const hls = new Hls()
      hls.loadSource(src)
      hls.attachMedia(audio)
      hls.on(Hls.Events.MANIFEST_PARSED, function () {
        audio.play()
      })
      // 保存hls实例到audio元素，以便后续清理
      ;(audio as any)._hls = hls
    } else if (audio.canPlayType('application/vnd.apple.mpegurl')) {
      // 在原生支持HLS的浏览器（如Safari）中直接播放
      audio.src = src
      audio.addEventListener('loadedmetadata', function () {
        audio.play()
      })
    }
  }
}

// 监听音乐数据
const setupEventListener = () => {
  bus.on('sendSongUrl', (musicData: any) => {
    console.log('Received music data:', musicData)
    addMyAudio(musicData)
  })
}

// 组件挂载时
onMounted(() => {
  initAPlayer()
  setupEventListener()

  // 为APlayer添加自定义音频处理
  if (aplayer.value) {
    const originalHandlePlayPromise = aplayer.value.handlePlayPromise
    aplayer.value.handlePlayPromise = function (audio: HTMLAudioElement) {
      // 先尝试使用HLS处理
      customAudioInit(audio, aplayer.value)
      // 然后调用原始处理方法
      return originalHandlePlayPromise.call(aplayer.value, audio)
    }
  }
})

// 组件卸载时清理资源
onUnmounted(() => {
  bus.off('sendSongUrl')
  if (aplayer.value) {
    // 清理所有可能的HLS实例
    aplayer.value.list.audios.forEach((audio: any) => {
      const element = aplayer.value.audio
      if (element && (element as any)._hls) {
        ;(element as any)._hls.destroy()
      }
    })
    aplayer.value.destroy()
  }
})
</script>

<style>
/* 可以在这里添加自定义样式覆盖APlayer默认样式 */
#aplayer {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  margin: 0;
  z-index: 999;
}
</style>
