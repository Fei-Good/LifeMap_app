<template>
  <view class="map-container">
    <!-- 状态栏占位 -->
    <view class="status-bar" :style="{height: statusBarHeight + 'px'}"></view>
    
    <!-- 顶部目标卡片 -->
    <view class="goal-section">
      <view class="goal-card">
        <view class="goal-header">
          <text class="goal-title">目标</text>
          <text class="goal-subtitle">DouDou的成长地图</text>
        </view>
        <text class="goal-description">后续补充可视化的数据呈现</text>
        <view class="goal-stats">
          <view class="stat-item">
            <text class="stat-number">{{ userStats.completedTasks }}</text>
            <text class="stat-label">已完成</text>
          </view>
          <view class="stat-item">
            <text class="stat-number">{{ userStats.totalExp }}</text>
            <text class="stat-label">经验值</text>
          </view>
          <view class="stat-item">
            <text class="stat-number">{{ userStats.level }}</text>
            <text class="stat-label">等级</text>
          </view>
        </view>
      </view>
    </view>

    <!-- 蜂窝地图系统 -->
    <view class="map-section">
      <view class="hexagon-container">
        <!-- 背景蜂窝网格 -->
        <view class="hexagon-grid">
          <view 
            v-for="(hex, index) in hexagonGrid" 
            :key="`hex-${index}`"
            class="hexagon-cell" 
            :class="{ active: hex.active, accessible: hex.accessible }"
            :style="hex.style"
            @tap="selectHexagon(hex, index)"
          >
            <view class="hexagon-inner">
              <text v-if="hex.icon" class="hex-icon">{{ hex.icon }}</text>
            </view>
          </view>
        </view>
        
        <!-- 中心豆豆角色 -->
        <view class="doudou-center" @tap="interactWithDouDou">
          <view class="doudou-avatar">
            <view class="doudou-face" :class="{ happy: douDouMood === 'happy', sad: douDouMood === 'sad' }">
              <view class="doudou-eyes"></view>
              <view class="doudou-mouth"></view>
            </view>
          </view>
          <view class="doudou-speech" v-if="douDouMessage">
            <text>{{ douDouMessage }}</text>
          </view>
        </view>
        
        <!-- 通往目标的路径 -->
        <view class="path-indicator">
          <view class="path-line"></view>
          <text class="path-text">通往目标的路径</text>
        </view>
      </view>
    </view>

    <!-- 用户任务区域 -->
    <view class="user-task-section">
      <view class="task-avatar-container" @tap="showTaskDetails">
        <image 
          class="task-avatar"
          src="@/static/login/DouDou形象_登录页.png"
          mode="aspectFit"
        />
        <view class="task-badge" v-if="pendingTasks > 0">{{ pendingTasks }}</view>
      </view>
      <view class="task-info">
        <text class="task-title">用户需要完成的任务</text>
        <text class="task-count">待完成: {{ pendingTasks }} 项</text>
      </view>
    </view>

    <!-- 智能体交流区 -->
    <view class="chat-section">
      <view class="chat-input-container">
        <input 
          class="chat-input" 
          placeholder="和DouDou说点什么..." 
          v-model="chatInput"
          @confirm="sendMessage"
        />
        <view class="send-button" @tap="sendMessage">
          <text class="send-icon">📤</text>
        </view>
      </view>
    </view>

    <!-- 底部功能按钮 -->
    <view class="bottom-functions">
      <view class="function-btn hard-skill" @tap="openSkillPage('hard')">
        <text class="function-text">硬技能</text>
      </view>
      <view class="function-btn soft-skill" @tap="openSkillPage('soft')">
        <text class="function-text">软技能</text>
      </view>
      <view class="function-btn emotion-manage" @tap="openSkillPage('emotion')">
        <text class="function-text">情绪管理</text>
      </view>
    </view>
  </view>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import userService from '@/utils/userService'

// 系统状态
const statusBarHeight = ref(0)

// 用户数据
const userStats = ref({
  completedTasks: 12,
  totalExp: 1580,
  level: 5
})

// 豆豆状态
const douDouMood = ref('happy')
const douDouMessage = ref('欢迎来到你的成长地图！')

// 聊天输入
const chatInput = ref('')

// 待完成任务数
const pendingTasks = ref(3)

// 蜂窝网格数据 - 创建一个7x5的蜂窝网格
const hexagonGrid = ref([])

