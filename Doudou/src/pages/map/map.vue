<template>
  <view class="map-container">
    <!-- 顶部标题 -->
    <view class="header">
      <text class="title">DouDou成长地图</text>
      <text class="subtitle">欢迎回来！继续你的成长之旅</text>
    </view>
    
    <!-- 主要内容区域 -->
    <view class="main-content">
      <!-- DouDou欢迎形象 -->
      <view class="doudou-welcome">
        <image 
          class="doudou-happy"
          src="@/static/DouDou比心.gif"
          mode="aspectFit"
        />
        <view class="welcome-message">
          <text class="message-text">DouDou很想你呢！</text>
          <text class="sub-text">让我们继续一起成长吧~</text>
        </view>
      </view>
      
      <!-- 功能导航区域 -->
      <view class="navigation-grid">
        <view class="nav-item" @click="goToChat">
          <view class="nav-icon chat-icon">💬</view>
          <text class="nav-text">与DouDou聊天</text>
        </view>
        
        <view class="nav-item" @click="goToTask">
          <view class="nav-icon task-icon">📝</view>
          <text class="nav-text">任务系统</text>
        </view>
        
        <view class="nav-item" @click="goToProfile">
          <view class="nav-icon profile-icon">👤</view>
          <text class="nav-text">个人资料</text>
        </view>
        
        <view class="nav-item" @click="retakeAssessment">
          <view class="nav-icon test-icon">🧠</view>
          <text class="nav-text">重新测试</text>
        </view>
      </view>
    </view>
  </view>
</template>

<script setup>
import { onMounted } from 'vue'
import userService from '@/utils/userService'

// 页面加载
onMounted(() => {
  const currentUser = userService.getCurrentUser()
  console.log('地图页面加载，当前用户:', currentUser)
})

// 导航方法
const goToChat = () => {
  uni.navigateTo({
    url: '/pages/chat/chat'
  })
}

const goToTask = () => {
  uni.navigateTo({
    url: '/pages/task/task'
  })
}

const goToProfile = () => {
  uni.navigateTo({
    url: '/pages/profile/profile'
  })
}

const retakeAssessment = () => {
  uni.showModal({
    title: '重新测试',
    content: '确定要重新进行性格测试吗？这将覆盖你当前的测试结果。',
    success: (res) => {
      if (res.confirm) {
        // 重置用户的测试状态
        const currentUser = userService.getCurrentUser()
        if (currentUser) {
          userService.updateUserInfo({
            infoCollected: false,
            questionnaireAnswers: [],
            questionnaireCompletedAt: null
          })
        }
        
        uni.redirectTo({
          url: '/pages/user-info-collection/user-info-collection'
        })
      }
    }
  })
}
</script>

<style lang="scss" scoped>
.map-container {
  width: 100vw;
  height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  display: flex;
  flex-direction: column;
}

/* 顶部区域 */
.header {
  padding: 60rpx 40rpx 40rpx;
  text-align: center;
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10rpx);
}

.title {
  display: block;
  font-size: 48rpx;
  font-weight: 700;
  color: #fff;
  margin-bottom: 20rpx;
  text-shadow: 0 4rpx 8rpx rgba(0, 0, 0, 0.3);
}

.subtitle {
  display: block;
  font-size: 28rpx;
  color: rgba(255, 255, 255, 0.8);
  font-weight: 500;
}

/* 主要内容 */
.main-content {
  flex: 1;
  padding: 40rpx;
  display: flex;
  flex-direction: column;
  gap: 60rpx;
}

/* DouDou欢迎区域 */
.doudou-welcome {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 30rpx;
  background: rgba(255, 255, 255, 0.15);
  border-radius: 40rpx;
  padding: 50rpx;
  backdrop-filter: blur(15rpx);
  border: 2rpx solid rgba(255, 255, 255, 0.2);
}

.doudou-happy {
  width: 200rpx;
  height: 200rpx;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.1);
  padding: 20rpx;
}

.welcome-message {
  text-align: center;
}

.message-text {
  display: block;
  font-size: 36rpx;
  font-weight: 600;
  color: #fff;
  margin-bottom: 15rpx;
  text-shadow: 0 2rpx 4rpx rgba(0, 0, 0, 0.3);
}

.sub-text {
  display: block;
  font-size: 28rpx;
  color: rgba(255, 255, 255, 0.8);
  font-weight: 500;
}

/* 导航网格 */
.navigation-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 30rpx;
}

.nav-item {
  background: rgba(255, 255, 255, 0.2);
  border-radius: 30rpx;
  padding: 50rpx 30rpx;
  text-align: center;
  transition: all 0.3s ease;
  cursor: pointer;
  backdrop-filter: blur(10rpx);
  border: 2rpx solid rgba(255, 255, 255, 0.1);
  
  &:active {
    transform: scale(0.95);
    background: rgba(255, 255, 255, 0.25);
  }
}

.nav-icon {
  font-size: 60rpx;
  margin-bottom: 20rpx;
  display: block;
  height: 80rpx;
  line-height: 80rpx;
}

.nav-text {
  font-size: 28rpx;
  color: #fff;
  font-weight: 600;
  text-shadow: 0 2rpx 4rpx rgba(0, 0, 0, 0.3);
}

/* 响应式适配 */
@media screen and (max-width: 375px) {
  .header {
    padding: 50rpx 30rpx 30rpx;
  }
  
  .title {
    font-size: 42rpx;
  }
  
  .subtitle {
    font-size: 26rpx;
  }
  
  .main-content {
    padding: 30rpx;
    gap: 50rpx;
  }
  
  .doudou-welcome {
    padding: 40rpx 30rpx;
  }
  
  .doudou-happy {
    width: 180rpx;
    height: 180rpx;
  }
  
  .message-text {
    font-size: 32rpx;
  }
  
  .sub-text {
    font-size: 26rpx;
  }
  
  .navigation-grid {
    gap: 25rpx;
  }
  
  .nav-item {
    padding: 40rpx 25rpx;
  }
  
  .nav-icon {
    font-size: 50rpx;
    height: 70rpx;
    line-height: 70rpx;
    margin-bottom: 15rpx;
  }
  
  .nav-text {
    font-size: 26rpx;
  }
}
</style>
