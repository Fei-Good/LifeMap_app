<template>
  <view class="knowledge-container">
    <!-- 状态栏占位 -->
    <view class="status-bar"></view>
    
    <!-- 顶部导航栏 -->
    <view class="header-toolbar">
      <view class="toolbar-left">
        <view class="back-button" @click="goBack">
          <text class="back-text">返回</text>
        </view>
        <text class="page-title">复盘知识库</text>
      </view>
      <view class="header-buttons">
        <view class="header-btn" @click="isSelectionMode = !isSelectionMode">
          <text class="btn-text">{{ isSelectionMode ? '取消' : '选择' }}</text>
        </view>
        <view v-if="knowledgeCards.length > 0" class="header-btn" @click="exportKnowledge">
          <text class="btn-text">📤 导出</text>
        </view>
      </view>
    </view>

    <!-- 选择模式工具栏 -->
    <view v-if="isSelectionMode" class="selection-toolbar">
      <view class="toolbar-left">
        <text class="selection-count">已选择 {{ selectedKnowledge.size }} 张卡片</text>
      </view>
      <view class="toolbar-right">
        <view class="toolbar-btn" @click="selectAllKnowledge">
          <text class="toolbar-btn-text">全选</text>
        </view>
        <view class="toolbar-btn ai-summary-btn" @click="aiSummarizeSelectedKnowledge">
          <text class="toolbar-btn-text">AI总结</text>
        </view>
        <view class="toolbar-btn delete-btn" @click="deleteSelectedKnowledge">
          <text class="toolbar-btn-text">删除</text>
        </view>
      </view>
    </view>

    <!-- 统计信息 -->
    <view v-if="knowledgeCards.length > 0" class="stats-section">
      <view class="stats-card">
        <view class="stat-item">
          <text class="stat-number">{{ knowledgeCards.length }}</text>
          <text class="stat-label">知识卡片</text>
        </view>
        <view class="stat-item">
          <text class="stat-number">{{ totalChats }}</text>
          <text class="stat-label">总对话数</text>
        </view>
        <view class="stat-item">
          <text class="stat-number">{{ totalInsights }}</text>
          <text class="stat-label">洞察数量</text>
        </view>
      </view>
    </view>

    <!-- 搜索和筛选 -->
    <view v-if="knowledgeCards.length > 0" class="filter-section">
      <view class="search-container">
        <input 
          class="search-input"
          v-model="searchKeyword"
          placeholder="搜索知识卡片..."
          @input="onSearchInput"
        />
        <view class="search-icon">🔍</view>
      </view>
      
      <view class="filter-tabs">
        <view 
          v-for="tab in filterTabs" 
          :key="tab.key"
          class="filter-tab"
          :class="{ 'active': currentFilter === tab.key }"
          @click="setFilter(tab.key)"
        >
          <text class="tab-text">{{ tab.label }}</text>
        </view>
      </view>
    </view>

    <!-- 知识卡片列表 -->
    <scroll-view 
      class="knowledge-list"
      scroll-y="true"
      :enhanced="true"
      :show-scrollbar="false"
      :scroll-with-animation="true"
    >
      <view 
        v-for="card in filteredCards" 
        :key="card.id"
        class="knowledge-card"
        :class="{ 
          'selected': selectedKnowledge.has(card.id),
          'selection-mode': isSelectionMode 
        }"
        @click="isSelectionMode ? toggleKnowledgeSelection(card.id) : viewKnowledgeCard(card)"
        @longpress="onCardLongPress(card.id)"
      >
        <!-- 选择指示器 -->
        <view v-if="isSelectionMode" class="selection-indicator">
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
          
          <view v-if="card.tags && card.tags.length > 0" class="card-tags">
            <view 
              v-for="tag in card.tags" 
              :key="tag"
              class="tag"
            >
              <text class="tag-text">{{ tag }}</text>
            </view>
          </view>
          
          <text class="card-summary">{{ getCardPreview(card.summary) }}</text>
          
          <view class="card-meta">
            <text class="chat-count">基于{{ card.chatCount || 0 }}个对话</text>
            <text class="insight-count">{{ (card.insights && card.insights.length) || 0 }}个洞察</text>
            <text v-if="card.actionableAdvice && card.actionableAdvice.length" class="advice-count">{{ card.actionableAdvice.length }}个建议</text>
            <text v-if="card.analysisType === 'ai_analysis'" class="type-badge">AI分析</text>
            <text v-if="card.needsAIAnalysis" class="pending-badge">待分析</text>
          </view>
        </view>
        
        <view v-if="!isSelectionMode" class="card-actions">
          <view class="action-btn share-btn" @click.stop="shareKnowledgeCard(card)">
            <text class="action-icon">📤</text>
          </view>
          <view class="action-btn delete-btn" @click.stop="removeKnowledgeCard(card.id)">
            <text class="action-icon">🗑️</text>
          </view>
        </view>
      </view>
      
      <!-- 空状态 -->
      <view v-if="knowledgeCards.length === 0" class="empty-state">
        <view class="empty-icon">📚</view>
        <text class="empty-title">暂无知识卡片</text>
        <text class="empty-desc">在聊天页面收藏对话并点击"总结"来创建知识卡片</text>
        <view class="empty-action" @click="goToChat">
          <text class="action-text">去聊天</text>
        </view>
      </view>
      
      <!-- 搜索无结果 -->
      <view v-else-if="filteredCards.length === 0" class="empty-state">
        <view class="empty-icon">🔍</view>
        <text class="empty-title">没有找到相关内容</text>
        <text class="empty-desc">尝试调整搜索关键词或筛选条件</text>
        <view class="empty-action" @click="clearSearch">
          <text class="action-text">清空搜索</text>
        </view>
      </view>
    </scroll-view>

    <!-- 知识卡片详情弹窗 -->
    <view 
      class="card-detail-overlay" 
      v-show="showCardDetail"
      @click="hideCardDetail"
    >
      <view class="card-detail-popup" @click.stop>
        <view class="detail-header">
          <text class="detail-title">{{ selectedCard?.title || '' }}</text>
          <view class="close-btn" @click="hideCardDetail">×</view>
        </view>
        
        <scroll-view class="detail-content" scroll-y="true">
          <view v-if="selectedCard" class="detail-body">
            <!-- 基本信息 -->
            <view class="detail-section">
              <text class="section-title">基本信息</text>
              <view class="info-grid">
                <view class="info-item">
                  <text class="info-label">创建时间</text>
                  <text class="info-value">{{ formatTime(selectedCard.createdTime) }}</text>
                </view>
                <view class="info-item">
                  <text class="info-label">对话数量</text>
                  <text class="info-value">{{ selectedCard.chatCount || 0 }}个</text>
                </view>
                <view class="info-item">
                  <text class="info-label">洞察数量</text>
                  <text class="info-value">{{ (selectedCard.insights && selectedCard.insights.length) || 0 }}个</text>
                </view>
              </view>
            </view>
            
            <!-- 标签 -->
            <view v-if="selectedCard.tags && selectedCard.tags.length > 0" class="detail-section">
              <text class="section-title">标签</text>
              <view class="detail-tags">
                <view 
                  v-for="tag in selectedCard.tags" 
                  :key="tag"
                  class="detail-tag"
                >
                  <text class="tag-text">{{ tag }}</text>
                </view>
              </view>
            </view>
            
            <!-- 总结内容 -->
            <view class="detail-section">
              <text class="section-title">总结内容</text>
              <text class="summary-content">{{ selectedCard.summary || '暂无总结内容' }}</text>
            </view>
            
            <!-- 洞察 -->
            <view v-if="selectedCard.insights && selectedCard.insights.length > 0" class="detail-section">
              <text class="section-title">关键洞察</text>
              <view class="insights-list">
                <view 
                  v-for="(insight, index) in selectedCard.insights" 
                  :key="index"
                  class="insight-item"
                >
                  <text class="insight-text">{{ insight }}</text>
                </view>
              </view>
            </view>
            
            <!-- 相关对话 -->
            <view v-if="selectedCard.chats && selectedCard.chats.length > 0" class="detail-section">
              <text class="section-title">相关对话</text>
              <view class="related-chats">
                <view 
                  v-for="chat in selectedCard.chats" 
                  :key="chat.id"
                  class="chat-item"
                >
                  <text class="chat-title">{{ chat.title }}</text>
                  <text class="chat-time">{{ formatTime(chat.timestamp) }}</text>
                </view>
              </view>
            </view>
          </view>
        </scroll-view>
        
        <view class="detail-actions">
          <view v-if="selectedCard && selectedCard.needsAIAnalysis" class="action-button ai-analysis-btn" @click="aiAnalyzeSingleCard(selectedCard)">
            <text class="button-text">🤖 AI分析</text>
          </view>
          <view class="action-button secondary" @click="shareKnowledgeCard(selectedCard)">
            <text class="button-text">分享</text>
          </view>
          <view class="action-button primary" @click="hideCardDetail">
            <text class="button-text">关闭</text>
          </view>
        </view>
      </view>
    </view>
  </view>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import aiService from '@/utils/aiService'