// 初始化蜂窝网格
const initHexagonGrid = () => {
  const grid = []
  const rows = 7
  const cols = 5
  
  for (let row = 0; row < rows; row++) {
    for (let col = 0; col < cols; col++) {
      // 计算六边形位置
      const offsetX = (row % 2) * 30 // 奇数行偏移
      const x = col * 60 + offsetX
      const y = row * 52
      
      // 确定是否激活和可访问
      const isCenter = row === 3 && col === 2
      const isNearCenter = Math.abs(row - 3) <= 1 && Math.abs(col - 2) <= 1
      const active = Math.random() > 0.7 // 随机激活一些格子
      const accessible = isCenter || isNearCenter || active
      
      grid.push({
        id: `${row}-${col}`,
        row,
        col,
        active,
        accessible,
        icon: active ? ['⭐', '🎯', '💎', '🔥'][Math.floor(Math.random() * 4)] : '',
        style: {
          transform: `translate(${x}rpx, ${y}rpx)`,
          opacity: accessible ? 1 : 0.3
        }
      })
    }
  }
  
  hexagonGrid.value = grid
}

// 选择六边形
const selectHexagon = (hex, index) => {
  if (!hex.accessible) {
    uni.showToast({
      title: '暂时无法到达',
      icon: 'none'
    })
    return
  }
  
  if (hex.active) {
    uni.showModal({
      title: '发现宝藏！',
      content: `你发现了一个特殊区域：${hex.icon}\n获得了特殊奖励！`,
      showCancel: false
    })
    
    // 更新用户经验
    userStats.value.totalExp += 50
    userStats.value.completedTasks += 1
    
    // 使该格子变为普通状态
    hex.active = false
    hex.icon = ''
  } else {
    uni.showToast({
      title: '探索了新区域',
      icon: 'success'
    })
  }
  
  // 震动反馈
  uni.vibrateShort()
}

// 与豆豆互动
const interactWithDouDou = () => {
  const messages = [
    '今天感觉怎么样？💭',
    '要不要一起探索新的区域？🗺️',
    '你的成长让我很开心！😊',
    '记得休息一下哦～☕',
    '有什么想聊的吗？💬'
  ]
  
  douDouMessage.value = messages[Math.floor(Math.random() * messages.length)]
  douDouMood.value = ['happy', 'excited'][Math.floor(Math.random() * 2)]
  
  setTimeout(() => {
    douDouMessage.value = ''
    douDouMood.value = 'happy'
  }, 3000)
  
  uni.vibrateShort()
}

// 发送消息
const sendMessage = () => {
  if (!chatInput.value.trim()) return
  
  // 这里可以调用AI聊天服务
  uni.showToast({
    title: '消息已发送',
    icon: 'success'
  })
  
  // 模拟豆豆回复
  setTimeout(() => {
    douDouMessage.value = '我听到你说的了，让我想想怎么帮你～'
    douDouMood.value = 'thinking'
  }, 1000)
  
  chatInput.value = ''
}

// 显示任务详情
const showTaskDetails = () => {
  uni.navigateTo({
    url: '/pages/task/task'
  })
}

// 打开技能页面
const openSkillPage = (skillType) => {
  const skillNames = {
    hard: '硬技能',
    soft: '软技能', 
    emotion: '情绪管理'
  }
  
  uni.showModal({
    title: skillNames[skillType],
    content: `${skillNames[skillType]}模块正在开发中，敬请期待！`,
    showCancel: false
  })
}

onMounted(() => {
  // 获取系统信息
  const systemInfo = uni.getSystemInfoSync()
  statusBarHeight.value = systemInfo.statusBarHeight || 0
  
  // 初始化蜂窝网格
  initHexagonGrid()
  
  // 获取用户数据
  const currentUser = userService.getCurrentUser()
  if (currentUser) {
    // 这里可以加载用户的实际数据
  }
})
</script>

