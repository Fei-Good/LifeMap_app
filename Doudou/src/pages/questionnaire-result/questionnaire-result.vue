<template>
  <view class="questionnaire-result-container">
    <!-- 顶部感谢区域 -->
    <view class="header-section">
      <view class="thank-you-header">
        <image 
          class="doudou-character"
          src="@/static/login/DouDou_主形象.png"
          mode="aspectFit"
        />
        <text class="thank-title">感谢你帮助DouDou</text>
        <text class="thank-subtitle">其实DouDou和你一样，都在成长的路上</text>
      </view>
    </view>

    <!-- AI报告内容区域 -->
    <view class="report-content">
      <!-- 加载状态 -->
      <view v-if="isGenerating" class="loading-section">
        <view class="loading-animation">
          <image 
            class="loading-gif"
            src="@/static/QA/火苗.png"
            mode="aspectFit"
          />
          <text class="loading-text">DouDou正在为你生成专属报告...</text>
        </view>
      </view>

      <!-- 报告内容 -->
      <view v-else class="report-sections">
        <!-- 第一部分：你并不孤单 -->
        <view class="report-section emotion-comfort" v-if="reportData.emotionalSupport">
          <view class="section-header">
            <text class="section-icon">⭐</text>
            <text class="section-title">你并不孤单</text>
          </view>
          <view class="section-content">
            <text class="comfort-text">{{ displayText.emotionalSupport }}</text>
            <image 
              class="doudou-corner"
              src="@/static/DouDou比心.png"
              mode="aspectFit"
            />
          </view>
        </view>

        <!-- 第二部分：当前的困扰 -->
        <view class="report-section user-concerns" v-if="reportData.userConcerns">
          <view class="section-header">
            <text class="section-icon">🤔</text>
            <text class="section-title">当前的困扰</text>
          </view>
          <view class="section-content">
            <view class="concerns-list">
              <view class="concern-item">
                <view class="bullet-point"></view>
                <text class="concern-text">工作压力大，难以平衡生活</text>
              </view>
              <view class="concern-item">
                <view class="bullet-point"></view>
                <text class="concern-text">对未来方向感到迷茫</text>
              </view>
              <view class="concern-item">
                <view class="bullet-point"></view>
                <text class="concern-text">缺乏持续的学习动力</text>
              </view>
            </view>
          </view>
        </view>

        <!-- 第三部分：你的理想人生 -->
        <view class="report-section personal-goals" v-if="reportData.personalGoals">
          <view class="ideal-life-label">
            <text class="label-text">你的理想人生</text>
          </view>
          <view class="section-content">
            <view class="goals-display">
              <text class="goals-text">{{ displayText.personalGoals }}</text>
              <button class="edit-icon" @click="toggleEditMode">✏️</button>
            </view>
            <view v-if="isEditingGoals" class="goals-edit">
              <textarea 
                class="goals-textarea"
                v-model="editableGoals"
                placeholder="编辑你的理想人生..."
                maxlength="500"
                show-count
              />
            </view>
          </view>
        </view>

        <!-- 第四部分：目标分类和行动建议 -->
        <view class="report-section action-suggestions" v-if="reportData.actionSuggestions && reportData.actionSuggestions.length > 0">
          <view class="section-header">
            <image 
              class="doudou-goals"
              src="@/static/DouDou比心.png"
              mode="aspectFit"
            />
            <view class="goals-title">
              <text class="title-main">为了迈向你的理想人生</text>
              <text class="title-underline">你需要完成以下目标</text>
            </view>
          </view>
          
          <!-- 目标分类 -->
          <view class="goals-categories">
            <view class="category-item">
              <view class="hexagon pink">
                <text class="hexagon-icon">📚</text>
              </view>
              <text class="category-label">硬技能类</text>
            </view>
            <view class="category-item">
              <view class="hexagon blue">
                <text class="hexagon-icon">😊</text>
              </view>
              <text class="category-label">情绪管理类</text>
            </view>
            <view class="category-item">
              <view class="hexagon green">
                <text class="hexagon-icon">⏰</text>
              </view>
              <text class="category-label">软技能类</text>
            </view>
          </view>

          <!-- 具体目标列表 -->
          <view class="goals-list">
            <view 
              v-for="(suggestion, index) in reportData.actionSuggestions" 
              :key="index"
              class="goal-item"
            >
              <view class="goal-hexagon" :class="getHexagonClass(suggestion.type)">
                <text class="goal-hexagon-text">{{ getSuggestionTypeText(suggestion.type) }}</text>
              </view>
              <text class="goal-text">{{ suggestion.content }}</text>
            </view>
          </view>

          <!-- 添加自定义目标 -->
          <view class="add-custom-goal">
            <text class="add-icon">+</text>
            <text class="add-text">添加自定义目标</text>
          </view>
        </view>
      </view>
    </view>

    <!-- 底部按钮 -->
    <view class="bottom-action" v-if="!isGenerating">
      <view class="report-source" v-if="reportData.source">
        <text class="source-text">
          {{ getSourceText(reportData.source) }}
        </text>
      </view>
      <button class="action-button" @click="startJourney">
        <text class="rocket-icon">🚀</text>
        <text class="button-text">DouDou陪你行动起来</text>
      </button>
    </view>
  </view>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import aiService from '@/utils/aiService'
