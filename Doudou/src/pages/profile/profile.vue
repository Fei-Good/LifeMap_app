<template>
  <view class="profile-page">
    <!-- 状态栏占位 -->
    <view class="status-bar" :style="{height: statusBarHeight + 'px'}"></view>
    
    <!-- 头部 -->
    <view class="profile-header">
      <view class="back-btn" @tap="goBack">
        <text class="back-icon">←</text>
      </view>
      <text class="header-title">个人资料</text>
    </view>
    
    <!-- 用户信息 -->
    <view class="user-info">
      <view class="avatar-section">
        <image class="user-avatar" src="/static/login/DouDou_主形象.png" mode="aspectFit" />
      </view>
      <view class="info-section">
        <view class="info-item">
          <text class="label">用户名</text>
          <text class="value">{{ userInfo.username || '未设置' }}</text>
        </view>
        <view class="info-item">
          <text class="label">手机号码</text>
          <text class="value">{{ userInfo.phone || '未设置' }}</text>
        </view>
        <view class="info-item">
          <text class="label">注册时间</text>
          <text class="value">{{ formatDate(userInfo.createdAt) }}</text>
        </view>
        <view class="info-item">
          <text class="label">最后登录</text>
          <text class="value">{{ formatDate(userInfo.lastLoginAt) || '从未登录' }}</text>
        </view>
      </view>
    </view>
    
    <!-- 操作按钮 -->
    <view class="action-section">
      <button class="logout-btn" @tap="handleLogout">退出登录</button>
    </view>
  </view>
</template>

<script>
export default {
  data() {
    return {
      statusBarHeight: 0,
      userInfo: {
        username: '测试用户',
        phone: '138****8888',
        createdAt: new Date().toISOString(),
        lastLoginAt: new Date().toISOString()
      }
    }
  },
  onLoad() {
    this.getSystemInfo()
  },
  methods: {
    getSystemInfo() {
      const systemInfo = uni.getSystemInfoSync()
      this.statusBarHeight = systemInfo.statusBarHeight || 0
    },
    
    goBack() {
      uni.navigateBack()
    },
    
    handleLogout() {
      uni.showModal({
        title: '确认退出',
        content: '确定要退出登录吗？',
        success: (res) => {
          if (res.confirm) {
            uni.showToast({
              title: '已退出登录',
              icon: 'success'
            })
            setTimeout(() => {
              uni.navigateBack()
            }, 1000)
          }
        }
      })
    },
    
    formatDate(dateString) {
      if (!dateString) return '未知'
      const date = new Date(dateString)
      return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`
    }
  }
}
</script>

<style scoped>
.profile-page {
  min-height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}

.status-bar {
  background: transparent;
}

.profile-header {
  display: flex;
  align-items: center;
  padding: 20rpx 30rpx;
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(20px);
}

.back-btn {
  width: 80rpx;
  height: 80rpx;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.2);
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 20rpx;
}

.back-icon {
  font-size: 32rpx;
  color: white;
  font-weight: bold;
}

.header-title {
  font-size: 36rpx;
  color: white;
  font-weight: bold;
}

.user-info {
  margin: 40rpx 30rpx;
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(20px);
  border-radius: 24rpx;
  padding: 40rpx;
  box-shadow: 0 8rpx 32rpx rgba(0, 0, 0, 0.1);
}

.avatar-section {
  text-align: center;
  margin-bottom: 40rpx;
}

.user-avatar {
  width: 160rpx;
  height: 160rpx;
  border-radius: 50%;
  border: 4rpx solid rgba(102, 126, 234, 0.3);
}

.info-section {
  display: flex;
  flex-direction: column;
  gap: 30rpx;
}

.info-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20rpx 0;
  border-bottom: 1rpx solid rgba(0, 0, 0, 0.1);
}

.info-item:last-child {
  border-bottom: none;
}

.label {
  font-size: 28rpx;
  color: #666;
  font-weight: 500;
}

.value {
  font-size: 28rpx;
  color: #333;
  font-weight: 600;
}

.action-section {
  margin: 40rpx 30rpx;
}

.logout-btn {
  width: 100%;
  background: rgba(255, 71, 87, 0.9);
  color: white;
  border: none;
  border-radius: 50rpx;
  padding: 28rpx 0;
  font-size: 28rpx;
  font-weight: 600;
  transition: all 0.3s ease;
}

.logout-btn:active {
  background: rgba(255, 71, 87, 1);
  transform: translateY(-2rpx);
}
</style>
