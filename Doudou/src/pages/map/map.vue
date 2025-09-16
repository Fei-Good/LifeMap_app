<template>
  <view class="map-container">
    <!-- 状态栏占位 -->
    <view class="status-bar"></view>

    <!-- 顶部 目标卡片 -->
    <view class="goal-card">
      <view class="goal-left">
        <view class="goal-title-row">
          <text class="goal-badge">目标</text>
        </view>
        <text class="goal-name">成功跑路上岸</text>
      </view>
      <view class="goal-right">
        <text class="persistence-label">已坚持天数</text>
        <text class="persistence-days">1天</text>
        <view class="flame">
          <image src="@/static/QA/火苗.png" class="flame-icon" mode="aspectFit" />
        </view>
      </view>
      
      <!-- 动态todolist图标 -->
      <view class="todo-indicator">
        <image :src="todoIndicatorIcon" class="todo-icon" mode="aspectFit" />
      </view>
    </view>


 
    <!-- 任务列表 -->
    <view class="task-list">
      <view 
        v-for="(task, index) in taskList" 
        :key="task.id"
        class="task-item"
        :class="`task-${index + 1}`"
      >
        <view class="task-left">
          <view class="task-avatar">
            <image :src="task.avatar" class="avatar-icon" mode="aspectFit" />
          </view>
          <view class="task-info">
            <text class="task-status">{{ task.statusText }}</text>
            <text class="task-description" :class="{ 'completed-text': task.isCompleted }">{{ task.description }}</text>
          </view>
        </view>
        <view class="task-right">
          <view 
            class="task-action-btn"
            :class="{ 'completed': task.isCompleted }"
            @click="toggleTask(task.id)"
          >
            <image 
              :src="task.isCompleted ? '/static/chat/完成.svg' : '/static/chat/刷新.svg'" 
              class="action-icon" 
              mode="aspectFit" 
            />
          </view>
        </view>
      </view>
    </view>

 
    <!-- 底部导航栏 -->
    <view class="bottom-nav">
      <view class="nav-item" :class="{ active: currentPage === 'map' }" @click="navigateToMap">
        <view class="nav-icon">
          <image src="@/static/chat/Map-draw.svg" class="nav-svg-icon" />
        </view>
        <text class="nav-text">地图</text>
      </view>
      
      <view class="nav-item" :class="{ active: currentPage === 'chat' }" @click="navigateToChat">
        <view class="nav-icon">🔥</view>
        <text class="nav-text">DouDou</text>
      </view>
      
      <view class="nav-item" :class="{ active: currentPage === 'knowledge' }" @click="navigateToKnowledge">
        <view class="nav-icon">
          <image src="@/static/chat/Document-folder.svg" class="nav-svg-icon" />
        </view>
        <text class="nav-text">知识库</text>
      </view>
    </view>
  </view>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'

const currentPage = ref('map')
const showDebugPanel = ref(false)

// 任务类型的 todolist 数据
const taskTodos = {
  'hard-skills': [
    '学习JavaScript基础语法',
    '掌握Vue.js框架使用',
    '学习数据库设计原理',
    '完成算法练习题50道',
    '学习Python编程语言',
    '掌握Git版本控制',
    '学习Docker容器技术',
    '完成项目架构设计'
  ],
  'emotions': [
    '制定每日时间管理计划',
    '学习番茄工作法',
    '建立健康作息时间表',
    '完成情绪管理课程',
    '练习冥想10分钟',
    '学习压力管理技巧',
    '建立工作生活平衡',
    '完成心理健康评估'
  ],
  'soft-skills': [
    '练习演讲表达能力',
    '学习团队协作技巧',
    '提升沟通交流能力',
    '学习领导力发展',
    '完成项目管理认证',
    '提升批判性思维',
    '学习谈判技巧',
    '发展创新思维能力'
  ]
}

// 任务进度跟踪
const taskProgress = ref({
  'hard-skills': 0, // 当前进行到第几个任务
  'emotions': 0,
  'soft-skills': 0
})

// 任务完成状态
const taskCompletionStatus = ref({
  'hard-skills': [],
  'emotions': [],
  'soft-skills': []
})

