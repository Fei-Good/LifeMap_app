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
        <input 
          v-model="formData.username" 
          type="text" 
          placeholder="请输入用户名" 
          class="input-field"
        />
      </div>
      
      <!-- 邮箱输入框 -->
      <div class="input-wrapper">
        <input 
          v-model="formData.email" 
          type="email" 
          placeholder="请输入邮箱" 
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
      
      <!-- 确认密码输入框 -->
      <div class="input-wrapper">
        <input 
          v-model="formData.confirmPassword" 
          type="password" 
          placeholder="请再次输入密码" 
          class="input-field"
        />
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

// 表单验证
const isFormValid = computed(() => {
  return formData.username.trim() && 
         isValidUsername(formData.username) &&
         formData.email.trim() && 
         formData.password.trim() && 
         formData.confirmPassword.trim() && 
         formData.password === formData.confirmPassword &&
         formData.agreeToTerms &&
         isValidEmail(formData.email) &&
         isValidPassword(formData.password)
})

// 用户名格式验证（只能包含字母、数字、汉字和下划线）
const isValidUsername = (username) => {
  const usernameRegex = /^[\u4e00-\u9fa5_a-zA-Z0-9]+$/
  return usernameRegex.test(username)
}

// 邮箱格式验证
const isValidEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

// 密码强度验证（至少6位）
const isValidPassword = (password) => {
  return password.length >= 6
}

// 注册处理
const handleRegister = async () => {
  if (!isFormValid.value) {
    if (!formData.username.trim()) {
      uni.showToast({ title: '请输入用户名', icon: 'none' })
    } else if (!isValidUsername(formData.username)) {
      uni.showToast({ title: '用户名只能包含字母、数字、汉字和下划线', icon: 'none' })
    } else if (!formData.email.trim()) {
      uni.showToast({ title: '请输入邮箱', icon: 'none' })
    } else if (!isValidEmail(formData.email)) {
      uni.showToast({ title: '请输入有效的邮箱地址', icon: 'none' })
    } else if (!formData.password.trim()) {
      uni.showToast({ title: '请输入密码', icon: 'none' })
    } else if (!isValidPassword(formData.password)) {
      uni.showToast({ title: '密码长度至少6位', icon: 'none' })
    } else if (formData.password !== formData.confirmPassword) {
      uni.showToast({ title: '两次密码输入不一致', icon: 'none' })
    } else if (!formData.agreeToTerms) {
      uni.showToast({ title: '请阅读并同意用户协议', icon: 'none' })
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

.input-field {
  width: 100%;
  height: 45px;
  padding: 0 20px;
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
