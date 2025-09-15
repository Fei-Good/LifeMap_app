<template>
  <view class="workplace-vent-container">
    <!-- 状态栏占位 -->
    <view class="status-bar"></view>
    
    <!-- 顶部标题栏 -->
    <view class="header">
      <view class="back-btn" @click="goBack">
        <text class="back-icon">←</text>
      </view>
      <view class="header-title">
        <text class="title-text">职场吐槽</text>
        <text class="subtitle-text">释放压力，治愈心灵</text>
      </view>
      <view class="header-right"></view>
    </view>

    <!-- 背景装饰 -->
    <view class="background-decoration">
      <view class="cloud cloud-1"></view>
      <view class="cloud cloud-2"></view>
      <view class="cloud cloud-3"></view>
      
    </view>

    <!-- 气泡容器 -->
    <view class="bubbles-container">
      <view 
        v-for="bubble in bubbles" 
        :key="bubble.id"
        class="bubble"
        :style="{
          left: bubble.x + 'px',
          bottom: bubble.y + 'px',
          backgroundColor: bubble.color,
          animationDelay: bubble.delay + 's',
          animationDuration: bubble.duration + 's'
        }"
        :class="{ 'user-bubble': bubble.isUserInput }"
        @click="popBubble(bubble)"
      >
        <text class="bubble-text">{{ bubble.text }}</text>
      </view>
    </view>

    <!-- 爆炸效果容器 -->
    <view class="explosion-container">
      <view 
        v-for="explosion in explosions"
        :key="explosion.id"
        class="explosion"
        :style="{
          left: explosion.x + 'px',
          bottom: explosion.y + 'px'
        }"
      >
        <view class="explosion-particle" v-for="i in 8" :key="i"></view>
      </view>
    </view>

    <!-- 治愈文字显示 -->
    <view class="healing-text-container">
      <view 
        v-for="healingText in healingTexts"
        :key="healingText.id"
        class="healing-text"
        :style="{
          left: healingText.x + 'px',
          bottom: healingText.y + 'px'
        }"
      >
        {{ healingText.text }}
      </view>
    </view>

    <!-- 底部输入区域 -->
    <view class="input-container">
      <!-- 输入框 -->
      <view class="input-wrapper">
        <input 
          class="text-input"
          v-model="inputText"
          placeholder="说出你的职场烦恼..."
          @confirm="addVentText"
          maxlength="50"
        />
      <view class="input-actions">
        <view class="send-btn" @click="addVentText" :class="{ disabled: !inputText.trim() }">
          <text class="send-icon">发送</text>
        </view>
      </view>
      </view>
      
     
    </view>

    <!-- 统计信息 -->
    <view class="stats-container">
      <text class="stats-text">已释放压力: {{ poppedCount }} 个</text>
    </view>
  </view>
</template>

<script setup>
import { ref, onMounted, onUnmounted, nextTick } from 'vue'
import soundService from '@/utils/soundService.js'

// 响应式数据
const inputText = ref('')
const bubbles = ref([])
const explosions = ref([])
const healingTexts = ref([])
const poppedCount = ref(0)
// 气泡ID计数器
let bubbleIdCounter = 0
let explosionIdCounter = 0
let healingTextIdCounter = 0
const defaultVentTexts = [
  '周一又来了😩',
  '开会开不完',
  '需求又变了',
  '加班到深夜',
  '老板画大饼',
  '同事甩锅了',
  '项目太赶了',
  '想要涨工资',
  '工作好累啊',
  '想休个假',
  '代码写不完',
  'Bug改不完',
  '客户太难伺候',
  '压力山大',
  '想换工作了'
]

// 治愈文字库
const healingMessages = [
  '你很棒！💪',
  '一切都会好起来的 ✨',
  '你值得更好的 🌟',
  '加油，相信自己 🎉',
  '明天会更好 🌈',
  '你不是一个人 🤗',
  '压力释放了 🎈',
  '心情轻松了 😊',
  '勇敢面对困难 💖',
  '你已经很努力了 🌺'
]

// 气泡颜色 - 8种多彩颜色，在白色背景下清晰可见
const bubbleColors = [
  '#FF5722',  // 深橙红色
  '#2196F3',  // 蓝色
  '#4CAF50',  // 绿色
  '#FF9800',  // 橙色
  '#9C27B0',  // 紫色
  '#F44336',  // 红色
  '#00BCD4',  // 青色
  '#FF6B35'   // 橙红色
]

// 定时器
let bubbleTimer = null