// 任务列表数据
const taskList = ref([
  {
    id: 'hard-skills',
    avatar: '/static/map/hard-skills_task.png',
    statusText: '硬技能提升',
    description: '',
    isCompleted: false,
    type: 'hard-skills'
  },
  {
    id: 'emotions', 
    avatar: '/static/map/emotions_task.png',
    statusText: '情绪管理',
    description: '',
    isCompleted: false,
    type: 'emotions'
  },
  {
    id: 'soft-skills',
    avatar: '/static/map/soft-skills_task.png', 
    statusText: '软技能发展',
    description: '',
    isCompleted: false,
    type: 'soft-skills'
  }
])

// 获取当前任务描述
const getCurrentTaskDescription = (taskType) => {
  const progress = taskProgress.value[taskType]
  const todos = taskTodos[taskType]
  
  if (progress >= todos.length) {
    return '所有任务已完成！'
  }
  
  return todos[progress]
}

// 获取任务完成数量
const getCompletedTaskCount = (taskType) => {
  return taskCompletionStatus.value[taskType].length
}

// 获取任务总数
const getTotalTaskCount = (taskType) => {
  return taskTodos[taskType].length
}

// 切换任务状态
const toggleTask = (taskId) => {
  const task = taskList.value.find(t => t.id === taskId)
  if (task && !task.isCompleted) {
    const taskType = task.type
    const currentProgress = taskProgress.value[taskType]
    const todos = taskTodos[taskType]
    
    if (currentProgress < todos.length) {
      // 标记当前任务为完成
      taskCompletionStatus.value[taskType].push(currentProgress)
      
      // 进度加一
      taskProgress.value[taskType] = currentProgress + 1
      
      // 检查是否所有任务都完成了
      if (taskProgress.value[taskType] >= todos.length) {
        task.isCompleted = true
        task.description = '所有任务已完成！'
      } else {
        // 更新任务描述为下一个任务
        task.description = getCurrentTaskDescription(taskType)
      }
      
      // 更新状态文本显示进度
      updateTaskStatus(task)
      
      // 保存进度到本地存储
      saveTaskProgress()
    }
  }
}

// 更新任务状态文本
const updateTaskStatus = (task) => {
  const taskType = task.type
  const completed = getCompletedTaskCount(taskType)
  const total = getTotalTaskCount(taskType)
  
  if (task.isCompleted) {
    task.statusText = `${task.statusText.split('(')[0]}(已完成)`
  } else {
    task.statusText = `${task.statusText.split('(')[0]}(${completed}/${total})`
  }
}

// 保存任务进度到本地存储
const saveTaskProgress = () => {
  try {
    uni.setStorageSync('taskProgress', taskProgress.value)
    uni.setStorageSync('taskCompletionStatus', taskCompletionStatus.value)
  } catch (e) {
    console.error('保存任务进度失败:', e)
  }
}

// 从本地存储加载任务进度
const loadTaskProgress = () => {
  try {
    const savedProgress = uni.getStorageSync('taskProgress')
    const savedCompletionStatus = uni.getStorageSync('taskCompletionStatus')
    
    if (savedProgress) {
      taskProgress.value = { ...taskProgress.value, ...savedProgress }
    }
    
    if (savedCompletionStatus) {
      taskCompletionStatus.value = { ...taskCompletionStatus.value, ...savedCompletionStatus }
    }
  } catch (e) {
    console.error('加载任务进度失败:', e)
  }
}

// 初始化任务描述和状态
const initializeTasks = () => {
  // 先加载保存的进度
  loadTaskProgress()
  
  taskList.value.forEach(task => {
    const taskType = task.type
    const progress = taskProgress.value[taskType]
    const totalTasks = getTotalTaskCount(taskType)
    
    // 检查该类型任务是否全部完成
    if (progress >= totalTasks) {
      task.isCompleted = true
      task.description = '所有任务已完成！'
    } else {
      task.description = getCurrentTaskDescription(taskType)
    }
    
    updateTaskStatus(task)
  })
}

