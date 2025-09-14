<template>
	<view class="game-container">
		<!-- 游戏加载状态 -->
		<view v-if="loading" class="loading-overlay">
			<view class="loading-content">
				<image src="/static/logo.png" class="loading-logo" mode="aspectFit" />
				<view class="loading-text">游戏加载中...</view>
				<view class="loading-progress">
					<view class="progress-bar" :style="{ width: loadingProgress + '%' }"></view>
				</view>
			</view>
		</view>

		<!-- Cocos游戏容器 -->
		<web-view 
			v-if="!loading && gameUrl"
			:src="gameUrl" 
			@message="onGameMessage"
			@load="onGameLoad"
			@error="onGameError"
			class="game-webview"
		></web-view>

		<!-- 游戏控制面板 -->
		<view v-if="!loading && showControls" class="game-controls">
			<button @click="pauseGame" class="control-btn pause-btn">
				{{ gamePaused ? '继续' : '暂停' }}
			</button>
			<button @click="restartGame" class="control-btn restart-btn">重新开始</button>
			<button @click="exitGame" class="control-btn exit-btn">退出游戏</button>
		</view>

		<!-- 游戏数据显示 -->
		<view v-if="gameData.score !== null" class="game-info">
			<text class="score">得分: {{ gameData.score }}</text>
			<text class="level">等级: {{ gameData.level }}</text>
		</view>
	</view>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'

// 游戏状态管理
const loading = ref(true)
const loadingProgress = ref(0)
const gameUrl = ref('')
const gamePaused = ref(false)
const showControls = ref(true)

// 游戏数据
const gameData = ref({
	score: null,
	level: 1,
	lives: 3
})

// 获取页面参数
const props = defineProps({
	gameType: {
		type: String,
		default: 'default'
	}
})

// 初始化游戏URL
const initGameUrl = () => {
	// 根据不同游戏类型设置不同的游戏URL
	const gameUrls = {
		'puzzle': '/static/games/puzzle/index.html',
		'adventure': '/static/games/adventure/index.html',
		'action': '/static/games/action/index.html',
		'default': '/static/games/default/index.html'
	}
	
	const baseUrl = process.env.NODE_ENV === 'development' 
		? 'http://localhost:8080' 
		: 'https://your-game-domain.com'
	
	gameUrl.value = baseUrl + (gameUrls[props.gameType] || gameUrls.default)
}

// 模拟加载进度
const simulateLoading = () => {
	const interval = setInterval(() => {
		loadingProgress.value += Math.random() * 15
		if (loadingProgress.value >= 100) {
			loadingProgress.value = 100
			clearInterval(interval)
			setTimeout(() => {
				loading.value = false
			}, 500)
		}
	}, 200)
}

// 游戏消息处理
const onGameMessage = (event) => {
	console.log('收到游戏消息:', event.detail.data)
	
	try {
		const data = JSON.parse(event.detail.data[0])
		
		switch (data.type) {
			case 'gameStart':
				console.log('游戏开始')
				break
			case 'gameEnd':
				handleGameEnd(data.payload)
				break
			case 'scoreUpdate':
				gameData.value.score = data.payload.score
				gameData.value.level = data.payload.level || gameData.value.level
				break
			case 'gamePause':
				gamePaused.value = data.payload.paused
				break
			default:
				console.log('未知消息类型:', data.type)
		}
	} catch (error) {
		console.error('解析游戏消息失败:', error)
	}
}

// 游戏加载完成
const onGameLoad = () => {
	console.log('游戏加载完成')
	// 向游戏发送初始化数据
	sendMessageToGame({
		type: 'init',
		payload: {
			userId: uni.getStorageSync('userId') || 'guest',
			userLevel: uni.getStorageSync('userLevel') || 1,
			settings: uni.getStorageSync('gameSettings') || {}
		}
	})
}

// 游戏加载错误
const onGameError = (error) => {
	console.error('游戏加载失败:', error)
	uni.showToast({
		title: '游戏加载失败',
		icon: 'none',
		duration: 2000
	})
	
	// 返回上一页
	setTimeout(() => {
		uni.navigateBack()
	}, 2000)
}

// 向游戏发送消息
const sendMessageToGame = (message) => {
	// 注意：小程序中web-view的消息通信有限制
	// 可能需要通过URL参数或者其他方式传递数据
	console.log('向游戏发送消息:', message)
}

// 游戏控制方法
const pauseGame = () => {
	gamePaused.value = !gamePaused.value
	sendMessageToGame({
		type: 'pause',
		payload: { paused: gamePaused.value }
	})
}

