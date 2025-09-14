<template>
	<view class="hexagon-map-container">
		<!-- 顶部目标卡片 -->
		<view class="goal-card">
			<view class="goal-header">
				<view class="goal-icon">⭐</view>
				<view class="goal-info">
					<text class="goal-label">目标</text>
					<text class="goal-title">{{ currentGoal.title }}</text>
				</view>
				<view class="goal-progress">
					<text class="progress-label">已坚持天数</text>
					<text class="progress-days">{{ currentGoal.days }}天</text>
				</view>
				<view class="goal-mascot">
					<image :src="mascotImage" class="mascot-image" mode="aspectFit" />
				</view>
			</view>
		</view>

		<!-- 六边形蜂巢地图 -->
		<view class="hexagon-grid" :style="{ transform: `scale(${mapScale}) translate(${mapOffsetX}px, ${mapOffsetY}px)` }">
			<!-- 背景六边形网格 -->
			<view 
				v-for="(row, rowIndex) in hexagonGrid" 
				:key="`bg-row-${rowIndex}`"
				class="hex-row"
				:style="{ 
					left: (rowIndex % 2) * hexSize * 0.75 + 'px',
					top: rowIndex * hexSize * 0.87 + 'px'
				}"
			>
				<view 
					v-for="(hex, colIndex) in row" 
					:key="`bg-hex-${rowIndex}-${colIndex}`"
					class="hex-bg"
					:style="{ 
						left: colIndex * hexSize * 1.5 + 'px',
						width: hexSize + 'px',
						height: hexSize + 'px'
					}"
				></view>
			</view>

			<!-- 活跃的六边形节点 -->
			<HexagonNode
				v-for="node in mapNodes"
				:key="node.id"
				:type="node.type"
				:size="hexSize"
				:x="node.x"
				:y="node.y"
				:icon="node.icon"
				:character="node.character"
				:progress="node.progress"
				:progress-color="node.color"
				:label="node.label"
				:completed="node.completed"
				:current="node.current"
				:locked="node.locked"
				:glowing="node.glowing"
				:pulsing="node.pulsing"
				:has-new="node.hasNew"
				:show-particles="node.showParticles"
				:connections="node.connections"
				@click="handleNodeClick"
			/>
		</view>

		<!-- 底部角色和聊天区域 -->
		<view class="bottom-section">
			<!-- 主角色 -->
			<view class="main-character" @click="handleCharacterClick">
				<image :src="mainCharacter.image" class="main-character-image" mode="aspectFit" />
				<view v-if="mainCharacter.badge" class="character-badge">{{ mainCharacter.badge }}</view>
			</view>
			
			<!-- 快捷操作按钮 -->
			<view class="quick-actions">
				<view 
					v-for="action in quickActions" 
					:key="action.id"
					class="action-btn"
					:class="`action-${action.type}`"
					@click="handleActionClick(action)"
				>
					<text class="action-icon">{{ action.icon }}</text>
				</view>
			</view>
		</view>

		<!-- 任务进度浮窗 -->
		<view v-if="showTaskProgress" class="task-progress-popup">
			<text class="task-count">待办任务 {{ pendingTasks }}/{{ totalTasks }}</text>
		</view>

		<!-- 聊天输入框 -->
		<view class="chat-input-container">
			<input 
				v-model="chatMessage" 
				class="chat-input" 
				placeholder="和doudou聊一下吧"
				@confirm="sendChatMessage"
			/>
			<view class="voice-btn" @click="handleVoiceInput">
				<text class="voice-icon">🎤</text>
			</view>
		</view>

		<!-- 右侧用户按钮 -->
		<view class="user-btn" @click="openUserProfile">
			<text class="user-icon">👥</text>
		</view>
	</view>
</template>

<script setup>
import { ref, reactive, computed, onMounted } from 'vue'
import HexagonNode from '@/components/HexagonNode.vue'

