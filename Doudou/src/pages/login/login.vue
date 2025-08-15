<template>
  <view class="login-container">
    <!-- 背景装饰 -->
    <view class="background-decoration">
      <view class="circle circle-1"></view>
      <view class="circle circle-2"></view>
      <view class="circle circle-3"></view>
    </view>
    
    <!-- DouDou角色区域 -->
    <view class="doudou-section">
      <view class="doudou-avatar" @click="onDouDouClick">
        <image 
          class="doudou-image" 
          src="@/static/login/DouDou形象_登录页.png" 
          mode="aspectFit"
        />
      </view>
      <view class="greeting-bubble">
        <text class="greeting-text">{{ greetingText }}</text>
      </view>
    </view>
    
    <!-- 登录表单区域 -->
    <view class="form-section">
      <view class="input-group">
        <input 
          class="input-field"
          type="text"
          placeholder="请输入账号"
          v-model="username"
          @focus="onInputFocus"
          @blur="onInputBlur"
        />
      </view>
      
      <view class="input-group">
        <input 
          class="input-field"
          type="password"
          placeholder="请输入密码"
          v-model="password"
          @focus="onInputFocus"
          @blur="onInputBlur"
        />
      </view>
      
      <view class="button-group">
        <button 
          class="action-btn login-btn"
          :class="{ 'action-btn-active': isFormValid }"
          @click="handleLogin"
        >
          登录
        </button>
        
        <button 
          class="action-btn register-btn"
          @click="handleRegister"
        >
          注册
        </button>
      </view>
      
      <view class="forgot-password" @click="handleForgotPassword">
        <text class="forgot-text">忘记密码？</text>
      </view>
    </view>
    
    <!-- 底部装饰 -->
    <view class="bottom-decoration">
      <view class="wave wave-1"></view>
      <view class="wave wave-2"></view>
      <view class="wave wave-3"></view>
    </view>
  </view>
</template>

<script setup>
import { ref, computed } from 'vue'
import userService from '@/utils/userService'

// 响应式数据
const username = ref('')
const password = ref('')
const greetingText = ref('Hi! 我是你的职场好搭子DouDou 😊')

// 计算属性
const isFormValid = computed(() => {
  return username.value.trim().length > 0 && password.value.trim().length > 0
})

// 方法
const onDouDouClick = () => {
  // DouDou点击动效
  uni.vibrateShort({
    type: 'light'
  })
  
  // 改变问候语
  greetingText.value = '哈哈！你好呀~ 😄'
  
  // 1.5秒后恢复原始问候语
  setTimeout(() => {
    greetingText.value = 'Hi! 我是你的职场好搭子DouDou 😊'
  }, 1500)
}

const onInputFocus = (event) => {
  // 输入框聚焦时的处理
  event.target.style.transform = 'scale(1.02)'
}

const onInputBlur = (event) => {
  // 输入框失焦时的处理
  event.target.style.transform = 'scale(1)'
}

const handleLogin = async () => {
  if (!isFormValid.value) {
    uni.showToast({
      title: '请填写完整信息',
      icon: 'none'
    })
    return
  }
  
<<<<<<< HEAD
=======
  // 显示加载状态
>>>>>>> ef06d39 (feat: 完善注册功能，优化样式，添加手机号码字段，修复登录跳转问题)
  uni.showLoading({
    title: '登录中...'
  })
  
  try {
<<<<<<< HEAD
=======
    // 调用登录服务
>>>>>>> ef06d39 (feat: 完善注册功能，优化样式，添加手机号码字段，修复登录跳转问题)
    const result = await userService.login(username.value.trim(), password.value)
    
    uni.hideLoading()
    
<<<<<<< HEAD
=======
    // 登录成功
>>>>>>> ef06d39 (feat: 完善注册功能，优化样式，添加手机号码字段，修复登录跳转问题)
    uni.showToast({
      title: '登录成功',
      icon: 'success'
    })
    
    setTimeout(() => {
      uni.reLaunch({
        url: '/pages/index/index'
      })
    }, 1000)
  } catch (error) {
    uni.hideLoading()
    
<<<<<<< HEAD
=======
    // 显示错误信息
>>>>>>> ef06d39 (feat: 完善注册功能，优化样式，添加手机号码字段，修复登录跳转问题)
    uni.showToast({
      title: error.message || '登录失败',
      icon: 'none'
    })
  }
}

const handleRegister = () => {
  greetingText.value = '欢迎加入我们！注册后一起成长吧~ 🎉'
  
<<<<<<< HEAD
=======
  // 跳转到注册页面
>>>>>>> ef06d39 (feat: 完善注册功能，优化样式，添加手机号码字段，修复登录跳转问题)
  setTimeout(() => {
    uni.navigateTo({
      url: '/pages/register/register'
    })
  }, 1000)
}

const handleForgotPassword = () => {
  // 改变DouDou的问候语
  greetingText.value = '别担心，联系管理员重置密码吧~ 🤗'
  
  // 3秒后恢复原始问候语
  setTimeout(() => {
    greetingText.value = 'Hi! 我是你的职场好搭子DouDou 😊'
  }, 3000)
  
  uni.showToast({
    title: '发送邮箱至：1234567890@doudou.com',
    icon: 'none'
  })
}
</script>

<style lang="scss" scoped>
.login-container {
  width: 100vw;
  height: 100vh;
  background: linear-gradient(135deg, #ff9a9e 0%, #fecfef 50%, #fecfef 100%);
  position: relative;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 0 40rpx;
  box-sizing: border-box;
}

/* 背景装饰 */
.background-decoration {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 0;
}

.circle {
  position: absolute;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.1);
  animation: float 6s ease-in-out infinite;
}

