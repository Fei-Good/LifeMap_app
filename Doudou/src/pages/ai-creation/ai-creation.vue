<template>
  <view class="ai-creation-container">
    <!-- 状态栏占位 -->
    <view class="status-bar"></view>
    
    <!-- 顶部导航栏 -->
    <view class="header-toolbar">
      <view class="toolbar-left">
        <view class="back-btn" @click="goBack">
          <text class="back-icon">←</text>
        </view>
        <text class="page-title">AI创作</text>
      </view>
      <view class="toolbar-right">
        <view class="header-btn" @click="showHelp">
          <text class="btn-text">帮助</text>
        </view>
        <view class="header-btn" @click="smartRecommend">
          <text class="btn-text">推荐</text>
        </view>
        <view class="header-btn" @click="clearAll">
          <text class="btn-text">清空</text>
        </view>
      </view>
    </view>

    <!-- 主要内容区域 -->
    <scroll-view class="main-content" scroll-y="true">
      <!-- 聊天记录选择区域 -->
      <view class="section">
        <view class="section-header">
          <text class="section-title">选择聊天记录</text>
          <view class="expand-btn" @click="toggleChatSection">
            <text class="expand-icon">{{ chatSectionExpanded ? '▼' : '▶' }}</text>
          </view>
        </view>
        
        <view v-if="chatSectionExpanded" class="section-content">
          <view class="selection-info">
            <text class="info-text">已选择 {{ selectedChats.length }} 条聊天记录</text>
            <view class="action-btn" @click="selectAllChats">
              <text class="btn-text">全选</text>
            </view>
          </view>
          
          <view class="chat-list">
            <view v-if="chatHistory.length === 0" class="empty-state">
              <text class="empty-icon">💬</text>
              <text class="empty-text">暂无聊天记录</text>
              <view class="empty-action" @click="goToChat">
                <text class="action-text">去聊天</text>
              </view>
            </view>
            <view 
              v-else
              v-for="(chat, index) in chatHistory" 
              :key="index"
              class="chat-item"
              :class="{ 'selected': selectedChats.includes(index) }"
              @click="toggleChatSelection(index)"
            >
              <view class="chat-preview">
                <text class="chat-role">{{ chat.role === 'user' ? '我' : 'DouDou' }}</text>
                <text class="chat-content">{{ chat.content.substring(0, 100) }}{{ chat.content.length > 100 ? '...' : '' }}</text>
              </view>
              <view class="chat-time">
                <text class="time-text">{{ formatTime(chat.timestamp) }}</text>
              </view>
              <view class="selection-indicator">
                <text class="indicator-icon">{{ selectedChats.includes(index) ? '✓' : '' }}</text>
              </view>
            </view>
          </view>
        </view>
      </view>

      <!-- 知识卡片选择区域 -->
      <view class="section">
        <view class="section-header">
          <text class="section-title">选择知识卡片</text>
          <view class="expand-btn" @click="toggleKnowledgeSection">
            <text class="expand-icon">{{ knowledgeSectionExpanded ? '▼' : '▶' }}</text>
          </view>
        </view>
        
        <view v-if="knowledgeSectionExpanded" class="section-content">
          <view class="selection-info">
            <text class="info-text">已选择 {{ selectedKnowledge.length }} 张知识卡片</text>
            <view class="action-btn" @click="selectAllKnowledge">
              <text class="btn-text">全选</text>
            </view>
          </view>
          
          <view class="knowledge-list">
            <view v-if="knowledgeCards.length === 0" class="empty-state">
              <text class="empty-icon">📚</text>
              <text class="empty-text">暂无知识卡片</text>
              <view class="empty-action" @click="goToKnowledge">
                <text class="action-text">去知识库</text>
              </view>
            </view>
            <view 
              v-else
              v-for="(knowledge, index) in knowledgeCards" 
              :key="knowledge.id || index"
              class="knowledge-item"
              :class="{ 'selected': selectedKnowledge.includes(index) }"
              @click="toggleKnowledgeSelection(index)"
            >
              <view class="knowledge-preview">
                <text class="knowledge-title">{{ knowledge.title || '无标题' }}</text>
                <text class="knowledge-content">{{ getKnowledgePreview(knowledge) }}</text>
              </view>
              <view class="knowledge-meta">
                <text class="meta-text">{{ formatTime(knowledge.createdTime) }}</text>
                <text v-if="knowledge.tags && knowledge.tags.length > 0" class="meta-tags">{{ knowledge.tags.slice(0, 2).join('、') }}</text>
              </view>
              <view class="selection-indicator">
                <text class="indicator-icon">{{ selectedKnowledge.includes(index) ? '✓' : '' }}</text>
              </view>
            </view>
          </view>
        </view>
      </view>

      <!-- 自定义文本输入区域 -->
      <view class="section">
        <view class="section-header">
          <text class="section-title">自定义文本</text>
        </view>
        
        <view class="section-content">
          <textarea 
            class="custom-input"
            v-model="customText"
            placeholder="输入您想要添加的自定义文本内容..."
            :maxlength="1000"
          />
          <view class="input-counter">
            <text class="counter-text">{{ customText.length }}/1000</text>
          </view>
        </view>
      </view>

      <!-- 创作类型选择 -->
      <view class="section">
        <view class="section-header">
          <text class="section-title">创作类型</text>
        </view>
        
        <view class="section-content">
          <view class="creation-types">
            <view 
              class="type-item"
              :class="{ 'active': creationType === 'image' }"
              @click="setCreationType('image')"
            >
              <text class="type-icon">🖼️</text>
              <text class="type-text">生成图片</text>
            </view>
            <view 
              class="type-item"
              :class="{ 'active': creationType === 'video' }"
              @click="setCreationType('video')"
            >
              <text class="type-icon">🎬</text>
              <text class="type-text">生成视频</text>
            </view>
          </view>
        </view>
      </view>

      <!-- 预览区域 -->
      <view class="section">
        <view class="section-header">
          <text class="section-title">内容预览</text>
        </view>
        
        <view class="section-content">
          <view class="preview-content">
            <text class="preview-text">{{ getPreviewText() }}</text>
          </view>
        </view>
      </view>
    </scroll-view>

    <!-- 底部操作栏 -->
    <view class="bottom-toolbar">
      <view class="toolbar-info">
        <text class="info-text">{{ getSelectionSummary() }}</text>
      </view>
      <view class="toolbar-actions">
        <view class="action-btn secondary" @click="previewContent">
          <text class="btn-text">预览</text>
        </view>
        <view 
          class="action-btn primary" 
          :class="{ 'disabled': !canGenerate() }"
          @click="generateContent"
        >
          <text class="btn-text">开始创作</text>
        </view>
      </view>
    </view>

    <!-- 创作进度弹窗 -->
    <view v-if="creationProgress.show" class="creation-progress-overlay">
      <view class="creation-progress-modal">
        <view class="progress-header">
          <text class="progress-title">AI创作中</text>
          <view v-if="!creationProgress.result && !creationProgress.error" class="progress-close" @click="closeCreationProgress">
            <text class="close-icon">✕</text>
          </view>
        </view>
        
        <!-- 进度内容 -->
        <view class="progress-content">
          <!-- 创作中状态 -->
          <view v-if="!creationProgress.result && !creationProgress.error" class="progress-creating">
            <view class="progress-animation">
              <view class="loading-spinner"></view>
            </view>
            <text class="progress-message">{{ creationProgress.message }}</text>
            <view class="progress-bar">
              <view class="progress-fill" :style="{ width: creationProgress.progress + '%' }"></view>
            </view>
            <text class="progress-percent">{{ creationProgress.progress }}%</text>
          </view>
          
          <!-- 创作完成状态 -->
          <view v-if="creationProgress.result" class="progress-completed">
            <view class="result-preview">
              <image 
                v-if="creationProgress.result.type === 'image'"
                class="result-image" 
                :src="creationProgress.result.thumbnail || creationProgress.result.url"
                mode="aspectFit"
                @click="viewCreationResult"
              />
              <view v-else class="result-video">
                <video 
                  class="result-video-player"
                  :src="creationProgress.result.url"
                  :poster="creationProgress.result.thumbnail"
                  controls
                  autoplay="false"
                  loop="false"
                  muted="false"
                  @error="onVideoError"
                  @loadstart="onVideoLoadStart"
                  @canplay="onVideoCanPlay"
                  @click="viewCreationResult"
                >
                </video>
                <view class="video-overlay" @click="viewCreationResult">
                  <view class="play-button">
                    <text class="play-icon">▶</text>
                  </view>
                </view>
                <text class="video-title">{{ creationProgress.result.result.title }}</text>
              </view>
            </view>
            <text class="result-title">{{ creationProgress.result.result.title }}</text>
            <text class="result-description">{{ creationProgress.result.result.description }}</text>
            
            <view class="result-actions">
              <view class="action-btn secondary" @click="viewCreationResult">
                <text class="btn-text">查看</text>
              </view>
              <view class="action-btn secondary" @click="saveCreationResult">
                <text class="btn-text">保存</text>
              </view>
              <view class="action-btn primary" @click="shareCreationResult">
                <text class="btn-text">分享</text>
              </view>
            </view>
          </view>
          
          <!-- 创作失败状态 -->
          <view v-if="creationProgress.error" class="progress-error">
            <view class="error-icon">
              <text class="icon-text">❌</text>
            </view>
            <text class="error-message">{{ creationProgress.error }}</text>
            <view class="error-actions">
              <view class="action-btn secondary" @click="closeCreationProgress">
                <text class="btn-text">关闭</text>
              </view>
              <view class="action-btn primary" @click="generateContent">
                <text class="btn-text">重试</text>
              </view>
            </view>
          </view>
        </view>
      </view>
    </view>

    <!-- 查看创作结果弹窗 -->
    <view v-if="viewResultModal.show" class="view-result-overlay">
      <view class="view-result-modal">
        <view class="view-result-header">
          <text class="view-result-title">创作结果</text>
          <view class="view-result-close" @click="closeViewResultModal">
            <text class="close-icon">✕</text>
          </view>
        </view>
        
        <view class="view-result-content">
          <!-- 图片查看 -->
          <view v-if="viewResultModal.result && viewResultModal.result.type === 'image'" class="image-view-container">
            <image 
              class="full-image" 
              :src="viewResultModal.result.url"
              mode="aspectFit"
              @load="onImageLoad"
              @error="onImageError"
            />
            <view class="image-info">
              <text class="info-item">尺寸: {{ imageInfo.width }}x{{ imageInfo.height }}</text>
              <text class="info-item">格式: {{ getFileFormat(viewResultModal.result.url) }}</text>
            </view>
          </view>
          
          <!-- 视频查看 -->
          <view v-if="viewResultModal.result && viewResultModal.result.type === 'video'" class="video-view-container">
            <video 
              class="full-video"
              :src="viewResultModal.result.url"
              :poster="viewResultModal.result.thumbnail"
              controls
              autoplay="false"
              loop="false"
              muted="false"
              @error="onVideoError"
              @loadstart="onVideoLoadStart"
              @canplay="onVideoCanPlay"
              @timeupdate="onVideoTimeUpdate"
              @loadedmetadata="onVideoLoadedMetadata"
            >
            </video>
            <view class="video-info">
              <text class="info-item">时长: {{ formatDuration(videoInfo.duration) }}</text>
              <text class="info-item">格式: {{ getFileFormat(viewResultModal.result.url) }}</text>
            </view>
          </view>
          
          <!-- 结果详情 -->
          <view class="result-details">
            <text class="detail-title">{{ viewResultModal.result.result.title }}</text>
            <text class="detail-description">{{ viewResultModal.result.result.description }}</text>
            <view class="detail-meta">
              <text class="meta-item">创作时间: {{ formatTime(viewResultModal.result.timestamp) }}</text>
              <text class="meta-item">AI模型: {{ viewResultModal.result.source === 'doubao_api' ? 'Doubao AI' : '本地模型' }}</text>
            </view>
          </view>
        </view>
        
        <view class="view-result-actions">
          <view class="action-btn secondary" @click="downloadResult">
            <text class="btn-text">下载</text>
          </view>
          <view class="action-btn secondary" @click="saveCreationResult">
            <text class="btn-text">保存到相册</text>
          </view>
          <view class="action-btn primary" @click="shareCreationResult">
            <text class="btn-text">分享</text>
          </view>
        </view>
      </view>
    </view>
  </view>
