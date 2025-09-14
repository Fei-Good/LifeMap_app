<template>
  <div class="register-container">
    <!-- 背景图片 -->
    <div class="background-image"></div>
    
    <!-- 注册表单 -->
    <div class="register-form">
      <!-- 问候语对话框 -->
      <view class="greeting-bubble">
        <text class="greeting-text">{{ greetingText }}</text>
      </view>
      
      <!-- 用户名输入框 -->
      <div class="input-wrapper">
        <div class="input-container">
          <input 
            v-model="formData.username" 
            type="text" 
            placeholder="请输入用户名（4-20位字母/数字）" 
            class="input-field"
            @input="validateUsername"
            @blur="showUsernameError = false"
            @focus="showUsernameError = true"
          />
          <div class="input-icon" v-if="usernameValidation.isValid && formData.username">
            <text class="icon-check">✓</text>
          </div>
        </div>
        <div class="validation-message" v-if="showUsernameError && formData.username && !usernameValidation.isValid">
          <text class="error-text">{{ usernameValidation.message }}</text>
        </div>
        <div class="validation-message" v-if="showUsernameError && !formData.username">
          <text class="hint-text">用户名支持字母、数字、汉字和下划线</text>
        </div>
      </div>
      
      <!-- 邮箱输入框 -->
      <div class="input-wrapper">
        <div class="input-container">
          <input 
            v-model="formData.email" 
            type="email" 
            placeholder="请输入邮箱地址" 
            class="input-field"
            @input="validateEmail"
            @blur="showEmailError = false"
            @focus="showEmailError = true"
          />
          <div class="input-icon" v-if="emailValidation.isValid && formData.email">
            <text class="icon-check">✓</text>
          </div>
        </div>
        <div class="validation-message" v-if="showEmailError && formData.email && !emailValidation.isValid">
          <text class="error-text">{{ emailValidation.message }}</text>
        </div>
        <div class="validation-message" v-if="showEmailError && !formData.email">
          <text class="hint-text">请输入有效的邮箱地址，用于接收重要通知</text>
        </div>
      </div>
      
      <!-- 密码输入框 -->
      <div class="input-wrapper">
        <div class="input-container">
          <input 
            v-model="formData.password" 
            :type="showPassword ? 'text' : 'password'" 
            placeholder="请输入密码（8-20位，含大小写）" 
            class="input-field"
            @input="validatePassword"
            @blur="showPasswordError = false"
            @focus="showPasswordError = true"
          />
          <div class="input-icon password-toggle" @click="togglePasswordVisibility">
            <text class="icon-eye">{{ showPassword ? '👁️' : '👁️‍🗨️' }}</text>
          </div>
        </div>
        <div class="validation-message" v-if="showPasswordError && formData.password && !passwordValidation.isValid">
          <text class="error-text">{{ passwordValidation.message }}</text>
        </div>
        <div class="validation-message" v-if="showPasswordError && !formData.password">
          <text class="hint-text">密码需包含大小写字母、数字和特殊符号</text>
        </div>
        <div class="password-strength" v-if="formData.password && showPasswordError">
          <div class="strength-bar">
            <div class="strength-fill" :class="passwordStrength.level" :style="{ width: passwordStrength.width }"></div>
          </div>
          <text class="strength-text">{{ passwordStrength.text }}</text>
        </div>
      </div>
      
      <!-- 确认密码输入框 -->
      <div class="input-wrapper">
        <div class="input-container">
          <input 
            v-model="formData.confirmPassword" 
            :type="showConfirmPassword ? 'text' : 'password'" 
            placeholder="请再次输入密码" 
            class="input-field"
            @input="validateConfirmPassword"
            @blur="showConfirmPasswordError = false"
            @focus="showConfirmPasswordError = true"
          />
          <div class="input-icon password-toggle" @click="toggleConfirmPasswordVisibility">
            <text class="icon-eye">{{ showConfirmPassword ? '👁️' : '👁️‍🗨️' }}</text>
          </div>
        </div>
        <div class="validation-message" v-if="showConfirmPasswordError && formData.confirmPassword && !confirmPasswordValidation.isValid">
          <text class="error-text">{{ confirmPasswordValidation.message }}</text>
        </div>
        <div class="validation-message" v-if="showConfirmPasswordError && !formData.confirmPassword">
          <text class="hint-text">请再次输入密码以确认</text>
        </div>
      </div>
      
      <!-- 用户协议 -->
      <div class="agreement-wrapper">
        <view class="checkbox-wrapper" @click="toggleAgreement">
          <view class="checkbox" :class="{ checked: formData.agreeToTerms }">
            <text class="checkbox-icon" v-if="formData.agreeToTerms">✓</text>
          </view>
          <text class="agreement-text">我已阅读并同意</text>
          <text class="agreement-link" @click.stop="handleShowTerms">《用户协议》</text>
        </view>
        <div class="validation-message" v-if="!formData.agreeToTerms && showAgreementError">
          <text class="error-text">请阅读并同意用户协议</text>
        </div>
      </div>
      
      <!-- 按钮组 -->
      <div class="button-group">
        <button @click="handleBackToLogin" class="btn btn-back">返回登录</button>
        <button @click="handleRegister" class="btn btn-register" :disabled="!isFormValid">立即注册</button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, computed } from 'vue'
