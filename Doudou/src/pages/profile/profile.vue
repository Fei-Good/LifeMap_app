<template>
  <view class="profile-container">
<<<<<<< HEAD
=======
    <!-- 背景装饰 -->
    <view class="background-decoration">
      <view class="circle circle-1"></view>
      <view class="circle circle-2"></view>
      <view class="circle circle-3"></view>
    </view>
    
    <!-- 顶部导航 -->
>>>>>>> ef06d39 (feat: 完善注册功能，优化样式，添加手机号码字段，修复登录跳转问题)
    <view class="top-nav">
      <view class="nav-back" @click="goBack">
        <text class="back-icon">←</text>
        <text class="back-text">返回</text>
      </view>
      <view class="nav-title">
        <text class="title-text">个人资料</text>
      </view>
<<<<<<< HEAD
    </view>
    
    <view class="user-info">
      <view class="avatar-section">
=======
      <view class="nav-edit" @click="toggleEditMode">
        <text class="edit-text">{{ isEditMode ? '保存' : '编辑' }}</text>
      </view>
    </view>
    
    <!-- 用户头像区域 -->
    <view class="avatar-section">
      <view class="avatar-container">
>>>>>>> ef06d39 (feat: 完善注册功能，优化样式，添加手机号码字段，修复登录跳转问题)
        <image 
          class="user-avatar" 
          src="@/static/login/DouDou形象_登录页.png" 
          mode="aspectFit"
        />
<<<<<<< HEAD
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
=======
        <view class="avatar-edit" v-if="isEditMode" @click="changeAvatar">
          <text class="edit-icon">📷</text>
        </view>
      </view>
      <text class="username">{{ currentUser?.username || '用户名' }}</text>
      <text class="user-phone">{{ currentUser?.phone || '手机号码' }}</text>
    </view>
    
    <!-- 用户信息表单 -->
    <view class="info-section">
      <view class="info-group">
        <view class="info-label">
          <text class="label-text">用户名</text>
        </view>
        <input 
          v-if="isEditMode"
          class="info-input"
          v-model="editForm.username"
          placeholder="请输入用户名"
          maxlength="20"
        />
        <text v-else class="info-value">{{ currentUser?.username || '未设置' }}</text>
      </view>
      
      <view class="info-group">
        <view class="info-label">
          <text class="label-text">手机号码</text>
          <text class="optional">（选填）</text>
        </view>
        <input 
          v-if="isEditMode"
          class="info-input"
          v-model="editForm.phone"
          type="number"
          placeholder="请输入手机号码（选填）"
          maxlength="11"
        />
        <text v-else class="info-value">{{ currentUser?.phone || '未设置' }}</text>
      </view>
      
      <view class="info-group">
        <view class="info-label">
          <text class="label-text">注册时间</text>
        </view>
        <text class="info-value">{{ formatDate(currentUser?.createdAt) }}</text>
      </view>
      
      <view class="info-group">
        <view class="info-label">
          <text class="label-text">最后登录</text>
        </view>
        <text class="info-value">{{ formatDate(currentUser?.lastLoginAt) || '从未登录' }}</text>
      </view>
    </view>
    
    <!-- 功能按钮区域 -->
    <view class="action-section">
      <button class="action-btn change-password-btn" @click="changePassword">
        <text class="btn-icon">🔒</text>
        <text class="btn-text">修改密码</text>
      </button>
      
      <button class="action-btn logout-btn" @click="handleLogout">
        <text class="btn-icon">🚪</text>
        <text class="btn-text">退出登录</text>
      </button>
    </view>
    
    <!-- 底部装饰 -->
    <view class="bottom-decoration">
      <view class="wave wave-1"></view>
      <view class="wave wave-2"></view>
      <view class="wave wave-3"></view>
>>>>>>> ef06d39 (feat: 完善注册功能，优化样式，添加手机号码字段，修复登录跳转问题)
    </view>
  </view>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import userService from '@/utils/userService'

<<<<<<< HEAD
const currentUser = ref(null)

=======
// 响应式数据
const isEditMode = ref(false)
const currentUser = ref(null)
const editForm = ref({
  username: '',
  phone: ''
})

// 生命周期
>>>>>>> ef06d39 (feat: 完善注册功能，优化样式，添加手机号码字段，修复登录跳转问题)
onMounted(() => {
  loadCurrentUser()
})

