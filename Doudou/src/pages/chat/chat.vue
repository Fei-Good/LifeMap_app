<template>
  <view class="chat-container">
    <!-- 状态栏占位 -->
    <view class="status-bar"></view>
    
    <!-- 顶部功能按钮组 -->
    <view class="header-toolbar">
      <view class="toolbar-left">
        <view class="back-button" @click="goBack">
          <text class="back-text">返回</text>
        </view>
        <view class="app-title"></view>
      </view>
      <view class="header-buttons">
        <view class="header-btn" @click="showHistoryList">
          <text class="btn-icon">📝历史</text>
        </view>
        <view class="header-btn" @click="showFavoriteList">
          <text class="btn-icon">⭐收藏</text>
        </view>
        <view class="header-btn" @click="showKnowledgeList">
          <text class="btn-icon">📚知识库</text>
        </view>
        <view class="header-btn" @click="toggleChatFavorite">
          <text class="btn-icon">AI创作</text>
        </view>
        <view class="header-btn" @click="startNewChat">
          <text class="btn-icon">➕</text>
        </view>
      </view>
    </view>

    <!-- 问候区域 -->
    <view v-if="!isChatStarted" class="greeting-section">
      <text class="greeting-title">Hi 我是DouDou</text>
      <text class="greeting-desc">我可以为你解决在线的咨询，聊聊咨询，帮你提高效率</text>
      
      <!-- 功能按钮 -->
      <view class="function-buttons">
        <view class="function-btn" @click="handleFunction('task')">
          <view class="btn-icon">📋</view>
          <text class="btn-text">技能提升</text>
        </view>
        <view class="function-btn" @click="handleFunction('chat')">
          <view class="btn-icon">💬</view>
          <text class="btn-text">常见问题</text>
        </view>
        <view class="function-btn" @click="handleFunction('efficiency')">
          <view class="btn-icon">🫣</view>
          <text class="btn-text">情绪疏导</text>
        </view>
      </view>
      
      <!-- 推荐内容区域 -->
      <view v-if="showRecommendations" class="recommendations-section">
        <text class="recommendations-title">{{ currentRecommendationTitle }}</text>
        <view class="recommendations-list">
          <view 
            v-for="(item, index) in currentRecommendations" 
            :key="index"
            class="recommendation-item"
            @click="selectRecommendation(item)"
          >
            <text class="recommendation-text">{{ item }}</text>
          </view>
        </view>
      </view>
    </view>

    <!-- 选择模式工具栏 -->
    <view v-if="isSelectionMode" class="selection-toolbar">
      <view class="toolbar-left">
        <view class="selection-count">已选择 {{ selectedMessages.size }} 条</view>
      </view>
      <view class="toolbar-right">
        <view class="toolbar-btn" @click="selectAllMessages">
          <text class="toolbar-btn-text">全选</text>
        </view>
        <view class="toolbar-btn" @click="favoriteSelectedMessages">
          <text class="toolbar-btn-text">收藏</text>
        </view>
        <view class="toolbar-btn delete-btn" @click="deleteSelectedMessages">
          <text class="toolbar-btn-text">删除</text>
        </view>
        <view class="toolbar-btn" @click="toggleSelectionMode">
          <text class="toolbar-btn-text">取消</text>
        </view>
      </view>
    </view>

    <!-- 聊天消息区域 -->
    <scroll-view 
      class="chat-messages"
      scroll-y="true"
      :scroll-top="scrollTop"
      @scrolltoupper="onScrollToUpper"
      :enhanced="true"
      :show-scrollbar="false"
      :scroll-with-animation="true"
      :enable-back-to-top="true"
      :scroll-anchoring="true"
    >
      
      <view 
        v-for="(message, index) in messages" 
        :key="message.id || index" 
        class="message-item"
        :class="{
          'user-message': message.isUser,
          'selected': selectedMessages.has(message.id),
          'selection-mode': isSelectionMode
        }"
        @longpress="onMessageLongPress(message.id)"
        @click="isSelectionMode && toggleMessageSelection(message.id)"
      >
        <!-- 选择指示器 -->
        <view v-if="isSelectionMode" class="selection-indicator">
          <view 
            class="selection-checkbox"
            :class="{ 'checked': selectedMessages.has(message.id) }"
          >
            <text v-if="selectedMessages.has(message.id)" class="check-icon">✓</text>
          </view>
        </view>

        <!-- DouDou消息 -->
        <view v-if="!message.isUser" class="ai-message">
          <view class="message-avatar">
            <image 
              class="avatar-small"
              src="@/static/QA/火苗.png"
              mode="aspectFit"
            />
          </view>
          <view class="message-content">
            <view class="message-bubble ai-bubble">
              <text class="message-text">{{ message.content }}</text>
              <text class="message-time">{{ formatTime(message.timestamp) }}</text>
            </view>
          </view>
        </view>
        
        <!-- 用户消息 -->
        <view v-else class="user-message-container">
          <view class="message-content user-content">
            <view class="message-bubble user-bubble">
              <text class="message-text">{{ message.content }}</text>
              <text class="message-time">{{ formatTime(message.timestamp) }}</text>
            </view>
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
        <view class="input-avatar" @click="toggleRoleSelector">
          <image 
            class="doudou-avatar"
            :src="roleConfig[currentRole].avatar"
            mode="aspectFit"
          />
        </view>
        <view class="input-area">
          <input 
            class="message-input"
            v-model="inputMessage"
            :placeholder="roleConfig[currentRole].placeholder"
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

    <!-- 角色选择弹窗 -->
    <view 
      class="role-selector-overlay" 
      v-show="showRoleSelector"
      @click="hideRoleSelector"
    >
      <view class="role-selector-popup" @click.stop>
        <view class="popup-header">
          <text class="popup-title">选择聊天角色</text>
          <view class="close-btn" @click="hideRoleSelector">×</view>
        </view>
        
        <view class="role-list">
          <view 
            v-for="(role, key) in roleConfig" 
            :key="key"
            class="role-item"
            :class="{ 'active': currentRole === key }"
            @click="selectRole(key)"
          >
            <view class="role-avatar">
              <image 
                class="role-avatar-img"
                :src="role.avatar"
                mode="aspectFit"
              />
            </view>
            <view class="role-info">
              <text class="role-title">{{ role.name }}</text>
              <text class="role-desc">{{ role.description }}</text>
            </view>
            <view class="role-check" v-show="currentRole === key">✓</view>
          </view>
        </view>
        
        <view class="popup-footer">
          <text class="footer-tip">切换旁观者视角，更客观看待问题与情绪</text>
        </view>
      </view>
    </view>

    <!-- 聊天历史面板 -->
    <view 
      class="history-panel-overlay" 
      v-show="showHistoryPanel"
      @click="hideAllPanels"
    >
      <view class="history-panel" @click.stop>
        <view class="panel-header">
          <text class="panel-title">聊天历史</text>
          <view class="header-actions">
            <view class="action-btn" @click="isHistorySelectionMode = !isHistorySelectionMode">
              <text class="action-text">{{ isHistorySelectionMode ? '取消' : '选择' }}</text>
            </view>
            <view class="close-btn" @click="hideAllPanels">×</view>
          </view>
        </view>
        
        <!-- 选择模式工具栏 -->
        <view v-if="isHistorySelectionMode" class="selection-toolbar">
          <view class="toolbar-left">
            <text class="selection-count">已选择 {{ selectedHistories.size }} 个对话</text>
          </view>
          <view class="toolbar-right">
            <view class="toolbar-btn" @click="selectAllHistories">
              <text class="toolbar-btn-text">全选</text>
            </view>
            <view class="toolbar-btn" @click="favoriteSelectedHistories">
              <text class="toolbar-btn-text">收藏</text>
            </view>
            <view class="toolbar-btn delete-btn" @click="deleteSelectedHistories">
              <text class="toolbar-btn-text">删除</text>
            </view>
          </view>
        </view>
        
        <scroll-view class="history-list" scroll-y="true">
          <view 
            v-for="chat in chatHistories" 
            :key="chat.id"
            class="history-item"
            :class="{ 
              'selected': selectedHistories.has(chat.id),
              'selection-mode': isHistorySelectionMode 
            }"
            @click="isHistorySelectionMode ? toggleHistorySelection(chat.id) : loadChatHistory(chat.id)"
          >
            <!-- 选择指示器 -->
            <view v-if="isHistorySelectionMode" class="selection-indicator">
              <view 
                class="selection-checkbox"
                :class="{ 'checked': selectedHistories.has(chat.id) }"
              >
                <text v-if="selectedHistories.has(chat.id)" class="check-icon">✓</text>
              </view>
            </view>
            
            <view class="history-info">
              <text class="history-title">{{ chat.title }}</text>
              <text class="history-time">{{ formatTime(chat.timestamp) }}</text>
              <text class="history-role">{{ roleConfig[chat.role]?.name || 'DouDou' }}</text>
            </view>
            <view v-if="!isHistorySelectionMode" class="history-actions">
              <view class="delete-btn" @click.stop="deleteChatHistory(chat.id)">
                <text class="delete-icon">🗑️</text>
              </view>
            </view>
          </view>
          
          <view v-if="chatHistories.length === 0" class="empty-state">
            <text class="empty-text">暂无聊天历史</text>
          </view>
        </scroll-view>
      </view>
    </view>

    <!-- 收藏面板 -->
    <view 
      class="favorite-panel-overlay" 
      v-show="showFavoritePanel"
      @click="hideAllPanels"
    >
      <view class="favorite-panel" @click.stop>
        <view class="panel-header">
          <text class="panel-title">收藏对话</text>
          <view class="header-actions">
            <view class="action-btn" @click="isFavoriteSelectionMode = !isFavoriteSelectionMode">
              <text class="action-text">{{ isFavoriteSelectionMode ? '取消' : '选择' }}</text>
            </view>
            <view class="close-btn" @click="hideAllPanels">×</view>
          </view>
        </view>
        
        <!-- 选择模式工具栏 -->
        <view v-if="isFavoriteSelectionMode" class="selection-toolbar">
          <view class="toolbar-left">
            <text class="selection-count">已选择 {{ selectedFavorites.size }} 个对话</text>
          </view>
          <view class="toolbar-right">
            <view class="toolbar-btn" @click="selectAllFavorites">
              <text class="toolbar-btn-text">全选</text>
            </view>
            <view class="toolbar-btn summary-btn" @click="summarizeSelectedChats">
              <text class="toolbar-btn-text">总结</text>
            </view>
            <view class="toolbar-btn delete-btn" @click="deleteSelectedFavorites">
              <text class="toolbar-btn-text">删除</text>
            </view>
          </view>
        </view>
        
        <scroll-view class="favorite-list" scroll-y="true">
          <view 
            v-for="favorite in favoriteChats" 
            :key="favorite.id"
            class="favorite-item"
            :class="{ 
              'selected': selectedFavorites.has(favorite.id),
              'selection-mode': isFavoriteSelectionMode 
            }"
            @click="isFavoriteSelectionMode ? toggleFavoriteSelection(favorite.id) : loadChatHistory(favorite.chatId)"
          >
            <!-- 选择指示器 -->
            <view v-if="isFavoriteSelectionMode" class="selection-indicator">
              <view 
                class="selection-checkbox"
                :class="{ 'checked': selectedFavorites.has(favorite.id) }"
              >
                <text v-if="selectedFavorites.has(favorite.id)" class="check-icon">✓</text>
              </view>
            </view>
            
            <view class="favorite-content">
              <view class="favorite-bubble">
                <text class="favorite-title">{{ favorite.title }}</text>
                <text class="favorite-preview">{{ getDialogPreview(favorite.messages) }}</text>
                <view class="favorite-meta">
                  <text class="favorite-role">{{ roleConfig[favorite.role]?.name || 'DouDou' }}</text>
                  <text class="favorite-time">{{ formatTime(favorite.favoriteTime) }}</text>
                  <text class="favorite-count">{{ favorite.messages.length }}条消息</text>
                </view>
              </view>
            </view>
            <view v-if="!isFavoriteSelectionMode" class="favorite-actions">
              <view class="remove-btn" @click.stop="removeFavoriteChat(favorite.id)">
                <text class="remove-icon">❌</text>
              </view>
            </view>
          </view>
          
          <view v-if="favoriteChats.length === 0" class="empty-state">
            <text class="empty-text">暂无收藏对话</text>
          </view>
        </scroll-view>
      </view>
    </view>

    <!-- 复盘知识库面板 -->
    <view 
      class="knowledge-panel-overlay" 
      v-show="showKnowledgePanel"
      @click="hideAllPanels"
    >
      <view class="knowledge-panel" @click.stop>
        <view class="panel-header">
          <text class="panel-title">复盘知识库</text>
          <view class="header-actions">
            <view class="action-btn" @click="isKnowledgeSelectionMode = !isKnowledgeSelectionMode">
              <text class="action-text">{{ isKnowledgeSelectionMode ? '取消' : '选择' }}</text>
            </view>
            <view class="close-btn" @click="hideAllPanels">×</view>
          </view>
        </view>
        
        <!-- 选择模式工具栏 -->
        <view v-if="isKnowledgeSelectionMode" class="selection-toolbar">
          <view class="toolbar-left">
            <text class="selection-count">已选择 {{ selectedKnowledge.size }} 张卡片</text>
          </view>
          <view class="toolbar-right">
            <view class="toolbar-btn delete-btn" @click="deleteSelectedKnowledge">
              <text class="toolbar-btn-text">删除</text>
            </view>
          </view>
        </view>
        
        <scroll-view class="knowledge-list" scroll-y="true">
          <view 
            v-for="card in knowledgeCards" 
            :key="card.id"
            class="knowledge-card"
            :class="{ 
              'selected': selectedKnowledge.has(card.id),
              'selection-mode': isKnowledgeSelectionMode 
            }"
            @click="isKnowledgeSelectionMode ? toggleKnowledgeSelection(card.id) : viewKnowledgeCard(card)"
          >
            <!-- 选择指示器 -->
            <view v-if="isKnowledgeSelectionMode" class="selection-indicator">
              <view 
                class="selection-checkbox"
                :class="{ 'checked': selectedKnowledge.has(card.id) }"
              >
                <text v-if="selectedKnowledge.has(card.id)" class="check-icon">✓</text>
              </view>
            </view>
            
            <view class="card-content">
              <view class="card-header">
                <text class="card-title">{{ card.title }}</text>
                <text class="card-time">{{ formatTime(card.createdTime) }}</text>
              </view>
              
              <view class="card-tags">
                <view 
                  v-for="tag in card.tags" 
                  :key="tag"
                  class="tag"
                >
                  <text class="tag-text">{{ tag }}</text>
                </view>
              </view>
              
              <text class="card-summary">{{ card.summary.substring(0, 100) }}...</text>
              
              <view class="card-meta">
                <text class="chat-count">基于{{ card.chatCount }}个对话</text>
                <text class="insight-count">{{ card.insights.length }}个洞察</text>
              </view>
            </view>
            
            <view v-if="!isKnowledgeSelectionMode" class="card-actions">
              <view class="remove-btn" @click.stop="removeKnowledgeCard(card.id)">
                <text class="remove-icon">🗑️</text>
              </view>
            </view>
          </view>
          
          <view v-if="knowledgeCards.length === 0" class="empty-state">
            <text class="empty-text">暂无知识卡片</text>
            <text class="empty-tip">选择收藏对话并点击"总结"来创建知识卡片</text>
          </view>
        </scroll-view>
      </view>
    </view>
  </view>
