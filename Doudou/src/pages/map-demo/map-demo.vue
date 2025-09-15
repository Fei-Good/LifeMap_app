<template>
  <view class="map-demo-container">
    <!-- 顶部介绍 -->
    <view class="demo-header">
      <image 
        class="doudou-logo" 
        src="@/static/login/DouDou_主形象.png" 
        mode="aspectFit"
      />
      <text class="demo-title">DouDou 智能地图</text>
      <text class="demo-subtitle">体验全新的地图功能</text>
    </view>

    <!-- 功能介绍卡片 -->
    <view class="features-section">
      <view class="section-title">
        <text class="title-text">🗺️ 功能特色</text>
      </view>
      
      <view class="features-grid">
        <view class="feature-card" v-for="feature in features" :key="feature.id">
          <view class="feature-icon">{{ feature.icon }}</view>
          <text class="feature-name">{{ feature.name }}</text>
          <text class="feature-desc">{{ feature.description }}</text>
        </view>
      </view>
    </view>

    <!-- 快速入口 -->
    <view class="quick-access">
      <view class="section-title">
        <text class="title-text">🚀 快速体验</text>
      </view>
      
      <view class="access-buttons">
        <view class="access-btn primary" @click="goToInteractiveMap">
          <text class="btn-icon">🗺️</text>
          <text class="btn-text">打开智能地图</text>
          <text class="btn-desc">体验完整地图功能</text>
        </view>
        
        <view class="access-btn secondary" @click="goToHexagonMap">
          <text class="btn-icon">🎯</text>
          <text class="btn-text">成长地图</text>
          <text class="btn-desc">查看个人成长路径</text>
        </view>
      </view>
    </view>

    <!-- 使用说明 */
    <view class="instructions-section">
      <view class="section-title">
        <text class="title-text">📖 使用说明</text>
      </view>
      
      <view class="instructions-list">
        <view class="instruction-item" v-for="(instruction, index) in instructions" :key="index">
          <view class="instruction-number">{{ index + 1 }}</view>
          <view class="instruction-content">
            <text class="instruction-title">{{ instruction.title }}</text>
            <text class="instruction-desc">{{ instruction.description }}</text>
          </view>
        </view>
      </view>
    </view>

    <!-- 底部提示 -->
    <view class="demo-footer">
      <text class="footer-text">💡 提示：首次使用需要允许位置权限以获得最佳体验</text>
    </view>
  </view>
</template>

<script setup>
import { ref } from 'vue'

// 功能特色数据
const features = ref([
  {
    id: 1,
    icon: '🔍',
    name: '智能搜索',
    description: '快速搜索地点、商家、景点等'
  },
  {
    id: 2,
    icon: '📍',
    name: '精准定位',
    description: '获取当前位置，查看附近推荐'
  },
  {
    id: 3,
    icon: '🧭',
    name: '导航功能',
    description: '一键导航到目标地点'
  },
  {
    id: 4,
    icon: '⭐',
    name: '收藏分享',
    description: '收藏喜欢的地点，分享给朋友'
  },
  {
    id: 5,
    icon: '🎯',
    name: '分类筛选',
    description: '按类型快速筛选地点'
  },
  {
    id: 6,
    icon: '🤖',
    name: 'DouDou助手',
    description: '智能助手帮你找到想去的地方'
  }
])

// 使用说明数据
const instructions = ref([
  {
    title: '允许位置权限',
    description: '首次打开地图时，请允许获取位置权限，以便为您提供精准的定位服务'
  },
  {
    title: '搜索地点',
    description: '在顶部搜索框输入地点名称、商家或关键词，即可快速找到目标位置'
  },
  {
    title: '查看附近',
    description: '点击定位按钮，查看附近的餐厅、商店、景点等推荐地点'
  },
  {
    title: '使用快捷功能',
    description: '点击底部面板的快捷按钮，快速搜索特定类型的地点'
  },
  {
    title: '导航和分享',
    description: '点击地点标记查看详情，可以导航、收藏或分享给朋友'
  }
])

// 跳转到交互式地图
const goToInteractiveMap = () => {
  uni.navigateTo({
    url: '/pages/interactive-map/interactive-map',
    success: () => {
      console.log('跳转到智能地图页面')
    },
    fail: (err) => {
      console.error('跳转失败:', err)
      uni.showToast({
        title: '页面跳转失败',
        icon: 'none'
      })
    }
  })
}

// 跳转到六边形地图
const goToHexagonMap = () => {
  uni.navigateTo({
    url: '/pages/hexagon-map/hexagon-map',
    success: () => {
      console.log('跳转到成长地图页面')
    },
    fail: (err) => {
      console.error('跳转失败:', err)
      uni.showToast({
        title: '页面跳转失败',
        icon: 'none'
      })
    }
  })
}
</script>

<style lang="scss" scoped>
.map-demo-container {
  min-height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  padding: 40rpx 30rpx;
}

