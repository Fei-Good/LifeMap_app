<template>
  <div class="life-map-container">
    <!-- 3D地图画布 -->
    <canvas 
      ref="mapCanvas" 
      class="map-canvas"
      @click="handleCanvasClick"
      @touchstart="handleTouchStart"
    ></canvas>
    
    <!-- 加载遮罩 -->
    <div v-if="isLoading" class="loading-overlay">
      <div class="loading-spinner"></div>
      <div class="loading-text">正在加载人生地图...</div>
    </div>
    
    <!-- 控制面板 -->
    <div class="control-panel">
      <div class="stage-info" v-if="currentStage">
        <h3>{{ currentStage.name }}</h3>
        <p>{{ currentStage.description }}</p>
      </div>
      
      <div class="control-buttons">
        <button @click="resetCamera" class="control-btn">
          🏠 重置视角
        </button>
        <button @click="autoTour" class="control-btn">
          🎬 自动游览
        </button>
        <button @click="toggleFullscreen" class="control-btn">
          📱 全屏
        </button>
      </div>
    </div>
    
    <!-- 人生阶段导航 -->
    <div class="stage-navigation">
      <div class="nav-title">人生历程</div>
      <div class="stage-list">
        <div 
          v-for="(stage, index) in lifeStages" 
          :key="index"
          :class="['stage-item', { active: currentStageIndex === index }]"
          @click="goToStage(index)"
        >
          <span class="stage-icon">{{ stage.icon }}</span>
          <span class="stage-name">{{ stage.name }}</span>
        </div>
      </div>
    </div>
    
    <!-- 任务提示 -->
    <div v-if="showTaskHint" class="task-hint">
      <div class="hint-content">
        <span class="hint-icon">✨</span>
        <span class="hint-text">点击人生阶段开始探索！</span>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, onMounted, onUnmounted, nextTick } from 'vue'
import { LifeMapRenderer } from './LifeMapRenderer.js'

export default {
  name: 'LifeMap3D',
  emits: ['stage-reached', 'task-triggered'],
  setup(props, { emit }) {
    const mapCanvas = ref(null)
    const mapRenderer = ref(null)
    const isLoading = ref(true)
    const currentStage = ref(null)
    const currentStageIndex = ref(0)
    const showTaskHint = ref(true)
    
    // 人生阶段数据
    const lifeStages = ref([
      { name: '出生', icon: '👶', description: '生命的开始，充满无限可能' },
      { name: '童年', icon: '🧒', description: '快乐的童年时光，学习与成长' },
      { name: '求学', icon: '🎓', description: '知识的积累，为未来打基础' },
      { name: '工作', icon: '💼', description: '踏入社会，开始职业生涯' },
      { name: '恋爱', icon: '💕', description: '遇见那个特别的人' },
      { name: '结婚', icon: '💒', description: '人生的重要里程碑' },
      { name: '育儿', icon: '👨‍👩‍👧‍👦', description: '传承生命，培育下一代' },
      { name: '事业', icon: '🏆', description: '事业的巅峰时期' },
      { name: '中年', icon: '🧑‍🦳', description: '人生的黄金时期' },
      { name: '退休', icon: '🏖️', description: '享受人生，回顾过往' },
      { name: '晚年', icon: '👴', description: '智慧的沉淀，人生的总结' }
    ])
    
    onMounted(async () => {
      await nextTick()
      await initMap()
    })
    
    onUnmounted(() => {
      if (mapRenderer.value) {
        mapRenderer.value.destroy()
      }
    })
    
    const initMap = async () => {
      try {
        isLoading.value = true
        
        if (!mapCanvas.value) {
          throw new Error('Canvas element not found')
        }
        
        // 创建地图渲染器
        mapRenderer.value = new LifeMapRenderer(mapCanvas.value)
        
        // 设置阶段到达回调
        mapRenderer.value.setStageReachedCallback(onStageReached)
        
        // 设置当前阶段
        currentStage.value = lifeStages.value[0]
        
        // 延迟隐藏加载界面
        setTimeout(() => {
          isLoading.value = false
          showHintAfterDelay()
        }, 1000)
        
      } catch (error) {
        console.error('地图初始化失败:', error)
        isLoading.value = false
      }
    }
    
    const handleCanvasClick = (event) => {
      if (mapRenderer.value) {
        mapRenderer.value.onMouseClick(event)
      }
    }
    
    const handleTouchStart = (event) => {
      // 移动端触摸处理
      if (event.touches.length === 1) {
        const touch = event.touches[0]
        const mouseEvent = new MouseEvent('click', {
          clientX: touch.clientX,
          clientY: touch.clientY
        })
        handleCanvasClick(mouseEvent)
      }
    }
    
    const onStageReached = (stageIndex) => {
      if (stageIndex < lifeStages.value.length) {
        currentStageIndex.value = stageIndex
        currentStage.value = lifeStages.value[stageIndex]
        showTaskHint.value = false
        
        // 触发事件给父组件
        emit('stage-reached', {
          index: stageIndex,
          stage: currentStage.value
        })
        
        // 可能触发任务
        if (Math.random() > 0.5) {
          setTimeout(() => {
            emit('task-triggered', {
              stageIndex,
              taskType: 'reflection',
              message: `在${currentStage.value.name}阶段，你有什么感悟？`
            })
          }, 1000)
        }
      }
    }
    
    const goToStage = (stageIndex) => {
      if (mapRenderer.value && stageIndex < lifeStages.value.length) {
        mapRenderer.value.movePlayerToStage(stageIndex)
      }
    }
    
    const resetCamera = () => {
      if (mapRenderer.value) {
        // 重置相机到初始位置
        mapRenderer.value.camera.position.set(0, 15, 20)
        mapRenderer.value.camera.lookAt(0, 0, 0)
        mapRenderer.value.controls.reset()
      }
    }
    
    const autoTour = () => {
      if (mapRenderer.value) {
        // 自动游览所有阶段
        let index = 0
        const tourInterval = setInterval(() => {
          if (index < lifeStages.value.length) {
            goToStage(index)
            index++
          } else {
            clearInterval(tourInterval)
          }
        }, 3000)
      }
    }
    
    const toggleFullscreen = () => {
      const container = document.querySelector('.life-map-container')
      if (!document.fullscreenElement) {
        container.requestFullscreen()
      } else {
        document.exitFullscreen()
      }
    }
    
    const showHintAfterDelay = () => {
      setTimeout(() => {
        showTaskHint.value = true
        setTimeout(() => {
          showTaskHint.value = false
        }, 5000)
      }, 2000)
    }
    
    return {
      mapCanvas,
      isLoading,
      currentStage,
      currentStageIndex,
      showTaskHint,
      lifeStages,
      handleCanvasClick,
      handleTouchStart,
      goToStage,
      resetCamera,
      autoTour,
      toggleFullscreen
    }
  }
}
</script>

