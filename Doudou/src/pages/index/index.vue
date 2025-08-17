<template>
  <view class="web-layout">
    <!-- 左侧说明区域 -->
    <view class="left-panel">
      <view class="panel-content">
        <view class="panel-header">
          <text class="panel-title">🎯 设计理念</text>
        </view>
        <view class="panel-body">
          <view class="concept-item">
            <text class="concept-icon">💡</text>
            <view class="concept-text">
              <text class="concept-title">智能陪伴</text>
              <text class="concept-desc">DouDou不只是AI助手，更是你的职场伙伴，24小时在线陪伴</text>
            </view>
          </view>
          
          <view class="concept-item">
            <text class="concept-icon">🚀</text>
            <view class="concept-text">
              <text class="concept-title">成长加速</text>
              <text class="concept-desc">基于AI技术，为你的职业发展提供个性化建议和指导</text>
            </view>
          </view>
          
          <view class="concept-item">
            <text class="concept-icon">🎨</text>
            <view class="concept-text">
              <text class="concept-title">情感化设计</text>
              <text class="concept-desc">通过可爱的DouDou形象，让AI交互变得温暖而有趣</text>
            </view>
          </view>
          
          <view class="concept-item">
            <text class="concept-icon">🌟</text>
            <view class="concept-text">
              <text class="concept-title">移动优先</text>
              <text class="concept-desc">专为移动端优化，随时随地享受AI职场助手服务</text>
            </view>
          </view>
        </view>
      </view>
    </view>
    
    <view class="action-area">
      <button class="chat-btn" @tap="goToChat" v-if="isLoggedIn">
        <view class="btn-content">
          <text class="doudou-icon">😊</text>
          <view class="btn-text">
            <text class="btn-title">与DouDou聊天</text>
            <text class="btn-desc">你的职场搭子随时待命</text>
          </view>
        </view>
      </button>
      
      <button class="task-btn" @tap="goToTask" v-if="isLoggedIn">
        <view class="btn-content">
          <text class="task-icon">🎯</text>
          <view class="btn-text">
            <text class="btn-title">任务系统</text>
            <text class="btn-desc">游戏化完成工作任务</text>
          </view>
        </view>
      </button>
      
      <button class="login-btn" @tap="goToLogin" v-if="!isLoggedIn">
        <text>登录/注册</text>
      </button>
      
      <button class="profile-btn" @tap="goToProfile" v-if="isLoggedIn">
        <text>个人资料</text>
      </button>
      
      <button class="logout-btn" @tap="handleLogout" v-if="isLoggedIn">
        <text>退出登录</text>
      </button>
    </view>

    <!-- 中间核心功能区域 - iPhone 12 Pro尺寸 -->
    <view class="center-content">
      <view class="phone-frame">
        <view class="phone-screen">
          <view class="content">
            <image class="logo" src="/static/logo.png"></image>
            <view class="text-area">
              <text class="title">{{ title }}</text>
              <text class="subtitle">LifeMap职场成长助手</text>
            </view>
            
            <view class="action-area">
              <button class="chat-btn" @tap="goToChat">
                <view class="btn-content">
                  <text class="doudou-icon">😊</text>
                  <view class="btn-text">
                    <text class="btn-title">与DouDou聊天</text>
                    <text class="btn-desc">你的职场搭子随时待命</text>
                  </view>
                </view>
              </button>
              
              <button class="task-btn" @tap="goToTask">
                <view class="btn-content">
                  <text class="task-icon">🎯</text>
                  <view class="btn-text">
                    <text class="btn-title">任务系统</text>
                    <text class="btn-desc">游戏化完成工作任务</text>
                  </view>
                </view>
              </button>
              
              <button class="login-btn" @tap="goToLogin">
                <text>登录/注册</text>
              </button>
              
              <button class="profile-btn" @tap="goToProfile" v-if="isLoggedIn">
                <text>个人资料</text>
              </button>
            </view>
          </view>
        </view>
      </view>
    </view>

    <!-- 右侧功能说明区域 -->
    <view class="right-panel">
      <view class="panel-content">
        <view class="panel-header">
          <text class="panel-title">✨ 核心功能</text>
        </view>
        <view class="panel-body">
          <view class="feature-item">
            <text class="feature-icon">💬</text>
            <view class="feature-text">
              <text class="feature-title">智能对话</text>
              <text class="feature-desc">支持自然语言交互，理解你的职场困惑和需求</text>
            </view>
          </view>
          
          <view class="feature-item">
            <text class="feature-icon">📊</text>
            <view class="feature-text">
              <text class="feature-title">职业分析</text>
              <text class="feature-desc">基于你的背景，提供个性化的职业发展建议</text>
            </view>
          </view>
          
          <view class="feature-item">
            <text class="feature-icon">🎯</text>
            <view class="feature-text">
              <text class="feature-title">目标规划</text>
              <text class="feature-desc">帮助你制定清晰的职业目标和行动计划</text>
            </view>
          </view>
          
          <view class="feature-item">
            <text class="feature-icon">📚</text>
            <view class="feature-text">
              <text class="feature-title">技能提升</text>
              <text class="feature-desc">推荐适合的学习资源和技能培训路径</text>
            </view>
          </view>
          
          <view class="feature-item">
            <text class="feature-icon">🔒</text>
            <view class="feature-text">
              <text class="feature-title">隐私保护</text>
              <text class="feature-desc">你的对话内容安全加密存储，保护个人隐私</text>
            </view>
          </view>
        </view>
        
        <view class="tech-section">
          <text class="tech-title">🛠️ 技术特性</text>
          <view class="tech-item">
            <text class="tech-text">• Vue 3 + Composition API</text>
          </view>
          <view class="tech-item">
            <text class="tech-text">• uni-app 跨平台框架</text>
          </view>
          <view class="tech-item">
            <text class="tech-text">• 响应式设计 + 毛玻璃效果</text>
          </view>
        </view>
      </view>
    </view>
  </view>
