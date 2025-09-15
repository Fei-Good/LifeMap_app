 <template>
  <view class="menu-container">
    <!-- 顶部标题 -->
    <view class="header">
      <image 
        class="header-bg" 
        src="/textures/地图功能/背景色.png" 
        mode="scaleToFill"
      />
      <view class="header-content">
        <text class="app-title">DouDou 应用总览</text>
        <text class="app-subtitle">选择页面进行跳转</text>
      </view>
    </view>

    <!-- 搜索栏 -->
    <view class="search-container">
      <view class="search-box">
        <input 
          class="search-input" 
          placeholder="搜索页面..." 
          v-model="searchText"
          @input="filterPages"
        />
        <text class="search-icon">🔍</text>
      </view>
    </view>

    <!-- 页面列表 -->
    <scroll-view class="page-list" scroll-y="true" :show-scrollbar="false">
      <view class="page-grid">
        <view 
          v-for="(page, index) in filteredPages" 
          :key="page.path"
          class="page-card"
          :class="`category-${page.category}`"
          @click="navigateToPage(page.path)"
        >
          <view class="card-background">
            <image 
              class="card-bg-image" 
              :src="getCardBackground(page.category)" 
              mode="scaleToFill"
            />
          </view>
          
          <view class="card-content">
            <view class="page-icon">
              <text class="icon-text">{{ page.icon }}</text>
            </view>
            <view class="page-info">
              <text class="page-title">{{ page.title }}</text>
              <text class="page-description">{{ page.description }}</text>
            </view>
            <view class="page-status">
              <text class="status-text">{{ page.status }}</text>
            </view>
          </view>
          
          <view class="card-overlay">
            <text class="overlay-text">点击进入</text>
          </view>
        </view>
      </view>
    </scroll-view>

    <!-- 底部信息 -->
    <view class="footer">
      <text class="footer-text">显示 {{ filteredPages.length }} / {{ pages.length }} 个页面</text>
      <text class="footer-text">当前版本: v1.0.0</text>
    </view>
  </view>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'

// 搜索文本
const searchText = ref('')

// 页面数据
const pages = ref([
  // 核心功能
  {
    path: 'pages/hexagon-map/hexagon-map',
    title: '六边形地图',
    description: '整合版成长地图，六边形设计+textures资源',
    icon: '🗺️',
    category: 'core',
    status: '推荐'
  },
  {
    path: 'pages/life-journey/life-journey',
    title: '人生地图',
    description: '游戏风格的人生阶段地图',
    icon: '🎮',
    category: 'core',
    status: '推荐'
  },
  {
    path: 'pages/chat/chat',
    title: 'DouDou聊天',
    description: '与AI助手DouDou对话',
    icon: '💬',
    category: 'core',
    status: '可用'
  },
  {
    path: 'pages/friends/friends',
    title: '好友列表',
    description: '管理你的好友关系',
    icon: '👥',
    category: 'core',
    status: '可用'
  },
  {
    path: 'pages/task/task',
    title: '任务系统',
    description: '日常任务管理和完成',
    icon: '📋',
    category: 'core',
    status: '可用'
  },

  // 用户相关
  {
    path: 'pages/login/login',
    title: '登录',
    description: '用户登录页面',
    icon: '🔐',
    category: 'user',
    status: '可用'
  },
  {
    path: 'pages/register/register',
    title: '注册',
    description: '新用户注册页面',
    icon: '📝',
    category: 'user',
    status: '可用'
  },
  {
    path: 'pages/user-info-collection/user-info-collection',
    title: '性格测试',
    description: '用户性格测试和评估',
    icon: '🧠',
    category: 'user',
    status: '可用'
  },
  {
    path: 'pages/questionnaire-result/questionnaire-result',
    title: '个性化报告',
    description: '基于测试结果的个性化报告',
    icon: '📊',
    category: 'user',
    status: '可用'
  },

  // 游戏功能
  {
    path: 'pages/game/game',
    title: 'Cocos游戏',
    description: '基于Cocos的游戏体验',
    icon: '🎯',
    category: 'game',
    status: '开发中'
  },
  {
    path: 'pages/game-center/game-center',
    title: '游戏中心',
    description: '游戏集合和中心',
    icon: '🎮',
    category: 'game',
    status: '可用'
  },
  {
    path: 'pages/crit/crit',
    title: '疯狂暴击DouDou',
    description: '互动小游戏',
    icon: '👊',
    category: 'game',
    status: '可用'
  },

  // 地图功能
  {
    path: 'pages/map/map',
    title: '成长地图',
    description: '原始成长地图页面',
    icon: '🗺️',
    category: 'map',
    status: '可用'
  },
  {
    path: 'pages/map-demo/map-demo',
    title: '地图功能演示',
    description: '地图功能演示页面',
    icon: '🎪',
    category: 'map',
    status: '演示'
  },

  // 其他功能
  {
    path: 'pages/knowledge/knowledge',
    title: '复盘知识库',
    description: '知识管理和复盘功能',
    icon: '📚',
    category: 'other',
    status: '可用'
  },
  {
    path: 'pages/report/report',
    title: '成长报告',
    description: '用户成长报告生成',
    icon: '📈',
    category: 'other',
    status: '可用'
  },
  {
    path: 'pages/ai-creation/ai-creation',
    title: 'AI创作',
    description: 'AI辅助创作功能',
    icon: '🤖',
    category: 'other',
    status: '开发中'
  },
  {
    path: 'pages/intro/intro',
    title: 'DouDou引导',
    description: '应用介绍和引导页面',
    icon: '👋',
    category: 'other',
    status: '可用'
  }
])

