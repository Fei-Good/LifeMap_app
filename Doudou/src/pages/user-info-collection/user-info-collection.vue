<template>
  <view class="questionnaire-container">
    <!-- 顶部进度条和DouDou小图标 -->
    <view class="header-section">
      <view class="doudou-avatar">
        <image 
          class="avatar-image"
          src="@/static/QA/火苗.png"
          mode="aspectFit"
        />
      </view>
      <view class="progress-container">
        <view class="mood-indicator">
          <text class="mood-text">DouDou心情指数</text>
        </view>
        <view class="progress-bar">
          <view 
            class="progress-fill" 
            :style="{ width: progressPercentage + '%' }"
          ></view>
        </view>
      </view>
      <view class="progress-text">{{ currentQuestionIndex + 1 }}/{{ totalQuestions }}</view>
    </view>

    <!-- 主要内容区域 -->
    <view class="main-section">
      <!-- 问题 -->
      <view class="question-container">
        <view class="question-box">
          <view class="question-header">
            <text class="question-label">( ˃̣̣̥o˂̣̣̥ ) 帮帮DouDou( ˃̣̣̥o˂̣̣̥ ) </text>
          </view>
          <view class="question-content">
            <text class="question-text">{{ currentQuestion.question }}</text>
          </view>
        </view>
      </view>

      <!-- 情景图片 -->
      <view class="scenario-image-container">
        <image 
          class="scenario-image"
          :src="currentQuestion.image"
          mode="aspectFit"
        />
      </view>

      <!-- 选项区域 -->
      <view class="options-container">
        <!-- 客观题选项 -->
        <view v-if="currentQuestion.type !== 'subjective'" class="options-grid">
          <view 
            v-for="(option, index) in currentQuestion.options" 
            :key="index"
            class="option-button"
            :class="{ 'selected': selectedOption === index }"
            @click="selectOption(index)"
          >
            <text class="option-text">{{ option.label }}</text>
          </view>
        </view>
        
        <!-- 主观题输入框 -->
        <view v-else class="subjective-input-container">
          <textarea 
            class="subjective-textarea"
            v-model="subjectiveAnswer"
            :placeholder="currentQuestion.placeholder"
            :maxlength="500"
            show-count
            auto-height
          />
        </view>
      </view>

      <!-- 下一步按钮 -->
      <view class="next-button-container">
        <button 
          class="next-button"
          :class="{ 'disabled': isNextButtonDisabled }"
          :disabled="isNextButtonDisabled"
          @click="nextQuestion"
        >
          {{ currentQuestionIndex === totalQuestions - 1 ? 'DouDou说：“我一直在”' : '下一步' }}
        </button>
      </view>
    </view>
  </view>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import userService from '@/utils/userService'
import apiService from '@/utils/apiService'

// 响应式数据
const currentQuestionIndex = ref(0)
const selectedOption = ref(-1)
const subjectiveAnswer = ref('')
const userAnswers = ref([])

// 问卷数据
const questionsData = ref([
  {
    id: 1,//新人Landing期
    question: "第一天入职，工位还没捂热，同事们都埋头工作没人理他， 怎么办 ？ (´•̥ ̯ •̥`) ",
    image: "/static/QA/1_matting.gif",
    options: [
      { label: "A. 假装淡定", value: "emotion", description: "暂时回避，缓解压力" },
      { label: "B. 和邻座同事搭话", value: "social", description: "和朋友聊聊，分享心情" },
      { label: "C. 研究公司文档", value: "thoughtful", description: "独自思考，慢慢解决" },
      { label: "D. 主动询问导师", value: "proactive", description: "积极面对，寻求帮助" }
    ]
  },
  {
    id: 2,//团队融入挑战
    question: "同事阴阳怪气DouDou：\"连这都不会？\" (╯▔皿▔)╯",
    image: "/static/QA/2_matting.gif",
    options: [
      { label: "A. 敲木鱼，莫生气", value: "emotion" },
      { label: "B. \"您教我就会了\"", value: "social"},
      { label: "C. 虚心请教", value: "proactive"},
      { label: "D. 立马查阅学习", value: "thoughtful"}
    ]
  },
  {
    id: 3,
    question: "DouDou发现自己KPI目标过高,怎么办？(＞﹏＜)",
    image: "/static/QA/3_matting.gif",
    options: [
      { label: "A. 调整目标", value: "thoughtful" },
      { label: "B. 找同事合作", value: "social" },
      { label: "C. 向上反馈", value: "social"},
      { label: "D. 拆解目标完成", value: "proactive" }
    ]
  },
  {
    id: 4,
    question: "DouDou又感到迷茫了，你会怎么帮它？ (◞‸◟；)",
    image: "/static/QA/4_matting.gif",
    options: [
      { label: "A. 陪它聊一聊", value: "social", },
      { label: "B. 梳理现状", value: "thoughtful" },
      { label: "C. 帮它调整心态", value: "emotion", },
      { label: "D. 专注当下", value: "proactive" }
    ]
  },
  {
    id: 5,
    question: "如果DouDou能陪在你身边，你希望它在哪些方面帮助你？",
    image: "/static/QA/5_matting.gif",
    options: [
      { label: "A. 情绪支持与陪伴", value: "emotion", },
      { label: "B. 目标与职业规划", value: "thoughtful" },
      { label: "C. 技能提升与学习", value: "thoughtful" },
      { label: "D. 专注与行动", value: "proactive"}
    ]
  },
  {
    id: 6,
    question: "最近还好吗？有什么想和我说说的？或者最近有什么想完成但还没有完成的？(つ´ω`)つ",
    image: "/static/QA/6_matting.gif",
    type: "subjective",
    placeholder: "在这里写下你想说的话..."
  }
])

