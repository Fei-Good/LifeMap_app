<template>
    <div class="login-container">
      <!-- 背景图片 -->
      <div class="background-image"></div>
      
      <!-- 登录表单 -->
      <div class="login-form">
        <!-- 问候语对话框 -->
        <view class="greeting-bubble">
          <text class="greeting-text">{{ greetingText }}</text>
        </view>
        
        <!-- 账号输入框 -->
        <div class="input-wrapper">
          <div class="input-container">
            <input 
              v-model="formData.account" 
              type="text" 
              placeholder="请输入账号（4-20位字母/数字）" 
              class="input-field"
              @input="validateAccount"
              @blur="showAccountError = false"
              @focus="showAccountError = true"
            />
            <div class="input-icon" v-if="accountValidation.isValid && formData.account">
              <text class="icon-check">✓</text>
            </div>
          </div>
          <div class="validation-message" v-if="showAccountError && formData.account && !accountValidation.isValid">
            <text class="error-text">{{ accountValidation.message }}</text>
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
          <div class="password-strength" v-if="formData.password && showPasswordError">
            <div class="strength-bar">
              <div class="strength-fill" :class="passwordStrength.level" :style="{ width: passwordStrength.width }"></div>
            </div>
            <text class="strength-text">{{ passwordStrength.text }}</text>
          </div>
        </div>
        
        <!-- 忘记密码链接 -->
        <div class="forgot-password">
          <text @click="handleForgotPassword" class="forgot-link">忘记密码？</text>
        </div>
        
        <!-- 按钮组 -->
        <div class="button-group">
          <button @click="handleRegister" class="btn btn-register">注册</button>
          <button @click="handleLogin" class="btn btn-login">登录</button>
        </div>
      </div>
    </div>
  </template>
  
  <script setup>
  import { ref, reactive, computed } from 'vue'
  import userService from '@/utils/userService'
  
  // 问候语文本
  const greetingText = ref('Hi! 我是你的职场好搭子DouDou 😊')
  
  // 表单数据
  const formData = reactive({
    account: '',
    password: ''
  })
  
  // 密码可见性控制
  const showPassword = ref(false)
  
  // 错误提示显示控制
  const showAccountError = ref(false)
  const showPasswordError = ref(false)
  
  // 账号验证
  const accountValidation = reactive({
    isValid: false,
    message: ''
  })
  
  // 密码验证
  const passwordValidation = reactive({
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
    return accountValidation.isValid && passwordValidation.isValid
  })

  // 账号验证函数
  const validateAccount = () => {
    const account = formData.account.trim()
    if (!account) {
      accountValidation.isValid = false
      accountValidation.message = ''
      return
    }
    
    if (account.length < 4) {
      accountValidation.isValid = false
      accountValidation.message = '账号长度至少4位'
      return
    }
    
    if (account.length > 20) {
      accountValidation.isValid = false
      accountValidation.message = '账号长度不能超过20位'
      return
    }
    
    const accountRegex = /^[a-zA-Z0-9]+$/
    if (!accountRegex.test(account)) {
      accountValidation.isValid = false
      accountValidation.message = '账号只能包含字母和数字'
      return
    }
    
    accountValidation.isValid = true
    accountValidation.message = ''
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

  // 格式化错误信息
  const formatErrorMessage = (error) => {
    // 如果有详细的字段错误信息
    if (error.errors && Array.isArray(error.errors) && error.errors.length > 0) {
      // 将所有字段错误合并为一个消息
      const fieldErrors = error.errors.map(fieldError => {
        return `${fieldError.field}: ${fieldError.message}`
      }).join('\n')
      
      return `${error.message || '输入验证失败'}\n${fieldErrors}`
    }
    
    // 如果没有详细错误，使用基本错误信息
    return error.message || '登录失败'
  }
  
  // 登录处理
  const handleLogin = async () => {
    if (!isFormValid.value) {
      uni.showToast({
        title: '请填写完整信息',
        icon: 'none'
      })
      return
    }
    
    uni.showLoading({
      title: '登录中...'
    })
    
    try {
      const result = await userService.login(formData.account.trim(), formData.password)
      
      uni.hideLoading()
      
      uni.showToast({
        title: '登录成功',
        icon: 'success'
      })
      
      // 跳转到引导页面，由引导页面判断用户类型
      setTimeout(() => {
        uni.reLaunch({
          url: '/pages/intro/intro'
        })
      }, 1000)
    } catch (error) {
      uni.hideLoading()
      
      // 格式化错误信息，包括详细的字段验证错误
      const errorMessage = formatErrorMessage(error)
      
      uni.showToast({
        title: errorMessage,
        icon: 'none',
        duration: 4000 // 增加显示时间，因为错误信息可能较长
      })
      
      // 如果有详细的字段错误，同时更新DouDou的问候语
      if (error.errors && error.errors.length > 0) {
        greetingText.value = '哎呀，信息填写有问题哦~ 请检查后重试 😅'
        
        // 5秒后恢复原始问候语
        setTimeout(() => {
          greetingText.value = 'Hi! 我是你的职场好搭子DouDou 😊'
        }, 5000)
      }
    }
  }
  
  // 注册处理
  const handleRegister = () => {
    greetingText.value = '欢迎加入我们！注册后一起成长吧~ 🎉'
    
    setTimeout(() => {
      uni.navigateTo({
        url: '/pages/register/register'
      })
    }, 1000)
  }
  
  // 忘记密码处理
  const handleForgotPassword = () => {
    // 改变DouDou的问候语
    greetingText.value = '别担心，联系管理员重置密码吧~ 🤗'
    
    // 3秒后恢复原始问候语
    setTimeout(() => {
      greetingText.value = 'Hi! 我是你的职场好搭子DouDou 😊'
    }, 3000)
    
    uni.showToast({
      title: '发送邮箱至：123456789@doudou.com',
      icon: 'none'
    })
  }
  </script>
  
  <style scoped>
  .login-container {
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
  
  .login-form {
    position: relative;
    z-index: 2;
    height: 100vh;
    display: flex;
    flex-direction: column;
    justify-content: flex-end;
    align-items: center;
    padding: 0 40px 120px 40px;
    box-sizing: border-box;
  }
  
  .greeting-bubble {
    position: relative;
    background-color: rgba(255, 255, 255, 0.95);
    padding: 15px 12px;
    border-radius: 20px;
    margin-bottom: 45px;
    box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
    max-width: 280px;
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
    font-size: 16px;
    color: #333;
    font-weight: bold;
    line-height: 1.8;
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
    margin-bottom: 20px;
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
  
  .forgot-password {
    width: 100%;
    text-align: right;
    margin-bottom: 20px;
  }
  
  .forgot-link {
    color: #FF9500;
    font-size: 14px;
    cursor: pointer;
    transition: color 0.3s ease;
  }
  
  .forgot-link:hover {
    color: #E8850E;
    text-decoration: underline;
  }
  
  .input-field {
    width: 100%;
    height: 50px;
    padding: 0 50px 0 20px;
    border: none;
    border-radius: 25px;
    background-color: rgba(255, 255, 255, 0.9);
    font-size: 16px;
    color: #333;
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
    box-sizing: border-box;
  }
  
  .input-field::placeholder {
    color: #999;
  }
  
  .input-field:focus {
    outline: none;
    background-color: rgba(255, 255, 255, 1);
    box-shadow: 0 2px 15px rgba(0, 0, 0, 0.15);
  }
  
  .button-group {
    width: 100%;
    display: flex;
    gap: 20px;
    margin-top: 10px;
  }
  
  .btn {
    flex: 1;
    height: 50px;
    border: none;
    border-radius: 25px;
    font-size: 16px;
    font-weight: 500;
    cursor: pointer;
    transition: all 0.3s ease;
  }
  
  .btn-register {
    background-color: rgba(255, 255, 255, 0.9);
    color: #666;
    border: 2px solid rgba(255, 165, 0, 0.3);
  }
  
  .btn-register:hover {
    background-color: rgba(255, 255, 255, 1);
    border-color: rgba(255, 165, 0, 0.5);
    transform: translateY(-2px);
    box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
  }
  
  .btn-login {
    background-color: #FF9500;
    color: white;
    border: 2px solid #FF9500;
  }
  
  .btn-login:hover {
    background-color: #E8850E;
    border-color: #E8850E;
    transform: translateY(-2px);
    box-shadow: 0 4px 15px rgba(255, 149, 0, 0.3);
  }
  
  .btn:active {
    transform: translateY(0);
  }
  
  /* 小程序端适配 */
  /* #ifdef MP-WEIXIN */
  .login-form {
    padding-bottom: 160px;
  }
  /* #endif */
  
  /* 响应式适配 */
  @media screen and (max-width: 375px) {
    .login-form {
      padding: 0 30px 100px 30px;
    }
    
    .input-field {
      height: 45px;
      font-size: 15px;
    }
    
    .btn {
      height: 45px;
      font-size: 15px;
    }
  }
  </style>
  