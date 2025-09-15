<template>
  <view class="life-journey-container">
    <!-- 游戏背景 -->
    <image 
      class="background-layer" 
      src="/textures/地图功能/背景色.png" 
      mode="scaleToFill"
    />
    <image 
      class="grid-overlay" 
      src="/textures/地图功能/背景网格.png" 
      mode="repeat"
    />

    <!-- 顶部目标栏 -->
    <view class="top-goal-bar">
      <image 
        class="goal-bar-background" 
        src="/textures/地图功能/目标栏.png" 
        mode="scaleToFill"
      />
      <view class="goal-content">
        <view class="goal-text">
          <text class="goal-title">{{ currentGoal.title }}</text>
          <text class="goal-subtitle">{{ currentGoal.subtitle }}</text>
        </view>
        <view class="goal-progress-section">
          <image 
            class="goal-spark" 
            src="/textures/地图功能/目标火花.png" 
            mode="aspectFit"
          />
          <text class="progress-text">{{ currentGoal.progress }}%</text>
        </view>
      </view>
    </view>

    <!-- 右侧功能按钮组 -->
    <view class="right-buttons">
      <!-- 待办任务 -->
      <view class="function-button" @click="openTodoList">
        <image 
          class="button-icon" 
          src="/textures/待办任务/待办任务按钮.png" 
          mode="aspectFit"
        />
      </view>
      
      <!-- 匹配功能 -->
      <view class="function-button" @click="openMatchDialog">
        <image 
          class="button-icon" 
          src="/textures/匹配功能/匹配按钮.png" 
          mode="aspectFit"
        />
      </view>
      
      <!-- 聊天功能 -->
      <view class="function-button" @click="openChat">
        <image 
          class="button-icon" 
          src="/textures/匹配功能/聊天按钮.png" 
          mode="aspectFit"
        />
      </view>
    </view>

    <!-- 地图主体区域 -->
    <scroll-view class="map-main-area" scroll-y="true" :show-scrollbar="false">
      <view class="map-canvas">
        <!-- 人生阶段网格 -->
        <view class="stages-grid">
          <view 
            v-for="(stage, index) in lifeStages" 
            :key="stage.id"
            class="stage-cell"
            :class="[
              `status-${stage.status}`,
              { 'is-current': stage.isCurrent }
            ]"
            :style="getStagePosition(index)"
            @click="selectStage(stage)"
          >
            <!-- 格子背景 -->
            <image 
              class="cell-background" 
              :src="getCellBackground(stage)" 
              mode="scaleToFill"
            />
            
            <!-- 阶段内容 -->
            <view class="stage-content">
              <text class="stage-emoji">{{ stage.icon }}</text>
              <text class="stage-name">{{ stage.title }}</text>
            </view>
            
            <!-- 状态标记 -->
            <view v-if="stage.status === 'completed'" class="status-mark completed">✓</view>
            <view v-if="stage.status === 'locked'" class="status-mark locked">🔒</view>
            <view v-if="stage.isCurrent" class="current-glow"></view>
          </view>
        </view>

        <!-- DouDou 主角 -->
        <view class="player-character" :style="getPlayerStyle()">
          <image 
            class="player-sprite" 
            src="/textures/地图功能/doudou.png" 
            mode="aspectFit"
          />
        </view>

        <!-- 连接路径 -->
        <view 
          v-for="(path, index) in connectionPaths" 
          :key="'path-' + index"
          class="connection-path"
          :style="path.style"
        >
          <image 
            class="path-sprite" 
            src="/textures/地图功能/主角路径.png" 
            mode="scaleToFill"
          />
        </view>

        <!-- 好友角色 -->
        <view 
          v-for="friend in visibleFriends" 
          :key="friend.id"
          class="friend-character"
          :style="getFriendStyle(friend)"
        >
          <image 
            class="friend-sprite" 
            src="/textures/地图功能/好友（后续可能替换）.png" 
            mode="aspectFit"
          />
          <text class="friend-label">{{ friend.name }}</text>
        </view>
      </view>
    </scroll-view>

    <!-- 底部交互面板 -->
    <view class="bottom-panel" :class="{ 'panel-expanded': isPanelExpanded }">
      <!-- 面板背景 -->
      <image 
        class="panel-background" 
        :src="isPanelExpanded ? 
          '/textures/对话框（展开）/聊天框背景板（展开状态）.png' : 
          '/textures/底部对话框/聊天框背景板（默认状态）.png'" 
        mode="scaleToFill"
      />
      
      <!-- DouDou 头像 -->
      <view class="doudou-avatar-container" @click="togglePanel">
        <image 
          class="doudou-avatar" 
          src="/textures/底部对话框/DOUDOU形象（后续会有点击交互功能 这块逻辑可以之后再写）.png" 
          mode="aspectFit"
        />
      </view>

      <!-- 默认状态内容 -->
      <view v-if="!isPanelExpanded" class="default-content">
        <view class="message-area">
          <text class="current-message">{{ currentMessage }}</text>
        </view>
        <view class="input-area">
          <image 
            class="voice-button" 
            src="/textures/底部对话框/语音按钮.png" 
            mode="aspectFit"
            @click="startVoiceInput"
          />
          <view class="text-input-container">
            <image 
              class="input-background" 
              src="/textures/底部对话框/输入框.png" 
              mode="scaleToFill"
            />
            <input 
              class="message-input" 
              placeholder="输入消息..."
              v-model="inputMessage"
              @confirm="sendMessage"
            />
          </view>
        </view>
      </view>

      <!-- 展开状态内容 -->
      <view v-if="isPanelExpanded" class="expanded-content">
        <!-- 问候语区域 -->
        <view class="greeting-area">
          <image 
            class="greeting-background" 
            src="/textures/对话框（展开）/开场提示语（后续增加基于不同时段提供不同提示语的逻辑）.png" 
            mode="scaleToFill"
          />
          <text class="greeting-message">{{ greetingText }}</text>
        </view>

        <!-- 任务选择区域 -->
        <view class="tasks-area">
          <view 
            v-for="(task, index) in dailyTasks" 
            :key="task.id"
            class="task-item"
            :class="{ 'task-selected': selectedTaskId === task.id }"
            @click="selectTask(task.id)"
          >
            <image 
              class="task-background" 
              :src="getTaskBackgroundImage(task.id, index)" 
              mode="scaleToFill"
            />
            <image 
              class="task-type-icon" 
              :src="getTaskTypeIcon(index)" 
              mode="aspectFit"
            />
            <text class="task-title">{{ task.title }}</text>
          </view>
        </view>

        <!-- 任务详情区域 -->
        <view v-if="selectedTask" class="task-detail-area">
          <image 
            class="detail-background" 
            src="/textures/底部对话框/任务详情.png" 
            mode="scaleToFill"
          />
          <view class="detail-content">
            <text class="detail-title">{{ selectedTask.title }}</text>
            <text class="detail-description">{{ selectedTask.description }}</text>
            <view class="action-buttons">
              <view class="action-button" @click="completeTask">
                <image 
                  class="complete-button" 
                  src="/textures/底部对话框/完成按钮.png" 
                  mode="aspectFit"
                />
              </view>
              <view class="action-button" @click="abandonTask">
                <image 
                  class="abandon-button" 
                  src="/textures/底部对话框/放弃按钮.png" 
                  mode="aspectFit"
                />
              </view>
            </view>
          </view>
        </view>

        <!-- 功能标签 -->
        <view class="tags-area">
          <image 
            class="tag-button" 
            src="/textures/底部对话框/标签1.png" 
            mode="aspectFit"
            @click="handleTag(1)"
          />
          <image 
            class="tag-button" 
            src="/textures/底部对话框/标签2.png" 
            mode="aspectFit"
            @click="handleTag(2)"
          />
          <image 
            class="tag-button" 
            src="/textures/底部对话框/标签3.png" 
            mode="aspectFit"
            @click="handleTag(3)"
          />
        </view>
      </view>
    </view>

    <!-- 匹配弹窗 -->
    <view class="match-popup" v-if="showMatchPopup" @click="closeMatchPopup">
      <view class="popup-content" @click.stop>
        <image 
          class="popup-background" 
          src="/textures/匹配功能/弹窗.png" 
          mode="scaleToFill"
        />
        <view class="popup-body">
          <text class="popup-title">寻找成长伙伴</text>
          <text class="popup-message">正在为你匹配志同道合的朋友...</text>
          <view class="match-progress">
            <view class="progress-bar" :style="{ width: matchProgress + '%' }"></view>
          </view>
          <text class="progress-label">{{ matchProgress }}%</text>
        </view>
      </view>
    </view>
  </view>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'