// 添加吐槽文本
const addVentText = () => {
  if (!inputText.value.trim()) return
  
  createBubble(inputText.value.trim(), true) // 标记为用户输入
  inputText.value = ''
  
  // 播放添加音效
  playSound('add')
}


// 创建气泡
const createBubble = (text, isUserInput = false) => {
  const bubble = {
    id: ++bubbleIdCounter,
    text: text,
    x: Math.random() * (uni.getSystemInfoSync().windowWidth - 120),
    y: -50,
    color: bubbleColors[Math.floor(Math.random() * bubbleColors.length)],
    delay: isUserInput ? 0 : Math.random() * 2, // 用户输入的气泡立即显示
    duration: isUserInput ? 10 + Math.random() * 2 : 8 + Math.random() * 4, // 用户输入的气泡显示更久
    isUserInput: isUserInput
  }
  
  bubbles.value.push(bubble)
  
  // 自动移除气泡
  setTimeout(() => {
    const index = bubbles.value.findIndex(b => b.id === bubble.id)
    if (index > -1) {
      bubbles.value.splice(index, 1)
    }
  }, (bubble.duration + bubble.delay) * 1000)
}

// 点击气泡爆炸
const popBubble = (bubble) => {
  // 移除气泡
  const index = bubbles.value.findIndex(b => b.id === bubble.id)
  if (index > -1) {
    bubbles.value.splice(index, 1)
  }
  
  // 创建爆炸效果
  createExplosion(bubble.x + 60, bubble.y + 25)
  
  // 显示治愈文字
  showHealingText(bubble.x + 60, bubble.y + 50)
  
  // 增加计数
  poppedCount.value++
  
  // 播放爆炸音效
  playSound('pop')
  
  // 延迟播放治愈音效
  setTimeout(() => {
    playSound('healing')
  }, 300)
  
  // 震动反馈
  uni.vibrateShort()
}

// 创建爆炸效果
const createExplosion = (x, y) => {
  const explosion = {
    id: ++explosionIdCounter,
    x: x,
    y: y
  }
  
  explosions.value.push(explosion)
  
  // 0.6秒后移除爆炸效果
  setTimeout(() => {
    const index = explosions.value.findIndex(e => e.id === explosion.id)
    if (index > -1) {
      explosions.value.splice(index, 1)
    }
  }, 600)
}

// 显示治愈文字
const showHealingText = (x, y) => {
  const healingText = {
    id: ++healingTextIdCounter,
    text: healingMessages[Math.floor(Math.random() * healingMessages.length)],
    x: x,
    y: y
  }
  
  healingTexts.value.push(healingText)
  
  // 2秒后移除治愈文字
  setTimeout(() => {
    const index = healingTexts.value.findIndex(h => h.id === healingText.id)
    if (index > -1) {
      healingTexts.value.splice(index, 1)
    }
  }, 2000)
}

// 播放音效
const playSound = (type) => {
  soundService.play(type)
}


// 返回至chat界面
const goBack = () => {
  uni.navigateTo({
    url: '/pages/chat/chat'
  })
}

// 自动生成随机气泡（演示用）
const generateRandomBubble = () => {
  // 一次生成1-3个气泡，让屏幕更加充满
  const bubbleCount = 1 + Math.floor(Math.random() * 3)
  for (let i = 0; i < bubbleCount; i++) {
    const randomText = defaultVentTexts[Math.floor(Math.random() * defaultVentTexts.length)]
    setTimeout(() => {
      createBubble(randomText, false) // 非用户输入
    }, i * 300) // 每个气泡间隔0.3秒
  }
}


// 初始化默认气泡
const initializeDefaultBubbles = () => {
  // 随机生成20-30个初始气泡，充满屏幕
  const bubbleCount = 20 + Math.floor(Math.random() * 11)
  const shuffledTexts = [...defaultVentTexts].sort(() => Math.random() - 0.5)
  
  for (let i = 0; i < bubbleCount; i++) {
    setTimeout(() => {
      createBubble(shuffledTexts[i % shuffledTexts.length], false)
    }, i * 200) // 每0.2秒生成一个，更快速
  }
}

// 生命周期
onMounted(() => {
  // 初始化默认气泡
  initializeDefaultBubbles()
  
  // 每3秒自动生成一个随机气泡，持续生成
  bubbleTimer = setInterval(generateRandomBubble, 3000)
  
})

onUnmounted(() => {
  if (bubbleTimer) {
    clearInterval(bubbleTimer)
  }
})
</script>

