<template>
	<view class="crit-page">
		<text class="title">疯狂暴击DouDou（占位页）</text>
		<text class="desc">这里是占位页面，用于保证项目可运行。后续可替换为真实功能。</text>
	</view>
</template>

<script setup>
// 保持最小实现，确保页面可被路由正常加载
</script>

<style scoped lang="scss">
.crit-page {
	min-height: 100vh;
	padding: 24rpx;
	display: flex;
	flex-direction: column;
	gap: 12rpx;
	background: #f7f7f7;
}
.title { font-size: 36rpx; font-weight: 600; color: #222; }
.desc { font-size: 28rpx; color: #666; }
</style>