</template>

<script>
export default {
  name: 'AICreation',
  data() {
    return {
      // 展开状态
      chatSectionExpanded: true,
      knowledgeSectionExpanded: false,
      
      // 选择状态
      selectedChats: [],
      selectedKnowledge: [],
      customText: '',
      creationType: 'image', // 'image' 或 'video'
      
      // 数据
      chatHistory: [],
      knowledgeCards: [],
      
      // 创作进度
      creationProgress: {
        show: false,
        step: 0,
        message: '',
        progress: 0,
        result: null,
        error: null
      },
      
      // 查看结果弹窗
      viewResultModal: {
        show: false,
        result: null
      },
      
      // 媒体信息
      imageInfo: {
        width: 0,
        height: 0
      },
      videoInfo: {
        duration: 0,
        currentTime: 0
      }
    }
  },
  
  onLoad() {
    this.loadChatHistory()
    this.loadKnowledgeCards()
  },
  
  methods: {
    // 返回chat页面
    goBack() {
      uni.navigateTo({
        url: '/pages/chat/chat'
      })
    },
    
    // 清空所有选择
    clearAll() {
      this.selectedChats = []
      this.selectedKnowledge = []
      this.customText = ''
      uni.showToast({
        title: '已清空所有选择',
        icon: 'success'
      })
    },
    
    // 切换聊天记录区域展开状态
    toggleChatSection() {
      this.chatSectionExpanded = !this.chatSectionExpanded
    },
    
    // 切换知识卡片区域展开状态
    toggleKnowledgeSection() {
      this.knowledgeSectionExpanded = !this.knowledgeSectionExpanded
    },
    
    // 切换聊天记录选择
    toggleChatSelection(index) {
      const selectedIndex = this.selectedChats.indexOf(index)
      if (selectedIndex > -1) {
        this.selectedChats.splice(selectedIndex, 1)
      } else {
        this.selectedChats.push(index)
      }
    },
    
    // 全选聊天记录
    selectAllChats() {
      if (this.selectedChats.length === this.chatHistory.length) {
        this.selectedChats = []
      } else {
        this.selectedChats = this.chatHistory.map((_, index) => index)
      }
    },
    
    // 切换知识卡片选择
    toggleKnowledgeSelection(index) {
      const selectedIndex = this.selectedKnowledge.indexOf(index)
      if (selectedIndex > -1) {
        this.selectedKnowledge.splice(selectedIndex, 1)
      } else {
        this.selectedKnowledge.push(index)
      }
    },
    
    // 全选知识卡片
    selectAllKnowledge() {
      if (this.selectedKnowledge.length === this.knowledgeCards.length) {
        this.selectedKnowledge = []
      } else {
        this.selectedKnowledge = this.knowledgeCards.map((_, index) => index)
      }
    },
    
    // 设置创作类型
    setCreationType(type) {
      this.creationType = type
    },
    
    // 格式化时间
    formatTime(timestamp) {
      if (!timestamp) return ''
      const date = new Date(timestamp)
      const now = new Date()
      const diff = now - date
      
      if (diff < 60000) { // 1分钟内
        return '刚刚'
      } else if (diff < 3600000) { // 1小时内
        return Math.floor(diff / 60000) + '分钟前'
      } else if (diff < 86400000) { // 1天内
        return Math.floor(diff / 3600000) + '小时前'
      } else {
        return date.toLocaleDateString()
      }
    },
    
    // 获取知识卡片预览文本
    getKnowledgePreview(knowledge) {
      if (knowledge.summary) {
        return knowledge.summary.length > 80 ? knowledge.summary.substring(0, 80) + '...' : knowledge.summary
      }
      return '暂无总结内容'
    },
    
    // 获取预览文本
    getPreviewText() {
      let previewText = ''
      
      // 添加选中的聊天记录
      if (this.selectedChats.length > 0) {
        previewText += '【聊天记录】\n'
        this.selectedChats.forEach(index => {
          const chat = this.chatHistory[index]
          const roleText = chat.role === 'user' ? '我' : 'DouDou'
          previewText += `${roleText}: ${chat.content}\n`
        })
        previewText += '\n'
      }
      
      // 添加选中的知识卡片
      if (this.selectedKnowledge.length > 0) {
        previewText += '【知识卡片】\n'
        this.selectedKnowledge.forEach(index => {
          const knowledge = this.knowledgeCards[index]
          previewText += `${knowledge.title || '无标题'}: ${knowledge.summary || '暂无总结内容'}\n`
          if (knowledge.insights && knowledge.insights.length > 0) {
            previewText += `关键洞察: ${knowledge.insights.join('；')}\n`
          }
        })
        previewText += '\n'
      }
      
      // 添加自定义文本
      if (this.customText.trim()) {
        previewText += '【自定义文本】\n'
        previewText += this.customText.trim()
      }
      
      return previewText || '暂无内容，请选择聊天记录、知识卡片或输入自定义文本'
    },
    
    // 获取选择摘要
    getSelectionSummary() {
      const chatCount = this.selectedChats.length
      const knowledgeCount = this.selectedKnowledge.length
      const hasCustomText = this.customText.trim().length > 0
      
      let summary = []
      if (chatCount > 0) summary.push(`${chatCount}条聊天`)
      if (knowledgeCount > 0) summary.push(`${knowledgeCount}张卡片`)
      if (hasCustomText) summary.push('自定义文本')
      
      return summary.length > 0 ? `已选择: ${summary.join('、')}` : '请选择要用于创作的内容'
    },
    
    // 检查是否可以生成
    canGenerate() {
      return this.selectedChats.length > 0 || 
             this.selectedKnowledge.length > 0 || 
             this.customText.trim().length > 0
    },
    
    // 预览内容
    previewContent() {
      if (!this.canGenerate()) {
        uni.showToast({
          title: '请先选择内容',
          icon: 'none'
        })
        return
      }
      
      uni.showModal({
        title: '内容预览',
        content: this.getPreviewText(),
        showCancel: false,
        confirmText: '确定'
      })
    },
    
    // 生成内容
    async generateContent() {
      if (!this.canGenerate()) {
        uni.showToast({
          title: '请先选择内容',
          icon: 'none'
        })
        return
      }

      // 检查网络状态
      const hasNetwork = await new Promise((resolve) => {
        uni.getNetworkType({
          success: (res) => {
            resolve(res.networkType !== 'none')
          },
          fail: () => {
            resolve(false)
          }
        })
      })

      if (!hasNetwork) {
        uni.showModal({
          title: '网络异常',
          content: 'AI创作需要网络连接，请检查您的网络设置后重试',
          showCancel: false,
          confirmText: '确定'
        })
        return
      }

      // 估算创作时间并提示用户
      const estimatedTime = this.estimateCreationTime()
      const timeText = estimatedTime < 60 ? `约${estimatedTime}秒` : `约${Math.ceil(estimatedTime/60)}分钟`
      
      uni.showModal({
        title: '开始AI创作',
        content: `预计用时${timeText}，创作过程中请保持网络连接。确认开始创作吗？`,
        confirmText: '开始创作',
        cancelText: '取消',
        success: (res) => {
          if (res.confirm) {
            // 准备创作数据
            const creationData = {
              type: this.creationType,
              selectedChats: this.selectedChats.map(index => this.chatHistory[index]),
              selectedKnowledge: this.selectedKnowledge.map(index => this.knowledgeCards[index]),
              customText: this.customText,
              timestamp: Date.now()
            }

            // 显示创作进度弹窗
            this.showCreationProgress(creationData)
          }
        }
      })
    },

    // 显示创作进度
    showCreationProgress(creationData) {
      // 创建进度弹窗数据
      this.creationProgress = {
        show: true,
        step: 0,
        message: '准备开始创作...',
        progress: 0,
        result: null,
        error: null
      }

      // 开始创作
      this.startCreation(creationData)
    },

    // 开始AI创作
    async startCreation(creationData) {
      try {
        const aiService = (await import('../../utils/aiService.js')).default
        
        // 验证Doubao API连接
        this.creationProgress.message = '检查AI服务连接...'
        this.creationProgress.progress = 5
        
        const isConnected = await aiService.validateDoubaoConnection()
        if (!isConnected) {
          console.warn('Doubao API连接失败，将使用备用方案')
        }
        
        // 优化创作内容
        this.creationProgress.message = '优化创作内容...'
        this.creationProgress.progress = 10
        
        const optimizedData = aiService.optimizeCreationContent(creationData)
        console.log('优化后的创作数据:', optimizedData)
        
        // 调用AI创作服务
        const result = await aiService.generateCreativeContent(
          optimizedData,
          (progress) => {
            // 更新进度
            this.creationProgress.step = progress.step || 0
            this.creationProgress.message = progress.message || '创作中...'
            this.creationProgress.progress = progress.progress || 0
          }
        )

        // 创作完成
        this.creationProgress.result = result
        this.creationProgress.message = result.source === 'doubao_api' ? 
          '🎉 Doubao AI创作完成！' : '创作完成！'
        this.creationProgress.progress = 100

        // 保存到历史记录
        aiService.saveCreationToHistory(result)

        // 显示成功提示
        setTimeout(() => {
          uni.showToast({
            title: result.source === 'doubao_api' ? 'Doubao创作成功！' : '创作完成！',
            icon: 'success'
          })
        }, 500)

      } catch (error) {
        console.error('AI创作失败:', error)
        this.creationProgress.error = error.message || '创作失败，请稍后重试'
        this.creationProgress.message = '创作失败'
        
        // 提供更详细的错误信息
        let errorMessage = '创作失败'
        if (error.message.includes('网络')) {
          errorMessage = '网络连接失败，请检查网络后重试'
        } else if (error.message.includes('API')) {
          errorMessage = 'AI服务暂时不可用，请稍后重试'
        } else if (error.message.includes('超时')) {
          errorMessage = '创作超时，请简化内容后重试'
        }
        
        uni.showToast({
          title: errorMessage,
          icon: 'error',
          duration: 3000
        })
      }
    },

    // 关闭创作进度弹窗
    closeCreationProgress() {
      this.creationProgress.show = false
      // 清空进度数据
      setTimeout(() => {
        this.creationProgress = {
          show: false,
          step: 0,
          message: '',
          progress: 0,
          result: null,
          error: null
        }
      }, 300)
    },

    // 查看创作结果
    viewCreationResult() {
      if (!this.creationProgress.result) return

      // 设置查看弹窗数据
      this.viewResultModal.result = this.creationProgress.result
      this.viewResultModal.show = true
      
      // 重置媒体信息
      this.imageInfo = { width: 0, height: 0 }
      this.videoInfo = { duration: 0, currentTime: 0 }
    },

    // 关闭查看结果弹窗
    closeViewResultModal() {
      this.viewResultModal.show = false
      // 清空数据
      setTimeout(() => {
        this.viewResultModal.result = null
        this.imageInfo = { width: 0, height: 0 }
        this.videoInfo = { duration: 0, currentTime: 0 }
      }, 300)
    },

    // 图片加载完成
    onImageLoad(e) {
      if (e.detail && e.detail.width && e.detail.height) {
        this.imageInfo.width = e.detail.width
        this.imageInfo.height = e.detail.height
      }
    },

    // 图片加载失败
    onImageError(e) {
      console.error('图片加载失败:', e)
      uni.showToast({
        title: '图片加载失败',
        icon: 'error'
      })
    },

    // 视频时间更新
    onVideoTimeUpdate(e) {
      if (e.detail && e.detail.currentTime) {
        this.videoInfo.currentTime = e.detail.currentTime
      }
    },

    // 视频元数据加载完成
    onVideoLoadedMetadata(e) {
      if (e.detail && e.detail.duration) {
        this.videoInfo.duration = e.detail.duration
      }
    },

    // 获取文件格式
    getFileFormat(url) {
      if (!url) return '未知'
      const extension = url.split('.').pop().toLowerCase()
      const formatMap = {
        'jpg': 'JPEG',
        'jpeg': 'JPEG', 
        'png': 'PNG',
        'gif': 'GIF',
        'webp': 'WebP',
        'mp4': 'MP4',
        'avi': 'AVI',
        'mov': 'MOV',
        'wmv': 'WMV',
        'flv': 'FLV'
      }
      return formatMap[extension] || extension.toUpperCase()
    },

    // 格式化时长
    formatDuration(seconds) {
      if (!seconds || seconds <= 0) return '00:00'
      const mins = Math.floor(seconds / 60)
      const secs = Math.floor(seconds % 60)
      return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
    },

    // 下载结果
    downloadResult() {
      if (!this.viewResultModal.result) return

      const result = this.viewResultModal.result
      
      // 调用下载功能
      uni.downloadFile({
        url: result.url,
        success: (res) => {
          if (res.statusCode === 200) {
            uni.showToast({
              title: '下载成功',
              icon: 'success'
            })
            
            // 如果是图片，还可以保存到相册
            if (result.type === 'image') {
              uni.saveImageToPhotosAlbum({
                filePath: res.tempFilePath,
                success: () => {
                  uni.showToast({
                    title: '已保存到相册',
                    icon: 'success'
                  })
                }
              })
            }
          }
        },
        fail: () => {
          uni.showToast({
            title: '下载失败',
            icon: 'error'
          })
        }
      })
    },

    // 保存创作结果
    saveCreationResult() {
      if (!this.creationProgress.result) return

      // 保存到相册或下载
      if (this.creationProgress.result.type === 'image') {
        uni.saveImageToPhotosAlbum({
          filePath: this.creationProgress.result.url,
          success: () => {
            uni.showToast({
              title: '已保存到相册',
              icon: 'success'
            })
          },
          fail: () => {
            uni.showToast({
              title: '保存失败',
              icon: 'error'
            })
          }
        })
      } else {
        uni.showToast({
          title: '视频保存功能开发中',
          icon: 'none'
        })
      }
    },

    // 分享创作结果
    shareCreationResult() {
      if (!this.creationProgress.result) return

      uni.share({
        provider: 'weixin',
        scene: 'WXSceneSession',
        type: this.creationProgress.result.type === 'image' ? 2 : 5,
        imageUrl: this.creationProgress.result.thumbnail || this.creationProgress.result.url,
        title: this.creationProgress.result.result.title,
        summary: this.creationProgress.result.result.description,
        success: () => {
          uni.showToast({
            title: '分享成功',
            icon: 'success'
          })
        },
        fail: () => {
          uni.showToast({
            title: '分享失败',
            icon: 'error'
          })
        }
      })
    },
    
    // 加载聊天历史
    loadChatHistory() {
      try {
        // 从chat.vue中使用的存储键获取聊天历史
        const chatHistories = uni.getStorageSync('chat_histories') || []
        
        // 将所有聊天记录的消息展平为单条消息列表
        const allMessages = []
        chatHistories.forEach(chatHistory => {
          if (chatHistory.messages && Array.isArray(chatHistory.messages)) {
            chatHistory.messages.forEach(message => {
              // 添加聊天会话信息到消息中
              allMessages.push({
                ...message,
                chatId: chatHistory.id,
                chatTitle: chatHistory.title,
                role: message.isUser ? 'user' : 'assistant',
                content: message.content,
                timestamp: message.timestamp
              })
            })
          }
        })
        
        // 按时间倒序排列，只显示最近50条
        this.chatHistory = allMessages
          .sort((a, b) => b.timestamp - a.timestamp)
          .slice(0, 50)

        // 如果没有聊天记录，给用户提示
        if (this.chatHistory.length === 0) {
          setTimeout(() => {
            uni.showToast({
              title: '暂无聊天记录，请先与DouDou聊天',
              icon: 'none',
              duration: 3000
            })
          }, 500)
        }
          
      } catch (e) {
        console.error('加载聊天历史失败:', e)
        this.chatHistory = []
        uni.showToast({
          title: '加载聊天记录失败',
          icon: 'error'
        })
      }
    },
    
    // 加载知识卡片
    loadKnowledgeCards() {
      try {
        // 从knowledge.vue中使用的存储键获取知识卡片
        const knowledgeCards = uni.getStorageSync('knowledge_cards') || []
        
        // 按时间倒序排列，只显示最近50张
        this.knowledgeCards = knowledgeCards
          .sort((a, b) => b.createdTime - a.createdTime)
          .slice(0, 50)

        // 如果没有知识卡片，给用户提示
        if (this.knowledgeCards.length === 0) {
          console.log('暂无知识卡片，用户可以通过自定义文本进行创作')
        }
          
      } catch (e) {
        console.error('加载知识卡片失败:', e)
        this.knowledgeCards = []
        uni.showToast({
          title: '加载知识卡片失败',
          icon: 'error'
        })
      }
    },

    // 显示使用帮助
    async showHelp() {
      const aiService = (await import('../../utils/aiService.js')).default
      const isConnected = await aiService.validateDoubaoConnection()
      
      const helpContent = `🤖 AI创作助手 (Powered by Doubao AI)

✨ 功能介绍：
• 基于聊天记录生成创意内容
• 结合知识卡片深度创作
• 支持自定义创作要求
• 智能优化提示词内容

🎯 使用步骤：
1. 选择聊天记录或知识卡片
2. 添加自定义创作要求（可选）
3. 选择创作类型（图片/视频）
4. 开始创作并等待生成

🔧 技术信息：
• AI模型：${aiService.apiConfig.contentGenerationModel}
• 连接状态：${isConnected ? '✅ 正常' : '⚠️ 异常'}
• 支持类型：图片生成、视频创作

💡 创作建议：
• 内容越具体，创作效果越好
• 可结合多种素材获得更好效果
• 创作过程需要1-2分钟，请耐心等待`

      uni.showModal({
        title: 'AI创作帮助',
        content: helpContent,
        showCancel: false,
        confirmText: '我知道了'
      })
    },

    // 跳转到聊天页面
    goToChat() {
      uni.navigateTo({
        url: '/pages/chat/chat'
      })
    },

    // 跳转到知识库页面
    goToKnowledge() {
      uni.navigateTo({
        url: '/pages/knowledge/knowledge'
      })
    },

    // 智能推荐内容
    smartRecommend() {
      if (this.chatHistory.length === 0 && this.knowledgeCards.length === 0) {
        uni.showModal({
          title: '暂无可推荐内容',
          content: '您还没有聊天记录和知识卡片。建议您先与DouDou聊天或保存一些知识内容，这样就能获得更好的创作素材了！',
          confirmText: '去聊天',
          cancelText: '稍后',
          success: (res) => {
            if (res.confirm) {
              this.goToChat()
            }
          }
        })
        return
      }

      // 智能推荐逻辑：选择最近的对话和知识
      const recommendedChats = this.chatHistory.slice(0, 3).map((_, index) => index)
      const recommendedKnowledge = this.knowledgeCards.slice(0, 2).map((_, index) => index)

      this.selectedChats = recommendedChats
      this.selectedKnowledge = recommendedKnowledge

      uni.showToast({
        title: '已为您智能推荐内容',
        icon: 'success'
      })
    },

    // 检查网络状态
    checkNetworkStatus() {
      uni.getNetworkType({
        success: (res) => {
          if (res.networkType === 'none') {
            uni.showModal({
              title: '网络异常',
              content: 'AI创作需要网络连接，请检查您的网络设置',
              showCancel: false,
              confirmText: '确定'
            })
            return false
          }
          return true
        },
        fail: () => {
          uni.showToast({
            title: '网络检测失败',
            icon: 'error'
          })
          return false
        }
      })
    },

    // 估算创作时间
    estimateCreationTime() {
      const baseTime = this.creationType === 'image' ? 30 : 60 // 基础时间（秒）
      const contentComplexity = (this.selectedChats.length * 5) + 
                               (this.selectedKnowledge.length * 10) + 
                               (this.customText.length / 10)
      
      return Math.max(baseTime, baseTime + contentComplexity)
    },

    // 全屏播放视频
    playVideoFullscreen(videoUrl) {
      if (!videoUrl) {
        uni.showToast({
          title: '视频链接无效',
          icon: 'error'
        })
        return
      }

      try {
        // 根据不同平台使用不同的播放方式
        // #ifdef APP-PLUS
        // APP端直接使用系统播放器
        plus.runtime.openURL(videoUrl)
        uni.showToast({
          title: '正在打开视频播放器',
          icon: 'success',
          duration: 1500
        })
        // #endif
        
        // #ifdef H5
        // H5端在新窗口打开视频
        const newWindow = window.open(videoUrl, '_blank')
        if (newWindow) {
          uni.showToast({
            title: '已在新窗口打开视频',
            icon: 'success',
            duration: 1500
          })
        } else {
          // 如果弹窗被阻止，则提示用户
          uni.showModal({
            title: '播放视频',
            content: '浏览器阻止了弹窗，请手动复制链接打开视频',
            confirmText: '复制链接',
            success: (res) => {
              if (res.confirm) {
                // 复制链接到剪贴板
                navigator.clipboard.writeText(videoUrl).then(() => {
                  uni.showToast({
                    title: '链接已复制',
                    icon: 'success'
                  })
                }).catch(() => {
                  uni.showToast({
                    title: '复制失败，请手动复制',
                    icon: 'error'
                  })
                })
              }
            }
          })
        }
        // #endif
        
        // #ifdef MP
        // 小程序端显示全屏视频预览
        uni.showModal({
          title: '播放视频',
          content: '即将全屏播放视频，请确认',
          confirmText: '播放',
          cancelText: '取消',
          success: (res) => {
            if (res.confirm) {
              // 小程序中可以使用video组件的全屏功能
              // 这里我们提示用户在预览中观看
              uni.showToast({
                title: '请在预览中观看视频',
                icon: 'none',
                duration: 2000
              })
            }
          }
        })
        // #endif
        
      } catch (error) {
        console.error('视频播放失败:', error)
        uni.showModal({
          title: '播放失败',
          content: '无法打开视频播放器，请检查网络连接或稍后重试',
          showCancel: false,
          confirmText: '确定'
        })
      }
    },

    // 视频加载开始
    onVideoLoadStart() {
      console.log('视频开始加载')
    },

    // 视频可以播放
    onVideoCanPlay() {
      console.log('视频可以播放')
      uni.showToast({
        title: '视频加载完成',
        icon: 'success',
        duration: 1000
      })
    },

    // 视频加载错误
    onVideoError(e) {
      console.error('视频加载失败:', e)
      uni.showModal({
        title: '视频加载失败',
        content: '可能是网络问题或视频文件损坏，请稍后重试或检查网络连接',
        showCancel: false,
        confirmText: '确定'
      })
    }
  }
}
</script>

