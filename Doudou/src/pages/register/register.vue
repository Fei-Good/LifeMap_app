<template>
  <view class="register-container">
<<<<<<< HEAD
=======
    <!-- 背景装饰 -->
>>>>>>> ef06d39 (feat: 完善注册功能，优化样式，添加手机号码字段，修复登录跳转问题)
    <view class="background-decoration">
      <view class="circle circle-1"></view>
      <view class="circle circle-2"></view>
      <view class="circle circle-3"></view>
    </view>
    
<<<<<<< HEAD
=======
    <!-- 顶部导航 -->
>>>>>>> ef06d39 (feat: 完善注册功能，优化样式，添加手机号码字段，修复登录跳转问题)
    <view class="top-nav">
      <view class="nav-back" @click="goBack">
        <text class="back-icon">←</text>
        <text class="back-text">返回</text>
      </view>
      <view class="nav-title">
        <text class="title-text">创建账号</text>
      </view>
    </view>
    
<<<<<<< HEAD
=======
    <!-- DouDou角色区域 -->
>>>>>>> ef06d39 (feat: 完善注册功能，优化样式，添加手机号码字段，修复登录跳转问题)
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
    
<<<<<<< HEAD
=======
    <!-- 注册表单区域 -->
>>>>>>> ef06d39 (feat: 完善注册功能，优化样式，添加手机号码字段，修复登录跳转问题)
    <view class="form-section">
      <view class="input-group">
        <view class="input-label">
          <text class="label-text">用户名</text>
          <text class="required">*</text>
        </view>
        <input 
          class="input-field"
          :class="{ 'input-error': usernameError }"
          type="text"
          placeholder="请输入用户名（3-20个字符）"
          v-model="username"
          @focus="onInputFocus"
          @blur="onUsernameBlur"
          maxlength="20"
        />
        <view class="error-message" v-if="usernameError">
          <text class="error-text">{{ usernameError }}</text>
        </view>
      </view>
      
      <view class="input-group">
        <view class="input-label">
          <text class="label-text">手机号码</text>
          <text class="optional">（选填）</text>
        </view>
        <input 
          class="input-field"
          :class="{ 'input-error': phoneError }"
          type="number"
          placeholder="请输入手机号码（选填）"
          v-model="phone"
          @focus="onInputFocus"
          @blur="onPhoneBlur"
          maxlength="11"
        />
        <view class="error-message" v-if="phoneError">
          <text class="error-text">{{ phoneError }}</text>
        </view>
      </view>
      
      <view class="input-group">
        <view class="input-label">
          <text class="label-text">密码</text>
          <text class="required">*</text>
        </view>
        <view class="password-input-container">
          <input 
            class="input-field password-field"
            :class="{ 'input-error': passwordError }"
            :type="showPassword ? 'text' : 'password'"
            placeholder="请输入密码（8-20个字符）"
            v-model="password"
            @focus="onInputFocus"
            @blur="onPasswordBlur"
            maxlength="20"
          />
          <view class="password-toggle" @click="togglePassword">
            <text class="toggle-icon">{{ showPassword ? '👁️' : '🙈' }}</text>
          </view>
        </view>
        <view class="error-message" v-if="passwordError">
          <text class="error-text">{{ passwordError }}</text>
        </view>
      </view>
      
      <view class="input-group">
        <view class="input-label">
          <text class="label-text">确认密码</text>
          <text class="required">*</text>
        </view>
        <view class="password-input-container">
          <input 
            class="input-field password-field"
            :class="{ 'input-error': confirmPasswordError }"
            :type="showConfirmPassword ? 'text' : 'password'"
            placeholder="请再次输入密码"
            v-model="confirmPassword"
            @focus="onInputFocus"
            @blur="onConfirmPasswordBlur"
            maxlength="20"
          />
          <view class="password-toggle" @click="toggleConfirmPassword">
            <text class="toggle-icon">{{ showConfirmPassword ? '👁️' : '🙈' }}</text>
          </view>
        </view>
        <view class="error-message" v-if="confirmPasswordError">
          <text class="error-text">{{ confirmPasswordError }}</text>
        </view>
      </view>
      
      <view class="agreement-section">
        <view class="agreement-item" @click="toggleAgreement">
          <view class="checkbox" :class="{ 'checked': isAgreed }">
            <text class="check-icon" v-if="isAgreed">✓</text>
          </view>
          <text class="agreement-text">
            我已阅读并同意
            <text class="link-text" @click.stop="showTerms">《用户协议》</text>
            和
            <text class="link-text" @click.stop="showPrivacy">《隐私政策》</text>
          </text>
        </view>
        <view class="error-message" v-if="agreementError">
          <text class="error-text">{{ agreementError }}</text>
        </view>
      </view>
      
      <view class="button-group">
        <button 
          class="action-btn register-btn"
          :class="{ 'action-btn-active': isFormValid }"
          :disabled="!isFormValid"
          @click="handleRegister"
        >
          立即注册
        </button>
      </view>
      
      <view class="login-link">
        <text class="link-text">已有账号？</text>
        <text class="login-text" @click="goToLogin">立即登录</text>
      </view>
    </view>
    
