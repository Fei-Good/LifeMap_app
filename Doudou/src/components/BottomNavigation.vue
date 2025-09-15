<template>
	<view class="bottom-nav">
		<view class="nav-item" :class="{ active: currentPage === 'chat' }" @click="go('/pages/chat/chat')">聊天</view>
		<view class="nav-item" :class="{ active: currentPage === 'friends' }" @click="go('/pages/friends/friends')">好友</view>
		<view class="nav-item" :class="{ active: currentPage === 'report' }" @click="go('/pages/report/report')">报告</view>
	</view>
</template>

<script setup>
const props = defineProps({ currentPage: { type: String, default: '' } })
const go = (url) => {
	uni.navigateTo({ url })
}
</script>

<style scoped lang="scss">
.bottom-nav {
	position: fixed; left: 0; right: 0; bottom: 0;
	display: grid; grid-template-columns: repeat(3, 1fr);
	background: #fff; border-top: 1rpx solid #eee; height: 100rpx;
	align-items: center; text-align: center; z-index: 1000;
}
.nav-item { color: #666; font-size: 28rpx; }
.nav-item.active { color: #4CAF50; font-weight: 600; }
</style>