<style scoped>
/* 全局 box-sizing 设置 */
* {
  box-sizing: border-box;
}

.ai-creation-container {
  height: 100vh;
  width: 100vw;
  background-image: url('@/static/chat/chat_background.png');
  background-size: contain;
  background-position: center bottom;
  background-repeat: no-repeat;
  display: flex;
  flex-direction: column;
  box-sizing: border-box;
  overflow-x: hidden;
}

.status-bar {
  height: calc(var(--status-bar-height) + 20rpx);
  width: 100%;
}

/* 顶部导航栏 */
.header-toolbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10rpx 20rpx;
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(10px);
  box-sizing: border-box;
}

.toolbar-left {
  display: flex;
  align-items: center;
}

.back-btn {
  width: 60rpx;
  height: 60rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  margin-right: 20rpx;
}

.back-icon {
  font-size: 32rpx;
  font-weight: bold;
  color: #333;
}

.page-title {
  font-size: 36rpx;
  font-weight: bold;
  color: #333;
}

.toolbar-right {
  display: flex;
  align-items: center;
}

.header-btn {
  padding: 10rpx 20rpx;
  background: rgba(255, 153, 0, 0.12);
  border-radius: 24rpx;
  margin-left: 15rpx;
}

.btn-text {
  color: #FF9900;
  font-size: 28rpx;
}

