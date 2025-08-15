<template>
  <view class="profile-container">
    <view class="top-nav">
      <view class="nav-back" @click="goBack">
        <text class="back-icon">←</text>
        <text class="back-text">返回</text>
      </view>
      <view class="nav-title">
        <text class="title-text">个人资料</text>
      </view>
    </view>
    
    <view class="user-info">
      <view class="avatar-section">
        <image 
          class="user-avatar" 
          src="@/static/login/DouDou形象_登录页.png" 
          mode="aspectFit"
        />
      </view>
      
      <view class="info-section">
        <view class="info-item">
          <text class="label">用户名</text>
          <text class="value">{{ currentUser?.username || '未设置' }}</text>
        </view>
        
        <view class="info-item">
          <text class="label">手机号码</text>
          <text class="value">{{ currentUser?.phone || '未设置' }}</text>
        </view>
        
        <view class="info-item">
          <text class="label">注册时间</text>
          <text class="value">{{ formatDate(currentUser?.createdAt) }}</text>
        </view>
        
        <view class="info-item">
          <text class="label">最后登录</text>
          <text class="value">{{ formatDate(currentUser?.lastLoginAt) || '从未登录' }}</text>
        </view>
      </view>
    </view>
    
    <view class="action-section">
      <button class="logout-btn" @click="handleLogout">
        <text>退出登录</text>
      </button>
    </view>
  </view>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import userService from '@/utils/userService'

const currentUser = ref(null)

onMounted(() => {
  loadCurrentUser()
})

const loadCurrentUser = () => {
  currentUser.value = userService.getCurrentUser()
}

const formatDate = (dateString) => {
  if (!dateString) return '未设置'
  
  try {
    const date = new Date(dateString)
    return date.toLocaleDateString('zh-CN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  } catch (e) {
    return '日期格式错误'
  }
}

const handleLogout = () => {
  uni.showModal({
    title: '确认退出',
    content: '确定要退出登录吗？',
    success: (res) => {
      if (res.confirm) {
        userService.logout()
        uni.showToast({
          title: '已退出登录',
          icon: 'success'
        })
        
        setTimeout(() => {
          uni.reLaunch({
            url: '/pages/index/index'
          })
        }, 1500)
      }
    }
  })
}

const goBack = () => {
  uni.navigateBack()
}
</script>

<style lang="scss" scoped>
.profile-container {
  width: 100vw;
  min-height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  position: relative;
  padding: 0 40rpx;
  box-sizing: border-box;
}

.top-nav {
  display: flex;
  align-items: center;
  padding: 120rpx 0 40rpx 0;
}

.nav-back {
  display: flex;
  align-items: center;
  gap: 10rpx;
  padding: 20rpx;
}

.back-icon {
  font-size: 36rpx;
  color: white;
  font-weight: bold;
}

.back-text {
  font-size: 28rpx;
  color: white;
}

.nav-title {
  flex: 1;
  text-align: center;
}

.title-text {
  font-size: 36rpx;
  color: white;
  font-weight: bold;
}

.user-info {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-bottom: 60rpx;
}

.avatar-section {
  margin-bottom: 40rpx;
}

.user-avatar {
  width: 160rpx;
  height: 160rpx;
  border-radius: 50%;
  border: 4rpx solid rgba(255, 255, 255, 0.3);
}

.info-section {
  width: 100%;
  max-width: 600rpx;
}

.info-item {
  background: rgba(255, 255, 255, 0.1);
  border-radius: 20rpx;
  padding: 30rpx;
  margin-bottom: 30rpx;
  backdrop-filter: blur(10px);
  border: 1rpx solid rgba(255, 255, 255, 0.2);
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.label {
  font-size: 28rpx;
  color: rgba(255, 255, 255, 0.8);
}

.value {
  font-size: 30rpx;
  color: white;
  font-weight: 500;
}

.action-section {
  width: 100%;
  display: flex;
  justify-content: center;
}

.logout-btn {
  background: rgba(255, 71, 87, 0.9);
  color: white;
  border: none;
  border-radius: 25rpx;
  padding: 30rpx 60rpx;
  font-size: 30rpx;
  font-weight: 600;
  transition: all 0.3s ease;
}

.logout-btn:active {
  transform: translateY(-2rpx);
}
</style>
