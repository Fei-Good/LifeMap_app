<template>
  <view class="chat-container">
    <!-- 状态栏 -->
    <view class="status-bar">
      <text class="status-time">9:41</text>
      <text class="status-battery">🔋 💯</text>
    </view>

    <!-- 聊天头部 -->
    <view class="chat-header">
      <view class="back-btn" @tap="goBack">
        <text class="back-icon">←</text>
      </view>
      <view class="header-doudou" @tap="playHeaderAnimation">
        <view class="doudou-face">
          <view class="doudou-eyes">
            <view class="eye left"></view>
            <view class="eye right"></view>
          </view>
          <view class="doudou-mouth"></view>
        </view>
      </view>
      <view class="header-info">
        <text class="header-name">DouDou</text>
        <text class="header-status">{{ headerStatus }}</text>
      </view>
      <view class="more-btn" @tap="showMoreOptions">
        <text class="more-icon">⋯</text>
      </view>
    </view>

    <!-- 聊天内容区域 -->
    <scroll-view class="chat-content" scroll-y :scroll-top="scrollTop" scroll-with-animation>
      <!-- DouDou欢迎卡片 - 简化版 -->
      <view class="welcome-card" @tap="playWelcomeAnimation">
        <view class="welcome-doudou-simple">
          <text class="doudou-emoji">😊</text>
        </view>
        <view class="welcome-text">
          <text class="welcome-title">{{ welcomeTitle }}</text>
          <text class="welcome-desc">{{ welcomeDesc }}</text>
        </view>
      </view>

      <!-- 快捷问题 -->
      <view class="quick-questions">
        <view 
          class="question-item" 
          v-for="(question, index) in quickQuestions" 
          :key="index"
          @tap="selectQuestion(question)"
          :class="{ 'question-selected': question.selected }"
        >
          <view class="question-icon" :style="{ backgroundColor: question.bgColor }">
            <text>{{ question.icon }}</text>
          </view>
          <view class="question-content">
            <text class="question-title">{{ question.title }}</text>
            <text class="question-subtitle">{{ question.subtitle }}</text>
          </view>
        </view>
      </view>

      <!-- 聊天消息 -->
      <view class="chat-messages">
        <view 
          v-for="(message, index) in messages" 
          :key="index"
          :class="['message-bubble', message.type]"
        >
          <text>{{ message.content }}</text>
        </view>
      </view>
    </scroll-view>

    <!-- 底部输入区域 - 标注D -->
    <view class="chat-input-area">
      <view class="input-container">
        <textarea 
          class="chat-input"
          :class="{ 'input-focused': inputFocused }"
          v-model="inputText"
          placeholder="输入你的问题..."
          @focus="onInputFocus"
          @blur="onInputBlur"
          :auto-height="true"
          :maxlength="500"
        />
        <button 
          class="send-btn" 
          @tap="sendMessage"
          :disabled="!inputText.trim() || sending"
          :class="{ 'btn-sending': sending }"
        >
          <text v-if="!sending">→</text>
          <text v-else>⏳</text>
        </button>
      </view>
    </view>
  </view>
</template>

<script>
import { ref, reactive, nextTick } from 'vue'

