<template>
  <view class="task-page">
    <!-- 状态栏占位 -->
    <view class="status-bar" :style="{height: statusBarHeight + 'px'}"></view>
    
    <!-- 任务头部 -->
    <view class="task-header">
      <view class="back-btn" @tap="goBack">
        <text class="back-icon">←</text>
      </view>
      <view class="header-title">
        <text class="title-text">任务系统</text>
        <text class="subtitle-text">今日进度</text>
      </view>
      <view class="header-actions">
        <view class="action-btn" @tap="showTaskSettings">
          <text class="settings-icon">⚙️</text>
        </view>
        <view class="action-btn" @tap="showTaskHistory">
          <text class="history-icon">📊</text>
        </view>
      </view>
    </view>
    
    <!-- 顶部进度条 -->
    <view class="top-progress">
      <view class="level-info">
        <view class="level-badge">Lv.{{userLevel}}</view>
        <text class="level-title">{{levelTitle}}</text>
      </view>
      <text class="exp-text">经验值 {{currentExp}} / {{maxExp}}</text>
      <view class="progress-bar">
        <view class="progress-fill" :style="{width: progressPercent + '%'}"></view>
        <view class="progress-glow"></view>
      </view>
    </view>

    <!-- DouDou角色区域 -->
    <view class="doudou-section">
      <view class="doudou-avatar" @tap="onDouDouClick">
        <view class="doudou-face"></view>
        <view class="doudou-glow"></view>
      </view>
      <view class="greeting-bubble">
        <text>{{greetingMessage}}</text>
      </view>
    </view>

    <!-- 任务卡片区域 -->
    <view class="tasks-container">
      <!-- 每日任务 -->
      <view class="task-section">
        <view class="section-title">
          <view class="section-icon daily-icon">📅</view>
          <text>每日任务</text>
        </view>
        
        <view 
          v-for="(task, index) in dailyTasks" 
          :key="`daily-${index}`"
          class="task-card daily"
          :class="{completed: task.completed}"
          @tap="completeTask(task, 'daily', index)"
        >
          <view class="task-header">
            <text class="task-title">{{task.title}}</text>
            <view class="task-reward">+{{task.reward}}</view>
          </view>
          <text class="task-description">{{task.description}}</text>
          <view class="task-progress">
            <text class="progress-info">进度: {{task.current}}/{{task.total}}</text>
            <view class="task-status" :class="task.completed ? 'status-completed' : 'status-pending'">
              {{task.completed ? '已完成' : '待完成'}}
            </view>
          </view>
          <view class="task-decoration"></view>
        </view>
      </view>

      <!-- 挑战任务 -->
      <view class="task-section">
        <view class="section-title">
          <view class="section-icon challenge-icon">🏆</view>
          <text>挑战任务</text>
        </view>
        
        <view 
          v-for="(task, index) in challengeTasks" 
          :key="`challenge-${index}`"
          class="task-card challenge"
          :class="{completed: task.completed}"
          @tap="completeTask(task, 'challenge', index)"
        >
          <view class="task-header">
            <text class="task-title">{{task.title}}</text>
            <view class="task-reward">+{{task.reward}}</view>
          </view>
          <text class="task-description">{{task.description}}</text>
          <view class="task-progress">
            <text class="progress-info">难度: {{task.difficulty}}</text>
            <view class="task-status" :class="task.completed ? 'status-completed' : 'status-pending'">
              {{task.completed ? '已完成' : '待完成'}}
            </view>
          </view>
          <view class="task-decoration"></view>
        </view>
      </view>

      <!-- 限时解压 -->
      <view class="task-section">
        <view class="section-title">
          <view class="section-icon boss-icon">💥</view>
          <text>限时解压</text>
        </view>
        
        <view class="task-card boss" @tap="startBossGame">
          <view class="task-header">
            <text class="task-title">{{bossTask.title}}</text>
            <view class="task-reward">+∞</view>
          </view>
          <text class="task-description">{{bossTask.description}}</text>
          <view class="task-progress">
            <text class="progress-info">{{bossTask.timeLeft}}</text>
            <view class="task-status status-boss">{{bossTask.status}}</view>
          </view>
          <view class="task-decoration"></view>
        </view>
      </view>
    </view>

    <!-- 技能包区域 -->
    <view class="skills-section">
      <view class="section-title">
        <view class="section-icon skill-icon">🎯</view>
        <text>Workdrop 技能包</text>
      </view>
      
      <view class="skills-grid">
        <view 
          v-for="(skill, index) in skills" 
          :key="`skill-${index}`"
          class="skill-item" 
          @tap="useSkill(skill)"
        >
          <view class="skill-icon-bg" :style="{background: skill.bgColor}">
            <text class="skill-emoji">{{skill.icon}}</text>
            <view class="skill-glow"></view>
          </view>
          <text class="skill-name">{{skill.name}}</text>
        </view>
      </view>
    </view>

    <!-- 成就徽章墙 -->
    <view class="achievements-section">
      <view class="section-title achievement-title">
        <view class="section-icon achievement-icon">🎁</view>
        <text>成就徽章墙</text>
      </view>
      
      <view class="gashapon-machine" @tap="openGashapon">
        <text class="gashapon-title">扭蛋机</text>
        <text class="gashapon-desc">点击获取随机徽章</text>
        <view class="badges-preview">
          <view 
            v-for="(badge, index) in badges" 
            :key="`badge-${index}`"
            class="badge-slot"
            :class="{earned: badge.earned}"
          >
            <text>{{badge.earned ? badge.icon : '?'}}</text>
          </view>
        </view>
        <view class="gashapon-decoration"></view>
      </view>
    </view>
  </view>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import apiService from '@/utils/apiService'