</template>

<script>
import userService from '@/utils/userService'

export default {
  data() {
    return {
      title: 'LifeMap',
      isLoggedIn: false
    }
  },
  onLoad() {
    this.checkLoginStatus()
  },
  onShow() {
    this.checkLoginStatus()
  },
  methods: {
    checkLoginStatus() {
      this.isLoggedIn = userService.isLoggedIn()
    },
    
    goToChat() {
      if (!this.isLoggedIn) {
        uni.showToast({
          title: '请先登录',
          icon: 'none'
        })
        return
      }
      uni.navigateTo({
        url: '/pages/chat/chat'
      })
    },
    
    goToTask() {
      if (!this.isLoggedIn) {
        uni.showToast({
          title: '请先登录',
          icon: 'none'
        })
        return
      }
      uni.navigateTo({
        url: '/pages/task/task'
      })
    },
    
    goToLogin() {
      if (this.isLoggedIn) {
        uni.showToast({
          title: '您已登录',
          icon: 'none'
        })
        return
      }
      uni.navigateTo({
        url: '/pages/login/login'
      })
    },
    
    goToProfile() {
      uni.navigateTo({
        url: '/pages/profile/profile'
      })
    },
    
<<<<<<< HEAD
    handleLogout() {
      uni.showModal({
        title: '确认退出',
        content: '确定要退出登录吗？',
        success: (res) => {
          if (res.confirm) {
            userService.logout()
            this.checkLoginStatus()
            uni.showToast({
              title: '已退出登录',
              icon: 'success'
            })
          }
        }
      })
    },
    
=======
>>>>>>> ef06d39 (feat: 完善注册功能，优化样式，添加手机号码字段，修复登录跳转问题)
    goToMap() {
      uni.navigateTo({
        url: '/pages/map/map'
      })
    }
  },
}
</script>

<style>
/* Web端布局样式 */
.web-layout {
  display: flex;
  min-height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  align-items: center;
  justify-content: center;
  padding: 40px 20px;
}

/* 左侧面板 */
.left-panel {
  width: 320px;
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(20px);
  border-radius: 20px;
  border: 1px solid rgba(255, 255, 255, 0.2);
  display: flex;
  flex-direction: column;
  margin-right: 40px;
  height: fit-content;
}

.panel-content {
  padding: 40px 30px;
}

.panel-header {
  margin-bottom: 40px;
  text-align: center;
}