import userService from '@/utils/userService'

// 问候语文本
const greetingText = ref('欢迎加入DouDou大家庭！让我们一起开启职场成长之旅吧~ 🎉')

// 表单数据
const formData = reactive({
  username: '',
  email: '',
  password: '',
  confirmPassword: '',
  agreeToTerms: false
})

// 密码可见性控制
const showPassword = ref(false)
const showConfirmPassword = ref(false)

// 错误提示显示控制
const showUsernameError = ref(false)
const showEmailError = ref(false)
const showPasswordError = ref(false)
const showConfirmPasswordError = ref(false)
const showAgreementError = ref(false)

// 用户名验证
const usernameValidation = reactive({
  isValid: false,
  message: ''
})

// 邮箱验证
const emailValidation = reactive({
  isValid: false,
  message: ''
})

// 密码验证
const passwordValidation = reactive({
  isValid: false,
  message: ''
})

// 确认密码验证
const confirmPasswordValidation = reactive({
  isValid: false,
  message: ''
})

// 密码强度
const passwordStrength = reactive({
  level: 'weak',
  width: '0%',
  text: ''
})

// 表单验证
const isFormValid = computed(() => {
  return usernameValidation.isValid &&
         emailValidation.isValid &&
         passwordValidation.isValid &&
         confirmPasswordValidation.isValid &&
         formData.agreeToTerms
})

// 用户名验证函数
const validateUsername = () => {
  const username = formData.username.trim()
  if (!username) {
    usernameValidation.isValid = false
    usernameValidation.message = ''
    return
  }
  
  if (username.length < 4) {
    usernameValidation.isValid = false
    usernameValidation.message = '用户名长度至少4位'
    return
  }
  
  if (username.length > 20) {
    usernameValidation.isValid = false
    usernameValidation.message = '用户名长度不能超过20位'
    return
  }
  
  const usernameRegex = /^[\u4e00-\u9fa5_a-zA-Z0-9]+$/
  if (!usernameRegex.test(username)) {
    usernameValidation.isValid = false
    usernameValidation.message = '用户名只能包含字母、数字、汉字和下划线'
    return
  }
  
  usernameValidation.isValid = true
  usernameValidation.message = ''
}

// 邮箱验证函数
const validateEmail = () => {
  const email = formData.email.trim()
  if (!email) {
    emailValidation.isValid = false
    emailValidation.message = ''
    return
  }
  
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  if (!emailRegex.test(email)) {
    emailValidation.isValid = false
    emailValidation.message = '请输入有效的邮箱地址'
    return
  }
  
  emailValidation.isValid = true
  emailValidation.message = ''
}

// 密码验证函数
const validatePassword = () => {
  const password = formData.password
  if (!password) {
    passwordValidation.isValid = false
    passwordValidation.message = ''
    updatePasswordStrength(0)
    return
  }
  
  if (password.length < 8) {
    passwordValidation.isValid = false
    passwordValidation.message = '密码长度至少8位'
    updatePasswordStrength(password.length / 8 * 20)
    return
  }
  
  if (password.length > 20) {
    passwordValidation.isValid = false
    passwordValidation.message = '密码长度不能超过20位'
    updatePasswordStrength(100)
    return
  }
  
  // 检查密码复杂度
  const hasLower = /[a-z]/.test(password)
  const hasUpper = /[A-Z]/.test(password)
  const hasNumber = /[0-9]/.test(password)
  const hasSpecial = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)
  
  if (!hasLower || !hasUpper || !hasNumber || !hasSpecial) {
    passwordValidation.isValid = false
    passwordValidation.message = '密码必须包含大小写字母、数字和特殊符号'
    updatePasswordStrength(calculatePasswordStrength(password))
    return
  }
  
  passwordValidation.isValid = true
  passwordValidation.message = ''
  updatePasswordStrength(100)
  
  // 如果确认密码已填写，重新验证确认密码
  if (formData.confirmPassword) {
    validateConfirmPassword()
  }
}

