<template>
	<view class="radar-placeholder" :style="{ width: width + 'px', height: height + 'px' }">
		<text class="radar-text">雷达图占位</text>
	</view>
</template>

<script setup>
import { onMounted, nextTick } from 'vue'
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
const emit = defineEmits(['chart-ready'])
onMounted(async () => {
	await nextTick()
	// 简化占位实现：立即通知就绪，避免 H5 动态导入报错
	emit('chart-ready')
})
</script>

<style scoped>
.radar-placeholder { display: grid; place-items: center; border: 1rpx dashed #ccc; border-radius: 12rpx; background: #fff; }
.radar-text { color: #999; font-size: 24rpx; }
</style>


