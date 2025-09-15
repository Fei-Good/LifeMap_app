<template>
  <view class="profile-container">
    <!-- 顶部安全区 -->
    <view class="status-bar"></view>

    <!-- 头部卡片 -->
    <view class="header-card">
      <view class="header-left">
        <image class="avatar" :src="friend.avatar || '/textures/地图功能/好友（后续可能替换）.png'" mode="aspectFill" />
      </view>
      <view class="header-right">
        <text class="name">{{ friend.name || friend.nickname || friend.username || '好友' }}</text>
        <view class="meta-row">
          <view class="status-dot" :class="friend.status || (friend.isOnline ? 'online' : 'offline')"></view>
          <text class="status-text">{{ statusText }}</text>
          <text class="divider">·</text>
          <text class="location">{{ friend.location || '未知城市' }}</text>
        </view>
        <view class="tags">
          <text v-for="tag in displayTags" :key="tag" class="tag">#{{ tag }}</text>
        </view>
      </view>
    </view>

    <!-- 概览统计 -->
    <view class="stats-section">
      <view class="stat-card">
        <text class="stat-value">{{ stats.chats }}</text>
        <text class="stat-label">聊天次数</text>
      </view>
      <view class="stat-card">
        <text class="stat-value">{{ stats.days }}</text>
        <text class="stat-label">认识天数</text>
      </view>
      <view class="stat-card">
        <text class="stat-value">{{ stats.score }}</text>
        <text class="stat-label">亲密度</text>
      </view>
    </view>

    <!-- 类报告模块（参考报告页） -->
    <view class="report-section">
      <view class="section-card">
        <text class="section-title">近期互动要点</text>
        <view class="bullet-list">
          <view v-for="(item, idx) in highlights" :key="idx" class="bullet-item">• {{ item }}</view>
        </view>
      </view>

      <view class="section-card">
        <text class="section-title">兴趣画像</text>
        <view class="chips">
          <text v-for="chip in interests" :key="chip" class="chip">{{ chip }}</text>
        </view>
      </view>
    </view>

    <!-- 底部操作 -->
    <view class="actions">
      <view class="action-btn primary" @click="startChat"><text>发消息</text></view>
      <view class="action-btn" @click="startCall"><text>语音通话</text></view>
    </view>
  </view>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { onLoad } from '@dcloudio/uni-app'
import apiService from '../../utils/apiService.js'

const friend = ref({})
const stats = ref({ chats: 0, days: 0, score: 0 })
const highlights = ref([
  '本周完成了共同目标打卡',
  '最近常在晚间活跃',
  '偏好简短高频沟通'
])
const interests = ref(['效率提升', '健康运动', '阅读', '旅行'])

const statusText = computed(() => {
  const s = friend.value.status || (friend.value.isOnline ? 'online' : 'offline')
  const map = { online: '在线', busy: '忙碌', away: '离开', offline: '离线' }
  return map[s] || '未知'
})

onLoad((options) => {
  // 1) 通过 URL 参数获取 id
  const friendId = options?.friendId
  // 2) 通过 eventChannel 获取完整对象
  try {
    const ec = getCurrentPages()?.slice(-1)[0]?.getOpenerEventChannel?.()
    ec?.on?.('friendData', (data) => {
      if (data) friend.value = data
    })
  } catch (e) {}

  // 若没有完整对象，尝试根据 id 搜索（兜底）
  if (friendId && (!friend.value || !friend.value.id)) {
    fetchFriendById(friendId)
  }
})

onMounted(async () => {
  // 统计数据可参考项目报告页风格，这里使用模拟/占位
  // 如后端有好友统计接口，可替换为真实请求
  stats.value = { chats: 128, days: 365, score: 86 }
})

const fetchFriendById = async (id) => {
  try {
    const res = await apiService.searchUsers(id, 1)
    const list = res?.data?.users || res?.data || res || []
    if (Array.isArray(list) && list.length) {
      friend.value = list[0]
    }
  } catch (e) {
    console.warn('获取好友信息失败:', e.message)
  }
}

const startChat = () => {
  if (!friend.value) return
  uni.navigateTo({
    url: `/pages/chat/chat?friendId=${friend.value.id || ''}&friendName=${encodeURIComponent(friend.value.name || '')}`
  })
}

const startCall = () => {
  uni.showToast({ title: '正在呼叫...', icon: 'none' })
}
</script>

<style lang="scss" scoped>
.profile-container {
  width: 100vw;
  min-height: 100vh;
  background: #f7f8fa;
  box-sizing: border-box;
  padding-bottom: 40rpx;
}

.status-bar {
  height: env(safe-area-inset-top);
}

.header-card {
  display: flex;
  gap: 24rpx;
  background: #fff;
  margin: 20rpx 24rpx 12rpx;
  padding: 24rpx;
  border-radius: 20rpx;
  box-shadow: 0 12rpx 30rpx rgba(0,0,0,0.06);
}

.avatar {
  width: 120rpx;
  height: 120rpx;
  border-radius: 16rpx;
}

.name {
  font-size: 36rpx;
  font-weight: 700;
  color: #2f2f2f;
}

.meta-row {
  display: flex;
  align-items: center;
  gap: 12rpx;
  margin-top: 8rpx;
  color: #666;
  font-size: 24rpx;
}

.status-dot {
  width: 14rpx; height: 14rpx; border-radius: 50%;
  &.online { background: #4CAF50; }
  &.busy { background: #FF5722; }
  &.away { background: #FF9800; }
  &.offline { background: #9E9E9E; }
}

.tags { margin-top: 10rpx; display: flex; flex-wrap: wrap; gap: 10rpx; }
.tag { font-size: 22rpx; color: #4CAF50; background: #f1fbf1; padding: 8rpx 14rpx; border-radius: 999rpx; }

.stats-section {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 16rpx;
  margin: 0 24rpx 12rpx;
}

.stat-card {
  background: #fff; border-radius: 16rpx; padding: 24rpx; text-align: center;
  box-shadow: 0 8rpx 20rpx rgba(0,0,0,0.04);
}
.stat-value { font-size: 36rpx; font-weight: 700; color: #2f2f2f; }
.stat-label { font-size: 22rpx; color: #888; }

.report-section { margin: 0 24rpx; display: flex; flex-direction: column; gap: 16rpx; }
.section-card { background: #fff; border-radius: 16rpx; padding: 24rpx; box-shadow: 0 8rpx 20rpx rgba(0,0,0,0.04); }
.section-title { font-size: 28rpx; font-weight: 600; color: #333; }
.bullet-list { margin-top: 12rpx; color: #555; font-size: 26rpx; line-height: 1.6; }
.chips { margin-top: 12rpx; display: flex; flex-wrap: wrap; gap: 12rpx; }
.chip { padding: 10rpx 16rpx; background: #f6fff6; color: #2f7f2f; border-radius: 999rpx; font-size: 24rpx; }

.actions { display: flex; gap: 16rpx; margin: 16rpx 24rpx 0; }
.action-btn { flex: 1; padding: 20rpx 0; border-radius: 14rpx; text-align: center; background: #f0f0f0; color: #333; }
.action-btn.primary { background: linear-gradient(135deg, #5bcf5d 0%, #4CAF50 100%); color: #fff; }

@media (max-width: 768px) {
  .header-card { margin: 16rpx; padding: 20rpx; }
  .stats-section { margin: 0 16rpx; gap: 12rpx; }
  .report-section { margin: 0 16rpx; }
  .actions { margin: 16rpx; }
}
</style>