// 确认密码验证函数
const validateConfirmPassword = () => {
  const confirmPassword = formData.confirmPassword
  if (!confirmPassword) {
    confirmPasswordValidation.isValid = false
    confirmPasswordValidation.message = ''
    return
  }
  
  if (confirmPassword !== formData.password) {
    confirmPasswordValidation.isValid = false
    confirmPasswordValidation.message = '两次密码输入不一致'
    return
  }
  
  confirmPasswordValidation.isValid = true
  confirmPasswordValidation.message = ''
}

// 计算密码强度
const calculatePasswordStrength = (password) => {
  let score = 0
  if (password.length >= 8) score += 20
  if (password.length >= 12) score += 20
  if (/[a-z]/.test(password)) score += 20
  if (/[A-Z]/.test(password)) score += 20
  if (/[0-9]/.test(password)) score += 10
  if (/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)) score += 10
  return Math.min(score, 100)
}

// 更新密码强度显示
const updatePasswordStrength = (strength) => {
  passwordStrength.width = `${strength}%`
  
  if (strength < 30) {
    passwordStrength.level = 'weak'
    passwordStrength.text = '弱'
  } else if (strength < 70) {
    passwordStrength.level = 'medium'
    passwordStrength.text = '中等'
  } else {
    passwordStrength.level = 'strong'
    passwordStrength.text = '强'
  }
}

// 切换密码可见性
const togglePasswordVisibility = () => {
  showPassword.value = !showPassword.value
}

// 切换确认密码可见性
const toggleConfirmPasswordVisibility = () => {
  showConfirmPassword.value = !showConfirmPassword.value
}

// 初始化验证状态
const initializeValidation = () => {
  // 如果表单已有数据，立即验证
  if (formData.username.trim()) {
    validateUsername()
  }
  if (formData.email.trim()) {
    validateEmail()
  }
  if (formData.password.trim()) {
    validatePassword()
  }
  if (formData.confirmPassword.trim()) {
    validateConfirmPassword()
  }
}

// 页面加载时初始化验证
initializeValidation()

// 注册处理
const handleRegister = async () => {
  if (!isFormValid.value) {
    // 使用新的验证系统显示具体错误信息
    if (!usernameValidation.isValid && formData.username.trim()) {
      uni.showToast({ title: usernameValidation.message, icon: 'none' })
    } else if (!emailValidation.isValid && formData.email.trim()) {
      uni.showToast({ title: emailValidation.message, icon: 'none' })
    } else if (!passwordValidation.isValid && formData.password.trim()) {
      uni.showToast({ title: passwordValidation.message, icon: 'none' })
    } else if (!confirmPasswordValidation.isValid && formData.confirmPassword.trim()) {
      uni.showToast({ title: confirmPasswordValidation.message, icon: 'none' })
    } else if (!formData.agreeToTerms) {
      showAgreementError.value = true
      uni.showToast({ title: '请阅读并同意用户协议', icon: 'none' })
    } else {
      // 显示通用提示
      if (!formData.username.trim()) {
        uni.showToast({ title: '请输入用户名', icon: 'none' })
      } else if (!formData.email.trim()) {
        uni.showToast({ title: '请输入邮箱', icon: 'none' })
      } else if (!formData.password.trim()) {
        uni.showToast({ title: '请输入密码', icon: 'none' })
      } else if (!formData.confirmPassword.trim()) {
        uni.showToast({ title: '请确认密码', icon: 'none' })
      }
    }
    return
  }
  
  uni.showLoading({
    title: '注册中...'
  })
  
  try {
    // 调用注册服务
    await userService.register({
      username: formData.username.trim(),
      email: formData.email.trim(),
      password: formData.password
    })
    
    uni.hideLoading()
    
    // 更新问候语
    greetingText.value = '注册成功！欢迎来到DouDou的世界~ 🎊'
    
    uni.showToast({
      title: '注册成功',
      icon: 'success'
    })
    
    // 延时跳转到登录页面
    setTimeout(() => {
      uni.showToast({
        title: '即将跳转到登录页面',
        icon: 'none'
      })
      
      setTimeout(() => {
        uni.reLaunch({
          url: '/pages/login/login'
        })
      }, 1000)
    }, 1500)
    
  } catch (error) {
    uni.hideLoading()
    
    uni.showToast({
      title: error.message || '注册失败',
      icon: 'none'
    })
    
    // 更新问候语显示错误信息
    greetingText.value = '注册遇到问题，请检查信息后重试~ 😅'
    
    // 3秒后恢复原始问候语
    setTimeout(() => {
      greetingText.value = '欢迎加入DouDou大家庭！让我们一起开启职场成长之旅吧~ 🎉'
    }, 3000)
  }
}

