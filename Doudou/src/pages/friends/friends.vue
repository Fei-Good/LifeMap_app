小程序<template>
  <view class="friends-container">
    <!-- 状态栏占位（刘海屏/安全区） -->
    <view class="status-bar"></view>
    <!-- 顶部标题栏 -->
    <view class="header">
      <image 
        class="header-bg" 
        src="/textures/地图功能/背景色.png" 
        mode="scaleToFill"
      />
      <view class="header-content">
        <view class="header-left">
          <view class="back-button" @click="goBack">
            <text class="back-text">← 返回</text>
          </view>
        </view>
        <view class="header-center">
          <text class="page-title">好友列表</text>
          <text class="page-subtitle">{{ friends.length }} 位好友</text>
        </view>
        <view class="header-right">
          <view class="add-friend-btn" @click="showAddFriendDialog">
            <text class="add-icon">➕</text>
          </view>
        </view>
      </view>
    </view>

    <!-- 搜索栏 -->
    <view class="search-container">
      <view class="search-box">
        <input 
          class="search-input" 
          placeholder="搜索好友..." 
          v-model="searchText"
          @input="filterFriends"
        />
        <text class="search-icon">🔍</text>
      </view>
    </view>

    <!-- 好友分类标签 -->
    <view class="category-tabs">
      <view 
        v-for="category in categories" 
        :key="category.key"
        class="tab-item"
        :class="{ 'tab-active': activeCategory === category.key }"
        @click="switchCategory(category.key)"
      >
        <text class="tab-text">{{ category.name }}</text>
        <text class="tab-count">({{ getCategoryCount(category.key) }})</text>
      </view>
    </view>

    <!-- 好友列表 -->
    <scroll-view 
      class="friends-list" 
      scroll-y="true" 
      :show-scrollbar="false"
      scroll-x="false"
      :refresher-enabled="true"
      :refresher-triggered="isRefreshing"
      @refresherrefresh="onRefresh"
      :lower-threshold="80"
      @scrolltolower="onReachBottom"
    >
      <view class="friends-grid">
        <!-- 在线好友 -->
        <view v-if="filteredFriends.length > 0" class="section">
          <view class="section-header">
            <text class="section-title">在线好友</text>
            <text class="section-count">{{ getOnlineCount() }} 人在线</text>
          </view>
          <view class="friends-row">
            <view 
              v-for="friend in getOnlineFriends()" 
              :key="friend.id"
              class="friend-card"
              @click="openFriendProfile(friend)"
            >
              <view class="friend-avatar">
                <image 
                  class="avatar-image" 
                  :src="friend.avatar" 
                  mode="aspectFill"
                />
                <view class="online-status" :class="friend.status"></view>
              </view>
              <view class="friend-info">
                <text class="friend-name">{{ friend.name }}</text>
                <text class="friend-status">{{ getStatusText(friend.status) }}</text>
                <text class="friend-location">{{ friend.location }}</text>
              </view>
              <view class="friend-actions">
                <view class="action-btn skills-btn" @click.stop="openSharedSkills(friend)">
                  <text class="action-icon">📚</text>
                </view>
                <view class="action-btn chat-btn" @click.stop="startChat(friend)">
                  <text class="action-icon">💬</text>
                </view>
                <view class="action-btn call-btn" @click.stop="startCall(friend)">
                  <text class="action-icon">📞</text>
                </view>
              </view>
            </view>
          </view>
        </view>

        <!-- 离线好友 -->
        <view v-if="getOfflineFriends().length > 0" class="section">
          <view class="section-header">
            <text class="section-title">离线好友</text>
            <text class="section-count">{{ getOfflineCount() }} 人离线</text>
          </view>
          <view class="friends-row">
            <view 
              v-for="friend in getOfflineFriends()" 
              :key="friend.id"
              class="friend-card offline"
              @click="openFriendProfile(friend)"
            >
              <view class="friend-avatar">
                <image 
                  class="avatar-image" 
                  :src="friend.avatar" 
                  mode="aspectFill"
                />
                <view class="online-status offline"></view>
              </view>
              <view class="friend-info">
                <text class="friend-name">{{ friend.name }}</text>
                <text class="friend-status">{{ getLastSeenText(friend.lastSeen) }}</text>
                <text class="friend-location">{{ friend.location }}</text>
              </view>
              <view class="friend-actions">
                <view class="action-btn skills-btn" @click.stop="openSharedSkills(friend)">
                  <text class="action-icon">📚</text>
                </view>
                <view class="action-btn message-btn" @click.stop="sendMessage(friend)">
                  <text class="action-icon">📝</text>
                </view>
                <view class="action-btn more-btn" @click.stop="openFriendMenu(friend)">
                  <text class="action-icon">⋯</text>
                </view>
              </view>
            </view>
          </view>
        </view>

        <!-- 加载更多/无更多 -->
        <view v-if="isLoadingMore" class="load-more">
          <text class="load-text">加载中...</text>
        </view>
        <view v-else-if="!hasMore && filteredFriends.length > 0" class="no-more">
          <text class="no-more-text">没有更多了</text>
        </view>

        <!-- 空状态 -->
        <view v-if="filteredFriends.length === 0" class="empty-state">
          <text class="empty-icon">👥</text>
          <text class="empty-title">暂无好友</text>
          <text class="empty-desc">点击右上角添加好友，开始你的社交之旅</text>
          <view class="empty-action" @click="showAddFriendDialog">
            <text class="action-text">添加好友</text>
          </view>
        </view>
      </view>
    </scroll-view>

    <!-- 添加好友弹窗 -->
    <view class="add-friend-popup" v-if="showAddDialog" @click="closeAddFriendDialog">
      <view class="popup-content" @click.stop>
        <view class="popup-header">
          <text class="popup-title">添加好友</text>
          <view class="close-btn" @click="closeAddFriendDialog">
            <text class="close-icon">✕</text>
          </view>
        </view>
        <view class="popup-body">
          <view class="input-group">
            <text class="input-label">好友ID或昵称</text>
            <view class="search-input-wrapper">
              <view class="search-left-icon">🔍</view>
              <input 
                class="input-field" 
                placeholder="请输入好友ID或昵称"
                v-model="newFriendId"
                @input="onSearchInput"
                @confirm="onSearchInput"
                confirm-type="search"
              />
              <view v-if="newFriendId" class="clear-btn" @click="clearSearch">✕</view>
            </view>
            <!-- 搜索建议列表 -->
            <view class="suggestions" v-if="newFriendId">
              <view v-if="searchLoading" class="suggestion-loading">正在搜索...</view>
              <view v-else-if="searchError" class="suggestion-error">{{ searchError }}</view>
              <view v-else>
                <view 
                  v-for="user in suggestions" 
                  :key="user.id || user.userId || user.username"
                  class="suggestion-item"
                  :class="{ selected: selectedUser && (selectedUser.id || selectedUser.userId) === (user.id || user.userId) }"
                  @click="selectSuggestion(user)"
                >
                  <image 
                    class="suggestion-avatar" 
                    :src="user.avatar || '/textures/地图功能/好友（后续可能替换）.png'" 
                    mode="aspectFill"
                  />
                  <view class="suggestion-info">
                    <text class="suggestion-name">{{ user.name || user.nickname || user.username }}</text>
                    <text class="suggestion-meta">ID: {{ user.id || user.userId || '-' }}</text>
                  </view>
                </view>
                <view v-if="!suggestions.length" class="suggestion-empty">无匹配结果</view>
              </view>
            </view>
          </view>
          <view class="input-group">
            <text class="input-label">验证消息</text>
            <textarea 
              class="textarea-field" 
              placeholder="请输入验证消息（可选）"
              v-model="verifyMessage"
            />
          </view>
        </view>
        <view class="popup-footer">
          <view class="popup-btn cancel-btn" @click="closeAddFriendDialog">
            <text class="btn-text">取消</text>
          </view>
          <view class="popup-btn confirm-btn" :class="{ disabled: isConfirmDisabled }" @click="sendFriendRequest" :aria-disabled="isConfirmDisabled">
            <text class="btn-text">发送请求</text>
          </view>
        </view>
      </view>
    </view>

    <!-- 好友资料弹窗 -->
    <view class="profile-popup" v-if="showProfileDialog" @click="closeProfileDialog">
      <view class="popup-content profile-content" @click.stop>
        <view class="popup-header">
          <text class="popup-title">好友资料</text>
          <view class="close-btn" @click="closeProfileDialog">
            <text class="close-icon">✕</text>
          </view>
        </view>
        <view class="popup-body">
          <view class="profile-header">
            <image class="profile-avatar" :src="profileFriend.avatar || '/textures/地图功能/好友（后续可能替换）.png'" mode="aspectFill" />
            <view class="profile-main">
              <text class="profile-name">{{ profileFriend.name }}</text>
              <view class="profile-meta">
                <view class="status-dot" :class="profileFriend.status || (profileFriend.isOnline ? 'online' : 'offline')"></view>
                <text class="status-text">{{ getStatusText(profileFriend.status || (profileFriend.isOnline ? 'online' : 'offline')) }}</text>
                <text class="divider">·</text>
                <text class="location">{{ profileFriend.location || '未知城市' }}</text>
              </view>
              <view v-if="profileFriend.mbti" class="profile-tags">
                <text class="mbti-badge">{{ profileFriend.mbti }}</text>
              </view>
            </view>
          </view>

          <view class="profile-stats">
            <view class="stat-card">
              <text class="stat-value">{{ profileStats.chats }}</text>
              <text class="stat-label">聊天次数</text>
            </view>
            <view class="stat-card">
              <text class="stat-value">{{ profileStats.days }}</text>
              <text class="stat-label">认识天数</text>
            </view>
            <view class="stat-card">
              <text class="stat-value">{{ profileStats.score }}</text>
              <text class="stat-label">亲密度</text>
            </view>
          </view>

          <view class="profile-actions">
            <view class="action-btn" @click.stop="openSharedSkills(profileFriend)"><text>技能库</text></view>
            <view class="action-btn primary" @click.stop="startChat(profileFriend)"><text>发消息</text></view>
            <view class="action-btn" @click.stop="startCall(profileFriend)"><text>语音通话</text></view>
          </view>
        </view>
      </view>
    </view>

    <!-- 好友菜单弹窗 -->
    <view class="friend-menu-popup" v-if="showFriendMenuVisible" @click="closeFriendMenu">
      <view class="menu-content" @click.stop>
        <view class="menu-item" @click="startChat(selectedFriend)">
          <text class="menu-icon">💬</text>
          <text class="menu-text">发送消息</text>
        </view>
        <view class="menu-item" @click="startCall(selectedFriend)">
          <text class="menu-icon">📞</text>
          <text class="menu-text">语音通话</text>
        </view>
        <view class="menu-item" @click="viewFriendProfile(selectedFriend)">
          <text class="menu-icon">👤</text>
          <text class="menu-text">查看资料</text>
        </view>
        <view class="menu-item danger" @click="removeFriend(selectedFriend)">
          <text class="menu-icon">🗑️</text>
          <text class="menu-text">删除好友</text>
        </view>
      </view>
    </view>
  </view>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import apiService from '../../utils/apiService.js'