import apiService from '@/utils/apiService'

// 响应式数据
const isGenerating = ref(true)
const isEditingGoals = ref(false)
const reportData = ref({})
const editableGoals = ref('')
const displayText = ref({
  emotionalSupport: '',
  userConcerns: '',
  personalGoals: ''
})

// 流式显示相关
const streamingInterval = ref(null)
const currentSection = ref('')
const currentText = ref('')
const targetText = ref('')

// 获取建议类型的CSS类名
const getSuggestionClass = (type) => {
  switch(type) {
    case 'hard_skill': return 'hard-skill'
    case 'soft_skill': return 'soft-skill'
    case 'emotion_management': return 'emotion-management'
    default: return 'hard-skill'
  }
}

// 获取六边形的CSS类名
const getHexagonClass = (type) => {
  switch(type) {
    case 'hard_skill': return 'hexagon-green'
    case 'soft_skill': return 'hexagon-pink'
    case 'emotion_management': return 'hexagon-blue'
    default: return 'hexagon-green'
  }
}

// 获取建议类型文本
const getSuggestionTypeText = (type) => {
  switch(type) {
    case 'hard_skill': return '硬技能'
    case 'soft_skill': return '软技能'
    case 'emotion_management': return '情绪管理'
    default: return '硬技能'
  }
}

// 流式显示文本
const streamText = (section, text, speed = 50) => {
  return new Promise((resolve) => {
    let index = 0
    const interval = setInterval(() => {
      if (index < text.length) {
        displayText.value[section] = text.substring(0, index + 1)
        index++
      } else {
        clearInterval(interval)
        resolve()
      }
    }, speed)
  })
}

// 切换编辑模式
const toggleEditMode = () => {
  if (isEditingGoals.value) {
    // 保存编辑内容
    reportData.value.personalGoals = editableGoals.value
    displayText.value.personalGoals = editableGoals.value
    
    // 可以在这里调用API保存到后端
    saveGoalsToServer(editableGoals.value)
  } else {
    // 进入编辑模式
    editableGoals.value = reportData.value.personalGoals || ''
  }
  isEditingGoals.value = !isEditingGoals.value
}

// 保存目标到服务器
const saveGoalsToServer = async (goals) => {
  try {
    await apiService.updatePersonalGoals({ goals })
    uni.showToast({
      title: '目标已保存',
      icon: 'success'
    })
  } catch (error) {
    console.error('保存目标失败:', error)
    uni.showToast({
      title: '保存失败，请重试',
      icon: 'none'
    })
  }
}

