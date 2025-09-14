/**
 * Cocos游戏配置文件
 * 管理所有游戏的配置信息、URL、参数等
 */

// 游戏服务器配置
export const SERVER_CONFIG = {
	// 开发环境
	development: {
		baseUrl: 'http://localhost:8080',
		apiUrl: 'http://localhost:3000/api',
		wsUrl: 'ws://localhost:3001'
	},
	// 测试环境
	testing: {
		baseUrl: 'https://test-games.your-domain.com',
		apiUrl: 'https://test-api.your-domain.com/api',
		wsUrl: 'wss://test-ws.your-domain.com'
	},
	// 生产环境
	production: {
		baseUrl: 'https://games.your-domain.com',
		apiUrl: 'https://api.your-domain.com/api',
		wsUrl: 'wss://ws.your-domain.com'
	}
}

// 获取当前环境配置
export const getCurrentConfig = () => {
	const env = process.env.NODE_ENV || 'development'
	return SERVER_CONFIG[env] || SERVER_CONFIG.development
}

// 游戏类型配置
export const GAME_TYPES = {
	PUZZLE: 'puzzle',
	ADVENTURE: 'adventure',
	ACTION: 'action',
	CARD: 'card',
	RPG: 'rpg',
	STRATEGY: 'strategy',
	RACING: 'racing',
	SHOOTING: 'shooting'
}

// 游戏配置信息
export const GAMES_CONFIG = {
	[GAME_TYPES.PUZZLE]: {
		name: '智力拼图',
		path: '/games/puzzle/index.html',
		version: '1.2.0',
		minCocosVersion: '3.6.0',
		supportedPlatforms: ['mp-weixin', 'mp-alipay', 'mp-baidu', 'h5'],
		requirements: {
			memory: '256MB',
			storage: '50MB',
			network: true
		},
		features: ['offline', 'save', 'leaderboard'],
		settings: {
			autoSave: true,
			soundEnabled: true,
			musicEnabled: true,
			vibrationEnabled: true,
			difficulty: 'normal'
		},
		assets: {
			preload: [
				'textures/puzzle-pieces.png',
				'sounds/puzzle-complete.mp3',
				'sounds/piece-place.mp3'
			],
			lazy: [
				'textures/backgrounds/',
				'sounds/ambient/'
			]
		}
	},

	[GAME_TYPES.ADVENTURE]: {
		name: '冒险之旅',
		path: '/games/adventure/index.html',
		version: '2.1.0',
		minCocosVersion: '3.7.0',
		supportedPlatforms: ['mp-weixin', 'mp-alipay', 'h5'],
		requirements: {
			memory: '512MB',
			storage: '200MB',
			network: true
		},
		features: ['multiplayer', 'save', 'achievements', 'inventory'],
		settings: {
			autoSave: true,
			soundEnabled: true,
			musicEnabled: true,
			vibrationEnabled: true,
			difficulty: 'normal',
			graphics: 'medium'
		},
		assets: {
			preload: [
				'textures/character-sprites.png',
				'textures/ui-elements.png',
				'sounds/footsteps.mp3'
			],
			lazy: [
				'textures/environments/',
				'sounds/music/',
				'data/levels/'
			]
		}
	},

	[GAME_TYPES.ACTION]: {
		name: '动作英雄',
		path: '/games/action/index.html',
		version: '1.8.0',
		minCocosVersion: '3.6.0',
		supportedPlatforms: ['mp-weixin', 'mp-qq', 'h5'],
		requirements: {
			memory: '384MB',
			storage: '120MB',
			network: false
		},
		features: ['offline', 'leaderboard', 'achievements'],
		settings: {
			autoSave: true,
			soundEnabled: true,
			musicEnabled: true,
			vibrationEnabled: true,
			difficulty: 'hard',
			controls: 'touch'
		},
		assets: {
			preload: [
				'textures/hero-animations.png',
				'textures/enemies.png',
				'sounds/combat.mp3'
			],
			lazy: [
				'textures/effects/',
				'sounds/ambient/'
			]
		}
	},

	[GAME_TYPES.CARD]: {
		name: '策略卡牌',
		path: '/games/card/index.html',
		version: '1.5.0',
		minCocosVersion: '3.6.0',
		supportedPlatforms: ['mp-weixin', 'mp-alipay', 'mp-baidu', 'h5'],
		requirements: {
			memory: '256MB',
			storage: '80MB',
			network: true
		},
		features: ['multiplayer', 'collection', 'trading', 'tournaments'],
		settings: {
			autoSave: true,
			soundEnabled: true,
			musicEnabled: true,
			vibrationEnabled: false,
			difficulty: 'normal',
			animations: 'full'
		},
		assets: {
			preload: [
				'textures/cards.png',
				'textures/board.png',
				'sounds/card-flip.mp3'
			],
			lazy: [
				'textures/card-arts/',
				'sounds/music/'
			]
		}
	},

	[GAME_TYPES.RPG]: {
		name: '角色扮演',
		path: '/games/rpg/index.html',
		version: '3.0.0',
		minCocosVersion: '3.8.0',
		supportedPlatforms: ['mp-weixin', 'h5'],
		requirements: {
			memory: '1GB',
			storage: '500MB',
			network: true
		},
		features: ['multiplayer', 'save', 'achievements', 'inventory', 'crafting', 'quests'],
		settings: {
			autoSave: true,
			soundEnabled: true,
			musicEnabled: true,
			vibrationEnabled: true,
			difficulty: 'normal',
			graphics: 'high',
			autoPlay: false
		},
		assets: {
			preload: [
				'textures/character-base.png',
				'textures/ui-rpg.png',
				'sounds/menu.mp3'
			],
			lazy: [
				'textures/world/',
				'textures/characters/',
				'sounds/music/',
				'data/quests/',
				'data/items/'
			]
		}
	}
}