export default {
  name: 'ChatPage',
  setup() {
    // 响应式数据
    const inputText = ref('')
    const inputFocused = ref(false)
    const sending = ref(false)
    const scrollTop = ref(0)
    const headerStatus = ref('AI助手 • 在线')
    const welcomeTitle = ref('Hey 😊，我是职场搭子')
    const welcomeDesc = ref('你的贴心智能助手，随时为您服务')

    // 快捷问题数据
    const quickQuestions = reactive([
      {
        id: 1,
        icon: '💡',
        title: '你目前遇到的最大职场困扰是...',
        subtitle: '基于你的职位交流',
        bgColor: '#fff3cd',
        selected: false
      },
      {
        id: 2,
        icon: '🎯',
        title: '你希望提升哪方面的能力?',
        subtitle: 'AI智能提升',
        bgColor: '#d1ecf1',
        selected: false
      },
      {
        id: 3,
        icon: '⭐',
        title: '你对当前工作的满意度如何?',
        subtitle: '聊聊现况',
        bgColor: '#f8d7da',
        selected: false
      }
    ])

    // 消息数据
    const messages = reactive([
      {
        id: 1,
        type: 'ai',
        content: '根据你的职业规划，我推荐了几个下午13:45-14'
      }
    ])

    // 方法
    const goBack = () => {
      uni.navigateBack()
    }

    const playHeaderAnimation = () => {
      headerStatus.value = '很高兴为您服务 😊'
      setTimeout(() => {
        headerStatus.value = 'AI助手 • 在线'
      }, 2000)
    }

    const playWelcomeAnimation = () => {
      welcomeTitle.value = '哈哈！你好呀~ 😄'
      welcomeDesc.value = '点击下方问题开始我们的对话吧！'
      setTimeout(() => {
        welcomeTitle.value = 'Hey 😊，我是职场搭子'
        welcomeDesc.value = '你的贴心智能助手，随时为您服务'
      }, 3000)
    }

    const selectQuestion = (question) => {
      // 重置所有问题状态
      quickQuestions.forEach(q => q.selected = false)
      // 设置当前选中
      question.selected = true
      
      // 添加用户消息
      messages.push({
        id: messages.length + 1,
        type: 'user',
        content: question.title
      })

      // 模拟AI回复
      setTimeout(() => {
        messages.push({
          id: messages.length + 1,
          type: 'ai',
          content: '这是一个很好的问题！让我来为您详细分析一下...'
        })
        scrollToBottom()
        
        // 重置问题选中状态
        setTimeout(() => {
          question.selected = false
        }, 2000)
      }, 1000)

      scrollToBottom()
    }

    const onInputFocus = () => {
      inputFocused.value = true
    }

    const onInputBlur = () => {
      inputFocused.value = false
    }

    const sendMessage = () => {
      const message = inputText.value.trim()
      if (!message || sending.value) return

      sending.value = true

      // 添加用户消息
      messages.push({
        id: messages.length + 1,
        type: 'user',
        content: message
      })

      inputText.value = ''
      scrollToBottom()

      // 模拟AI回复
      setTimeout(() => {
        messages.push({
          id: messages.length + 1,
          type: 'ai',
          content: `关于"${message}"，我建议您可以从以下几个方面考虑...`
        })
        sending.value = false
        scrollToBottom()
      }, 1500)
    }

    const scrollToBottom = () => {
      nextTick(() => {
        scrollTop.value = scrollTop.value === 0 ? 1 : 0
      })
    }

    const showMoreOptions = () => {
      uni.showToast({
        title: '更多功能开发中',
        icon: 'none'
      })
    }

    return {
      inputText,
      inputFocused,
      sending,
      scrollTop,
      headerStatus,
      welcomeTitle,
      welcomeDesc,
      quickQuestions,
      messages,
      goBack,
      playHeaderAnimation,
      playWelcomeAnimation,
      selectQuestion,
      onInputFocus,
      onInputBlur,
      sendMessage,
      showMoreOptions
    }
  }
}
</script>