// 获取来源文本
const getSourceText = (source) => {
  switch(source) {
    case 'backend_api':
      return '✨ 由后端AI智能分析生成'
    case 'backend_api_converted':
      return '✨ 由后端AI智能分析并转换生成'
    case 'ai_generated':
      return '🤖 由AI大模型直接生成'
    case 'ai_converted':
      return '🤖 由AI大模型分析转换生成'
    case 'default':
      return '💝 DouDou用心为你准备'
    default:
      return '💝 DouDou专属定制'
  }
}

// 开始行动
const startJourney = () => {
  uni.showToast({
    title: 'DouDou陪你一起加油！',
    icon: 'success',
    duration: 2000
  })
  
  setTimeout(() => {
    uni.navigateTo({
      url: '/pages/chat/chat'
    })
  }, 2000)
}

// 生成AI报告
const generateAIReport = async () => {
  try {
    // 获取用户问卷答案
    const rawAnswers = uni.getStorageSync('questionnaire_answers') || []
    const userInfo = uni.getStorageSync('user_info') || {}
    
    // 过滤掉 null 值和无效答案，确保每个答案都是有效的对象
    const questionnaireAnswers = rawAnswers.filter(answer => {
      return answer && 
             typeof answer === 'object' && 
             answer.questionId && 
             answer.question &&
             answer.type &&
             (answer.type === 'subjective' ? answer.answer : answer.selectedValue)
    })
    
    console.log('原始答案数据:', rawAnswers)
    console.log('过滤后的答案数据:', questionnaireAnswers)
    
    if (questionnaireAnswers.length === 0) {
      throw new Error('未找到有效的问卷答案')
    }
    
    console.log('开始生成AI报告，问卷答案:', questionnaireAnswers)
    
    // 调用AI服务生成报告（优先使用后端API）
    const report = await aiService.generatePersonalityReport(questionnaireAnswers, userInfo)
    
    console.log('AI报告生成成功:', report)
    
    // 如果AI服务返回了完整的报告数据，直接使用
    if (report && (report.emotionalSupport || report.userConcerns || report.personalGoals)) {
      reportData.value = {
        emotionalSupport: report.emotionalSupport || generateEmotionalSupport(questionnaireAnswers),
        userConcerns: report.userConcerns || extractUserConcerns(questionnaireAnswers),
        personalGoals: report.personalGoals || generatePersonalGoals(questionnaireAnswers),
        actionSuggestions: report.actionSuggestions || generateActionSuggestions(questionnaireAnswers),
        source: report.source || 'ai_generated'
      }
    } else {
      // 如果AI服务返回的是标准格式报告，转换为本地格式
      reportData.value = {
        emotionalSupport: generateEmotionalSupport(questionnaireAnswers, report),
        userConcerns: extractUserConcerns(questionnaireAnswers, report),
        personalGoals: generatePersonalGoals(questionnaireAnswers, report),
        actionSuggestions: generateActionSuggestions(questionnaireAnswers, report),
        source: 'ai_converted'
      }
    }
    
    // 流式显示报告内容
    await displayReportWithStreaming()
    
  } catch (error) {
    console.error('生成AI报告失败:', error)
    
    // 显示错误提示
    uni.showToast({
      title: '报告生成失败，使用默认内容',
      icon: 'none',
      duration: 2000
    })
    
    // 使用默认报告
    reportData.value = {
      emotionalSupport: "全球有73%的人正在经历与你类似的情绪波动和成长困惑，DouDou陪伴你一起成长。",
      userConcerns: "通过你的回答，DouDou感受到你最近可能在工作适应和人际关系方面有些困扰，同时也看到了你积极向上的态度。",
      personalGoals: "成为一个平衡工作与生活，持续成长的快乐人生。",
      actionSuggestions: [
        { type: 'hard_skill', content: '制定每周30分钟的冥想计划' },
        { type: 'soft_skill', content: '制定每周30分钟的冥想计划' },
        { type: 'emotion_management', content: '制定每周30分钟的冥想计划' }
      ],
      source: 'default'
    }
    
    await displayReportWithStreaming()
  }
}

