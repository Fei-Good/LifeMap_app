<template>
  <view class="chat-container">
    <!-- 状态栏占位 -->
    <view class="status-bar"></view>
    
    <!-- 顶部目标卡片 -->
    <view class="goal-card">
      <view class="goal-content">
        <view class="goal-info">
          <text class="goal-label">目标</text>
          <text class="goal-title">成功跑路上岸</text>
          <text class="goal-days">155天</text>
          <text class="goal-subtitle">已坚持天数</text>
        </view>
        <view class="goal-avatar">
          <image 
            class="avatar-img"
            src="@/static/DouDou比心.png"
            mode="aspectFit"
          />
          <!-- 返回按钮 -->
          <view class="back-button" @click="goBack">
            <text class="back-text">返回</text>
          </view>
        </view>
      </view>
    </view>

    <!-- 问候区域 -->
    <view class="greeting-section">
      <text class="greeting-title">Hi 我是DouDou</text>
      <text class="greeting-desc">我可以为你解决在线的咨询，聊聊咨询，帮你提高效率</text>
      
      <!-- 功能按钮 -->
      <view class="function-buttons">
        <view class="function-btn" @click="handleFunction('task')">
          <view class="btn-icon">📋</view>
          <text class="btn-text">领取任务</text>
        </view>
        <view class="function-btn" @click="handleFunction('chat')">
          <view class="btn-icon">💬</view>
          <text class="btn-text">聊聊咨询</text>
        </view>
        <view class="function-btn" @click="handleFunction('efficiency')">
          <view class="btn-icon">📊</view>
          <text class="btn-text">提高效率</text>
        </view>
      </view>
    </view>

    <!-- 聊天消息区域 -->
    <scroll-view 
      class="chat-messages"
      scroll-y="true"
      :scroll-top="scrollTop"
      @scrolltoupper="onScrollToUpper"
    >
      <view 
        v-for="(message, index) in messages" 
        :key="index" 
        class="message-item"
        :class="{ 'user-message': message.isUser }"
      >
        <!-- DouDou消息 -->
        <view v-if="!message.isUser" class="ai-message">
          <view class="message-avatar">
            <image 
              class="avatar-small"
              src="@/static/QA/火苗.png"
              mode="aspectFit"
            />
          </view>
          <view class="message-bubble ai-bubble">
            <text class="message-text">{{ message.content }}</text>
            <text class="message-time">{{ formatTime(message.timestamp) }}</text>
          </view>
        </view>
        
        <!-- 用户消息 -->
        <view v-else class="user-message-container">
          <view class="message-bubble user-bubble">
            <text class="message-text">{{ message.content }}</text>
            <text class="message-time">{{ formatTime(message.timestamp) }}</text>
          </view>
        </view>
      </view>
      
      <!-- 加载提示 -->
      <view v-if="isLoading" class="loading-message">
        <view class="message-avatar">
          <image 
            class="avatar-small"
            src="@/static/QA/火苗.png"
            mode="aspectFit"
          />
        </view>
        <view class="loading-bubble">
          <view class="loading-dots">
            <view class="dot"></view>
            <view class="dot"></view>
            <view class="dot"></view>
          </view>
        </view>
      </view>
    </scroll-view>

    <!-- 底部输入区域 -->
    <view class="input-section">
      <view class="input-container">
        <view class="input-avatar">
          <image 
            class="doudou-avatar"
            src="@/static/QA/火苗.png"
            mode="aspectFit"
          />
        </view>
        <view class="input-area">
          <input 
            class="message-input"
            v-model="inputMessage"
            placeholder="和doudou聊一下吧"
            @confirm="sendMessage"
            confirm-type="send"
            :focus="inputFocus"
          />
        </view>
        <view 
          class="send-btn"
          :class="{ 'can-send': inputMessage.trim() }"
          @click="sendMessage"
        >
          <view class="send-icon">⬇</view>
        </view>
      </view>
    </view>
  </view>
</template>

<script setup>
import { ref, onMounted, nextTick } from 'vue'
import aiService from '@/utils/aiService'
import apiService from '@/utils/apiService'

