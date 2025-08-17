<template>
  <view class="page">
    <view class="group">
      <view class="flex-col">

        <view class="mt-18 flex-row items-center">
          <image
            class="image-4"
            src="https://ide.code.fun/api/image?token=68a209772b7b7600119d1eef&name=40be16d471bbfaf7c53a8259e53a5e70.png"
            @click="goBack"
          />
          <text class="ml-16 text-2">任务系统</text>
        </view>
      </view>
      <view class="mt-24 flex-row items-center">
        <image
          class="shrink-0 image-5"
          src="https://ide.code.fun/api/image?token=68a209772b7b7600119d1eef&name=487e2a2ac96a0a66518b002a671dff68.png"
        />
        <view class="ml-18 flex-col flex-1">
          <view class="flex-row items-center">
            <view class="flex-col justify-start items-center text-wrapper">
              <text class="text-4">Lv.5</text>
            </view>
            <text class="ml-8 font text-3">沟通达人</text>
          </view>
          <view class="mt-12 flex-col justify-start relative group-3">
            <view class="flex-col justify-start items-start section">
              <view class="shrink-0 section-2"></view>
            </view>
            <image
              class="image-6 pos"
              src="https://ide.code.fun/api/image?token=68a209772b7b7600119d1eef&name=bd24f5de7db39040a4668df836cfda5d.png"
            />
          </view>
        </view>
      </view>
    </view>
    <view class="flex-col section-3">
             <view class="flex-col group-4">
         <view class="flex-row justify-between self-stretch">
           <text class="font-2 text-5" @click="switchToPending" :class="{ 'active-tab': currentTab === 'pending' }">待完成清单</text>
           <text class="font-2" @click="switchToCompleted" :class="{ 'active-tab': currentTab === 'completed' }">已完成任务</text>
         </view>
         <view class="self-start section-4" v-if="currentTab === 'pending'"></view>
         <view class="self-start section-4 completed-tab-indicator" v-if="currentTab === 'completed'"></view>
       </view>
                    <!-- 待完成清单界面 -->
       <view class="flex-col mt-21" v-if="currentTab === 'pending'">
         <!-- 技能学习类 -->
         <view class="flex-row items-center">
           <view class="flex-col justify-start items-center image-wrapper">
             <image
               class="image-7"
               src="https://ide.code.fun/api/image?token=68a209772b7b7600119d1eef&name=326cbb3078b7da7927e3f57a5fd403ba.png"
             />
           </view>
           <text class="ml-6 font text-6">技能学习类</text>
         </view>
         <view class="flex-col group-5">
           <view 
             class="flex-col section-5 relative task-item"
             v-for="task in data.pendingTasks.skillLearning"
             :key="task.id"
           >
             <view class="flex-row justify-between items-center">
               <view class="flex-col flex-1">
                 <text class="font-3 task-title">{{ task.title }}</text>
                 <text class="font-3 task-description">{{ task.description }}</text>
               </view>
               <image
                 class="image-8 dropdown-trigger"
                 :src="task.isExpanded ? 'https://ide.code.fun/api/image?token=68a209772b7b7600119d1eef&name=81c4320e45889a3b4c87d25e48983617.png' : 'https://ide.code.fun/api/image?token=68a209772b7b7600119d1eef&name=e17d9fee2571870558ffa6c516870f53.png'"
                 @click="toggleTaskExpanded('skillLearning', task.id)"
               />
             </view>
             <view class="mt-10 flex-row" v-if="task.isExpanded">
               <view class="flex-col justify-start items-center shrink-0 text-wrapper-2" @click="handleAction('abandon', task.id)">
                 <text class="font-4 text-7">放弃</text>
               </view>
               <view class="ml-8 flex-col justify-start items-center flex-1 text-wrapper-3" @click="handleAction('complete', task.id)">
                 <text class="font-4 text-8">完成</text>
               </view>
             </view>
           </view>
         </view>

         <!-- 情绪管理类 -->
         <view class="flex-row items-center group-6">
           <view class="flex-col justify-start items-center image-wrapper-2">
             <image
               class="image-7"
               src="https://ide.code.fun/api/image?token=68a209772b7b7600119d1eef&name=6cf85d4308476af19809f39613b95d4b.png"
             />
           </view>
           <text class="ml-6 font">情绪管理类</text>
         </view>
         <view class="flex-col group-5">
           <view 
             class="flex-col section-5 task-item"
             v-for="task in data.pendingTasks.emotionManagement"
             :key="task.id"
           >
             <view class="flex-row justify-between items-center">
               <view class="flex-col flex-1">
                 <text class="font-3 task-title">{{ task.title }}</text>
                 <text class="font-3 task-description">{{ task.description }}</text>
               </view>
               <image
                 class="image-8 dropdown-trigger"
                 :src="task.isExpanded ? 'https://ide.code.fun/api/image?token=68a209772b7b7600119d1eef&name=81c4320e45889a3b4c87d25e48983617.png' : 'https://ide.code.fun/api/image?token=68a209772b7b7600119d1eef&name=e17d9fee2571870558ffa6c516870f53.png'"
                 @click="toggleTaskExpanded('emotionManagement', task.id)"
               />
             </view>
             <view class="mt-10 flex-row" v-if="task.isExpanded">
               <view class="flex-col justify-start items-center shrink-0 text-wrapper-2" @click="handleAction('abandon', task.id)">
                 <text class="font-4 text-7">放弃</text>
               </view>
               <view class="ml-8 flex-col justify-start items-center flex-1 text-wrapper-3" @click="handleAction('complete', task.id)">
                 <text class="font-4 text-8">完成</text>
               </view>
             </view>
           </view>
         </view>

         <!-- 效率提升类 -->
         <view class="flex-row items-center group-7">
           <view class="flex-col justify-start items-center image-wrapper-3">
             <image
               class="image-7"
               src="https://ide.code.fun/api/image?token=68a209772b7b7600119d1eef&name=915c7d3d47fec642f6335191e552ad0b.png"
             />
           </view>
           <text class="ml-6 font text-9">效率提升类</text>
         </view>
         <view class="flex-col group-5">
           <view 
             class="flex-col section-5 task-item"
             v-for="task in data.pendingTasks.efficiencyImprovement"
             :key="task.id"
           >
             <view class="flex-row justify-between items-center">
               <view class="flex-col flex-1">
                 <text class="font-3 task-title">{{ task.title }}</text>
                 <text class="font-3 task-description">{{ task.description }}</text>
               </view>
               <image
                 class="image-8 dropdown-trigger"
                 :src="task.isExpanded ? 'https://ide.code.fun/api/image?token=68a209772b7b7600119d1eef&name=81c4320e45889a3b4c87d25e48983617.png' : 'https://ide.code.fun/api/image?token=68a209772b7b7600119d1eef&name=e17d9fee2571870558ffa6c516870f53.png'"
                 @click="toggleTaskExpanded('efficiencyImprovement', task.id)"
               />
             </view>
             <view class="mt-10 flex-row" v-if="task.isExpanded">
               <view class="flex-col justify-start items-center shrink-0 text-wrapper-2" @click="handleAction('abandon', task.id)">
                 <text class="font-4 text-7">放弃</text>
               </view>
               <view class="ml-8 flex-col justify-start items-center flex-1 text-wrapper-3" @click="handleAction('complete', task.id)">
                 <text class="font-4 text-8">完成</text>
               </view>
             </view>
           </view>
         </view>
       </view>

       <!-- 已完成任务界面 -->
       <view class="flex-col mt-21" v-if="currentTab === 'completed'">
         <!-- 技能学习类 -->
         <view class="flex-row items-center">
           <view class="flex-col justify-start items-center image-wrapper">
             <image
               class="image-7"
               src="https://ide.code.fun/api/image?token=68a209772b7b7600119d1eef&name=326cbb3078b7da7927e3f57a5fd403ba.png"
             />
           </view>
           <text class="ml-6 font text-6">技能学习类</text>
         </view>
         <view class="flex-col group-5">
           <view 
             class="flex-col section-5 completed-item"
             v-for="task in data.completedTasks.skillLearning"
             :key="task.id"
           >
             <view class="flex-row justify-between items-center">
               <view class="flex-col flex-1">
                 <text class="font-3 task-title">{{ task.title }}</text>
                 <text class="font-3 task-description">{{ task.description }}</text>
               </view>
             </view>
             <view class="mt-10 flex-row justify-end">
               <text class="font-4 completed-date">完成于 {{ task.date }}</text>
             </view>
           </view>
         </view>

         <!-- 情绪管理类 -->
         <view class="flex-row items-center group-6">
           <view class="flex-col justify-start items-center image-wrapper-2">
             <image
               class="image-7"
               src="https://ide.code.fun/api/image?token=68a209772b7b7600119d1eef&name=6cf85d4308476af19809f39613b95d4b.png"
             />
           </view>
           <text class="ml-6 font">情绪管理类</text>
         </view>
         <view class="flex-col group-5">
           <view 
             class="flex-col section-5 completed-item"
             v-for="task in data.completedTasks.emotionManagement"
             :key="task.id"
           >
             <view class="flex-row justify-between items-center">
               <view class="flex-col flex-1">
                 <text class="font-3 task-title">{{ task.title }}</text>
                 <text class="font-3 task-description">{{ task.description }}</text>
               </view>
             </view>
             <view class="mt-10 flex-row justify-end">
               <text class="font-4 completed-date">完成于 {{ task.date }}</text>
             </view>
           </view>
         </view>

         <!-- 效率提升类 -->
         <view class="flex-row items-center group-7">
           <view class="flex-col justify-start items-center image-wrapper-3">
             <image
               class="image-7"
               src="https://ide.code.fun/api/image?token=68a209772b7b7600119d1eef&name=915c7d3d47fec642f6335191e552ad0b.png"
             />
           </view>
           <text class="ml-6 font text-9">效率提升类</text>
         </view>
         <view class="flex-col group-5">
           <view 
             class="flex-col section-5 completed-item"
             v-for="task in data.completedTasks.efficiencyImprovement"
             :key="task.id"
           >
             <view class="flex-row justify-between items-center">
               <view class="flex-col flex-1">
                 <text class="font-3 task-title">{{ task.title }}</text>
                 <text class="font-3 task-description">{{ task.description }}</text>
               </view>
             </view>
             <view class="mt-10 flex-row justify-end">
               <text class="font-4 completed-date">完成于 {{ task.date }}</text>
             </view>
           </view>
         </view>
       </view>
    </view>
  </view>