// 生成情绪安慰内容
const generateEmotionalSupport = (answers, aiReport = null) => {
  const percentage = Math.floor(Math.random() * 20) + 65 // 65-85%之间
  
  // 如果有AI报告，尝试从中提取信息
  if (aiReport && aiReport.title) {
    return `全球有${percentage}%的人正在经历与你类似的情绪波动和成长困惑，DouDou陪伴你一起成长。${aiReport.description ? aiReport.description.substring(0, 80) + '...' : 'DouDou理解你的感受，每一份情绪都值得被温柔对待。'}让我们一起找到属于你的成长之路！ ❤️`
  }
  
  const emotionAnswers = answers.filter(a => a.selectedValue === 'emotion').length
  return `全球有${percentage}%的人正在经历与你类似的情绪波动和成长困惑，DouDou陪伴你一起成长。DouDou理解你的感受，每一份情绪都值得被温柔对待。让我们一起找到属于你的成长之路！ ❤️`
}

// 提取用户关心的事情
const extractUserConcerns = (answers, aiReport = null) => {
  // 如果有AI报告，优先使用AI分析的特质信息
  if (aiReport && aiReport.traits && aiReport.traits.length > 0) {
    return `通过分析，DouDou发现你是一个${aiReport.traits.slice(0, 3).join('、')}的人。这些特质让你在人生路上有着独特的优势和思考方式。`
  }
  
  const subjectiveAnswer = answers.find(a => a.type === 'subjective')
  
  if (subjectiveAnswer && subjectiveAnswer.answer) {
    return `通过你的分享："${subjectiveAnswer.answer.substring(0, 50)}${subjectiveAnswer.answer.length > 50 ? '...' : ''}"，DouDou能感受到你内心的想法。这些都是成长路上的重要思考。`
  }
  
  return "通过你的回答，DouDou感受到你是一个有想法、有目标的人。每个人都有自己的节奏，相信你会找到属于自己的答案。"
}

// 生成个人目标
const generatePersonalGoals = (answers, aiReport = null) => {
  // 如果有AI报告，优先使用AI建议的生活建议或总结
  if (aiReport && aiReport.lifeTips) {
    return aiReport.lifeTips
  }
  
  if (aiReport && aiReport.summary) {
    return aiReport.summary
  }
  
  const dominantType = getDominantPersonalityType(answers)
  
  switch(dominantType) {
    case 'proactive':
      return "成为一个平衡工作与生活，持续成长的快乐人生。"
    case 'thoughtful':
      return "成为一个平衡工作与生活，持续成长的快乐人生。"
    case 'social':
      return "成为一个平衡工作与生活，持续成长的快乐人生。"
    case 'emotion':
      return "成为一个平衡工作与生活，持续成长的快乐人生。"
    default:
      return "成为一个平衡工作与生活，持续成长的快乐人生。"
  }
}