<style scoped>
/* 基础样式 */
.chat-container {
  height: 100vh;
  background: linear-gradient(180deg, #f8f9ff 0%, #e8f0fe 100%);
  display: flex;
  flex-direction: column;
}

/* 状态栏 */
.status-bar {
  height: 44px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 20px;
  background: rgba(255, 255, 255, 0.95);
  color: #333;
  font-size: 14px;
  font-weight: 600;
  backdrop-filter: blur(10px);
}

/* 聊天头部 */
.chat-header {
  background: rgba(255, 255, 255, 0.95);
  padding: 15px 20px;
  display: flex;
  align-items: center;
  gap: 12px;
  border-bottom: 1px solid rgba(0, 0, 0, 0.05);
  backdrop-filter: blur(10px);
}

.back-btn {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background: rgba(102, 126, 234, 0.1);
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s ease;
}

.back-btn:active {
  background: rgba(102, 126, 234, 0.2);
  transform: scale(1.1);
}

.header-doudou {
  width: 40px;
  height: 40px;
  background: linear-gradient(45deg, #ff6b6b, #ffa500);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  transition: all 0.3s ease;
}

.header-doudou:active {
  transform: scale(1.1) rotate(5deg);
}

.doudou-face {
  width: 100%;
  height: 100%;
  position: relative;
}

.doudou-eyes {
  position: absolute;
  top: 12px;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  gap: 8px;
}

.eye {
  width: 3px;
  height: 5px;
  background: #333;
  border-radius: 50%;
}

.doudou-mouth {
  position: absolute;
  bottom: 12px;
  left: 50%;
  transform: translateX(-50%);
  width: 10px;
  height: 5px;
  border: 1px solid #333;
  border-top: none;
  border-radius: 0 0 10px 10px;
}

.header-info {
  display: flex;
  flex-direction: column;
}

.header-name {
  font-size: 18px;
  color: #333;
  font-weight: 600;
}

.header-status {
  font-size: 12px;
  color: #666;
  margin-top: 2px;
}

.more-btn {
  margin-left: auto;
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background: rgba(102, 126, 234, 0.1);
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s ease;
}

.more-btn:active {
  background: rgba(102, 126, 234, 0.2);
  transform: scale(1.1);
}

/* 聊天内容区域 */
.chat-content {
  flex: 1;
  padding: 20px;
}

/* DouDou欢迎卡片 - 简化版 */
.welcome-card {
  background: linear-gradient(135deg, #667eea, #764ba2);
  border-radius: 20px;
  padding: 20px;
  color: white;
  display: flex;
  align-items: center;
  gap: 16px;
  margin-bottom: 20px;
  position: relative;
  overflow: hidden;
  transition: all 0.3s ease;
}

.welcome-card:active {
  transform: translateY(-2px);
  box-shadow: 0 15px 35px rgba(102, 126, 234, 0.3);
}

.welcome-card::before {
  content: '';
  position: absolute;
  top: -50%;
  right: -50%;
  width: 100%;
  height: 100%;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 50%;
  animation: float 4s ease-in-out infinite;
}

.welcome-doudou-simple {
  width: 50px;
  height: 50px;
  background: rgba(255, 255, 255, 0.2);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  backdrop-filter: blur(10px);
}

.doudou-emoji {
  font-size: 24px;
}

.welcome-text {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.welcome-title {
  font-size: 16px;
  font-weight: 600;
}

.welcome-desc {
  font-size: 14px;
  opacity: 0.9;
  line-height: 1.4;
}

/* 快捷问题 */
.quick-questions {
  display: flex;
  flex-direction: column;
  gap: 12px;
  margin-bottom: 20px;
}

.question-item {
  background: white;
  border-radius: 16px;
  padding: 16px;
  display: flex;
  align-items: center;
  gap: 12px;
  transition: all 0.3s ease;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
}

.question-item:active {
  transform: translateX(8px);
  box-shadow: 0 8px 25px rgba(102, 126, 234, 0.15);
}

.question-selected {
  background: linear-gradient(135deg, #667eea, #764ba2) !important;
  color: white;
}

.question-selected .question-title,
.question-selected .question-subtitle {
  color: white;
}

.question-icon {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 16px;
  flex-shrink: 0;
}

.question-content {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.question-title {
  font-size: 15px;
  color: #333;
  font-weight: 500;
}

.question-subtitle {
  font-size: 12px;
  color: #666;
}

/* 聊天消息 */
.chat-messages {
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.message-bubble {
  border-radius: 20px;
  padding: 12px 16px;
  max-width: 85%;
  font-size: 14px;
  line-height: 1.4;
  transition: all 0.3s ease;
}

.message-bubble.ai {
  background: rgba(102, 126, 234, 0.1);
  border-radius: 20px 20px 20px 4px;
  align-self: flex-start;
  color: #333;
}

.message-bubble.user {
  background: linear-gradient(135deg, #667eea, #764ba2);
  border-radius: 20px 20px 4px 20px;
  align-self: flex-end;
  color: white;
}

.message-bubble:active {
  transform: scale(1.02);
}

/* 底部输入区域 - 标注D */
.chat-input-area {
  background: rgba(255, 255, 255, 0.95);
  padding: 15px 20px 25px;
  backdrop-filter: blur(10px);
  border-top: 1px solid rgba(0, 0, 0, 0.05);
}

.input-container {
  display: flex;
  align-items: flex-end;
  gap: 12px;
}

.chat-input {
  flex: 1;
  background: #f8f9fa;
  border: 2px solid transparent;
  border-radius: 25px;
  padding: 12px 16px;
  font-size: 16px;
  min-height: 44px;
  max-height: 100px;
  transition: all 0.3s ease;
  box-sizing: border-box;
}

.chat-input:focus,
.input-focused {
  border-color: #667eea !important;
  background: white !important;
  box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
  transform: scale(1.02);
}

.send-btn {
  width: 44px;
  height: 44px;
  background: linear-gradient(45deg, #667eea, #764ba2);
  border: none;
  border-radius: 50%;
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 18px;
  transition: all 0.3s ease;
  flex-shrink: 0;
}

.send-btn:not([disabled]):active {
  transform: scale(1.1);
  box-shadow: 0 5px 15px rgba(102, 126, 234, 0.3);
}

.send-btn[disabled] {
  opacity: 0.5;
  background: #ccc;
}

.btn-sending {
  animation: rotate 1s linear infinite;
}

/* 动画 */
@keyframes float {
  0%, 100% { 
    transform: translateY(0px) rotate(0deg); 
  }
  50% { 
    transform: translateY(-10px) rotate(180deg); 
  }
}

@keyframes rotate {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

/* 响应式适配 */
@media (max-width: 375px) {
  .chat-content {
    padding: 16px;
  }
  
  .welcome-card {
    padding: 16px;
  }
  
  .question-item {
    padding: 12px;
  }
  
  .chat-input-area {
    padding: 12px 16px 20px;
  }
}
</style>