// 响应式数据
const isPanelExpanded = ref(false)
const inputMessage = ref('')
const selectedTaskId = ref(null)
const showMatchPopup = ref(false)
const matchProgress = ref(0)

// 当前目标
const currentGoal = ref({
  title: '成为更好的自己',
  subtitle: '人生成长之旅',
  progress: 65
})

// 当前消息
const currentMessage = ref('你好！我是DouDou，今天想要完成什么任务呢？')

// 问候语
const greetingText = ref('早上好！新的一天开始了，让我们一起制定今天的成长计划吧！')

// 人生阶段数据（3x3网格布局）
const lifeStages = ref([
  { id: 'birth', title: '新生', icon: '👶', status: 'completed', gridPos: { row: 0, col: 0 } },
  { id: 'childhood', title: '童年', icon: '🧒', status: 'completed', gridPos: { row: 0, col: 1 } },
  { id: 'adolescence', title: '青春期', icon: '🎓', status: 'completed', gridPos: { row: 0, col: 2 } },
  { id: 'young-adult', title: '青年', icon: '💼', status: 'current', isCurrent: true, gridPos: { row: 1, col: 0 } },
  { id: 'love', title: '恋爱', icon: '💕', status: 'available', gridPos: { row: 1, col: 1 } },
  { id: 'marriage', title: '结婚', icon: '💒', status: 'locked', gridPos: { row: 1, col: 2 } },
  { id: 'parenting', title: '育儿', icon: '👨‍👩‍👧‍👦', status: 'locked', gridPos: { row: 2, col: 0 } },
  { id: 'career', title: '事业', icon: '🏆', status: 'locked', gridPos: { row: 2, col: 1 } },
  { id: 'retirement', title: '退休', icon: '🏖️', status: 'locked', gridPos: { row: 2, col: 2 } }
])

