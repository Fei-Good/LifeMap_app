<template>
	<view class="hexagon-map-container">
		<!-- 游戏背景 -->
		<image 
			class="background-layer" 
			src="/textures/地图功能/背景色.png" 
			mode="scaleToFill"
		/>
		<image 
			class="grid-overlay" 
			src="/textures/地图功能/背景网格.png" 
			mode="repeat"
		/>

		<!-- 顶部目标栏 -->
		<view class="top-goal-bar">
			<image 
				class="goal-bar-background" 
				src="/textures/地图功能/目标栏.png" 
				mode="scaleToFill"
			/>
			<view class="goal-content">
				<view class="goal-text">
					<text class="goal-title">{{ currentGoal.title }}</text>
					<text class="goal-subtitle">{{ currentGoal.subtitle }}</text>
				</view>
				<view class="goal-progress-section">
					<image 
						class="goal-spark" 
						src="/textures/地图功能/目标火花.png" 
						mode="aspectFit"
					/>
					<text class="progress-text">{{ currentGoal.progress }}%</text>
				</view>
			</view>
		</view>

		<!-- 右侧功能按钮组 -->
		<view class="right-buttons">
			<!-- 待办任务 -->
			<view class="function-button" @click="openTodoList">
				<image 
					class="button-icon" 
					src="/textures/待办任务/待办任务按钮.png" 
					mode="aspectFit"
				/>
			</view>
			
			<!-- 匹配功能 -->
			<view class="function-button" @click="openMatchDialog">
				<image 
					class="button-icon" 
					src="/textures/匹配功能/匹配按钮.png" 
					mode="aspectFit"
				/>
			</view>
		</view>

		<!-- 六边形蜂巢地图 -->
		<scroll-view class="map-main-area" scroll-y="true" :show-scrollbar="false">
			<view class="hexagon-grid" :style="{ transform: `scale(${mapScale}) translate(${mapOffsetX}px, ${mapOffsetY}px)` }">
				<!-- 背景六边形网格 -->
				<view 
					v-for="(row, rowIndex) in hexagonGrid" 
					:key="`bg-row-${rowIndex}`"
					class="hex-row"
					:style="{ 
						left: 40 + 'px',
						top: 40 + rowIndex * (160 + 50) + 'px'
					}"
				>
					<view 
						v-for="(hex, colIndex) in row" 
						:key="`bg-hex-${rowIndex}-${colIndex}`"
						class="hex-bg"
						:style="{ 
							left: colIndex * (160 + 50) + 'px',
							width: 160 + 'px',
							height: 160 + 'px'
						}"
					>
						<!-- 使用 textures 中的格子背景 -->
						<image 
							class="hex-cell-bg" 
							:src="getHexCellBackground(rowIndex, colIndex)" 
							mode="scaleToFill"
						/>
					</view>
				</view>

				<!-- DouDou 主角 -->
				<view class="player-character" :style="getPlayerStyle()">
					<image 
						class="player-sprite" 
						src="/textures/地图功能/doudou.png" 
						mode="aspectFit"
					/>
				</view>

				<!-- 连接路径 -->
				<view 
					v-for="(path, index) in connectionPaths" 
					:key="'path-' + index"
					class="connection-path"
					:style="path.style"
				>
					<image 
						class="path-sprite" 
						src="/textures/地图功能/主角路径.png" 
						mode="scaleToFill"
					/>
				</view>

				<!-- 好友角色 -->
				<view 
					v-for="friend in visibleFriends" 
					:key="friend.id"
					class="friend-character"
					:style="getFriendStyle(friend)"
				>
					<image 
						class="friend-sprite" 
						src="/textures/地图功能/好友（后续可能替换）.png" 
						mode="aspectFit"
					/>
					<text class="friend-label">{{ friend.name }}</text>
				</view>

				<!-- 活跃的六边形节点 -->
				<HexagonNode
					v-for="node in mapNodes"
					:key="node.id"
					:type="node.type"
					:size="hexSize"
					:x="getNodePosition(node).x"
					:y="getNodePosition(node).y"
					:icon="node.icon"
					:label="node.label"
					:completed="node.completed"
					:current="node.current"
					:locked="node.locked"
					@click="handleNodeClick"
				/>
			</view>
		</scroll-view>

		<!-- 底部交互面板 -->
		<view class="bottom-panel" :class="{ 'panel-expanded': isPanelExpanded }">
			<!-- 面板背景 -->
			<image 
				class="panel-background" 
				:src="isPanelExpanded ? 
					'/textures/对话框（展开）/聊天框背景板（展开状态）.png' : 
					'/textures/底部对话框/聊天框背景板（默认状态）.png'" 
				mode="scaleToFill"
			/>
			
			<!-- DouDou 头像 -->
			<view class="doudou-avatar-container" @click="togglePanel">
				<image 
					class="doudou-avatar" 
					src="/textures/底部对话框/DOUDOU形象（后续会有点击交互功能 这块逻辑可以之后再写）.png" 
					mode="aspectFit"
				/>
			</view>

			<!-- 默认状态内容 -->
			<view v-if="!isPanelExpanded" class="default-content">
				<view class="message-area">
					<text class="current-message">{{ currentMessage }}</text>
				</view>
				<view class="input-area">
					<image 
						class="voice-button" 
						src="/textures/底部对话框/语音按钮.png" 
						mode="aspectFit"
						@click="startVoiceInput"
					/>
					<view class="text-input-container">
						<image 
							class="input-background" 
							src="/textures/底部对话框/输入框.png" 
							mode="scaleToFill"
						/>
						<input 
							class="message-input" 
							placeholder="输入消息..."
							v-model="inputMessage"
							@confirm="sendMessage"
						/>
					</view>
				</view>
			</view>

			<!-- 展开状态内容 -->
			<view v-if="isPanelExpanded" class="expanded-content">
				<!-- 问候语区域 -->
				<view class="greeting-area">
					<image 
						class="greeting-background" 
						src="/textures/对话框（展开）/开场提示语（后续增加基于不同时段提供不同提示语的逻辑）.png" 
						mode="scaleToFill"
					/>
					<text class="greeting-message">{{ greetingText }}</text>
				</view>

				<!-- 任务选择区域 -->
				<view class="tasks-area">
					<view 
						v-for="(task, index) in dailyTasks" 
						:key="task.id"
						class="task-item"
						:class="{ 'task-selected': selectedTaskId === task.id }"
						@click="selectTask(task.id)"
					>
						<image 
							class="task-background" 
							:src="getTaskBackgroundImage(task.id, index)" 
							mode="scaleToFill"
						/>
						<image 
							class="task-type-icon" 
							:src="getTaskTypeIcon(index)" 
							mode="aspectFit"
						/>
						<text class="task-title">{{ task.title }}</text>
					</view>
				</view>

				<!-- 任务详情区域 -->
				<view v-if="selectedTask" class="task-detail-area">
					<image 
						class="detail-background" 
						src="/textures/底部对话框/任务详情.png" 
						mode="scaleToFill"
					/>
					<view class="detail-content">
						<text class="detail-title">{{ selectedTask.title }}</text>
						<text class="detail-description">{{ selectedTask.description }}</text>
						<view class="action-buttons">
							<view class="action-button" @click="completeTask">
								<image 
									class="complete-button" 
									src="/textures/底部对话框/完成按钮.png" 
									mode="aspectFit"
								/>
							</view>
							<view class="action-button" @click="abandonTask">
								<image 
									class="abandon-button" 
									src="/textures/底部对话框/放弃按钮.png" 
									mode="aspectFit"
								/>
							</view>
						</view>
					</view>
				</view>

				<!-- 功能标签 -->
				<view class="tags-area">
					<image 
						class="tag-button" 
						src="/textures/底部对话框/标签1.png" 
						mode="aspectFit"
						@click="handleTag(1)"
					/>
					<image 
						class="tag-button" 
						src="/textures/底部对话框/标签2.png" 
						mode="aspectFit"
						@click="handleTag(2)"
					/>
					<image 
						class="tag-button" 
						src="/textures/底部对话框/标签3.png" 
						mode="aspectFit"
						@click="handleTag(3)"
					/>
				</view>
			</view>
		</view>

		<!-- 匹配弹窗 -->
		<view class="match-popup" v-if="showMatchPopup" @click="closeMatchPopup">
			<view class="popup-content" @click.stop>
				<image 
					class="popup-background" 
					src="/textures/匹配功能/弹窗.png" 
					mode="scaleToFill"
				/>
				<view class="popup-body">
					<text class="popup-title">寻找成长伙伴</text>
					<text class="popup-message">正在为你匹配志同道合的朋友...</text>
					<view class="match-progress">
						<view class="progress-bar" :style="{ width: matchProgress + '%' }"></view>
					</view>
					<text class="progress-label">{{ matchProgress }}%</text>
				</view>
			</view>
		</view>
	</view>