// 响应式数据
const searchText = ref('')
const activeCategory = ref('all')
const showAddDialog = ref(false)
const showFriendMenuVisible = ref(false)
const selectedFriend = ref(null)
const newFriendId = ref('')
const verifyMessage = ref('')
const showProfileDialog = ref(false)
const profileFriend = ref({})
const profileStats = ref({ chats: 0, days: 0, score: 0 })

// 添加好友搜索相关
const searchLoading = ref(false)
const searchError = ref('')
const suggestions = ref([])
const selectedUser = ref(null)
let searchTimer = null

const isConfirmDisabled = computed(() => {
  // 没有选择用户，且输入也为空，则禁用
  return !(selectedUser.value || (newFriendId.value && newFriendId.value.trim().length >= 1))
})

// 刷新与分页状态
const isRefreshing = ref(false)
const isLoadingMore = ref(false)
const page = ref(1)
const pageSize = ref(20)
const hasMore = ref(true)

// 好友分类
const categories = ref([
  { key: 'all', name: '全部' },
  { key: 'online', name: '在线' },
  { key: 'offline', name: '离线' },
  { key: 'recent', name: '最近' }
])

// 好友数据（精简为指定4人）
const friends = ref([
  {
    id: 'friend_liguozheng',
    name: '李国正',
    avatar: '/static/avatars/liguozheng.jpeg',
    status: 'online',
    location: '武汉',
    mbti: 'ENTP',
    lastSeen: new Date(Date.now() - 1000 * 60 * 3),
    isOnline: true,
    category: 'recent'
  },
  {
    id: 'friend_afly',
    name: '阿飞',
    avatar: '/static/avatars/afei.jpeg',
    status: 'busy',
    location: '汕头',
    mbti: 'INFJ',
    lastSeen: new Date(Date.now() - 1000 * 60 * 15),
    isOnline: true,
    category: 'recent'
  },
  {
    id: 'friend_haodi',
    name: '浩迪',
    avatar: '/static/avatars/haodi.jpeg',
    status: 'away',
    location: '广州',
    mbti: 'INFP',
    lastSeen: new Date(Date.now() - 1000 * 60 * 60),
    isOnline: true,
    category: 'recent'
  },
  {
    id: 'friend_edvina',
    name: 'Edvina',
    avatar: '/static/avatars/edvina.jpeg',
    status: 'offline',
    location: '新加坡',
    mbti: 'ENTJ',
    lastSeen: new Date(Date.now() - 1000 * 60 * 60 * 24),
    isOnline: false,
    category: 'recent'
  }
])

