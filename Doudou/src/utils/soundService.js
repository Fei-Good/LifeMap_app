// 音效服务
class SoundService {
  constructor() {
    this.audioContext = null
    this.sounds = {}
    this.init()
  }

  init() {
    // 初始化音效上下文
    try {
      // 在小程序环境中使用 uni.createInnerAudioContext
      this.createSounds()
    } catch (error) {
      console.log('音效初始化失败:', error)
    }
  }

  createSounds() {
    // 创建各种音效
    this.sounds = {
      pop: this.createAudioContext('/static/sounds/pop.mp3'),
      add: this.createAudioContext('/static/sounds/add.mp3'),
      healing: this.createAudioContext('/static/sounds/healing.mp3')
    }
  }

  createAudioContext(src) {
    try {
      const audio = uni.createInnerAudioContext()
      audio.src = src
      audio.preload = 'auto'
      return audio
    } catch (error) {
      console.log('创建音频上下文失败:', error)
      return null
    }
  }

  // 播放音效
  play(soundName) {
    try {
      if (this.sounds[soundName]) {
        this.sounds[soundName].play()
      } else {
        // 如果没有音频文件，使用Web Audio API生成简单音效
        this.generateSound(soundName)
      }
    } catch (error) {
      console.log('播放音效失败:', error)
      // 降级到震动反馈
      this.fallbackFeedback(soundName)
    }
  }

  // 生成简单音效（Web Audio API）
  generateSound(soundName) {
    try {
      if (typeof AudioContext === 'undefined' && typeof webkitAudioContext === 'undefined') {
        this.fallbackFeedback(soundName)
        return
      }

      const audioContext = new (window.AudioContext || window.webkitAudioContext)()
      const oscillator = audioContext.createOscillator()
      const gainNode = audioContext.createGain()

      oscillator.connect(gainNode)
      gainNode.connect(audioContext.destination)

      switch (soundName) {
        case 'pop':
          // 爆炸音效 - 低频到高频的快速扫频
          oscillator.frequency.setValueAtTime(100, audioContext.currentTime)
          oscillator.frequency.exponentialRampToValueAtTime(800, audioContext.currentTime + 0.1)
          gainNode.gain.setValueAtTime(0.3, audioContext.currentTime)
          gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.2)
          oscillator.type = 'sawtooth'
          break
        case 'add':
          // 添加音效 - 清脆的铃声
          oscillator.frequency.setValueAtTime(800, audioContext.currentTime)
          oscillator.frequency.setValueAtTime(1200, audioContext.currentTime + 0.05)
          gainNode.gain.setValueAtTime(0.2, audioContext.currentTime)
          gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.15)
          oscillator.type = 'sine'
          break
        case 'healing':
          // 治愈音效 - 温和的和弦
          oscillator.frequency.setValueAtTime(440, audioContext.currentTime)
          oscillator.frequency.setValueAtTime(554, audioContext.currentTime + 0.1)
          oscillator.frequency.setValueAtTime(659, audioContext.currentTime + 0.2)
          gainNode.gain.setValueAtTime(0.15, audioContext.currentTime)
          gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.4)
          oscillator.type = 'sine'
          break
        default:
          oscillator.frequency.setValueAtTime(440, audioContext.currentTime)
          gainNode.gain.setValueAtTime(0.1, audioContext.currentTime)
          gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.1)
      }

      oscillator.start(audioContext.currentTime)
      oscillator.stop(audioContext.currentTime + 0.5)
    } catch (error) {
      console.log('生成音效失败:', error)
      this.fallbackFeedback(soundName)
    }
  }

  // 降级反馈（震动）
  fallbackFeedback(soundName) {
    try {
      switch (soundName) {
        case 'pop':
          uni.vibrateShort({ type: 'heavy' })
          break
        case 'add':
          uni.vibrateShort({ type: 'light' })
          break
        case 'healing':
          uni.vibrateShort({ type: 'medium' })
          break
        default:
          uni.vibrateShort()
      }
    } catch (error) {
      console.log('震动反馈失败:', error)
    }
  }

  // 销毁音效服务
  destroy() {
    try {
      Object.values(this.sounds).forEach(audio => {
        if (audio && audio.destroy) {
          audio.destroy()
        }
      })
      this.sounds = {}
    } catch (error) {
      console.log('销毁音效服务失败:', error)
    }
  }
}

// 创建全局音效服务实例
const soundService = new SoundService()

export default soundService