// 每日任务
const dailyTasks = ref([
  { id: 'task1', title: '学习新技能', description: '今天学习一个新的技能或知识点，提升自己的能力。' },
  { id: 'task2', title: '运动健身', description: '进行30分钟的运动，保持身体健康。' },
  { id: 'task3', title: '社交互动', description: '与朋友或家人进行有意义的交流。' }
])

// 好友数据
const visibleFriends = ref([
  { id: 'friend1', name: '小明', gridPos: { row: 0, col: 1.5 } },
  { id: 'friend2', name: '小红', gridPos: { row: 1.5, col: 2 } }
])

// 连接路径
const connectionPaths = ref([
  { style: { left: '180rpx', top: '180rpx', width: '120rpx', height: '20rpx', transform: 'rotate(0deg)' } },
  { style: { left: '300rpx', top: '180rpx', width: '120rpx', height: '20rpx', transform: 'rotate(0deg)' } },
  { style: { left: '120rpx', top: '240rpx', width: '20rpx', height: '120rpx', transform: 'rotate(90deg)' } },
  { style: { left: '240rpx', top: '300rpx', width: '120rpx', height: '20rpx', transform: 'rotate(0deg)' } }
])

// 计算属性
const selectedTask = computed(() => {
  return dailyTasks.value.find(task => task.id === selectedTaskId.value)
})