// 返回登录页面
const handleBackToLogin = () => {
  greetingText.value = '回去登录吧，我在这里等你哦~ 😊'
  
  setTimeout(() => {
    uni.navigateBack({
      delta: 1
    })
  }, 800)
}

// 切换协议同意状态
const toggleAgreement = () => {
  formData.agreeToTerms = !formData.agreeToTerms
  if (formData.agreeToTerms) {
    showAgreementError.value = false
  }
}

// 显示用户协议
const handleShowTerms = () => {
  greetingText.value = '仔细阅读协议条款，保障你的权益哦~ 📄'
  
  uni.showModal({
    title: '用户协议',
    content: '这里是用户协议的内容。包括用户权利、义务、隐私保护等相关条款。点击确定表示已阅读并同意本协议。',
    confirmText: '同意',
    cancelText: '取消',
    success: (res) => {
      if (res.confirm) {
        formData.agreeToTerms = true
        showAgreementError.value = false
        greetingText.value = '感谢你的信任！现在可以完成注册啦~ 🤝'
      }
      
      // 3秒后恢复原始问候语
      setTimeout(() => {
        greetingText.value = '欢迎加入DouDou大家庭！让我们一起开启职场成长之旅吧~ 🎉'
      }, 3000)
    }
  })
}
</script>

<style scoped>
.register-container {
  position: relative;
  width: 100vw;
  height: 100vh;
  overflow: hidden;
}

.background-image {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-image: url('@/static/login/登录背景.jpg');
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  z-index: 1;
}

.register-form {
  position: relative;
  z-index: 2;
  height: 100vh;
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  align-items: center;
  padding: 0 40px 80px 40px;
  box-sizing: border-box;
}

.greeting-bubble {
  position: relative;
  background-color: rgba(255, 255, 255, 0.95);
  padding: 15px 15px;
  border-radius: 20px;
  margin-bottom: 30px;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
  max-width: 300px;
  animation: fadeInUp 0.8s ease-out;
}

.greeting-bubble::after {
  content: '';
  position: absolute;
  bottom: -10px;
  left: 30px;
  width: 0;
  height: 0;
  border-left: 10px solid transparent;
  border-right: 10px solid transparent;
  border-top: 10px solid rgba(255, 255, 255, 0.95);
}

.greeting-text {
  font-size: 15px;
  color: #333;
  font-weight: bold;
  line-height: 1.6;
  display: block;
}

@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.input-wrapper {
  width: 100%;
  margin-bottom: 15px;
}

.input-container {
  position: relative;
  display: flex;
  align-items: center;
}

.input-icon {
  position: absolute;
  right: 15px;
  top: 50%;
  transform: translateY(-50%);
  width: 20px;
  height: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  z-index: 3;
}

.icon-check {
  color: #4CAF50;
  font-size: 16px;
  font-weight: bold;
}

.icon-eye {
  font-size: 16px;
  color: #666;
  transition: color 0.3s ease;
}

.password-toggle:hover .icon-eye {
  color: #FF9500;
}

.validation-message {
  margin-top: 5px;
  padding-left: 5px;
}

.error-text {
  color: #666;
  font-size: 12px;
  line-height: 1.4;
}

.hint-text {
  color: #999;
  font-size: 11px;
  line-height: 1.4;
}

.password-strength {
  margin-top: 8px;
  padding-left: 5px;
}