import userService from '@/utils/userService'

// 状态栏高度
const statusBarHeight = ref(0)

// 用户等级数据
const userLevel = ref(5)
const levelTitle = ref('沟通达人')
const currentExp = ref(1250)
const maxExp = ref(2000)

// 计算进度百分比
const progressPercent = computed(() => {
  return Math.round((currentExp.value / maxExp.value) * 100)
})

// 问候消息
const greetingMessage = ref('今天也要加油哦！💪')

// 每日任务数据
const dailyTasks = ref([
  {
    title: '喝8杯水',
    description: '保持身体健康，提升工作效率',
    reward: 50,
    current: 8,
    total: 8,
    completed: true
  },
  {
    title: '赞美1位同事',
    description: '建立良好的人际关系',
    reward: 30,
    current: 0,
    total: 1,
    completed: false
  }
])

// 挑战任务数据
const challengeTasks = ref([
  {
    title: '完成一次公开演讲',
    description: '提升表达能力和自信心',
    reward: 200,
    difficulty: '⭐⭐⭐⭐',
    completed: false
  }
])

// Boss任务数据
const bossTask = ref({
  title: '暴打老板',
  description: '释放工作压力，恢复心情值',
  timeLeft: '剩余时间: 23:45:12',
  status: '点击开始'
})

// 技能数据
const skills = ref([
  {
    name: '高效会议术',
    icon: '📋',
    bgColor: 'linear-gradient(45deg, #28a745, #20c997)',
    type: 'meeting'
  },
  {
    name: 'PPT美化包',
    icon: '📊',
    bgColor: 'linear-gradient(45deg, #ffc107, #fd7e14)',
    type: 'ppt'
  },
  {
    name: '时间管理',
    icon: '⏰',
    bgColor: 'linear-gradient(45deg, #dc3545, #e83e8c)',
    type: 'time'
  },
  {
    name: '团队协作',
    icon: '👥',
    bgColor: 'linear-gradient(45deg, #17a2b8, #6f42c1)',
    type: 'team'
  }
])

// 徽章数据
const badges = ref([
  { icon: '🏅', earned: true },
  { icon: '⭐', earned: true },
  { icon: '🏆', earned: false },
  { icon: '💎', earned: false },
  { icon: '🔥', earned: false }
])

// 完成任务
const completeTask = async (task, type, index) => {
  if (task.completed) return
  
  try {
    // 显示加载状态
    uni.showLoading({
      title: '完成任务中...'
    })
    
    // 如果任务有ID，调用API完成任务
    if (task.id) {
      const result = await apiService.completeTask(task.id, {
        type: type,
        completedAt: new Date().toISOString()
      })
      
      // 如果API返回了更新的经验值，使用API的数据
      if (result.data && result.data.expGained !== undefined) {
        task.reward = result.data.expGained
      }
    }
    
    uni.hideLoading()
    
    // 创建完成动画效果
    uni.showToast({
      title: '任务完成！+' + task.reward + 'EXP',
      icon: 'success',
      duration: 2000
    })
    
    // 更新本地任务状态
    task.completed = true
    if (type === 'daily' && task.current < task.total) {
      task.current = task.total
    }
    
    // 更新经验值
    currentExp.value += task.reward
    if (currentExp.value >= maxExp.value) {
      levelUp()
    }
    
    // 震动反馈
    uni.vibrateShort()
    
  } catch (error) {
    uni.hideLoading()
    
    console.error('完成任务失败:', error)
    
    // 即使API调用失败，也要更新本地状态
    uni.showToast({
      title: '网络不稳定，本地已记录完成',
      icon: 'none',
      duration: 2000
    })
    
    task.completed = true
    if (type === 'daily' && task.current < task.total) {
      task.current = task.total
    }
    
    currentExp.value += task.reward
    if (currentExp.value >= maxExp.value) {
      levelUp()
    }
  }
}