// 工具函数
const generateMessageId = () => {
  return Date.now().toString(36) + Math.random().toString(36).substr(2)
}

// 响应式数据
const knowledgeCards = ref([]) // 知识卡片列表
const selectedKnowledge = ref(new Set()) // 选中的知识卡片ID集合
const isSelectionMode = ref(false) // 是否处于选择模式
const searchKeyword = ref('') // 搜索关键词
const currentFilter = ref('all') // 当前筛选条件
const showCardDetail = ref(false) // 是否显示卡片详情
const selectedCard = ref(null) // 当前选中的卡片

// 筛选标签
const filterTabs = ref([
  { key: 'all', label: '全部' },
  { key: 'recent', label: '最近' },
  { key: 'work', label: '工作' },
  { key: 'study', label: '学习' },
  { key: 'emotion', label: '情绪' }
])

// 计算属性
const totalChats = computed(() => {
  return knowledgeCards.value.reduce((total, card) => total + (card.chatCount || 0), 0)
})

const totalInsights = computed(() => {
  return knowledgeCards.value.reduce((total, card) => total + ((card.insights && card.insights.length) || 0), 0)
})

const filteredCards = computed(() => {
  let cards = knowledgeCards.value

  // 搜索过滤
  if (searchKeyword.value.trim()) {
    const keyword = searchKeyword.value.toLowerCase()
    cards = cards.filter(card => 
      card.title.toLowerCase().includes(keyword) ||
      card.summary.toLowerCase().includes(keyword) ||
      (card.tags && card.tags.some(tag => tag.toLowerCase().includes(keyword)))
    )
  }

  // 分类过滤
  if (currentFilter.value !== 'all') {
    const now = Date.now()
    const oneWeek = 7 * 24 * 60 * 60 * 1000

    switch (currentFilter.value) {
      case 'recent':
        cards = cards.filter(card => (now - card.createdTime) < oneWeek)
        break
      case 'work':
        cards = cards.filter(card => 
          card.tags && card.tags.some(tag => ['工作', '效率', '沟通', '技能'].includes(tag))
        )
        break
      case 'study':
        cards = cards.filter(card => 
          card.tags && card.tags.some(tag => ['学习', '技能', '知识'].includes(tag))
        )
        break
      case 'emotion':
        cards = cards.filter(card => 
          card.tags && card.tags.some(tag => ['情绪', '心理', '压力'].includes(tag))
        )
        break
    }
  }

  return cards.sort((a, b) => b.createdTime - a.createdTime)
})