// 生成行动建议
const generateActionSuggestions = (answers, aiReport = null) => {
  // 如果有AI报告的建议，转换并使用
  if (aiReport && aiReport.suggestions && aiReport.suggestions.length > 0) {
    const actionTypes = ['hard_skill', 'soft_skill', 'emotion_management']
    
    return aiReport.suggestions.slice(0, 3).map((suggestion, index) => ({
      type: actionTypes[index] || 'hard_skill',
      content: typeof suggestion === 'string' ? suggestion : suggestion.text || suggestion.content || '制定每周30分钟的冥想计划'
    }))
  }
  
  const suggestions = []
  const dominantType = getDominantPersonalityType(answers)
  
  // 根据主导类型生成建议
  switch(dominantType) {
    case 'proactive':
      suggestions.push(
        { type: 'hard_skill', content: '制定每周30分钟的冥想计划' },
        { type: 'soft_skill', content: '制定每周30分钟的冥想计划' },
        { type: 'emotion_management', content: '制定每周30分钟的冥想计划' }
      )
      break
    case 'thoughtful':
      suggestions.push(
        { type: 'hard_skill', content: '制定每周30分钟的冥想计划' },
        { type: 'soft_skill', content: '制定每周30分钟的冥想计划' },
        { type: 'emotion_management', content: '制定每周30分钟的冥想计划' }
      )
      break
    case 'social':
      suggestions.push(
        { type: 'hard_skill', content: '制定每周30分钟的冥想计划' },
        { type: 'soft_skill', content: '制定每周30分钟的冥想计划' },
        { type: 'emotion_management', content: '制定每周30分钟的冥想计划' }
      )
      break
    case 'emotion':
      suggestions.push(
        { type: 'hard_skill', content: '制定每周30分钟的冥想计划' },
        { type: 'soft_skill', content: '制定每周30分钟的冥想计划' },
        { type: 'emotion_management', content: '制定每周30分钟的冥想计划' }
      )
      break
    default:
      suggestions.push(
        { type: 'hard_skill', content: '制定每周30分钟的冥想计划' },
        { type: 'soft_skill', content: '制定每周30分钟的冥想计划' },
        { type: 'emotion_management', content: '制定每周30分钟的冥想计划' }
      )
  }
  
  return suggestions
}

// 获取主导性格类型
const getDominantPersonalityType = (answers) => {
  const typeCount = {
    proactive: 0,
    thoughtful: 0,
    social: 0,
    emotion: 0
  }
  
  answers.forEach(answer => {
    if (answer.selectedValue && typeCount.hasOwnProperty(answer.selectedValue)) {
      typeCount[answer.selectedValue]++
    }
  })
  
  return Object.keys(typeCount).reduce((a, b) => typeCount[a] > typeCount[b] ? a : b)
}

// 流式显示报告
const displayReportWithStreaming = async () => {
  isGenerating.value = false
  
  // 依次流式显示各部分内容
  if (reportData.value.emotionalSupport) {
    await streamText('emotionalSupport', reportData.value.emotionalSupport, 30)
    await new Promise(resolve => setTimeout(resolve, 500))
  }
  
  if (reportData.value.userConcerns) {
    await streamText('userConcerns', reportData.value.userConcerns, 35)
    await new Promise(resolve => setTimeout(resolve, 500))
  }
  
  if (reportData.value.personalGoals) {
    await streamText('personalGoals', reportData.value.personalGoals, 40)
  }
}

onMounted(async () => {
  console.log('问卷结果页面加载')
  
  // 检查是否有问卷答案数据
  const rawAnswers = uni.getStorageSync('questionnaire_answers') || []
  const validAnswers = rawAnswers.filter(answer => {
    return answer && 
           typeof answer === 'object' && 
           answer.questionId && 
           answer.question &&
           answer.type
  })
  
  console.log('原始问卷答案数据:', rawAnswers)
  console.log('有效问卷答案数据:', validAnswers)
  
  // 如果发现有无效数据，清理并重新保存
  if (rawAnswers.length !== validAnswers.length && validAnswers.length > 0) {
    console.log('发现无效数据，正在清理...')
    uni.setStorageSync('questionnaire_answers', validAnswers)
    uni.showToast({
      title: '数据已清理优化',
      icon: 'success',
      duration: 1500
    })
  }
  
  // 模拟生成报告的延迟
  setTimeout(async () => {
    await generateAIReport()
  }, 1000)
})
</script>