const restartGame = () => {
	uni.showModal({
		title: '确认重新开始',
		content: '重新开始将丢失当前进度，确定继续吗？',
		success: (res) => {
			if (res.confirm) {
				sendMessageToGame({
					type: 'restart'
				})
				gameData.value = {
					score: 0,
					level: 1,
					lives: 3
				}
			}
		}
	})
}

const exitGame = () => {
	uni.showModal({
		title: '确认退出',
		content: '退出游戏将丢失当前进度，确定退出吗？',
		success: (res) => {
			if (res.confirm) {
				// 保存游戏数据
				saveGameData()
				uni.navigateBack()
			}
		}
	})
}

// 处理游戏结束
const handleGameEnd = (gameResult) => {
	console.log('游戏结束:', gameResult)
	
	// 保存游戏数据
	saveGameData()
	
	// 显示游戏结果
	uni.showModal({
		title: '游戏结束',
		content: `最终得分: ${gameResult.score}\n等级: ${gameResult.level}`,
		showCancel: false,
		confirmText: '确定',
		success: () => {
			uni.navigateBack()
		}
	})
}

// 保存游戏数据
const saveGameData = () => {
	const gameRecord = {
		gameType: props.gameType,
		score: gameData.value.score,
		level: gameData.value.level,
		timestamp: Date.now()
	}
	
	// 保存到本地存储
	let gameHistory = uni.getStorageSync('gameHistory') || []
	gameHistory.push(gameRecord)
	uni.setStorageSync('gameHistory', gameHistory)
	
	// 可以调用API保存到服务器
	// apiService.saveGameRecord(gameRecord)
}

// 页面生命周期
onMounted(() => {
	initGameUrl()
	simulateLoading()
})

onUnmounted(() => {
	// 清理资源
	saveGameData()
})

// 监听页面隐藏（用户切换到其他应用）
uni.$on('onHide', () => {
	if (!gamePaused.value) {
		pauseGame()
	}
})

// 监听页面显示（用户回到应用）
uni.$on('onShow', () => {
	// 可以选择自动恢复游戏或保持暂停状态
})
</script>

<style lang="scss" scoped>
.game-container {
	width: 100vw;
	height: 100vh;
	position: relative;
	background: #000;
}

.loading-overlay {
	position: absolute;
	top: 0;
	left: 0;
	right: 0;
	bottom: 0;
	background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
	display: flex;
	align-items: center;
	justify-content: center;
	z-index: 1000;
}

.loading-content {
	text-align: center;
	color: white;
}

.loading-logo {
	width: 120rpx;
	height: 120rpx;
	margin-bottom: 40rpx;
	animation: pulse 2s ease-in-out infinite;
}

.loading-text {
	font-size: 32rpx;
	margin-bottom: 40rpx;
	font-weight: 500;
}

.loading-progress {
	width: 400rpx;
	height: 8rpx;
	background: rgba(255, 255, 255, 0.3);
	border-radius: 4rpx;
	overflow: hidden;
	margin: 0 auto;
}

.progress-bar {
	height: 100%;
	background: linear-gradient(90deg, #00f5ff, #00d4ff);
	border-radius: 4rpx;
	transition: width 0.3s ease;
}

@keyframes pulse {
	0%, 100% { transform: scale(1); opacity: 1; }
	50% { transform: scale(1.1); opacity: 0.8; }
}

.game-webview {
	width: 100%;
	height: 100%;
}

.game-controls {
	position: absolute;
	top: 20rpx;
	right: 20rpx;
	display: flex;
	flex-direction: column;
	gap: 10rpx;
	z-index: 100;
}

.control-btn {
	padding: 10rpx 20rpx;
	border-radius: 20rpx;
	border: none;
	color: white;
	font-size: 24rpx;
	min-width: 120rpx;
	opacity: 0.8;
	transition: all 0.3s ease;
}

.pause-btn {
	background: #ff9500;
}

.restart-btn {
	background: #007aff;
}

.exit-btn {
	background: #ff3b30;
}

.control-btn:active {
	opacity: 1;
	transform: scale(0.95);
}

.game-info {
	position: absolute;
	top: 20rpx;
	left: 20rpx;
	display: flex;
	flex-direction: column;
	gap: 10rpx;
	z-index: 100;
}

.score, .level {
	background: rgba(0, 0, 0, 0.7);
	color: white;
	padding: 10rpx 20rpx;
	border-radius: 20rpx;
	font-size: 24rpx;
	min-width: 120rpx;
	text-align: center;
}

.score {
	background: rgba(255, 149, 0, 0.9);
}

.level {
	background: rgba(0, 122, 255, 0.9);
}
</style>