// 响应式数据
const messages = ref([
  {
    content: '你好！我是DouDou，你的专属AI助手。有什么可以帮助你的吗？',
    isUser: false,
    timestamp: Date.now()
  }
])
const inputMessage = ref('')
const isLoading = ref(false)
const scrollTop = ref(0)
const inputFocus = ref(false)

// 页面加载时的初始化
onMounted(() => {
  // 自动滚动到底部
  scrollToBottom()
  
  // 检查是否需要显示个性化报告
  const pages = getCurrentPages()
  const currentPage = pages[pages.length - 1]
  const options = currentPage.options || {}
  
  if (options.showReport === 'true') {
    showPersonalityReport()
  }
})

// 显示个性化报告
const showPersonalityReport = async () => {
  try {
    // 尝试从本地存储获取报告
    let report = uni.getStorageSync('personality_report')
    
    if (!report) {
      // 如果本地没有，尝试从API获取
      try {
        const response = await apiService.getPersonalityReport()
        report = response.data
        // 保存到本地存储
        uni.setStorageSync('personality_report', report)
      } catch (error) {
        console.error('获取个性化报告失败:', error)
        // 使用默认报告消息
        messages.value.push({
          content: '欢迎回来！你的个性化报告正在生成中，请稍后查看~',
          isUser: false,
          timestamp: Date.now()
        })
        scrollToBottom()
        return
      }
    }
    
    if (report) {
      // 构建报告消息内容
      const reportMessage = `🎉 你的专属个性化报告已生成！

✨ **${report.title}**
${report.subtitle || ''}

📝 **个性分析**
${report.description || ''}

🏷️ **个性特征**
${report.traits ? report.traits.join('、') : ''}

💡 **成长建议**
${report.suggestions ? report.suggestions.map((s, index) => `${index + 1}. ${s.icon || ''} ${s.text}`).join('\n') : ''}

🌟 **优势领域**
${report.strengths ? report.strengths.join('、') : ''}

📈 **发展方向**
${report.developmentAreas ? report.developmentAreas.join('、') : ''}

💫 **DouDou寄语**
${report.summary || '期待与你一起成长！'}

来和我聊聊你的想法吧~ 😊`

      // 添加报告消息
      messages.value.push({
        content: reportMessage,
        isUser: false,
        timestamp: Date.now(),
        type: 'report'
      })
      
      scrollToBottom()
    }
  } catch (error) {
    console.error('显示个性化报告失败:', error)
  }
}

// 保存聊天消息到API
const saveChatMessage = async (message) => {
  try {
    await apiService.saveChatMessage({
      content: message.content,
      isUser: message.isUser,
      timestamp: message.timestamp,
      type: message.type || 'text'
    })
  } catch (error) {
    console.warn('保存聊天记录失败:', error)
    // 保存失败不影响聊天功能
  }
}

// 发送消息
const sendMessage = async () => {
  const message = inputMessage.value.trim()
  if (!message) return
  
  // 添加用户消息
  const userMessage = {
    content: message,
    isUser: true,
    timestamp: Date.now()
  }
  messages.value.push(userMessage)
  
  // 清空输入框
  inputMessage.value = ''
  
  // 滚动到底部
  await nextTick()
  scrollToBottom()
  
  // 显示加载状态
  isLoading.value = true
  
  try {
    // 保存用户消息到API
    await saveChatMessage(userMessage)
    
    // 获取AI回复
    const aiResponse = await getAIResponse(message)
    
    // 添加AI回复
    const aiMessage = {
      content: aiResponse,
      isUser: false,
      timestamp: Date.now()
    }
    messages.value.push(aiMessage)
    
    // 保存AI回复到API
    await saveChatMessage(aiMessage)
    
    // 滚动到底部
    await nextTick()
    scrollToBottom()
    
  } catch (error) {
    console.error('获取AI回复失败:', error)
    
    // 添加错误回复
    messages.value.push({
      content: '抱歉，我现在有点忙，请稍后再试一下~',
      isUser: false,
      timestamp: Date.now()
    })
    
    await nextTick()
    scrollToBottom()
  } finally {
    isLoading.value = false
  }
}