<style lang="scss" scoped>
.workplace-vent-container {
  width: 100vw;
  height: 100vh;
  background: linear-gradient(to bottom, #FFFFFF, #E6F2FF);
  position: relative;
  overflow: hidden;
}

.status-bar {
  height: var(--status-bar-height, 44rpx);
}

.header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 20rpx 30rpx;
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(10px);
  box-shadow: 0 2rpx 10rpx rgba(220, 220, 220, 0.5);
  
  .back-btn {
    width: 60rpx;
    height: 60rpx;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 50%;
    
    .back-icon {
      font-size: 32rpx;
      font-weight: bold;
    }
  }
  
  .header-title {
    display: flex;
    flex-direction: column;
    align-items: center;
    
    .title-text {
      color: #333333;
      font-size: 36rpx;
      font-weight: bold;
    }
    
    .subtitle-text {
      color: #666666;
      font-size: 24rpx;
      margin-top: 4rpx;
    }
  }
  
  .header-right {
    width: 60rpx;
  }
}

.background-decoration {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  pointer-events: none;
  
  .cloud {
    position: absolute;
    background: rgba(255, 255, 255, 0.6);
    border-radius: 100rpx;
    animation: float 20s infinite linear;
    box-shadow: 0 4rpx 15rpx rgba(255, 152, 0, 0.1);
    
    &.cloud-1 {
      width: 200rpx;
      height: 80rpx;
      top: 200rpx;
      left: -100rpx;
      animation-delay: 0s;
    }
    
    &.cloud-2 {
      width: 150rpx;
      height: 60rpx;
      top: 400rpx;
      left: -75rpx;
      animation-delay: -10s;
    }
    
    &.cloud-3 {
      width: 180rpx;
      height: 70rpx;
      top: 600rpx;
      left: -90rpx;
      animation-delay: -5s;
    }
  }
  
}

@keyframes float {
  from {
    transform: translateX(0);
  }
  to {
    transform: translateX(calc(100vw + 200rpx));
  }
}


.bubbles-container {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  pointer-events: none;
  
  .bubble {
    position: absolute;
    padding: 20rpx 30rpx;
    border-radius: 50rpx;
    color: white;
    font-size: 28rpx;
    font-weight: 500;
    box-shadow: 0 8rpx 25rpx rgba(255, 152, 0, 0.25);
    animation: rise infinite linear;
    pointer-events: auto;
    cursor: pointer;
    transform-origin: center;
    transition: transform 0.1s ease;
    border: 2rpx solid rgba(255, 255, 255, 0.3);
    
    &.user-bubble {
      animation: userRise infinite linear;
      box-shadow: 0 12rpx 35rpx rgba(255, 152, 0, 0.4);
      border: 3rpx solid rgba(255, 255, 255, 0.8);
      transform: scale(1.1);
      z-index: 10;
      
      .bubble-text {
        font-weight: 600;
        text-shadow: 0 3rpx 6rpx rgba(0, 0, 0, 0.4);
      }
    }
    
    &:active {
      transform: scale(0.95);
    }
    
    .bubble-text {
      text-shadow: 0 2rpx 4rpx rgba(0, 0, 0, 0.3);
    }
  }
}

@keyframes rise {
  from {
    transform: translateY(0) rotate(0deg);
    opacity: 0;
  }
  10% {
    opacity: 1;
  }
  90% {
    opacity: 1;
  }
  to {
    transform: translateY(-100vh) rotate(360deg);
    opacity: 0;
  }
}

@keyframes userRise {
  from {
    transform: translateY(0) rotate(0deg) scale(1.1);
    opacity: 0;
  }
  5% {
    transform: translateY(-20rpx) rotate(5deg) scale(1.2);
    opacity: 1;
  }
  15% {
    transform: translateY(-40rpx) rotate(-5deg) scale(1.1);
    opacity: 1;
  }
  25% {
    transform: translateY(-60rpx) rotate(5deg) scale(1.15);
    opacity: 1;
  }
  85% {
    opacity: 1;
  }
  to {
    transform: translateY(-100vh) rotate(360deg) scale(1.1);
    opacity: 0;
  }
}

