<template>
  <div id="aplayer"></div>
</template>

<script setup lang="ts">
import 'aplayer/dist/APlayer.min.css'
import APlayer from 'aplayer'
import Hls from 'hls.js'
import { onMounted, ref, onUnmounted } from 'vue'
import bus from '@/utils/eventBus'

// APlayer instance
const aplayer = ref<any>(null)
// Current music playlist
const musicList = ref<any[]>([])

// Initialize APlayer
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

// Add audio
const addMyAudio = (musicData: any) => {
  // First check if this music already exists
  const existIndex = musicList.value.findIndex((item) => item.url === musicData.url)
  if (existIndex !== -1) {
    // If it exists, switch to that track
    aplayer.value.list.switch(existIndex)
    aplayer.value.play()
    return
  }

  // Build music object
  const tempMusic = {
    name: musicData.name,
    artist: musicData.singerName || 'Unknown Artist',
    url: musicData.url,
    cover: musicData.pic || 'https://via.placeholder.com/300',
    lrc: musicData.lyric || '',
    theme: '#4e89ff',
  }

  // Add to player and playlist
  musicList.value.push(tempMusic)
  aplayer.value.list.add(tempMusic)

  // Switch to newly added track
  aplayer.value.list.switch(musicList.value.length - 1)
  aplayer.value.play()
}

// Use Hls to handle m3u8 format audio streams
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
      // Save hls instance to audio element for later cleanup
      ;(audio as any)._hls = hls
    } else if (audio.canPlayType('application/vnd.apple.mpegurl')) {
      // Direct playback in browsers with native HLS support (like Safari)
      audio.src = src
      audio.addEventListener('loadedmetadata', function () {
        audio.play()
      })
    }
  }
}

// Listen for music data
const setupEventListener = () => {
  bus.on('sendSongUrl', (musicData: any) => {
    console.log('Received music data:', musicData)
    addMyAudio(musicData)
  })
}

// When component is mounted
onMounted(() => {
  initAPlayer()
  setupEventListener()

  // Add custom audio processing to APlayer
  if (aplayer.value) {
    const originalHandlePlayPromise = aplayer.value.handlePlayPromise
    aplayer.value.handlePlayPromise = function (audio: HTMLAudioElement) {
      // First try to use HLS processing
      customAudioInit(audio, aplayer.value)
      // Then call the original processing method
      return originalHandlePlayPromise.call(aplayer.value, audio)
    }
  }
})

// Clean up resources when component is unmounted
onUnmounted(() => {
  bus.off('sendSongUrl')
  if (aplayer.value) {
    // Clean up all possible HLS instances
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
/* You can add custom styles here to override APlayer default styles */
#aplayer {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  margin: 0;
  z-index: 999;
}
</style>