</template>

<script>
import { ref, reactive } from 'vue'

export default {
  name: 'TaskPage',
  setup() {
    // 这里可以添加任务相关的逻辑
    const goBack = () => {
      uni.navigateBack()
    }

    const currentTab = ref('pending') // 'pending' 或 'completed'

    const data = reactive({
      pendingTasks: {
        skillLearning: [
          { id: 1, title: '学习Figma变量知识', description: '掌握Figma设计系统中的变量使用方法', date: '2021.5.21', status: 'pending', isExpanded: true },
          { id: 2, title: '完成UI组件库设计', description: '设计一套完整的UI组件库', date: '2021.5.22', status: 'pending', isExpanded: true }
        ],
        emotionManagement: [
          { id: 3, title: '写交互学习日记', description: '花10分钟记录今天的学习心得', date: '2021.5.21', status: 'pending', isExpanded: false },
          { id: 4, title: '情绪调节练习', description: '进行15分钟的正念冥想', date: '2021.5.22', status: 'pending', isExpanded: false }
        ],
        efficiencyImprovement: [
          { id: 5, title: '建立Trello看板', description: '用Trello建立作品集制作看板', date: '2021.5.21', status: 'pending', isExpanded: false },
          { id: 6, title: '时间管理优化', description: '制定每日时间分配计划', date: '2021.5.22', status: 'pending', isExpanded: false }
        ]
      },
      completedTasks: {
        skillLearning: [
          { id: 7, title: '完成UI设计稿', description: '完成了一套完整的UI设计稿', date: '2021.5.20', status: 'completed' },
          { id: 8, title: '学习React基础', description: '掌握了React的基本概念和用法', date: '2021.5.19', status: 'completed' }
        ],
        emotionManagement: [
          { id: 9, title: '情绪调节练习', description: '完成了15分钟的正念冥想练习', date: '2021.5.18', status: 'completed' }
        ],
        efficiencyImprovement: [
          { id: 10, title: '完成项目文档', description: '编写了完整的项目开发文档', date: '2021.5.17', status: 'completed' }
        ]
      }
    })

    const handleAction = (action, taskId) => {
      console.log('执行操作:', action, '任务ID:', taskId)
      
      switch (action) {
        case 'complete':
          // 完成任务逻辑
          completeTask(taskId)
          break
        case 'abandon':
          // 放弃任务逻辑
          abandonTask(taskId)
          break
      }
    }

    const completeTask = (taskId) => {
      // 找到任务并移动到已完成列表
      let completedTask = null
      let taskCategory = null
      
      Object.keys(data.pendingTasks).forEach(category => {
        const taskIndex = data.pendingTasks[category].findIndex(task => task.id === taskId)
        if (taskIndex !== -1) {
          completedTask = { ...data.pendingTasks[category][taskIndex] }
          taskCategory = category
          data.pendingTasks[category].splice(taskIndex, 1)
        }
      })
      
      if (completedTask && taskCategory) {
        completedTask.status = 'completed'
        completedTask.completedDate = new Date().toLocaleDateString()
        // 按分类存储到已完成任务中
        data.completedTasks[taskCategory].unshift(completedTask)
        uni.showToast({ title: '任务已完成', icon: 'success' })
      }
    }

    const abandonTask = (taskId) => {
      // 放弃任务逻辑
      uni.showToast({ title: '任务已放弃', icon: 'none' })
    }

    const switchToPending = () => {
      currentTab.value = 'pending'
    }

    const switchToCompleted = () => {
      currentTab.value = 'completed'
    }

    const toggleTaskExpanded = (category, taskId) => {
      const task = data.pendingTasks[category].find(t => t.id === taskId);
      if (task) {
        task.isExpanded = !task.isExpanded;
      }
    };

    return {
      goBack,
      currentTab,
      data,
      switchToPending,
      switchToCompleted,
      handleAction,
      completeTask,
      abandonTask,
      toggleTaskExpanded
    }
  }
}
</script>