// 计算属性：动态获取todo-indicator图标路径
const todoIndicatorIcon = computed(() => {
  // 检查各个任务的完成状态
  const hardSkillsCompleted = taskList.value.find(t => t.id === 'hard-skills')?.isCompleted || false
  const emotionsCompleted = taskList.value.find(t => t.id === 'emotions')?.isCompleted || false
  const softSkillsCompleted = taskList.value.find(t => t.id === 'soft-skills')?.isCompleted || false
  
  // 根据完成的任务类型返回对应的图标
  // 如果多个任务完成，优先显示硬技能 > 软技能 > 情绪管理
  if (hardSkillsCompleted) {
    return '/static/map/硬技能完成.png'
  } else if (softSkillsCompleted) {
    return '/static/map/软技能完成.png'
  } else if (emotionsCompleted) {
    return '/static/map/情绪管理完成.png'
  } else {
    return '/static/map/未完成todolist.png'
  }
})

// 重置所有任务进度（调试用）
const resetAllTasks = () => {
  taskProgress.value = {
    'hard-skills': 0,
    'emotions': 0,
    'soft-skills': 0
  }
  
  taskCompletionStatus.value = {
    'hard-skills': [],
    'emotions': [],
    'soft-skills': []
  }
  
  // 清除本地存储
  try {
    uni.removeStorageSync('taskProgress')
    uni.removeStorageSync('taskCompletionStatus')
  } catch (e) {
    console.error('清除存储失败:', e)
  }
  
  // 重新初始化
  initializeTasks()
}


const navigateToMap = () => {
  // 当前页
}

const navigateToChat = () => {
  uni.navigateTo({
    url: '/pages/chat/chat'
  })
}

const navigateToKnowledge = () => {
  uni.navigateTo({
    url: '/pages/knowledge/knowledge'
  })
}


onMounted(() => {
  currentPage.value = 'map'
  initializeTasks()
})
</script>

