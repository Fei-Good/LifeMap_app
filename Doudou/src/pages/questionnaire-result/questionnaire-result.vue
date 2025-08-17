<template>
  <view class="result-container">
    <!-- 头部区域 -->
    <view class="header-section">
      <view class="doudou-avatar">
        <image 
          :class="['avatar-image', isGeneratingReport ? 'thinking' : 'happy']"
          src="@/static/login/DouDou形象_登录页.png"
          mode="aspectFit"
        />
      </view>
      <view class="greeting-text">
        <text class="greeting-title">
          {{ isGeneratingReport ? 'DouDou正在分析...' : '测试完成！' }}
        </text>
        <text class="greeting-subtitle">
          {{ isGeneratingReport ? '请稍等，正在生成个性化报告' : 'DouDou已经了解你的性格特点' }}
        </text>
      </view>
    </view>

    <!-- 加载状态 -->
    <view v-if="isGeneratingReport" class="loading-card">
      <view class="loading-content">
        <view class="loading-spinner"></view>
        <text class="loading-text">DouDou正在为你生成专属报告...</text>
        <text class="loading-subtitle">请耐心等待，这需要一些时间</text>
      </view>
    </view>

    <!-- 结果卡片 -->
    <view v-else class="result-card">
      <view class="card-header">
        <text class="result-title">{{ userPersonality.title }}</text>
        <text class="result-subtitle">{{ userPersonality.subtitle }}</text>
        
        <!-- 重新生成按钮 -->
        <view v-if="aiReport" class="regenerate-btn" @click="regenerateReport">
          <text class="regenerate-text">🔄 重新分析</text>
        </view>
      </view>
      
      <view class="personality-image-container">
        <image 
          class="personality-image"
          :src="userPersonality.image"
          mode="aspectFit"
        />
      </view>
      
      <view class="personality-description">
        <text class="description-text">{{ userPersonality.description }}</text>
      </view>
      
      <!-- 特征标签 -->
      <view class="traits-section">
        <text class="traits-title">你的性格特征</text>
        <view class="traits-tags">
          <view 
            v-for="trait in userPersonality.traits" 
            :key="trait"
            class="trait-tag"
          >
            <text class="trait-text">{{ trait }}</text>
          </view>
        </view>
      </view>
      
      <!-- AI生成的额外内容 -->
      <template v-if="aiReport">
        <!-- 优势分析 -->
        <view v-if="userPersonality.strengths && userPersonality.strengths.length > 0" class="strengths-section">
          <text class="section-title">你的优势</text>
          <view class="strengths-list">
            <view 
              v-for="strength in userPersonality.strengths" 
              :key="strength"
              class="strength-item"
            >
              <text class="strength-icon">✨</text>
              <text class="strength-text">{{ strength }}</text>
            </view>
          </view>
        </view>
        
        <!-- 发展领域 -->
        <view v-if="userPersonality.developmentAreas && userPersonality.developmentAreas.length > 0" class="development-section">
          <text class="section-title">发展领域</text>
          <view class="development-list">
            <view 
              v-for="area in userPersonality.developmentAreas" 
              :key="area"
              class="development-item"
            >
              <text class="development-icon">🎯</text>
              <text class="development-text">{{ area }}</text>
            </view>
          </view>
        </view>
      </template>
    </view>

    <!-- 建议区域 -->
    <view v-if="!isGeneratingReport" class="suggestions-card">
      <view class="suggestions-header">
        <text class="suggestions-title">DouDou的建议</text>
      </view>
      <view class="suggestions-list">
        <view 
          v-for="(suggestion, index) in userPersonality.suggestions"
          :key="index"
          class="suggestion-item"
        >
          <view class="suggestion-icon">{{ suggestion.icon }}</view>
          <text class="suggestion-text">{{ suggestion.text }}</text>
        </view>
      </view>
    </view>
    
    <!-- AI生成的生活建议 -->
    <view v-if="aiReport && userPersonality.lifeTips && !isGeneratingReport" class="life-tips-card">
      <view class="life-tips-header">
        <text class="life-tips-title">🌱 生活小贴士</text>
      </view>
      <view class="life-tips-content">
        <text class="life-tips-text">{{ userPersonality.lifeTips }}</text>
      </view>
    </view>
    
    <!-- 总结卡片 -->
    <view v-if="aiReport && userPersonality.summary && !isGeneratingReport" class="summary-card">
      <view class="summary-content">
        <text class="summary-text">{{ userPersonality.summary }}</text>
      </view>
    </view>

    <!-- 底部按钮 -->
    <view v-if="!isGeneratingReport" class="action-buttons">
      <button class="btn btn-secondary" @click="retakeTest">重新测试</button>
      <button class="btn btn-primary" @click="startChat">进入地图</button>
    </view>
    
    <!-- 错误提示 -->
    <view v-if="generateError && !isGeneratingReport" class="error-card">
      <view class="error-content">
        <text class="error-title">⚠️ 报告生成失败</text>
        <text class="error-message">{{ generateError }}</text>
        <button class="btn btn-retry" @click="regenerateReport">重试</button>
      </view>
    </view>
  </view>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import userService from '@/utils/userService'