<style scoped>
.mt-21 {
  margin-top: 42rpx;
}
.page {
  background-color: #feefc9;
  width: 100%;
  overflow-y: auto;
  overflow-x: hidden;
  min-height: 100vh;
}
.group {
  padding: 20rpx 24rpx 28rpx 32rpx;
}
.group-2 {
  padding-left: 40rpx;
  padding-right: 4rpx;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
}
.text {
  color: #333333;
  font-size: 34rpx;
  font-family: SF Pro;
  font-weight: 600;
  line-height: 25rpx;
}
.flex-row {
  display: flex;
  flex-direction: row;
}
.flex-col {
  display: flex;
  flex-direction: column;
}
.justify-between {
  justify-content: space-between;
}
.items-center {
  align-items: center;
}
.self-stretch {
  align-self: stretch;
}
.self-start {
  align-self: flex-start;
}
.flex-1 {
  flex: 1;
}
.shrink-0 {
  flex-shrink: 0;
}
.relative {
  position: relative;
}
.mt-18 {
  margin-top: 36rpx;
}
.mt-24 {
  margin-top: 48rpx;
}
.mt-12 {
  margin-top: 24rpx;
}
.mt-8 {
  margin-top: 16rpx;
}
.mt-10 {
  margin-top: 20rpx;
}
.mt-16 {
  margin-top: 32rpx;
}
.ml-8 {
  margin-left: 16rpx;
}
.ml-16 {
  margin-left: 32rpx;
}
.ml-18 {
  margin-left: 36rpx;
}
.ml-6 {
  margin-left: 12rpx;
}
.image {
  width: 38rpx;
  height: 24rpx;
}
.image-2 {
  width: 34rpx;
  height: 24rpx;
}
.image-3 {
  width: 54rpx;
  height: 26rpx;
}
.image-4 {
  width: 48rpx;
  height: 48rpx;
  cursor: pointer;
  transition: transform 0.2s ease;
}