// 模拟异步获取好友数据
const fetchFriends = async (targetPage = 1, size = pageSize.value) => {
  // 这里可替换为真实 API 请求
  await new Promise(resolve => setTimeout(resolve, 500))

  // 模拟生成数据
  const baseIndex = (targetPage - 1) * size
  const generated = Array.from({ length: size }).map((_, i) => {
    const idx = baseIndex + i + 6
    return {
      id: `friend${idx}`,
      name: `好友${idx}`,
      avatar: '/textures/地图功能/好友（后续可能替换）.png',
      status: ['online', 'busy', 'away', 'offline'][idx % 4],
      location: ['北京', '上海', '广州', '深圳'][idx % 4],
      lastSeen: new Date(Date.now() - 1000 * 60 * (idx * 7)),
      isOnline: (idx % 4) !== 3,
      category: idx % 3 === 0 ? 'recent' : 'all'
    }
  })

  // 模拟总页数为 3
  const totalPages = 3
  return {
    list: generated,
    hasMore: targetPage < totalPages
  }
}

// 计算属性
const filteredFriends = computed(() => {
  let result = friends.value

  // 按分类筛选
  if (activeCategory.value !== 'all') {
    if (activeCategory.value === 'online') {
      result = result.filter(friend => friend.isOnline)
    } else if (activeCategory.value === 'offline') {
      result = result.filter(friend => !friend.isOnline)
    } else if (activeCategory.value === 'recent') {
      result = result.filter(friend => friend.category === 'recent')
    }
  }

  // 按搜索文本筛选
  if (searchText.value.trim()) {
    const searchLower = searchText.value.toLowerCase()
    result = result.filter(friend => 
      friend.name.toLowerCase().includes(searchLower) ||
      friend.location.toLowerCase().includes(searchLower)
    )
  }

  return result
})

