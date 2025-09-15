<template>
  <view class="radar-wrap" :style="{ width: width + 'px', height: height + 'px' }">
    <svg :width="width" :height="height" :viewBox="`0 0 ${width} ${height}`" class="radar-svg">
      <g :transform="`translate(${cx}, ${cy})`">
        <!-- 网格(多环) -->
        <g class="radar-grid">
          <circle v-for="r in gridRings" :key="r" :cx="0" :cy="0" :r="r" :stroke="gridColor" fill="none" stroke-width="1" />
        </g>

        <!-- 轴线 -->
        <g class="radar-axes">
          <line v-for="(ax, i) in axes" :key="`ax-${i}`" x1="0" y1="0" :x2="ax.x" :y2="ax.y" :stroke="gridColor" stroke-width="1" />
        </g>

        <!-- 数据多边形阴影 -->
        <polygon :points="pointsString" :fill="fillColor" :fill-opacity="0.25" :stroke="strokeColor" stroke-width="2" />

        <!-- 顶点圆点 -->
        <g class="radar-points">
          <circle v-for="(p, i) in points" :key="`pt-${i}`" :cx="p.x" :cy="p.y" r="3" :fill="strokeColor" />
        </g>
      </g>

      <!-- 标签 -->
      <g class="radar-labels">
        <text v-for="(ax, i) in labels" :key="`lb-${i}`" :x="ax.tx" :y="ax.ty" :fill="labelColor" font-size="12" text-anchor="middle" alignment-baseline="middle">
          {{ ax.name }}
        </text>
      </g>
    </svg>
  </view>
</template>

<script setup>
import { computed, onMounted, nextTick } from 'vue'

const props = defineProps({
  data: { type: Object, required: true },
  width: { type: Number, default: 300 },
  height: { type: Number, default: 300 },
  title: { type: String, default: '' },
  subtitle: { type: String, default: '' },
  animated: { type: Boolean, default: false },
  showLegend: { type: Boolean, default: false },
  showDataLabels: { type: Boolean, default: false },
  gridColor: { type: String, default: '#e6eef5' },
  labelColor: { type: String, default: '#2E3A59' },
  defaultColor: { type: String, default: '#FF9500' }
})

const emit = defineEmits(['chart-ready'])

const cx = computed(() => props.width / 2)
const cy = computed(() => props.height / 2)
const radius = computed(() => Math.min(props.width, props.height) / 2 - 16)

const indicators = computed(() => Array.isArray(props.data?.indicator) ? props.data.indicator : [])
const series = computed(() => Array.isArray(props.data?.series) ? props.data.series[0] : null)

const angleStep = computed(() => (indicators.value.length ? (Math.PI * 2) / indicators.value.length : 0))

// 由于外层 <g> 已经 translate(cx, cy)，此处返回相对中心的坐标
const axes = computed(() => {
  return indicators.value.map((ind, i) => {
    const ang = -Math.PI / 2 + i * angleStep.value
    return { x: Math.cos(ang) * radius.value, y: Math.sin(ang) * radius.value }
  })
})

// 标签需要使用绝对坐标（未处于 translate 组内）
const labels = computed(() => {
  return indicators.value.map((ind, i) => {
    const ang = -Math.PI / 2 + i * angleStep.value
    const tx = cx.value + Math.cos(ang) * (radius.value + 14)
    const ty = cy.value + Math.sin(ang) * (radius.value + 14)
    return { name: ind.name || `I${i + 1}` , tx, ty }
  })
})

const points = computed(() => {
  if (!series.value || !indicators.value.length) return []
  const vals = series.value.value || []
  return indicators.value.map((ind, i) => {
    const max = ind.max || 100
    const v = Math.max(0, Math.min(max, vals[i] ?? 0)) / max
    const ang = -Math.PI / 2 + i * angleStep.value
    const r = v * radius.value
    return { x: Math.cos(ang) * r, y: Math.sin(ang) * r }
  })
})

const pointsString = computed(() => points.value.map(p => `${p.x},${p.y}`).join(' '))

const strokeColor = computed(() => series.value?.color || props.defaultColor)
const fillColor = strokeColor

const gridRings = computed(() => {
  // 4 条同心圆
  const n = 4
  return Array.from({ length: n }, (_, i) => radius.value * ((i + 1) / n))
})

onMounted(async () => {
  await nextTick()
  emit('chart-ready')
})
</script>

<style scoped>
.radar-wrap { background: rgba(255,255,255,0.95); border-radius: 12rpx; }
.radar-svg { display: block; }
</style>