.image-4:hover {
  transform: scale(1.1);
}
.text-2 {
  color: #333333;
  font-size: 40rpx;
  font-family: Microsoft YaHei;
  font-weight: 700;
  line-height: 39rpx;
}
.image-5 {
  width: 136rpx;
  height: 154rpx;
}
.text-wrapper {
  padding: 8rpx 10rpx;
  background-color: #ffa93c;
  border-radius: 11rpx;
  overflow: hidden;
  width: auto;
  min-width: 37rpx;
  height: 22rpx;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}
.text-4 {
  color: #ffffff;
  font-size: 16rpx;
  font-family: Microsoft YaHei;
  font-weight: 700;
  line-height: 12rpx;
}
.group-3 {
  padding-top: 12rpx;
}
.section {
  background-color: #fee399;
  border-radius: 32rpx;
  border-left: solid 4rpx #ffffff;
  border-right: solid 4rpx #ffffff;
  border-top: solid 4rpx #ffffff;
  border-bottom: solid 4rpx #ffffff;
}
.section-2 {
  background-color: #ff9f25;
  border-radius: 32rpx;
  width: 69rpx;
  height: 24rpx;
}
.image-6 {
  border-radius: 88rpx;
  width: 30rpx;
  height: 42rpx;
}
.pos {
  position: absolute;
  left: 54rpx;
  top: 0;
}
.section-3 {
  padding: 28rpx 24rpx 88rpx;
  background-color: #ffffff;
  border-radius: 16rpx 16rpx 0 0;
  overflow: hidden;
}
.group-4 {
  padding-left: 96rpx;
  padding-right: 88rpx;
}
.font-2 {
  font-size: 28rpx;
  font-family: Microsoft YaHei;
  line-height: 28rpx;
  color: #333333;
}
.text-5 {
  font-weight: 700;
  line-height: 27rpx;
}
.section-4 {
  margin-left: 32rpx;
  background-color: #ff9f25;
  width: 72rpx;
  height: 8rpx;
}