<<<<<<< HEAD
=======
    <!-- 底部装饰 -->
>>>>>>> ef06d39 (feat: 完善注册功能，优化样式，添加手机号码字段，修复登录跳转问题)
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

<<<<<<< HEAD
=======
// 响应式数据
>>>>>>> ef06d39 (feat: 完善注册功能，优化样式，添加手机号码字段，修复登录跳转问题)
const username = ref('')
const phone = ref('')
const password = ref('')
const confirmPassword = ref('')
const isAgreed = ref(false)
const showPassword = ref(false)
const showConfirmPassword = ref(false)
const greetingText = ref('欢迎加入LifeMap！让我们一起成长吧~ 🎉')

<<<<<<< HEAD
=======
// 错误信息
>>>>>>> ef06d39 (feat: 完善注册功能，优化样式，添加手机号码字段，修复登录跳转问题)
const usernameError = ref('')
const phoneError = ref('')
const passwordError = ref('')
const confirmPasswordError = ref('')
const agreementError = ref('')

<<<<<<< HEAD
=======
// 计算属性 - 用于按钮状态
>>>>>>> ef06d39 (feat: 完善注册功能，优化样式，添加手机号码字段，修复登录跳转问题)
const isFormValid = computed(() => {
  return username.value.trim().length > 0 && 
         password.value.trim().length > 0 && 
         confirmPassword.value.trim().length > 0 && 
         isAgreed.value &&
         !usernameError.value &&
         !passwordError.value &&
         !confirmPasswordError.value
<<<<<<< HEAD
})

=======
  // 注意：手机号码不参与表单验证，因为是非必填项
})

// 方法
>>>>>>> ef06d39 (feat: 完善注册功能，优化样式，添加手机号码字段，修复登录跳转问题)
const onDouDouClick = () => {
  uni.vibrateShort({ type: 'light' })
  greetingText.value = '加油！注册成功就能使用所有功能啦~ 💪'
  setTimeout(() => {
    greetingText.value = '欢迎加入LifeMap！让我们一起成长吧~ 🎉'
  }, 2000)
}

const onInputFocus = (event) => {
  event.target.style.transform = 'scale(1.02)'
}

const onUsernameBlur = () => {
  const value = username.value.trim()
  if (!value) {
    usernameError.value = '请输入用户名'
  } else if (value.length < 3) {
    usernameError.value = '用户名至少3个字符'
  } else if (value.length > 20) {
    usernameError.value = '用户名不能超过20个字符'
  } else if (!/^[a-zA-Z0-9\u4e00-\u9fa5_]+$/.test(value)) {
    usernameError.value = '用户名只能包含字母、数字、中文和下划线'
  } else {
    usernameError.value = ''
  }
}

const onPhoneBlur = () => {
  const value = phone.value.trim()
  if (!value) {
<<<<<<< HEAD
=======
    // 手机号码为空时不显示错误（因为是非必填项）
>>>>>>> ef06d39 (feat: 完善注册功能，优化样式，添加手机号码字段，修复登录跳转问题)
    phoneError.value = ''
  } else if (!/^1[3-9]\d{9}$/.test(value)) {
    phoneError.value = '请输入有效的手机号码'
  } else {
    phoneError.value = ''
  }
}