// 升级逻辑
const levelUp = () => {
  userLevel.value++
  currentExp.value = currentExp.value - maxExp.value
  maxExp.value = Math.round(maxExp.value * 1.2)
  
  uni.showToast({
    title: `恭喜升级到 Lv.${userLevel.value}！`,
    icon: 'success',
    duration: 3000
  })
}

// DouDou点击交互
const onDouDouClick = () => {
  const messages = [
    '你真棒！继续加油！🌟',
    '今天的任务完成得很好呢！😊',
    '要记得休息哦～💤',
    '工作之余也要照顾好自己～❤️'
  ]
  
  greetingMessage.value = messages[Math.floor(Math.random() * messages.length)]
  
  // 震动反馈
  uni.vibrateShort()
}

// 暴打老板游戏
const startBossGame = () => {
  uni.showModal({
    title: '开始暴打老板！',
    content: '准备好释放工作压力了吗？',
    confirmText: '开始游戏',
    cancelText: '取消',
    success: (res) => {
      if (res.confirm) {
        // 模拟游戏过程
        bossTask.value.status = '游戏中...'
        
        setTimeout(() => {
          const combo = Math.floor(Math.random() * 50 + 10)
          uni.showToast({
            title: `连击${combo}次！压力释放完成！`,
            icon: 'success',
            duration: 3000
          })
          bossTask.value.status = '点击开始'
        }, 3000)
      }
    }
  })
}

// 使用技能
const useSkill = (skill) => {
  const skillMessages = {
    'meeting': '会议效率提升50%！⚡',
    'ppt': 'PPT颜值爆表！🎨',
    'time': '时间掌控者模式开启！⏰',
    'team': '团队凝聚力+200%！👥'
  }
  
  uni.showToast({
    title: `${skill.name}技能已激活！\n${skillMessages[skill.type]}`,
    icon: 'success',
    duration: 2000
  })
  
  // 震动反馈
  uni.vibrateShort()
}

// 打开扭蛋机
const openGashapon = () => {
  const availableBadges = ['🏆', '🎖️', '⭐', '💎', '🔥', '⚡', '🌟', '💪']
  const randomBadge = availableBadges[Math.floor(Math.random() * availableBadges.length)]
  const badgeNames = {
    '🏆': '超级成就者',
    '🎖️': '模范员工', 
    '⭐': '闪耀新星',
    '💎': '珍贵人才',
    '🔥': '激情燃烧',
    '⚡': '效率之王',
    '🌟': '希望之星',
    '💪': '坚持不懈'
  }
  
  uni.showModal({
    title: '扭蛋机',
    content: `恭喜获得徽章：${randomBadge}\n"${badgeNames[randomBadge] || '神秘徽章'}"`,
    showCancel: false,
    confirmText: '太棒了！'
  })
  
  // 更新徽章墙
  const emptyBadge = badges.value.find(badge => !badge.earned)
  if (emptyBadge) {
    emptyBadge.icon = randomBadge
    emptyBadge.earned = true
  }
  
  // 震动反馈
  uni.vibrateShort()
}

// 返回上级页面
const goBack = () => {
  uni.navigateBack({
    delta: 1
  })
}

// 显示任务设置
const showTaskSettings = () => {
  uni.showActionSheet({
    itemList: ['任务提醒设置', '难度调整', '奖励设置', '重置任务进度'],
    success: (res) => {
      const actions = ['任务提醒', '难度调整', '奖励设置', '重置进度']
      uni.showToast({
        title: `${actions[res.tapIndex]}功能开发中...`,
        icon: 'none',
        duration: 2000
      })
    }
  })
}

