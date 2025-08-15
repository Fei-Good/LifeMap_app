<template>
  <view class="content">
    <image class="logo" src="/static/logo.png"></image>
    <view class="text-area">
      <text class="title">{{ title }}</text>
      <text class="subtitle">LifeMap职场成长助手</text>
    </view>
    
    <view class="action-area">
      <button class="chat-btn" @tap="goToChat" v-if="isLoggedIn">
        <view class="btn-content">
          <text class="doudou-icon">😊</text>
          <view class="btn-text">
            <text class="btn-title">与DouDou聊天</text>
            <text class="btn-desc">你的职场搭子随时待命</text>
          </view>
        </view>
      </button>
      
      <button class="task-btn" @tap="goToTask" v-if="isLoggedIn">
        <view class="btn-content">
          <text class="task-icon">🎯</text>
          <view class="btn-text">
            <text class="btn-title">任务系统</text>
            <text class="btn-desc">游戏化完成工作任务</text>
          </view>
        </view>
      </button>
      
      <button class="login-btn" @tap="goToLogin" v-if="!isLoggedIn">
        <text>登录/注册</text>
      </button>
      
      <button class="profile-btn" @tap="goToProfile" v-if="isLoggedIn">
        <text>个人资料</text>
      </button>
      
      <button class="logout-btn" @tap="handleLogout" v-if="isLoggedIn">
        <text>退出登录</text>
      </button>
    </view>
  </view>
</template>

<script>
import userService from '@/utils/userService'

export default {
  data() {
    return {
      title: 'LifeMap',
      isLoggedIn: false
    }
  },
  onLoad() {
    this.checkLoginStatus()
  },
  onShow() {
    this.checkLoginStatus()
  },
  methods: {
    checkLoginStatus() {
      this.isLoggedIn = userService.isLoggedIn()
    },
    
    goToChat() {
      if (!this.isLoggedIn) {
        uni.showToast({
          title: '请先登录',
          icon: 'none'
        })
        return
      }
      uni.navigateTo({
        url: '/pages/chat/chat'
      })
    },
    
    goToTask() {
      if (!this.isLoggedIn) {
        uni.showToast({
          title: '请先登录',
          icon: 'none'
        })
        return
      }
      uni.navigateTo({
        url: '/pages/task/task'
      })
    },
    
    goToLogin() {
      if (this.isLoggedIn) {
        uni.showToast({
          title: '您已登录',
          icon: 'none'
        })
        return
      }
      uni.navigateTo({
        url: '/pages/login/login'
      })
    },
    
    goToProfile() {
      uni.navigateTo({
        url: '/pages/profile/profile'
      })
    },
    
    handleLogout() {
      uni.showModal({
        title: '确认退出',
        content: '确定要退出登录吗？',
        success: (res) => {
          if (res.confirm) {
            userService.logout()
            this.checkLoginStatus()
            uni.showToast({
              title: '已退出登录',
              icon: 'success'
            })
          }
        }
      })
    },
    
    goToMap() {
      uni.navigateTo({
        url: '/pages/map/map'
      })
    }
  },
}
</script>

<style>
.content {
  min-height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 40rpx;
}

.logo {
  height: 200rpx;
  width: 200rpx;
  margin-bottom: 50rpx;
  border-radius: 50%;
  border: 4rpx solid rgba(255, 255, 255, 0.3);
}

.text-area {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-bottom: 80rpx;
}

.title {
  font-size: 48rpx;
  color: white;
  font-weight: 700;
  margin-bottom: 16rpx;
}

.subtitle {
  font-size: 28rpx;
  color: rgba(255, 255, 255, 0.8);
  text-align: center;
}

.action-area {
  width: 100%;
  max-width: 600rpx;
  display: flex;
  flex-direction: column;
  gap: 32rpx;
}

.chat-btn {
  background: rgba(255, 255, 255, 0.95);
  border-radius: 40rpx;
  padding: 0;
  border: none;
  overflow: hidden;
  backdrop-filter: blur(10px);
  box-shadow: 0 16rpx 40rpx rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;
}

