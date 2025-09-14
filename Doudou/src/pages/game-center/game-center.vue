<template>
	<view class="game-center">
		<!-- 头部 -->
		<view class="header">
			<view class="title">游戏中心</view>
			<view class="subtitle">体验精彩的Cocos游戏世界</view>
		</view>

		<!-- 游戏列表 -->
		<scroll-view class="game-list" scroll-y>
			<view 
				v-for="game in gameList" 
				:key="game.id"
				class="game-card"
				@click="startGame(game)"
			>
				<view class="game-preview">
					<image :src="game.thumbnail" class="game-thumbnail" mode="aspectFill" />
					<view v-if="game.isNew" class="new-badge">NEW</view>
					<view v-if="game.isHot" class="hot-badge">HOT</view>
				</view>
				
				<view class="game-info">
					<view class="game-name">{{ game.name }}</view>
					<view class="game-description">{{ game.description }}</view>
					<view class="game-stats">
						<text class="stat-item">⭐ {{ game.rating }}</text>
						<text class="stat-item">🎮 {{ game.playCount }}次游戏</text>
						<text class="stat-item">{{ game.difficulty }}</text>
					</view>
					<view class="game-tags">
						<text 
							v-for="tag in game.tags" 
							:key="tag" 
							class="tag"
						>{{ tag }}</text>
					</view>
				</view>
			</view>
		</scroll-view>

		<!-- 游戏统计 -->
		<view class="stats-panel">
			<view class="stats-title">我的游戏统计</view>
			<view class="stats-grid">
				<view class="stat-card">
					<view class="stat-number">{{ gameStats.totalGames }}</view>
					<view class="stat-label">总游戏次数</view>
				</view>
				<view class="stat-card">
					<view class="stat-number">{{ gameStats.bestScore }}</view>
					<view class="stat-label">最高得分</view>
				</view>
				<view class="stat-card">
					<view class="stat-number">{{ Math.floor(gameStats.totalPlayTime / 60000) }}</view>
					<view class="stat-label">游戏时长(分钟)</view>
				</view>
				<view class="stat-card">
					<view class="stat-number">{{ gameStats.favoriteGame || '-' }}</view>
					<view class="stat-label">最爱游戏</view>
				</view>
			</view>
		</view>

		<!-- 设置按钮 -->
		<view class="settings-btn" @click="openSettings">
			<text class="settings-icon">⚙️</text>
		</view>
	</view>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import gameService from '@/utils/gameService.js'

// 游戏列表
const gameList = ref([
	{
		id: 'puzzle',
		name: '智力拼图',
		description: '挑战你的逻辑思维，完成各种有趣的拼图',
		thumbnail: '/static/games/puzzle-thumb.png',
		rating: 4.8,
		playCount: 1250,
		difficulty: '简单',
		tags: ['益智', '休闲', '单人'],
		isNew: false,
		isHot: true
	},
	{
		id: 'adventure',
		name: '冒险之旅',
		description: '踏上神秘的冒险旅程，探索未知的世界',
		thumbnail: '/static/games/adventure-thumb.png',
		rating: 4.9,
		playCount: 980,
		difficulty: '中等',
		tags: ['冒险', '探索', '剧情'],
		isNew: true,
		isHot: false
	},
	{
		id: 'action',
		name: '动作英雄',
		description: '快节奏的动作游戏，考验你的反应速度',
		thumbnail: '/static/games/action-thumb.png',
		rating: 4.7,
		playCount: 2100,
		difficulty: '困难',
		tags: ['动作', '竞技', '快节奏'],
		isNew: false,
		isHot: true
	},
	{
		id: 'card',
		name: '策略卡牌',
		description: '运用策略和智慧，打造最强的卡牌组合',
		thumbnail: '/static/games/card-thumb.png',
		rating: 4.6,
		playCount: 750,
		difficulty: '中等',
		tags: ['策略', '卡牌', '收集'],
		isNew: false,
		isHot: false
	},
	{
		id: 'rpg',
		name: '角色扮演',
		description: '创造属于你的角色，体验丰富的RPG世界',
		thumbnail: '/static/games/rpg-thumb.png',
		rating: 4.9,
		playCount: 1500,
		difficulty: '困难',
		tags: ['RPG', '养成', '剧情'],
		isNew: true,
		isHot: true
	}
])