// 方法
const getStagePosition = (index) => {
  const stage = lifeStages.value[index]
  const cellSize = 160  // 从120增加到160
  const gap = 50        // 从40增加到50
  const startX = 40     // 从60调整到40
  const startY = 40     // 从60调整到40
  
  return {
    left: (startX + (cellSize + gap) * stage.gridPos.col) + 'rpx',
    top: (startY + (cellSize + gap) * stage.gridPos.row) + 'rpx'
  }
}

const getCellBackground = (stage) => {
  switch (stage.status) {
    case 'completed':
      return '/textures/地图功能/绿色格子.png'
    case 'current':
      return '/textures/地图功能/蓝色格子.png'
    case 'available':
      return '/textures/地图功能/粉色格子.png'
    default:
      return '/textures/地图功能/背景网格.png'
  }
}

const getPlayerStyle = () => {
  // DouDou 位置在当前阶段附近
  const currentStage = lifeStages.value.find(stage => stage.isCurrent)
  if (currentStage) {
    const cellSize = 160  // 从120增加到160
    const gap = 50        // 从40增加到50
    const startX = 40     // 从60调整到40
    const startY = 40     // 从60调整到40
    
    return {
      left: (startX + (cellSize + gap) * currentStage.gridPos.col + 40) + 'rpx',  // 从30调整到40
      top: (startY + (cellSize + gap) * currentStage.gridPos.row - 25) + 'rpx'   // 从-20调整到-25
    }
  }
  return { left: '200rpx', top: '200rpx' }
}

const getFriendStyle = (friend) => {
  const cellSize = 160  // 从120增加到160
  const gap = 50        // 从40增加到50
  const startX = 40     // 从60调整到40
  const startY = 40     // 从60调整到40
  
  return {
    left: (startX + (cellSize + gap) * friend.gridPos.col) + 'rpx',
    top: (startY + (cellSize + gap) * friend.gridPos.row) + 'rpx'
  }
}

const getTaskBackgroundImage = (taskId, index) => {
  const isSelected = selectedTaskId.value === taskId
  return isSelected 
    ? `/textures/底部对话框/任务${index + 1}（选中）.png`
    : `/textures/底部对话框/任务${index + 1}（默认）.png`
}

const getTaskTypeIcon = (index) => {
  return `/textures/对话框（展开）/任务类型${index + 1}.png`
}

const togglePanel = () => {
  isPanelExpanded.value = !isPanelExpanded.value
}

const selectStage = (stage) => {
  if (stage.status === 'locked') {
    uni.showToast({
      title: '该阶段暂未解锁',
      icon: 'none'
    })
    return
  }
  
  console.log('选择阶段:', stage.title)
}

const selectTask = (taskId) => {
  selectedTaskId.value = selectedTaskId.value === taskId ? null : taskId
}

const completeTask = () => {
  if (selectedTask.value) {
    uni.showToast({
      title: '任务完成！',
      icon: 'success'
    })
    selectedTaskId.value = null
  }
}

const abandonTask = () => {
  selectedTaskId.value = null
}

const sendMessage = () => {
  if (inputMessage.value.trim()) {
    console.log('发送消息:', inputMessage.value)
    inputMessage.value = ''
  }
}

const startVoiceInput = () => {
  uni.showToast({
    title: '语音功能开发中',
    icon: 'none'
  })
}

const handleTag = (tagNumber) => {
  console.log('点击标签:', tagNumber)
}

const openTodoList = () => {
  uni.navigateTo({
    url: '/pages/task/task'
  })
}