// 方法
const goBack = () => {
  uni.navigateTo({
    url: '/pages/chat/chat'
  })
}

const filterFriends = () => {
  // 搜索功能已在计算属性中实现
}

const switchCategory = (category) => {
  activeCategory.value = category
}

const getCategoryCount = (category) => {
  if (category === 'all') return friends.value.length
  if (category === 'online') return friends.value.filter(f => f.isOnline).length
  if (category === 'offline') return friends.value.filter(f => !f.isOnline).length
  if (category === 'recent') return friends.value.filter(f => f.category === 'recent').length
  return 0
}

const getOnlineFriends = () => {
  return filteredFriends.value.filter(friend => friend.isOnline)
}

const getOfflineFriends = () => {
  return filteredFriends.value.filter(friend => !friend.isOnline)
}

const getOnlineCount = () => {
  return getOnlineFriends().length
}

const getOfflineCount = () => {
  return getOfflineFriends().length
}

const getStatusText = (status) => {
  const statusMap = {
    'online': '在线',
    'busy': '忙碌',
    'away': '离开',
    'offline': '离线'
  }
  return statusMap[status] || '未知'
}

const getLastSeenText = (lastSeen) => {
  const now = new Date()
  const diff = now - lastSeen
  const minutes = Math.floor(diff / (1000 * 60))
  const hours = Math.floor(diff / (1000 * 60 * 60))
  const days = Math.floor(diff / (1000 * 60 * 60 * 24))

  if (minutes < 60) {
    return `${minutes}分钟前在线`
  } else if (hours < 24) {
    return `${hours}小时前在线`
  } else {
    return `${days}天前在线`
  }
}

const formatMbti = (mbti) => {
  if (!mbti) return ''
  return String(mbti).toUpperCase()
}

const openFriendProfile = (friend) => {
  profileFriend.value = { ...friend, mbti: formatMbti(friend.mbti) }
  // 模拟统计数据，可替换为接口
  profileStats.value = { chats: 128, days: 365, score: 86 }
  showProfileDialog.value = true
}

const closeProfileDialog = () => {
  showProfileDialog.value = false
  profileFriend.value = {}
}

const startChat = (friend) => {
  uni.navigateTo({
    url: `/pages/chat/chat?friendId=${friend.id}&friendName=${friend.name}`
  })
}

const startCall = (friend) => {
  uni.showToast({
    title: `正在呼叫 ${friend.name}...`,
    icon: 'none'
  })
}

const openSharedSkills = (friend) => {
  // 跳转到知识库页，并带上好友ID以过滤共享资源
  const id = friend?.id || ''
  uni.navigateTo({
    url: `/pages/knowledge/knowledge?friendId=${encodeURIComponent(id)}&friendName=${encodeURIComponent(friend?.name || '')}`
  })
}

const sendMessage = (friend) => {
  uni.navigateTo({
    url: `/pages/chat/chat?friendId=${friend.id}&friendName=${friend.name}`
  })
}

const showAddFriendDialog = () => {
  showAddDialog.value = true
}

const closeAddFriendDialog = () => {
  showAddDialog.value = false
  newFriendId.value = ''
  verifyMessage.value = ''
  searchLoading.value = false
  searchError.value = ''
  suggestions.value = []
  selectedUser.value = null
  if (searchTimer) {
    clearTimeout(searchTimer)
    searchTimer = null
  }
}

const sendFriendRequest = async () => {
  if (isConfirmDisabled.value) {
    return
  }
  if (!selectedUser.value && !newFriendId.value.trim()) {
    uni.showToast({
      title: '请输入好友ID或昵称',
      icon: 'none'
    })
    return
  }

  try {
    // 这里可以调用实际的添加好友 API，例如 apiService.addFriend
    // 暂时使用提示模拟
    const displayName = selectedUser.value?.name || selectedUser.value?.nickname || selectedUser.value?.username || newFriendId.value
    uni.showToast({
      title: `已向 ${displayName} 发送请求`,
      icon: 'success'
    })
  } catch (e) {
    uni.showToast({
      title: e.message || '发送失败',
      icon: 'none'
    })
    return
  }

  closeAddFriendDialog()
}

const onSearchInput = () => {
  selectedUser.value = null
  searchError.value = ''
  if (searchTimer) clearTimeout(searchTimer)
  const keyword = newFriendId.value.trim()
  if (!keyword) {
    suggestions.value = []
    searchLoading.value = false
    return
  }
  searchLoading.value = true
  searchTimer = setTimeout(fetchSuggestions, 300)
}