</template>

<script setup>
import { ref, onMounted, nextTick } from 'vue'
import aiService from '@/utils/aiService'
import apiService from '@/utils/apiService'

// 角色配置
const roleConfig = {
  doudou: {
    name: 'DouDou',
    avatar: '@/static/QA/火苗.png',
    placeholder: '和DouDou聊一下吧',
    description: '你自己的视角',
    prompt: `你是DouDou，一个温暖、友善、专业的AI助手。你的任务是：
1. 以温暖友好的语调与用户对话
2. 根据用户的问题提供有用的建议和帮助
3. 如果用户需要帮助提高效率、解决问题或获得咨询，请积极提供支持
4. 保持积极正面的态度，适时给予鼓励
5. 回复要简洁明了，不要过长`
  },
  boss: {
    name: 'Boss',
    avatar: '@/static/QA/火苗.png',
    placeholder: '从老板的角度分析问题',
    description: '老板的视角',
    prompt: `你是一位经验丰富的老板，从管理者和领导者的角度来分析问题。你的任务是：
1. 从商业和效率的角度思考问题
2. 关注结果导向和目标达成
3. 提供实用的管理建议和解决方案
4. 帮助用户从更高的层面看待问题
5. 保持专业和理性的态度
6. 回复要简洁有力，突出重点`
  },
  coworker: {
    name: 'Co-worker',
    avatar: '@/static/QA/火苗.png',
    placeholder: '和同事客观讨论',
    description: '同事视角',
    prompt: `你是一位客观理性的同事，能够中性地分析问题。你的任务是：
1. 以客观、中立的态度分析情况
2. 帮助用户更理性地看待自己的情绪和问题
3. 提供平衡的观点和建议
4. 避免过于情绪化的回应
5. 从第三方的角度提供洞察
6. 保持友好但客观的语调`
  }
}