const openMatchDialog = () => {
  showMatchPopup.value = true
  matchProgress.value = 0
  
  // 模拟匹配进度
  const interval = setInterval(() => {
    matchProgress.value += 15
    if (matchProgress.value >= 100) {
      clearInterval(interval)
      setTimeout(() => {
        showMatchPopup.value = false
        matchProgress.value = 0
        uni.showToast({
          title: '匹配成功！',
          icon: 'success'
        })
      }, 500)
    }
  }, 300)
}

const closeMatchPopup = () => {
  showMatchPopup.value = false
  matchProgress.value = 0
}

const openChat = () => {
  uni.navigateTo({
    url: '/pages/chat/chat'
  })
}

// 生命周期
onMounted(() => {
  console.log('游戏风格人生地图加载完成')
})
</script>

<style lang="scss" scoped>
.life-journey-container {
  width: 100vw;
  height: 100vh;
  position: relative;
  overflow: hidden;
  background: #f0f0f0;
}

/* 背景层 */
.background-layer {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 1;
}

.grid-overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 2;
  opacity: 0.3;
}

/* 顶部目标栏 */
.top-goal-bar {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100rpx;
  z-index: 100;
}

.goal-bar-background {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
}

.goal-content {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 40rpx;
  z-index: 2;
}

.goal-text {
  display: flex;
  flex-direction: column;
  gap: 5rpx;
}

.goal-title {
  font-size: 28rpx;
  font-weight: 600;
  color: #333;
}

.goal-subtitle {
  font-size: 22rpx;
  color: #666;
}

.goal-progress-section {
  display: flex;
  align-items: center;
  gap: 10rpx;
}

.goal-spark {
  width: 30rpx;
  height: 30rpx;
}

.progress-text {
  font-size: 24rpx;
  font-weight: 600;
  color: #FF9500;
}

/* 右侧功能按钮 */
.right-buttons {
  position: absolute;
  top: 120rpx;
  right: 30rpx;
  z-index: 90;
  display: flex;
  flex-direction: column;
  gap: 20rpx;
}

.function-button {
  width: 60rpx;
  height: 60rpx;
  cursor: pointer;
  transition: transform 0.2s ease;
  
  &:active {
    transform: scale(0.9);
  }
}

.button-icon {
  width: 100%;
  height: 100%;
}

/* 地图主体区域 */
.map-main-area {
  position: absolute;
  top: 100rpx;
  left: 0;
  width: 100%;
  height: calc(100vh - 100rpx - 200rpx);
  z-index: 10;
}

.map-canvas {
  position: relative;
  width: 100%;
  min-height: 900rpx; /* 从800rpx增加到900rpx以适应更大的网格 */
  padding: 30rpx;
}

/* 人生阶段网格 */
.stages-grid {
  position: relative;
  width: 100%;
  height: 700rpx; /* 从600rpx增加到700rpx以适应更大的色块 */
}

.stage-cell {
  position: absolute;
  width: 160rpx;  /* 从120rpx增加到160rpx */
  height: 160rpx; /* 从120rpx增加到160rpx */
  cursor: pointer;
  transition: all 0.3s ease;
  
  &:active {
    transform: scale(0.95);
  }
  
  &.is-current {
    z-index: 15;
  }
}

.cell-background {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
}

.stage-content {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 5rpx;
  z-index: 2;
}

.stage-emoji {
  font-size: 42rpx; /* 从32rpx增加到42rpx */
  filter: drop-shadow(0 2rpx 4rpx rgba(0, 0, 0, 0.2));
}

.stage-name {
  font-size: 22rpx; /* 从18rpx增加到22rpx */
  color: #333;
  font-weight: 600;
  text-align: center;
  text-shadow: 0 1rpx 2rpx rgba(255, 255, 255, 0.8);
}