// 计算属性
const totalQuestions = computed(() => questionsData.value.length)

const progressPercentage = computed(() => {
  return ((currentQuestionIndex.value + 1) / totalQuestions.value) * 100
})

const currentQuestion = computed(() => {
  return questionsData.value[currentQuestionIndex.value] || {}
})

const isNextButtonDisabled = computed(() => {
  if (currentQuestion.value.type === 'subjective') {
    return subjectiveAnswer.value.trim() === ''
  } else {
    return selectedOption.value === -1
  }
})

// 方法
const selectOption = (optionIndex) => {
  selectedOption.value = optionIndex
  
  // 添加点击反馈
  uni.vibrateShort({
    type: 'light'
  })
}

const nextQuestion = () => {
  // 检查是否有答案
  if (currentQuestion.value.type === 'subjective') {
    if (subjectiveAnswer.value.trim() === '') return
  } else {
    if (selectedOption.value === -1) return
  }
  
  // 保存当前答案
  let answer
  if (currentQuestion.value.type === 'subjective') {
    // 主观题答案
    answer = {
      questionId: currentQuestion.value.id,
      question: currentQuestion.value.question,
      type: 'subjective',
      answer: subjectiveAnswer.value.trim(),
      timestamp: new Date().toISOString()
    }
  } else {
    // 客观题答案
    answer = {
      questionId: currentQuestion.value.id,
      question: currentQuestion.value.question,
      type: 'objective',
      selectedOption: selectedOption.value,
      selectedValue: currentQuestion.value.options[selectedOption.value].value,
      selectedLabel: currentQuestion.value.options[selectedOption.value].label,
      timestamp: new Date().toISOString()
    }
  }
  
  // 验证答案对象的完整性
  if (answer && typeof answer === 'object' && answer.questionId && answer.question && answer.type) {
    userAnswers.value.push(answer)
  } else {
    console.error('无效的答案对象:', answer)
    uni.showToast({
      title: '答案保存失败，请重试',
      icon: 'none'
    })
    return
  }
  
  // 检查是否是最后一题
  if (currentQuestionIndex.value === totalQuestions.value - 1) {
    completeQuestionnaire()
  } else {
    // 进入下一题
    currentQuestionIndex.value++
    selectedOption.value = -1
    subjectiveAnswer.value = ''
  }
}

