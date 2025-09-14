<template>
  <div class="map-container">
    <img 
      :src="mapImagePath"
      alt="地图"
      class="map-image"
      @load="onImageLoad"
    />
    
    <!-- 底部导航栏 -->
    <div class="bottom-navigation">
      <div class="nav-content">
        <!-- 上一页按钮 -->
        <button 
          class="nav-button prev-button" 
          @click="goToPrevPage"
          :disabled="currentPage <= 1"
        >
          <span class="nav-icon">‹</span>
          <span class="nav-text">上一页</span>
        </button>
        
        <!-- 任务按钮 - 只在最后一页显示 -->
        <button 
          v-if="currentPage === totalPages"
          class="nav-button task-button" 
          @click="goToTaskPage"
        >
          <span class="nav-icon">📋任务系统</span>
          <span class="nav-text">待办任务</span>
        </button>
        
        <!-- 下一页按钮 -->
        <button 
          class="nav-button next-button" 
          @click="goToNextPage"
          :disabled="false"
        >
          <span class="nav-text">{{ currentPage === totalPages ? '开始聊天' : '下一页' }}</span>
          <span class="nav-icon">{{ currentPage === totalPages ? '💬DouDou聊天' : '›' }}</span>
        </button>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, onMounted } from 'vue'

export default {
  name: 'Map',
  setup() {
    const mapImagePath = ref('/static/map/map1.png')
    const currentPage = ref(1)
    const totalPages = ref(4) // 假设总共有5页
    
    const onImageLoad = () => {
      console.log('Map image loaded successfully')
    }
    
    // 上一页功能
    const goToPrevPage = () => {
      if (currentPage.value > 1) {
        currentPage.value--
        // 更新图片路径
        mapImagePath.value = `@/static/map/map${currentPage.value}.png`
        console.log(`切换到第${currentPage.value}页`)
      }
    }
    
    // 下一页功能
    const goToNextPage = () => {
      if (currentPage.value < totalPages.value) {
        currentPage.value++
        // 更新图片路径
        mapImagePath.value = `@/static/map/map${currentPage.value}.png`
        console.log(`切换到第${currentPage.value}页`)
      } else if (currentPage.value === totalPages.value) {
        // 第四页时，跳转到聊天页面
        uni.navigateTo({
          url: '/pages/chat/chat'
        })
        console.log('从第四页跳转到聊天页面')
      }
    }
    
    // 跳转到指定页面
    const goToPage = (pageNumber) => {
      if (pageNumber >= 1 && pageNumber <= totalPages.value) {
        currentPage.value = pageNumber
        // 更新图片路径
        mapImagePath.value = `@/static/map/map${currentPage.value}.png`
        console.log(`跳转到第${currentPage.value}页`)
      }
    }
    
    // 跳转到任务页面
    const goToTaskPage = () => {
      uni.navigateTo({
        url: '/pages/task/task'
      })
      console.log('跳转到任务页面')
    }
    
    onMounted(() => {
      console.log('Map component mounted')
    })
    
    return {
      mapImagePath,
      currentPage,
      totalPages,
      onImageLoad,
      goToPrevPage,
      goToNextPage,
      goToPage,
      goToTaskPage
    }
  }
}
</script>

<style scoped>
.map-container {
  width: 100vw;
  height: 100vh;
  position: relative;
  overflow: hidden;
  display: flex;
  flex-direction: column;
}

.map-image {
  width: 100%;
  flex: 1;
  display: block;
  object-fit: contain;
}

/* 底部导航栏样式 */
.bottom-navigation {
  background: #ffffff;
  border-top: 1px solid #e0e0e0;
  padding: 2px 20px;
  box-shadow: 0 -1px 3px rgba(0, 0, 0, 0.1);
}

.nav-content {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 20px;
  max-width: 400px;
  margin: 0 auto;
}

.nav-button {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 6px 14px;
  background: linear-gradient(135deg, #ff9f25 0%, #ff8c00 100%);
  color: white;
  border: none;
  border-radius: 18px;
  font-size: 13px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 2px 6px rgba(255, 159, 37, 0.25);
  min-width: 90px;
}

.nav-button:hover:not(:disabled) {
  background: linear-gradient(135deg, #ffb347 0%, #ff9f25 100%);
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(255, 159, 37, 0.4);
}

.nav-button:active:not(:disabled) {
  transform: translateY(0);
}

.nav-button:disabled {
  background: #666;
  color: #999;
  cursor: not-allowed;
  box-shadow: none;
}

.nav-icon {
  font-size: 16px;
  font-weight: bold;
}

.nav-text {
  font-size: 13px;
}



/* 响应式设计 */
@media (max-width: 768px) {
  .bottom-navigation {
    padding: 3px 16px;
  }
  
  .nav-button {
    padding: 5px 12px;
    font-size: 12px;
    min-width: 75px;
  }
  
  .nav-text {
    font-size: 12px;
  }
  
  .nav-icon {
    font-size: 14px;
  }
  

}

@media (max-width: 480px) {
  .nav-content {
    gap: 6px;
  }
  
  .nav-button {
    padding: 4px 8px;
    min-width: 65px;
  }
  
  .nav-text {
    display: none;
  }
  

}
</style>
