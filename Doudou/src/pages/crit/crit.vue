<template>
	<view class="crit-container">
		<image
			:class="['doudou-gif', isAnimating ? 'impact' : '']"
			:src="currentGif"
			:key="currentIndex"
			mode="aspectFit"
		/>
		<view class="hint">每3秒自动切换一张动图（共5张）</view>
	</view>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'

// QA 目录下的 1~5 动图
const gifList = [
	'/static/QA/1_matting.gif',
	'/static/QA/2_matting.gif',
	'/static/QA/3_matting.gif',
	'/static/QA/4_matting.gif',
	'/static/QA/5_matting.gif'
]

const currentIndex = ref(0)
const currentGif = ref(gifList[currentIndex.value])
const isAnimating = ref(false)

let timer = null

const triggerImpact = () => {
	isAnimating.value = false
	requestAnimationFrame(() => {
		isAnimating.value = true
		setTimeout(() => {
			isAnimating.value = false
		}, 700)
	})
}

const advanceGif = () => {
	currentIndex.value = (currentIndex.value + 1) % gifList.length
	currentGif.value = gifList[currentIndex.value]
	triggerImpact()
}

onMounted(() => {
	// 初始显示时也触发一次强化视觉效果
	triggerImpact()
	timer = setInterval(advanceGif, 3000)
})

onUnmounted(() => {
	if (timer) clearInterval(timer)
})
</script>

<style lang="scss" scoped>
.crit-container {
	width: 100vw;
	height: 100vh;
	background: url('@/static/QA/聊天背景.jpg') no-repeat center center;
	background-size: cover;
	display: flex;
	flex-direction: column;
	align-items: center;
	justify-content: center;
}

.doudou-gif {
	width: 80vw;
	height: 80vh;
	max-width: 800rpx;
	max-height: 1000rpx;
	filter: drop-shadow(0 10rpx 30rpx rgba(0, 0, 0, 0.25));
	will-change: transform, filter;
}

.impact {
	animation: flash 0.35s ease-out, pop 0.6s cubic-bezier(.3,1.2,.2,1);
}

@keyframes flash {
	0% { filter: brightness(1) saturate(1) contrast(1) drop-shadow(0 10rpx 30rpx rgba(0,0,0,0.25)); }
	20% { filter: brightness(2) saturate(1.6) contrast(1.25) drop-shadow(0 0 28rpx rgba(255, 120, 120, 0.85)); }
	100% { filter: brightness(1) saturate(1) contrast(1) drop-shadow(0 10rpx 30rpx rgba(0,0,0,0.25)); }
}

@keyframes pop {
	0% { transform: scale(0.86) rotate(-2deg); }
	60% { transform: scale(1.06) rotate(1deg); }
	100% { transform: scale(1) rotate(0deg); }
}

.hint {
	position: absolute;
	bottom: 40rpx;
	left: 0;
	right: 0;
	text-align: center;
	color: #fff;
	font-size: 26rpx;
	text-shadow: 0 2rpx 6rpx rgba(0,0,0,0.35);
	opacity: 0.9;
}
</style>


