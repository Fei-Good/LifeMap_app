<template>
  <view class="content">
    <!-- 背景装饰 -->
    <view class="bg-decoration">
      <view class="floating-shapes">
        <view class="shape shape-1"></view>
        <view class="shape shape-2"></view>
        <view class="shape shape-3"></view>
        <view class="shape shape-4"></view>
        <view class="shape shape-5"></view>
      </view>
    </view>
    
    <!-- 头部区域 -->
    <view class="header-section">
      <view class="logo-container">
        <image class="logo" src="/static/logo.png"></image>
        <view class="logo-glow"></view>
      </view>
      
      <view class="text-area">
        <text class="title">{{ title }}</text>
        <text class="subtitle">LifeMap职场成长助手</text>
        <view class="title-decoration"></view>
      </view>
    </view>
    
    <!-- 功能区域 -->
    <view class="action-area">
      <!-- 主要功能按钮 -->
      <view class="main-buttons" v-if="isLoggedIn">
        <button class="chat-btn" @tap="goToChat">
          <view class="btn-content">
            <view class="icon-container">
              <text class="doudou-icon">😊</text>
              <view class="icon-glow"></view>
            </view>
            <view class="btn-text">
              <text class="btn-title">与DouDou聊天</text>
              <text class="btn-desc">你的职场搭子随时待命</text>
            </view>
          </view>
          <view class="btn-decoration"></view>
        </button>
        
        <button class="task-btn" @tap="goToTask">
          <view class="btn-content">
            <view class="icon-container">
              <text class="task-icon">🎯</text>
              <view class="icon-glow"></view>
            </view>
            <view class="btn-text">
              <text class="btn-title">任务系统</text>
              <text class="btn-desc">游戏化完成工作任务</text>
            </view>
          </view>
          <view class="btn-decoration"></view>
        </button>
      </view>
      
      <!-- 登录按钮 -->
      <button class="login-btn" @tap="goToLogin" v-if="!isLoggedIn">
        <view class="login-content">
          <text class="login-text">登录/注册</text>
          <view class="login-arrow">→</view>
        </view>
        <view class="login-glow"></view>
      </button>
      
      <!-- 用户操作按钮 -->
      <view class="user-actions" v-if="isLoggedIn">
        <button class="profile-btn" @tap="goToProfile">
          <view class="profile-content">
            <text class="profile-icon">👤</text>
            <text class="profile-text">个人资料</text>
          </view>
        </button>
        
        <button class="logout-btn" @tap="handleLogout">
          <view class="logout-content">
            <text class="logout-icon">🚪</text>
            <text class="logout-text">退出登录</text>
          </view>
        </button>
      </view>
    </view>
    
    <!-- 底部装饰 -->
    <view class="bottom-decoration">
      <view class="wave-container">
        <view class="wave wave-1"></view>
        <view class="wave wave-2"></view>
        <view class="wave wave-3"></view>
      </view>
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
  position: relative;
  overflow: hidden;
}

.bg-decoration {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: -1;
  overflow: hidden;
}

.floating-shapes {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
}

.shape {
  position: absolute;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 50%;
  opacity: 0.5;
  animation: float 10s infinite ease-in-out;
}

.shape-1 {
  width: 100px;
  height: 100px;
  top: 10%;
  left: 20%;
  animation-delay: -2s;
}

.shape-2 {
  width: 150px;
  height: 150px;
  top: 70%;
  left: 70%;
  animation-delay: -5s;
}

.shape-3 {
  width: 80px;
  height: 80px;
  top: 30%;
  left: 40%;
  animation-delay: -3s;
}

.shape-4 {
  width: 120px;
  height: 120px;
  top: 50%;
  left: 10%;
  animation-delay: -4s;
}

.shape-5 {
  width: 90px;
  height: 90px;
  top: 80%;
  left: 80%;
  animation-delay: -6s;
}

