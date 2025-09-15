<template>
  <view class="radar-chart-container">
    <view class="chart-header" v-if="title">
      <text class="chart-title">{{ title }}</text>
      <text class="chart-subtitle" v-if="subtitle">{{ subtitle }}</text>
    </view>
    
    <view class="radar-chart" :style="{ width: width + 'rpx', height: height + 'rpx' }">
      <!-- 使用 SVG 绘制雷达图 -->
      <svg 
        class="radar-svg" 
        :viewBox="`0 0 ${width} ${height}`"
        xmlns="http://www.w3.org/2000/svg"
        :style="{ width: width + 'rpx', height: height + 'rpx' }"
      >
        <!-- 定义渐变 -->
        <defs>
          <radialGradient id="radarGradient" cx="50%" cy="50%" r="50%">
            <stop offset="0%" style="stop-color:#FF9500;stop-opacity:0.3" />
            <stop offset="100%" style="stop-color:#FF9500;stop-opacity:0.1" />
          </radialGradient>
        </defs>
        
        <!-- 背景网格 -->
        <g class="grid-group">
          <!-- 同心圆 -->
          <circle 
            v-for="i in 5" 
            :key="'circle-' + i"
            :cx="centerX" 
            :cy="centerY" 
            :r="(i * radius) / 5"
            fill="none" 
            :stroke="gridColor"
            stroke-width="1"
            opacity="0.3"
          />
          
          <!-- 轴线 -->
          <line 
            v-for="(indicator, index) in data.indicator" 
            :key="'axis-' + index"
            :x1="centerX" 
            :y1="centerY"
            :x2="getAxisEndX(index)"
            :y2="getAxisEndY(index)"
            :stroke="gridColor"
            stroke-width="1"
            opacity="0.4"
          />
        </g>
        
        <!-- 数据区域 -->
        <g class="data-group" v-for="(series, seriesIndex) in data.series" :key="'series-' + seriesIndex">
          <!-- 数据多边形 -->
          <polygon
            :points="getPolygonPoints(series.value)"
            fill="url(#radarGradient)"
            :stroke="series.color || defaultColor"
            stroke-width="2"
            class="data-polygon"
          />
          
          <!-- 数据点 -->
          <circle
            v-for="(value, index) in series.value"
            :key="'point-' + seriesIndex + '-' + index"
            :cx="getPointX(value, index)"
            :cy="getPointY(value, index)"
            r="4"
            :fill="series.color || defaultColor"
            class="data-point"
          />
          
          <!-- 数据标签 -->
          <text
            v-if="showDataLabels"
            v-for="(value, index) in series.value"
            :key="'label-' + seriesIndex + '-' + index"
            :x="getPointX(value, index)"
            :y="getPointY(value, index) - 10"
            text-anchor="middle"
            :fill="series.color || defaultColor"
            font-size="12"
            font-weight="600"
            class="data-label"
          >
            {{ value }}
          </text>
        </g>
      </svg>
      
      <!-- 维度标签 (HTML 覆盖层) -->
      <view class="labels-overlay">
        <view 
          v-for="(indicator, index) in data.indicator" 
          :key="'label-' + index"
          class="dimension-label"
          :style="getDimensionLabelStyle(index)"
        >
          <view class="label-content">
            {{ indicator.name }}
          </view>
        </view>
      </view>
    </view>
    
    <!-- 图例 -->
    <view class="legend" v-if="showLegend && data.series.length > 1">
      <view 
        class="legend-item" 
        v-for="(series, index) in data.series" 
        :key="'legend-' + index"
      >
        <view 
          class="legend-color" 
          :style="{ backgroundColor: series.color || defaultColor }"
        ></view>
        <text class="legend-text">{{ series.name }}</text>
      </view>
    </view>
  </view>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'

// Props 定义
const props = defineProps({
  data: {
    type: Object,
    required: true,
    default: () => ({
      indicator: [],
      series: []
    })
  },
  title: {
    type: String,
    default: ''
  },
  subtitle: {
    type: String,
    default: ''
  },
  width: {
    type: Number,
    default: 400
  },
  height: {
    type: Number,
    default: 400
  },
  animated: {
    type: Boolean,
    default: true
  },
  showLegend: {
    type: Boolean,
    default: false
  },
  showDataLabels: {
    type: Boolean,
    default: true
  },
  gridColor: {
    type: String,
    default: '#e8e8e8'
  },
  labelColor: {
    type: String,
    default: '#333'
  },
  defaultColor: {
    type: String,
    default: '#FF9500'
  }
})

// Emits 定义
const emit = defineEmits(['chart-ready'])

// 计算属性
const centerX = computed(() => props.width / 2)
const centerY = computed(() => props.height / 2)
const radius = computed(() => Math.min(props.width, props.height) / 2 - 60)

// 获取轴线终点坐标
const getAxisEndX = (index) => {
  const angle = (index * 2 * Math.PI / props.data.indicator.length) - Math.PI/2
  return centerX.value + radius.value * Math.cos(angle)
}

const getAxisEndY = (index) => {
  const angle = (index * 2 * Math.PI / props.data.indicator.length) - Math.PI/2
  return centerY.value + radius.value * Math.sin(angle)
}

// 获取数据点坐标
const getPointX = (value, index) => {
  const angle = (index * 2 * Math.PI / props.data.indicator.length) - Math.PI/2
  const ratio = value / props.data.indicator[index].max
  return centerX.value + ratio * radius.value * Math.cos(angle)
}

const getPointY = (value, index) => {
  const angle = (index * 2 * Math.PI / props.data.indicator.length) - Math.PI/2
  const ratio = value / props.data.indicator[index].max
  return centerY.value + ratio * radius.value * Math.sin(angle)
}