// 页面初始化
onMounted(() => {
  loadKnowledgeCards()
})

// 知识库相关方法
const loadKnowledgeCards = () => {
  try {
    const cards = uni.getStorageSync('knowledge_cards') || []
    knowledgeCards.value = cards
  } catch (error) {
    console.error('加载知识卡片失败:', error)
    knowledgeCards.value = []
  }
}

const removeKnowledgeCard = (cardId) => {
  uni.showModal({
    title: '确认删除',
    content: '确定要删除这张知识卡片吗？',
    success: (res) => {
      if (res.confirm) {
        knowledgeCards.value = knowledgeCards.value.filter(card => card.id !== cardId)
        uni.setStorageSync('knowledge_cards', knowledgeCards.value)
        uni.showToast({ title: '已删除知识卡片', icon: 'success' })
      }
    }
  })
}

const toggleKnowledgeSelection = (cardId) => {
  if (selectedKnowledge.value.has(cardId)) {
    selectedKnowledge.value.delete(cardId)
  } else {
    selectedKnowledge.value.add(cardId)
  }
}

const selectAllKnowledge = () => {
  if (selectedKnowledge.value.size === filteredCards.value.length) {
    selectedKnowledge.value.clear()
  } else {
    filteredCards.value.forEach(card => {
      selectedKnowledge.value.add(card.id)
    })
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
        isSelectionMode.value = false
        uni.showToast({ title: '删除成功', icon: 'success' })
      }
    }
  })
}