.strength-bar {
  width: 100%;
  height: 4px;
  background-color: #E0E0E0;
  border-radius: 2px;
  overflow: hidden;
  margin-bottom: 4px;
}

.strength-fill {
  height: 100%;
  transition: all 0.3s ease;
  border-radius: 2px;
}

.strength-fill.weak {
  background-color: #FF5722;
}

.strength-fill.medium {
  background-color: #FF9800;
}

.strength-fill.strong {
  background-color: #4CAF50;
}

.strength-text {
  font-size: 11px;
  color: #666;
}

.input-field {
  width: 100%;
  height: 45px;
  padding: 0 50px 0 20px;
  border: none;
  border-radius: 22px;
  background-color: rgba(255, 255, 255, 0.9);
  font-size: 15px;
  color: #333;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  box-sizing: border-box;
  transition: all 0.3s ease;
}

.input-field::placeholder {
  color: #999;
}

.input-field:focus {
  outline: none;
  background-color: rgba(255, 255, 255, 1);
  box-shadow: 0 2px 15px rgba(0, 0, 0, 0.15);
  transform: translateY(-1px);
}

.agreement-wrapper {
  width: 100%;
  margin-bottom: 20px;
}

.checkbox-wrapper {
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
}

.checkbox {
  width: 18px;
  height: 18px;
  border: 2px solid #FF9500;
  border-radius: 3px;
  margin-right: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: rgba(255, 255, 255, 0.9);
  transition: all 0.3s ease;
}

.checkbox.checked {
  background-color: #FF9500;
}

.checkbox-icon {
  color: white;
  font-size: 12px;
  font-weight: bold;
}

.agreement-text {
  font-size: 14px;
  color: #666;
  margin-right: 5px;
}

.agreement-link {
  font-size: 14px;
  color: #FF9500;
  cursor: pointer;
  transition: color 0.3s ease;
}

.agreement-link:hover {
  color: #E8850E;
  text-decoration: underline;
}

.button-group {
  width: 100%;
  display: flex;
  gap: 15px;
  margin-top: 10px;
}

.btn {
  flex: 1;
  height: 45px;
  border: none;
  border-radius: 22px;
  font-size: 15px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
}

.btn-back {
  background-color: rgba(255, 255, 255, 0.9);
  color: #666;
  border: 2px solid rgba(255, 165, 0, 0.3);
}

.btn-back:hover {
  background-color: rgba(255, 255, 255, 1);
  border-color: rgba(255, 165, 0, 0.5);
  transform: translateY(-2px);
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
}

.btn-register {
  background-color: #FF9500;
  color: white;
  border: 2px solid #FF9500;
}

.btn-register:hover:not(:disabled) {
  background-color: #E8850E;
  border-color: #E8850E;
  transform: translateY(-2px);
  box-shadow: 0 4px 15px rgba(255, 149, 0, 0.3);
}

.btn-register:disabled {
  background-color: #ccc;
  border-color: #ccc;
  cursor: not-allowed;
  opacity: 0.6;
}

.btn:active:not(:disabled) {
  transform: translateY(0);
}

/* 小程序端适配 */
/* #ifdef MP-WEIXIN */
.register-form {
  padding-bottom: 120px;
}
/* #endif */

/* 响应式适配 */
@media screen and (max-width: 375px) {
  .register-form {
    padding: 0 30px 60px 30px;
  }
  
  .input-field {
    height: 42px;
    font-size: 14px;
  }
  
  .btn {
    height: 42px;
    font-size: 14px;
  }
  
  .greeting-bubble {
    max-width: 280px;
    margin-bottom: 25px;
  }
  
  .greeting-text {
    font-size: 14px;
  }
}

/* 增强动画效果 */
.input-wrapper {
  animation: fadeInUp 0.6s ease-out;
  animation-fill-mode: both;
}

.input-wrapper:nth-child(3) { animation-delay: 0.1s; }
.input-wrapper:nth-child(4) { animation-delay: 0.2s; }
.input-wrapper:nth-child(5) { animation-delay: 0.3s; }
.input-wrapper:nth-child(6) { animation-delay: 0.4s; }

.agreement-wrapper {
  animation: fadeInUp 0.6s ease-out 0.5s;
  animation-fill-mode: both;
}

.button-group {
  animation: fadeInUp 0.6s ease-out 0.6s;
  animation-fill-mode: both;
}
</style>