</template>

<script setup>
import { ref, reactive, computed, onMounted } from 'vue'
import HexagonNode from '@/components/HexagonNode.vue'

// 六边形尺寸和网格配置
const hexSize = ref(160)  // 从80增加到160，与life-journey页面保持一致
const mapScale = ref(1)
const mapOffsetX = ref(0)
const mapOffsetY = ref(50)

// 响应式数据
const isPanelExpanded = ref(false)
const inputMessage = ref('')
const chatMessage = ref('')
const selectedTaskId = ref(null)
const showMatchPopup = ref(false)
const matchProgress = ref(0)

// 当前目标
const currentGoal = ref({
	title: '成为更好的自己',
	subtitle: '人生成长之旅',
	progress: 65
})

// 当前消息
const currentMessage = ref('你好！我是DouDou，今天想要完成什么任务呢？')

// 问候语
const greetingText = ref('早上好！新的一天开始了，让我们一起制定今天的成长计划吧！')

// 每日任务
const dailyTasks = ref([
	{ id: 'task1', title: '学习新技能', description: '今天学习一个新的技能或知识点，提升自己的能力。' },
	{ id: 'task2', title: '运动健身', description: '进行30分钟的运动，保持身体健康。' },
	{ id: 'task3', title: '社交互动', description: '与朋友或家人进行有意义的交流。' }
])