const onCardLongPress = (cardId) => {
  if (!isSelectionMode.value) {
    isSelectionMode.value = true
    selectedKnowledge.value.add(cardId)
    uni.vibrateShort()
  }
}

// 卡片详情相关方法
const viewKnowledgeCard = (card) => {
  selectedCard.value = card
  showCardDetail.value = true
}

const hideCardDetail = () => {
  showCardDetail.value = false
  selectedCard.value = null
}

// 搜索和筛选方法
const onSearchInput = () => {
  // 搜索输入处理，这里可以添加防抖逻辑
}

const setFilter = (filterKey) => {
  currentFilter.value = filterKey
}

const clearSearch = () => {
  searchKeyword.value = ''
  currentFilter.value = 'all'
}

// 分享和导出方法
const shareKnowledgeCard = (card) => {
  const shareContent = `【${card.title}】\n\n${card.summary}\n\n创建时间：${formatTime(card.createdTime)}\n基于${card.chatCount || 0}个对话生成`
  
  // #ifdef MP-WEIXIN
  uni.setClipboardData({
    data: shareContent,
    success: () => {
      uni.showToast({ title: '内容已复制到剪贴板', icon: 'success' })
    }
  })
  // #endif
  
  // #ifdef H5
  if (navigator.clipboard) {
    navigator.clipboard.writeText(shareContent).then(() => {
      uni.showToast({ title: '内容已复制到剪贴板', icon: 'success' })
    }).catch(() => {
      uni.showToast({ title: '复制失败', icon: 'error' })
    })
  }
  // #endif
}

const exportKnowledge = () => {
  const exportData = knowledgeCards.value.map(card => ({
    title: card.title,
    summary: card.summary,
    tags: card.tags || [],
    chatCount: card.chatCount || 0,
    createdTime: formatTime(card.createdTime)
  }))
  
  const exportContent = JSON.stringify(exportData, null, 2)
  
  uni.setClipboardData({
    data: exportContent,
    success: () => {
      uni.showToast({ title: '知识库数据已复制', icon: 'success' })
    }
  })
}

// 工具方法
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

const getCardPreview = (summary) => {
  if (!summary) return '暂无总结内容'
  return summary.length > 100 ? summary.substring(0, 100) + '...' : summary
}

// 导航方法
const goBack = () => {
  uni.navigateBack({
    delta: 1
  })
}

const goToChat = () => {
  uni.navigateTo({
    url: '/pages/chat/chat'
  })
}

// AI总结相关方法
const aiSummarizeSelectedKnowledge = async () => {
  if (selectedKnowledge.value.size === 0) {
    uni.showToast({ title: '请选择要总结的知识卡片', icon: 'none' })
    return
  }
  
  try {
    uni.showLoading({ title: 'AI分析中...' })
    
    // 获取选中的卡片
    const selectedCards = knowledgeCards.value.filter(card => 
      selectedKnowledge.value.has(card.id)
    )
    
    // 提取对话数据
    const selectedChats = []
    selectedCards.forEach(card => {
      if (card.chats && card.chats.length > 0) {
        selectedChats.push(...card.chats)
      }
    })
    
    if (selectedChats.length === 0) {
      uni.hideLoading()
      uni.showToast({ title: '选中的卡片没有对话数据', icon: 'none' })
      return
    }
    
    // 调用AI总结
    const summaryResult = await aiService.summarizeChatsForKnowledge(selectedChats)
    
    // 创建新的知识卡片
    const newKnowledgeCard = {
      id: generateMessageId(),
      ...summaryResult,
      createdTime: Date.now()
    }
    
    // 保存到知识库
    knowledgeCards.value.unshift(newKnowledgeCard)
    uni.setStorageSync('knowledge_cards', knowledgeCards.value)
    
    // 清除选择状态
    selectedKnowledge.value.clear()
    isSelectionMode.value = false
    
    uni.hideLoading()
    uni.showToast({ title: 'AI总结完成', icon: 'success' })
    
  } catch (error) {
    console.error('AI总结失败:', error)
    uni.hideLoading()
    uni.showToast({ title: 'AI总结失败，请重试', icon: 'error' })
  }
}