const fetchSuggestions = async () => {
  const keyword = newFriendId.value.trim()
  if (!keyword) {
    searchLoading.value = false
    suggestions.value = []
    return
  }
  try {
    searchError.value = ''
    const res = await apiService.searchUsers(keyword, 8)
    // 兼容不同返回结构
    suggestions.value = res?.data?.users || res?.data || res || []
  } catch (e) {
    console.error('搜索用户失败:', e)
    searchError.value = e.message || '搜索失败，请稍后重试'
    suggestions.value = []
  } finally {
    searchLoading.value = false
  }
}

const selectSuggestion = (user) => {
  selectedUser.value = user
  newFriendId.value = user.name || user.nickname || user.username || `${user.id || user.userId}`
}

const clearSearch = () => {
  newFriendId.value = ''
  suggestions.value = []
  selectedUser.value = null
  searchError.value = ''
  searchLoading.value = false
  if (searchTimer) {
    clearTimeout(searchTimer)
    searchTimer = null
  }
}

const openFriendMenu = (friend) => {
  selectedFriend.value = friend
  showFriendMenuVisible.value = true
}

const closeFriendMenu = () => {
  showFriendMenuVisible.value = false
  selectedFriend.value = null
}

const viewFriendProfile = (friend) => {
  closeFriendMenu()
  openFriendProfile(friend)
}

const removeFriend = (friend) => {
  uni.showModal({
    title: '确认删除',
    content: `确定要删除好友 ${friend.name} 吗？`,
    success: (res) => {
      if (res.confirm) {
        const index = friends.value.findIndex(f => f.id === friend.id)
        if (index > -1) {
          friends.value.splice(index, 1)
          uni.showToast({
            title: '好友已删除',
            icon: 'success'
          })
        }
      }
    }
  })
  closeFriendMenu()
}

// 生命周期
onMounted(async () => {
  console.log('好友列表页面加载完成')
  // 固定四位模拟好友，关闭自动加载更多
  hasMore.value = false
})

// 下拉刷新
const onRefresh = async () => {
  if (isRefreshing.value) return
  isRefreshing.value = true
  // 模拟刷新：延迟后结束
  await new Promise(r => setTimeout(r, 400))
  isRefreshing.value = false
}

// 触底加载更多
const onReachBottom = async () => {
  // 固定数据，不再加载
}
</script>

<style lang="scss" scoped>
.friends-container {
  width: 100vw;
  /* 兼容不同浏览器的视口单位，确保全屏高度 */
  height: 100vh;
  height: 100dvh;
  min-height: 100svh;
  background: #f5f5f5;
  display: flex;
  flex-direction: column;
  box-sizing: border-box;
  padding-right: constant(safe-area-inset-right);
  padding-right: env(safe-area-inset-right);
  overflow-x: hidden;
}

/* 顶部安全区占位，避免内容被系统状态栏遮挡 */
.status-bar {
  height: constant(safe-area-inset-top);
  height: env(safe-area-inset-top);
  background: #f5f5f5;
}

/* 顶部标题栏 */
.header {
  position: relative;
  height: 120rpx;
  z-index: 100;
}

.header-bg {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
}

.header-content {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 30rpx;
  z-index: 2;
  /* 右侧安全区，避免右上角按钮被裁剪 */
  padding-right: calc(30rpx + env(safe-area-inset-right));
  padding-right: calc(30rpx + constant(safe-area-inset-right));
}

.header-left {
  flex: 1;
}

.back-button {
  padding: 10rpx 20rpx;
  background: rgba(255, 255, 255, 0.2);
  border-radius: 20rpx;
  cursor: pointer;
  transition: all 0.2s ease;
  
  &:active {
    transform: scale(0.95);
    background: rgba(255, 255, 255, 0.3);
  }
}

.back-text {
  font-size: 28rpx;
  color: #333;
  font-weight: 500;
}

.header-center {
  flex: 2;
  text-align: center;
}

.page-title {
  font-size: 36rpx;
  font-weight: 600;
  color: #333;
  display: block;
}

.page-subtitle {
  font-size: 24rpx;
  color: #666;
  display: block;
  margin-top: 5rpx;
}

.header-right {
  flex: 1;
  display: flex;
  justify-content: flex-end;
  /* 冗余保护：增加右侧安全区 */
  padding-right: env(safe-area-inset-right);
  padding-right: constant(safe-area-inset-right);
  /* 固定右侧边距，强制向左移动按钮，避免被挡 */
  padding-right: 24rpx;
}

.add-friend-btn {
  width: 60rpx;
  height: 60rpx;
  background: rgba(255, 255, 255, 0.2);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.2s ease;
  /* 确保按钮本身也避开安全区 */
  margin-right: env(safe-area-inset-right);
  margin-right: constant(safe-area-inset-right);
  /* 固定额外间距，使其更靠左显示 */
  margin-right: 24rpx;
  
  &:active {
    transform: scale(0.9);
    background: rgba(255, 255, 255, 0.3);
  }
}

.add-icon {
  font-size: 32rpx;
  color: #333;
}

/* 搜索栏 */
.search-container {
  padding: 20rpx 30rpx;
  background: white;
  border-bottom: 1rpx solid #eee;
}

.search-box {
  position: relative;
  background: #f8f8f8;
  border-radius: 25rpx;
  padding: 0 20rpx;
  display: flex;
  align-items: center;
}