// 好友数据
const visibleFriends = ref([
	{ id: 'friend1', name: '小明', gridPos: { row: 0, col: 1.5 } },
	{ id: 'friend2', name: '小红', gridPos: { row: 1.5, col: 2 } }
])

// 连接路径
const connectionPaths = ref([
	{ style: { left: '180rpx', top: '180rpx', width: '120rpx', height: '20rpx', transform: 'rotate(0deg)' } },
	{ style: { left: '300rpx', top: '180rpx', width: '120rpx', height: '20rpx', transform: 'rotate(0deg)' } },
	{ style: { left: '120rpx', top: '240rpx', width: '20rpx', height: '120rpx', transform: 'rotate(90deg)' } },
	{ style: { left: '240rpx', top: '300rpx', width: '120rpx', height: '20rpx', transform: 'rotate(0deg)' } }
])

// 快捷操作按钮
const quickActions = ref([
	{ id: 'bookmark', type: 'bookmark', icon: '🔖' },
	{ id: 'happy', type: 'emotion', icon: '😊' },
	{ id: 'clock1', type: 'time', icon: '🕒' },
	{ id: 'clock2', type: 'time', icon: '🕒' }
])

// 六边形背景网格 - 3x3网格
const hexagonGrid = ref(Array.from({ length: 3 }, () => Array(3).fill(null)))

