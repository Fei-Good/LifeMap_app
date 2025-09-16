<template>
  <view class="radar-wrap" :style="{ width: width + 'px', height: height + 'px' }">
    <svg :width="width" :height="height" :viewBox="`0 0 ${width} ${height}`" class="radar-svg" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="radarGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" :stop-color="strokeColor" stop-opacity="0.28" />
          <stop offset="100%" :stop-color="strokeColor" stop-opacity="0.08" />
        </linearGradient>
      </defs>
      <g :transform="`translate(${cx}, ${cy})`">
        <!-- 网格(多环) - 已删除圆形边框 -->

        <!-- 多边形网格(按维度数) -->
        <g class="radar-poly-grid" v-if="indicators.length >= 3">
          <polygon v-for="frac in ringFractions" :key="`pg-${frac}`" :points="ringPolygon(frac)" :stroke="gridColor" fill="none" stroke-width="1" opacity="0.7" />
        </g>

        <!-- 轴线 -->
        <g class="radar-axes">
          <line v-for="(ax, i) in axes" :key="`ax-${i}`" x1="0" y1="0" :x2="ax.x" :y2="ax.y" :stroke="gridColor" stroke-width="1" />
        </g>

        <!-- 数据多边形阴影 -->
        <polygon :points="pointsString" fill="url(#radarGrad)" :stroke="strokeColor" stroke-width="2" />
        <!-- 轮廓提升层次 -->
        <polygon :points="pointsString" fill="none" :stroke="strokeColor" stroke-width="1" opacity="0.35" />

        <!-- 顶点圆点 -->
        <g class="radar-points">
          <circle v-for="(p, i) in points" :key="`pt-${i}`" :cx="p.x" :cy="p.y" r="3" :fill="strokeColor" />
        </g>

        <!-- 顶点数值标签（可选） -->
        <g v-if="showDataLabels" class="radar-values">
          <text v-for="(p, i) in points" :key="`val-${i}`" :x="p.x * 1.06" :y="p.y * 1.06" fill="#2E3A59" font-size="10" text-anchor="middle" dominant-baseline="middle" stroke="#fff" stroke-width="3" stroke-opacity="0.85" style="paint-order: stroke fill">
            {{ seriesValues[i] ?? 0 }}
          </text>
        </g>
      </g>

      <!-- 标签：使用悬浮 HTML 覆盖渲染，避免 uni-h5 将 SVG <text> 编译为不可见元素 -->
    </svg>
    <div class="label-overlay">
      <div
        v-for="(ax, i) in labels"
        :key="`hl-${i}`"
        class="label-item"
        :style="{ left: ax.tx + 'px', top: ax.ty + 'px', color: labelColor }"
      >
        <div v-for="(line, li) in ax.lines" :key="`hl-l-${i}-${li}`">{{ line }}</div>
      </div>
    </div>
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
  defaultColor: { type: String, default: '#FF9500' },
  labelOffset: { type: Number, default: 36 }
})

const emit = defineEmits(['chart-ready'])

const cx = computed(() => props.width / 2)
const cy = computed(() => props.height / 2)
// 适当缩小半径，为外圈标签预留空间
const radius = computed(() => Math.min(props.width, props.height) / 2 - 48)

const indicators = computed(() => Array.isArray(props.data?.indicator) ? props.data.indicator : [])
const series = computed(() => Array.isArray(props.data?.series) ? props.data.series[0] : null)
const seriesValues = computed(() => Array.isArray(series.value?.value) ? series.value.value : [])

const angleStep = computed(() => (indicators.value.length ? (Math.PI * 2) / indicators.value.length : 0))

// 由于外层 <g> 已经 translate(cx, cy)，此处返回相对中心的坐标
const axes = computed(() => {
  return indicators.value.map((ind, i) => {
    const ang = -Math.PI / 2 + i * angleStep.value
    return { x: Math.cos(ang) * radius.value, y: Math.sin(ang) * radius.value }
  })
})

// 标签需要使用绝对坐标（未处于 translate 组内）
const splitName = (name) => {
  if (!name) return ['']
  const s = String(name)
  // 对中文名按2~3字断行，对英文按空格断行，最多两行
  if (/^[\u4e00-\u9fa5]+$/.test(s)) {
    const mid = Math.ceil(s.length / 2)
    return [s.slice(0, mid), s.slice(mid)]
  }
  const parts = s.split(/\s+/)
  if (parts.length <= 1) return [s]
  const first = parts.slice(0, Math.ceil(parts.length / 2)).join(' ')
  const second = parts.slice(Math.ceil(parts.length / 2)).join(' ')
  return [first, second]
}

const labels = computed(() => {
  // 向内微收敛，并加大容器内边距，避免贴边
  const extraOffset = -6
  const pad = 16 // 最小内边距
  return indicators.value.map((ind, i) => {
    const ang = -Math.PI / 2 + i * angleStep.value
    const r = radius.value + props.labelOffset + extraOffset
    const txRaw = cx.value + Math.cos(ang) * r
    const tyRaw = cy.value + Math.sin(ang) * r
    const tx = Math.min(props.width - pad, Math.max(pad, txRaw))
    const ty = Math.min(props.height - pad, Math.max(pad, tyRaw))
    const lines = splitName(ind.name || `维度${i + 1}`)
    return { name: ind.name || `维度${i + 1}`, tx, ty, lines }
  })
})

const points = computed(() => {
  if (!series.value || !indicators.value.length) return []
  const vals = seriesValues.value || []
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

// 多边形网格环（0~1 的比例）
const ringFractions = [0.25, 0.5, 0.75, 1]
const ringPolygon = (frac) => {
  if (!indicators.value.length) return ''
  const pts = indicators.value.map((_, i) => {
    const ang = -Math.PI / 2 + i * angleStep.value
    const r = radius.value * frac
    return `${Math.cos(ang) * r},${Math.sin(ang) * r}`
  })
  return pts.join(' ')
}

onMounted(async () => {
  await nextTick()
  console.log('雷达图标签数据:', labels.value)
  console.log('指标数据:', indicators.value)
  emit('chart-ready')
})
</script>

<style scoped>
.radar-wrap { background: rgba(255,255,255,0.95); border-radius: 12rpx; position: relative; }
.radar-svg { display: block; }
.label-overlay { position: absolute; inset: 0; pointer-events: none; }
.label-item { position: absolute; transform: translate(-50%, -50%); font-size: 13px; font-weight: 700; text-align: center; line-height: 1.2; color: #2E3A59; }
.label-item { background: rgba(255,255,255,0.92); padding: 4px 8px; border-radius: 999px; border: 1px solid rgba(255,149,0,0.25); box-shadow: 0 4px 14px rgba(255,149,0,0.08), 0 2px 6px rgba(0,0,0,0.05); backdrop-filter: blur(2px); max-width: 100px; word-break: keep-all; white-space: nowrap; }
</style>