import aiService from '@/utils/aiService'

// 响应式数据
const testResults = ref([])
const aiReport = ref(null)
const isGeneratingReport = ref(false)
const generateError = ref(null)

// 性格类型定义
const personalityTypes = {
  proactive_planner: {
    title: "行动派规划师",
    subtitle: "积极主动 · 有条不紊",
    image: "/static/login/DouDou形象_登录页.png",
    description: "你是一个积极主动、善于规划的人。面对挑战时，你总是能够制定清晰的计划并坚决执行。你相信通过努力和准备可以克服大多数困难。",
    traits: ["目标导向", "执行力强", "善于规划", "积极乐观"],
    suggestions: [
      { icon: "📋", text: "继续保持你的规划能力，但也要学会灵活应变" },
      { icon: "🤝", text: "可以尝试与他人合作，分享你的经验" },
      { icon: "⚡", text: "适当给自己一些放松的时间，避免过度焦虑" }
    ]
  },
  thoughtful_supporter: {
    title: "体贴的支持者",
    subtitle: "深度思考 · 关怀他人",
    image: "/static/login/DouDou形象_登录页.png",
    description: "你是一个善于深度思考、关心他人的人。你喜欢在做决定前仔细考虑，并且总是愿意为朋友提供支持和帮助。",
    traits: ["深度思考", "善解人意", "值得信赖", "稳重可靠"],
    suggestions: [
      { icon: "💭", text: "相信自己的直觉，有时候不需要过度思考" },
      { icon: "🌟", text: "多关注自己的需求，学会照顾自己" },
      { icon: "💪", text: "可以尝试更多新的体验和挑战" }
    ]
  },
  balanced_learner: {
    title: "平衡的学习者",
    subtitle: "灵活适应 · 持续成长",
    image: "/static/login/DouDou形象_登录页.png",
    description: "你是一个善于平衡各个方面、持续学习成长的人。你能够根据不同情况灵活调整自己的应对方式。",
    traits: ["适应性强", "学习能力", "平衡发展", "开放包容"],
    suggestions: [
      { icon: "📚", text: "继续保持学习的热情，探索感兴趣的领域" },
      { icon: "🎯", text: "可以设定一些具体的短期目标" },
      { icon: "🤗", text: "多与不同类型的人交流，拓展视野" }
    ]
  },
  social_harmonizer: {
    title: "社交协调者",
    subtitle: "善于沟通 · 和谐相处",
    image: "/static/login/DouDou形象_登录页.png",
    description: "你是一个擅长社交、追求和谐的人。你善于与他人建立良好关系，并且能够在团队中发挥协调作用。",
    traits: ["沟通能力强", "团队合作", "和谐相处", "情商很高"],
    suggestions: [
      { icon: "👥", text: "继续发挥你的社交优势，建立更多有意义的关系" },
      { icon: "🎨", text: "可以尝试一些创造性的活动" },
      { icon: "🧘", text: "记得给自己一些独处的时间来充电" }
    ]
  }
}