// 显示任务历史统计
const showTaskHistory = () => {
  const completedDaily = dailyTasks.value.filter(task => task.completed).length
  const totalDaily = dailyTasks.value.length
  const completedChallenge = challengeTasks.value.filter(task => task.completed).length
  const totalChallenge = challengeTasks.value.length
  
  uni.showModal({
    title: '任务统计',
    content: `今日完成情况：\n每日任务: ${completedDaily}/${totalDaily}\n挑战任务: ${completedChallenge}/${totalChallenge}\n当前等级: Lv.${userLevel.value}`,
    showCancel: false,
    confirmText: '知道了'
  })
}

onMounted(async () => {
  // 获取系统信息，适配状态栏高度
  const systemInfo = uni.getSystemInfoSync()
  statusBarHeight.value = systemInfo.statusBarHeight || 0
  
  // 加载用户数据和任务数据
  await loadUserData()
  await loadTasksData()
})

// 加载用户数据
const loadUserData = async () => {
  try {
    // 获取用户等级信息
    const levelData = await userService.getUserLevel()
    if (levelData) {
      userLevel.value = levelData.level || 5
      levelTitle.value = levelData.levelTitle || '沟通达人'
      currentExp.value = levelData.currentExp || 1250
      maxExp.value = levelData.maxExp || 2000
    }
  } catch (error) {
    console.warn('获取用户等级失败，使用默认数据:', error)
  }
}

// 加载任务数据
const loadTasksData = async () => {
  try {
    uni.showLoading({
      title: '加载任务中...',
      mask: true
    })
    
    // 获取任务列表
    const response = await apiService.getTasks()
    
    if (response.data && Array.isArray(response.data)) {
      // 按类型分类任务
      const tasks = response.data
      
      // 分离每日任务和挑战任务
      const dailyTasksFromApi = tasks.filter(task => task.type === 'daily')
      const challengeTasksFromApi = tasks.filter(task => task.type === 'challenge')
      
      if (dailyTasksFromApi.length > 0) {
        dailyTasks.value = dailyTasksFromApi.map(task => ({
          id: task.id,
          title: task.title || task.name,
          description: task.description,
          reward: task.reward || task.exp || 50,
          current: task.progress || 0,
          total: task.target || 1,
          completed: task.completed || false
        }))
      }
      
      if (challengeTasksFromApi.length > 0) {
        challengeTasks.value = challengeTasksFromApi.map(task => ({
          id: task.id,
          title: task.title || task.name,
          description: task.description,
          reward: task.reward || task.exp || 200,
          difficulty: task.difficulty || '⭐⭐⭐',
          completed: task.completed || false
        }))
      }
      
      console.log('从API加载了任务:', {
        daily: dailyTasksFromApi.length,
        challenge: challengeTasksFromApi.length
      })
    }
    
    uni.hideLoading()
    
  } catch (error) {
    console.warn('从API获取任务失败，使用本地任务:', error)
    uni.hideLoading()
    
    // 显示提示
    uni.showToast({
      title: '网络连接不稳定，使用离线任务',
      icon: 'none',
      duration: 2000
    })
  }
}
</script>

<style scoped>
.task-page {
  min-height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  position: relative;
}

.task-page::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><defs><pattern id="grain" width="100" height="100" patternUnits="userSpaceOnUse"><circle cx="50" cy="50" r="1" fill="rgba(255,255,255,0.03)"/></pattern></defs><rect width="100" height="100" fill="url(%23grain)"/></svg>');
  pointer-events: none;
}

.status-bar {
  background: transparent;
}

/* 任务头部样式 */
.task-header {
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(20px);
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 20rpx 30rpx;
  color: #333333;
  box-shadow: 0 8rpx 32rpx rgba(0, 0, 0, 0.1);
  border-bottom: 1rpx solid rgba(255, 255, 255, 0.2);
}