<<<<<<< HEAD
const loadCurrentUser = () => {
  currentUser.value = userService.getCurrentUser()
=======
// 方法
const loadCurrentUser = () => {
  currentUser.value = userService.getCurrentUser()
  if (currentUser.value) {
    // 初始化编辑表单
    editForm.value.username = currentUser.value.username
    editForm.value.phone = currentUser.value.phone
  }
}

const toggleEditMode = async () => {
  if (isEditMode.value) {
    // 保存模式
    await saveProfile()
  } else {
    // 编辑模式
    isEditMode.value = true
  }
}

const saveProfile = async () => {
  try {
    uni.showLoading({ title: '保存中...' })
    
    const updates = {
      username: editForm.value.username,
      phone: editForm.value.phone
    }
    
    await userService.updateUserProfile(currentUser.value.id, updates)
    
    // 重新加载用户信息
    loadCurrentUser()
    
    uni.hideLoading()
    uni.showToast({
      title: '保存成功',
      icon: 'success'
    })
    
    isEditMode.value = false
  } catch (error) {
    uni.hideLoading()
    uni.showToast({
      title: error.message || '保存失败',
      icon: 'none'
    })
  }
}

const changeAvatar = () => {
  uni.showToast({
    title: '头像功能开发中',
    icon: 'none'
  })
}

const changePassword = () => {
  uni.showModal({
    title: '修改密码',
    content: '密码修改功能开发中，请联系管理员',
    showCancel: false,
    confirmText: '知道了'
  })
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
        
        // 跳转到登录页面
        setTimeout(() => {
          uni.reLaunch({
            url: '/pages/login/login'
          })
        }, 1500)
      }
    }
  })
>>>>>>> ef06d39 (feat: 完善注册功能，优化样式，添加手机号码字段，修复登录跳转问题)
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

<<<<<<< HEAD
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
=======
const goBack = () => {
  if (isEditMode.value) {
    // 如果正在编辑，询问是否保存
    uni.showModal({
      title: '提示',
      content: '有未保存的更改，确定要离开吗？',
      success: (res) => {
        if (res.confirm) {
          isEditMode.value = false
          loadCurrentUser() // 恢复原始数据
          uni.navigateBack()
        }
      }
    })
  } else {
    uni.navigateBack()
  }
>>>>>>> ef06d39 (feat: 完善注册功能，优化样式，添加手机号码字段，修复登录跳转问题)
}
</script>

<style lang="scss" scoped>
.profile-container {
  width: 100vw;
  min-height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  position: relative;
<<<<<<< HEAD
=======
  overflow-x: hidden;
>>>>>>> ef06d39 (feat: 完善注册功能，优化样式，添加手机号码字段，修复登录跳转问题)
  padding: 0 40rpx;
  box-sizing: border-box;
}

<<<<<<< HEAD
.top-nav {
=======
/* 背景装饰 */
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
  0%, 100% {
    transform: translateY(0px) rotate(0deg);
  }
  50% {
    transform: translateY(-20px) rotate(180deg);
  }
}

/* 顶部导航 */
.top-nav {
  position: relative;
  z-index: 10;
>>>>>>> ef06d39 (feat: 完善注册功能，优化样式，添加手机号码字段，修复登录跳转问题)
  display: flex;
  align-items: center;
  padding: 120rpx 0 40rpx 0;
}