.panel-title {
  font-size: 24px;
  color: white;
  font-weight: 700;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
}

.panel-body {
  display: flex;
  flex-direction: column;
  gap: 25px;
}

.concept-item {
  display: flex;
  align-items: flex-start;
  gap: 16px;
  padding: 20px;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 16px;
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.2);
  transition: all 0.3s ease;
}

.concept-item:hover {
  background: rgba(255, 255, 255, 0.15);
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.2);
}

.concept-icon {
  font-size: 32px;
  flex-shrink: 0;
}

.concept-text {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.concept-title {
  font-size: 18px;
  color: white;
  font-weight: 600;
}

.concept-desc {
  font-size: 14px;
  color: rgba(255, 255, 255, 0.8);
  line-height: 1.5;
}

/* 中间核心内容 - iPhone 12 Pro尺寸 */
.center-content {
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.phone-frame {
  width: 390px;
  height: 844px;
  background: #000;
  border-radius: 40px;
  padding: 8px;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
  position: relative;
}

.phone-frame::before {
  content: '';
  position: absolute;
  top: 0;
  left: 50%;
  transform: translateX(-50%);
  width: 150px;
  height: 30px;
  background: #000;
  border-radius: 0 0 20px 20px;
  z-index: 2;
}

.phone-screen {
  width: 100%;
  height: 100%;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 32px;
  overflow: hidden;
  position: relative;
}

.content {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100%;
  padding: 40rpx;
  box-sizing: border-box;
}

.logo {
  height: 200rpx;
  width: 200rpx;
  margin-bottom: 50rpx;
  border-radius: 50%;
  border: 4rpx solid rgba(255, 255, 255, 0.3);
}

.text-area {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-bottom: 80rpx;
}

.title {
  font-size: 48rpx;
  color: white;
  font-weight: 700;
  margin-bottom: 16rpx;
}

.subtitle {
  font-size: 28rpx;
  color: rgba(255, 255, 255, 0.8);
  text-align: center;
}

.action-area {
  width: 100%;
  max-width: 600rpx;
  display: flex;
  flex-direction: column;
  gap: 32rpx;
}

.chat-btn {
  background: rgba(255, 255, 255, 0.95);
  border-radius: 40rpx;
  padding: 0;
  border: none;
  overflow: hidden;
  backdrop-filter: blur(10px);
  box-shadow: 0 16rpx 40rpx rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;
}

.chat-btn:active {
  transform: translateY(-4rpx);
  box-shadow: 0 20rpx 60px rgba(0, 0, 0, 0.15);
}

.task-btn {
  background: rgba(255, 255, 255, 0.95);
  border-radius: 40rpx;
  padding: 0;
  border: none;
  overflow: hidden;
  backdrop-filter: blur(10px);
  box-shadow: 0 16rpx 40rpx rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;
}

.task-btn:active {
  transform: translateY(-4rpx);
  box-shadow: 0 20rpx 60rpx rgba(0, 0, 0, 0.15);
}

.map-btn {
  background: rgba(255, 255, 255, 0.95);
  border-radius: 40rpx;
  padding: 0;
  border: none;
  overflow: hidden;
  backdrop-filter: blur(10px);
  box-shadow: 0 16rpx 40rpx rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;
}

.map-btn:active {
  transform: translateY(-4rpx);
  box-shadow: 0 20rpx 60rpx rgba(0, 0, 0, 0.15);
}

.btn-content {
  display: flex;
  align-items: center;
  padding: 32rpx 40rpx;
  gap: 24rpx;
}

.doudou-icon {
  width: 80rpx;
  height: 80rpx;
  background: linear-gradient(45deg, #ff6b6b, #ffa500);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 40rpx;
  flex-shrink: 0;
}

.task-icon {
  width: 80rpx;
  height: 80rpx;
  background: linear-gradient(45deg, #4facfe, #00f2fe);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 40rpx;
  flex-shrink: 0;
}

.map-icon {
  width: 80rpx;
  height: 80rpx;
  background: linear-gradient(45deg, #28a745, #20c997);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 40rpx;
  flex-shrink: 0;
}

.btn-text {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 8rpx;
}

.btn-title {
  font-size: 32rpx;
  color: #333;
  font-weight: 600;
}

.btn-desc {
  font-size: 24rpx;
  color: #666;
}

.login-btn {
  background: rgba(255, 255, 255, 0.2);
  color: white;
  border: 2rpx solid rgba(255, 255, 255, 0.3);
  border-radius: 50rpx;
  padding: 28rpx 0;
  font-size: 28rpx;
  font-weight: 600;
  transition: all 0.3s ease;
  backdrop-filter: blur(10px);
}

.login-btn:active {
  background: rgba(255, 255, 255, 0.3);
  transform: translateY(-2rpx);
}

.profile-btn {
  background: rgba(255, 255, 255, 0.2);
  color: white;
  border: 2rpx solid rgba(255, 255, 255, 0.3);
  border-radius: 50rpx;
  padding: 28rpx 0;
  font-size: 28rpx;
  font-weight: 600;
  transition: all 0.3s ease;
  backdrop-filter: blur(10px);
  margin-top: 20rpx;
}

.profile-btn:active {
  background: rgba(255, 255, 255, 0.3);
  transform: translateY(-2rpx);
}

/* 右侧面板 */
.right-panel {
  width: 320px;
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(20px);
  border-radius: 20px;
  border: 1px solid rgba(255, 255, 255, 0.2);
  display: flex;
  flex-direction: column;
  margin-left: 40px;
  height: fit-content;
}

.right-panel .panel-content {
  padding: 40px 30px;
}

.right-panel .panel-header {
  margin-bottom: 40px;
  text-align: center;
}

.right-panel .panel-title {
  font-size: 24px;
  color: white;
  font-weight: 700;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
}

.right-panel .panel-body {
  display: flex;
  flex-direction: column;
  gap: 20px;
  margin-bottom: 30px;
}

.feature-item {
  display: flex;
  align-items: flex-start;
  gap: 16px;
  padding: 18px;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 16px;
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.2);
  transition: all 0.3s ease;
}

.feature-item:hover {
  background: rgba(255, 255, 255, 0.15);
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.2);
}

.feature-icon {
  font-size: 28px;
  flex-shrink: 0;
}

.feature-text {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.feature-title {
  font-size: 16px;
  color: white;
  font-weight: 600;
}

.feature-desc {
  font-size: 13px;
  color: rgba(255, 255, 255, 0.8);
  line-height: 1.4;
}

.tech-section {
  background: rgba(40, 167, 69, 0.1);
  border-radius: 16px;
  padding: 25px;
  border: 1px solid rgba(40, 167, 69, 0.2);
}

.tech-title {
  font-size: 18px;
  color: white;
  font-weight: 600;
  margin-bottom: 20px;
  display: block;
}

.tech-item {
  margin-bottom: 12px;
}

.tech-text {
  font-size: 14px;
  color: rgba(255, 255, 255, 0.8);
  line-height: 1.4;
}

/* 响应式设计 */
@media screen and (max-width: 1400px) {
  .web-layout {
    padding: 30px 15px;
  }
  
  .left-panel,
  .right-panel {
    width: 280px;
  }
  
  .panel-content {
    padding: 30px 20px;
  }
  
  .phone-frame {
    width: 350px;
    height: 757px;
  }
}

@media screen and (max-width: 1200px) {
  .web-layout {
    flex-direction: column;
    gap: 30px;
    padding: 20px;
  }
  
  .left-panel,
  .right-panel {
    width: 100%;
    max-width: 600px;
    margin: 0;
  }
  
  .phone-frame {
    width: 390px;
    height: 844px;
    margin: 20px 0;
  }
  
  .panel-body {
    flex-direction: row;
    gap: 20px;
    overflow-x: auto;
    padding-bottom: 10px;
  }
  
  .concept-item,
  .feature-item {
    min-width: 250px;
    flex-shrink: 0;
  }
}

@media screen and (max-width: 600px) {
  .web-layout {
    padding: 15px 10px;
  }
  
  .phone-frame {
    width: 320px;
    height: 692px;
  }
  
  .panel-body {
    flex-direction: column;
    gap: 15px;
  }
  
  .concept-item,
  .feature-item {
    min-width: auto;
  }
  
  .panel-content {
    padding: 25px 20px;
  }
}
</style>