const aiAnalyzeSingleCard = async (card) => {
  if (!card || !card.needsAIAnalysis) {
    uni.showToast({ title: '该卡片已完成AI分析', icon: 'none' })
    return
  }
  
  try {
    uni.showLoading({ title: 'AI分析中...' })
    
    // 提取对话数据
    const selectedChats = card.chats || []
    
    if (selectedChats.length === 0) {
      uni.hideLoading()
      uni.showToast({ title: '该卡片没有对话数据', icon: 'none' })
      return
    }
    
    // 调用AI分析
    const analysisResult = await aiService.summarizeChatsForKnowledge(selectedChats)
    
    // 更新现有卡片
    const cardIndex = knowledgeCards.value.findIndex(c => c.id === card.id)
    if (cardIndex !== -1) {
      knowledgeCards.value[cardIndex] = {
        ...knowledgeCards.value[cardIndex],
        ...analysisResult,
        needsAIAnalysis: false // 标记为已完成AI分析
      }
      
      // 更新本地存储
      uni.setStorageSync('knowledge_cards', knowledgeCards.value)
      
      // 更新当前选中的卡片
      selectedCard.value = knowledgeCards.value[cardIndex]
    }
    
    uni.hideLoading()
    uni.showToast({ title: 'AI分析完成', icon: 'success' })
    
  } catch (error) {
    console.error('AI分析失败:', error)
    uni.hideLoading()
    uni.showToast({ title: 'AI分析失败，请重试', icon: 'error' })
  }
}
</script>

<style lang="scss" scoped>
.knowledge-container {
  width: 100vw;
  height: 100vh;
  background: linear-gradient(135deg, #e3f2fd 0%, #bbdefb 100%);
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

/* 顶部导航栏 */
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

.page-title {
  font-size: 36rpx;
  font-weight: bold;
  color: #2D3748;
}

.header-buttons {
  display: flex;
  align-items: center;
  gap: 15rpx;
}

.header-btn {
  min-width: 100rpx;
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
  
  &.ai-summary-btn {
    background: #E6FFFA;
    border-color: #38B2AC;
    
    .toolbar-btn-text {
      color: #38B2AC;
      font-weight: 600;
    }
  }
}

.toolbar-btn-text {
  font-size: 24rpx;
  color: #4A5568;
  font-weight: 500;
}

/* 统计信息 */
.stats-section {
  padding: 30rpx;
}

.stats-card {
  background: rgba(255, 255, 255, 0.95);
  border-radius: 20rpx;
  padding: 30rpx;
  display: flex;
  justify-content: space-around;
  box-shadow: 0 8rpx 24rpx rgba(0, 0, 0, 0.1);
  backdrop-filter: blur(10rpx);
}

.stat-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8rpx;
}

.stat-number {
  font-size: 48rpx;
  font-weight: bold;
  color: #667eea;
}

.stat-label {
  font-size: 24rpx;
  color: #718096;
}

/* 搜索和筛选 */
.filter-section {
  padding: 0 30rpx 20rpx;
}

.search-container {
  position: relative;
  margin-bottom: 20rpx;
}

.search-input {
  width: 100%;
  height: 80rpx;
  background: rgba(255, 255, 255, 0.95);
  border-radius: 40rpx;
  padding: 0 60rpx 0 30rpx;
  font-size: 28rpx;
  color: #2D3748;
  border: 2rpx solid transparent;
  transition: all 0.3s ease;
  
  &:focus {
    border-color: #667eea;
    background: white;
  }
  
  &::placeholder {
    color: #A0AEC0;
  }
}

.search-icon {
  position: absolute;
  right: 25rpx;
  top: 50%;
  transform: translateY(-50%);
  font-size: 28rpx;
  color: #A0AEC0;
}

.filter-tabs {
  display: flex;
  gap: 12rpx;
  overflow-x: auto;
}

.filter-tab {
  flex-shrink: 0;
  padding: 12rpx 24rpx;
  background: rgba(255, 255, 255, 0.7);
  border-radius: 20rpx;
  border: 2rpx solid transparent;
  transition: all 0.3s ease;
  
  &.active {
    background: rgba(102, 126, 234, 0.2);
    border-color: #667eea;
    
    .tab-text {
      color: #667eea;
      font-weight: 600;
    }
  }
  
  &:active {
    transform: scale(0.95);
  }
}

.tab-text {
  font-size: 24rpx;
  color: #4A5568;
  transition: all 0.3s ease;
}

/* 知识卡片列表 */
.knowledge-list {
  flex: 1;
  padding: 0 30rpx 40rpx;
  min-height: 0;
  box-sizing: border-box;
}

.knowledge-card {
  background: rgba(255, 255, 255, 0.95);
  border-radius: 20rpx;
  margin-bottom: 20rpx;
  padding: 30rpx;
  box-shadow: 0 8rpx 24rpx rgba(0, 0, 0, 0.1);
  backdrop-filter: blur(10rpx);
  transition: all 0.3s ease;
  position: relative;
  display: flex;
  gap: 20rpx;
  
  &:active {
    transform: scale(0.98);
    box-shadow: 0 4rpx 12rpx rgba(0, 0, 0, 0.15);
  }
  
  &.selection-mode {
    padding-left: 80rpx;
  }
  
  &.selected {
    background: rgba(102, 126, 234, 0.1);
    border: 2rpx solid #667eea;
  }
}

/* 选择指示器 */
.selection-indicator {
  position: absolute;
  left: 30rpx;
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
    background: #667eea;
    border-color: #667eea;
  }
}