// 平台兼容性配置
export const PLATFORM_CONFIG = {
	'mp-weixin': {
		name: '微信小程序',
		webviewSupported: true,
		canvasSupported: true,
		audioSupported: true,
		vibrationSupported: true,
		storageLimit: '10MB',
		networkRequired: true,
		limitations: [
			'webview域名需要配置',
			'不支持WebGL2',
			'音频格式有限制'
		]
	},
	'mp-alipay': {
		name: '支付宝小程序',
		webviewSupported: true,
		canvasSupported: true,
		audioSupported: true,
		vibrationSupported: true,
		storageLimit: '10MB',
		networkRequired: true,
		limitations: [
			'webview域名需要配置',
			'API差异较大'
		]
	},
	'mp-baidu': {
		name: '百度小程序',
		webviewSupported: true,
		canvasSupported: true,
		audioSupported: true,
		vibrationSupported: true,
		storageLimit: '10MB',
		networkRequired: true,
		limitations: [
			'性能相对较弱',
			'兼容性问题较多'
		]
	},
	'mp-toutiao': {
		name: '抖音小程序',
		webviewSupported: true,
		canvasSupported: true,
		audioSupported: true,
		vibrationSupported: true,
		storageLimit: '10MB',
		networkRequired: true,
		limitations: [
			'新平台，功能有限',
			'文档不够完善'
		]
	},
	'h5': {
		name: 'H5',
		webviewSupported: true,
		canvasSupported: true,
		audioSupported: true,
		vibrationSupported: true,
		storageLimit: '50MB',
		networkRequired: false,
		limitations: []
	}
}

// 游戏通信协议
export const MESSAGE_TYPES = {
	// 游戏生命周期
	GAME_INIT: 'gameInit',
	GAME_START: 'gameStart',
	GAME_PAUSE: 'gamePause',
	GAME_RESUME: 'gameResume',
	GAME_END: 'gameEnd',
	GAME_RESTART: 'gameRestart',
	
	// 数据更新
	SCORE_UPDATE: 'scoreUpdate',
	LEVEL_UPDATE: 'levelUpdate',
	PROGRESS_UPDATE: 'progressUpdate',
	ACHIEVEMENT_UNLOCK: 'achievementUnlock',
	
	// 用户操作
	USER_ACTION: 'userAction',
	SETTINGS_UPDATE: 'settingsUpdate',
	SAVE_GAME: 'saveGame',
	LOAD_GAME: 'loadGame',
	
	// 系统事件
	ERROR_OCCURRED: 'errorOccurred',
	NETWORK_STATUS: 'networkStatus',
	PERFORMANCE_WARNING: 'performanceWarning'
}

