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
          <input 
            v-model="formData.account" 
            type="text" 
            placeholder="请输入账号" 
            class="input-field"
          />
        </div>
        
        <!-- 密码输入框 -->
        <div class="input-wrapper">
          <input 
            v-model="formData.password" 
            type="password" 
            placeholder="请输入密码" 
            class="input-field"
          />
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
  
  // 表单验证
  const isFormValid = computed(() => {
    return formData.account.trim() && formData.password.trim()
  })

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
    background-image: url('/static/login/登录背景.jpg');
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
    padding: 0 20px;
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
  