/* 主要内容区域 */
.main-content {
  flex: 1;
  padding: 20rpx 20rpx;
  padding-bottom: 140rpx;
  box-sizing: border-box;
}

/* 区域样式 */
.section {
  background: white;
  border-radius: 32rpx;
  margin-bottom: 20rpx;
  overflow: hidden;
  box-shadow: 0 8rpx 16rpx rgba(0,0,0,0.08);
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20rpx;
  background: rgba(255, 153, 0, 0.05);
  border-bottom: 1rpx solid rgba(255, 153, 0, 0.1);
  box-sizing: border-box;
}

.section-title {
  font-size: 32rpx;
  font-weight: bold;
  color: #333;
}

.expand-btn {
  padding: 10rpx;
}

.expand-icon {
  color: #FF9900;
  font-size: 24rpx;
}

.section-content {
  padding: 20rpx;
  box-sizing: border-box;
}

/* 选择信息 */
.selection-info {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20rpx;
}

.info-text {
  color: #666;
  font-size: 28rpx;
}

.action-btn {
  padding: 10rpx 20rpx;
  background: #FF9900;
  border-radius: 24rpx;
  transition: all 0.3s ease;
}

.action-btn:active {
  transform: scale(0.95);
}

.action-btn .btn-text {
  color: white;
  font-size: 24rpx;
}