.explosion-container {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  pointer-events: none;
  
  .explosion {
    position: absolute;
    width: 0;
    height: 0;
    
    .explosion-particle {
      position: absolute;
      width: 12rpx;
      height: 12rpx;
      border-radius: 50%;
      animation: explode 0.8s ease-out forwards;
      box-shadow: 0 0 8rpx rgba(255, 152, 0, 0.6);
      
      &:nth-child(1) { 
        background: #FF5722;
        animation-delay: 0s; 
        transform: rotate(0deg) translateX(0rpx); 
      }
      &:nth-child(2) { 
        background: #2196F3;
        animation-delay: 0.05s; 
        transform: rotate(45deg) translateX(0rpx); 
      }
      &:nth-child(3) { 
        background: #4CAF50;
        animation-delay: 0.1s; 
        transform: rotate(90deg) translateX(0rpx); 
      }
      &:nth-child(4) { 
        background: #FF9800;
        animation-delay: 0.15s; 
        transform: rotate(135deg) translateX(0rpx); 
      }
      &:nth-child(5) { 
        background: #9C27B0;
        animation-delay: 0.2s; 
        transform: rotate(180deg) translateX(0rpx); 
      }
      &:nth-child(6) { 
        background: #F44336;
        animation-delay: 0.25s; 
        transform: rotate(225deg) translateX(0rpx); 
      }
      &:nth-child(7) { 
        background: #00BCD4;
        animation-delay: 0.3s; 
        transform: rotate(270deg) translateX(0rpx); 
      }
      &:nth-child(8) { 
        background: #FF6B35;
        animation-delay: 0.35s; 
        transform: rotate(315deg) translateX(0rpx); 
      }
    }
  }
}

@keyframes explode {
  0% {
    opacity: 1;
    transform: scale(1) translateX(0);
  }
  50% {
    opacity: 1;
    transform: scale(1.2) translateX(80rpx);
  }
  100% {
    opacity: 0;
    transform: scale(0.3) translateX(120rpx);
  }
}

.healing-text-container {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  pointer-events: none;
  
  .healing-text {
    position: absolute;
    color: #FF9800;
    font-size: 32rpx;
    font-weight: bold;
    text-shadow: 0 2rpx 8rpx rgba(0, 0, 0, 0.3);
    animation: healingTextRise 2s ease-out forwards;
  }
}

@keyframes healingTextRise {
  0% {
    opacity: 0;
    transform: translateY(0) scale(0.5);
  }
  20% {
    opacity: 1;
    transform: translateY(-20rpx) scale(1.2);
  }
  100% {
    opacity: 0;
    transform: translateY(-100rpx) scale(1);
  }
}

.input-container {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(10px);
  padding: 30rpx;
  border-radius: 40rpx 40rpx 0 0;
  
  .input-wrapper {
    display: flex;
    align-items: center;
    background: white;
    border-radius: 50rpx;
    padding: 20rpx 30rpx;
    box-shadow: 0 4rpx 20rpx rgba(0, 0, 0, 0.1);
    margin-bottom: 30rpx;
    
    .text-input {
      flex: 1;
      font-size: 32rpx;
      color: #333;
      
      &::placeholder {
        color: #999;
      }
    }
    
    .input-actions {
      display: flex;
      align-items: center;
      gap: 20rpx;
      
      .send-btn {
        padding: 20rpx 30rpx;
        background: #FF9800;
        color: white;
        border-radius: 40rpx;
        font-size: 28rpx;
        transition: all 0.2s ease;
        
        &.disabled {
          background: #ccc;
          opacity: 0.6;
        }
        
        &:not(.disabled):active {
          transform: scale(0.95);
        }
      }
    }
  }
  
  .quick-vent-buttons {
    display: flex;
    flex-wrap: wrap;
    gap: 20rpx;
    
    .quick-btn {
      padding: 16rpx 24rpx;
      background: rgba(255, 152, 0, 0.1);
      color: #FF9800;
      border-radius: 30rpx;
      font-size: 26rpx;
      border: 2rpx solid rgba(255, 152, 0, 0.3);
      transition: all 0.2s ease;
      
      &:active {
        background: rgba(255, 152, 0, 0.2);
        transform: scale(0.95);
      }
    }
  }
}

.stats-container {
  position: absolute;
  top: 200rpx;
  right: 30rpx;
  background: rgba(255, 255, 255, 0.9);
  backdrop-filter: blur(10px);
  padding: 20rpx 30rpx;
  border-radius: 30rpx;
  box-shadow: 0 4rpx 15rpx rgba(255, 152, 0, 0.15);
  border: 2rpx solid rgba(255, 152, 0, 0.2);
  
  .stats-text {
    color: #E65100;
    font-size: 26rpx;
    font-weight: 500;
  }
}
</style>