// 过滤后的页面列表
const filteredPages = computed(() => {
  if (!searchText.value.trim()) {
    return pages.value
  }
  
  const searchLower = searchText.value.toLowerCase()
  return pages.value.filter(page => 
    page.title.toLowerCase().includes(searchLower) ||
    page.description.toLowerCase().includes(searchLower) ||
    page.category.toLowerCase().includes(searchLower)
  )
})

// 获取卡片背景
const getCardBackground = (category) => {
  const backgrounds = {
    core: '/textures/地图功能/蓝色格子.png',
    user: '/textures/地图功能/绿色格子.png',
    game: '/textures/地图功能/粉色格子.png',
    map: '/textures/地图功能/目标栏.png',
    other: '/textures/地图功能/背景网格.png'
  }
  return backgrounds[category] || backgrounds.other
}

// 页面跳转
const navigateToPage = (path) => {
  console.log('跳转到页面:', path)
  uni.navigateTo({
    url: `/${path}`,
    fail: (err) => {
      console.error('页面跳转失败:', err)
      uni.showToast({
        title: '页面跳转失败',
        icon: 'none'
      })
    }
  })
}

// 页面加载
onMounted(() => {
  console.log('菜单页面加载完成，共', pages.value.length, '个页面')
})
</script>

<style lang="scss" scoped>
.menu-container {
  width: 100vw;
  height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  display: flex;
  flex-direction: column;
  position: relative;
  overflow: hidden;
}

.menu-container::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: url('/textures/地图功能/背景网格.png') repeat;
  opacity: 0.1;
  z-index: 1;
}

/* 顶部标题 */
.header {
  position: relative;
  height: 240rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 10;
  padding: 40rpx 20rpx;
}

.header-bg {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  opacity: 0.3;
  border-radius: 0 0 40rpx 40rpx;
}

.header-content {
  position: relative;
  z-index: 2;
  text-align: center;
  color: white;
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10rpx);
  border-radius: 30rpx;
  padding: 30rpx 40rpx;
  border: 1rpx solid rgba(255, 255, 255, 0.2);
  box-shadow: 0 8rpx 32rpx rgba(0, 0, 0, 0.1);
}

.app-title {
  display: block;
  font-size: 52rpx;
  font-weight: 800;
  margin-bottom: 15rpx;
  background: linear-gradient(45deg, #fff, #f0f0f0);
  background-clip: text;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  text-shadow: 0 4rpx 8rpx rgba(0, 0, 0, 0.3);
  letter-spacing: 2rpx;
}

.app-subtitle {
  display: block;
  font-size: 28rpx;
  color: rgba(255, 255, 255, 0.9);
  font-weight: 500;
  text-shadow: 0 2rpx 4rpx rgba(0, 0, 0, 0.2);
}

/* 搜索栏 */
.search-container {
  padding: 20rpx;
  background: rgba(255, 255, 255, 0.05);
  backdrop-filter: blur(10rpx);
  border-bottom: 1rpx solid rgba(255, 255, 255, 0.1);
  z-index: 10;
  position: relative;
}

.search-box {
  position: relative;
  background: rgba(255, 255, 255, 0.15);
  backdrop-filter: blur(20rpx);
  border-radius: 30rpx;
  padding: 0 25rpx;
  box-shadow: 0 8rpx 32rpx rgba(0, 0, 0, 0.1);
  display: flex;
  align-items: center;
  border: 1rpx solid rgba(255, 255, 255, 0.2);
  transition: all 0.3s ease;
}

.search-box:focus-within {
  background: rgba(255, 255, 255, 0.25);
  box-shadow: 0 12rpx 40rpx rgba(0, 0, 0, 0.15);
  transform: translateY(-2rpx);
}

.search-input {
  flex: 1;
  height: 90rpx;
  font-size: 30rpx;
  border: none;
  outline: none;
  background: transparent;
  color: white;
  font-weight: 500;
}

.search-input::placeholder {
  color: rgba(255, 255, 255, 0.7);
}

.search-icon {
  font-size: 36rpx;
  color: rgba(255, 255, 255, 0.8);
  margin-left: 15rpx;
  transition: all 0.3s ease;
}

.search-box:focus-within .search-icon {
  color: white;
  transform: scale(1.1);
}

/* 页面列表 */
.page-list {
  flex: 1;
  padding: 20rpx;
  z-index: 5;
  position: relative;
}

.page-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(340rpx, 1fr));
  gap: 25rpx;
  padding-bottom: 40rpx;
}