/* 空状态 */
.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 60rpx 20rpx;
  text-align: center;
}

.empty-icon {
  font-size: 48rpx;
  margin-bottom: 20rpx;
  opacity: 0.6;
}

.empty-text {
  font-size: 26rpx;
  color: #999;
  margin-bottom: 30rpx;
}

.empty-action {
  padding: 10rpx 20rpx;
  background: #FF9900;
  border-radius: 24rpx;
  transition: all 0.3s ease;
}

.empty-action:active {
  transform: scale(0.95);
}

.action-text {
  color: white;
  font-size: 24rpx;
}

/* 聊天记录列表 */
.chat-list {
  max-height: 400rpx;
  overflow-y: auto;
}

.chat-item {
  display: flex;
  align-items: center;
  padding: 20rpx;
  margin-bottom: 15rpx;
  background: #f8f9fa;
  border-radius: 24rpx;
  border: 2rpx solid transparent;
  transition: all 0.3s ease;
  box-shadow: 0 4rpx 12rpx rgba(0, 0, 0, 0.08);
}

.chat-item:active {
  transform: scale(0.98);
}

.chat-item.selected {
  background: #ffe9bf;
  border-color: #FF9900;
}

.chat-preview {
  flex: 1;
  margin-right: 20rpx;
}

.chat-role {
  font-size: 24rpx;
  color: #b58c2b;
  font-weight: bold;
  margin-bottom: 5rpx;
}