<style lang="scss" scoped>
.map-container {
  min-height: 100vh;
  background: linear-gradient(180deg, #E8F4FD 0%, #F0F8FF 50%, #E6F3FF 100%);
  position: relative;
  overflow: hidden;
}

.status-bar {
  background: transparent;
}

/* 顶部目标卡片 */
.goal-section {
  padding: 20rpx 30rpx;
  position: relative;
  z-index: 10;
}

.goal-card {
  background: linear-gradient(135deg, #FFD700, #FFA500);
  border-radius: 25rpx;
  padding: 30rpx;
  box-shadow: 0 8rpx 25rpx rgba(255, 193, 7, 0.3);
  position: relative;
  overflow: hidden;
}

.goal-card::before {
  content: '';
  position: absolute;
  top: -50%;
  right: -20%;
  width: 100%;
  height: 100%;
  background: url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><polygon points="50,0 93.3,25 93.3,75 50,100 6.7,75 6.7,25" fill="rgba(255,255,255,0.1)"/></svg>') no-repeat;
  transform: rotate(15deg);
  opacity: 0.3;
}

.goal-header {
  display: flex;
  align-items: center;
  gap: 20rpx;
  margin-bottom: 15rpx;
}

.goal-title {
  font-size: 32rpx;
  font-weight: bold;
  color: #fff;
}

.goal-subtitle {
  font-size: 26rpx;
  color: rgba(255, 255, 255, 0.9);
}

.goal-description {
  font-size: 24rpx;
  color: rgba(255, 255, 255, 0.8);
  margin-bottom: 20rpx;
}

.goal-stats {
  display: flex;
  justify-content: space-around;
  gap: 20rpx;
}

.stat-item {
  text-align: center;
  flex: 1;
}

.stat-number {
  display: block;
  font-size: 28rpx;
  font-weight: bold;
  color: #fff;
  margin-bottom: 5rpx;
}

.stat-label {
  font-size: 22rpx;
  color: rgba(255, 255, 255, 0.8);
}

/* 蜂窝地图系统 */
.map-section {
  flex: 1;
  padding: 20rpx;
  position: relative;
  min-height: 400rpx;
}

.hexagon-container {
  position: relative;
  width: 100%;
  height: 400rpx;
  display: flex;
  align-items: center;
  justify-content: center;
}

.hexagon-grid {
  position: absolute;
  top: 0;
  left: 50%;
  transform: translateX(-50%);
}

.hexagon-cell {
  position: absolute;
  width: 50rpx;
  height: 50rpx;
  transition: all 0.3s ease;
}

.hexagon-inner {
  width: 100%;
  height: 100%;
  background: rgba(255, 255, 255, 0.8);
  clip-path: polygon(25% 6.7%, 75% 6.7%, 100% 50%, 75% 93.3%, 25% 93.3%, 0% 50%);
  display: flex;
  align-items: center;
  justify-content: center;
  border: 2rpx solid rgba(255, 193, 7, 0.3);
  transition: all 0.3s ease;
}

.hexagon-cell.active .hexagon-inner {
  background: linear-gradient(135deg, #FFD700, #FFA500);
  border-color: #FF9800;
  box-shadow: 0 0 20rpx rgba(255, 193, 7, 0.6);
  transform: scale(1.2);
}

.hexagon-cell.accessible:active {
  transform: scale(1.1);
}

.hex-icon {
  font-size: 24rpx;
}

/* 中心豆豆角色 */
.doudou-center {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  z-index: 5;
}

.doudou-avatar {
  width: 120rpx;
  height: 120rpx;
  background: linear-gradient(135deg, #FF6B6B, #FFA500);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 10rpx 30rpx rgba(255, 107, 107, 0.4);
  cursor: pointer;
  transition: all 0.3s ease;
}

.doudou-avatar:active {
  transform: scale(1.1);
}

.doudou-face {
  position: relative;
  width: 80%;
  height: 80%;
}

.doudou-eyes {
  position: absolute;
  top: 30%;
  left: 25%;
  width: 12rpx;
  height: 16rpx;
  background: #333;
  border-radius: 50%;
  box-shadow: 30rpx 0 0 #333;
}

.doudou-mouth {
  position: absolute;
  bottom: 25%;
  left: 50%;
  transform: translateX(-50%);
  width: 30rpx;
  height: 15rpx;
  border: 3rpx solid #333;
  border-top: none;
  border-radius: 0 0 30rpx 30rpx;
}

.doudou-face.sad .doudou-mouth {
  border-bottom: none;
  border-top: 3rpx solid #333;
  border-radius: 30rpx 30rpx 0 0;
  bottom: 35%;
}

.doudou-speech {
  position: absolute;
  top: -80rpx;
  left: 50%;
  transform: translateX(-50%);
  background: rgba(255, 255, 255, 0.95);
  padding: 15rpx 20rpx;
  border-radius: 20rpx;
  font-size: 24rpx;
  color: #333;
  white-space: nowrap;
  box-shadow: 0 4rpx 15rpx rgba(0, 0, 0, 0.1);
}

.doudou-speech::after {
  content: '';
  position: absolute;
  bottom: -10rpx;
  left: 50%;
  transform: translateX(-50%);
  width: 0;
  height: 0;
  border-left: 10rpx solid transparent;
  border-right: 10rpx solid transparent;
  border-top: 10rpx solid rgba(255, 255, 255, 0.95);
}

/* 路径指示器 */
.path-indicator {
  position: absolute;
  top: 10%;
  left: 50%;
  transform: translateX(-50%);
  text-align: center;
}

.path-line {
  width: 3rpx;
  height: 100rpx;
  background: linear-gradient(180deg, #FFD700, transparent);
  margin: 0 auto 10rpx;
}

.path-text {
  font-size: 20rpx;
  color: #888;
}

/* 用户任务区域 */
.user-task-section {
  position: absolute;
  bottom: 200rpx;
  left: 30rpx;
  display: flex;
  align-items: center;
  gap: 15rpx;
  background: rgba(255, 255, 255, 0.9);
  padding: 20rpx;
  border-radius: 25rpx;
  box-shadow: 0 6rpx 20rpx rgba(0, 0, 0, 0.1);
  backdrop-filter: blur(10rpx);
}

.task-avatar-container {
  position: relative;
}

.task-avatar {
  width: 60rpx;
  height: 60rpx;
  border-radius: 50%;
}

.task-badge {
  position: absolute;
  top: -5rpx;
  right: -5rpx;
  background: #FF4757;
  color: #fff;
  width: 24rpx;
  height: 24rpx;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 18rpx;
  font-weight: bold;
}

.task-info {
  display: flex;
  flex-direction: column;
}

.task-title {
  font-size: 24rpx;
  font-weight: 500;
  color: #333;
  margin-bottom: 4rpx;
}

.task-count {
  font-size: 20rpx;
  color: #666;
}

/* 智能体交流区 */
.chat-section {
  position: absolute;
  bottom: 120rpx;
  left: 30rpx;
  right: 30rpx;
}

.chat-input-container {
  display: flex;
  align-items: center;
  background: rgba(255, 255, 255, 0.95);
  border-radius: 30rpx;
  padding: 15rpx 20rpx;
  box-shadow: 0 6rpx 20rpx rgba(0, 0, 0, 0.1);
  backdrop-filter: blur(10rpx);
}

.chat-input {
  flex: 1;
  background: transparent;
  border: none;
  font-size: 26rpx;
  color: #333;
}

.send-button {
  width: 50rpx;
  height: 50rpx;
  background: linear-gradient(135deg, #4FACFE, #00F2FE);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-left: 15rpx;
  transition: all 0.3s ease;
}

.send-button:active {
  transform: scale(0.95);
}

.send-icon {
  font-size: 24rpx;
}

/* 底部功能按钮 */
.bottom-functions {
  position: absolute;
  bottom: 30rpx;
  left: 30rpx;
  right: 30rpx;
  display: flex;
  justify-content: space-around;
  gap: 15rpx;
}

.function-btn {
  flex: 1;
  height: 60rpx;
  border-radius: 30rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 24rpx;
  font-weight: 500;
  color: #fff;
  box-shadow: 0 4rpx 15rpx rgba(0, 0, 0, 0.2);
  transition: all 0.3s ease;
}

.function-btn:active {
  transform: translateY(2rpx);
  box-shadow: 0 2rpx 8rpx rgba(0, 0, 0, 0.2);
}

.hard-skill {
  background: linear-gradient(135deg, #28A745, #20C997);
}

.soft-skill {
  background: linear-gradient(135deg, #FFC107, #FD7E14);
}

.emotion-manage {
  background: linear-gradient(135deg, #DC3545, #E83E8C);
}

/* 响应式适配 */
@media screen and (max-width: 400px) {
  .goal-card {
    padding: 25rpx;
  }
  
  .goal-title {
    font-size: 28rpx;
  }
  
  .goal-subtitle {
    font-size: 24rpx;
  }
  
  .stat-number {
    font-size: 26rpx;
  }
  
  .stat-label {
    font-size: 20rpx;
  }
  
  .doudou-avatar {
    width: 100rpx;
    height: 100rpx;
  }
  
  .chat-input {
    font-size: 24rpx;
  }
  
  .function-btn {
    height: 50rpx;
    font-size: 22rpx;
  }
}
</style>