.search-input {
  flex: 1;
  height: 70rpx;
  font-size: 28rpx;
  background: transparent;
  border: none;
  outline: none;
}

.search-icon {
  font-size: 32rpx;
  color: #999;
  margin-left: 10rpx;
}

/* 分类标签 */
.category-tabs {
  display: flex;
  background: white;
  border-bottom: 1rpx solid #eee;
  padding: 0 30rpx;
}

.tab-item {
  flex: 1;
  padding: 20rpx 0;
  text-align: center;
  cursor: pointer;
  transition: all 0.2s ease;
  border-bottom: 4rpx solid transparent;
  
  &.tab-active {
    border-bottom-color: #4CAF50;
  }
}

.tab-text {
  font-size: 28rpx;
  color: #333;
  font-weight: 500;
}

.tab-count {
  font-size: 22rpx;
  color: #999;
  margin-left: 5rpx;
}

/* 好友列表 */
.friends-list {
  flex: 1;
  /* H5下scroll-view在flex容器内常需显式高度为0配合flex:1以填满 */
  height: 0;
  padding: 20rpx 30rpx;
  width: 100%;
  box-sizing: border-box;
  overflow-x: hidden;
}

.friends-grid {
  width: 100%;
  box-sizing: border-box;
}

.section {
  margin-bottom: 40rpx;
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20rpx;
}

.section-title {
  font-size: 32rpx;
  font-weight: 600;
  color: #333;
}

.section-count {
  font-size: 24rpx;
  color: #999;
}

.friends-row {
  display: flex;
  flex-direction: column;
  gap: 20rpx;
}

.friend-card {
  background: white;
  border-radius: 20rpx;
  padding: 30rpx;
  display: flex;
  align-items: center;
  box-shadow: 0 4rpx 12rpx rgba(0, 0, 0, 0.05);
  cursor: pointer;
  transition: all 0.2s ease;
  width: 100%;
  box-sizing: border-box;
  padding-right: calc(30rpx + env(safe-area-inset-right));
  overflow: hidden;
  
  &:active {
    transform: scale(0.98);
  }
  
  &.offline {
    opacity: 0.7;
  }
}

.friend-avatar {
  position: relative;
  margin-right: 20rpx;
}

.avatar-image {
  width: 80rpx;
  height: 80rpx;
  border-radius: 50%;
  border: 3rpx solid #f0f0f0;
}

.online-status {
  position: absolute;
  bottom: 5rpx;
  right: 5rpx;
  width: 20rpx;
  height: 20rpx;
  border-radius: 50%;
  border: 3rpx solid white;
  
  &.online {
    background: #4CAF50;
  }
  
  &.busy {
    background: #FF5722;
  }
  
  &.away {
    background: #FF9800;
  }
  
  &.offline {
    background: #9E9E9E;
  }
}

.friend-info {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 5rpx;
  min-width: 0;
}

.friend-name {
  font-size: 32rpx;
  font-weight: 600;
  color: #333;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.friend-status {
  font-size: 24rpx;
  color: #4CAF50;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.friend-location {
  font-size: 22rpx;
  color: #999;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.friend-actions {
  display: flex;
  gap: 15rpx;
  flex: none;
}

.action-btn {
  width: 60rpx;
  height: 60rpx;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.2s ease;
  flex-shrink: 0;
  
  &.chat-btn {
    background: #E3F2FD;
    
    &:active {
      background: #BBDEFB;
    }
  }
  
  &.skills-btn {
    background: #EAF7FF;
    
    &:active {
      background: #D6EEFF;
    }
  }
  
  &.call-btn {
    background: #E8F5E8;
    
    &:active {
      background: #C8E6C9;
    }
  }
  
  &.message-btn {
    background: #FFF3E0;
    
    &:active {
      background: #FFE0B2;
    }
  }
  
  &.more-btn {
    background: #F3E5F5;
    
    &:active {
      background: #E1BEE7;
    }
  }
}

.action-icon {
  font-size: 28rpx;
}

/* 空状态 */
.empty-state {
  text-align: center;
  padding: 100rpx 0;
}

.empty-icon {
  font-size: 120rpx;
  display: block;
  margin-bottom: 30rpx;
}

.empty-title {
  font-size: 36rpx;
  font-weight: 600;
  color: #333;
  display: block;
  margin-bottom: 15rpx;
}

.empty-desc {
  font-size: 28rpx;
  color: #999;
  display: block;
  margin-bottom: 40rpx;
  line-height: 1.5;
}

.empty-action {
  display: inline-block;
  padding: 20rpx 40rpx;
  background: #4CAF50;
  border-radius: 25rpx;
  cursor: pointer;
  transition: all 0.2s ease;
  
  &:active {
    transform: scale(0.95);
    background: #45a049;
  }
}

.action-text {
  font-size: 28rpx;
  color: white;
  font-weight: 500;
}

