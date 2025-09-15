<template>
	<view 
		class="stage-cell"
		:class="[
			`status-${getStatus()}`,
			{ 'is-current': current }
		]"
		:style="nodeStyle"
		@click="handleClick"
		@touchstart="handleTouchStart"
		@touchend="handleTouchEnd"
	>
		<!-- 格子背景 -->
		<image 
			class="cell-background" 
			:src="getCellBackground()" 
			mode="scaleToFill"
		/>
		
		<!-- 阶段内容 -->
		<view class="stage-content">
			<text class="stage-emoji">{{ getDisplayIcon() }}</text>
			<text class="stage-name">{{ getDisplayLabel() }}</text>
		</view>
		
		<!-- 状态标记 -->
		<view v-if="completed" class="status-mark completed">✓</view>
		<view v-if="locked" class="status-mark locked">🔒</view>
		<view v-if="current" class="current-glow"></view>
	</view>
</template>

<script setup>
import { computed, ref } from 'vue'

// Props定义
const props = defineProps({
	// 基础属性
	type: { type: String, default: 'default' },
	size: { type: Number, default: 80 },
	x: { type: Number, default: 0 },
	y: { type: Number, default: 0 },
	
	// 状态
	completed: { type: Boolean, default: false },
	current: { type: Boolean, default: false },
	locked: { type: Boolean, default: false },
	glowing: { type: Boolean, default: false },
	pulsing: { type: Boolean, default: false },
	
	// 内容
	icon: { type: String, default: '' },
	character: { type: Object, default: null },
	number: { type: [String, Number], default: '' },
	label: { type: String, default: '' },
	
	// 进度
	progress: { type: Number, default: undefined },
	progressColor: { type: String, default: '#4CAF50' },
	
	// 颜色主题
	color: { type: String, default: '#4CAF50' },
	backgroundColor: { type: String, default: '' },
	
	// 连接
	connections: { type: Array, default: () => [] },
	
	// 特殊状态
	hasNew: { type: Boolean, default: false },
	statusIcon: { type: String, default: '' },
	showParticles: { type: Boolean, default: false }
})

// 事件定义
const emit = defineEmits(['click', 'touchstart', 'touchend'])

// 触摸状态
const isTouching = ref(false)

// 计算节点样式
const nodeStyle = computed(() => ({
	left: props.x + 'px',
	top: props.y + 'px',
	width: props.size + 'px',
	height: props.size + 'px'
}))

// 获取状态
const getStatus = () => {
	if (props.completed) return 'completed'
	if (props.current) return 'current'
	if (props.locked) return 'locked'
	return 'available'
}

// 获取格子背景
const getCellBackground = () => {
	const status = getStatus()
	switch (status) {
		case 'completed':
			return '/textures/地图功能/绿色格子.png'
		case 'current':
			return '/textures/地图功能/蓝色格子.png'
		case 'available':
			return '/textures/地图功能/粉色格子.png'
		default:
			return '/textures/地图功能/背景网格.png'
	}
}

// 获取显示图标
const getDisplayIcon = () => {
	if (props.icon) {
		// 如果是emoji，直接返回
		if (!props.icon.startsWith('/static') && !props.icon.startsWith('/textures')) {
			return props.icon
		}
	}
	
	// 根据类型返回默认图标
	const iconMap = {
		start: '👶',
		milestone: '🎯',
		current: '🕒',
		task: '📚',
		future: '🔮',
		locked: '🔒',
		special: '⭐',
		default: '💫'
	}
	return iconMap[props.type] || iconMap.default
}

// 获取显示标签
const getDisplayLabel = () => {
	if (props.label) return props.label
	
	// 根据类型返回默认标签
	const labelMap = {
		start: '开始',
		milestone: '里程碑',
		current: '当前',
		task: '任务',
		future: '未来',
		locked: '锁定',
		special: '特殊',
		default: '节点'
	}
	return labelMap[props.type] || labelMap.default
}


// 处理点击
const handleClick = (event) => {
	if (props.locked) {
		// 震动反馈
		uni.vibrateShort?.()
		return
	}
	
	emit('click', {
		type: props.type,
		id: props.id,
		event
	})
}

// 处理触摸开始
const handleTouchStart = (event) => {
	isTouching.value = true
	emit('touchstart', event)
}

// 处理触摸结束
const handleTouchEnd = (event) => {
	isTouching.value = false
	emit('touchend', event)
}
</script>

<style lang="scss" scoped>
.stage-cell {
	position: absolute;
	cursor: pointer;
	transition: all 0.3s ease;
	
	&:active {
		transform: scale(0.95);
	}
	
	&.is-current {
		z-index: 15;
	}
}

.cell-background {
	position: absolute;
	top: 0;
	left: 0;
	width: 100%;
	height: 100%;
}

.stage-content {
	position: absolute;
	top: 0;
	left: 0;
	width: 100%;
	height: 100%;
	display: flex;
	flex-direction: column;
	align-items: center;
	justify-content: center;
	gap: 5rpx;
	z-index: 2;
}

.stage-emoji {
	font-size: 32rpx;
	filter: drop-shadow(0 2rpx 4rpx rgba(0, 0, 0, 0.2));
}

.stage-name {
	font-size: 18rpx;
	color: #333;
	font-weight: 600;
	text-align: center;
	text-shadow: 0 1rpx 2rpx rgba(255, 255, 255, 0.8);
}

.status-mark {
	position: absolute;
	width: 24rpx;
	height: 24rpx;
	border-radius: 50%;
	display: flex;
	align-items: center;
	justify-content: center;
	font-size: 14rpx;
	font-weight: bold;
	z-index: 3;
	
	&.completed {
		top: -8rpx;
		right: -8rpx;
		background: #4CAF50;
		color: white;
	}
	
	&.locked {
		top: 50%;
		left: 50%;
		transform: translate(-50%, -50%);
		background: rgba(0, 0, 0, 0.5);
		color: white;
	}
}

.current-glow {
	position: absolute;
	top: -10rpx;
	left: -10rpx;
	right: -10rpx;
	bottom: -10rpx;
	border: 3rpx solid #FF9500;
	border-radius: 15rpx;
	animation: glow 2s ease-in-out infinite alternate;
	z-index: 1;
}

@keyframes glow {
	0% { opacity: 0.5; transform: scale(1); }
	100% { opacity: 1; transform: scale(1.05); }
}

/* 响应式设计 */
@media (max-width: 768px) {
	.stage-cell {
		width: 100rpx;
		height: 100rpx;
	}
	
	.stage-emoji {
		font-size: 28rpx;
	}
	
	.stage-name {
		font-size: 16rpx;
	}
}

@media (max-width: 480px) {
	.stage-cell {
		width: 80rpx;
		height: 80rpx;
	}
	
	.stage-emoji {
		font-size: 24rpx;
	}
	
	.stage-name {
		font-size: 14rpx;
	}
}
</style>