// 计算用户性格类型
const userPersonality = computed(() => {
  // 优先使用AI生成的报告
  if (aiReport.value) {
    return {
      title: aiReport.value.title,
      subtitle: aiReport.value.subtitle,
      image: "@/static/login/DouDou形象_登录页.png",
      description: aiReport.value.description,
      traits: aiReport.value.traits || [],
      suggestions: aiReport.value.suggestions || [],
      strengths: aiReport.value.strengths || [],
      developmentAreas: aiReport.value.developmentAreas || [],
      lifeTips: aiReport.value.lifeTips || '',
      summary: aiReport.value.summary || ''
    }
  }
  
  // 兜底：使用原来的算法
  if (testResults.value.length === 0) {
    return personalityTypes.balanced_learner
  }
  
  // 简单的评分算法
  const scores = {
    proactive: 0,
    thoughtful: 0,
    social: 0,
    balanced: 0
  }
  
  testResults.value.forEach(result => {
    const value = result.selectedValue
    if (['proactive', 'planner', 'action_oriented', 'achievement'].includes(value)) {
      scores.proactive++
    } else if (['thoughtful', 'guidance', 'space'].includes(value)) {
      scores.thoughtful++
    } else if (['social', 'collaborative', 'support', 'harmony'].includes(value)) {
      scores.social++
    } else {
      scores.balanced++
    }
  })
  
  // 确定主要类型
  const maxScore = Math.max(...Object.values(scores))
  if (scores.proactive === maxScore) {
    return personalityTypes.proactive_planner
  } else if (scores.thoughtful === maxScore) {
    return personalityTypes.thoughtful_supporter
  } else if (scores.social === maxScore) {
    return personalityTypes.social_harmonizer
  } else {
    return personalityTypes.balanced_learner
  }
})

// 方法
const retakeTest = () => {
  uni.reLaunch({
    url: '/pages/user-info-collection/user-info-collection'
  })
}

const startChat = () => {
  uni.reLaunch({
    url: '/pages/map/map'
  })
}

// 生成AI报告
const generateAIReport = async () => {
  if (testResults.value.length === 0) {
    console.warn('没有测试结果，无法生成AI报告')
    return
  }
  
  isGeneratingReport.value = true
  generateError.value = null
  
  try {
    const currentUser = userService.getCurrentUser()
    const report = await aiService.generatePersonalityReport(testResults.value, currentUser)
    aiReport.value = report
    
    // 保存AI报告到用户数据
    if (currentUser) {
      await userService.updateUserProfile(currentUser.id, {
        aiReport: report,
        aiReportGeneratedAt: new Date().toISOString()
      })
    }
    
  } catch (error) {
    console.error('生成AI报告失败:', error)
    generateError.value = error.message || '生成报告失败，请重试'
    
    // 显示错误提示
    uni.showToast({
      title: '报告生成失败',
      icon: 'none',
      duration: 2000
    })
  } finally {
    isGeneratingReport.value = false
  }
}

// 重新生成报告
const regenerateReport = () => {
  generateAIReport()
}

onMounted(async () => {
  // 获取用户测试结果
  const currentUser = userService.getCurrentUser()
  if (currentUser && currentUser.questionnaireAnswers) {
    testResults.value = currentUser.questionnaireAnswers
    
    // 检查是否已有AI报告
    if (currentUser.aiReport) {
      aiReport.value = currentUser.aiReport
    } else {
      // 自动生成AI报告
      await generateAIReport()
    }
  }
})
</script>