// 获取AI回复
const getAIResponse = async (userMessage) => {
  try {
    // 构建对话历史
    const conversationHistory = messages.value
      .filter(msg => msg.type !== 'report') // 排除报告消息
      .slice(-5) // 只取最近5条消息作为上下文
      .map(msg => ({
        role: msg.isUser ? 'user' : 'assistant', 
        content: msg.content
      }))
    
    // 优先使用后端API的AI聊天服务
    try {
      const response = await apiService.chatWithAI(userMessage, conversationHistory)
      if (response.data && response.data.reply) {
        return response.data.reply
      }
    } catch (apiError) {
      console.warn('后端AI服务调用失败，使用本地AI服务:', apiError)
      
      // 备用方案：使用本地AI服务
      try {
        // 重新构建完整的对话历史供本地AI使用
        const fullHistory = messages.value
          .filter(msg => msg.type !== 'report')
          .map(msg => ({
            role: msg.isUser ? 'user' : 'assistant',
            content: msg.content
          }))
        
        // 添加当前用户消息
        fullHistory.push({
          role: 'user',
          content: userMessage
        })
        
        const localResponse = await aiService.callAIAPI(buildChatPrompt(fullHistory))
        return localResponse || '我正在思考中...请稍等一下~'
      } catch (localError) {
        console.error('本地AI服务也调用失败:', localError)
        throw localError
      }
    }
    
    return '我正在思考中...请稍等一下~'
    
  } catch (error) {
    console.error('AI服务调用失败:', error)
    return '抱歉，我暂时无法回复，请稍后再试~'
  }
}

// 构建聊天提示词
const buildChatPrompt = (history) => {
  const conversationText = history.map(msg => 
    `${msg.role === 'user' ? '用户' : 'DouDou'}: ${msg.content}`
  ).join('\n')

  return `
你是DouDou，一个温暖、友善、专业的AI助手。你的任务是：
1. 以温暖友好的语调与用户对话
2. 根据用户的问题提供有用的建议和帮助
3. 如果用户需要帮助提高效率、解决问题或获得咨询，请积极提供支持
4. 保持积极正面的态度，适时给予鼓励
5. 回复要简洁明了，不要过长

对话历史：
${conversationText}

请作为DouDou回复最后一个用户消息，回复要自然友好，不超过100字：
`
}

// 功能按钮点击处理
const handleFunction = (type) => {
  let message = ''
  switch(type) {
    case 'task':
      message = '我想领取一些任务来提升自己'
      break
    case 'chat':
      message = '我想和你聊聊，寻求一些建议'
      break
    case 'efficiency':
      message = '我想提高工作和学习的效率'
      break
  }
  
  if (message) {
    inputMessage.value = message
    sendMessage()
  }
}

// 滚动到底部
const scrollToBottom = () => {
  nextTick(() => {
    scrollTop.value = 99999
  })
}

// 滚动到顶部时的处理
const onScrollToUpper = () => {
  // 可以在这里实现加载更多历史消息的功能
  console.log('scrolled to top')
}

// 格式化时间
const formatTime = (timestamp) => {
  const date = new Date(timestamp)
  const now = new Date()
  const diff = now - date
  
  if (diff < 60000) { // 1分钟内
    return '刚刚'
  } else if (diff < 3600000) { // 1小时内
    return `${Math.floor(diff / 60000)}分钟前`
  } else if (diff < 86400000) { // 24小时内
    return `${Math.floor(diff / 3600000)}小时前`
  } else {
    return `${date.getMonth() + 1}-${date.getDate()} ${date.getHours().toString().padStart(2, '0')}:${date.getMinutes().toString().padStart(2, '0')}`
  }
}

// 返回上一页
const goBack = () => {
  uni.navigateBack()
}
</script>

<style lang="scss" scoped>
.chat-container {
  width: 100vw;
  height: 100vh;
  background-image: url('@/static/chat.png');
  background-size: contain;
  background-position: center bottom;
  background-repeat: no-repeat;
  display: flex;
  flex-direction: column;
  position: relative;
  overflow: hidden;
}

/* 状态栏占位 */
.status-bar {
  height: calc(var(--status-bar-height) + 20rpx);
  width: 100%;
}