// 游戏统计
const gameStats = ref({
	totalGames: 0,
	bestScore: 0,
	totalPlayTime: 0,
	favoriteGame: null
})

// 启动游戏
const startGame = async (game) => {
	// 检查兼容性
	const compatibility = gameService.checkCompatibility()
	if (!compatibility.webviewSupported) {
		uni.showModal({
			title: '设备不支持',
			content: '当前设备不支持运行Cocos游戏',
			showCancel: false
		})
		return
	}

	// 显示兼容性建议
	if (compatibility.recommendations.length > 0) {
		uni.showModal({
			title: '温馨提示',
			content: compatibility.recommendations.join('\n'),
			confirmText: '继续游戏',
			success: (res) => {
				if (res.confirm) {
					launchGame(game)
				}
			}
		})
	} else {
		launchGame(game)
	}
}

// 启动游戏
const launchGame = async (game) => {
	uni.showLoading({ title: '启动游戏中...' })
	
	try {
		const success = await gameService.startGame(game.id, {
			gameName: game.name,
			difficulty: game.difficulty,
			tags: game.tags
		})
		
		if (!success) {
			uni.showToast({
				title: '游戏启动失败',
				icon: 'none'
			})
		}
	} catch (error) {
		console.error('启动游戏失败:', error)
		uni.showToast({
			title: '游戏启动失败',
			icon: 'none'
		})
	} finally {
		uni.hideLoading()
	}
}

// 打开设置
const openSettings = () => {
	uni.showActionSheet({
		itemList: ['游戏设置', '清除数据', '游戏历史', '关于'],
		success: (res) => {
			switch (res.tapIndex) {
				case 0:
					openGameSettings()
					break
				case 1:
					clearGameData()
					break
				case 2:
					showGameHistory()
					break
				case 3:
					showAbout()
					break
			}
		}
	})
}

// 游戏设置
const openGameSettings = () => {
	const currentSettings = gameService.gameSettings
	
	uni.showModal({
		title: '游戏设置',
		content: `音效: ${currentSettings.sound ? '开启' : '关闭'}\n音乐: ${currentSettings.music ? '开启' : '关闭'}\n震动: ${currentSettings.vibration ? '开启' : '关闭'}\n难度: ${currentSettings.difficulty}`,
		confirmText: '修改设置',
		success: (res) => {
			if (res.confirm) {
				// 这里可以跳转到详细的设置页面
				// uni.navigateTo({ url: '/pages/game-settings/game-settings' })
				uni.showToast({
					title: '设置功能开发中',
					icon: 'none'
				})
			}
		}
	})
}

// 清除游戏数据
const clearGameData = () => {
	uni.showModal({
		title: '清除数据',
		content: '确定要清除所有游戏数据吗？此操作无法恢复！',
		confirmText: '确定清除',
		confirmColor: '#ff3b30',
		success: (res) => {
			if (res.confirm) {
				const success = gameService.clearGameData()
				if (success) {
					uni.showToast({
						title: '数据已清除',
						icon: 'success'
					})
					loadGameStats()
				} else {
					uni.showToast({
						title: '清除失败',
						icon: 'none'
					})
				}
			}
		}
	})
}

// 显示游戏历史
const showGameHistory = () => {
	const history = gameService.getGameHistory(5)
	if (history.length === 0) {
		uni.showToast({
			title: '暂无游戏记录',
			icon: 'none'
		})
		return
	}
	
	const historyText = history.map((record, index) => 
		`${index + 1}. ${record.gameType || '未知游戏'} - 得分:${record.score || 0}`
	).join('\n')
	
	uni.showModal({
		title: '最近游戏记录',
		content: historyText,
		showCancel: false
	})
}

// 关于信息
const showAbout = () => {
	uni.showModal({
		title: '关于游戏中心',
		content: '基于uniapp + Cocos引擎开发\n版本: 1.0.0\n支持多平台小程序运行',
		showCancel: false
	})
}