// 默认游戏设置
export const DEFAULT_SETTINGS = {
	sound: true,
	music: true,
	vibration: true,
	difficulty: 'normal',
	graphics: 'medium',
	autoSave: true,
	notifications: true,
	analytics: true
}

// 性能配置
export const PERFORMANCE_CONFIG = {
	// 低端设备配置
	low: {
		maxTextures: 50,
		maxSounds: 10,
		particleLimit: 100,
		frameRate: 30,
		renderQuality: 0.8
	},
	// 中端设备配置
	medium: {
		maxTextures: 100,
		maxSounds: 20,
		particleLimit: 200,
		frameRate: 60,
		renderQuality: 1.0
	},
	// 高端设备配置
	high: {
		maxTextures: 200,
		maxSounds: 30,
		particleLimit: 500,
		frameRate: 60,
		renderQuality: 1.2
	}
}

// 错误码配置
export const ERROR_CODES = {
	GAME_LOAD_FAILED: 1001,
	NETWORK_ERROR: 1002,
	STORAGE_FULL: 1003,
	INCOMPATIBLE_DEVICE: 1004,
	PERMISSION_DENIED: 1005,
	GAME_CRASH: 1006,
	SAVE_FAILED: 1007,
	LOAD_FAILED: 1008
}

// 工具函数
export const GameConfigUtils = {
	/**
	 * 获取游戏完整URL
	 */
	getGameUrl(gameType, params = {}) {
		const config = getCurrentConfig()
		const gameConfig = GAMES_CONFIG[gameType]
		
		if (!gameConfig) {
			throw new Error(`未知的游戏类型: ${gameType}`)
		}
		
		const queryParams = new URLSearchParams({
			version: gameConfig.version,
			platform: this.getCurrentPlatform(),
			...params
		}).toString()
		
		return `${config.baseUrl}${gameConfig.path}?${queryParams}`
	},

	/**
	 * 获取当前平台
	 */
	getCurrentPlatform() {
		// #ifdef MP-WEIXIN
		return 'mp-weixin'
		// #endif
		// #ifdef MP-ALIPAY
		return 'mp-alipay'
		// #endif
		// #ifdef MP-BAIDU
		return 'mp-baidu'
		// #endif
		// #ifdef MP-TOUTIAO
		return 'mp-toutiao'
		// #endif
		// #ifdef H5
		return 'h5'
		// #endif
		return 'unknown'
	},

	/**
	 * 检查游戏是否支持当前平台
	 */
	isGameSupported(gameType) {
		const gameConfig = GAMES_CONFIG[gameType]
		const currentPlatform = this.getCurrentPlatform()
		
		return gameConfig && gameConfig.supportedPlatforms.includes(currentPlatform)
	},

	/**
	 * 获取平台限制信息
	 */
	getPlatformLimitations(platform) {
		return PLATFORM_CONFIG[platform]?.limitations || []
	},

	/**
	 * 根据设备性能获取配置
	 */
	getPerformanceConfig() {
		const systemInfo = uni.getSystemInfoSync()
		const memory = systemInfo.memSize || 2048 // 默认2GB
		
		if (memory < 2048) return PERFORMANCE_CONFIG.low
		if (memory < 4096) return PERFORMANCE_CONFIG.medium
		return PERFORMANCE_CONFIG.high
	}
}

export default {
	SERVER_CONFIG,
	getCurrentConfig,
	GAME_TYPES,
	GAMES_CONFIG,
	PLATFORM_CONFIG,
	MESSAGE_TYPES,
	DEFAULT_SETTINGS,
	PERFORMANCE_CONFIG,
	ERROR_CODES,
	GameConfigUtils
}