/* 顶部目标卡片 */
.goal-card {
  margin: 20rpx 30rpx;
  background: linear-gradient(135deg, #FFE0B2 0%, #FFCC80 100%);
  border-radius: 20rpx;
  padding: 30rpx;
  box-shadow: 0 8rpx 20rpx rgba(255, 152, 0, 0.2);
  position: relative;
  overflow: hidden;
  
  &::before {
    content: '';
    position: absolute;
    top: -50%;
    right: -50%;
    width: 200%;
    height: 200%;
    background: radial-gradient(circle, rgba(255, 255, 255, 0.1) 0%, transparent 50%);
    animation: shimmer 3s infinite;
  }
}

.goal-content {
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 30rpx;
  position: relative;
  z-index: 2;
}

.goal-info {
  flex: 1;
  display: flex;
  flex-direction: column;
}

.goal-label {
  font-size: 24rpx;
  color: #8D6E63;
  margin-bottom: 8rpx;
  font-weight: 500;
}

.goal-title {
  font-size: 36rpx;
  font-weight: bold;
  color: #5D4037;
  margin-bottom: 12rpx;
}

.goal-days {
  font-size: 48rpx;
  font-weight: bold;
  color: #FF8F00;
  line-height: 1;
  margin-bottom: 4rpx;
}

.goal-subtitle {
  font-size: 22rpx;
  color: #8D6E63;
}

.goal-avatar {
  width: 120rpx;
  height: 120rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative; /* Added for positioning back button */
}

.avatar-img {
  width: 100rpx;
  height: 100rpx;
}

/* 返回按钮 */
.back-button {
  position: absolute;
  top: -40rpx;
  right: 0;
  background: rgba(255, 255, 255, 0.8);
  border-radius: 30rpx;
  padding: 10rpx 20rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 4rpx 12rpx rgba(0, 0, 0, 0.1);
  z-index: 10;
}

.back-text {
  font-size: 24rpx;
  color: #4A5568;
  font-weight: 500;
}

/* 问候区域 */
.greeting-section {
  padding: 40rpx 30rpx;
  text-align: center;
}

.greeting-title {
  display: block;
  font-size: 48rpx;
  font-weight: bold;
  color: #2E3A59;
  margin-bottom: 20rpx;
}

.greeting-desc {
  display: block;
  font-size: 28rpx;
  color: #5A6C7D;
  line-height: 1.5;
  margin-bottom: 40rpx;
}

/* 功能按钮 */
.function-buttons {
  display: flex;
  justify-content: space-around;
  gap: 20rpx;
  margin-bottom: 30rpx;
}

.function-btn {
  flex: 1;
  background: rgba(255, 255, 255, 0.9);
  border-radius: 20rpx;
  padding: 30rpx 20rpx;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12rpx;
  box-shadow: 0 4rpx 12rpx rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;
  
  &:active {
    transform: scale(0.95);
    background: rgba(255, 255, 255, 1);
  }
}

.btn-icon {
  font-size: 32rpx;
}

.btn-text {
  font-size: 24rpx;
  color: #4A5568;
  font-weight: 500;
}

/* 聊天消息区域 */
.chat-messages {
  flex: 1;
  padding: 0 30rpx;
  margin-bottom: 20rpx;
}

.message-item {
  margin-bottom: 30rpx;
}

/* AI消息 */
.ai-message {
  display: flex;
  align-items: flex-start;
  gap: 20rpx;
}

.message-avatar {
  width: 60rpx;
  height: 60rpx;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.9);
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.avatar-small {
  width: 40rpx;
  height: 40rpx;
}

.message-bubble {
  max-width: 70%;
  padding: 24rpx 28rpx;
  border-radius: 24rpx;
  position: relative;
}

.ai-bubble {
  background: rgba(255, 255, 255, 0.95);
  color: #2D3748;
  
  &::before {
    content: '';
    position: absolute;
    left: -12rpx;
    top: 20rpx;
    width: 0;
    height: 0;
    border-top: 12rpx solid transparent;
    border-bottom: 12rpx solid transparent;
    border-right: 12rpx solid rgba(255, 255, 255, 0.95);
  }
}

/* 用户消息 */
.user-message-container {
  display: flex;
  justify-content: flex-end;
  padding-right: 60rpx;
}

.user-bubble {
  background: linear-gradient(135deg, #4A9EFF 0%, #1E88E5 100%);
  color: white;
  
  &::after {
    content: '';
    position: absolute;
    right: -12rpx;
    top: 20rpx;
    width: 0;
    height: 0;
    border-top: 12rpx solid transparent;
    border-bottom: 12rpx solid transparent;
    border-left: 12rpx solid #1E88E5;
  }
}

.message-text {
  display: block;
  font-size: 28rpx;
  line-height: 1.5;
  margin-bottom: 8rpx;
}

.message-time {
  display: block;
  font-size: 20rpx;
  opacity: 0.7;
}

/* 加载消息 */
.loading-message {
  display: flex;
  align-items: flex-start;
  gap: 20rpx;
  margin-bottom: 30rpx;
}

.loading-bubble {
  background: rgba(255, 255, 255, 0.95);
  padding: 20rpx 24rpx;
  border-radius: 24rpx;
  position: relative;
  
  &::before {
    content: '';
    position: absolute;
    left: -12rpx;
    top: 20rpx;
    width: 0;
    height: 0;
    border-top: 12rpx solid transparent;
    border-bottom: 12rpx solid transparent;
    border-right: 12rpx solid rgba(255, 255, 255, 0.95);
  }
}

.loading-dots {
  display: flex;
  gap: 8rpx;
  align-items: center;
}

.dot {
  width: 12rpx;
  height: 12rpx;
  border-radius: 50%;
  background: #CBD5E0;
  animation: dotPulse 1.4s infinite both;
  
  &:nth-child(2) {
    animation-delay: 0.2s;
  }
  
  &:nth-child(3) {
    animation-delay: 0.4s;
  }
}

/* 底部输入区域 */
.input-section {
  background: rgba(255, 255, 255, 0.9);
  padding: 20rpx 30rpx;
  padding-bottom: calc(20rpx + env(safe-area-inset-bottom));
  border-top: 1rpx solid rgba(0, 0, 0, 0.1);
  backdrop-filter: blur(10rpx);
}

.input-container {
  display: flex;
  align-items: center;
  gap: 20rpx;
}

.input-avatar {
  width: 60rpx;
  height: 60rpx;
  border-radius: 50%;
  background: rgba(255, 192, 203, 0.2);
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.doudou-avatar {
  width: 40rpx;
  height: 40rpx;
}

.input-area {
  flex: 1;
  background: #F7FAFC;
  border-radius: 50rpx;
  padding: 0 30rpx;
  border: 2rpx solid #E2E8F0;
  transition: border-color 0.3s ease;
  
  &:focus-within {
    border-color: #4A9EFF;
  }
}

.message-input {
  width: 100%;
  height: 80rpx;
  font-size: 28rpx;
  color: #2D3748;
  background: transparent;
  border: none;
  outline: none;
  
  &::placeholder {
    color: #A0AEC0;
  }
}

.send-btn {
  width: 60rpx;
  height: 60rpx;
  border-radius: 50%;
  background: #E2E8F0;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s ease;
  flex-shrink: 0;
  
  &.can-send {
    background: linear-gradient(135deg, #4A9EFF 0%, #1E88E5 100%);
    transform: rotate(45deg);
  }
}

.send-icon {
  font-size: 28rpx;
  color: #718096;
  transition: color 0.3s ease;
  
  .can-send & {
    color: white;
  }
}

/* 动画 */
@keyframes shimmer {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

@keyframes dotPulse {
  0%, 80%, 100% {
    opacity: 0.3;
    transform: scale(0.8);
  }
  40% {
    opacity: 1;
    transform: scale(1);
  }
}

/* 响应式适配 */
@media screen and (max-width: 375px) {
  .goal-card {
    margin: 15rpx 20rpx;
    padding: 25rpx;
  }
  
  .goal-title {
    font-size: 32rpx;
  }
  
  .goal-days {
    font-size: 42rpx;
  }
  
  .greeting-section {
    padding: 30rpx 20rpx;
  }
  
  .greeting-title {
    font-size: 42rpx;
  }
  
  .function-buttons {
    gap: 15rpx;
  }
  
  .function-btn {
    padding: 25rpx 15rpx;
  }
  
  .chat-messages {
    padding: 0 20rpx;
  }
  
  .input-section {
    padding: 15rpx 20rpx;
    padding-bottom: calc(15rpx + env(safe-area-inset-bottom));
  }
}
</style>