const onPasswordBlur = () => {
  const value = password.value
  if (!value) {
    passwordError.value = '请输入密码'
  } else if (value.length < 8) {
    passwordError.value = '密码至少8个字符'
  } else if (value.length > 20) {
    passwordError.value = '密码不能超过20个字符'
  } else {
<<<<<<< HEAD
    let typeCount = 0
    if (/[a-z]/.test(value)) typeCount++
    if (/[A-Z]/.test(value)) typeCount++
    if (/\d/.test(value)) typeCount++
    if (/[!@#$%^&*(),.?":{}|<>]/.test(value)) typeCount++
=======
    // 检查密码复杂度：至少包含两种类型
    let typeCount = 0
    if (/[a-z]/.test(value)) typeCount++ // 小写字母
    if (/[A-Z]/.test(value)) typeCount++ // 大写字母
    if (/\d/.test(value)) typeCount++ // 数字
    if (/[!@#$%^&*(),.?":{}|<>]/.test(value)) typeCount++ // 特殊字符
>>>>>>> ef06d39 (feat: 完善注册功能，优化样式，添加手机号码字段，修复登录跳转问题)
    
    if (typeCount < 2) {
      passwordError.value = '密码至少包含两种类型（字母、数字、特殊字符）'
    } else {
      passwordError.value = ''
    }
  }
  
<<<<<<< HEAD
=======
  // 检查确认密码
>>>>>>> ef06d39 (feat: 完善注册功能，优化样式，添加手机号码字段，修复登录跳转问题)
  if (confirmPassword.value && value !== confirmPassword.value) {
    confirmPasswordError.value = '两次输入的密码不一致'
  } else if (confirmPassword.value) {
    confirmPasswordError.value = ''
  }
}

const onConfirmPasswordBlur = () => {
  const value = confirmPassword.value
  if (!value) {
    confirmPasswordError.value = '请再次输入密码'
  } else if (value !== password.value) {
    confirmPasswordError.value = '两次输入的密码不一致'
  } else {
    confirmPasswordError.value = ''
  }
}

const togglePassword = () => {
  showPassword.value = !showPassword.value
}

const toggleConfirmPassword = () => {
  showConfirmPassword.value = !showConfirmPassword.value
}

const toggleAgreement = () => {
  isAgreed.value = !isAgreed.value
  if (isAgreed.value) {
    agreementError.value = ''
  }
}

const showTerms = () => {
  uni.showModal({
    title: '用户协议',
    content: '这里是用户协议的详细内容...',
    showCancel: false,
    confirmText: '我知道了'
  })
}

const showPrivacy = () => {
  uni.showModal({
    title: '隐私政策',
    content: '这里是隐私政策的详细内容...',
    showCancel: false,
    confirmText: '我知道了'
  })
}

const handleRegister = async () => {
<<<<<<< HEAD
=======
  // 验证表单
>>>>>>> ef06d39 (feat: 完善注册功能，优化样式，添加手机号码字段，修复登录跳转问题)
  onUsernameBlur()
  onPhoneBlur()
  onPasswordBlur()
  onConfirmPasswordBlur()
  
  if (!isAgreed.value) {
    agreementError.value = '请先同意用户协议和隐私政策'
    return
  }
  
<<<<<<< HEAD
=======
  // 检查必填字段是否有错误
>>>>>>> ef06d39 (feat: 完善注册功能，优化样式，添加手机号码字段，修复登录跳转问题)
  const errorFields = []
  if (usernameError.value) errorFields.push('用户名')
  if (passwordError.value) errorFields.push('密码')
  if (confirmPasswordError.value) errorFields.push('确认密码')
  
  if (errorFields.length > 0) {
    uni.showToast({
      title: `请修正：${errorFields.join('、')}`,
      icon: 'none',
      duration: 3000
    })
    return
  }
  
<<<<<<< HEAD
=======
  // 检查必填字段是否为空
>>>>>>> ef06d39 (feat: 完善注册功能，优化样式，添加手机号码字段，修复登录跳转问题)
  const missingFields = []
  if (!username.value.trim()) missingFields.push('用户名')
  if (!password.value.trim()) missingFields.push('密码')
  if (!confirmPassword.value.trim()) missingFields.push('确认密码')
  
  if (missingFields.length > 0) {
    uni.showToast({
      title: `请填写：${missingFields.join('、')}`,
      icon: 'none',
      duration: 3000
    })
    return
  }
  
<<<<<<< HEAD
  uni.showLoading({ title: '注册中...' })
  
  try {
=======
  // 显示加载状态
  uni.showLoading({
    title: '注册中...'
  })
  
  try {
    // 准备注册数据
>>>>>>> ef06d39 (feat: 完善注册功能，优化样式，添加手机号码字段，修复登录跳转问题)
    const registerData = {
      username: username.value.trim(),
      phone: phone.value.trim(),
      password: password.value
    }
    
<<<<<<< HEAD
    await userService.register(registerData)
    
    uni.hideLoading()
    
=======
    // 调用注册服务
    const result = await userService.register(registerData)
    
    uni.hideLoading()
    
    // 注册成功
>>>>>>> ef06d39 (feat: 完善注册功能，优化样式，添加手机号码字段，修复登录跳转问题)
    uni.showModal({
      title: '注册成功',
      content: '恭喜您！账号创建成功，现在可以登录了~',
      showCancel: false,
      confirmText: '去登录',
      success: () => {
<<<<<<< HEAD
        uni.navigateTo({ url: '/pages/login/login' })
=======
        // 跳转到登录页面
        uni.navigateTo({
          url: '/pages/login/login'
        })
>>>>>>> ef06d39 (feat: 完善注册功能，优化样式，添加手机号码字段，修复登录跳转问题)
      }
    })
  } catch (error) {
    uni.hideLoading()
    
<<<<<<< HEAD
=======
    // 显示错误信息
>>>>>>> ef06d39 (feat: 完善注册功能，优化样式，添加手机号码字段，修复登录跳转问题)
    uni.showModal({
      title: '注册失败',
      content: error.message || '注册失败，请重试',
      showCancel: false,
      confirmText: '知道了'
    })
  }
}

const goBack = () => {
  uni.navigateBack()
}

const goToLogin = () => {
<<<<<<< HEAD
  uni.navigateTo({ url: '/pages/login/login' })
=======
  uni.navigateTo({
    url: '/pages/login/login'
  })
>>>>>>> ef06d39 (feat: 完善注册功能，优化样式，添加手机号码字段，修复登录跳转问题)
}
</script>

<style lang="scss" scoped>
.register-container {
  width: 100vw;
  min-height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  position: relative;
  overflow-x: hidden;
  padding: 0 40rpx;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding-top: 40rpx;
}

<<<<<<< HEAD
=======
/* 背景装饰 */
>>>>>>> ef06d39 (feat: 完善注册功能，优化样式，添加手机号码字段，修复登录跳转问题)
.background-decoration {
  position: fixed;
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
<<<<<<< HEAD
  0%, 100% { transform: translateY(0px) rotate(0deg); }
  50% { transform: translateY(-20px) rotate(180deg); }
}

=======
  0%, 100% {
    transform: translateY(0px) rotate(0deg);
  }
  50% {
    transform: translateY(-20px) rotate(180deg);
  }
}

/* 顶部导航 */
>>>>>>> ef06d39 (feat: 完善注册功能，优化样式，添加手机号码字段，修复登录跳转问题)
.top-nav {
  width: 100%;
  position: relative;
  z-index: 10;
  display: flex;
  align-items: center;
  padding: 20rpx 0 30rpx 0;
  justify-content: space-between;
  margin-bottom: 20rpx;
}

.nav-back {
  display: flex;
  align-items: center;
  gap: 10rpx;
  padding: 20rpx;
  cursor: pointer;
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

<<<<<<< HEAD
=======
/* DouDou角色区域 */
>>>>>>> ef06d39 (feat: 完善注册功能，优化样式，添加手机号码字段，修复登录跳转问题)
.doudou-section {
  width: 100%;
  position: relative;
  z-index: 2;
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-bottom: 40rpx;
}

.doudou-avatar {
  width: 160rpx;
  height: 160rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.3s ease;
  margin-bottom: 25rpx;
  animation: bounce 2s infinite;
<<<<<<< HEAD
=======
  
  &:hover {
    transform: scale(1.1) rotate(5deg);
  }
  
  &:active {
    transform: scale(0.95);
  }
>>>>>>> ef06d39 (feat: 完善注册功能，优化样式，添加手机号码字段，修复登录跳转问题)
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
<<<<<<< HEAD
}

.greeting-bubble::before {
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
=======
  
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
>>>>>>> ef06d39 (feat: 完善注册功能，优化样式，添加手机号码字段，修复登录跳转问题)
}

.greeting-text {
  font-size: 26rpx;
  color: #333;
  font-weight: 500;
}

@keyframes bounce {
<<<<<<< HEAD
  0%, 20%, 50%, 80%, 100% { transform: translateY(0); }
  40% { transform: translateY(-10rpx); }
  60% { transform: translateY(-5rpx); }
}

=======
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

/* 注册表单区域 */
>>>>>>> ef06d39 (feat: 完善注册功能，优化样式，添加手机号码字段，修复登录跳转问题)
.form-section {
  width: 100%;
  max-width: 500rpx;
  z-index: 2;
  position: relative;
  margin-bottom: 40rpx;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 25rpx;
}

.input-group {
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.input-label {
  width: 100%;
  display: flex;
  align-items: center;
  margin-bottom: 15rpx;
  justify-content: flex-start;
  padding-left: 10rpx;
}

.label-text {
  font-size: 28rpx;
  color: white;
  font-weight: 500;
}

.required {
  color: #ff4757;
  margin-left: 8rpx;
  font-weight: bold;
}

.optional {
  color: rgba(255, 255, 255, 0.6);
  margin-left: 8rpx;
  font-size: 24rpx;
  font-weight: normal;
}

.input-field {
  width: 100%;
  height: 88rpx;
  background: rgba(255, 255, 255, 0.95);
  border: 2rpx solid rgba(255, 255, 255, 0.2);
  border-radius: 22rpx;
  padding: 0 30rpx;
  font-size: 28rpx;
  color: #333;
  box-sizing: border-box;
  transition: all 0.3s ease;
  text-align: center;
  box-shadow: 0 4rpx 15rpx rgba(0, 0, 0, 0.1);
<<<<<<< HEAD
}

.input-field:focus {
  background: rgba(255, 255, 255, 1);
  border-color: #667eea;
  transform: scale(1.02);
  box-shadow: 0 8rpx 25rpx rgba(102, 126, 234, 0.3);
}

.input-field::placeholder {
  color: #999;
  text-align: center;
}

.input-field.input-error {
  border-color: #ff4757;
  background: rgba(255, 71, 87, 0.1);
  box-shadow: 0 4rpx 15rpx rgba(255, 71, 87, 0.2);
=======
  
  &:focus {
    background: rgba(255, 255, 255, 1);
    border-color: #667eea;
    transform: scale(1.02);
    box-shadow: 0 8rpx 25rpx rgba(102, 126, 234, 0.3);
  }
  
  &::placeholder {
    color: #999;
    text-align: center;
  }
  
  &.input-error {
    border-color: #ff4757;
    background: rgba(255, 71, 87, 0.1);
    box-shadow: 0 4rpx 15rpx rgba(255, 71, 87, 0.2);
  }
>>>>>>> ef06d39 (feat: 完善注册功能，优化样式，添加手机号码字段，修复登录跳转问题)
}

.password-input-container {
  position: relative;
  width: 100%;
}

.password-field {
  padding-right: 100rpx;
}

.password-toggle {
  position: absolute;
  right: 20rpx;
  top: 50%;
  transform: translateY(-50%);
  padding: 20rpx;
  cursor: pointer;
  z-index: 10;
}

.toggle-icon {
  font-size: 32rpx;
}

.error-message {
  width: 100%;
  margin-top: 12rpx;
  padding: 8rpx 20rpx;
  display: flex;
  justify-content: center;
  background: rgba(255, 71, 87, 0.1);
  border-radius: 15rpx;
  border: 1rpx solid rgba(255, 71, 87, 0.2);
}

.error-text {
  font-size: 24rpx;
  color: #ff4757;
}

<<<<<<< HEAD
=======
/* 协议区域 */
>>>>>>> ef06d39 (feat: 完善注册功能，优化样式，添加手机号码字段，修复登录跳转问题)
.agreement-section {
  width: 100%;
  margin-bottom: 25rpx;
  display: flex;
  flex-direction: column;
  align-items: center;
  background: rgba(255, 255, 255, 0.05);
  border-radius: 20rpx;
  padding: 25rpx;
  backdrop-filter: blur(10px);
  border: 1rpx solid rgba(255, 255, 255, 0.1);
}

.agreement-item {
  display: flex;
  align-items: flex-start;
  gap: 20rpx;
  cursor: pointer;
}

.checkbox {
  width: 40rpx;
  height: 40rpx;
  border: 2rpx solid rgba(255, 255, 255, 0.5);
  border-radius: 8rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(255, 255, 255, 0.1);
  transition: all 0.3s ease;
  flex-shrink: 0;
  margin-top: 4rpx;
<<<<<<< HEAD
}

.checkbox.checked {
  background: #667eea;
  border-color: #667eea;
=======
  
  &.checked {
    background: #667eea;
    border-color: #667eea;
  }
>>>>>>> ef06d39 (feat: 完善注册功能，优化样式，添加手机号码字段，修复登录跳转问题)
}

.check-icon {
  color: white;
  font-size: 24rpx;
  font-weight: bold;
}

.agreement-text {
  font-size: 26rpx;
  color: rgba(255, 255, 255, 0.9);
  line-height: 1.5;
  flex: 1;
}

.link-text {
  color: #ffd700;
  text-decoration: underline;
}

<<<<<<< HEAD
=======
/* 按钮组 */
>>>>>>> ef06d39 (feat: 完善注册功能，优化样式，添加手机号码字段，修复登录跳转问题)
.button-group {
  width: 100%;
  margin-bottom: 25rpx;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.action-btn {
  width: 100%;
  height: 88rpx;
  border: none;
  border-radius: 22rpx;
  font-size: 30rpx;
  font-weight: 600;
  transition: all 0.3s ease;
<<<<<<< HEAD
}

.action-btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.action-btn:not(:disabled):hover {
  transform: translateY(-2rpx);
}

.action-btn:not(:disabled):active {
  transform: translateY(0);
=======
  
  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
  
  &:not(:disabled):hover {
    transform: translateY(-2rpx);
  }
  
  &:not(:disabled):active {
    transform: translateY(0);
  }
>>>>>>> ef06d39 (feat: 完善注册功能，优化样式，添加手机号码字段，修复登录跳转问题)
}

.register-btn {
  background: linear-gradient(45deg, #667eea, #764ba2);
  color: #fff;
  opacity: 0.6;
  box-shadow: 0 4rpx 15rpx rgba(0, 0, 0, 0.1);
<<<<<<< HEAD
}

.register-btn.action-btn-active {
  opacity: 1;
  box-shadow: 0 10rpx 30rpx rgba(102, 126, 234, 0.3);
  transform: translateY(-2rpx);
}

=======
  
  &.action-btn-active {
    opacity: 1;
    box-shadow: 0 10rpx 30rpx rgba(102, 126, 234, 0.3);
    transform: translateY(-2rpx);
  }
}

/* 登录链接 */
>>>>>>> ef06d39 (feat: 完善注册功能，优化样式，添加手机号码字段，修复登录跳转问题)
.login-link {
  width: 100%;
  text-align: center;
  padding: 20rpx;
  display: flex;
  flex-direction: column;
  align-items: center;
  background: rgba(255, 255, 255, 0.05);
  border-radius: 20rpx;
  backdrop-filter: blur(10px);
  border: 1rpx solid rgba(255, 255, 255, 0.1);
}

.login-text {
  color: #ffd700;
  text-decoration: underline;
  margin-left: 10rpx;
}

<<<<<<< HEAD
=======
/* 底部装饰 */
>>>>>>> ef06d39 (feat: 完善注册功能，优化样式，添加手机号码字段，修复登录跳转问题)
.bottom-decoration {
  position: fixed;
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

<<<<<<< HEAD
.wave-1 { animation-delay: 0s; }
.wave-2 { animation-delay: 1s; opacity: 0.7; }
.wave-3 { animation-delay: 2s; opacity: 0.5; }

@keyframes wave {
  0%, 100% { transform: translateX(0px); }
  50% { transform: translateX(20px); }
}

=======
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
>>>>>>> ef06d39 (feat: 完善注册功能，优化样式，添加手机号码字段，修复登录跳转问题)
@media screen and (max-width: 375px) {
  .register-container {
    padding: 0 30rpx;
    padding-top: 30rpx;
  }
  
  .top-nav {
    padding: 15rpx 0 25rpx 0;
  }
  
  .doudou-avatar {
    width: 140rpx;
    height: 140rpx;
  }
  
  .greeting-text {
    font-size: 24rpx;
  }
  
  .form-section {
    max-width: 450rpx;
    gap: 20rpx;
  }
  
  .input-field {
    height: 80rpx;
    font-size: 26rpx;
  }
  
  .action-btn {
    height: 80rpx;
    font-size: 28rpx;
  }
  
  .agreement-section,
  .login-link {
    padding: 20rpx;
  }
}
</style>