const completeQuestionnaire = async () => {
  try {
    uni.showLoading({
      title: 'DouDou正在生成专属报告...',
      mask: true
    })
    
    // 过滤并保存问卷答案到本地存储
    const validAnswers = userAnswers.value.filter(answer => {
      return answer && 
             typeof answer === 'object' && 
             answer.questionId && 
             answer.question &&
             answer.type &&
             (answer.type === 'subjective' ? answer.answer : answer.selectedValue)
    })
    
    console.log('准备保存的答案数据:', validAnswers)
    uni.setStorageSync('questionnaire_answers', validAnswers)
    
    // 标记用户完成信息收集
    await userService.markUserInfoCompleted()
    
    uni.hideLoading()
    
    // 显示成功消息
    uni.showToast({
      title: '问卷完成，正在生成报告！',
      icon: 'success',
      duration: 2000
    })
    
    // 延时跳转到问卷结果页面
    setTimeout(() => {
      uni.redirectTo({
        url: '/pages/questionnaire-result/questionnaire-result'
      })
    }, 2000)
    
  } catch (error) {
    uni.hideLoading()
    
    console.error('提交问卷失败:', error)
    
    // 如果出现错误，仍然保存答案并跳转
    try {
      // 过滤有效答案后再保存
      const validAnswers = userAnswers.value.filter(answer => {
        return answer && 
               typeof answer === 'object' && 
               answer.questionId && 
               answer.question &&
               answer.type &&
               (answer.type === 'subjective' ? answer.answer : answer.selectedValue)
      })
      
      console.log('错误处理中保存的答案数据:', validAnswers)
      uni.setStorageSync('questionnaire_answers', validAnswers)
      await userService.markUserInfoCompleted()
      
      uni.showToast({
        title: '问卷已保存，正在生成报告...',
        icon: 'none',
        duration: 2000
      })
      
      // 跳转到问卷结果页面
      setTimeout(() => {
        uni.redirectTo({
          url: '/pages/questionnaire-result/questionnaire-result'
        })
      }, 2000)
      
    } catch (updateError) {
      console.error('更新用户状态失败:', updateError)
      
      uni.showToast({
        title: '保存失败，请重试',
        icon: 'none'
      })
    }
  }
}

onMounted(async () => {
  // 页面加载时的初始化
  console.log('用户信息收集页面已加载')
  
  // 使用本地问题数据，无需API调用
  try {
    uni.showLoading({
      title: '加载题目中...',
      mask: true
    })
    
    // 模拟加载延迟，提供更好的用户体验
    await new Promise(resolve => setTimeout(resolve, 500))
    
    // 初始化用户答案数组
    userAnswers.value = new Array(questionsData.value.length).fill(null)
    
    console.log('本地问题数据加载完成，共', questionsData.value.length, '道题目')
    
  } catch (error) {
    console.error('初始化失败:', error)
    
    uni.showToast({
      title: '初始化失败，请重试',
      icon: 'none'
    })
  } finally {
    uni.hideLoading()
  }
})
</script>

<style lang="scss" scoped>
.questionnaire-container {
  width: 100vw;
  height: 100vh;
  background: url('@/static/QA/聊天背景.jpg') no-repeat center center;
  background-size: cover;
  display: flex;
  flex-direction: column;
}

/* 顶部区域 */
.header-section {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 40rpx 30rpx 20rpx;
  background: rgba(255, 255, 255, 0.8);
  backdrop-filter: blur(10rpx);
}

.doudou-avatar {
  width: 80rpx;
  height: 80rpx;
  border-radius: 50%;
  overflow: hidden;
  background: rgba(255, 193, 7, 0.1);
  display: flex;
  align-items: center;
  justify-content: center;
}

.avatar-image {
  width: 80rpx;
  height: 80rpx;
}

.progress-container {
  flex: 1;
  margin: 0 30rpx;
  display: flex;
  flex-direction: column;
  gap: 10rpx;
}

.mood-indicator {
  text-align: center;
}

.mood-text {
  font-size: 24rpx;
  color: #666;
  font-weight: 500;
  background: rgba(255, 255, 255, 0.8);
  padding: 8rpx 16rpx;
  display: inline-block;
}

.progress-bar {
  height: 10rpx;
  background: rgba(255, 193, 7, 0.3);
  border-radius: 5rpx;
  overflow: hidden;
}

