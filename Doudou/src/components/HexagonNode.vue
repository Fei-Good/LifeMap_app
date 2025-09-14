<template>
	<view 
		class="hexagon-node"
		:class="[
			`hex-${type}`,
			{
				'hex-completed': completed,
				'hex-current': current,
				'hex-locked': locked,
				'hex-glowing': glowing,
				'hex-pulsing': pulsing
			}
		]"
		:style="nodeStyle"
		@click="handleClick"
		@touchstart="handleTouchStart"
		@touchend="handleTouchEnd"
	>
		<!-- 六边形背景 -->
		<view class="hex-background" :style="backgroundStyle">
			<!-- 进度环 -->
			<view v-if="progress !== undefined" class="progress-ring">
				<view 
					class="progress-circle" 
					:style="{ 
						background: `conic-gradient(${progressColor} ${progress * 3.6}deg, transparent 0deg)` 
					}"
				></view>
				<view class="progress-center">
					<text class="progress-text">{{ Math.round(progress) }}%</text>
				</view>
			</view>
			
			<!-- 节点内容 -->
			<view class="hex-content">
				<!-- 图标 -->
				<view v-if="icon" class="hex-icon">
					<image v-if="icon.startsWith('/static')" :src="icon" class="icon-image" mode="aspectFit" />
					<text v-else class="icon-emoji">{{ icon }}</text>
				</view>
				
				<!-- 角色 -->
				<view v-if="character" class="hex-character">
					<image :src="character.image" class="character-image" mode="aspectFit" />
					<view v-if="character.level" class="character-level">{{ character.level }}</view>
				</view>
				
				<!-- 数字标识 -->
				<view v-if="number" class="hex-number">{{ number }}</view>
				
				<!-- 状态图标 -->
				<view v-if="statusIcon" class="status-icon">{{ statusIcon }}</view>
			</view>
			
			<!-- 标签 -->
			<view v-if="label" class="hex-label">{{ label }}</view>
			
			<!-- 完成标记 -->
			<view v-if="completed" class="completion-mark">✓</view>
			
			<!-- 锁定标记 -->
			<view v-if="locked" class="lock-mark">🔒</view>
			
			<!-- 新内容提示 -->
			<view v-if="hasNew" class="new-badge">NEW</view>
		</view>
		
		<!-- 连接线 -->
		<view 
			v-for="(connection, index) in connections" 
			:key="`connection-${index}`"
			class="hex-connection"
			:class="{
				'connection-active': connection.active,
				'connection-completed': connection.completed,
				'connection-animated': connection.animated
			}"
			:style="getConnectionStyle(connection)"
		></view>
		
		<!-- 粒子效果 -->
		<view v-if="showParticles" class="particles">
			<view 
				v-for="n in 6" 
				:key="`particle-${n}`"
				class="particle"
				:style="{ 
					'--delay': n * 0.1 + 's',
					'--angle': n * 60 + 'deg'
				}"
			></view>
		</view>
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
	height: props.size + 'px',
	'--hex-size': props.size + 'px',
	'--hex-color': props.color,
	'--hex-bg-color': props.backgroundColor || getDefaultBackgroundColor()
}))

// 计算背景样式
const backgroundStyle = computed(() => ({
	background: props.backgroundColor || getDefaultBackgroundColor(),
	boxShadow: props.glowing ? `0 0 ${props.size * 0.3}px ${props.color}66` : 'none'
}))

// 获取默认背景色
const getDefaultBackgroundColor = () => {
	const colorMap = {
		start: 'linear-gradient(135deg, #4CAF50 0%, #45a049 100%)',
		milestone: 'linear-gradient(135deg, #2196F3 0%, #1976D2 100%)',
		current: 'linear-gradient(135deg, #4CAF50 0%, #45a049 100%)',
		task: 'linear-gradient(135deg, #FF6B9D 0%, #E91E63 100%)',
		future: 'linear-gradient(135deg, #64B5F6 0%, #42A5F5 100%)',
		locked: 'linear-gradient(135deg, #BDBDBD 0%, #9E9E9E 100%)',
		special: 'linear-gradient(135deg, #FFB74D 0%, #FF9800 100%)',
		default: 'linear-gradient(135deg, #E0E0E0 0%, #BDBDBD 100%)'
	}
	return colorMap[props.type] || colorMap.default
}

// 获取连接线样式
const getConnectionStyle = (connection) => {
	if (!connection.to) return {}
	
	const length = connection.length || 60
	const angle = connection.angle || 0
	
	return {
		width: length + 'px',
		height: '3px',
		transform: `rotate(${angle}deg) translateX(${props.size / 2}px)`,
		transformOrigin: '0 50%',
		left: '50%',
		top: '50%',
		background: connection.completed ? props.color : 
				   connection.active ? props.color + '88' : '#E0E0E0'
	}
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
.hexagon-node {
	position: absolute;
	cursor: pointer;
	transition: all 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94);
	z-index: 10;
	
	&:active {
		transform: scale(0.95);
	}
}

.hex-background {
	width: 100%;
	height: 100%;
	position: relative;
	clip-path: polygon(30% 0%, 70% 0%, 100% 50%, 70% 100%, 30% 100%, 0% 50%);
	transition: all 0.3s ease;
	border: 2px solid rgba(255, 255, 255, 0.3);
}

.hex-content {
	width: 100%;
	height: 100%;
	display: flex;
	align-items: center;
	justify-content: center;
	flex-direction: column;
	position: relative;
	z-index: 2;
}

// 图标样式
.hex-icon {
	.icon-image {
		width: calc(var(--hex-size) * 0.5);
		height: calc(var(--hex-size) * 0.5);
		max-width: 40px;
		max-height: 40px;
	}
	
	.icon-emoji {
		font-size: calc(var(--hex-size) * 0.4);
		max-font-size: 32px;
		filter: drop-shadow(0 2px 4px rgba(0, 0, 0, 0.2));
	}
}