<style lang="scss" scoped>
.questionnaire-result-container {
  min-height: 100vh;
  background: linear-gradient(135deg, #FFE0B2 0%, #FFCC80 100%);
  padding-bottom: 120rpx;
}


/* 顶部感谢区域 */
.header-section {
  padding: 120rpx 30rpx 40rpx;
  text-align: center;
}

.thank-you-header {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 30rpx;
}

.doudou-character {
  width: 150rpx;
  height: 150rpx;
  border-radius: 50%;
  background: rgba(255, 193, 7, 0.2);
  padding: 20rpx;
}

.thank-title {
  font-size: 36rpx;
  font-weight: 600;
  color: #2E3A59;
  text-shadow: 0 2rpx 8rpx rgba(255, 255, 255, 0.3);
}

.thank-subtitle {
  font-size: 28rpx;
  color: #666;
  text-shadow: 0 1rpx 4rpx rgba(255, 255, 255, 0.2);
}

/* 加载状态 */
.loading-section {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 100rpx 30rpx;
}

.loading-animation {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 40rpx;
}

.loading-gif {
  width: 100rpx;
  height: 100rpx;
  animation: pulse 1.5s ease-in-out infinite;
}

@keyframes pulse {
  0%, 100% { transform: scale(1); opacity: 0.8; }
  50% { transform: scale(1.1); opacity: 1; }
}

.loading-text {
  font-size: 32rpx;
  color: #2E3A59;
  text-align: center;
  opacity: 0.9;
  font-weight: 500;
}

/* 报告内容区域 */
.report-content {
  padding: 0 30rpx;
}

.report-sections {
  display: flex;
  flex-direction: column;
  gap: 40rpx;
}

.report-section {
  background: rgba(255, 255, 255, 0.95);
  border-radius: 25rpx;
  padding: 40rpx;
  box-shadow: 0 10rpx 40rpx rgba(0, 0, 0, 0.1);
  backdrop-filter: blur(10rpx);
}

.section-header {
  display: flex;
  align-items: center;
  margin-bottom: 30rpx;
  padding-bottom: 20rpx;
  border-bottom: 2rpx solid rgba(255, 149, 0, 0.2);
}

.section-icon {
  font-size: 40rpx;
  margin-right: 15rpx;
  color: #FF9500;
}

.section-title {
  font-size: 38rpx;
  font-weight: 700;
  color: #333;
}

.edit-button {
  background: linear-gradient(45deg, #FF9500, #FF8F00);
  color: #fff;
  border: none;
  border-radius: 20rpx;
  padding: 12rpx 24rpx;
  font-size: 28rpx;
  font-weight: 500;
  transition: all 0.3s ease;
  
  &:active {
    transform: translateY(2rpx);
    box-shadow: 0 4rpx 15rpx rgba(255, 149, 0, 0.3);
  }
}

.section-content {
  line-height: 1.6;
  position: relative;
}

.comfort-text,
.concerns-text,
.goals-text {
  font-size: 32rpx;
  color: #444;
  line-height: 1.8;
}

/* 你并不孤单部分 */
.emotion-comfort {
  background: linear-gradient(135deg, #FFF3E0 0%, #FFE0B2 100%);
}

.doudou-corner {
  position: absolute;
  bottom: -20rpx;
  right: -20rpx;
  width: 80rpx;
  height: 80rpx;
  opacity: 0.8;
}

/* 当前的困扰部分 */
.concerns-list {
  display: flex;
  flex-direction: column;
  gap: 20rpx;
}

.concern-item {
  display: flex;
  align-items: center;
  gap: 20rpx;
}

.bullet-point {
  width: 16rpx;
  height: 16rpx;
  background: #FF9500;
  border-radius: 50%;
  flex-shrink: 0;
}

.concern-text {
  font-size: 30rpx;
  color: #444;
  line-height: 1.5;
}

/* 你的理想人生部分 */
.ideal-life-label {
  text-align: center;
  margin-bottom: 30rpx;
}

.label-text {
  background: linear-gradient(45deg, #FF9500, #FF8F00);
  color: #fff;
  padding: 15rpx 40rpx;
  border-radius: 50rpx;
  font-size: 32rpx;
  font-weight: 600;
  display: inline-block;
}

.goals-display {
  display: flex;
  align-items: flex-start;
  gap: 20rpx;
  position: relative;
}

.edit-icon {
  background: none;
  border: none;
  font-size: 40rpx;
  color: #2196F3;
  padding: 10rpx;
  cursor: pointer;
  flex-shrink: 0;
}

/* 目标编辑 */
.goals-edit {
  margin-top: 20rpx;
}

.goals-textarea {
  width: 100%;
  min-height: 200rpx;
  background: rgba(255, 149, 0, 0.05);
  border: 2rpx solid rgba(255, 149, 0, 0.2);
  border-radius: 15rpx;
  padding: 25rpx;
  font-size: 32rpx;
  color: #333;
  line-height: 1.6;
  box-sizing: border-box;
  
  &:focus {
    border-color: #FF9500;
    box-shadow: 0 0 20rpx rgba(255, 149, 0, 0.2);
  }
}

/* 目标分类和行动建议部分 */
.goals-title {
  display: flex;
  flex-direction: column;
  gap: 10rpx;
}

.title-main {
  font-size: 32rpx;
  font-weight: 600;
  color: #333;
}

.title-underline {
  font-size: 28rpx;
  color: #FF9500;
  text-decoration: underline;
  text-decoration-color: #FF9500;
  text-decoration-thickness: 2rpx;
}

.doudou-goals {
  width: 80rpx;
  height: 80rpx;
  margin-right: 20rpx;
  flex-shrink: 0;
}

/* 目标分类 */
.goals-categories {
  display: flex;
  justify-content: space-around;
  margin: 40rpx 0;
  gap: 20rpx;
}

.category-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 15rpx;
}

.hexagon {
  width: 100rpx;
  height: 100rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: inherit;
    clip-path: polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%);
  }
}

.hexagon-icon {
  font-size: 40rpx;
  position: relative;
  z-index: 1;
}

.hexagon.pink {
  background: linear-gradient(135deg, #E91E63, #C2185B);
}

.hexagon.blue {
  background: linear-gradient(135deg, #2196F3, #1976D2);
}

.hexagon.green {
  background: linear-gradient(135deg, #4CAF50, #45a049);
}

.category-label {
  font-size: 24rpx;
  color: #666;
  text-align: center;
  line-height: 1.3;
}

/* 具体目标列表 */
.goals-list {
  display: flex;
  flex-direction: column;
  gap: 25rpx;
  margin: 30rpx 0;
}

.goal-item {
  display: flex;
  align-items: center;
  gap: 25rpx;
  padding: 25rpx;
  background: rgba(255, 149, 0, 0.05);
  border-radius: 20rpx;
  transition: all 0.3s ease;
  
  &:hover {
    transform: translateY(-2rpx);
    box-shadow: 0 8rpx 25rpx rgba(255, 149, 0, 0.15);
  }
}

.goal-hexagon {
  width: 60rpx;
  height: 60rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  flex-shrink: 0;
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: inherit;
    clip-path: polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%);
  }
}

.goal-hexagon-text {
  font-size: 18rpx;
  font-weight: 600;
  color: #fff;
  position: relative;
  z-index: 1;
}

.goal-text {
  flex: 1;
  font-size: 28rpx;
  color: #444;
  line-height: 1.5;
}

/* 添加自定义目标 */
.add-custom-goal {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 15rpx;
  padding: 25rpx;
  margin-top: 30rpx;
  border: 2rpx dashed #FF9500;
  border-radius: 20rpx;
  background: rgba(255, 149, 0, 0.05);
  transition: all 0.3s ease;
  
  &:active {
    background: rgba(255, 149, 0, 0.1);
    transform: scale(0.98);
  }
}

.add-icon {
  font-size: 32rpx;
  color: #FF9500;
  font-weight: bold;
}

.add-text {
  font-size: 28rpx;
  color: #FF9500;
  font-weight: 500;
}

/* 底部按钮 */
.bottom-action {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  padding: 20rpx 30rpx 30rpx;
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(10rpx);
  box-shadow: 0 -5rpx 20rpx rgba(0, 0, 0, 0.1);
}

.report-source {
  text-align: center;
  margin-bottom: 20rpx;
}

.source-text {
  font-size: 24rpx;
  color: #999;
  opacity: 0.8;
}

.action-button {
  width: 100%;
  height: 100rpx;
  background: linear-gradient(45deg, #FF9500, #FF8F00);
  border: none;
  border-radius: 50rpx;
  font-size: 36rpx;
  font-weight: 600;
  color: #fff;
  box-shadow: 0 8rpx 25rpx rgba(255, 149, 0, 0.4);
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 15rpx;
  
  &:active {
    transform: translateY(2rpx);
    box-shadow: 0 4rpx 15rpx rgba(255, 149, 0, 0.4);
  }
}

.rocket-icon {
  font-size: 40rpx;
}

.button-text {
  font-size: 36rpx;
  font-weight: 600;
}

/* 响应式适配 */
@media screen and (max-width: 375px) {
  .status-bar {
    padding: 15rpx 20rpx;
  }
  
  .header-section {
    padding: 100rpx 20rpx 30rpx;
  }
  
  .thank-title {
    font-size: 32rpx;
  }
  
  .thank-subtitle {
    font-size: 26rpx;
  }
  
  .doudou-character {
    width: 120rpx;
    height: 120rpx;
    padding: 15rpx;
  }
  
  .report-content {
    padding: 0 20rpx;
  }
  
  .report-sections {
    gap: 30rpx;
  }
  
  .report-section {
    padding: 30rpx;
  }
  
  .section-title {
    font-size: 34rpx;
  }
  
  .section-icon {
    font-size: 36rpx;
  }
  
  .comfort-text,
  .concerns-text,
  .goals-text {
    font-size: 30rpx;
  }
  
  .concern-text {
    font-size: 28rpx;
  }
  
  .label-text {
    font-size: 30rpx;
    padding: 12rpx 30rpx;
  }
  
  .title-main {
    font-size: 30rpx;
  }
  
  .title-underline {
    font-size: 26rpx;
  }
  
  .doudou-goals {
    width: 70rpx;
    height: 70rpx;
  }
  
  .goals-categories {
    gap: 15rpx;
    margin: 30rpx 0;
  }
  
  .hexagon {
    width: 80rpx;
    height: 80rpx;
  }
  
  .hexagon-icon {
    font-size: 32rpx;
  }
  
  .category-label {
    font-size: 22rpx;
  }
  
  .goal-item {
    gap: 20rpx;
    padding: 20rpx;
  }
  
  .goal-hexagon {
    width: 50rpx;
    height: 50rpx;
  }
  
  .goal-hexagon-text {
    font-size: 16rpx;
  }
  
  .goal-text {
    font-size: 26rpx;
  }
  
  .add-custom-goal {
    padding: 20rpx;
    margin-top: 25rpx;
  }
  
  .add-icon {
    font-size: 28rpx;
  }
  
  .add-text {
    font-size: 26rpx;
  }
  
  .action-button {
    height: 90rpx;
  }
  
  .rocket-icon {
    font-size: 36rpx;
  }
  
  .button-text {
    font-size: 32rpx;
  }
}

/* 确保六边形样式正确应用 */
.hexagon-green {
  background: linear-gradient(135deg, #4CAF50, #45a049);
}

.hexagon-pink {
  background: linear-gradient(135deg, #E91E63, #C2185B);
}

.hexagon-blue {
  background: linear-gradient(135deg, #2196F3, #1976D2);
}
</style>
