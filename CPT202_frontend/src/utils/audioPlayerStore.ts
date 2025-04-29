import { ref, reactive } from 'vue'

// Currently playing music information
export const currentMusic = reactive({
  id: null as number | null,
  name: '',
  artist: '',
  coverUrl: '',
  url: '',
})

// Playback status
export const isPlaying = ref(false)
export const currentTime = ref(0)
export const duration = ref(0)
export const volume = ref(0.7)

// Audio element instance
const audioElement = new Audio()
audioElement.volume = volume.value

// Set event listeners
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

// Play music
export function playMusic(musicData: any) {
  if (!musicData || !musicData.url) {
    console.error('Invalid music data or URL')
    return false
  }

  // Update current music information
  currentMusic.id = musicData.id
  currentMusic.name = musicData.name || 'Unknown Track'
  currentMusic.artist = musicData.artist || 'Unknown Artist'
  currentMusic.coverUrl = musicData.coverUrl || ''
  currentMusic.url = musicData.url

  // Set audio source and play
  audioElement.src = musicData.url
  audioElement
    .play()
    .then(() => {
      isPlaying.value = true
      console.log('Started playing:', musicData.name)
    })
    .catch((err) => {
      console.error('Playback failed:', err)
      return false
    })

  return true
}

// Toggle play/pause
export function togglePlay() {
  if (audioElement.paused) {
    audioElement
      .play()
      .then(() => {
        isPlaying.value = true
      })
      .catch((err) => {
        console.error('Playback failed:', err)
      })
  } else {
    audioElement.pause()
    isPlaying.value = false
  }
}

// Seek to specified time
export function seekTo(time: number) {
  if (time >= 0 && time <= audioElement.duration) {
    audioElement.currentTime = time
    currentTime.value = time
  }
}

// Set volume
export function setVolume(vol: number) {
  if (vol >= 0 && vol <= 1) {
    audioElement.volume = vol
    volume.value = vol
  }
}

// Format time (seconds -> MM:SS)
export function formatTime(seconds: number) {
  if (!isFinite(seconds) || seconds < 0) return '00:00'
  const mins = Math.floor(seconds / 60)
  const secs = Math.floor(seconds % 60)
  return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
}