// 计算多边形点坐标
const getPolygonPoints = (values) => {
  if (!values || !props.data.indicator) return ''
  
  const points = values.map((value, index) => {
    const x = getPointX(value, index)
    const y = getPointY(value, index)
    return `${x},${y}`
  })
  
  return points.join(' ')
}

// 获取维度标签样式
const getDimensionLabelStyle = (index) => {
  const angle = (index * 2 * Math.PI / props.data.indicator.length) - Math.PI/2
  const distance = radius.value + 30
  const x = centerX.value + distance * Math.cos(angle)
  const y = centerY.value + distance * Math.sin(angle)
  
  return {
    position: 'absolute',
    left: x + 'rpx',
    top: y + 'rpx',
    transform: 'translate(-50%, -50%)',
    zIndex: 10
  }
}

// 生命周期
onMounted(() => {
  setTimeout(() => {
    emit('chart-ready')
  }, 100)
})
</script>

<style lang="scss" scoped>
.radar-chart-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 30rpx;
  padding: 30rpx;
  background: linear-gradient(135deg, rgba(255, 255, 255, 0.98) 0%, rgba(248, 250, 252, 0.95) 100%);
  border-radius: 25rpx;
  box-shadow: 0 15rpx 35rpx rgba(0, 0, 0, 0.12), 0 5rpx 15rpx rgba(0, 0, 0, 0.08);
  border: 2rpx solid rgba(255, 149, 0, 0.1);
  backdrop-filter: blur(10rpx);
  position: relative;
  overflow: hidden;
  
  &::before {
    content: '';
    position: absolute;
    top: -50%;
    left: -50%;
    width: 200%;
    height: 200%;
    background: radial-gradient(circle, rgba(255, 149, 0, 0.05) 0%, transparent 70%);
    animation: radarSweep 12s linear infinite;
    pointer-events: none;
  }
}

@keyframes radarSweep {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.chart-header {
  text-align: center;
  display: flex;
  flex-direction: column;
  gap: 10rpx;
  z-index: 2;
}

.chart-title {
  font-size: 40rpx;
  font-weight: 800;
  color: #2E3A59;
  text-shadow: 0 3rpx 6rpx rgba(0, 0, 0, 0.15);
  background: linear-gradient(135deg, #FF9500, #FF6B35);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.chart-subtitle {
  font-size: 28rpx;
  color: #666;
  opacity: 0.9;
  font-weight: 500;
  text-shadow: 0 1rpx 3rpx rgba(0, 0, 0, 0.1);
}

.radar-chart {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 2;
}

.radar-svg {
  display: block;
  filter: drop-shadow(0 4rpx 12rpx rgba(0, 0, 0, 0.1));
}

.data-polygon {
  transition: all 0.6s cubic-bezier(0.4, 0, 0.2, 1);
  
  &.animated {
    animation: polygonGrow 1s ease-out;
  }
}

.data-point {
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  filter: drop-shadow(0 2rpx 6rpx rgba(255, 149, 0, 0.4));
  
  &:hover {
    r: 6;
    filter: drop-shadow(0 4rpx 12rpx rgba(255, 149, 0, 0.6));
  }
}

.data-label {
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  text-shadow: 0 1rpx 3rpx rgba(255, 255, 255, 0.8);
  pointer-events: none;
}

.labels-overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
}

.dimension-label {
  position: absolute;
  z-index: 10;
}

.label-content {
  background: rgba(255, 255, 255, 0.95);
  border: 2rpx solid #FF9500;
  border-radius: 20rpx;
  padding: 8rpx 16rpx;
  font-size: 24rpx;
  font-weight: 700;
  color: #2E3A59;
  text-shadow: 0 1rpx 3rpx rgba(0, 0, 0, 0.2);
  white-space: nowrap;
  box-shadow: 0 4rpx 12rpx rgba(0, 0, 0, 0.15);
  backdrop-filter: blur(5rpx);
  transition: all 0.3s ease;
  
  &:hover {
    background: rgba(255, 149, 0, 0.1);
    transform: scale(1.05);
  }
}

.legend {
  display: flex;
  flex-wrap: wrap;
  gap: 25rpx;
  justify-content: center;
  padding: 20rpx;
  background: rgba(0, 0, 0, 0.05);
  border-radius: 15rpx;
  margin-top: 20rpx;
}

.legend-item {
  display: flex;
  align-items: center;
  gap: 10rpx;
}

.legend-color {
  width: 20rpx;
  height: 20rpx;
  border-radius: 50%;
  flex-shrink: 0;
}

.legend-text {
  font-size: 24rpx;
  color: #666;
  font-weight: 500;
}

/* 动画效果 */
@keyframes polygonGrow {
  from {
    transform: scale(0);
    opacity: 0;
  }
  to {
    transform: scale(1);
    opacity: 1;
  }
}

/* 响应式设计 */
@media (max-width: 768px) {
  .chart-title {
    font-size: 32rpx;
  }
  
  .chart-subtitle {
    font-size: 24rpx;
  }
  
  .label-content {
    font-size: 22rpx;
    padding: 6rpx 12rpx;
  }
}

@media (max-width: 480px) {
  .radar-chart-container {
    gap: 20rpx;
    padding: 20rpx;
  }
  
  .chart-title {
    font-size: 28rpx;
  }
  
  .chart-subtitle {
    font-size: 22rpx;
  }
  
  .label-content {
    font-size: 20rpx;
    padding: 4rpx 8rpx;
  }
}
</style>