.chat-content {
  font-size: 26rpx;
  color: #666;
  line-height: 1.4;
}

.chat-time {
  margin-right: 15rpx;
}

.time-text {
  font-size: 22rpx;
  color: #999;
}

.selection-indicator {
  width: 40rpx;
  height: 40rpx;
  border-radius: 20rpx;
  background: #FF9900;
  display: flex;
  align-items: center;
  justify-content: center;
}

.indicator-icon {
  color: white;
  font-size: 24rpx;
  font-weight: bold;
}

/* 知识卡片列表 */
.knowledge-list {
  max-height: 400rpx;
  overflow-y: auto;
}

.knowledge-item {
  display: flex;
  align-items: center;
  padding: 20rpx;
  margin-bottom: 15rpx;
  background: #f8f9fa;
  border-radius: 24rpx;
  border: 2rpx solid transparent;
  transition: all 0.3s ease;
  box-shadow: 0 4rpx 12rpx rgba(0, 0, 0, 0.08);
}

.knowledge-item:active {
  transform: scale(0.98);
}

.knowledge-item.selected {
  background: #ffe9bf;
  border-color: #FF9900;
}

.knowledge-preview {
  flex: 1;
  margin-right: 20rpx;
}

.knowledge-title {
  font-size: 28rpx;
  color: #333;
  font-weight: bold;
  margin-bottom: 8rpx;
}

