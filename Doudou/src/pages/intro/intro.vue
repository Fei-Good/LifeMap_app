<template>
  <view class="intro-container">
<!-- 顶部进度条和DouDou小图标 -->
<view class="header-section">
      <view class="doudou-avatar">
        <image 
          class="avatar-image"
          src="@/static/QA/火苗.png"
          mode="aspectFit"
        />
      </view>
      <view class="progress-container">
        <view class="mood-indicator">
          <text class="mood-text">DouDou心情指数</text>
        </view>
        <view class="progress-bar">
          <view 
            class="progress-fill" 
            :style="{ width: progressPercentage + '%' }"
          ></view>
        </view>
      </view>
      <view class="progress-text"></view>
    </view>

    <!-- 主要内容区域 -->
    <view class="main-content">
      <!-- 提示文字 -->
      <view class="message-container">
        <view class="message-bubble">
          <text class="message-text">DouDou (´•̥ ̯ •̥`) 不开心了</text>
          <text class="sub-message">戳戳他 看是什么原因</text>
        </view>
      </view>

      <!-- DouDou主体形象 -->
      <view class="doudou-container" @click="handleDouDouClick">
        <image 
          class="doudou-character"
          src="@/static/QA/2_matting.gif"
          mode="aspectFit"
        />
      </view>
    </view>
    
    <!-- 底部气泡弹窗 -->
    <view 
      class="bottom-bubble" 
      v-show="showBottomBubble"
      :class="{ 'bubble-show': showBottomBubble }"
    >
      <view class="bubble-content">
        <text class="bubble-text">最近我在职场上遇到了一些问题，可以帮帮我吗？</text>
        <view class="arrow-button" @click="goToQuestionnaire">
          <text class="arrow-icon">→</text>
        </view>
      </view>
    </view>
  </view>
</template>

<script setup>
import { onMounted, ref } from 'vue'
import userService from '@/utils/userService'

// 控制底部气泡显示
const showBottomBubble = ref(false)

// 页面加载时判断用户类型
onMounted(() => {
  checkUserType()
})

// 检查用户类型并进行相应跳转
const checkUserType = () => {
  const currentUser = userService.getCurrentUser()
  
  if (!currentUser) {
    // 用户未登录，跳转到登录页
    uni.redirectTo({
      url: '/pages/login/login'
    })
    return
  }
  
  // 如果是老用户（已完成信息收集），3秒后自动跳转到地图页面
  if (!userService.isNewUser(currentUser) || currentUser.infoCollected) {
    uni.showToast({
      title: 'DouDou想你了！',
      icon: 'none',
      duration: 2000
    })
    
    setTimeout(() => {
      uni.redirectTo({
        url: '/pages/map/map'
      })
    }, 3000)
  }
}

// 点击DouDou进入问卷
const handleDouDouClick = () => {
  const currentUser = userService.getCurrentUser()
  
  // 先显示底部气泡
  showBottomBubble.value = true
  
  // 震动反馈
  uni.vibrateShort({
    type: 'light'
  })
  
  // 5秒后直接跳转（气泡保持显示）
  setTimeout(() => {
    if (userService.isNewUser(currentUser) && !currentUser.infoCollected) {
      // 新用户进入问卷页面
      uni.navigateTo({
        url: '/pages/user-info-collection/user-info-collection'
      })
    } else {
      // 老用户直接跳转到地图
      uni.redirectTo({
        url: '/pages/map/map'
      })
    }
  }, 5000)
}

// 点击箭头直接跳转到问卷页面
const goToQuestionnaire = () => {
  const currentUser = userService.getCurrentUser()
  
  // 震动反馈
  uni.vibrateShort({
    type: 'light'
  })
  
  if (userService.isNewUser(currentUser) && !currentUser.infoCollected) {
    // 新用户进入问卷页面
    uni.navigateTo({
      url: '/pages/user-info-collection/user-info-collection'
    })
  } else {
    // 老用户直接跳转到地图
    uni.redirectTo({
      url: '/pages/map/map'
    })
  }
}
</script>

<style lang="scss" scoped>
.intro-container {
  width: 100vw;
  height: 100vh;
  background: url('@/static/QA/聊天背景.jpg') no-repeat center center;
  background-size: cover;
  display: flex;
  flex-direction: column;
  position: relative;
  overflow: hidden;
}

/* 顶部心情指数区域 */
/* 顶部区域 */
.header-section {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 40rpx 30rpx 20rpx;
  background: rgba(255, 255, 255, 0.8);
  backdrop-filter: blur(10rpx);
}

.doudou-avatar {
  width: 80rpx;
  height: 80rpx;
  border-radius: 50%;
  overflow: hidden;
  background: rgba(255, 193, 7, 0.1);
  display: flex;
  align-items: center;
  justify-content: center;
}

.avatar-image {
  width: 80rpx;
  height: 80rpx;
}

.progress-container {
  flex: 1;
  margin: 0 30rpx;
  display: flex;
  flex-direction: column;
  gap: 10rpx;
}

.mood-indicator {
  text-align: center;
}

.mood-text {
  font-size: 24rpx;
  color: #666;
  font-weight: 500;
  background: rgba(255, 255, 255, 0.8);
  padding: 8rpx 16rpx;
  display: inline-block;
}

.progress-bar {
  height: 10rpx;
  background: rgba(255, 193, 7, 0.3);
  border-radius: 5rpx;
  overflow: hidden;
}

.progress-fill {
  height: 0%;
  background: linear-gradient(90deg, #FFC107, #FF9800);
  border-radius: 5rpx;
  transition: width 0.4s ease;
}

.progress-text {
  font-size: 28rpx;
  color: #666;
  font-weight: 500;
  min-width: 60rpx;
}


/* 主要内容区域 */
.main-content {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-around;
  padding: 40rpx;
}

/* 提示文字区域 */
.message-container {
  display: flex;
  justify-content: center;
  width: 100%;
}

.message-bubble {
  background: rgba(255, 255, 255, 0.95);
  padding: 40rpx 50rpx;
  border-radius: 50rpx;
  box-shadow: 0 15rpx 35rpx rgba(0, 0, 0, 0.15);
  text-align: center;
  border: 3rpx solid rgba(255, 255, 255, 0.8);
  backdrop-filter: blur(10rpx);
  position: absolute;
  /* 添加对话框尾巴 */
  &::after {
    content: '';
    position: absolute;
    bottom: -20rpx;
    left: 50%;
    transform: translateX(-50%);
    width: 0;
    height: 0;
    border-left: 20rpx solid transparent;
    border-right: 20rpx solid transparent;
    border-top: 20rpx solid rgba(255, 255, 255, 0.95);
  }
}

.message-text {
  display: block;
  font-size: 40rpx;
  font-weight: 700;
  color: #333;
  margin-bottom: 15rpx;
  text-shadow: 0 2rpx 4rpx rgba(0, 0, 0, 0.1);
}

.sub-message {
  display: block;
  font-size: 28rpx;
  color: #666;
  font-weight: 500;
}

/* DouDou主体形象区域 */
.doudou-container {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  max-width: 600rpx;
  height: 1000rpx;
  cursor: pointer;
  transition: all 0.3s ease;
  position: relative;
  
  /* 添加点击提示效果 */
  &::before {
    content: '';
    position: absolute;
    width: 100%;
    height: 100%;
    border-radius: 50%;
    background: radial-gradient(circle, rgba(255, 193, 7, 0.3) 0%, rgba(255, 193, 7, 0) 70%);
    animation: pulse 2s infinite;
    z-index: 1;
  }
  
  &:active {
    transform: scale(0.95);
  }
}

.doudou-character {
  width: 100%;
  height: 100%;
  z-index: 2;
  position: relative;
  filter: drop-shadow(0 10rpx 30rpx rgba(0, 0, 0, 0.2));
}

/* 脉搏动画 */
@keyframes pulse {
  0% {
    opacity: 0.6;
    transform: scale(1);
  }
  50% {
    opacity: 0.8;
    transform: scale(1.05);
  }
  100% {
    opacity: 0.6;
    transform: scale(1);
  }
}

/* 响应式适配 */
@media screen and (max-width: 375px) {
  .header-section {
    padding: 50rpx 30rpx 30rpx;
  }
  
  .mood-indicator {
    width: 400rpx;
    gap: 15rpx;
  }
  
  .mood-title {
    font-size: 28rpx;
  }
  
  .progress-bar {
    height: 16rpx;
  }
  
  .main-content {
    padding: 30rpx;
  }
  
  .message-bubble {
    padding: 35rpx 40rpx;
  }
  
  .message-text {
    font-size: 36rpx;
    margin-bottom: 12rpx;
  }
  
  .sub-message {
    font-size: 26rpx;
  }
  
  .doudou-container {
    max-width: 500rpx;
    height: 500rpx;
  }
}

/* 更小屏幕适配 */
@media screen and (max-width: 320px) {
  .header-section {
    padding: 40rpx 20rpx 20rpx;
  }
  
  .mood-indicator {
    width: 350rpx;
  }
  
  .mood-title {
    font-size: 26rpx;
  }
  
  .main-content {
    padding: 20rpx;
  }
  
  .message-bubble {
    padding: 30rpx 35rpx;
  }
  
  .message-text {
    font-size: 32rpx;
  }
  
  .sub-message {
    font-size: 24rpx;
  }
  
  .doudou-container {
    max-width: 450rpx;
    height: 450rpx;
  }
}

/* 底部气泡样式 - 浅橙色主题 */
.bottom-bubble {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  z-index: 1000;
  transform: translateY(100%);
  transition: transform 0.5s cubic-bezier(0.25, 0.46, 0.45, 0.94);
  padding: 40rpx 30rpx;
}

.bottom-bubble.bubble-show {
  transform: translateY(0);
  animation: bubbleFloat 0.6s ease-out;
}

.bubble-content {
  background: linear-gradient(135deg, rgba(255, 140, 0, 0.679) 0%, rgba(255, 166, 0, 0.789) 100%);
  border-radius: 35rpx 35rpx 0 0;
  padding: 50rpx 40rpx;
  box-shadow: 
    0 -20rpx 40rpx rgba(255, 140, 0, 0.3),
    0 -10rpx 20rpx rgba(255, 165, 0, 0.4),
    inset 0 2rpx 0 rgba(255, 255, 255, 0.4);
  backdrop-filter: blur(15rpx);
  position: relative;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.bubble-text {
  display: block;
  font-size: 34rpx;
  font-weight: 700;
  color: #8B4513;
  text-align: center;
  line-height: 1.6;
  text-shadow: 
    0 2rpx 4rpx rgba(255, 255, 255, 0.8),
    0 1rpx 2rpx rgba(255, 140, 0, 0.4);
  position: relative;
  z-index: 5;
  flex: 1;
  padding-right: 20rpx;
}

.arrow-button {
  width: 80rpx;
  height: 80rpx;
  background: rgba(255, 255, 255, 0.9);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 
    0 4rpx 12rpx rgba(0, 0, 0, 0.1),
    inset 0 2rpx 4rpx rgba(255, 255, 255, 0.6);
  cursor: pointer;
  transition: all 0.3s ease;
  position: relative;
  z-index: 10;
  
  &:hover {
    background: rgba(255, 255, 255, 1);
    transform: translateY(-2rpx);
    box-shadow: 0 6rpx 16rpx rgba(0, 0, 0, 0.15);
  }
  
  &:active {
    transform: translateY(0) scale(0.95);
    box-shadow: 0 2rpx 8rpx rgba(0, 0, 0, 0.2);
  }
}

.arrow-icon {
  font-size: 36rpx;
  font-weight: 700;
  color: #FF9800;
  text-shadow: 0 1rpx 2rpx rgba(255, 255, 255, 0.8);
}

/* 气泡浮现动画 */
@keyframes bubbleFloat {
  0% {
    transform: translateY(100%) scale(0.95);
    opacity: 0.8;
  }
  50% {
    transform: translateY(-10rpx) scale(1.02);
    opacity: 1;
  }
  100% {
    transform: translateY(0) scale(1);
    opacity: 1;
  }
}

/* 气泡响应式适配 */
@media screen and (max-width: 375px) {
  .bottom-bubble {
    padding: 30rpx 20rpx;
  }
  
  .bubble-content {
    padding: 45rpx 30rpx;
    border-radius: 30rpx 30rpx 0 0;
    
    &::before {
      width: 70rpx;
      height: 7rpx;
      top: 18rpx;
    }
    
    &::after {
      height: 70rpx;
      border-radius: 30rpx 30rpx 0 0;
    }
  }
  
  .bubble-text {
    font-size: 32rpx;
    padding-right: 15rpx;
  }
  
  .arrow-button {
    width: 70rpx;
    height: 70rpx;
  }
  
  .arrow-icon {
    font-size: 32rpx;
  }
}

@media screen and (max-width: 320px) {
  .bubble-content {
    padding: 40rpx 25rpx;
    
    &::before {
      width: 65rpx;
      height: 6rpx;
      top: 16rpx;
    }
    
    &::after {
      height: 65rpx;
    }
  }
  
  .bubble-text {
    font-size: 30rpx;
    padding-right: 12rpx;
  }
  
  .arrow-button {
    width: 65rpx;
    height: 65rpx;
  }
  
  .arrow-icon {
    font-size: 30rpx;
  }
}
</style>