// 地图节点数据 - 使用整齐的3x3网格布局
const mapNodes = ref([
	// 第一行
	{
		id: 'birth',
		type: 'start',
		gridPos: { row: 0, col: 0 },
		icon: '👶',
		label: '新生',
		completed: true
	},
	{
		id: 'childhood',
		type: 'milestone',
		gridPos: { row: 0, col: 1 },
		icon: '🧒',
		label: '童年',
		completed: true
	},
	{
		id: 'adolescence',
		type: 'milestone',
		gridPos: { row: 0, col: 2 },
		icon: '🎓',
		label: '青春期',
		completed: true
	},
	
	// 第二行
	{
		id: 'young-adult',
		type: 'current',
		gridPos: { row: 1, col: 0 },
		icon: '💼',
		label: '青年',
		current: true
	},
	{
		id: 'love',
		type: 'task',
		gridPos: { row: 1, col: 1 },
		icon: '💕',
		label: '恋爱'
	},
	{
		id: 'marriage',
		type: 'task',
		gridPos: { row: 1, col: 2 },
		icon: '💒',
		label: '结婚'
	},
	
	// 第三行
	{
		id: 'parenting',
		type: 'future',
		gridPos: { row: 2, col: 0 },
		icon: '👨‍👩‍👧‍👦',
		label: '育儿',
		locked: true
	},
	{
		id: 'career',
		type: 'future',
		gridPos: { row: 2, col: 1 },
		icon: '🏆',
		label: '事业',
		locked: true
	},
	{
		id: 'retirement',
		type: 'future',
		gridPos: { row: 2, col: 2 },
		icon: '🏖️',
		label: '退休',
		locked: true
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

// 计算属性
const selectedTask = computed(() => {
	return dailyTasks.value.find(task => task.id === selectedTaskId.value)
})

// 获取六边形格子背景
const getHexCellBackground = (rowIndex, colIndex) => {
	// 根据网格位置找到对应的节点
	const node = mapNodes.value.find(n => 
		n.gridPos.row === rowIndex && n.gridPos.col === colIndex
	)
	
	if (node) {
		if (node.completed) return '/textures/地图功能/绿色格子.png'
		if (node.current) return '/textures/地图功能/蓝色格子.png'
		if (node.locked) return '/textures/地图功能/背景网格.png'
		return '/textures/地图功能/粉色格子.png'
	}
	
	return '/textures/地图功能/背景网格.png'
}

// 获取主角位置
const getPlayerStyle = () => {
	const currentStage = mapNodes.value.find(node => node.current)
	if (currentStage) {
		const position = getNodePosition(currentStage)
		return {
			left: (position.x + 30) + 'rpx',  // 在节点右侧
			top: (position.y - 20) + 'rpx'    // 在节点上方
		}
	}
	return { left: '200rpx', top: '200rpx' }
}

// 获取节点位置 - 基于网格位置计算实际坐标
const getNodePosition = (node) => {
	const cellSize = 160  // 与hexSize保持一致
	const gap = 50        // 间距
	const startX = 40     // 起始X坐标
	const startY = 40     // 起始Y坐标
	
	return {
		x: startX + (cellSize + gap) * node.gridPos.col,
		y: startY + (cellSize + gap) * node.gridPos.row
	}
}

// 获取好友位置
const getFriendStyle = (friend) => {
	const cellSize = 120
	const gap = 40
	const startX = 60
	const startY = 60
	
	return {
		left: (startX + (cellSize + gap) * friend.gridPos.col) + 'rpx',
		top: (startY + (cellSize + gap) * friend.gridPos.row) + 'rpx'
	}
}

// 获取任务背景图片
const getTaskBackgroundImage = (taskId, index) => {
	const isSelected = selectedTaskId.value === taskId
	return isSelected 
		? `/textures/底部对话框/任务${index + 1}（选中）.png`
		: `/textures/底部对话框/任务${index + 1}（默认）.png`
}

// 获取任务类型图标
const getTaskTypeIcon = (index) => {
	return `/textures/对话框（展开）/任务类型${index + 1}.png`
}

// 切换面板
const togglePanel = () => {
	isPanelExpanded.value = !isPanelExpanded.value
}

// 选择任务
const selectTask = (taskId) => {
	selectedTaskId.value = selectedTaskId.value === taskId ? null : taskId
}

// 完成任务
const completeTask = () => {
	if (selectedTask.value) {
		uni.showToast({
			title: '任务完成！',
			icon: 'success'
		})
		selectedTaskId.value = null
	}
}

// 放弃任务
const abandonTask = () => {
	selectedTaskId.value = null
}

// 发送消息
const sendMessage = () => {
	if (inputMessage.value.trim()) {
		console.log('发送消息:', inputMessage.value)
		inputMessage.value = ''
	}
}

// 语音输入
const startVoiceInput = () => {
	uni.showToast({
		title: '语音功能开发中',
		icon: 'none'
	})
}

// 处理标签
const handleTag = (tagNumber) => {
	console.log('点击标签:', tagNumber)
}

// 打开待办列表
const openTodoList = () => {
	uni.navigateTo({
		url: '/pages/task/task'
	})
}

// 打开匹配对话框
const openMatchDialog = () => {
	showMatchPopup.value = true
	matchProgress.value = 0
	
	// 模拟匹配进度
	const interval = setInterval(() => {
		matchProgress.value += 15
		if (matchProgress.value >= 100) {
			clearInterval(interval)
			setTimeout(() => {
				showMatchPopup.value = false
				matchProgress.value = 0
				uni.showToast({
					title: '匹配成功！',
					icon: 'success'
				})
			}, 500)
		}
	}, 300)
}

// 关闭匹配弹窗
const closeMatchPopup = () => {
	showMatchPopup.value = false
	matchProgress.value = 0
}

// 打开聊天
const openChat = () => {
	uni.navigateTo({
		url: '/pages/chat/chat'
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
	position: relative;
	overflow: hidden;
	background: #f0f0f0;
}

/* 背景层 */
.background-layer {
	position: absolute;
	top: 0;
	left: 0;
	width: 100%;
	height: 100%;
	z-index: 1;
}

.grid-overlay {
	position: absolute;
	top: 0;
	left: 0;
	width: 100%;
	height: 100%;
	z-index: 2;
	opacity: 0.3;
}

/* 顶部目标栏 */
.top-goal-bar {
	position: absolute;
	top: 40rpx;
	left: 30rpx;
	right: 30rpx;
	height: 120rpx;
	z-index: 100;
}

.goal-bar-background {
	position: absolute;
	width: 100%;
	height: 100%;
}

.goal-content {
	position: absolute;
	top: 0;
	left: 0;
	right: 0;
	bottom: 0;
	display: flex;
	align-items: center;
	justify-content: space-between;
	padding: 0 40rpx;
}

.goal-text {
	flex: 1;
	
	.goal-title {
		display: block;
		font-size: 32rpx;
		font-weight: bold;
		color: #333;
		margin-bottom: 8rpx;
	}
	
	.goal-subtitle {
		display: block;
		font-size: 24rpx;
		color: rgba(0, 0, 0, 0.7);
	}
}

.goal-progress-section {
	display: flex;
	align-items: center;
	gap: 16rpx;
	
	.goal-spark {
		width: 40rpx;
		height: 40rpx;
	}
	
	.progress-text {
		font-size: 28rpx;
		font-weight: bold;
		color: #FF6B35;
	}
}

/* 右侧功能按钮组 */
.right-buttons {
	position: absolute;
	top: 200rpx;
	right: 30rpx;
	display: flex;
	flex-direction: column;
	gap: 20rpx;
	z-index: 100;
}

.function-button {
	width: 80rpx;
	height: 80rpx;
	
	.button-icon {
		width: 100%;
		height: 100%;
	}
}

/* 地图主区域 */
.map-main-area {
	position: absolute;
	top: 180rpx;
	left: 0;
	right: 0;
	bottom: 300rpx;
	z-index: 10;
}

.hexagon-grid {
	position: relative;
	width: 100%;
	min-height: 800rpx;
	transition: transform 0.3s ease;
}

.hex-row {
	position: absolute;
}

.hex-bg {
	position: absolute;
	
	.hex-cell-bg {
		width: 100%;
		height: 100%;
	}
}

/* 角色和路径 */
.player-character {
	position: absolute;
	z-index: 50;
	
	.player-sprite {
		width: 80rpx;
		height: 80rpx;
	}
}

.connection-path {
	position: absolute;
	z-index: 5;
	
	.path-sprite {
		width: 100%;
		height: 100%;
	}
}

.friend-character {
	position: absolute;
	z-index: 40;
	display: flex;
	flex-direction: column;
	align-items: center;
	
	.friend-sprite {
		width: 60rpx;
		height: 60rpx;
	}
	
	.friend-label {
		font-size: 20rpx;
		color: #666;
		margin-top: 8rpx;
	}
}

/* 底部交互面板 */
.bottom-panel {
	position: absolute;
	bottom: 0;
	left: 0;
	right: 0;
	height: 280rpx;
	z-index: 100;
	transition: height 0.3s ease;
	
	&.panel-expanded {
		height: 600rpx;
	}
}

.panel-background {
	position: absolute;
	width: 100%;
	height: 100%;
}

.doudou-avatar-container {
	position: absolute;
	top: -40rpx;
	left: 50%;
	transform: translateX(-50%);
	z-index: 101;
	
	.doudou-avatar {
		width: 120rpx;
		height: 120rpx;
	}
}

/* 默认状态内容 */
.default-content {
	position: absolute;
	top: 80rpx;
	left: 0;
	right: 0;
	bottom: 40rpx;
	padding: 0 40rpx;
	display: flex;
	flex-direction: column;
	gap: 30rpx;
}

.message-area {
	flex: 1;
	display: flex;
	align-items: center;
	justify-content: center;
	
	.current-message {
		font-size: 28rpx;
		color: #333;
		text-align: center;
		line-height: 1.5;
	}
}

.input-area {
	display: flex;
	align-items: center;
	gap: 20rpx;
	
	.voice-button {
		width: 60rpx;
		height: 60rpx;
	}
}

.text-input-container {
	flex: 1;
	position: relative;
	
	.input-background {
		position: absolute;
		width: 100%;
		height: 60rpx;
	}
	
	.message-input {
		position: relative;
		z-index: 1;
		width: 100%;
		height: 60rpx;
		padding: 0 20rpx;
		background: transparent;
		border: none;
		outline: none;
		font-size: 28rpx;
	}
}

/* 展开状态内容 */
.expanded-content {
	position: absolute;
	top: 80rpx;
	left: 0;
	right: 0;
	bottom: 40rpx;
	padding: 0 40rpx;
	display: flex;
	flex-direction: column;
	gap: 30rpx;
}

.greeting-area {
	position: relative;
	height: 80rpx;
	
	.greeting-background {
		position: absolute;
		width: 100%;
		height: 100%;
	}
	
	.greeting-message {
		position: absolute;
		top: 50%;
		left: 50%;
		transform: translate(-50%, -50%);
		font-size: 24rpx;
		color: #333;
		text-align: center;
	}
}

.tasks-area {
	display: flex;
	gap: 20rpx;
	justify-content: center;
}

.task-item {
	position: relative;
	width: 150rpx;
	height: 100rpx;
	
	.task-background {
		position: absolute;
		width: 100%;
		height: 100%;
	}
	
	.task-type-icon {
		position: absolute;
		top: 10rpx;
		left: 10rpx;
		width: 40rpx;
		height: 40rpx;
	}
	
	.task-title {
		position: absolute;
		bottom: 10rpx;
		left: 50%;
		transform: translateX(-50%);
		font-size: 22rpx;
		color: #333;
		text-align: center;
	}
}

.task-detail-area {
	position: relative;
	height: 120rpx;
	
	.detail-background {
		position: absolute;
		width: 100%;
		height: 100%;
	}
	
	.detail-content {
		position: absolute;
		top: 0;
		left: 0;
		right: 0;
		bottom: 0;
		padding: 20rpx;
		display: flex;
		flex-direction: column;
		justify-content: space-between;
		
		.detail-title {
			font-size: 28rpx;
			font-weight: bold;
			color: #333;
		}
		
		.detail-description {
			font-size: 24rpx;
			color: #666;
			line-height: 1.4;
		}
	}
}

.action-buttons {
	display: flex;
	gap: 20rpx;
	justify-content: center;
	
	.action-button {
		.complete-button,
		.abandon-button {
			width: 80rpx;
			height: 40rpx;
		}
	}
}

.tags-area {
	display: flex;
	gap: 15rpx;
	justify-content: center;
	
	.tag-button {
		width: 60rpx;
		height: 30rpx;
	}
}

/* 匹配弹窗 */
.match-popup {
	position: fixed;
	top: 0;
	left: 0;
	right: 0;
	bottom: 0;
	background: rgba(0, 0, 0, 0.5);
	display: flex;
	align-items: center;
	justify-content: center;
	z-index: 1000;
}

.popup-content {
	position: relative;
	width: 600rpx;
	height: 400rpx;
}

.popup-background {
	position: absolute;
	width: 100%;
	height: 100%;
}

.popup-body {
	position: absolute;
	top: 0;
	left: 0;
	right: 0;
	bottom: 0;
	display: flex;
	flex-direction: column;
	align-items: center;
	justify-content: center;
	gap: 30rpx;
	padding: 60rpx 40rpx;
	
	.popup-title {
		font-size: 36rpx;
		font-weight: bold;
		color: #333;
	}
	
	.popup-message {
		font-size: 28rpx;
		color: #666;
		text-align: center;
	}
}

.match-progress {
	width: 300rpx;
	height: 8rpx;
	background: rgba(255, 255, 255, 0.3);
	border-radius: 4rpx;
	overflow: hidden;
	
	.progress-bar {
		height: 100%;
		background: linear-gradient(90deg, #FF6B35, #F7931E);
		border-radius: 4rpx;
		transition: width 0.3s ease;
	}
}

.progress-label {
	font-size: 24rpx;
	color: #FF6B35;
	font-weight: bold;
}
</style>