// 加载游戏统计
const loadGameStats = () => {
	gameStats.value = gameService.getGameStats()
}

// 页面生命周期
onMounted(() => {
	loadGameStats()
})

// 页面显示时刷新统计
uni.$on('onShow', () => {
	loadGameStats()
})
</script>

<style lang="scss" scoped>
.game-center {
	min-height: 100vh;
	background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
	padding: 40rpx 30rpx;
}

.header {
	text-align: center;
	margin-bottom: 60rpx;
	
	.title {
		font-size: 48rpx;
		font-weight: bold;
		color: white;
		margin-bottom: 16rpx;
	}
	
	.subtitle {
		font-size: 28rpx;
		color: rgba(255, 255, 255, 0.8);
	}
}

.game-list {
	max-height: 800rpx;
	margin-bottom: 40rpx;
}

.game-card {
	background: rgba(255, 255, 255, 0.95);
	border-radius: 24rpx;
	margin-bottom: 30rpx;
	overflow: hidden;
	box-shadow: 0 8rpx 32rpx rgba(0, 0, 0, 0.1);
	transition: all 0.3s ease;
	
	&:active {
		transform: scale(0.98);
		box-shadow: 0 4rpx 16rpx rgba(0, 0, 0, 0.2);
	}
}

.game-preview {
	position: relative;
	height: 200rpx;
	
	.game-thumbnail {
		width: 100%;
		height: 100%;
		background: linear-gradient(45deg, #f0f0f0, #e0e0e0);
	}
	
	.new-badge, .hot-badge {
		position: absolute;
		top: 16rpx;
		right: 16rpx;
		padding: 6rpx 16rpx;
		border-radius: 12rpx;
		font-size: 20rpx;
		font-weight: bold;
		color: white;
	}
	
	.new-badge {
		background: #34c759;
	}
	
	.hot-badge {
		background: #ff3b30;
	}
}

.game-info {
	padding: 30rpx;
	
	.game-name {
		font-size: 32rpx;
		font-weight: bold;
		color: #333;
		margin-bottom: 12rpx;
	}
	
	.game-description {
		font-size: 26rpx;
		color: #666;
		margin-bottom: 20rpx;
		line-height: 1.4;
	}
	
	.game-stats {
		display: flex;
		gap: 20rpx;
		margin-bottom: 20rpx;
		
		.stat-item {
			font-size: 22rpx;
			color: #888;
		}
	}
	
	.game-tags {
		display: flex;
		gap: 12rpx;
		flex-wrap: wrap;
		
		.tag {
			background: rgba(102, 126, 234, 0.1);
			color: #667eea;
			padding: 8rpx 16rpx;
			border-radius: 16rpx;
			font-size: 22rpx;
		}
	}
}

.stats-panel {
	background: rgba(255, 255, 255, 0.95);
	border-radius: 24rpx;
	padding: 30rpx;
	margin-bottom: 40rpx;
	
	.stats-title {
		font-size: 32rpx;
		font-weight: bold;
		color: #333;
		margin-bottom: 30rpx;
		text-align: center;
	}
	
	.stats-grid {
		display: grid;
		grid-template-columns: 1fr 1fr;
		gap: 20rpx;
	}
	
	.stat-card {
		text-align: center;
		padding: 20rpx;
		background: rgba(102, 126, 234, 0.05);
		border-radius: 16rpx;
		
		.stat-number {
			font-size: 36rpx;
			font-weight: bold;
			color: #667eea;
			margin-bottom: 8rpx;
		}
		
		.stat-label {
			font-size: 24rpx;
			color: #666;
		}
	}
}

.settings-btn {
	position: fixed;
	bottom: 40rpx;
	right: 40rpx;
	width: 100rpx;
	height: 100rpx;
	background: rgba(255, 255, 255, 0.9);
	border-radius: 50%;
	display: flex;
	align-items: center;
	justify-content: center;
	box-shadow: 0 8rpx 32rpx rgba(0, 0, 0, 0.15);
	
	.settings-icon {
		font-size: 40rpx;
	}
	
	&:active {
		transform: scale(0.95);
	}
}
</style>