<style lang="scss" scoped>
.result-container {
  width: 100vw;
  min-height: 100vh;
  background: linear-gradient(180deg, #E8F4FD 0%, #B8E0FF 50%, #A8D8FF 100%);
  padding: 40rpx 30rpx;
  box-sizing: border-box;
}

/* 头部区域 */
.header-section {
  display: flex;
  align-items: center;
  margin-bottom: 40rpx;
  background: rgba(255, 255, 255, 0.8);
  border-radius: 25rpx;
  padding: 30rpx;
  backdrop-filter: blur(10rpx);
}

.doudou-avatar {
  width: 120rpx;
  height: 120rpx;
  border-radius: 50%;
  background: rgba(255, 193, 7, 0.2);
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 30rpx;
}

.avatar-image {
  width: 80rpx;
  height: 80rpx;
  
  &.happy {
    animation: bounce 2s ease-in-out infinite;
  }
  
  &.thinking {
    animation: thinking 1.5s ease-in-out infinite;
  }
}

@keyframes bounce {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-8rpx); }
}

@keyframes thinking {
  0% { transform: rotate(0deg); }
  25% { transform: rotate(-5deg); }
  50% { transform: rotate(0deg); }
  75% { transform: rotate(5deg); }
  100% { transform: rotate(0deg); }
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.greeting-text {
  flex: 1;
  display: flex;
  flex-direction: column;
}

.greeting-title {
  font-size: 36rpx;
  font-weight: 700;
  color: #333;
  margin-bottom: 8rpx;
}

.greeting-subtitle {
  font-size: 26rpx;
  color: #666;
}

/* 结果卡片 */
.result-card {
  background: rgba(255, 255, 255, 0.9);
  border-radius: 30rpx;
  padding: 40rpx;
  margin-bottom: 30rpx;
  box-shadow: 0 10rpx 30rpx rgba(0, 0, 0, 0.1);
  backdrop-filter: blur(10rpx);
}

.card-header {
  text-align: center;
  margin-bottom: 30rpx;
  position: relative;
}

.result-title {
  font-size: 42rpx;
  font-weight: 700;
  color: #333;
  display: block;
  margin-bottom: 12rpx;
}

.result-subtitle {
  font-size: 28rpx;
  color: #666;
  display: block;
}

.regenerate-btn {
  position: absolute;
  top: 0;
  right: 0;
  background: rgba(255, 193, 7, 0.1);
  border-radius: 15rpx;
  padding: 8rpx 16rpx;
  cursor: pointer;
  transition: all 0.3s ease;
  
  &:active {
    transform: scale(0.95);
    background: rgba(255, 193, 7, 0.2);
  }
}

.regenerate-text {
  font-size: 24rpx;
  color: #FF9800;
  font-weight: 500;
}

.personality-image-container {
  display: flex;
  justify-content: center;
  margin: 30rpx 0;
}

.personality-image {
  width: 200rpx;
  height: 200rpx;
  border-radius: 50%;
  box-shadow: 0 8rpx 25rpx rgba(255, 193, 7, 0.3);
}

.personality-description {
  margin-bottom: 40rpx;
}

.description-text {
  font-size: 30rpx;
  line-height: 1.6;
  color: #555;
  text-align: justify;
}

/* 特征标签 */
.traits-section {
  margin-top: 30rpx;
}

.traits-title {
  font-size: 32rpx;
  font-weight: 600;
  color: #333;
  display: block;
  margin-bottom: 20rpx;
}

.traits-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 15rpx;
}

.trait-tag {
  background: linear-gradient(45deg, #FFC107, #FF9800);
  border-radius: 20rpx;
  padding: 12rpx 24rpx;
}

.trait-text {
  font-size: 26rpx;
  color: #fff;
  font-weight: 500;
}

/* 加载状态 */
.loading-card {
  background: rgba(255, 255, 255, 0.9);
  border-radius: 30rpx;
  padding: 80rpx 40rpx;
  margin-bottom: 30rpx;
  box-shadow: 0 10rpx 30rpx rgba(0, 0, 0, 0.1);
  backdrop-filter: blur(10rpx);
  text-align: center;
}

.loading-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 30rpx;
}

