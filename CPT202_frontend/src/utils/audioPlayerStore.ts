import { ref, reactive } from 'vue'

// 当前播放的音乐信息
export const currentMusic = reactive({
  id: null as number | null,
  name: '',
  artist: '',
  coverUrl: '',
  url: '',
})

// 播放状态
export const isPlaying = ref(false)
export const currentTime = ref(0)
export const duration = ref(0)
export const volume = ref(0.7)

// Audio元素实例
const audioElement = new Audio()
audioElement.volume = volume.value

// 设置事件监听
audioElement.addEventListener('timeupdate', () => {
  currentTime.value = audioElement.currentTime
})

audioElement.addEventListener('loadedmetadata', () => {
  duration.value = audioElement.duration
})

audioElement.addEventListener('ended', () => {
  isPlaying.value = false
  currentTime.value = 0
})

// 播放音乐
export function playMusic(musicData: any) {
  if (!musicData || !musicData.url) {
    console.error('无效的音乐数据或URL')
    return false
  }

  // 更新当前音乐信息
  currentMusic.id = musicData.id
  currentMusic.name = musicData.name || '未知歌曲'
  currentMusic.artist = musicData.artist || '未知艺术家'
  currentMusic.coverUrl = musicData.coverUrl || ''
  currentMusic.url = musicData.url

  // 设置音频源并播放
  audioElement.src = musicData.url
  audioElement
    .play()
    .then(() => {
      isPlaying.value = true
      console.log('开始播放:', musicData.name)
    })
    .catch((err) => {
      console.error('播放失败:', err)
      return false
    })

  return true
}

// 播放/暂停切换
export function togglePlay() {
  if (audioElement.paused) {
    audioElement
      .play()
      .then(() => {
        isPlaying.value = true
      })
      .catch((err) => {
        console.error('播放失败:', err)
      })
  } else {
    audioElement.pause()
    isPlaying.value = false
  }
}

// 跳转到指定时间
export function seekTo(time: number) {
  if (time >= 0 && time <= audioElement.duration) {
    audioElement.currentTime = time
    currentTime.value = time
  }
}

// 设置音量
export function setVolume(vol: number) {
  if (vol >= 0 && vol <= 1) {
    audioElement.volume = vol
    volume.value = vol
  }
}

// 格式化时间 (秒 -> MM:SS)
export function formatTime(seconds: number) {
  if (!isFinite(seconds) || seconds < 0) return '00:00'
  const mins = Math.floor(seconds / 60)
  const secs = Math.floor(seconds % 60)
  return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
}