.nav-back {
  display: flex;
  align-items: center;
  gap: 10rpx;
  padding: 20rpx;
<<<<<<< HEAD
=======
  cursor: pointer;
>>>>>>> ef06d39 (feat: 完善注册功能，优化样式，添加手机号码字段，修复登录跳转问题)
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
.user-info {
=======
.nav-edit {
  padding: 20rpx;
  cursor: pointer;
}

.edit-text {
  font-size: 28rpx;
  color: #ffd700;
  font-weight: 500;
}

/* 用户头像区域 */
.avatar-section {
  position: relative;
  z-index: 2;
>>>>>>> ef06d39 (feat: 完善注册功能，优化样式，添加手机号码字段，修复登录跳转问题)
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-bottom: 60rpx;
}

<<<<<<< HEAD
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
=======
.avatar-container {
  position: relative;
  margin-bottom: 30rpx;
}

.user-avatar {
  width: 200rpx;
  height: 200rpx;
  border-radius: 50%;
  box-shadow: 0 10rpx 30rpx rgba(0, 0, 0, 0.2);
  border: 4rpx solid rgba(255, 255, 255, 0.3);
}

.avatar-edit {
  position: absolute;
  bottom: 10rpx;
  right: 10rpx;
  width: 60rpx;
  height: 60rpx;
  background: rgba(255, 255, 255, 0.9);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  box-shadow: 0 5rpx 15rpx rgba(0, 0, 0, 0.2);
}

.edit-icon {
  font-size: 28rpx;
}

.username {
  font-size: 36rpx;
  color: white;
  font-weight: bold;
  margin-bottom: 15rpx;
}

.user-phone {
  font-size: 28rpx;
  color: rgba(255, 255, 255, 0.8);
}

/* 用户信息区域 */
.info-section {
  width: 100%;
  max-width: 600rpx;
  z-index: 2;
  position: relative;
  margin-bottom: 60rpx;
}

.info-group {
>>>>>>> ef06d39 (feat: 完善注册功能，优化样式，添加手机号码字段，修复登录跳转问题)
  background: rgba(255, 255, 255, 0.1);
  border-radius: 20rpx;
  padding: 30rpx;
  margin-bottom: 30rpx;
  backdrop-filter: blur(10px);
  border: 1rpx solid rgba(255, 255, 255, 0.2);
<<<<<<< HEAD
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.label {
  font-size: 28rpx;
  color: rgba(255, 255, 255, 0.8);
}

.value {
=======
}

.info-label {
  margin-bottom: 20rpx;
}

.label-text {
  font-size: 26rpx;
  color: rgba(255, 255, 255, 0.7);
  font-weight: 500;
}

.optional {
  color: rgba(255, 255, 255, 0.5);
  margin-left: 8rpx;
  font-size: 22rpx;
  font-weight: normal;
}

.info-input {
  width: 100%;
  height: 80rpx;
  background: rgba(255, 255, 255, 0.9);
  border: 2rpx solid rgba(255, 255, 255, 0.3);
  border-radius: 15rpx;
  padding: 0 25rpx;
  font-size: 28rpx;
  color: #333;
  box-sizing: border-box;
  
  &:focus {
    border-color: #667eea;
    box-shadow: 0 3rpx 15rpx rgba(102, 126, 234, 0.2);
  }
}

.info-value {
>>>>>>> ef06d39 (feat: 完善注册功能，优化样式，添加手机号码字段，修复登录跳转问题)
  font-size: 30rpx;
  color: white;
  font-weight: 500;
}

<<<<<<< HEAD
.action-section {
  width: 100%;
  display: flex;
  justify-content: center;
=======
/* 功能按钮区域 */
.action-section {
  width: 100%;
  max-width: 600rpx;
  z-index: 2;
  position: relative;
  margin-bottom: 60rpx;
}

.action-btn {
  width: 100%;
  height: 100rpx;
  border: none;
  border-radius: 25rpx;
  font-size: 30rpx;
  font-weight: 600;
  transition: all 0.3s ease;
  margin-bottom: 30rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 20rpx;
  
  &:hover {
    transform: translateY(-2rpx);
  }
  
  &:active {
    transform: translateY(0);
  }
}

.change-password-btn {
  background: rgba(255, 255, 255, 0.9);
  color: #667eea;
  border: 2rpx solid #667eea;
>>>>>>> ef06d39 (feat: 完善注册功能，优化样式，添加手机号码字段，修复登录跳转问题)
}

.logout-btn {
  background: rgba(255, 71, 87, 0.9);
  color: white;
<<<<<<< HEAD
  border: none;
  border-radius: 25rpx;
  padding: 30rpx 60rpx;
  font-size: 30rpx;
  font-weight: 600;
  transition: all 0.3s ease;
}

.logout-btn:active {
  transform: translateY(-2rpx);
=======
  border: 2rpx solid #ff4757;
}

.btn-icon {
  font-size: 32rpx;
}

.btn-text {
  font-size: 30rpx;
}

/* 底部装饰 */
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
  .profile-container {
    padding: 0 30rpx;
  }
  
  .user-avatar {
    width: 160rpx;
    height: 160rpx;
  }
  
  .username {
    font-size: 32rpx;
  }
  
  .user-email {
    font-size: 26rpx;
  }
  
  .info-input {
    height: 70rpx;
    font-size: 26rpx;
  }
  
  .action-btn {
    height: 90rpx;
    font-size: 28rpx;
  }
>>>>>>> ef06d39 (feat: 完善注册功能，优化样式，添加手机号码字段，修复登录跳转问题)
}
</style>
