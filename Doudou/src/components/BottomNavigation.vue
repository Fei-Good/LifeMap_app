<template>
  <div class="bottom-navigation">
    <div class="nav-content">
      <!-- 地图按钮 -->
      <button 
        class="nav-button map-button" 
        :class="{ active: currentPage === 'map' }"
        @click="goToMap"
      >
        <span class="nav-icon">🗺️</span>
        <span class="nav-text">地图</span>
      </button>
      
      <!-- DouDou按钮 -->
      <button 
        class="nav-button doudou-button" 
        :class="{ active: currentPage === 'chat' }"
        @click="goToDouDou"
      >
        <span class="nav-icon">🤖</span>
        <span class="nav-text">DouDou</span>
      </button>
      
      <!-- 知识库按钮 -->
      <button 
        class="nav-button knowledge-button" 
        :class="{ active: currentPage === 'knowledge' }"
        @click="goToKnowledge"
      >
        <span class="nav-icon">📚</span>
        <span class="nav-text">知识库</span>
      </button>
      
      <!-- 报告按钮 -->
      <button 
        class="nav-button report-button" 
        :class="{ active: currentPage === 'report' }"
        @click="goToReport"
      >
        <span class="nav-icon">📊</span>
        <span class="nav-text">报告</span>
      </button>
    </div>
  </div>
</template>

<script>
export default {
  name: 'BottomNavigation',
  props: {
    currentPage: {
      type: String,
      default: 'map'
    }
  },
  setup(props) {
    // 底部导航按钮点击事件
    const goToMap = () => {
      if (props.currentPage !== 'map') {
        console.log('跳转到地图页面')
        uni.reLaunch({
          url: '/pages/map/map'
        })
      }
    }

    const goToDouDou = () => {
      if (props.currentPage !== 'chat') {
        console.log('跳转到DouDou聊天页面')
        uni.reLaunch({
          url: '/pages/chat/chat'
        })
      }
    }

    const goToKnowledge = () => {
      if (props.currentPage !== 'knowledge') {
        console.log('跳转到知识库页面')
        uni.reLaunch({
          url: '/pages/knowledge/knowledge'
        })
      }
    }

    const goToReport = () => {
      if (props.currentPage !== 'report') {
        console.log('跳转到报告页面')
        uni.reLaunch({
          url: '/pages/report/report'
        })
      }
    }
    
    return {
      goToMap,
      goToDouDou,
      goToKnowledge,
      goToReport
    }
  }
}
</script>

<style scoped>
/* 底部导航栏样式 */
.bottom-navigation {
  background: #ffffff;
  border-top: 1px solid #e0e0e0;
  padding: 6px 20px;
  height: 68px;
  box-shadow: 0 -2px 10px rgba(0, 0, 0, 0.1);
  backdrop-filter: blur(10px);
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  z-index: 1000;
  box-sizing: border-box;
}

.nav-content {
  display: flex;
  justify-content: space-around;
  align-items: center;
  max-width: 400px;
  margin: 0 auto;
}

.nav-button {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 2px;
  padding: 6px 16px;
  background: transparent;
  color: #666;
  border: none;
  border-radius: 12px;
  font-size: 12px;
  cursor: pointer;
  transition: all 0.3s ease;
  min-width: 60px;
}

.nav-button:hover {
  background: rgba(102, 126, 234, 0.1);
  color: #667eea;
  transform: translateY(-2px);
}

.nav-button.active {
  color: #667eea;
  background: rgba(102, 126, 234, 0.15);
}

.nav-button.active .nav-icon {
  transform: scale(1.1);
}

.nav-icon {
  font-size: 20px;
  transition: transform 0.3s ease;
}

.nav-text {
  font-size: 11px;
  font-weight: 500;
  white-space: nowrap;
}

/* 特殊按钮样式 */
.doudou-button {
  position: relative;
}

.doudou-button .nav-icon {
  font-size: 24px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.doudou-button:hover .nav-icon {
  animation: bounce 0.6s ease-in-out;
}

@keyframes bounce {
  0%, 20%, 60%, 100% {
    transform: translateY(0) scale(1);
  }
  40% {
    transform: translateY(-8px) scale(1.1);
  }
  80% {
    transform: translateY(-4px) scale(1.05);
  }
}

/* 响应式设计 */
@media (max-width: 768px) {
  .bottom-navigation {
    padding: 4px 16px;
  }
  
  .nav-button {
    padding: 4px 12px;
    min-width: 50px;
  }
  
  .nav-icon {
    font-size: 18px;
  }
  
  .doudou-button .nav-icon {
    font-size: 22px;
  }
  
  .nav-text {
    font-size: 10px;
  }
}

@media (max-width: 480px) {
  .nav-content {
    gap: 8px;
  }
  
  .nav-button {
    padding: 4px 8px;
    min-width: 45px;
  }
  
  .nav-icon {
    font-size: 16px;
  }
  
  .doudou-button .nav-icon {
    font-size: 20px;
  }
  
  .nav-text {
    font-size: 9px;
  }
}
</style>