// 工具函数
const generateMessageId = () => {
  return Date.now().toString(36) + Math.random().toString(36).substr(2)
}

const generateChatId = () => {
  return 'chat_' + Date.now().toString(36) + Math.random().toString(36).substr(2)
}

// 响应式数据
const messages = ref([
  {
    content: '你好！我是DouDou，你的专属AI助手。有什么可以帮助你的吗？',
    isUser: false,
    timestamp: Date.now(),
    id: generateMessageId()
  }
])
const inputMessage = ref('')
const isLoading = ref(false)
const scrollTop = ref(0)
const inputFocus = ref(false)
const currentRole = ref('doudou') // 当前选择的角色
const showRoleSelector = ref(false) // 是否显示角色选择器

// 聊天状态和推荐内容相关
const isChatStarted = ref(false) // 是否已开始聊天
const showRecommendations = ref(false) // 是否显示推荐内容
const currentRecommendationTitle = ref('') // 当前推荐内容标题
const currentRecommendations = ref([]) // 当前推荐内容列表

// 推荐内容配置
const recommendationConfig = {
  task: {
    title: '技能提升推荐',
    items: [
      '📊 如何书写有效的提示词，有没有框架？🤔',
      '⏰ 每天忙到飞起却没成果，时间咋管理？💨',
      '🔄 跨部门沟通总卡壳，怎么破？😫'
    ]
  },
  chat: {
    title: '常见问题',
    items: [
      '⚖️ 平衡不了工作和生活，快抑郁了咋整？🥹',
      '🎨 PPT做得丑还费时间，有速成方法吗？😅',
      '🙅‍♀️ 被老员工使唤做杂事，该不该拒绝？😤'
    ]
  },
  efficiency: {
    title: '情绪释放',
    items: [
      '暴打XXXXX？'
    ]
  }
}

// 聊天记录和收藏相关状态
const currentChatId = ref(null) // 当前聊天会话ID
const showHistoryPanel = ref(false) // 显示历史记录面板
const showFavoritePanel = ref(false) // 显示收藏面板
const showKnowledgePanel = ref(false) // 显示复盘知识库面板
const chatHistories = ref([]) // 聊天历史列表
const favoriteChats = ref([]) // 收藏的对话列表
const knowledgeCards = ref([]) // 复盘知识库卡片列表
const selectedHistories = ref(new Set()) // 选中的历史记录ID集合
const selectedFavorites = ref(new Set()) // 选中的收藏对话ID集合
const selectedKnowledge = ref(new Set()) // 选中的知识卡片ID集合
const isHistorySelectionMode = ref(false) // 历史记录是否处于选择模式
const isFavoriteSelectionMode = ref(false) // 收藏是否处于选择模式
const isKnowledgeSelectionMode = ref(false) // 知识库是否处于选择模式
const selectedMessages = ref(new Set()) // 选中的消息ID集合（保留用于消息选择）
const isSelectionMode = ref(false) // 是否处于消息选择模式