.loading-spinner {
  width: 60rpx;
  height: 60rpx;
  border: 6rpx solid rgba(255, 193, 7, 0.2);
  border-top: 6rpx solid #FFC107;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

.loading-text {
  font-size: 32rpx;
  font-weight: 600;
  color: #333;
}

.loading-subtitle {
  font-size: 26rpx;
  color: #666;
}

/* 优势分析 */
.strengths-section {
  margin-top: 40rpx;
  padding-top: 30rpx;
  border-top: 2rpx solid rgba(255, 193, 7, 0.2);
}

.section-title {
  font-size: 32rpx;
  font-weight: 600;
  color: #333;
  display: block;
  margin-bottom: 20rpx;
}

.strengths-list {
  display: flex;
  flex-direction: column;
  gap: 15rpx;
}

.strength-item {
  display: flex;
  align-items: center;
  gap: 15rpx;
  padding: 15rpx 20rpx;
  background: rgba(76, 175, 80, 0.1);
  border-radius: 15rpx;
  border-left: 4rpx solid #4CAF50;
}

.strength-icon {
  font-size: 28rpx;
}

.strength-text {
  flex: 1;
  font-size: 28rpx;
  color: #4CAF50;
  font-weight: 500;
}

/* 发展领域 */
.development-section {
  margin-top: 30rpx;
}

.development-list {
  display: flex;
  flex-direction: column;
  gap: 15rpx;
}

.development-item {
  display: flex;
  align-items: center;
  gap: 15rpx;
  padding: 15rpx 20rpx;
  background: rgba(33, 150, 243, 0.1);
  border-radius: 15rpx;
  border-left: 4rpx solid #2196F3;
}

.development-icon {
  font-size: 28rpx;
}

.development-text {
  flex: 1;
  font-size: 28rpx;
  color: #2196F3;
  font-weight: 500;
}

/* 生活小贴士 */
.life-tips-card {
  background: linear-gradient(135deg, rgba(76, 175, 80, 0.1), rgba(139, 195, 74, 0.1));
  border-radius: 25rpx;
  padding: 35rpx;
  margin-bottom: 25rpx;
  border: 2rpx solid rgba(76, 175, 80, 0.3);
}

.life-tips-header {
  margin-bottom: 20rpx;
}

.life-tips-title {
  font-size: 30rpx;
  font-weight: 600;
  color: #4CAF50;
}

.life-tips-content {
  display: flex;
  flex-direction: column;
}

.life-tips-text {
  font-size: 28rpx;
  line-height: 1.6;
  color: #555;
  text-align: justify;
}

/* 总结卡片 */
.summary-card {
  background: linear-gradient(135deg, rgba(255, 193, 7, 0.1), rgba(255, 152, 0, 0.1));
  border-radius: 25rpx;
  padding: 35rpx;
  margin-bottom: 25rpx;
  text-align: center;
  border: 2rpx solid rgba(255, 193, 7, 0.3);
}

.summary-content {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.summary-text {
  font-size: 30rpx;
  line-height: 1.5;
  color: #FF9800;
  font-weight: 600;
  font-style: italic;
}

/* 错误提示 */
.error-card {
  background: rgba(255, 235, 238, 0.9);
  border-radius: 25rpx;
  padding: 35rpx;
  margin-bottom: 25rpx;
  border: 2rpx solid rgba(244, 67, 54, 0.3);
}

.error-content {
  text-align: center;
  display: flex;
  flex-direction: column;
  gap: 20rpx;
  align-items: center;
}

.error-title {
  font-size: 30rpx;
  font-weight: 600;
  color: #F44336;
}

.error-message {
  font-size: 26rpx;
  color: #D32F2F;
  line-height: 1.4;
}

.btn-retry {
  background: linear-gradient(45deg, #F44336, #D32F2F);
  color: #fff;
  border: none;
  border-radius: 20rpx;
  padding: 15rpx 40rpx;
  font-size: 26rpx;
  font-weight: 600;
  box-shadow: 0 6rpx 20rpx rgba(244, 67, 54, 0.3);
  transition: all 0.3s ease;
  
  &:active {
    transform: translateY(2rpx);
    box-shadow: 0 3rpx 12rpx rgba(244, 67, 54, 0.3);
  }
}

/* 建议区域 */
.suggestions-card {
  background: rgba(255, 255, 255, 0.9);
  border-radius: 30rpx;
  padding: 40rpx;
  margin-bottom: 40rpx;
  box-shadow: 0 10rpx 30rpx rgba(0, 0, 0, 0.1);
  backdrop-filter: blur(10rpx);
}

.suggestions-header {
  margin-bottom: 30rpx;
}

.suggestions-title {
  font-size: 36rpx;
  font-weight: 600;
  color: #333;
}

.suggestions-list {
  display: flex;
  flex-direction: column;
  gap: 25rpx;
}

.suggestion-item {
  display: flex;
  align-items: flex-start;
  gap: 20rpx;
}

.suggestion-icon {
  font-size: 36rpx;
  margin-top: 2rpx;
}

.suggestion-text {
  flex: 1;
  font-size: 28rpx;
  line-height: 1.5;
  color: #555;
}

/* 底部按钮 */
.action-buttons {
  display: flex;
  gap: 20rpx;
  margin-top: 20rpx;
}

.btn {
  flex: 1;
  height: 90rpx;
  border: none;
  border-radius: 45rpx;
  font-size: 30rpx;
  font-weight: 600;
  transition: all 0.3s ease;
  
  &:active {
    transform: translateY(2rpx);
  }
}

.btn-secondary {
  background: rgba(255, 255, 255, 0.9);
  color: #666;
  border: 2rpx solid #ddd;
  
  &:active {
    background: rgba(240, 240, 240, 0.9);
  }
}

.btn-primary {
  background: linear-gradient(45deg, #FFC107, #FF9800);
  color: #fff;
  box-shadow: 0 8rpx 25rpx rgba(255, 193, 7, 0.4);
  
  &:active {
    box-shadow: 0 4rpx 15rpx rgba(255, 193, 7, 0.4);
  }
}

/* 响应式适配 */
@media screen and (max-width: 375px) {
  .result-container {
    padding: 30rpx 20rpx;
  }
  
  .header-section {
    padding: 25rpx;
  }
  
  .doudou-avatar {
    width: 100rpx;
    height: 100rpx;
    margin-right: 20rpx;
  }
  
  .avatar-image {
    width: 70rpx;
    height: 70rpx;
  }
  
  .greeting-title {
    font-size: 32rpx;
  }
  
  .greeting-subtitle {
    font-size: 24rpx;
  }
  
  .result-card,
  .suggestions-card {
    padding: 30rpx;
  }
  
  .result-title {
    font-size: 38rpx;
  }
  
  .result-subtitle {
    font-size: 26rpx;
  }
  
  .personality-image {
    width: 160rpx;
    height: 160rpx;
  }
  
  .description-text {
    font-size: 28rpx;
  }
  
  .traits-title,
  .suggestions-title {
    font-size: 30rpx;
  }
  
  .trait-text {
    font-size: 24rpx;
  }
  
  .suggestion-text {
    font-size: 26rpx;
  }
  
  .btn {
    height: 80rpx;
    font-size: 28rpx;
  }
  
  .loading-card {
    padding: 60rpx 30rpx;
  }
  
  .loading-spinner {
    width: 50rpx;
    height: 50rpx;
    border: 5rpx solid rgba(255, 193, 7, 0.2);
    border-top: 5rpx solid #FFC107;
  }
  
  .loading-text {
    font-size: 28rpx;
  }
  
  .loading-subtitle {
    font-size: 24rpx;
  }
  
  .section-title {
    font-size: 28rpx;
  }
  
  .strength-text,
  .development-text {
    font-size: 26rpx;
  }
  
  .life-tips-title {
    font-size: 28rpx;
  }
  
  .life-tips-text {
    font-size: 26rpx;
  }
  
  .summary-text {
    font-size: 28rpx;
  }
  
  .error-title {
    font-size: 28rpx;
  }
  
  .error-message {
    font-size: 24rpx;
  }
  
  .regenerate-text {
    font-size: 22rpx;
  }
}
</style>