<style lang="scss" scoped>
.map-container {
  width: 100vw;
  height: 100vh;
  background-image: url('@/static/chat/chat_background.png');
  background-size: contain;
  background-position: center bottom;
  background-repeat: no-repeat;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.status-bar {
  height: calc(var(--status-bar-height) + 20rpx);
  width: 100%;
}

.goal-card {
  margin: 30rpx 24rpx 0 16rpx;
  padding: 32rpx 32rpx 32rpx 32rpx;
  border-radius: 32rpx;
  background: #ffe9bf;
  display: flex;
  align-items: center;
  justify-content: space-between;
  box-shadow: 0 8rpx 16rpx rgba(0,0,0,0.08);
  min-height: 120rpx;
  position: relative;
}

.goal-left {
  display: flex;
  flex-direction: column;
}

.goal-badge {
  font-size: 28rpx;
  color: #b58c2b;
}

.goal-name {
  margin-top: 12rpx;
  font-size: 36rpx;
  font-weight: 600;
  color: #333;
}

.goal-right {
  display: flex;
  align-items: center;
  gap: 16rpx;
}

.persistence-label {
  font-size: 26rpx;
  color: #8c6a16;
}

.persistence-days {
  font-size: 34rpx;
  font-weight: 700;
  color: #2e2e2e;
}

.flame-icon {
  width: 64rpx;
  height: 64rpx;
}

.todo-indicator {
  position: absolute;
  bottom: -750rpx;
  left: 50%;
  transform: translateX(-50%);
  z-index: 10;
  animation: float 3s ease-in-out infinite;
}

.todo-icon {
  width: 700rpx;
  height: 700rpx;
}

@keyframes float {
  0%, 100% {
    transform: translateX(-50%) translateY(0px);
  }
  50% {
    transform: translateX(-50%) translateY(-10px);
  }
}



@keyframes float {
  0%, 100% {
    transform: translateX(-50%) translateY(0px);
  }
  50% {
    transform: translateX(-50%) translateY(-10px);
  }
}

/* 任务列表样式 */
.task-list {
  position: fixed;
  bottom: 160rpx; /* 导航栏高度(120rpx) + 安全区域 + 10rpx间隔(约5px) */
  left: 0;
  right: 0;
  padding: 0 32rpx;
  display: flex;
  flex-direction: column;
  gap: 24rpx;
  z-index: 50;
}

.task-item {
  background: white;
  border-radius: 24rpx;
  padding: 32rpx;
  display: flex;
  align-items: center;
  justify-content: space-between;
  box-shadow: 0 4rpx 12rpx rgba(0, 0, 0, 0.08);
  transition: all 0.3s ease;
  
  &:active {
    transform: scale(0.98);
  }
}

.task-left {
  display: flex;
  align-items: center;
  gap: 24rpx;
  flex: 1;
}

.task-avatar {
  width: 80rpx;
  height: 80rpx;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
}

.avatar-icon {
  width: 80rpx;
  height: 80rpx;
}

.task-info {
  display: flex;
  flex-direction: column;
  gap: 8rpx;
}

.task-status {
  font-size: 28rpx;
  color: #333;
  font-weight: 500;
}

.task-description {
  font-size: 26rpx;
  color: #666;
  display: flex;
  align-items: center;
  gap: 12rpx;
  transition: all 0.3s ease;
  
  &.completed-text {
    color: #4CAF50;
    font-weight: 600;
  }
  
  &:not(.completed-text)::after {
    content: '📝';
    font-size: 24rpx;
  }
  
  &.completed-text::after {
    content: '✅';
    font-size: 24rpx;
  }
}

.task-right {
  display: flex;
  align-items: center;
}

.task-action-btn {
  width: 60rpx;
  height: 60rpx;
  border-radius: 50%;
  background: #F5F5F5;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s ease;
  
  &:active {
    transform: scale(0.9);
  }
  
  &.completed {
    background: #4CAF50;
  }
}

.action-icon {
  width: 32rpx;
  height: 32rpx;
  filter: grayscale(1);
  opacity: 0.6;
  
  .completed & {
    filter: brightness(0) invert(1);
    opacity: 1;
  }
}



.bottom-nav {
  display: flex;
  align-items: center;
  justify-content: space-around;
  background: white;
  border-top: 1rpx solid #F0F0F0;
  padding: 20rpx 0;
  padding-bottom: calc(20rpx + env(safe-area-inset-bottom));
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  z-index: 100;
}

.nav-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8rpx;
  padding: 10rpx 20rpx;
  border-radius: 20rpx;
  transition: all 0.3s ease;
  min-width: 120rpx;
  
  &:active {
    transform: scale(0.95);
    background: rgba(255, 153, 0, 0.12);
  }
  
  &.active {
    background: rgba(255, 153, 0, 0.12);
    
    .nav-icon {
      background: #FFC58F;
      color: white;
    }
    
    .nav-text {
      color: #FF9900;
      font-weight: 600;
    }
  }
}

.nav-icon {
  width: 50rpx;
  height: 50rpx;
  border-radius: 50%;
  background: #F5F5F5;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 24rpx;
  color: #999;
  transition: all 0.3s ease;
}

.nav-svg-icon {
  width: 24rpx;
  height: 24rpx;
  filter: grayscale(1);
  opacity: 0.6;
  transition: all 0.3s ease;
}

.nav-item.active .nav-svg-icon {
  filter: none;
  opacity: 1;
}

.nav-text {
  font-size: 22rpx;
  color: #999;
  font-weight: 500;
  text-align: center;
}

/* 调试触发器样式 */
.debug-trigger {
  position: fixed;
  top: 120rpx;
  right: 20rpx;
  width: 60rpx;
  height: 60rpx;
  background: rgba(0, 0, 0, 0.1);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 24rpx;
  z-index: 999;
  opacity: 0.3;
  
  &:active {
    opacity: 0.8;
  }
}

/* 调试面板样式 */
.debug-panel {
  position: fixed;
  top: 200rpx;
  right: 20rpx;
  background: rgba(0, 0, 0, 0.8);
  padding: 20rpx;
  border-radius: 16rpx;
  z-index: 999;
}

.debug-title {
  color: white;
  font-size: 24rpx;
  margin-bottom: 16rpx;
  text-align: center;
}

.debug-buttons {
  display: flex;
  flex-direction: column;
  gap: 12rpx;
}

.debug-btn {
  background: #FF9900;
  color: white;
  border: none;
  padding: 12rpx 16rpx;
  border-radius: 8rpx;
  font-size: 20rpx;
  min-width: 120rpx;
}
</style>

