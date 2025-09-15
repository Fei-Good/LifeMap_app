<template>
	<canvas :id="canvasId" :width="width" :height="height" class="radar-canvas"></canvas>
</template>

<script setup>
import { onMounted } from 'vue'
const props = defineProps({
	data: { type: Object, required: true },
	width: { type: Number, default: 300 },
	height: { type: Number, default: 300 },
	title: { type: String, default: '' },
	subtitle: { type: String, default: '' },
	animated: { type: Boolean, default: false },
	showLegend: { type: Boolean, default: false },
	showDataLabels: { type: Boolean, default: false },
	gridColor: { type: String, default: '#eee' },
	labelColor: { type: String, default: '#666' },
	defaultColor: { type: String, default: '#4CAF50' }
})
const canvasId = `radar_${Math.random().toString(36).slice(2)}`
onMounted(() => {
	const c = uni.createCanvasContext(canvasId)
	c.setStrokeStyle(props.gridColor)
	// 简化：画一个圆形边框
	c.arc(props.width/2, props.height/2, Math.min(props.width, props.height)/2-10, 0, Math.PI*2)
	c.stroke()
	c.draw()
	if (typeof getCurrentInstance?.()!.vnode.props?.onChartReady === 'function') {
		getCurrentInstance().vnode.props.onChartReady()
	}
})
</script>

<style scoped>
.radar-canvas { display: block; }
</style>