.status-mark {
  position: absolute;
  width: 30rpx;  /* 从24rpx增加到30rpx */
  height: 30rpx; /* 从24rpx增加到30rpx */
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 16rpx; /* 从14rpx增加到16rpx */
  font-weight: bold;
  z-index: 3;
  
  &.completed {
    top: -10rpx;  /* 从-8rpx调整到-10rpx */
    right: -10rpx; /* 从-8rpx调整到-10rpx */
    background: #4CAF50;
    color: white;
  }
  
  &.locked {
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    background: rgba(0, 0, 0, 0.5);
    color: white;
  }
}

.current-glow {
  position: absolute;
  top: -12rpx;  /* 从-10rpx调整到-12rpx */
  left: -12rpx; /* 从-10rpx调整到-12rpx */
  right: -12rpx; /* 从-10rpx调整到-12rpx */
  bottom: -12rpx; /* 从-10rpx调整到-12rpx */
  border: 4rpx solid #FF9500; /* 从3rpx增加到4rpx */
  border-radius: 20rpx; /* 从15rpx增加到20rpx */
  animation: glow 2s ease-in-out infinite alternate;
  z-index: 1;
}

@keyframes glow {
  0% { opacity: 0.5; transform: scale(1); }
  100% { opacity: 1; transform: scale(1.05); }
}

/* 角色 */
.player-character {
  position: absolute;
  z-index: 20;
  animation: bounce 3s ease-in-out infinite;
}

.player-sprite {
  width: 60rpx;
  height: 60rpx;
}

@keyframes bounce {
  0%, 100% { transform: translateY(0px); }
  50% { transform: translateY(-8px); }
}

.friend-character {
  position: absolute;
  z-index: 18;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 5rpx;
}

.friend-sprite {
  width: 50rpx;
  height: 50rpx;
}

.friend-label {
  font-size: 16rpx;
  color: #666;
  background: rgba(255, 255, 255, 0.8);
  padding: 2rpx 6rpx;
  border-radius: 8rpx;
}

/* 连接路径 */
.connection-path {
  position: absolute;
  z-index: 5;
}

.path-sprite {
  width: 100%;
  height: 100%;
  opacity: 0.7;
}

/* 底部面板 */
.bottom-panel {
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
  height: 200rpx;
  z-index: 100;
  transition: height 0.3s ease;
  
  &.panel-expanded {
    height: 400rpx;
  }
}

.panel-background {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
}

.doudou-avatar-container {
  position: absolute;
  left: 30rpx;
  top: 20rpx;
  z-index: 2;
  cursor: pointer;
  transition: transform 0.2s ease;
  
  &:active {
    transform: scale(0.95);
  }
}

.doudou-avatar {
  width: 70rpx;
  height: 70rpx;
}

/* 默认状态内容 */
.default-content {
  position: absolute;
  left: 120rpx;
  top: 20rpx;
  right: 30rpx;
  height: 160rpx;
  z-index: 2;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}

.message-area {
  flex: 1;
  display: flex;
  align-items: center;
}

.current-message {
  font-size: 22rpx;
  color: #333;
  line-height: 1.4;
}

.input-area {
  display: flex;
  align-items: center;
  gap: 15rpx;
  height: 50rpx;
}

.voice-button {
  width: 40rpx;
  height: 40rpx;
  cursor: pointer;
  
  &:active {
    transform: scale(0.9);
  }
}

.text-input-container {
  position: relative;
  flex: 1;
  height: 40rpx;
}

.input-background {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
}

.message-input {
  position: relative;
  width: 100%;
  height: 100%;
  padding: 0 15rpx;
  font-size: 20rpx;
  background: transparent;
  border: none;
  outline: none;
  z-index: 2;
}

/* 展开状态内容 */
.expanded-content {
  position: absolute;
  top: 20rpx;
  left: 30rpx;
  right: 30rpx;
  bottom: 20rpx;
  z-index: 2;
  display: flex;
  flex-direction: column;
  gap: 15rpx;
}

.greeting-area {
  position: relative;
  height: 50rpx;
}

.greeting-background {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
}