// 角色样式
.hex-character {
	position: relative;
	
	.character-image {
		width: calc(var(--hex-size) * 0.6);
		height: calc(var(--hex-size) * 0.6);
		max-width: 48px;
		max-height: 48px;
	}
	
	.character-level {
		position: absolute;
		bottom: -8px;
		right: -8px;
		background: #FF3B30;
		color: white;
		border-radius: 50%;
		width: 20px;
		height: 20px;
		display: flex;
		align-items: center;
		justify-content: center;
		font-size: 12px;
		font-weight: bold;
	}
}

// 数字标识
.hex-number {
	font-size: calc(var(--hex-size) * 0.4);
	font-weight: bold;
	color: white;
	text-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
}

// 状态图标
.status-icon {
	position: absolute;
	top: 5px;
	right: 5px;
	font-size: 16px;
	filter: drop-shadow(0 2px 4px rgba(0, 0, 0, 0.2));
}

// 标签
.hex-label {
	position: absolute;
	bottom: -25px;
	left: 50%;
	transform: translateX(-50%);
	font-size: 12px;
	color: #666;
	white-space: nowrap;
	background: rgba(255, 255, 255, 0.9);
	padding: 2px 8px;
	border-radius: 10px;
	box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

// 进度环
.progress-ring {
	position: absolute;
	top: -5px;
	right: -5px;
	width: 30px;
	height: 30px;
	z-index: 3;
}

.progress-circle {
	width: 100%;
	height: 100%;
	border-radius: 50%;
	position: relative;
	
	&::before {
		content: '';
		position: absolute;
		inset: 3px;
		background: white;
		border-radius: 50%;
	}
}

.progress-center {
	position: absolute;
	top: 50%;
	left: 50%;
	transform: translate(-50%, -50%);
	
	.progress-text {
		font-size: 8px;
		font-weight: bold;
		color: #333;
	}
}

// 完成标记
.completion-mark {
	position: absolute;
	top: -8px;
	right: -8px;
	background: #4CAF50;
	color: white;
	border-radius: 50%;
	width: 24px;
	height: 24px;
	display: flex;
	align-items: center;
	justify-content: center;
	font-size: 14px;
	font-weight: bold;
	z-index: 4;
	box-shadow: 0 2px 8px rgba(76, 175, 80, 0.3);
}

// 锁定标记
.lock-mark {
	position: absolute;
	top: 50%;
	left: 50%;
	transform: translate(-50%, -50%);
	font-size: calc(var(--hex-size) * 0.3);
	opacity: 0.7;
	z-index: 3;
}

// 新内容标记
.new-badge {
	position: absolute;
	top: -8px;
	left: -8px;
	background: #FF3B30;
	color: white;
	font-size: 10px;
	font-weight: bold;
	padding: 2px 6px;
	border-radius: 8px;
	z-index: 4;
	animation: bounce 1s ease-in-out infinite;
}

// 连接线
.hex-connection {
	position: absolute;
	z-index: 1;
	border-radius: 2px;
	transition: all 0.3s ease;
	
	&.connection-animated {
		&::after {
			content: '';
			position: absolute;
			top: 0;
			left: 0;
			width: 100%;
			height: 100%;
			background: linear-gradient(90deg, transparent 0%, white 50%, transparent 100%);
			animation: flow 2s linear infinite;
		}
	}
}

// 粒子效果
.particles {
	position: absolute;
	top: 50%;
	left: 50%;
	transform: translate(-50%, -50%);
	pointer-events: none;
	z-index: 5;
}

.particle {
	position: absolute;
	width: 4px;
	height: 4px;
	background: var(--hex-color, #4CAF50);
	border-radius: 50%;
	animation: particle-float 2s ease-in-out infinite;
	animation-delay: var(--delay, 0s);
	transform: rotate(var(--angle, 0deg)) translateY(-40px);
}

// 状态动画
.hex-glowing .hex-background {
	animation: glow 2s ease-in-out infinite alternate;
}

.hex-pulsing .hex-background {
	animation: pulse 1.5s ease-in-out infinite;
}

.hex-locked {
	opacity: 0.6;
	filter: grayscale(0.5);
}

.hex-current .hex-background {
	border-color: var(--hex-color, #4CAF50);
	border-width: 3px;
}

// 动画定义
@keyframes glow {
	0% { box-shadow: 0 0 10px var(--hex-color, #4CAF50)44; }
	100% { box-shadow: 0 0 20px var(--hex-color, #4CAF50)88; }
}

@keyframes pulse {
	0%, 100% { transform: scale(1); }
	50% { transform: scale(1.05); }
}

@keyframes bounce {
	0%, 100% { transform: translateY(0); }
	50% { transform: translateY(-4px); }
}

@keyframes flow {
	0% { transform: translateX(-100%); }
	100% { transform: translateX(100%); }
}

@keyframes particle-float {
	0% { 
		opacity: 1; 
		transform: rotate(var(--angle, 0deg)) translateY(-20px) scale(1); 
	}
	100% { 
		opacity: 0; 
		transform: rotate(var(--angle, 0deg)) translateY(-60px) scale(0.5); 
	}
}

// 响应式调整
@media screen and (max-width: 768px) {
	.hex-label {
		font-size: 10px;
		bottom: -20px;
	}
	
	.progress-ring {
		width: 24px;
		height: 24px;
		top: -3px;
		right: -3px;
	}
	
	.completion-mark, .new-badge {
		width: 20px;
		height: 20px;
		font-size: 12px;
	}
}
</style>