.knowledge-content {
  font-size: 24rpx;
  color: #666;
  line-height: 1.4;
}

.knowledge-meta {
  margin-right: 15rpx;
  display: flex;
  flex-direction: column;
  gap: 4rpx;
}

.meta-text {
  font-size: 22rpx;
  color: #999;
}

.meta-tags {
  font-size: 20rpx;
  color: #b58c2b;
  background: rgba(255, 153, 0, 0.12);
  padding: 2rpx 8rpx;
  border-radius: 8rpx;
  align-self: flex-start;
}

/* 自定义文本输入 */
.custom-input {
  width: 100%;
  min-height: 200rpx;
  padding: 20rpx;
  background: #f8f9fa;
  border-radius: 24rpx;
  border: 2rpx solid #e9ecef;
  font-size: 28rpx;
  line-height: 1.5;
  color: #333;
  box-sizing: border-box;
  resize: none;
  transition: all 0.3s ease;
}

.custom-input:focus {
  border-color: #FF9900;
  box-shadow: 0 0 0 3rpx rgba(255, 153, 0, 0.12);
}

.input-counter {
  text-align: right;
  margin-top: 10rpx;
}

.counter-text {
  font-size: 24rpx;
  color: #999;
}

/* 创作类型选择 */
.creation-types {
  display: flex;
  gap: 20rpx;
}

.type-item {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 30rpx 20rpx;
  background: #f8f9fa;
  border-radius: 24rpx;
  border: 2rpx solid transparent;
  transition: all 0.3s ease;
  box-shadow: 0 4rpx 12rpx rgba(0, 0, 0, 0.08);
}

.type-item:active {
  transform: scale(0.98);
}

.type-item.active {
  background: #ffe9bf;
  border-color: #FF9900;
}

.type-icon {
  font-size: 48rpx;
  margin-bottom: 10rpx;
}

.type-text {
  font-size: 28rpx;
  color: #333;
}

/* 预览区域 */
.preview-content {
  background: #f8f9fa;
  border-radius: 24rpx;
  padding: 20rpx;
  min-height: 150rpx;
  max-height: 300rpx;
  overflow-y: auto;
  box-sizing: border-box;
  width: 100%;
  box-shadow: 0 4rpx 12rpx rgba(0, 0, 0, 0.08);
}

.preview-text {
  font-size: 26rpx;
  color: #666;
  line-height: 1.5;
  white-space: pre-wrap;
}

/* 底部操作栏 */
.bottom-toolbar {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(10px);
  padding: 20rpx 20rpx;
  border-top: 1rpx solid rgba(0, 0, 0, 0.1);
  display: flex;
  justify-content: space-between;
  align-items: center;
  box-sizing: border-box;
}

.toolbar-info {
  flex: 1;
  margin-right: 20rpx;
}

.toolbar-actions {
  display: flex;
  gap: 15rpx;
}

.action-btn.secondary {
  background: #6c757d;
}

.action-btn.primary {
  background: #FF9900;
}

.action-btn.disabled {
  background: #ccc;
  opacity: 0.6;
}

.action-btn {
  padding: 15rpx 30rpx;
  border-radius: 32rpx;
  min-width: 120rpx;
  text-align: center;
  box-shadow: 0 4rpx 12rpx rgba(0, 0, 0, 0.08);
}

.action-btn .btn-text {
  color: white;
  font-size: 28rpx;
  font-weight: bold;
}

/* 创作进度弹窗 */
.creation-progress-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 9999;
}

.creation-progress-modal {
  width: 80%;
  max-width: 600rpx;
  background: white;
  border-radius: 32rpx;
  overflow: hidden;
  box-shadow: 0 10rpx 30rpx rgba(0, 0, 0, 0.3);
}

.progress-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 30rpx;
  background: linear-gradient(135deg, #FF9900 0%, #FFC58F 100%);
}

.progress-title {
  color: white;
  font-size: 32rpx;
  font-weight: bold;
}

.progress-close {
  width: 40rpx;
  height: 40rpx;
  border-radius: 20rpx;
  background: rgba(255, 255, 255, 0.2);
  display: flex;
  align-items: center;
  justify-content: center;
}