// 六边形尺寸和网格配置
const hexSize = ref(80)
const mapScale = ref(1)
const mapOffsetX = ref(0)
const mapOffsetY = ref(50)

// 当前目标
const currentGoal = reactive({
	title: '成功跑路上岸',
	days: 15
})

// 吉祥物图片
const mascotImage = ref('/static/DouDou比心.png')

// 主角色
const mainCharacter = reactive({
	image: '/static/DouDou_主形象.png',
	badge: '×'
})

// 聊天消息
const chatMessage = ref('')

// 任务进度
const showTaskProgress = ref(true)
const pendingTasks = ref(4)
const totalTasks = ref(4)

// 快捷操作按钮
const quickActions = ref([
	{ id: 'bookmark', type: 'bookmark', icon: '🔖' },
	{ id: 'happy', type: 'emotion', icon: '😊' },
	{ id: 'clock1', type: 'time', icon: '🕒' },
	{ id: 'clock2', type: 'time', icon: '🕒' }
])

// 六边形背景网格
const hexagonGrid = ref(Array.from({ length: 12 }, () => Array(8).fill(null)))

// 地图节点数据
const mapNodes = ref([
	// 顶部路径节点
	{
		id: 'start',
		type: 'start',
		x: 180,
		y: 100,
		icon: '/static/DouDou_主形象.png',
		character: { image: '/static/DouDou_主形象.png' },
		completed: true,
		showParticles: true,
		connections: [{ to: 'milestone1', active: true, completed: true }]
	},
	{
		id: 'milestone1',
		type: 'milestone',
		x: 240,
		y: 180,
		icon: '/static/DouDou_主形象.png',
		character: { image: '/static/DouDou_主形象.png' },
		completed: true,
		connections: [{ to: 'current', active: true, completed: true }]
	},
	
	// 当前位置
	{
		id: 'current',
		type: 'current',
		x: 150,
		y: 280,
		icon: '🕒',
		color: '#4CAF50',
		current: true,
		glowing: true,
		pulsing: true,
		progress: 75,
		connections: [
			{ to: 'task1', active: true, angle: -45, length: 80 },
			{ to: 'task2', active: true, angle: 45, length: 80 }
		]
	},
	
	// 任务节点
	{
		id: 'task1',
		type: 'task',
		x: 80,
		y: 360,
		icon: '🔖',
		color: '#FF6B9D',
		progress: 60,
		label: '阅读任务',
		hasNew: true
	},
	{
		id: 'task2',
		type: 'task',
		x: 220,
		y: 360,
		icon: '🔖',
		color: '#FF6B9D',
		progress: 30,
		label: '运动任务'
	},
	
	// 未来节点
	{
		id: 'future1',
		type: 'future',
		x: 300,
		y: 280,
		icon: '😊',
		color: '#64B5F6',
		locked: true,
		label: '情绪管理'
	},
	{
		id: 'future2',
		type: 'future',
		x: 120,
		y: 450,
		icon: '🕒',
		color: '#FFB74D',
		locked: true,
		label: '时间规划'
	},
	{
		id: 'future3',
		type: 'future',
		x: 250,
		y: 450,
		icon: '🕒',
		color: '#FFB74D',
		locked: true,
		label: '目标设定'
	}
])

// 处理节点点击
const handleNodeClick = (nodeEvent) => {
	// 从mapNodes中找到对应的节点数据
	const node = mapNodes.value.find(n => n.id === nodeEvent.id) || 
				mapNodes.value.find(n => n.type === nodeEvent.type)
	
	if (!node) {
		console.error('未找到节点数据:', nodeEvent)
		return
	}
	
	console.log('点击节点:', node)
	
	if (node.locked) {
		uni.showToast({
			title: '该节点尚未解锁',
			icon: 'none'
		})
		return
	}
	
	if (node.type === 'task') {
		// 打开任务详情
		uni.navigateTo({
			url: `/pages/task/task?taskId=${node.id}`
		})
	} else if (node.type === 'current') {
		// 显示当前进度
		showCurrentProgress(node)
	} else if (node.type === 'start' || node.type === 'milestone') {
		// 显示成就信息
		showAchievementInfo(node)
	}
}