.page-card {
  position: relative;
  height: 220rpx;
  border-radius: 25rpx;
  overflow: hidden;
  cursor: pointer;
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  box-shadow: 0 12rpx 40rpx rgba(0, 0, 0, 0.15);
  backdrop-filter: blur(10rpx);
  border: 1rpx solid rgba(255, 255, 255, 0.1);
  
  &:active {
    transform: scale(0.96);
    transition: all 0.1s ease;
  }
  
  &:hover {
    transform: translateY(-8rpx) scale(1.02);
    box-shadow: 0 20rpx 60rpx rgba(0, 0, 0, 0.25);
  }
}

.card-background {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
}

.card-bg-image {
  width: 100%;
  height: 100%;
  opacity: 0.4;
  filter: blur(1rpx);
}

.card-content {
  position: relative;
  z-index: 2;
  height: 100%;
  padding: 25rpx;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  background: linear-gradient(135deg, rgba(255, 255, 255, 0.1), rgba(255, 255, 255, 0.05));
  backdrop-filter: blur(10rpx);
}

.page-icon {
  width: 70rpx;
  height: 70rpx;
  background: rgba(255, 255, 255, 0.2);
  backdrop-filter: blur(20rpx);
  border-radius: 20rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 20rpx;
  border: 1rpx solid rgba(255, 255, 255, 0.3);
  box-shadow: 0 4rpx 16rpx rgba(0, 0, 0, 0.1);
}

.icon-text {
  font-size: 36rpx;
  filter: drop-shadow(0 2rpx 4rpx rgba(0, 0, 0, 0.3));
}

.page-info {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 10rpx;
}

.page-title {
  font-size: 34rpx;
  font-weight: 700;
  color: white;
  text-shadow: 0 2rpx 8rpx rgba(0, 0, 0, 0.5);
  letter-spacing: 1rpx;
}

.page-description {
  font-size: 26rpx;
  color: rgba(255, 255, 255, 0.9);
  line-height: 1.5;
  text-shadow: 0 1rpx 4rpx rgba(0, 0, 0, 0.3);
  font-weight: 400;
}

.page-status {
  align-self: flex-end;
}

.status-text {
  font-size: 22rpx;
  padding: 6rpx 16rpx;
  border-radius: 20rpx;
  background: rgba(255, 255, 255, 0.2);
  backdrop-filter: blur(10rpx);
  color: white;
  font-weight: 600;
  border: 1rpx solid rgba(255, 255, 255, 0.3);
  text-shadow: 0 1rpx 2rpx rgba(0, 0, 0, 0.3);
}

.card-overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: linear-gradient(135deg, rgba(255, 255, 255, 0.2), rgba(255, 255, 255, 0.1));
  backdrop-filter: blur(20rpx);
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: 0;
  transition: all 0.3s ease;
  z-index: 3;
  border-radius: 25rpx;
}

.page-card:active .card-overlay {
  opacity: 1;
  background: linear-gradient(135deg, rgba(255, 255, 255, 0.3), rgba(255, 255, 255, 0.2));
}

.overlay-text {
  color: white;
  font-size: 30rpx;
  font-weight: 700;
  text-shadow: 0 4rpx 8rpx rgba(0, 0, 0, 0.6);
  letter-spacing: 2rpx;
  background: rgba(0, 0, 0, 0.3);
  padding: 10rpx 20rpx;
  border-radius: 20rpx;
  backdrop-filter: blur(10rpx);
  border: 1rpx solid rgba(255, 255, 255, 0.2);
}