.check-icon {
  font-size: 20rpx;
  color: white;
  font-weight: bold;
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
  font-size: 32rpx;
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
  background: rgba(102, 126, 234, 0.1);
  border-radius: 12rpx;
  padding: 6rpx 12rpx;
}

.tag-text {
  font-size: 20rpx;
  color: #667eea;
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
  margin-top: 8rpx;
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

.advice-count {
  font-size: 22rpx;
  color: #667eea;
  background: rgba(102, 126, 234, 0.1);
  padding: 4rpx 12rpx;
  border-radius: 12rpx;
}

.type-badge {
  font-size: 20rpx;
  color: #FF6B6B;
  background: rgba(255, 107, 107, 0.1);
  padding: 4rpx 10rpx;
  border-radius: 10rpx;
  font-weight: 600;
}

.pending-badge {
  font-size: 20rpx;
  color: #FFA500;
  background: rgba(255, 165, 0, 0.1);
  padding: 4rpx 10rpx;
  border-radius: 10rpx;
  font-weight: 600;
}

.card-actions {
  display: flex;
  flex-direction: column;
  gap: 12rpx;
  flex-shrink: 0;
}

.action-btn {
  width: 60rpx;
  height: 60rpx;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s ease;
  
  &:active {
    transform: scale(0.9);
  }
  
  &.share-btn {
    background: rgba(56, 178, 172, 0.1);
    
    .action-icon {
      color: #38B2AC;
    }
  }
  
  &.delete-btn {
    background: #FED7D7;
    
    .action-icon {
      color: #E53E3E;
    }
  }
}

.action-icon {
  font-size: 24rpx;
}

/* 空状态 */
.empty-state {
  padding: 100rpx 40rpx;
  text-align: center;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 20rpx;
}

.empty-icon {
  font-size: 120rpx;
  opacity: 0.3;
}

.empty-title {
  font-size: 32rpx;
  color: rgba(255, 255, 255, 0.9);
  font-weight: 600;
}

.empty-desc {
  font-size: 26rpx;
  color: rgba(255, 255, 255, 0.7);
  line-height: 1.5;
  max-width: 400rpx;
}

.empty-action {
  background: rgba(255, 255, 255, 0.2);
  border-radius: 30rpx;
  padding: 16rpx 32rpx;
  margin-top: 20rpx;
  backdrop-filter: blur(10rpx);
  border: 1rpx solid rgba(255, 255, 255, 0.3);
  transition: all 0.3s ease;
  
  &:active {
    transform: scale(0.95);
    background: rgba(255, 255, 255, 0.3);
  }
}

.action-text {
  font-size: 28rpx;
  color: white;
  font-weight: 500;
}

/* 卡片详情弹窗 */
.card-detail-overlay {
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

.card-detail-popup {
  background: white;
  border-radius: 24rpx;
  width: 700rpx;
  max-width: 90vw;
  max-height: 80vh;
  overflow: hidden;
  box-shadow: 0 20rpx 60rpx rgba(0, 0, 0, 0.3);
  animation: popupSlideIn 0.3s ease-out;
  display: flex;
  flex-direction: column;
}

.detail-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 40rpx 40rpx 20rpx;
  border-bottom: 1rpx solid #E2E8F0;
  flex-shrink: 0;
}

.detail-title {
  flex: 1;
  font-size: 32rpx;
  font-weight: bold;
  color: #2D3748;
  line-height: 1.4;
  margin-right: 20rpx;
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
  flex-shrink: 0;
  
  &:active {
    transform: scale(0.9);
    background: #EDF2F7;
  }
}

.detail-content {
  flex: 1;
  min-height: 0;
}

.detail-body {
  padding: 20rpx 40rpx;
}

.detail-section {
  margin-bottom: 40rpx;
  
  &:last-child {
    margin-bottom: 0;
  }
}

.section-title {
  display: block;
  font-size: 28rpx;
  font-weight: 600;
  color: #2D3748;
  margin-bottom: 16rpx;
}

.info-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 20rpx;
}