/* 顶部介绍 */
.demo-header {
  text-align: center;
  margin-bottom: 60rpx;
  padding: 40rpx;
  background: rgba(255, 255, 255, 0.95);
  border-radius: 30rpx;
  box-shadow: 0 15rpx 35rpx rgba(0, 0, 0, 0.1);
  backdrop-filter: blur(10rpx);
}

.doudou-logo {
  width: 120rpx;
  height: 120rpx;
  margin-bottom: 20rpx;
  animation: bounce 2s ease-in-out infinite;
}

@keyframes bounce {
  0%, 100% { transform: translateY(0px); }
  50% { transform: translateY(-10px); }
}

.demo-title {
  display: block;
  font-size: 48rpx;
  font-weight: 800;
  color: #2E3A59;
  margin-bottom: 10rpx;
  background: linear-gradient(135deg, #FF9500, #FF6B35);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.demo-subtitle {
  display: block;
  font-size: 28rpx;
  color: #666;
  opacity: 0.9;
}

/* 功能介绍 */
.features-section {
  margin-bottom: 50rpx;
}

.section-title {
  margin-bottom: 30rpx;
  text-align: center;
}

.title-text {
  font-size: 36rpx;
  font-weight: 700;
  color: white;
  text-shadow: 0 2rpx 4rpx rgba(0, 0, 0, 0.3);
}

.features-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 20rpx;
}

.feature-card {
  background: rgba(255, 255, 255, 0.9);
  border-radius: 20rpx;
  padding: 30rpx 20rpx;
  text-align: center;
  box-shadow: 0 8rpx 25rpx rgba(0, 0, 0, 0.1);
  backdrop-filter: blur(10rpx);
  transition: all 0.3s ease;
  
  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 15rpx 35rpx rgba(0, 0, 0, 0.15);
  }
}

.feature-icon {
  font-size: 48rpx;
  margin-bottom: 15rpx;
}

.feature-name {
  display: block;
  font-size: 28rpx;
  font-weight: 600;
  color: #333;
  margin-bottom: 10rpx;
}

.feature-desc {
  display: block;
  font-size: 24rpx;
  color: #666;
  line-height: 1.4;
}

/* 快速入口 */
.quick-access {
  margin-bottom: 50rpx;
}

.access-buttons {
  display: flex;
  flex-direction: column;
  gap: 20rpx;
}

.access-btn {
  padding: 40rpx 30rpx;
  border-radius: 25rpx;
  display: flex;
  align-items: center;
  gap: 25rpx;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 8rpx 25rpx rgba(0, 0, 0, 0.15);
  
  &.primary {
    background: linear-gradient(135deg, #FF9500 0%, #FF6B35 100%);
    color: white;
    
    &:active {
      transform: scale(0.98);
    }
  }
  
  &.secondary {
    background: rgba(255, 255, 255, 0.9);
    color: #333;
    
    &:active {
      transform: scale(0.98);
      background: rgba(255, 149, 0, 0.1);
    }
  }
}

.btn-icon {
  font-size: 48rpx;
  flex-shrink: 0;
}

.btn-text {
  font-size: 32rpx;
  font-weight: 600;
  margin-bottom: 5rpx;
}

.btn-desc {
  font-size: 24rpx;
  opacity: 0.8;
}

/* 使用说明 */
.instructions-section {
  margin-bottom: 40rpx;
}

.instructions-list {
  background: rgba(255, 255, 255, 0.9);
  border-radius: 25rpx;
  padding: 30rpx;
  box-shadow: 0 8rpx 25rpx rgba(0, 0, 0, 0.1);
  backdrop-filter: blur(10rpx);
}

.instruction-item {
  display: flex;
  align-items: flex-start;
  gap: 20rpx;
  margin-bottom: 30rpx;
  
  &:last-child {
    margin-bottom: 0;
  }
}

.instruction-number {
  width: 50rpx;
  height: 50rpx;
  background: linear-gradient(135deg, #FF9500 0%, #FF6B35 100%);
  color: white;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 24rpx;
  font-weight: 600;
  flex-shrink: 0;
}

.instruction-content {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 8rpx;
}

.instruction-title {
  font-size: 28rpx;
  font-weight: 600;
  color: #333;
}

.instruction-desc {
  font-size: 26rpx;
  color: #666;
  line-height: 1.5;
}

/* 底部提示 */
.demo-footer {
  text-align: center;
  padding: 30rpx;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 20rpx;
  backdrop-filter: blur(10rpx);
}

.footer-text {
  font-size: 24rpx;
  color: white;
  line-height: 1.5;
  opacity: 0.9;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .features-grid {
    grid-template-columns: 1fr;
  }
  
  .access-btn {
    flex-direction: column;
    text-align: center;
    gap: 15rpx;
  }
}

@media (max-width: 480px) {
  .map-demo-container {
    padding: 30rpx 20rpx;
  }
  
  .demo-header {
    padding: 30rpx 20rpx;
  }
  
  .demo-title {
    font-size: 40rpx;
  }
  
  .feature-card {
    padding: 25rpx 15rpx;
  }
  
  .access-btn {
    padding: 30rpx 20rpx;
  }
  
  .instructions-list {
    padding: 25rpx 20rpx;
  }
}
</style>