.completed-tab-indicator {
  margin-left: auto;
  margin-right: 32rpx;
}
.image-wrapper {
  background-image: url('https://ide.code.fun/api/image?token=68a209772b7b7600119d1eef&name=c0fc7877ae91c6aeed8aa53fe9314686.png');
  background-size: 100% 100%;
  background-repeat: no-repeat;
  width: 112rpx;
  height: 112rpx;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  clip-path: polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%);
}
.image-7 {
  width: 50rpx;
  height: 50rpx;
  display: flex;
  justify-content: center;
  align-items: center;
}
.font {
  font-size: 32rpx;
  font-family: Microsoft YaHei;
  line-height: 31rpx;
  font-weight: 700;
  color: #333333;
}
.text-3 {
  line-height: 31rpx;
}
.text-6 {
  line-height: 31rpx;
}
.group-5 {
  margin-top: 16rpx;
}
.font-3 {
  font-size: 24rpx;
  font-family: Microsoft YaHei;
  line-height: 24rpx;
  color: #333333;
}
.image-8 {
  border-radius: 100rpx;
  width: 48rpx;
  height: 48rpx;
}
.text-wrapper-2 {
  background-color: #ffffff;
  border-radius: 16rpx;
  overflow: hidden;
  width: 152rpx;
  height: 72rpx;
  border-left: solid 2rpx #ff9f25;
  border-right: solid 2rpx #ff9f25;
  border-top: solid 2rpx #ff9f25;
  border-bottom: solid 2rpx #ff9f25;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}
.font-4 {
  font-size: 24rpx;
  font-family: Microsoft YaHei;
  line-height: 24rpx;
  font-weight: 700;
}
.text-7 {
  color: #ff9f25;
  line-height: 30rpx;
  font-size: 28rpx;
}
.text-wrapper-3 {
  background-color: #ff9f25;
  border-radius: 16rpx;
  overflow: hidden;
  height: 72rpx;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}
.text-8 {
  color: #ffffff;
  line-height: 30rpx;
  font-size: 28rpx;
}
.section-5 {
  padding: 12rpx 24rpx;
  background-color: #fff8e6;
  border-radius: 16rpx;
  overflow: hidden;
}
.group-6 {
  margin-top: 20rpx;
}
.image-wrapper-2 {
  background-image: url('https://ide.code.fun/api/image?token=68a209772b7b7600119d1eef&name=9131de5bf8a62a50fb70b23b95d13046.png');
  background-size: 100% 100%;
  background-repeat: no-repeat;
  width: 112rpx;
  height: 112rpx;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}
.view {
  margin-top: 32rpx;
}
.image-wrapper-3 {
  background-image: url('https://ide.code.fun/api/image?token=68a209772b7b7600119d1eef&name=569d5add04cc06e07a76db53a29b90d.png');
  background-size: 100% 100%;
  background-repeat: no-repeat;
  width: 112rpx;
  height: 112rpx;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}
.text-9 {
  line-height: 31rpx;
}

.relative {
  position: relative;
}

.dropdown-trigger {
  cursor: pointer;
  transition: transform 0.2s ease;
}

.dropdown-trigger:hover {
  transform: scale(1.1);
}

.completed-tasks {
  gap: 16rpx;
}

.completed-item {
  background-color: #f8f8f8;
  border: 1rpx solid #e0e0e0;
}

.completed-date {
  color: #666666;
  font-size: 20rpx;
}

.task-item {
  margin-bottom: 16rpx;
  transition: all 0.3s ease;
}

.task-item:hover {
  transform: translateY(-2rpx);
  box-shadow: 0 4rpx 12rpx rgba(0, 0, 0, 0.1);
}

.task-title {
  font-weight: 600;
  margin-bottom: 8rpx;
}

.task-description {
  color: #666666;
  font-size: 20rpx;
  line-height: 28rpx;
}

.text-wrapper-2,
.text-wrapper-3 {
  cursor: pointer;
  transition: all 0.2s ease;
}

.text-wrapper-2:hover {
  background-color: #f0f0f0;
  transform: scale(1.05);
}

.text-wrapper-3:hover {
  background-color: #e68a00;
  transform: scale(1.05);
}
</style>