.close-icon {
  color: white;
  font-size: 24rpx;
  font-weight: bold;
}

.progress-content {
  padding: 40rpx 30rpx;
}

/* 创作中状态 */
.progress-creating {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
}

.progress-animation {
  margin-bottom: 30rpx;
}

.loading-spinner {
  width: 80rpx;
  height: 80rpx;
  border: 6rpx solid #f3f3f3;
  border-top: 6rpx solid #FF9900;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.progress-message {
  font-size: 28rpx;
  color: #333;
  margin-bottom: 30rpx;
}

.progress-bar {
  width: 100%;
  height: 10rpx;
  background: #f0f0f0;
  border-radius: 5rpx;
  overflow: hidden;
  margin-bottom: 20rpx;
}

.progress-fill {
  height: 100%;
  background: linear-gradient(90deg, #FF9900 0%, #FFC58F 100%);
  border-radius: 5rpx;
  transition: width 0.3s ease;
}

.progress-percent {
  font-size: 24rpx;
  color: #666;
}

/* 创作完成状态 */
.progress-completed {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
}

.result-preview {
  width: 200rpx;
  height: 200rpx;
  margin-bottom: 30rpx;
  border-radius: 24rpx;
  overflow: hidden;
  background: #f8f9fa;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 4rpx 12rpx rgba(0, 0, 0, 0.08);
}

.result-image {
  width: 100%;
  height: 100%;
}

.result-video {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 10rpx;
  width: 100%;
  position: relative;
}

.result-video-player {
  width: 100%;
  height: 150rpx;
  border-radius: 16rpx;
  background: #000;
  object-fit: contain;
  cursor: pointer;
}

.video-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(0, 0, 0, 0.3);
  border-radius: 16rpx;
  cursor: pointer;
  transition: all 0.3s ease;
}

.video-overlay:hover {
  background: rgba(0, 0, 0, 0.5);
}

.play-button {
  width: 60rpx;
  height: 60rpx;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.9);
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s ease;
}

.play-button:hover {
  background: rgba(255, 255, 255, 1);
  transform: scale(1.1);
}

.play-icon {
  color: #333;
  font-size: 24rpx;
  font-weight: bold;
  margin-left: 4rpx; /* 微调播放图标位置 */
}

.video-icon {
  font-size: 48rpx;
}

.video-title {
  font-size: 24rpx;
  color: #666;
  text-align: center;
  margin-top: 10rpx;
  max-width: 100%;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.result-title {
  font-size: 32rpx;
  font-weight: bold;
  color: #333;
  margin-bottom: 15rpx;
}

.result-description {
  font-size: 26rpx;
  color: #666;
  line-height: 1.4;
  margin-bottom: 30rpx;
}

.result-actions {
  display: flex;
  gap: 15rpx;
  justify-content: center;
}

/* 创作失败状态 */
.progress-error {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
}

.error-icon {
  margin-bottom: 20rpx;
}

.icon-text {
  font-size: 48rpx;
}

.error-message {
  font-size: 28rpx;
  color: #e74c3c;
  margin-bottom: 30rpx;
  line-height: 1.4;
}

.error-actions {
  display: flex;
  gap: 15rpx;
  justify-content: center;
}

/* 查看结果弹窗样式 */
.view-result-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.8);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 10000;
}

.view-result-modal {
  width: 90%;
  max-width: 800rpx;
  max-height: 90vh;
  background: white;
  border-radius: 32rpx;
  overflow: hidden;
  box-shadow: 0 20rpx 40rpx rgba(0, 0, 0, 0.3);
  display: flex;
  flex-direction: column;
}

.view-result-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 30rpx;
  background: linear-gradient(135deg, #FF9900 0%, #FFC58F 100%);
  flex-shrink: 0;
}

.view-result-title {
  color: white;
  font-size: 36rpx;
  font-weight: bold;
}

.view-result-close {
  width: 50rpx;
  height: 50rpx;
  border-radius: 25rpx;
  background: rgba(255, 255, 255, 0.2);
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s ease;
}

.view-result-close:active {
  transform: scale(0.9);
  background: rgba(255, 255, 255, 0.3);
}

.view-result-content {
  flex: 1;
  overflow-y: auto;
  padding: 30rpx;
}

/* 图片查看容器 */
.image-view-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-bottom: 30rpx;
}

.full-image {
  width: 100%;
  max-height: 400rpx;
  border-radius: 16rpx;
  box-shadow: 0 8rpx 24rpx rgba(0, 0, 0, 0.15);
  margin-bottom: 20rpx;
}

.image-info {
  display: flex;
  gap: 20rpx;
  justify-content: center;
  flex-wrap: wrap;
}

.info-item {
  font-size: 24rpx;
  color: #666;
  background: #f8f9fa;
  padding: 8rpx 16rpx;
  border-radius: 16rpx;
}

/* 视频查看容器 */
.video-view-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-bottom: 30rpx;
}

.full-video {
  width: 100%;
  height: 400rpx;
  border-radius: 16rpx;
  background: #000;
  object-fit: contain;
  box-shadow: 0 8rpx 24rpx rgba(0, 0, 0, 0.15);
  margin-bottom: 20rpx;
}

.video-info {
  display: flex;
  gap: 20rpx;
  justify-content: center;
  flex-wrap: wrap;
}

/* 结果详情 */
.result-details {
  background: #f8f9fa;
  border-radius: 24rpx;
  padding: 30rpx;
  margin-bottom: 30rpx;
}

.detail-title {
  font-size: 32rpx;
  font-weight: bold;
  color: #333;
  margin-bottom: 15rpx;
  text-align: center;
}

.detail-description {
  font-size: 28rpx;
  color: #666;
  line-height: 1.5;
  margin-bottom: 20rpx;
  text-align: center;
}

.detail-meta {
  display: flex;
  flex-direction: column;
  gap: 10rpx;
  align-items: center;
}

.meta-item {
  font-size: 24rpx;
  color: #999;
  background: white;
  padding: 8rpx 16rpx;
  border-radius: 16rpx;
  border: 1rpx solid #e9ecef;
}

/* 查看结果操作按钮 */
.view-result-actions {
  display: flex;
  gap: 15rpx;
  justify-content: center;
  padding: 20rpx 30rpx 30rpx;
  background: #f8f9fa;
  flex-shrink: 0;
}
</style>