.greeting-message {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  font-size: 20rpx;
  color: #333;
  text-align: center;
  z-index: 2;
}

.tasks-area {
  display: flex;
  gap: 10rpx;
  height: 70rpx;
}

.task-item {
  position: relative;
  flex: 1;
  cursor: pointer;
  transition: transform 0.2s ease;
  
  &:active {
    transform: scale(0.95);
  }
}

.task-background {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
}

.task-type-icon {
  position: absolute;
  left: 10rpx;
  top: 50%;
  transform: translateY(-50%);
  width: 25rpx;
  height: 25rpx;
  z-index: 2;
}

.task-title {
  position: absolute;
  left: 45rpx;
  top: 50%;
  transform: translateY(-50%);
  font-size: 18rpx;
  color: #333;
  z-index: 2;
}

.task-detail-area {
  position: relative;
  height: 120rpx;
}

.detail-background {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
}

.detail-content {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  padding: 15rpx 20rpx;
  z-index: 2;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}

.detail-title {
  font-size: 22rpx;
  font-weight: 600;
  color: #333;
}

.detail-description {
  font-size: 18rpx;
  color: #666;
  line-height: 1.3;
}

.action-buttons {
  display: flex;
  gap: 15rpx;
  justify-content: flex-end;
}

.action-button {
  cursor: pointer;
  transition: transform 0.2s ease;
  
  &:active {
    transform: scale(0.9);
  }
}

.complete-button, .abandon-button {
  width: 50rpx;
  height: 25rpx;
}

.tags-area {
  display: flex;
  gap: 10rpx;
  justify-content: center;
  height: 30rpx;
}

.tag-button {
  width: 40rpx;
  height: 25rpx;
  cursor: pointer;
  transition: transform 0.2s ease;
  
  &:active {
    transform: scale(0.9);
  }
}

/* 匹配弹窗 */
.match-popup {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.popup-content {
  position: relative;
  width: 80%;
  height: 300rpx;
}

.popup-background {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
}

.popup-body {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 20rpx;
  padding: 40rpx;
  z-index: 2;
}

.popup-title {
  font-size: 28rpx;
  font-weight: 600;
  color: #333;
  text-align: center;
}

.popup-message {
  font-size: 22rpx;
  color: #666;
  text-align: center;
}

.match-progress {
  width: 70%;
  height: 8rpx;
  background: rgba(0, 0, 0, 0.1);
  border-radius: 4rpx;
  overflow: hidden;
}

.progress-bar {
  height: 100%;
  background: linear-gradient(90deg, #FF9500, #FF6B35);
  border-radius: 4rpx;
  transition: width 0.3s ease;
}

.progress-label {
  font-size: 20rpx;
  color: #FF9500;
  font-weight: 600;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .stage-cell {
    width: 140rpx; /* 从100rpx增加到140rpx */
    height: 140rpx; /* 从100rpx增加到140rpx */
  }
  
  .stage-emoji {
    font-size: 36rpx; /* 从28rpx增加到36rpx */
  }
  
  .stage-name {
    font-size: 20rpx; /* 从16rpx增加到20rpx */
  }
}

@media (max-width: 480px) {
  .goal-content {
    padding: 0 30rpx;
  }
  
  .goal-title {
    font-size: 24rpx;
  }
  
  .goal-subtitle {
    font-size: 20rpx;
  }
  
  .right-buttons {
    right: 20rpx;
  }
  
  .function-button {
    width: 50rpx;
    height: 50rpx;
  }
  
  .map-canvas {
    padding: 20rpx;
  }
  
  .stage-cell {
    width: 120rpx; /* 从80rpx增加到120rpx */
    height: 120rpx; /* 从80rpx增加到120rpx */
  }
  
  .stage-emoji {
    font-size: 32rpx; /* 从24rpx增加到32rpx */
  }
  
  .stage-name {
    font-size: 18rpx; /* 从14rpx增加到18rpx */
  }
}
</style>