/* 分类样式 */
.category-core {
  border-left: 8rpx solid #4CAF50;
  box-shadow: 0 0 20rpx rgba(76, 175, 80, 0.3);
}

.category-core:hover {
  box-shadow: 0 0 30rpx rgba(76, 175, 80, 0.5);
}

.category-user {
  border-left: 8rpx solid #2196F3;
  box-shadow: 0 0 20rpx rgba(33, 150, 243, 0.3);
}

.category-user:hover {
  box-shadow: 0 0 30rpx rgba(33, 150, 243, 0.5);
}

.category-game {
  border-left: 8rpx solid #FF9800;
  box-shadow: 0 0 20rpx rgba(255, 152, 0, 0.3);
}

.category-game:hover {
  box-shadow: 0 0 30rpx rgba(255, 152, 0, 0.5);
}

.category-map {
  border-left: 8rpx solid #9C27B0;
  box-shadow: 0 0 20rpx rgba(156, 39, 176, 0.3);
}

.category-map:hover {
  box-shadow: 0 0 30rpx rgba(156, 39, 176, 0.5);
}

.category-other {
  border-left: 8rpx solid #607D8B;
  box-shadow: 0 0 20rpx rgba(96, 125, 139, 0.3);
}

.category-other:hover {
  box-shadow: 0 0 30rpx rgba(96, 125, 139, 0.5);
}

/* 底部信息 */
.footer {
  height: 120rpx;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 40rpx;
  background: rgba(255, 255, 255, 0.05);
  backdrop-filter: blur(20rpx);
  border-top: 1rpx solid rgba(255, 255, 255, 0.1);
  z-index: 10;
  position: relative;
}

.footer-text {
  font-size: 26rpx;
  color: rgba(255, 255, 255, 0.8);
  font-weight: 500;
  text-shadow: 0 1rpx 2rpx rgba(0, 0, 0, 0.3);
}

/* 动画效果 */
@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(30rpx);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes pulse {
  0%, 100% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.05);
  }
}

.page-card {
  animation: fadeInUp 0.6s ease-out;
  animation-fill-mode: both;
}

.page-card:nth-child(1) { animation-delay: 0.1s; }
.page-card:nth-child(2) { animation-delay: 0.2s; }
.page-card:nth-child(3) { animation-delay: 0.3s; }
.page-card:nth-child(4) { animation-delay: 0.4s; }
.page-card:nth-child(5) { animation-delay: 0.5s; }
.page-card:nth-child(6) { animation-delay: 0.6s; }
.page-card:nth-child(7) { animation-delay: 0.7s; }
.page-card:nth-child(8) { animation-delay: 0.8s; }
.page-card:nth-child(9) { animation-delay: 0.9s; }
.page-card:nth-child(10) { animation-delay: 1.0s; }
.page-card:nth-child(11) { animation-delay: 1.1s; }
.page-card:nth-child(12) { animation-delay: 1.2s; }
.page-card:nth-child(13) { animation-delay: 1.3s; }
.page-card:nth-child(14) { animation-delay: 1.4s; }
.page-card:nth-child(15) { animation-delay: 1.5s; }
.page-card:nth-child(16) { animation-delay: 1.6s; }

.header-content {
  animation: fadeInUp 0.8s ease-out;
}

.search-container {
  animation: fadeInUp 1s ease-out;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .page-grid {
    grid-template-columns: 1fr;
    gap: 20rpx;
  }
  
  .page-card {
    height: 200rpx;
  }
  
  .app-title {
    font-size: 44rpx;
  }
  
  .app-subtitle {
    font-size: 26rpx;
  }
  
  .header {
    height: 200rpx;
    padding: 30rpx 20rpx;
  }
  
  .header-content {
    padding: 25rpx 30rpx;
  }
}

@media (max-width: 480px) {
  .page-list {
    padding: 15rpx;
  }
  
  .page-card {
    height: 180rpx;
  }
  
  .page-title {
    font-size: 30rpx;
  }
  
  .page-description {
    font-size: 24rpx;
  }
  
  .app-title {
    font-size: 40rpx;
  }
  
  .app-subtitle {
    font-size: 24rpx;
  }
  
  .search-input {
    height: 80rpx;
    font-size: 28rpx;
  }
  
  .page-icon {
    width: 60rpx;
    height: 60rpx;
  }
  
  .icon-text {
    font-size: 32rpx;
  }
}
</style>