@keyframes float {
  0% {
    transform: translateY(0) translateX(0) scale(1);
    opacity: 0.5;
  }
  25% {
    transform: translateY(-20px) translateX(10px) scale(1.1);
    opacity: 0.7;
  }
  50% {
    transform: translateY(0) translateX(0) scale(1);
    opacity: 0.5;
  }
  75% {
    transform: translateY(20px) translateX(-10px) scale(1.1);
    opacity: 0.7;
  }
  100% {
    transform: translateY(0) translateX(0) scale(1);
    opacity: 0.5;
  }
}

.header-section {
  text-align: center;
  margin-bottom: 80rpx;
  position: relative;
  z-index: 1;
}

.logo-container {
  position: relative;
  margin-bottom: 20rpx;
}

.logo {
  height: 200rpx;
  width: 200rpx;
  border-radius: 50%;
  border: 4rpx solid rgba(255, 255, 255, 0.3);
  box-shadow: 0 10rpx 30rpx rgba(0, 0, 0, 0.2);
  transition: transform 0.5s ease;
}

.logo:hover {
  transform: scale(1.05);
}

.logo-glow {
  position: absolute;
  top: -20rpx;
  left: -20rpx;
  width: 240rpx;
  height: 240rpx;
  border-radius: 50%;
  background: radial-gradient(circle, rgba(255, 255, 255, 0.3) 0%, transparent 70%);
  opacity: 0.5;
  z-index: -1;
  animation: glow 3s infinite alternate;
}

@keyframes glow {
  from {
    transform: scale(1);
    opacity: 0.5;
  }
  to {
    transform: scale(1.2);
    opacity: 0.8;
  }
}

.text-area {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-bottom: 10rpx;
}

.title {
  font-size: 48rpx;
  color: white;
  font-weight: 700;
  margin-bottom: 16rpx;
  text-shadow: 2rpx 2rpx 4rpx rgba(0, 0, 0, 0.3);
  animation: titleSlideIn 1s ease-out;
}