// 显示当前进度
const showCurrentProgress = (node) => {
	uni.showModal({
		title: '当前进度',
		content: `进度: ${node.progress}%\n继续努力，马上就要完成了！`,
		showCancel: false
	})
}

// 显示成就信息
const showAchievementInfo = (node) => {
	const achievementText = node.type === 'start' ? 
		'恭喜你开始了成长之旅！' : 
		`里程碑达成！\n你已经完成了重要的一步。`
	
	uni.showModal({
		title: '成就解锁',
		content: achievementText,
		showCancel: false,
		confirmText: '继续前进'
	})
}

// 处理角色点击
const handleCharacterClick = () => {
	// 角色互动动画
	uni.vibrateShort()
	
	// 可以触发角色对话或动画
	uni.showToast({
		title: 'DouDou很开心！',
		icon: 'none'
	})
}

// 处理快捷操作
const handleActionClick = (action) => {
	console.log('快捷操作:', action)
	
	switch (action.type) {
		case 'bookmark':
			// 打开书签/收藏
			uni.showToast({ title: '打开收藏', icon: 'none' })
			break
		case 'emotion':
			// 情绪记录
			uni.showToast({ title: '记录心情', icon: 'none' })
			break
		case 'time':
			// 时间管理
			uni.showToast({ title: '时间规划', icon: 'none' })
			break
	}
}

// 发送聊天消息
const sendChatMessage = () => {
	if (!chatMessage.value.trim()) return
	
	console.log('发送消息:', chatMessage.value)
	
	// 这里可以集成到你的聊天系统
	uni.navigateTo({
		url: `/pages/chat/chat?message=${encodeURIComponent(chatMessage.value)}`
	})
	
	chatMessage.value = ''
}

// 语音输入
const handleVoiceInput = () => {
	uni.showToast({
		title: '语音功能开发中',
		icon: 'none'
	})
}

// 打开用户资料
const openUserProfile = () => {
	uni.navigateTo({
		url: '/pages/profile/profile'
	})
}

// 连接线样式处理已移至 HexagonNode 组件中

// 页面加载时的初始化
onMounted(() => {
	// 可以在这里加载用户的进度数据
	console.log('六边形地图初始化完成')
})
</script>

<style lang="scss" scoped>
.hexagon-map-container {
	width: 100vw;
	height: 100vh;
	background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
	position: relative;
	overflow: hidden;
}