.progress-fill {
  height: 100%;
  background: linear-gradient(90deg, #FFC107, #FF9800);
  border-radius: 5rpx;
  transition: width 0.4s ease;
}

.progress-text {
  font-size: 28rpx;
  color: #666;
  font-weight: 500;
  min-width: 60rpx;
}

/* 主体内容区域 */
.main-section {
  flex: 1;
  display: flex;
  flex-direction: column;
  padding: 40rpx 30rpx;
}

/* 问题区域 */
.question-container {
  margin-bottom: 40rpx;
}

.question-box {
  background: rgba(255, 255, 255, 0.95);
  border-radius: 25rpx;
  box-shadow: 0 8rpx 30rpx rgba(0, 0, 0, 0.1);
  overflow: hidden;
  border: 2rpx solid rgba(255, 193, 7, 0.3);
}

.question-header {
  background: linear-gradient(90deg, #FFC107, #FF9800);
  padding: 20rpx 30rpx;
  text-align: center;
}

.question-label {
  font-size: 28rpx;
  font-weight: 600;
  color: #fff;
  text-shadow: 0 2rpx 4rpx rgba(0, 0, 0, 0.2);
}

.question-content {
  padding: 35rpx 30rpx;
  text-align: center;
}

.question-text {
  font-size: 34rpx;
  font-weight: 500;
  color: #333;
  line-height: 1.4;
}

/* 情景图片区域 */
.scenario-image-container {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 20rpx 0;
  background: rgba(255, 255, 255, 0.2);
  border-radius: 30rpx;
  padding: 40rpx;
}

.scenario-image {
  width: 100%;
  max-width: 500rpx;
  height: 400rpx;
  border-radius: 20rpx;
}

/* 选项区域 */
.options-container {
  margin: 40rpx 0;
}

.options-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 20rpx;
}

.option-button {
  background: rgba(255, 255, 255, 0.9);
  border: 3rpx solid transparent;
  border-radius: 25rpx;
  padding: 35rpx 20rpx;
  text-align: center;
  transition: all 0.3s ease;
  cursor: pointer;
  
  &:active {
    transform: scale(0.95);
  }
  
  &.selected {
    background: rgba(255, 193, 7, 0.2);
    border-color: #FFC107;
    box-shadow: 0 8rpx 25rpx rgba(255, 193, 7, 0.3);
  }
}

.option-text {
  font-size: 32rpx;
  font-weight: 600;
  color: #333;
}

/* 主观题输入框区域 */
.subjective-input-container {
  background: rgba(255, 255, 255, 0.95);
  border-radius: 25rpx;
  padding: 30rpx;
  box-shadow: 0 8rpx 30rpx rgba(0, 0, 0, 0.1);
}

.subjective-textarea {
  width: 100%;
  min-height: 300rpx;
  background: transparent;
  border: 2rpx solid rgba(255, 193, 7, 0.3);
  border-radius: 15rpx;
  padding: 25rpx;
  font-size: 32rpx;
  color: #333;
  line-height: 1.6;
  resize: none;
  outline: none;
  box-sizing: border-box;
  
  &:focus {
    border-color: #FFC107;
    box-shadow: 0 0 20rpx rgba(255, 193, 7, 0.2);
  }
  
  &::placeholder {
    color: #999;
    font-size: 30rpx;
  }
}

/* 下一步按钮区域 */
.next-button-container {
  padding: 20rpx 0;
  text-align: center;
}

.next-button {
  width: 100%;
  height: 90rpx;
  background: linear-gradient(45deg, #FFC107, #FF9800);
  border: none;
  border-radius: 45rpx;
  font-size: 32rpx;
  font-weight: 600;
  color: #fff;
  box-shadow: 0 8rpx 25rpx rgba(255, 193, 7, 0.4);
  transition: all 0.3s ease;
  
  &:active {
    transform: translateY(2rpx);
    box-shadow: 0 4rpx 15rpx rgba(255, 193, 7, 0.4);
  }
  
  &.disabled,
  &:disabled {
    background: #ddd;
    color: #999;
    box-shadow: none;
    transform: none;
  }
}

/* 响应式适配 */
@media screen and (max-width: 375px) {
  .header-section {
    padding: 30rpx 20rpx 15rpx;
  }
  
  .doudou-avatar {
    width: 70rpx;
    height: 70rpx;
  }
  
  .avatar-image {
    width: 50rpx;
    height: 50rpx;
  }
  
  .progress-container {
    margin: 0 20rpx;
    gap: 8rpx;
  }
  
  .mood-text {
    font-size: 20rpx;
    padding: 6rpx 12rpx;
  }
  
  .progress-text {
    font-size: 24rpx;
  }
  
  .main-section {
    padding: 30rpx 20rpx;
  }
  
  .question-label {
    font-size: 24rpx;
  }
  
  .question-header {
    padding: 15rpx 20rpx;
  }
  
  .question-content {
    padding: 25rpx 20rpx;
  }
  
  .question-text {
    font-size: 30rpx;
  }
  
  .scenario-image-container {
    margin: 15rpx 0;
    padding: 30rpx;
  }
  
  .scenario-image {
    height: 250rpx;
  }
  
  .options-container {
    margin: 30rpx 0;
  }
  
  .options-grid {
    gap: 15rpx;
  }
  
  .option-button {
    padding: 30rpx 15rpx;
  }
  
  .option-text {
    font-size: 28rpx;
  }
  
  .next-button {
    height: 80rpx;
    font-size: 30rpx;
  }
  
  .subjective-input-container {
    padding: 25rpx;
  }
  
  .subjective-textarea {
    min-height: 250rpx;
    padding: 20rpx;
    font-size: 30rpx;
  }
}
</style>