@keyframes titleSlideIn {
  from {
    opacity: 0;
    transform: translateY(-30rpx);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.subtitle {
  font-size: 28rpx;
  color: rgba(255, 255, 255, 0.8);
  text-align: center;
  margin-bottom: 20rpx;
  text-shadow: 1rpx 1rpx 2rpx rgba(0, 0, 0, 0.2);
  animation: subtitleSlideIn 1s ease-out 0.3s both;
}

@keyframes subtitleSlideIn {
  from {
    opacity: 0;
    transform: translateY(-20rpx);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.title-decoration {
  width: 100rpx;
  height: 8rpx;
  background: rgba(255, 255, 255, 0.5);
  border-radius: 4rpx;
  margin-top: 10rpx;
  box-shadow: 0 2rpx 8rpx rgba(255, 255, 255, 0.3);
  animation: decorationGrow 1s ease-out 0.6s both;
}

@keyframes decorationGrow {
  from {
    width: 0;
    opacity: 0;
  }
  to {
    width: 100rpx;
    opacity: 1;
  }
}

.action-area {
  width: 100%;
  max-width: 600rpx;
  display: flex;
  flex-direction: column;
  gap: 32rpx;
  position: relative;
  z-index: 1;
}

.main-buttons {
  display: flex;
  flex-direction: column;
  gap: 32rpx;
  animation: buttonsSlideIn 1s ease-out 0.9s both;
}

@keyframes buttonsSlideIn {
  from {
    opacity: 0;
    transform: translateY(30rpx);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.chat-btn, .task-btn {
  background: rgba(255, 255, 255, 0.95);
  border-radius: 40rpx;
  padding: 0;
  border: none;
  overflow: hidden;
  backdrop-filter: blur(10px);
  box-shadow: 0 16rpx 40rpx rgba(0, 0, 0, 0.1);
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  position: relative;
  border: 1rpx solid rgba(255, 255, 255, 0.2);
}

.chat-btn:active, .task-btn:active {
  transform: translateY(-8rpx) scale(1.02);
  box-shadow: 0 20rpx 60rpx rgba(0, 0, 0, 0.2);
}

.btn-content {
  display: flex;
  align-items: center;
  padding: 32rpx 40rpx;
  gap: 24rpx;
  position: relative;
}

.icon-container {
  position: relative;
  width: 80rpx;
  height: 80rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.doudou-icon, .task-icon {
  width: 100%;
  height: 100%;
  background: linear-gradient(45deg, #ff6b6b, #ffa500);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 40rpx;
  flex-shrink: 0;
  position: relative;
  transition: all 0.3s ease;
}

.task-icon {
  background: linear-gradient(45deg, #4facfe, #00f2fe);
}

.icon-glow {
  position: absolute;
  top: -10rpx;
  left: -10rpx;
  width: 100rpx;
  height: 100rpx;
  border-radius: 50%;
  background: radial-gradient(circle, rgba(255, 255, 255, 0.3) 0%, transparent 70%);
  opacity: 0.5;
  z-index: -1;
  animation: iconGlow 2s infinite alternate;
}

@keyframes iconGlow {
  from {
    opacity: 0.3;
    transform: scale(1);
  }
  to {
    opacity: 0.6;
    transform: scale(1.1);
  }
}

.btn-text {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 8rpx;
  flex: 1;
}

.btn-title {
  font-size: 32rpx;
  color: #333;
  font-weight: 600;
  transition: color 0.3s ease;
}

.btn-desc {
  font-size: 24rpx;
  color: #666;
  line-height: 1.4;
}

.btn-decoration {
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
  height: 6rpx;
  background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.6), transparent);
  opacity: 0;
  transition: opacity 0.3s ease;
}

.chat-btn:hover .btn-decoration,
.task-btn:hover .btn-decoration {
  opacity: 1;
}

.login-btn {
  background: rgba(255, 255, 255, 0.2);
  color: white;
  border: 2rpx solid rgba(255, 255, 255, 0.3);
  border-radius: 50rpx;
  padding: 28rpx 0;
  font-size: 28rpx;
  font-weight: 600;
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  backdrop-filter: blur(10px);
  position: relative;
  overflow: hidden;
  animation: loginSlideIn 1s ease-out 1.2s both;
}

@keyframes loginSlideIn {
  from {
    opacity: 0;
    transform: translateY(30rpx);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.login-btn:active {
  background: rgba(255, 255, 255, 0.3);
  transform: translateY(-4rpx) scale(1.02);
  box-shadow: 0 8rpx 24rpx rgba(255, 255, 255, 0.2);
}

.login-content {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10rpx;
  position: relative;
  z-index: 1;
}

.login-text {
  font-size: 28rpx;
  color: white;
  font-weight: 600;
}

.login-arrow {
  font-size: 28rpx;
  color: white;
  font-weight: 600;
  transition: transform 0.3s ease;
}

.login-btn:active .login-arrow {
  transform: translateX(10rpx);
}

.login-glow {
  position: absolute;
  top: -20rpx;
  left: -20rpx;
  width: 240rpx;
  height: 240rpx;
  border-radius: 50%;
  background: radial-gradient(circle, rgba(255, 255, 255, 0.2) 0%, transparent 70%);
  opacity: 0.5;
  z-index: -1;
  animation: loginGlow 3s infinite alternate;
}

@keyframes loginGlow {
  from {
    transform: scale(1);
    opacity: 0.3;
  }
  to {
    transform: scale(1.3);
    opacity: 0.6;
  }
}

.user-actions {
  display: flex;
  flex-direction: column;
  gap: 20rpx;
  margin-top: 20rpx;
  animation: userActionsSlideIn 1s ease-out 1.5s both;
}

@keyframes userActionsSlideIn {
  from {
    opacity: 0;
    transform: translateY(30rpx);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.profile-btn, .logout-btn {
  background: rgba(255, 255, 255, 0.2);
  color: white;
  border: 2rpx solid rgba(255, 255, 255, 0.3);
  border-radius: 50rpx;
  padding: 28rpx 0;
  font-size: 28rpx;
  font-weight: 600;
  transition: all 0.3s ease;
  backdrop-filter: blur(10px);
  position: relative;
  overflow: hidden;
}

.profile-btn:active, .logout-btn:active {
  background: rgba(255, 255, 255, 0.3);
  transform: translateY(-4rpx) scale(1.02);
  box-shadow: 0 8rpx 24rpx rgba(255, 255, 255, 0.2);
}

.profile-content, .logout-content {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10rpx;
  position: relative;
  z-index: 1;
}

.profile-icon, .logout-icon {
  font-size: 28rpx;
  color: white;
  font-weight: 600;
  transition: transform 0.3s ease;
}

.profile-btn:active .profile-icon,
.logout-btn:active .logout-icon {
  transform: scale(1.2);
}

.profile-text, .logout-text {
  font-size: 28rpx;
  color: white;
  font-weight: 600;
}

.logout-btn {
  background: rgba(255, 71, 87, 0.2);
  border-color: rgba(255, 71, 87, 0.3);
}

.logout-btn:active {
  background: rgba(255, 71, 87, 0.3);
}

.bottom-decoration {
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
  height: 200rpx;
  background: linear-gradient(to top, rgba(255, 255, 255, 0.1), transparent);
  z-index: 0;
  overflow: hidden;
}

.wave-container {
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
  overflow: hidden;
}

.wave {
  position: absolute;
  bottom: 0;
  left: 0;
  width: 200%;
  height: 200rpx;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 50% 50% 0 0;
  transform: translateY(0);
  animation: wave-animation 10s infinite linear;
}

.wave-1 {
  top: 0;
  animation-delay: -2s;
}

.wave-2 {
  top: 50rpx;
  animation-delay: -5s;
}

.wave-3 {
  top: 100rpx;
  animation-delay: -8s;
}

@keyframes wave-animation {
  0% {
    transform: translateX(0);
  }
  100% {
    transform: translateX(-50%);
  }
}

/* 响应式 */
@media screen and (max-width: 400px) {
  .content {
    padding: 20rpx;
  }
  
  .header-section {
    margin-bottom: 50rpx;
  }

  .logo {
    height: 150rpx;
    width: 150rpx;
  }

  .logo-glow {
    width: 180rpx;
    height: 180rpx;
    top: -15rpx;
    left: -15rpx;
  }

  .text-area {
    margin-bottom: 0;
  }

  .title {
    font-size: 36rpx;
  }

  .subtitle {
    font-size: 24rpx;
  }

  .title-decoration {
    width: 80rpx;
    height: 6rpx;
    margin-top: 8rpx;
  }

  .main-buttons {
    gap: 24rpx;
  }

  .chat-btn, .task-btn {
    padding: 0 32rpx;
  }

  .btn-content {
    padding: 24rpx 32rpx;
  }

  .icon-container {
    width: 60rpx;
    height: 60rpx;
  }

  .doudou-icon, .task-icon {
    font-size: 32rpx;
  }

  .btn-title {
    font-size: 28rpx;
  }

  .btn-desc {
    font-size: 22rpx;
  }

  .login-btn {
    padding: 24rpx 0;
  }

  .login-content {
    gap: 8rpx;
  }

  .login-text {
    font-size: 24rpx;
  }

  .login-arrow {
    font-size: 24rpx;
  }

  .user-actions {
    gap: 16rpx;
  }

  .profile-btn, .logout-btn {
    padding: 24rpx 0;
  }

  .profile-icon, .logout-icon {
    font-size: 24rpx;
  }

  .profile-text, .logout-text {
    font-size: 24rpx;
  }

  .bottom-decoration {
    height: 150rpx;
  }

  .wave {
    height: 150rpx;
  }

  .wave-1 {
    top: 0;
  }

  .wave-2 {
    top: 40rpx;
  }

  .wave-3 {
    top: 80rpx;
  }
}
</style>