.chat-btn:active {
  transform: translateY(-4rpx);
  box-shadow: 0 20rpx 60rpx rgba(0, 0, 0, 0.15);
}

.task-btn {
  background: rgba(255, 255, 255, 0.95);
  border-radius: 40rpx;
  padding: 0;
  border: none;
  overflow: hidden;
  backdrop-filter: blur(10px);
  box-shadow: 0 16rpx 40rpx rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;
}

.task-btn:active {
  transform: translateY(-4rpx);
  box-shadow: 0 20rpx 60rpx rgba(0, 0, 0, 0.15);
}

.map-btn {
  background: rgba(255, 255, 255, 0.95);
  border-radius: 40rpx;
  padding: 0;
  border: none;
  overflow: hidden;
  backdrop-filter: blur(10px);
  box-shadow: 0 16rpx 40rpx rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;
}

.map-btn:active {
  transform: translateY(-4rpx);
  box-shadow: 0 20rpx 60rpx rgba(0, 0, 0, 0.15);
}

.btn-content {
  display: flex;
  align-items: center;
  padding: 32rpx 40rpx;
  gap: 24rpx;
}

.doudou-icon {
  width: 80rpx;
  height: 80rpx;
  background: linear-gradient(45deg, #ff6b6b, #ffa500);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 40rpx;
  flex-shrink: 0;
}

.task-icon {
  width: 80rpx;
  height: 80rpx;
  background: linear-gradient(45deg, #4facfe, #00f2fe);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 40rpx;
  flex-shrink: 0;
}

.map-icon {
  width: 80rpx;
  height: 80rpx;
  background: linear-gradient(45deg, #28a745, #20c997);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 40rpx;
  flex-shrink: 0;
}

.btn-text {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 8rpx;
}

.btn-title {
  font-size: 32rpx;
  color: #333;
  font-weight: 600;
}

.btn-desc {
  font-size: 24rpx;
  color: #666;
}

.login-btn {
  background: rgba(255, 255, 255, 0.2);
  color: white;
  border: 2rpx solid rgba(255, 255, 255, 0.3);
  border-radius: 50rpx;
  padding: 28rpx 0;
  font-size: 28rpx;
  font-weight: 600;
  transition: all 0.3s ease;
  backdrop-filter: blur(10px);
}

.login-btn:active {
  background: rgba(255, 255, 255, 0.3);
  transform: translateY(-2rpx);
}

.profile-btn {
  background: rgba(255, 255, 255, 0.2);
  color: white;
  border: 2rpx solid rgba(255, 255, 255, 0.3);
  border-radius: 50rpx;
  padding: 28rpx 0;
  font-size: 28rpx;
  font-weight: 600;
  transition: all 0.3s ease;
  backdrop-filter: blur(10px);
  margin-top: 20rpx;
}

.profile-btn:active {
  background: rgba(255, 255, 255, 0.3);
  transform: translateY(-2rpx);
}

.logout-btn {
  background: rgba(255, 71, 87, 0.2);
  color: white;
  border: 2rpx solid rgba(255, 71, 87, 0.3);
  border-radius: 50rpx;
  padding: 28rpx 0;
  font-size: 28rpx;
  font-weight: 600;
  transition: all 0.3s ease;
  backdrop-filter: blur(10px);
  margin-top: 20rpx;
}

.logout-btn:active {
  background: rgba(255, 71, 87, 0.3);
  transform: translateY(-2rpx);
}

/* 响应式 */
@media screen and (max-width: 400px) {
  .content {
    padding: 20rpx;
  }
  
  .btn-content {
    padding: 24rpx 32rpx;
  }
  
  .doudou-icon {
    width: 60rpx;
    height: 60rpx;
    font-size: 32rpx;
  }
  
  .btn-title {
    font-size: 28rpx;
  }
  
  .btn-desc {
    font-size: 22rpx;
  }
}
</style>