// 页面加载时的初始化
onMounted(() => {
  // 初始化聊天会话ID
  currentChatId.value = generateChatId()
  
  // 自动滚动到底部
  scrollToBottom()
  
  // 加载聊天历史和收藏
  loadChatHistories()
  loadFavoriteChats()
  loadKnowledgeCards()
  
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

// 聊天记录管理功能
const loadChatHistories = () => {
  try {
    const histories = uni.getStorageSync('chat_histories') || []
    chatHistories.value = histories
  } catch (error) {
    console.error('加载聊天历史失败:', error)
    chatHistories.value = []
  }
}

const saveChatHistory = () => {
  try {
    const chatData = {
      id: currentChatId.value,
      title: generateChatTitle(),
      messages: messages.value,
      timestamp: Date.now(),
      role: currentRole.value
    }
    
    const existingIndex = chatHistories.value.findIndex(chat => chat.id === currentChatId.value)
    if (existingIndex >= 0) {
      chatHistories.value[existingIndex] = chatData
    } else {
      chatHistories.value.unshift(chatData)
    }
    
    // 限制历史记录数量为50条
    if (chatHistories.value.length > 50) {
      chatHistories.value = chatHistories.value.slice(0, 50)
    }
    
    uni.setStorageSync('chat_histories', chatHistories.value)
  } catch (error) {
    console.error('保存聊天历史失败:', error)
  }
}

const generateChatTitle = () => {
  const userMessages = messages.value.filter(msg => msg.isUser)
  if (userMessages.length > 0) {
    const firstMessage = userMessages[0].content
    return firstMessage.length > 20 ? firstMessage.substring(0, 20) + '...' : firstMessage
  }
  return `与${roleConfig[currentRole.value].name}的对话`
}

const loadChatHistory = (chatId) => {
  const chat = chatHistories.value.find(c => c.id === chatId)
  if (chat) {
    currentChatId.value = chatId
    messages.value = chat.messages.map(msg => ({
      ...msg,
      id: msg.id || generateMessageId()
    }))
    currentRole.value = chat.role || 'doudou'
    scrollToBottom()
    showHistoryPanel.value = false
  }
}

const deleteChatHistory = (chatId) => {
  chatHistories.value = chatHistories.value.filter(chat => chat.id !== chatId)
  uni.setStorageSync('chat_histories', chatHistories.value)
}

// 收藏对话相关功能
const loadFavoriteChats = () => {
  try {
    const favorites = uni.getStorageSync('favorite_chats') || []
    favoriteChats.value = favorites
  } catch (error) {
    console.error('加载收藏对话失败:', error)
    favoriteChats.value = []
  }
}

const toggleChatFavorite = () => {
  // 跳转到AI创作页面
  uni.navigateTo({
    url: '/pages/ai-creation/ai-creation'
  })
}

const addChatToFavorites = (chat) => {
  favoriteChats.value.unshift({
    id: generateMessageId(),
    chatId: chat.id,
    title: chat.title,
    messages: chat.messages,
    timestamp: chat.timestamp,
    role: chat.role,
    favoriteTime: Date.now()
  })
}

const removeFavoriteChat = (favoriteId) => {
  favoriteChats.value = favoriteChats.value.filter(fav => fav.id !== favoriteId)
  uni.setStorageSync('favorite_chats', favoriteChats.value)
  uni.showToast({ title: '已移除收藏', icon: 'success' })
}


// 复盘知识库相关功能
const loadKnowledgeCards = () => {
  try {
    const cards = uni.getStorageSync('knowledge_cards') || []
    knowledgeCards.value = cards
  } catch (error) {
    console.error('加载知识卡片失败:', error)
    knowledgeCards.value = []
  }
}

const saveKnowledgeCard = (card) => {
  knowledgeCards.value.unshift({
    id: generateMessageId(),
    ...card,
    createdTime: Date.now()
  })
  uni.setStorageSync('knowledge_cards', knowledgeCards.value)
}

const removeKnowledgeCard = (cardId) => {
  knowledgeCards.value = knowledgeCards.value.filter(card => card.id !== cardId)
  uni.setStorageSync('knowledge_cards', knowledgeCards.value)
  uni.showToast({ title: '已删除知识卡片', icon: 'success' })
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
  
  // 开始聊天，隐藏问候区域
  isChatStarted.value = true
  showRecommendations.value = false
  
  // 添加用户消息
  const userMessage = {
    content: message,
    isUser: true,
    timestamp: Date.now(),
    id: generateMessageId()
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
      timestamp: Date.now(),
      id: generateMessageId()
    }
    messages.value.push(aiMessage)
    
    // 保存AI回复到API
    await saveChatMessage(aiMessage)
    
    // 自动保存聊天历史
    saveChatHistory()
    
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
    
    // 根据当前角色构建提示词
    const rolePrompt = buildRolePrompt(userMessage, conversationHistory)
    
    // 调用大模型接口
    try {
      const response = await aiService.chatWithAI(userMessage, conversationHistory, {
        maxTokens: 150, // 限制token数量，确保回复简洁
        temperature: 0.7,
        systemPrompt: rolePrompt // 使用角色特定的提示词
      })
      
      // 限制回复长度不超过100字（增加长度以适应不同角色的回复风格）
      if (response && response.length > 100) {
        return response.substring(0, 100) + '...'
      }
      
      return response || '我正在思考中...请稍等一下~'
      
    } catch (apiError) {
      console.error('AI服务调用失败:', apiError)
      throw apiError
    }
    
  } catch (error) {
    console.error('AI服务调用失败:', error)
    return '抱歉，我暂时无法回复，请稍后再试~'
  }
}

// 构建角色特定的提示词
const buildRolePrompt = (userMessage, history) => {
  const currentRoleConfig = roleConfig[currentRole.value]
  const conversationText = history.map(msg => 
    `${msg.role === 'user' ? '用户' : currentRoleConfig.name}: ${msg.content}`
  ).join('\n')

  return `
${currentRoleConfig.prompt}

对话历史：
${conversationText}

请作为${currentRoleConfig.name}回复最后一个用户消息，回复要自然且符合角色特点，不超过100字：
`
}

// 构建聊天提示词（保留兼容性）
const buildChatPrompt = (history) => {
  return buildRolePrompt('', history)
}

// 功能按钮点击处理
const handleFunction = (type) => {
  // 显示对应的推荐内容
  const config = recommendationConfig[type]
  if (config) {
    currentRecommendationTitle.value = config.title
    currentRecommendations.value = config.items
    showRecommendations.value = true
  }
}

// 选择推荐问题
const selectRecommendation = (question) => {
  // 隐藏推荐内容
  showRecommendations.value = false
  // 设置输入框内容
  inputMessage.value = question
  // 开始聊天
  isChatStarted.value = true
  // 发送消息
  sendMessage()
}

// 滚动到底部
const scrollToBottom = () => {
  nextTick(() => {
    // 使用更精确的滚动计算
    const query = uni.createSelectorQuery()
    query.select('.chat-messages').boundingClientRect(rect => {
      if (rect) {
        scrollTop.value = rect.height + 10000 // 确保滚动到最底部
      } else {
        scrollTop.value = 99999
      }
    }).exec()
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

// 角色选择相关方法
const toggleRoleSelector = () => {
  showRoleSelector.value = !showRoleSelector.value
}

const hideRoleSelector = () => {
  showRoleSelector.value = false
}

const selectRole = (roleKey) => {
  if (currentRole.value !== roleKey) {
    currentRole.value = roleKey
    
    // 添加角色切换提示消息
    const roleChangeMessage = {
      content: `已切换到${roleConfig[roleKey].name}视角，我将从${roleConfig[roleKey].description}为你分析问题。`,
      isUser: false,
      timestamp: Date.now(),
      type: 'system'
    }
    messages.value.push(roleChangeMessage)
    
    // 滚动到底部
    nextTick(() => {
      scrollToBottom()
    })
  }
  
  hideRoleSelector()
}


// 消息选择功能
const toggleSelectionMode = () => {
  isSelectionMode.value = !isSelectionMode.value
  if (!isSelectionMode.value) {
    selectedMessages.value.clear()
  }
}

const toggleMessageSelection = (messageId) => {
  if (selectedMessages.value.has(messageId)) {
    selectedMessages.value.delete(messageId)
  } else {
    selectedMessages.value.add(messageId)
  }
}

const selectAllMessages = () => {
  messages.value.forEach(msg => {
    if (msg.id) selectedMessages.value.add(msg.id)
  })
}

const clearSelection = () => {
  selectedMessages.value.clear()
}

const deleteSelectedMessages = () => {
  if (selectedMessages.value.size === 0) return
  
  uni.showModal({
    title: '确认删除',
    content: `确定要删除选中的 ${selectedMessages.value.size} 条消息吗？`,
    success: (res) => {
      if (res.confirm) {
        messages.value = messages.value.filter(msg => !selectedMessages.value.has(msg.id))
        selectedMessages.value.clear()
        isSelectionMode.value = false
        saveChatHistory()
        uni.showToast({ title: '删除成功', icon: 'success' })
      }
    }
  })
}

const favoriteSelectedMessages = () => {
  // 收藏当前整个对话
  toggleChatFavorite()
  selectedMessages.value.clear()
  isSelectionMode.value = false
}

// 历史记录多选功能
const toggleHistorySelection = (chatId) => {
  if (selectedHistories.value.has(chatId)) {
    selectedHistories.value.delete(chatId)
  } else {
    selectedHistories.value.add(chatId)
  }
}

const selectAllHistories = () => {
  chatHistories.value.forEach(chat => {
    selectedHistories.value.add(chat.id)
  })
}

const clearHistorySelection = () => {
  selectedHistories.value.clear()
  isHistorySelectionMode.value = false
}

const deleteSelectedHistories = () => {
  if (selectedHistories.value.size === 0) return
  
  uni.showModal({
    title: '确认删除',
    content: `确定要删除选中的 ${selectedHistories.value.size} 个对话吗？`,
    success: (res) => {
      if (res.confirm) {
        chatHistories.value = chatHistories.value.filter(chat => !selectedHistories.value.has(chat.id))
        uni.setStorageSync('chat_histories', chatHistories.value)
        selectedHistories.value.clear()
        isHistorySelectionMode.value = false
        uni.showToast({ title: '删除成功', icon: 'success' })
      }
    }
  })
}

const favoriteSelectedHistories = () => {
  if (selectedHistories.value.size === 0) return
  
  let addedCount = 0
  selectedHistories.value.forEach(chatId => {
    const chat = chatHistories.value.find(c => c.id === chatId)
    if (chat && !favoriteChats.value.some(fav => fav.chatId === chatId)) {
      addChatToFavorites(chat)
      addedCount++
    }
  })
  
  if (addedCount > 0) {
    uni.setStorageSync('favorite_chats', favoriteChats.value)
    uni.showToast({ title: `已收藏${addedCount}个对话`, icon: 'success' })
  } else {
    uni.showToast({ title: '选中对话已在收藏中', icon: 'none' })
  }
  
  selectedHistories.value.clear()
  isHistorySelectionMode.value = false
}

// 收藏多选功能
const toggleFavoriteSelection = (favoriteId) => {
  if (selectedFavorites.value.has(favoriteId)) {
    selectedFavorites.value.delete(favoriteId)
  } else {
    selectedFavorites.value.add(favoriteId)
  }
}

const selectAllFavorites = () => {
  favoriteChats.value.forEach(fav => {
    selectedFavorites.value.add(fav.id)
  })
}

const clearFavoriteSelection = () => {
  selectedFavorites.value.clear()
  isFavoriteSelectionMode.value = false
}

const deleteSelectedFavorites = () => {
  if (selectedFavorites.value.size === 0) return
  
  uni.showModal({
    title: '确认删除',
    content: `确定要删除选中的 ${selectedFavorites.value.size} 个收藏吗？`,
    success: (res) => {
      if (res.confirm) {
        favoriteChats.value = favoriteChats.value.filter(fav => !selectedFavorites.value.has(fav.id))
        uni.setStorageSync('favorite_chats', favoriteChats.value)
        selectedFavorites.value.clear()
        isFavoriteSelectionMode.value = false
        uni.showToast({ title: '删除成功', icon: 'success' })
      }
    }
  })
}

// 对话总结功能 - 简单版本，直接保存到知识库
const summarizeSelectedChats = async () => {
  if (selectedFavorites.value.size === 0) {
    uni.showToast({ title: '请选择要总结的对话', icon: 'none' })
    return
  }
  
  try {
    const selectedChats = favoriteChats.value.filter(fav => selectedFavorites.value.has(fav.id))
    
    // 创建简单的知识卡片，不调用AI
    const knowledgeCard = {
      title: `对话复盘 - ${formatTime(Date.now())}`,
      summary: `基于${selectedChats.length}个对话的复盘总结，包含${selectedChats.length}个对话记录。`,
      chatCount: selectedChats.length,
      chats: selectedChats.map(chat => ({
        id: chat.chatId,
        title: chat.title,
        timestamp: chat.timestamp
      })),
      tags: extractTags(selectedChats),
      insights: ['对话记录已保存', '可在知识库中进行AI分析', '支持进一步总结优化'],
      needsAIAnalysis: true // 标记需要AI分析
    }
    
    saveKnowledgeCard(knowledgeCard)
    
    uni.showToast({ title: '对话已保存到知识库', icon: 'success' })
    
    selectedFavorites.value.clear()
    isFavoriteSelectionMode.value = false
    
  } catch (error) {
    console.error('保存对话失败:', error)
    uni.showToast({ title: '保存失败，请重试', icon: 'error' })
  }
}

// 移除buildSummaryPrompt函数，因为不再在chat页面进行AI总结

const extractTags = (chats) => {
  // 简单的标签提取逻辑，可以根据需要完善
  const commonTags = ['工作', '学习', '情绪', '效率', '沟通', '技能']
  const tags = []
  
  chats.forEach(chat => {
    commonTags.forEach(tag => {
      if (chat.title.includes(tag) || chat.messages.some(msg => msg.content.includes(tag))) {
        if (!tags.includes(tag)) {
          tags.push(tag)
        }
      }
    })
  })
  
  return tags.slice(0, 5) // 最多5个标签
}

const extractInsights = (summary) => {
  // 从总结中提取关键洞察，这里简化处理
  const sentences = summary.split(/[。！？]/).filter(s => s.trim())
  return sentences.slice(0, 3) // 取前3个关键句子作为洞察
}

const onMessageLongPress = (messageId) => {
  if (!isSelectionMode.value) {
    isSelectionMode.value = true
    selectedMessages.value.add(messageId)
    uni.vibrateShort()
  }
}

// 面板控制
const showHistoryList = () => {
  showHistoryPanel.value = true
  showFavoritePanel.value = false
  showKnowledgePanel.value = false
  // 重置选择状态
  clearHistorySelection()
}

const showFavoriteList = () => {
  showFavoritePanel.value = true
  showHistoryPanel.value = false
  showKnowledgePanel.value = false
  // 重置选择状态
  clearFavoriteSelection()
}

const showKnowledgeList = () => {
  // 跳转到独立的知识库页面
  uni.navigateTo({
    url: '/pages/knowledge/knowledge'
  })
}

const hideAllPanels = () => {
  showHistoryPanel.value = false
  showFavoritePanel.value = false
  showKnowledgePanel.value = false
  // 重置所有选择状态
  clearHistorySelection()
  clearFavoriteSelection()
  isKnowledgeSelectionMode.value = false
  selectedKnowledge.value.clear()
}

// 知识库相关功能
const toggleKnowledgeSelection = (cardId) => {
  if (selectedKnowledge.value.has(cardId)) {
    selectedKnowledge.value.delete(cardId)
  } else {
    selectedKnowledge.value.add(cardId)
  }
}

const deleteSelectedKnowledge = () => {
  if (selectedKnowledge.value.size === 0) return
  
  uni.showModal({
    title: '确认删除',
    content: `确定要删除选中的 ${selectedKnowledge.value.size} 张知识卡片吗？`,
    success: (res) => {
      if (res.confirm) {
        knowledgeCards.value = knowledgeCards.value.filter(card => !selectedKnowledge.value.has(card.id))
        uni.setStorageSync('knowledge_cards', knowledgeCards.value)
        selectedKnowledge.value.clear()
        isKnowledgeSelectionMode.value = false
        uni.showToast({ title: '删除成功', icon: 'success' })
      }
    }
  })
}

const viewKnowledgeCard = (card) => {
  // 显示知识卡片详情，这里简化为显示总结
  uni.showModal({
    title: card.title,
    content: card.summary,
    showCancel: false
  })
}

const getDialogPreview = (messages) => {
  const userMessages = messages.filter(msg => msg.isUser)
  if (userMessages.length > 0) {
    const preview = userMessages[0].content
    return preview.length > 50 ? preview.substring(0, 50) + '...' : preview
  }
  return '暂无用户消息'
}

const startNewChat = () => {
  currentChatId.value = generateChatId()
  messages.value = [
    {
      content: '你好！我是DouDou，你的专属AI助手。有什么可以帮助你的吗？',
      isUser: false,
      timestamp: Date.now(),
      id: generateMessageId()
    }
  ]
  currentRole.value = 'doudou'
  // 重置聊天状态
  isChatStarted.value = false
  showRecommendations.value = false
  scrollToBottom()
  hideAllPanels()
}

// 返回主界面
const goBack = () => {
  // 保存当前聊天记录
  saveChatHistory()
  // 跳转到地图主界面
  uni.navigateTo({
    url: '/pages/map/map'
  })
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
  
  /* 确保容器高度固定 */
  max-height: 100vh;
  min-height: 100vh;
  box-sizing: border-box;
}

/* 状态栏占位 */
.status-bar {
  height: calc(var(--status-bar-height) + 20rpx);
  width: 100%;
}

/* 顶部工具栏 */
.header-toolbar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 20rpx 30rpx;
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(10rpx);
  border-bottom: 1rpx solid rgba(0, 0, 0, 0.1);
  position: relative;
  z-index: 10;
}

.toolbar-left {
  flex: 1;
  display: flex;
  align-items: center;
  gap: 20rpx;
}

.app-title {
  font-size: 36rpx;
  font-weight: bold;
  color: #2D3748;
}

/* 头部按钮组 */
.header-buttons {
  display: flex;
  align-items: center;
  gap: 15rpx;
  position: relative;
  z-index: 10;
}

.header-btn {
  min-width: 120rpx;
  height: 60rpx;
  background: rgba(255, 255, 255, 0.9);
  border-radius: 30rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0 20rpx;
  box-shadow: 0 4rpx 12rpx rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;
  
  &:active {
    transform: scale(0.95);
    background: rgba(255, 255, 255, 1);
  }
  
  .btn-icon {
    font-size: 24rpx;
  }
}

/* 返回按钮 */
.back-button {
  background: rgba(255, 255, 255, 0.8);
  border-radius: 30rpx;
  padding: 10rpx 20rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 4rpx 12rpx rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;
  
  &:active {
    transform: scale(0.95);
    background: rgba(255, 255, 255, 1);
  }
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

/* 推荐内容区域 */
.recommendations-section {
  margin-top: 40rpx;
  animation: slideInUp 0.3s ease-out;
}

.recommendations-title {
  display: block;
  font-size: 32rpx;
  font-weight: bold;
  color: #2E3A59;
  margin-bottom: 30rpx;
  text-align: center;
}

.recommendations-list {
  display: flex;
  flex-direction: column;
  gap: 16rpx;
}

.recommendation-item {
  background: rgba(255, 255, 255, 0.95);
  border-radius: 16rpx;
  padding: 24rpx 28rpx;
  box-shadow: 0 2rpx 8rpx rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;
  border: 2rpx solid transparent;
  
  &:active {
    transform: scale(0.98);
    background: rgba(74, 158, 255, 0.1);
    border-color: #4A9EFF;
  }
}

.recommendation-text {
  font-size: 28rpx;
  color: #4A5568;
  line-height: 1.5;
  font-weight: 500;
}

.btn-icon {
  font-size: 32rpx;
}

.btn-text {
  font-size: 24rpx;
  color: #4A5568;
  font-weight: 500;
}

/* 选择模式工具栏 */
.selection-toolbar {
  background: rgba(255, 255, 255, 0.95);
  padding: 20rpx 30rpx;
  display: flex;
  align-items: center;
  justify-content: space-between;
  border-bottom: 1rpx solid rgba(0, 0, 0, 0.1);
  backdrop-filter: blur(10rpx);
}

.toolbar-left {
  flex: 1;
}

.selection-count {
  font-size: 28rpx;
  color: #4A5568;
  font-weight: 500;
}

.toolbar-right {
  display: flex;
  align-items: center;
  gap: 20rpx;
}

.toolbar-btn {
  padding: 12rpx 24rpx;
  border-radius: 20rpx;
  background: #F7FAFC;
  border: 1rpx solid #E2E8F0;
  transition: all 0.3s ease;
  
  &:active {
    transform: scale(0.95);
    background: #EDF2F7;
  }
  
  &.delete-btn {
    background: #FED7D7;
    border-color: #FC8181;
    
    .toolbar-btn-text {
      color: #E53E3E;
    }
  }
}

.toolbar-btn-text {
  font-size: 24rpx;
  color: #4A5568;
  font-weight: 500;
}

/* 聊天消息区域 */
.chat-messages {
  flex: 1;
  padding: 20rpx 30rpx 40rpx;
  min-height: 0; /* 修复flex布局高度问题 */
  box-sizing: border-box;
  overflow: hidden; /* 由 scroll-view 控制滚动 */
  position: relative;
  z-index: 1;
}

.message-item {
  margin-bottom: 30rpx;
  display: flex;
  align-items: flex-start;
  gap: 20rpx;
  position: relative;
  transition: all 0.3s ease;
  
  &.selection-mode {
    padding-left: 80rpx;
  }
  
  &.selected {
    background: rgba(74, 158, 255, 0.1);
    border-radius: 20rpx;
    padding: 15rpx;
    margin-left: -15rpx;
    margin-right: -15rpx;
  }
}

/* 选择指示器 */
.selection-indicator {
  position: absolute;
  left: -60rpx;
  top: 50%;
  transform: translateY(-50%);
  z-index: 5;
}

.selection-checkbox {
  width: 40rpx;
  height: 40rpx;
  border: 3rpx solid #E2E8F0;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  background: white;
  transition: all 0.3s ease;
  
  &.checked {
    background: #4A9EFF;
    border-color: #4A9EFF;
  }
}

.check-icon {
  font-size: 20rpx;
  color: white;
  font-weight: bold;
}

/* AI消息 */
.ai-message {
  display: flex;
  align-items: flex-start;
  gap: 20rpx;
  flex: 1;
}

.message-content {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 12rpx;
}

.user-content {
  align-items: flex-end;
}

/* 消息操作按钮 */
.message-actions {
  display: flex;
  gap: 12rpx;
  opacity: 0;
  transition: opacity 0.3s ease;
}

.message-item:hover .message-actions {
  opacity: 1;
}

.user-actions {
  align-self: flex-end;
}

.action-btn {
  width: 60rpx;
  height: 60rpx;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.9);
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 2rpx 8rpx rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;
  
  &:active {
    transform: scale(0.9);
  }
  
  &.favorited {
    background: rgba(255, 215, 0, 0.2);
    
    .action-icon {
      color: #FFD700;
    }
  }
}

.action-icon {
  font-size: 24rpx;
  color: #718096;
  transition: color 0.3s ease;
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
  flex: 1;
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
  position: relative;
  cursor: pointer;
  transition: all 0.3s ease;
  
  &:active {
    transform: scale(0.95);
    background: rgba(255, 192, 203, 0.3);
  }
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

@keyframes slideInUp {
  from {
    opacity: 0;
    transform: translateY(30rpx);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* 响应式适配 */
@media screen and (max-width: 375px) {
  .header-toolbar {
    padding: 15rpx 20rpx;
  }
  
  .app-title {
    font-size: 32rpx;
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
    padding: 15rpx 20rpx;
  }
  
  .input-section {
    padding: 15rpx 20rpx;
    padding-bottom: calc(15rpx + env(safe-area-inset-bottom));
  }
}

/* 角色选择弹窗样式 */
.role-selector-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  backdrop-filter: blur(5rpx);
}

.role-selector-popup {
  background: white;
  border-radius: 24rpx;
  width: 600rpx;
  max-width: 90vw;
  max-height: 80vh;
  overflow: hidden;
  box-shadow: 0 20rpx 60rpx rgba(0, 0, 0, 0.3);
  animation: popupSlideIn 0.3s ease-out;
}

.popup-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 40rpx 40rpx 20rpx;
  border-bottom: 1rpx solid #E2E8F0;
}

.popup-title {
  font-size: 32rpx;
  font-weight: bold;
  color: #2D3748;
}

.close-btn {
  width: 60rpx;
  height: 60rpx;
  border-radius: 50%;
  background: #F7FAFC;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 40rpx;
  color: #718096;
  transition: all 0.3s ease;
  
  &:active {
    transform: scale(0.9);
    background: #EDF2F7;
  }
}

.role-list {
  padding: 20rpx 0;
  max-height: 60vh;
  overflow-y: auto;
}

.role-item {
  display: flex;
  align-items: center;
  padding: 30rpx 40rpx;
  transition: all 0.3s ease;
  position: relative;
  
  &:active {
    background: rgba(74, 158, 255, 0.1);
  }
  
  &.active {
    background: rgba(74, 158, 255, 0.1);
    
    &::before {
      content: '';
      position: absolute;
      left: 0;
      top: 0;
      bottom: 0;
      width: 6rpx;
      background: #4A9EFF;
    }
  }
}

.role-avatar {
  width: 80rpx;
  height: 80rpx;
  border-radius: 50%;
  background: rgba(255, 192, 203, 0.2);
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 24rpx;
  flex-shrink: 0;
}

.role-avatar-img {
  width: 50rpx;
  height: 50rpx;
}

.role-info {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 8rpx;
}

.role-title {
  font-size: 30rpx;
  font-weight: bold;
  color: #2D3748;
}

.role-desc {
  font-size: 24rpx;
  color: #718096;
  line-height: 1.4;
}

.role-check {
  width: 40rpx;
  height: 40rpx;
  border-radius: 50%;
  background: #4A9EFF;
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 24rpx;
  font-weight: bold;
  flex-shrink: 0;
}

.popup-footer {
  padding: 20rpx 40rpx 40rpx;
  border-top: 1rpx solid #E2E8F0;
  text-align: center;
}

.footer-tip {
  font-size: 24rpx;
  color: #A0AEC0;
  line-height: 1.4;
}

@keyframes popupSlideIn {
  from {
    opacity: 0;
    transform: translateY(100rpx) scale(0.9);
  }
  to {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
}

/* 面板样式 */
.history-panel-overlay,
.favorite-panel-overlay,
.knowledge-panel-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 2000;
  backdrop-filter: blur(5rpx);
}

.history-panel,
.favorite-panel,
.knowledge-panel {
  background: white;
  border-radius: 24rpx;
  width: 700rpx;
  max-width: 90vw;
  max-height: 80vh;
  overflow: hidden;
  box-shadow: 0 20rpx 60rpx rgba(0, 0, 0, 0.3);
  animation: popupSlideIn 0.3s ease-out;
}

.panel-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 40rpx 40rpx 20rpx;
  border-bottom: 1rpx solid #E2E8F0;
}

.header-actions {
  display: flex;
  align-items: center;
  gap: 20rpx;
}

.action-btn {
  padding: 12rpx 24rpx;
  border-radius: 20rpx;
  background: #F7FAFC;
  border: 1rpx solid #E2E8F0;
  transition: all 0.3s ease;
  
  &:active {
    transform: scale(0.95);
    background: #EDF2F7;
  }
}

.action-text {
  font-size: 24rpx;
  color: #4A5568;
  font-weight: 500;
}

.panel-title {
  font-size: 32rpx;
  font-weight: bold;
  color: #2D3748;
}

.history-list,
.favorite-list,
.knowledge-list {
  max-height: 60vh;
  overflow-y: auto;
  padding: 20rpx 0;
}

/* 历史记录项和收藏项 */
.history-item,
.favorite-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 30rpx 40rpx;
  border-bottom: 1rpx solid #F7FAFC;
  transition: all 0.3s ease;
  position: relative;
  
  &:active {
    background: rgba(74, 158, 255, 0.1);
  }
  
  &:last-child {
    border-bottom: none;
  }
  
  &.selection-mode {
    padding-left: 80rpx;
  }
  
  &.selected {
    background: rgba(74, 158, 255, 0.1);
    border-left: 4rpx solid #4A9EFF;
  }
}

.history-info {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 8rpx;
}

.history-title {
  font-size: 28rpx;
  color: #2D3748;
  font-weight: 500;
  line-height: 1.4;
}

.history-time {
  font-size: 24rpx;
  color: #A0AEC0;
}

.history-role {
  font-size: 22rpx;
  color: #4A9EFF;
  background: rgba(74, 158, 255, 0.1);
  padding: 4rpx 12rpx;
  border-radius: 12rpx;
  align-self: flex-start;
}

.history-actions {
  display: flex;
  gap: 12rpx;
}

.delete-btn {
  width: 60rpx;
  height: 60rpx;
  border-radius: 50%;
  background: #FED7D7;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s ease;
  
  &:active {
    transform: scale(0.9);
    background: #FEB2B2;
  }
}

.delete-icon {
  font-size: 24rpx;
}

/* 收藏对话样式 */
.favorite-content {
  flex: 1;
}

.favorite-bubble {
  background: rgba(74, 158, 255, 0.05);
  border-radius: 16rpx;
  padding: 24rpx;
  border: 1rpx solid rgba(74, 158, 255, 0.1);
}

.favorite-title {
  display: block;
  font-size: 30rpx;
  font-weight: 600;
  color: #2D3748;
  line-height: 1.4;
  margin-bottom: 12rpx;
}

.favorite-preview {
  display: block;
  font-size: 26rpx;
  color: #718096;
  line-height: 1.5;
  margin-bottom: 16rpx;
}

.favorite-meta {
  display: flex;
  align-items: center;
  gap: 16rpx;
  flex-wrap: wrap;
}

.favorite-role {
  font-size: 22rpx;
  color: #4A9EFF;
  background: rgba(74, 158, 255, 0.1);
  padding: 4rpx 12rpx;
  border-radius: 12rpx;
}

.favorite-time {
  font-size: 22rpx;
  color: #A0AEC0;
}

.favorite-count {
  font-size: 22rpx;
  color: #68D391;
  background: rgba(104, 211, 145, 0.1);
  padding: 4rpx 12rpx;
  border-radius: 12rpx;
}

.favorite-actions,
.history-actions,
.card-actions {
  display: flex;
  gap: 12rpx;
}

.remove-btn {
  width: 60rpx;
  height: 60rpx;
  border-radius: 50%;
  background: #FED7D7;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s ease;
  
  &:active {
    transform: scale(0.9);
    background: #FEB2B2;
  }
}

.remove-icon {
  font-size: 20rpx;
}

/* 知识库卡片样式 */
.knowledge-card {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  padding: 30rpx 40rpx;
  border-bottom: 1rpx solid #F7FAFC;
  transition: all 0.3s ease;
  position: relative;
  gap: 20rpx;
  
  &:active {
    background: rgba(74, 158, 255, 0.1);
  }
  
  &:last-child {
    border-bottom: none;
  }
  
  &.selection-mode {
    padding-left: 80rpx;
  }
  
  &.selected {
    background: rgba(74, 158, 255, 0.1);
    border-left: 4rpx solid #4A9EFF;
  }
}

.card-content {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 16rpx;
}

.card-header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 20rpx;
}

.card-title {
  flex: 1;
  font-size: 30rpx;
  font-weight: 600;
  color: #2D3748;
  line-height: 1.4;
}

.card-time {
  font-size: 22rpx;
  color: #A0AEC0;
  flex-shrink: 0;
}

.card-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 8rpx;
}