.back-btn {
  width: 80rpx;
  height: 80rpx;
  border-radius: 50%;
  background: linear-gradient(135deg, #667eea, #764ba2);
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  box-shadow: 0 4rpx 16rpx rgba(102, 126, 234, 0.3);
}

.back-btn:active {
  transform: scale(0.95) rotate(-5deg);
  box-shadow: 0 2rpx 8rpx rgba(102, 126, 234, 0.4);
}

.back-icon {
  font-size: 32rpx;
  font-weight: bold;
  color: #ffffff;
}

.header-title {
  flex: 1;
  text-align: center;
  margin: 0 40rpx;
}

.title-text {
  display: block;
  font-size: 36rpx;
  font-weight: bold;
  margin-bottom: 4rpx;
  background: linear-gradient(135deg, #667eea, #764ba2);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.subtitle-text {
  display: block;
  font-size: 24rpx;
  opacity: 0.8;
  color: #666;
}

.header-actions {
  display: flex;
  gap: 20rpx;
}

.action-btn {
  width: 72rpx;
  height: 72rpx;
  border-radius: 50%;
  background: linear-gradient(135deg, #ff6b6b, #ffa500);
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  box-shadow: 0 4rpx 16rpx rgba(255, 107, 107, 0.3);
}

.action-btn:active {
  transform: scale(0.95);
  box-shadow: 0 2rpx 8rpx rgba(255, 107, 107, 0.4);
}

.settings-icon,
.history-icon {
  font-size: 28rpx;
}

/* 顶部进度条区域 */
.top-progress {
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(20px);
  padding: 40rpx 30rpx;
  color: #333333;
  text-align: center;
  border-bottom: 1rpx solid rgba(255, 255, 255, 0.2);
  margin: 20rpx 30rpx;
  border-radius: 24rpx;
  box-shadow: 0 8rpx 32rpx rgba(0, 0, 0, 0.1);
}

.level-info {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 20rpx;
  margin-bottom: 20rpx;
}

.level-badge {
  background: linear-gradient(45deg, #4facfe, #00f2fe);
  color: #ffffff;
  padding: 12rpx 28rpx;
  border-radius: 40rpx;
  font-size: 28rpx;
  font-weight: bold;
  box-shadow: 0 4rpx 16rpx rgba(79, 172, 254, 0.3);
  animation: pulse 2s infinite;
}

@keyframes pulse {
  0%, 100% { transform: scale(1); }
  50% { transform: scale(1.05); }
}

.level-title {
  font-size: 32rpx;
  font-weight: 600;
  background: linear-gradient(135deg, #667eea, #764ba2);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.exp-text {
  font-size: 24rpx;
  margin-bottom: 16rpx;
  color: #666;
}

.progress-bar {
  background: rgba(240, 240, 240, 0.5);
  border-radius: 20rpx;
  height: 20rpx;
  overflow: hidden;
  margin-top: 16rpx;
  position: relative;
  box-shadow: inset 0 2rpx 8rpx rgba(0, 0, 0, 0.1);
}

.progress-fill {
  background: linear-gradient(90deg, #ffd700, #ffed4e, #ffd700);
  background-size: 200% 100%;
  height: 100%;
  border-radius: 20rpx;
  transition: width 0.8s cubic-bezier(0.4, 0, 0.2, 1);
  position: absolute;
  top: 0;
  left: 0;
  z-index: 1;
  animation: shimmer 2s infinite;
}

@keyframes shimmer {
  0% { background-position: -200% 0; }
  100% { background-position: 200% 0; }
}

.progress-glow {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: radial-gradient(circle, rgba(255, 255, 255, 0.4) 0%, transparent 70%);
  border-radius: 20rpx;
  z-index: 0;
}

/* DouDou角色区域 */
.doudou-section {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 40rpx 0;
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(20px);
  margin: 20rpx 30rpx;
  border-radius: 24rpx;
  box-shadow: 0 8rpx 32rpx rgba(0, 0, 0, 0.1);
  border: 1rpx solid rgba(255, 255, 255, 0.2);
}

.doudou-avatar {
  width: 160rpx;
  height: 160rpx;
  background: linear-gradient(45deg, #ff6b6b, #ffa500, #ff6b6b);
  background-size: 200% 200%;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 16rpx 48rpx rgba(255, 107, 107, 0.4);
  margin-bottom: 30rpx;
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  position: relative;
  animation: gradientShift 3s ease-in-out infinite;
}

@keyframes gradientShift {
  0%, 100% { background-position: 0% 50%; }
  50% { background-position: 100% 50%; }
}

.doudou-avatar:active {
  transform: scale(1.1) rotate(5deg);
  box-shadow: 0 20rpx 60rpx rgba(255, 107, 107, 0.6);
}

.doudou-face {
  position: relative;
  width: 100%;
  height: 100%;
}

.doudou-face::before {
  content: '';
  position: absolute;
  top: 50rpx;
  left: 44rpx;
  width: 16rpx;
  height: 20rpx;
  background: #333;
  border-radius: 50%;
  box-shadow: 60rpx 0 0 #333;
}

.doudou-face::after {
  content: '';
  position: absolute;
  bottom: 44rpx;
  left: 50%;
  transform: translateX(-50%);
  width: 40rpx;
  height: 20rpx;
  border: 4rpx solid #333;
  border-top: none;
  border-radius: 0 0 40rpx 40rpx;
}

.doudou-glow {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: radial-gradient(circle, rgba(255, 255, 255, 0.3) 0%, transparent 70%);
  border-radius: 50%;
  z-index: 0;
}

.greeting-bubble {
  background: linear-gradient(135deg, #667eea, #764ba2);
  color: white;
  padding: 24rpx 36rpx;
  border-radius: 30rpx;
  position: relative;
  box-shadow: 0 12rpx 32rpx rgba(102, 126, 234, 0.3);
  font-size: 28rpx;
  font-weight: 500;
  animation: float 3s ease-in-out infinite;
}

@keyframes float {
  0%, 100% { transform: translateY(0px); }
  50% { transform: translateY(-10px); }
}

.greeting-bubble::before {
  content: '';
  position: absolute;
  top: -16rpx;
  left: 50%;
  transform: translateX(-50%);
  width: 0;
  height: 0;
  border-left: 16rpx solid transparent;
  border-right: 16rpx solid transparent;
  border-bottom: 16rpx solid #667eea;
}

/* 任务卡片容器 */
.tasks-container {
  padding: 0 30rpx 40rpx;
}

.task-section {
  margin-bottom: 40rpx;
}

.section-title {
  font-size: 36rpx;
  font-weight: bold;
  color: white;
  margin-bottom: 30rpx;
  display: flex;
  align-items: center;
  gap: 16rpx;
  text-shadow: 0 2rpx 8rpx rgba(0, 0, 0, 0.3);
}

.section-icon {
  width: 48rpx;
  height: 48rpx;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 24rpx;
  box-shadow: 0 4rpx 16rpx rgba(0, 0, 0, 0.2);
}

.daily-icon { background: linear-gradient(135deg, #28a745, #20c997); }
.challenge-icon { background: linear-gradient(135deg, #ffc107, #fd7e14); }
.boss-icon { background: linear-gradient(135deg, #dc3545, #e83e8c); }
.skill-icon { background: linear-gradient(135deg, #6f42c1, #8e44ad); }
.achievement-icon { background: rgba(255,255,255,0.3); }

/* 任务卡片样式 */
.task-card {
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(20px);
  border-radius: 24rpx;
  padding: 30rpx;
  margin-bottom: 20rpx;
  box-shadow: 0 8rpx 32rpx rgba(0, 0, 0, 0.1);
  border-left: 8rpx solid;
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  position: relative;
  border: 1rpx solid rgba(255, 255, 255, 0.2);
}

.task-card:active {
  transform: translateY(-8rpx) scale(1.02);
  box-shadow: 0 16rpx 48rpx rgba(0, 0, 0, 0.2);
}

.task-card.daily { border-left-color: #28a745; }
.task-card.challenge { border-left-color: #ffc107; }
.task-card.boss { border-left-color: #dc3545; }

.task-card.completed {
  opacity: 0.8;
  background: rgba(248, 249, 250, 0.95);
}

.task-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16rpx;
}

.task-title {
  font-size: 32rpx;
  font-weight: bold;
  color: #333;
  flex: 1;
}

.task-reward {
  background: linear-gradient(45deg, #ffd700, #ffed4e);
  color: #333;
  padding: 10rpx 20rpx;
  border-radius: 24rpx;
  font-size: 24rpx;
  font-weight: bold;
  box-shadow: 0 4rpx 16rpx rgba(255, 215, 0, 0.3);
}

.task-description {
  color: #666;
  font-size: 28rpx;
  margin-bottom: 20rpx;
  line-height: 1.5;
}

.task-progress {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.progress-info {
  font-size: 24rpx;
  color: #888;
}

.task-status {
  padding: 10rpx 28rpx;
  border-radius: 40rpx;
  font-size: 24rpx;
  font-weight: bold;
  transition: all 0.3s ease;
}

.status-pending {
  background: linear-gradient(135deg, #e9ecef, #dee2e6);
  color: #6c757d;
}

.status-completed {
  background: linear-gradient(135deg, #d4edda, #c3e6cb);
  color: #155724;
}

.status-boss {
  background: linear-gradient(135deg, #f8d7da, #f5c6cb);
  color: #721c24;
}

.task-decoration {
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
  height: 20rpx;
  background: linear-gradient(to right, transparent, rgba(0,0,0,0.05));
  border-radius: 0 0 24rpx 24rpx;
  z-index: -1;
}

/* 技能包区域 */
.skills-section {
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(20px);
  padding: 40rpx 30rpx;
  margin: 20rpx 30rpx;
  border-radius: 24rpx;
  box-shadow: 0 8rpx 32rpx rgba(0, 0, 0, 0.1);
  border: 1rpx solid rgba(255, 255, 255, 0.2);
}

.skills-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 30rpx;
}

.skill-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
}

.skill-item:active {
  transform: translateY(-12rpx) scale(1.1);
}

.skill-icon-bg {
  width: 100rpx;
  height: 100rpx;
  border-radius: 24rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 16rpx;
  box-shadow: 0 8rpx 24rpx rgba(0, 0, 0, 0.2);
  position: relative;
  overflow: hidden;
}

.skill-emoji {
  font-size: 40rpx;
  z-index: 1;
  position: relative;
}

.skill-glow {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: radial-gradient(circle, rgba(255, 255, 255, 0.3) 0%, transparent 70%);
  border-radius: 24rpx;
  z-index: 0;
}

.skill-name {
  font-size: 24rpx;
  color: #333;
  text-align: center;
  font-weight: 500;
}

/* 成就徽章墙 */
.achievements-section {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  padding: 40rpx 30rpx;
  color: white;
  text-align: center;
  margin: 20rpx 30rpx;
  border-radius: 24rpx;
  box-shadow: 0 8rpx 32rpx rgba(0, 0, 0, 0.2);
  position: relative;
  overflow: hidden;
}

.achievements-section::before {
  content: '';
  position: absolute;
  top: -50%;
  left: -50%;
  width: 200%;
  height: 200%;
  background: radial-gradient(circle, rgba(255,255,255,0.1) 0%, transparent 70%);
  animation: rotate 20s linear infinite;
}

@keyframes rotate {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

.achievement-title {
  color: white;
  justify-content: center;
  position: relative;
  z-index: 1;
}

.gashapon-machine {
  background: linear-gradient(135deg, #ff6b6b, #ffa500, #ff6b6b);
  background-size: 200% 200%;
  border-radius: 40rpx;
  padding: 40rpx;
  margin: 30rpx 0;
  position: relative;
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  box-shadow: 0 12rpx 40rpx rgba(255, 107, 107, 0.4);
  animation: gradientShift 3s ease-in-out infinite;
  z-index: 1;
}

.gashapon-machine:active {
  transform: scale(1.05);
  box-shadow: 0 16rpx 48rpx rgba(255, 107, 107, 0.6);
}

.gashapon-title {
  font-size: 32rpx;
  font-weight: bold;
  margin-bottom: 10rpx;
  display: block;
}

.gashapon-desc {
  font-size: 28rpx;
  display: block;
  margin-bottom: 20rpx;
}

.badges-preview {
  display: flex;
  justify-content: center;
  gap: 20rpx;
  margin-top: 20rpx;
}

.badge-slot {
  width: 80rpx;
  height: 80rpx;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.3);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 36rpx;
  transition: all 0.3s ease;
  border: 2rpx solid rgba(255, 255, 255, 0.5);
}

.badge-slot.earned {
  background: rgba(255, 255, 255, 0.9);
  color: #333;
  transform: scale(1.1);
  box-shadow: 0 4rpx 16rpx rgba(255, 255, 255, 0.3);
}

.gashapon-decoration {
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
  height: 20rpx;
  background: linear-gradient(to right, transparent, rgba(0,0,0,0.1));
  border-radius: 0 0 40rpx 40rpx;
  z-index: -1;
}

/* 响应式适配 */
@media screen and (max-width: 400px) {
  .tasks-container {
    padding: 0 20rpx 40rpx;
  }
  
  .task-card {
    padding: 24rpx;
  }
  
  .skills-grid {
    grid-template-columns: repeat(2, 1fr);
    gap: 40rpx;
  }
  
  .top-progress,
  .doudou-section,
  .skills-section,
  .achievements-section {
    margin: 20rpx 20rpx;
  }
}
</style>