<style scoped>
.life-map-container {
  width: 100vw;
  height: 100vh;
  position: relative;
  overflow: hidden;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}

.map-canvas {
  width: 100%;
  height: 100%;
  display: block;
  cursor: pointer;
}

/* 加载遮罩 */
.loading-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.8);
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.loading-spinner {
  width: 50px;
  height: 50px;
  border: 3px solid #f3f3f3;
  border-top: 3px solid #667eea;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin-bottom: 20px;
}

.loading-text {
  color: white;
  font-size: 18px;
  font-weight: 600;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

/* 控制面板 */
.control-panel {
  position: absolute;
  top: 20px;
  left: 20px;
  background: rgba(255, 255, 255, 0.95);
  border-radius: 15px;
  padding: 20px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
  backdrop-filter: blur(10px);
  max-width: 300px;
  z-index: 100;
}

.stage-info h3 {
  margin: 0 0 10px 0;
  color: #333;
  font-size: 20px;
}

.stage-info p {
  margin: 0 0 15px 0;
  color: #666;
  font-size: 14px;
  line-height: 1.4;
}

.control-buttons {
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
}

.control-btn {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border: none;
  padding: 8px 12px;
  border-radius: 20px;
  font-size: 12px;
  cursor: pointer;
  transition: all 0.3s ease;
}

.control-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 5px 15px rgba(102, 126, 234, 0.4);
}

/* 阶段导航 */
.stage-navigation {
  position: absolute;
  right: 20px;
  top: 20px;
  bottom: 20px;
  width: 200px;
  background: rgba(255, 255, 255, 0.95);
  border-radius: 15px;
  padding: 20px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
  backdrop-filter: blur(10px);
  overflow-y: auto;
  z-index: 100;
}

.nav-title {
  font-size: 18px;
  font-weight: 600;
  color: #333;
  margin-bottom: 15px;
  text-align: center;
}

.stage-list {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.stage-item {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 10px;
  border-radius: 10px;
  cursor: pointer;
  transition: all 0.3s ease;
  background: rgba(102, 126, 234, 0.1);
}

.stage-item:hover {
  background: rgba(102, 126, 234, 0.2);
  transform: translateX(5px);
}

.stage-item.active {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  transform: translateX(5px);
}

.stage-icon {
  font-size: 20px;
}

.stage-name {
  font-size: 14px;
  font-weight: 500;
}

/* 任务提示 */
.task-hint {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  z-index: 200;
  pointer-events: none;
  animation: fadeInOut 3s ease-in-out;
}

.hint-content {
  background: rgba(0, 0, 0, 0.8);
  color: white;
  padding: 15px 25px;
  border-radius: 50px;
  display: flex;
  align-items: center;
  gap: 10px;
  font-size: 16px;
  font-weight: 600;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
  backdrop-filter: blur(10px);
}

.hint-icon {
  font-size: 20px;
}

@keyframes fadeInOut {
  0% {
    opacity: 0;
    transform: translate(-50%, -50%) scale(0.8);
  }
  20% {
    opacity: 1;
    transform: translate(-50%, -50%) scale(1);
  }
  80% {
    opacity: 1;
    transform: translate(-50%, -50%) scale(1);
  }
  100% {
    opacity: 0;
    transform: translate(-50%, -50%) scale(0.8);
  }
}

/* 移动端适配 */
@media (max-width: 768px) {
  .control-panel {
    top: 10px;
    left: 10px;
    right: 10px;
    max-width: none;
    padding: 15px;
  }
  
  .stage-navigation {
    right: 10px;
    top: 120px;
    width: 150px;
    padding: 15px;
  }
  
  .control-buttons {
    justify-content: center;
  }
  
  .control-btn {
    font-size: 11px;
    padding: 6px 10px;
  }
  
  .stage-item {
    padding: 8px;
  }
  
  .stage-name {
    font-size: 12px;
  }
}

@media (max-width: 480px) {
  .stage-navigation {
    display: none;
  }
  
  .control-panel {
    padding: 10px;
  }
  
  .stage-info h3 {
    font-size: 16px;
  }
  
  .stage-info p {
    font-size: 12px;
  }
}
</style>