.tag {
  background: rgba(74, 158, 255, 0.1);
  border-radius: 12rpx;
  padding: 4rpx 12rpx;
}

.tag-text {
  font-size: 20rpx;
  color: #4A9EFF;
  font-weight: 500;
}

.card-summary {
  font-size: 26rpx;
  color: #4A5568;
  line-height: 1.5;
}

.card-meta {
  display: flex;
  align-items: center;
  gap: 16rpx;
}

.chat-count {
  font-size: 22rpx;
  color: #805AD5;
  background: rgba(128, 90, 213, 0.1);
  padding: 4rpx 12rpx;
  border-radius: 12rpx;
}

.insight-count {
  font-size: 22rpx;
  color: #38B2AC;
  background: rgba(56, 178, 172, 0.1);
  padding: 4rpx 12rpx;
  border-radius: 12rpx;
}

/* 总结按钮样式 */
.summary-btn {
  background: #E6FFFA !important;
  border-color: #38B2AC !important;
  
  .toolbar-btn-text {
    color: #38B2AC !important;
  }
}

/* 空状态 */
.empty-state {
  padding: 80rpx 40rpx;
  text-align: center;
}

.empty-text {
  display: block;
  font-size: 28rpx;
  color: #A0AEC0;
  margin-bottom: 12rpx;
}

.empty-tip {
  display: block;
  font-size: 24rpx;
  color: #CBD5E0;
  line-height: 1.5;
}

</style>