.info-item {
  display: flex;
  flex-direction: column;
  gap: 8rpx;
}

.info-label {
  font-size: 24rpx;
  color: #718096;
}

.info-value {
  font-size: 26rpx;
  color: #2D3748;
  font-weight: 500;
}

.detail-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 12rpx;
}

.detail-tag {
  background: rgba(102, 126, 234, 0.1);
  border-radius: 16rpx;
  padding: 8rpx 16rpx;
}

.summary-content {
  font-size: 28rpx;
  color: #4A5568;
  line-height: 1.6;
}

.insights-list {
  display: flex;
  flex-direction: column;
  gap: 12rpx;
}

.insight-item {
  background: rgba(56, 178, 172, 0.1);
  border-radius: 12rpx;
  padding: 16rpx;
  border-left: 4rpx solid #38B2AC;
}

.insight-text {
  font-size: 26rpx;
  color: #2D3748;
  line-height: 1.5;
}

.advice-list {
  display: flex;
  flex-direction: column;
  gap: 12rpx;
}

.advice-item {
  background: rgba(102, 126, 234, 0.1);
  border-radius: 12rpx;
  padding: 16rpx;
  border-left: 4rpx solid #667eea;
  position: relative;
  
  &::before {
    content: '💡';
    position: absolute;
    left: -2rpx;
    top: -2rpx;
    font-size: 20rpx;
    background: #667eea;
    color: white;
    width: 32rpx;
    height: 32rpx;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    line-height: 1;
  }
}

.advice-text {
  font-size: 26rpx;
  color: #2D3748;
  line-height: 1.5;
  margin-left: 20rpx;
}

.emotional-pattern {
  background: rgba(255, 192, 203, 0.1);
  border-radius: 12rpx;
  padding: 16rpx;
  border-left: 4rpx solid #FF69B4;
}

.pattern-content {
  font-size: 26rpx;
  color: #2D3748;
  line-height: 1.6;
  font-style: italic;
}

.related-chats {
  display: flex;
  flex-direction: column;
  gap: 12rpx;
}

.chat-item {
  background: #F7FAFC;
  border-radius: 12rpx;
  padding: 16rpx;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.chat-title {
  flex: 1;
  font-size: 26rpx;
  color: #2D3748;
  font-weight: 500;
  margin-right: 20rpx;
}

.chat-time {
  font-size: 22rpx;
  color: #A0AEC0;
  flex-shrink: 0;
}

.detail-actions {
  display: flex;
  gap: 20rpx;
  padding: 20rpx 40rpx 40rpx;
  flex-shrink: 0;
}

.action-button {
  flex: 1;
  height: 80rpx;
  border-radius: 40rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s ease;
  
  &:active {
    transform: scale(0.95);
  }
  
  &.primary {
    background: #667eea;
    
    .button-text {
      color: white;
    }
  }
  
  &.secondary {
    background: #F7FAFC;
    border: 2rpx solid #E2E8F0;
    
    .button-text {
      color: #4A5568;
    }
  }
  
  &.ai-analysis-btn {
    background: #E6FFFA;
    border: 2rpx solid #38B2AC;
    
    .button-text {
      color: #38B2AC;
      font-weight: 600;
    }
  }
}

.button-text {
  font-size: 28rpx;
  font-weight: 500;
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
</style>