// 目标卡片
.goal-card {
	position: absolute;
	top: 60rpx;
	left: 30rpx;
	right: 30rpx;
	background: linear-gradient(135deg, #FFD54F 0%, #FFC107 100%);
	border-radius: 32rpx;
	padding: 30rpx;
	box-shadow: 0 8rpx 32rpx rgba(255, 193, 7, 0.3);
	z-index: 100;
}

.goal-header {
	display: flex;
	align-items: center;
	justify-content: space-between;
}

.goal-icon {
	font-size: 36rpx;
	margin-right: 20rpx;
}

.goal-info {
	flex: 1;
	
	.goal-label {
		display: block;
		font-size: 24rpx;
		color: rgba(0, 0, 0, 0.7);
		margin-bottom: 8rpx;
	}
	
	.goal-title {
		display: block;
		font-size: 32rpx;
		font-weight: bold;
		color: #333;
	}
}

.goal-progress {
	text-align: center;
	margin: 0 20rpx;
	
	.progress-label {
		display: block;
		font-size: 22rpx;
		color: rgba(0, 0, 0, 0.7);
		margin-bottom: 8rpx;
	}
	
	.progress-days {
		display: block;
		font-size: 36rpx;
		font-weight: bold;
		color: #333;
	}
}

.goal-mascot {
	width: 80rpx;
	height: 80rpx;
	
	.mascot-image {
		width: 100%;
		height: 100%;
	}
}

// 六边形网格
.hexagon-grid {
	position: absolute;
	top: 200rpx;
	left: 0;
	right: 0;
	bottom: 200rpx;
	transition: transform 0.3s ease;
}

.hex-row {
	position: absolute;
}

.hex-bg {
	position: absolute;
	background: rgba(255, 255, 255, 0.1);
	clip-path: polygon(30% 0%, 70% 0%, 100% 50%, 70% 100%, 30% 100%, 0% 50%);
	border: 1px solid rgba(255, 255, 255, 0.2);
}

// 六边形节点样式已移至 HexagonNode 组件中

// 底部区域
.bottom-section {
	position: absolute;
	bottom: 160rpx;
	left: 30rpx;
	right: 30rpx;
	display: flex;
	align-items: center;
	justify-content: space-between;
}

.main-character {
	position: relative;
	cursor: pointer;
	
	.main-character-image {
		width: 120rpx;
		height: 120rpx;
	}
	
	.character-badge {
		position: absolute;
		top: -10rpx;
		right: -10rpx;
		background: #FF3B30;
		color: white;
		width: 40rpx;
		height: 40rpx;
		border-radius: 50%;
		display: flex;
		align-items: center;
		justify-content: center;
		font-size: 24rpx;
		font-weight: bold;
	}
}

.quick-actions {
	display: flex;
	gap: 20rpx;
}

.action-btn {
	width: 80rpx;
	height: 80rpx;
	border-radius: 20rpx;
	display: flex;
	align-items: center;
	justify-content: center;
	cursor: pointer;
	transition: all 0.3s ease;
	
	&:active {
		transform: scale(0.95);
	}
	
	.action-icon {
		font-size: 36rpx;
	}
}

.action-bookmark {
	background: linear-gradient(135deg, #FF6B9D 0%, #E91E63 100%);
}

.action-emotion {
	background: linear-gradient(135deg, #64B5F6 0%, #2196F3 100%);
}

.action-time {
	background: linear-gradient(135deg, #FFB74D 0%, #FF9800 100%);
}

// 任务进度浮窗
.task-progress-popup {
	position: absolute;
	top: 50%;
	right: 30rpx;
	background: rgba(255, 152, 0, 0.9);
	color: white;
	padding: 16rpx 24rpx;
	border-radius: 20rpx;
	font-size: 24rpx;
	font-weight: bold;
}

// 聊天输入框
.chat-input-container {
	position: absolute;
	bottom: 40rpx;
	left: 30rpx;
	right: 30rpx;
	display: flex;
	align-items: center;
	background: white;
	border-radius: 50rpx;
	padding: 10rpx 20rpx;
	box-shadow: 0 4rpx 16rpx rgba(0, 0, 0, 0.1);
}

.chat-input {
	flex: 1;
	border: none;
	outline: none;
	font-size: 28rpx;
	padding: 20rpx;
	background: transparent;
}

.voice-btn {
	width: 80rpx;
	height: 80rpx;
	background: linear-gradient(135deg, #FF9500 0%, #FF6B00 100%);
	border-radius: 50%;
	display: flex;
	align-items: center;
	justify-content: center;
	cursor: pointer;
	
	.voice-icon {
		font-size: 32rpx;
		color: white;
	}
}

// 用户按钮
.user-btn {
	position: absolute;
	top: 240rpx;
	right: 30rpx;
	width: 80rpx;
	height: 80rpx;
	background: linear-gradient(135deg, #FF9500 0%, #FF6B00 100%);
	border-radius: 20rpx;
	display: flex;
	align-items: center;
	justify-content: center;
	cursor: pointer;
	
	.user-icon {
		font-size: 32rpx;
		color: white;
	}
}
</style>