/* 弹窗样式 */
.add-friend-popup, .friend-menu-popup {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.35);
  backdrop-filter: blur(6px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

/* 复用同样遮罩风格的资料弹窗 */
.profile-popup {
  position: fixed;
  top: 0; left: 0; width: 100%; height: 100%;
  background: rgba(0,0,0,0.35);
  backdrop-filter: blur(6px);
  display: flex; align-items: center; justify-content: center;
  z-index: 1000;
}

.profile-content {
  width: 90%; max-width: 700rpx; background: #fff; border-radius: 24rpx;
  overflow: hidden; box-shadow: 0 20rpx 60rpx rgba(0,0,0,0.12);
  transform: translateY(10rpx); animation: popup-fade-in 220ms ease-out;
}

.profile-header { 
  display: flex; gap: 24rpx; align-items: center; 
  background: linear-gradient(135deg, #f6fff6 0%, #ffffff 70%);
  border-radius: 20rpx; 
  padding: 24rpx; 
  margin-bottom: 20rpx;
}
.profile-avatar { 
  width: 140rpx; height: 140rpx; border-radius: 20rpx; 
  box-shadow: 0 0 0 4rpx #fff, 0 0 0 8rpx rgba(76,175,80,0.15);
}
.profile-main { flex: 1; min-width: 0; }
.profile-name { font-size: 38rpx; font-weight: 700; color: #2f2f2f; }
.profile-meta { display: flex; align-items: center; gap: 16rpx; color: #666; font-size: 26rpx; margin-top: 12rpx; }
.profile-tags { margin-top: 10rpx; }
.mbti-badge { display: inline-block; padding: 8rpx 14rpx; border-radius: 999rpx; background: #eef9ff; color: #0077cc; font-size: 22rpx; font-weight: 600; }
.status-dot { width: 16rpx; height: 16rpx; border-radius: 50%; box-shadow: 0 0 0 4rpx rgba(76,175,80,0.08); animation: pulse 1.6s infinite; }
.status-dot.online { background: #4CAF50; }
.status-dot.busy { background: #FF5722; }
.status-dot.away { background: #FF9800; }
.status-dot.offline { background: #9E9E9E; }

.profile-stats { display: grid; grid-template-columns: repeat(3, 1fr); gap: 16rpx; margin-bottom: 24rpx; }
.profile-actions { display: flex; gap: 20rpx; }

/* 手机端优化的资料弹窗内卡片与按钮 */
.stat-card { 
  background: #fff; border-radius: 16rpx; padding: 28rpx 20rpx; text-align: center; 
  box-shadow: 0 8rpx 22rpx rgba(0,0,0,0.05); 
  border: 1rpx solid #f5f5f5;
}
.stat-value { font-size: 36rpx; font-weight: 700; color: #2f2f2f; display: block; }
.stat-label { font-size: 24rpx; color: #888; margin-top: 8rpx; display: block; }

.profile-actions .action-btn { 
  flex: 1; padding: 24rpx 0; text-align: center;
  background: #f2f2f2; color: #333; border-radius: 16rpx;
  box-shadow: 0 8rpx 20rpx rgba(0,0,0,0.06);
  transition: transform 0.12s ease, box-shadow 0.12s ease;
  font-size: 28rpx; font-weight: 500;
}
.profile-actions .action-btn:active { transform: scale(0.98); box-shadow: 0 4rpx 12rpx rgba(0,0,0,0.06); }
.profile-actions .action-btn.primary { background: linear-gradient(135deg, #5bcf5d 0%, #4CAF50 100%); color: #fff; }

@keyframes pulse {
  0% { transform: scale(1); opacity: 1; }
  70% { transform: scale(1.15); opacity: 0.7; }
  100% { transform: scale(1); opacity: 1; }
}

.popup-content {
  width: 86%;
  max-width: 640rpx;
  background: #ffffff;
  border-radius: 24rpx;
  overflow: hidden;
  box-shadow: 0 20rpx 60rpx rgba(0,0,0,0.12);
  transform: translateY(10rpx);
  animation: popup-fade-in 220ms ease-out;
}

.popup-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 28rpx 30rpx;
  background: linear-gradient(135deg, #f6fff6 0%, #ffffff 60%);
  border-bottom: 1rpx solid #f0f0f0;
}

.popup-title {
  font-size: 36rpx;
  font-weight: 700;
  color: #2f2f2f;
}

.close-btn {
  width: 50rpx;
  height: 50rpx;
  border-radius: 50%;
  background: #f5f7f5;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.2s ease;
  
  &:active {
    background: #e7eee7;
  }
}

.close-icon {
  font-size: 24rpx;
  color: #666;
}

.popup-body {
  padding: 28rpx 30rpx 24rpx;
}

.input-group {
  margin-bottom: 30rpx;
}

.input-label {
  font-size: 28rpx;
  color: #333;
  font-weight: 500;
  display: block;
  margin-bottom: 15rpx;
}

.input-field, .textarea-field {
  width: 100%;
  display: block;
  padding: 22rpx 20rpx;
  border: 2rpx solid #e0e0e0;
  border-radius: 10rpx;
  font-size: 28rpx;
  background: #fafafa;
  outline: none;
  
  &:focus {
    border-color: #4CAF50;
    background: #ffffff;
    box-shadow: 0 0 0 6rpx rgba(76, 175, 80, 0.08);
  }
}

.search-input-wrapper {
  position: relative;
  width: 100%;
  box-sizing: border-box;
  padding-right: 64rpx;
  padding-left: 48rpx;
}
.search-left-icon {
  position: absolute;
  left: 16rpx;
  top: 50%;
  transform: translateY(-50%);
  font-size: 28rpx;
  color: #888;
}

.clear-btn {
  position: absolute;
  right: calc(16rpx + env(safe-area-inset-right));
  top: 50%;
  transform: translateY(-50%);
  width: 48rpx;
  height: 48rpx;
  border-radius: 50%;
  background: #f0f0f0;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #666;
  font-size: 24rpx;
  transition: background 0.15s ease;
  
  &:active {
    background: #e5e5e5;
  }
}

.suggestions {
  margin-top: 16rpx;
  background: #fff;
  border: 2rpx solid #eee;
  border-radius: 14rpx;
  overflow: hidden;
  box-shadow: 0 12rpx 30rpx rgba(0,0,0,0.06);
}

.suggestion-loading,
.suggestion-error,
.suggestion-empty {
  padding: 24rpx;
  font-size: 26rpx;
  color: #999;
}

.suggestion-item {
  display: flex;
  align-items: center;
  gap: 16rpx;
  padding: 20rpx 24rpx;
  border-bottom: 1rpx solid #f5f5f5;
  cursor: pointer;
  transition: background 0.15s ease;
  
  &:last-child {
    border-bottom: none;
  }
  
  &.selected {
    background: #f6fff6;
  }
  
  &:active {
    background: #f2fdf2;
  }
}

.suggestion-avatar {
  width: 64rpx;
  height: 64rpx;
  border-radius: 50%;
  background: #f0f0f0;
}

.suggestion-info {
  display: flex;
  flex-direction: column;
}

.suggestion-name {
  font-size: 28rpx;
  color: #333;
}

.suggestion-meta {
  font-size: 22rpx;
  color: #999;
}

.textarea-field {
  height: 120rpx;
  resize: none;
  display: block;
  width: 100%;
  box-sizing: border-box;
  /* 预留右侧空间，避免被遮挡 */
  padding-right: calc(64rpx + env(safe-area-inset-right));
}

/* 适配 uni-input 内部结构，确保宽度与右内边距充足（避免被裁剪） */
:deep(.uni-input-wrapper) {
  width: 100%;
  box-sizing: border-box;
}

:deep(.uni-input-input) {
  width: 100%;
  box-sizing: border-box;
  padding-right: 64rpx;
}

/* 适配 uni-textarea 内部结构，避免右侧被遮挡 */
:deep(.uni-textarea-wrapper) {
  width: 100%;
  box-sizing: border-box;
  padding-right: calc(64rpx + env(safe-area-inset-right));
}

:deep(.uni-textarea-textarea) {
  width: 100%;
  box-sizing: border-box;
  padding-right: calc(64rpx + env(safe-area-inset-right));
}

.popup-footer {
  display: flex;
  gap: 20rpx;
  padding: 30rpx;
  border-top: 1rpx solid #eee;
}

.popup-btn {
  flex: 1;
  padding: 20rpx;
  border-radius: 10rpx;
  text-align: center;
  cursor: pointer;
  transition: all 0.2s ease;
  
  &.cancel-btn {
    background: #f5f5f5;
    
    &:active {
      background: #e0e0e0;
    }
  }
  
  &.confirm-btn {
    background: linear-gradient(135deg, #5bcf5d 0%, #4CAF50 100%);
    
    &:active {
      background: #45a049;
    }
    &.disabled {
      opacity: 0.6;
    }
  }
}

.btn-text {
  font-size: 28rpx;
  font-weight: 500;
  
  .cancel-btn & {
    color: #666;
  }
  
  .confirm-btn & {
    color: white;
  }
}

@keyframes popup-fade-in {
  from {
    opacity: 0;
    transform: translateY(20rpx) scale(0.98);
  }
  to {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
}

.menu-content {
  background: white;
  border-radius: 20rpx;
  overflow: hidden;
  min-width: 300rpx;
}

.menu-item {
  display: flex;
  align-items: center;
  padding: 30rpx;
  cursor: pointer;
  transition: all 0.2s ease;
  border-bottom: 1rpx solid #f0f0f0;
  
  &:last-child {
    border-bottom: none;
  }
  
  &:active {
    background: #f5f5f5;
  }
  
  &.danger {
    .menu-text {
      color: #FF5722;
    }
  }
}

.menu-icon {
  font-size: 32rpx;
  margin-right: 20rpx;
}

.menu-text {
  font-size: 28rpx;
  color: #333;
  font-weight: 500;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .friends-row {
    gap: 15rpx;
  }
  
  .friend-card {
    padding: 20rpx;
  }
  
  .avatar-image {
    width: 60rpx;
    height: 60rpx;
  }
  
  .friend-name {
    font-size: 28rpx;
  }
  
  .friend-status, .friend-location {
    font-size: 20rpx;
  }
}
</style>