.circle-1 {
  width: 300rpx;
  height: 300rpx;
  top: 10%;
  left: -150rpx;
  animation-delay: 0s;
}

.circle-2 {
  width: 200rpx;
  height: 200rpx;
  top: 60%;
  right: -100rpx;
  animation-delay: 2s;
}

.circle-3 {
  width: 150rpx;
  height: 150rpx;
  top: 30%;
  right: 20%;
  animation-delay: 4s;
}

@keyframes float {
  0%, 100% {
    transform: translateY(0px) rotate(0deg);
  }
  50% {
    transform: translateY(-20px) rotate(180deg);
  }
}

@keyframes bounce {
  0%, 20%, 50%, 80%, 100% { 
    transform: translateY(0); 
  }
  40% { 
    transform: translateY(-10rpx); 
  }
  60% { 
    transform: translateY(-5rpx); 
  }
}

/* DouDou角色区域 */
.doudou-section {
  position: relative;
  z-index: 2;
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-bottom: 80rpx;
}

.doudou-avatar {
  width: 220rpx;
  height: 220rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.3s ease;
  margin-bottom: 30rpx;
  animation: bounce 2s infinite;
  
  &:hover {
    transform: scale(1.1) rotate(5deg);
  }
  
  &:active {
    transform: scale(0.95);
  }
}

.doudou-image {
  width: 100%;
  height: 100%;
  border-radius: 50%;
  box-shadow: 0 10rpx 30rpx rgba(0, 0, 0, 0.2);
}

.greeting-bubble {
  background: rgba(255, 255, 255, 0.95);
  padding: 20rpx 30rpx;
  border-radius: 25rpx;
  position: relative;
  box-shadow: 0 8rpx 25rpx rgba(0, 0, 0, 0.1);
  
  &::before {
    content: '';
    position: absolute;
    top: -15rpx;
    left: 50%;
    transform: translateX(-50%);
    width: 0;
    height: 0;
    border-left: 15rpx solid transparent;
    border-right: 15rpx solid transparent;
    border-bottom: 15rpx solid rgba(255, 255, 255, 0.95);
  }
}

.greeting-text {
  font-size: 28rpx;
  color: #333;
  font-weight: 500;
}

/* 登录表单区域 */
.form-section {
  width: 100%;
  max-width: 600rpx;
  z-index: 2;
  position: relative;
}

.input-group {
  margin-bottom: 40rpx;
}

.input-field {
  width: 100%;
  height: 100rpx;
  background: rgba(255, 255, 255, 0.9);
  border: 2rpx solid rgba(255, 255, 255, 0.3);
  border-radius: 25rpx;
  padding: 0 40rpx;
  font-size: 32rpx;
  color: #333;
  box-sizing: border-box;
  transition: all 0.3s ease;
  
  &:focus {
    background: rgba(255, 255, 255, 1);
    border-color: #667eea;
    transform: scale(1.02);
    box-shadow: 0 5rpx 20rpx rgba(102, 126, 234, 0.2);
  }
  
  &::placeholder {
    color: #999;
  }
}

/* 按钮组容器 */
.button-group {
  display: flex;
  gap: 20rpx;
  margin-bottom: 40rpx;
}

/* 通用按钮样式 */
.action-btn {
  flex: 1;
  height: 100rpx;
  border: none;
  border-radius: 25rpx;
  font-size: 32rpx;
  font-weight: 600;
  transition: all 0.3s ease;
  
  &:hover {
    transform: translateY(-2rpx);
  }
  
  &:active {
    transform: translateY(0);
  }
}

/* 登录按钮样式 */
.login-btn {
  background: linear-gradient(45deg, #667eea, #764ba2);
  color: #fff;
  opacity: 0.6;
  
  &.action-btn-active {
    opacity: 1;
    box-shadow: 0 10rpx 30rpx rgba(102, 126, 234, 0.3);
  }
}

/* 注册按钮样式 */
.register-btn {
  background: rgba(255, 255, 255, 0.9);
  color: #667eea;
  border: 2rpx solid #667eea;
  box-shadow: 0 5rpx 15rpx rgba(102, 126, 234, 0.1);
  
  &:hover {
    background: rgba(255, 255, 255, 1);
    box-shadow: 0 10rpx 25rpx rgba(102, 126, 234, 0.2);
  }
}

.forgot-password {
  text-align: center;
  padding: 20rpx;
}

.forgot-text {
  font-size: 28rpx;
  color: rgba(255, 255, 255, 0.8);
  text-decoration: underline;
}

/* 底部装饰 */
.bottom-decoration {
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
  height: 200rpx;
  z-index: 1;
}

.wave {
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
  height: 100rpx;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 100% 100% 0 0;
  animation: wave 4s ease-in-out infinite;
}

.wave-1 {
  animation-delay: 0s;
}

.wave-2 {
  animation-delay: 1s;
  opacity: 0.7;
}

.wave-3 {
  animation-delay: 2s;
  opacity: 0.5;
}

@keyframes wave {
  0%, 100% {
    transform: translateX(0px);
  }
  50% {
    transform: translateX(20px);
  }
}

/* 响应式适配 */
@media screen and (max-width: 375px) {
  .login-container {
    padding: 0 30rpx;
  }
  
  .doudou-avatar {
    width: 180rpx;
    height: 180rpx;
  }
  
  .greeting-text {
    font-size: 26rpx;
  }
  
  .input-field {
    height: 90rpx;
    font-size: 30rpx;
  }
  
  .action-btn {
    height: 90rpx;
    font-size: 30rpx;
  }
}
</style>
