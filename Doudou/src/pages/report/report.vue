<template>
  <view class="report-container">
    <!-- 顶部感谢区域 -->
    <view class="header-section">
      <view class="back-button-container">
        <view @click="goBackToMap">
          <text class="back-icon">←</text>
        </view>
      </view>
      <view class="thank-you-header">
        <view class="header-content">
          <view class="header-text">
            <text class="thank-title">成长报告</text>
        <text class="thank-subtitle">DouDou陪伴你的每一步成长</text>
          </view>
        </view>
      </view>
      
      <!-- 同步按钮 -->
      <view class="sync-section">
        <view class="sync-button" @click="syncWithKnowledgeBase" :class="{ 'syncing': isSyncing }">
          <view class="sync-icon">
            <text v-if="!isSyncing">🔄</text>
            <text v-else class="spinning">⏳</text>
          </view>
          <text class="sync-text">{{ isSyncing ? '同步中...' : '同步知识库' }}</text>
        </view>
        <text class="sync-tip">点击同步最新的知识卡片数据</text>
      </view>
    </view>

    <!-- 报告内容滚动区域 -->
    <scroll-view class="report-content" scroll-y="true" :show-scrollbar="false">
      
      <!-- A. 情绪模式总结 -->
      <view class="report-section emotion-pattern">
        <view class="section-header">
          <text class="section-title">
            <text class="section-icon">💭</text>
            你的情绪小档案
          </text>
        </view>
        <view class="section-content">
          <!-- 勇气值统计 -->
          <view class="courage-stats">
            <view class="stats-card">
              <text class="stats-title">勇气值</text>
              <text class="stats-number">{{ courageValue }}</text>
              <text class="stats-desc">{{ getCourageDescription() }}</text>
              <view class="courage-explanation">
                <text class="explanation-text">💡 勇气值 = 复盘次数 + 分析次数 + 试错次数</text>
                <text class="explanation-tip">多复盘、多分析、多试错，勇气值就会提升！</text>
                </view>
              </view>
            
            <!-- 勇气值构成分析 -->
            <view class="courage-breakdown">
              <view class="breakdown-item">
                <text class="breakdown-label">复盘勇气</text>
                <text class="breakdown-count">{{ dialogueCount }}分</text>
              </view>
              <view class="breakdown-item">
                <text class="breakdown-label">分析勇气</text>
                <text class="breakdown-count">{{ problemAnalysisCount }}分</text>
              </view>
              <view class="breakdown-item">
                <text class="breakdown-label">试错</text>
                <text class="breakdown-count">{{ actionAttemptCount }}分</text>
              </view>
            </view>
          </view>
          
          <!-- 常见挑战标签 -->
          <view class="challenge-tags">
            <text class="highlights-title">你常遇到的挑战</text>
            <view class="tags-container">
              <view v-for="trigger in emotionTriggers.slice(0, 3)" :key="trigger.id" class="challenge-tag">
                <text class="tag-text">{{ trigger.text }}</text>
                <view class="tag-frequency">{{ trigger.frequency }}次</view>
              </view>
            </view>
          </view>
          
          <view class="comfort-message">
            <text class="comfort-text">{{ comfortMessage }}</text>
            </view>
        </view>
      </view>

      <!-- B. 优势画像 -->
      <view class="report-section strength-profile">
        <view class="section-header strength-header">
          <view class="title-with-icon">
            <text class="section-icon">⭐</text>
            <text class="section-title">核心优势画像</text>
          </view>
          <text class="section-subtitle">DouDou 为你分析的能力雷达图</text>
          <view class="header-doudou-large">
            <image 
              class="section-doudou-large"
              src="@/static/QA/5_matting.gif"
              mode="aspectFit"
            />
          </view>
        </view>
        <view class="section-content">
          <!-- 雷达图区域 -->
          <view class="radar-section">
            <RadarChart 
              :data="radarChartData"
              :title="'🏆 能力雷达图'"
              :subtitle="'DouDou 为你精心分析的个人能力画像'"
              :width="300"
              :height="300"
              :animated="true"
              :show-legend="false"
              :show-data-labels="true"
              :grid-color="'#e8f4fd'"
              :label-color="'#2E3A59'"
              :default-color="'#FF9500'"
              :label-offset="42"
              @chart-ready="onRadarChartReady"
            />
          </view>
          
          
        </view>
      </view>

      <!-- C. 新人进阶路线 -->
      <view class="report-section career-progression">
        <view class="section-header">
          <text class="section-title">
            <text class="section-icon">🚀</text>
            新人进阶路线
          </text>
          <view class="section-actions">
            <view class="action-btn history-btn" @click="showHistoryModal = true">
              <text class="btn-icon">📋</text>
              <text class="btn-text">历史</text>
            </view>
            <view class="action-btn manage-btn" @click="showManageModal = true">
              <text class="btn-icon">⚙️</text>
              <text class="btn-text">管理</text>
            </view>
          </view>
        </view>
        <view class="section-content">
          <view class="progression-list">
            <view 
              v-for="category in careerProgression" 
              :key="category.id" 
              class="progression-card"
            >
              <view class="category-header">
                <view class="category-info">
                  <text class="category-icon">{{ category.icon }}</text>
                  <text class="category-title">{{ category.category }}</text>
                  <text class="category-separator">｜</text>
                  <text class="category-count">任务数{{ category.tasks.filter(t => !t.completed).length }}/5</text>
              </view>
                <view class="category-actions">
                  <view class="edit-btn" @click="toggleEditMode(category.id)">
                    <text class="edit-text">{{ getEditMode(category.id) ? '完成' : '编辑' }}</text>
              </view>
                </view>
                  </view>
              <view class="tasks-list">
                <view v-if="category.tasks.filter(t => !t.completed).length === 0" class="empty-tasks">
                  <text class="empty-icon">🎉</text>
                  <text class="empty-text">太棒了！所有任务都已完成！</text>
                  <text class="empty-subtext">点击"历史"按钮查看完成记录</text>
                </view>
                <view 
                  v-for="task in category.tasks.filter(t => !t.completed)" 
                  :key="task.id" 
                  class="task-item"
                >
                  <view class="task-checkbox" @click="toggleTaskComplete(category.id, task.id)">
                    <text class="checkbox-icon">⭕</text>
              </view>
                  <view class="task-content">
                    <text class="task-title">{{ task.title }}</text>
                    <text class="task-description">{{ task.description }}</text>
                  </view>
                  <view v-if="getEditMode(category.id)" class="task-actions">
                    <view class="delete-btn" @click="deleteTask(category.id, task.id)">
                      <text class="delete-icon">🗑️</text>
                    </view>
                  </view>
                </view>
              </view>
            </view>
          </view>
        </view>
      </view>

      <!-- E.（合并后删除单独目标模块） -->

      <!-- CTA 卡片：去完成任务（作为页面内容的一部分） -->
      <view class="cta-card" @click="goBackToMap">
        <text class="cta-icon">🎯</text>
        <text class="cta-text">去完成任务</text>
      </view>
    </scroll-view>

    <!-- 历史任务完成查看弹窗 -->
    <view v-if="showHistoryModal" class="modal-overlay" @click="showHistoryModal = false">
      <view class="modal-content history-modal" @click.stop>
        <view class="modal-header">
          <text class="modal-title">📋 已完成任务</text>
          <view class="close-btn" @click="showHistoryModal = false">
            <text class="close-icon">✕</text>
          </view>
        </view>
        <view class="modal-body">
          <view v-if="getCompletedTasks().length === 0" class="empty-state">
            <text class="empty-text">暂无已完成的任务</text>
          </view>
          <view v-else class="completed-tasks">
            <view 
              v-for="task in getCompletedTasks()" 
              :key="task.id" 
              class="completed-task-item"
            >
              <view class="completed-task-header">
                <text class="completed-task-title">{{ task.title }}</text>
                <text class="completed-task-category">{{ task.categoryIcon }} {{ task.categoryName }}</text>
              </view>
              <text class="completed-task-desc">{{ task.description }}</text>
              <text class="completed-task-date">完成时间：{{ task.completedAt }}</text>
            </view>
          </view>
        </view>
      </view>
    </view>

    <!-- 任务管理弹窗 -->
    <view v-if="showManageModal" class="modal-overlay" @click="showManageModal = false">
      <view class="modal-content manage-modal" @click.stop>
        <view class="modal-header">
          <text class="modal-title">⚙️ 任务管理</text>
          <view class="close-btn" @click="showManageModal = false">
            <text class="close-icon">✕</text>
          </view>
        </view>
        <view class="modal-body">
          <view class="add-task-form">
            <view class="form-group">
              <text class="form-label">任务标题</text>
              <input 
                class="form-input" 
                v-model="newTask.title" 
                placeholder="请输入任务标题"
              />
            </view>
            <view class="form-group">
              <text class="form-label">任务描述</text>
              <textarea 
                class="form-textarea" 
                v-model="newTask.description" 
                placeholder="请输入任务描述"
              />
            </view>
            <view class="form-group">
              <text class="form-label">分类</text>
              <picker 
                :value="['软技能', '硬技能', '情绪管理'].indexOf(newTask.category)"
                :range="['软技能', '硬技能', '情绪管理']"
                @change="(e) => newTask.category = ['软技能', '硬技能', '情绪管理'][e.detail.value]"
              >
                <view class="picker-display">{{ newTask.category }}</view>
              </picker>
            </view>
            <view class="form-actions">
              <view class="btn-cancel" @click="showManageModal = false">
                <text class="btn-text">取消</text>
              </view>
              <view class="btn-confirm" @click="addNewTask">
                <text class="btn-text">添加任务</text>
              </view>
            </view>
          </view>
        </view>
      </view>
    </view>
  </view>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import RadarChart from '@/components/RadarChart.vue'
// 返回到地图页（优先返回上一页，否则重启至地图页）
const goBackToMap = () => {
  const pages = getCurrentPages && getCurrentPages()
  if (pages && pages.length > 1) {
    uni.navigateBack()
  } else {
    uni.reLaunch({ url: '/pages/map/map' })
  }
}

// A. 情绪模式总结数据
const emotionTriggers = ref([
  { id: 1, text: '害怕打扰别人', frequency: 3 },
  { id: 2, text: '担心做不好', frequency: 2 },
  { id: 3, text: '害怕被拒绝', frequency: 2 },
  { id: 4, text: '担心时间不够', frequency: 1 }
])

const comfortMessage = ref('这些都是很常见的情绪反应，说明你是一个有同理心和责任感的人。很多人都会有这样的担心，这是完全正常的体验。')

// 勇气值统计
const courageValue = ref(0)
const dialogueCount = ref(0)
const problemAnalysisCount = ref(0)
const actionAttemptCount = ref(0)

// 鼓励语池
const encouragementMessages = [
  "学生时代怕犯错，职场里敢试错才是真本事。",
  "你每一次试错，都是在为未来少踩一次坑积累经验。",
  "别怕出错，真正危险的是不敢出手。",
  "试错是职场给新人最好的福利，因为代价最小、收获最大。",
  "今天的试错，是你迈向成熟职业人的必修课。"
]

// B. 优势画像数据
const topStrengths = ref([
  { name: '沟通能力', description: '善于表达和倾听，能够有效传达想法', score: 92 },
  { name: '学习能力', description: '快速掌握新知识，持续自我提升', score: 88 },
  { name: '责任感', description: '对工作认真负责，值得信赖', score: 85 },
  { name: '执行力', description: '能够将计划转化为实际行动', score: 82 },
  { name: '团队协作', description: '善于与他人合作，营造良好氛围', score: 78 }
])

// 雷达图固定六维度
const fixedIndicators = [
  '沟通能力', '学习能力', '抗压能力', '创新能力', '团队协作', '执行力'
]
const radarChartData = ref({
  indicator: fixedIndicators.map((n) => ({ name: n, max: 100 })),
  series: [{ name: '当前能力', value: [92, 88, 75, 70, 78, 82], color: '#FF9500' }]
})

// 雷达图洞察
const radarInsights = ref([
  {
    icon: '🏆',
    title: '优势能力',
    description: '你的沟通能力表现出色（92分），这是你的核心竞争力！'
  },
  {
    icon: '🎯',
    title: '提升空间',
    description: '创新能力还有提升空间（70分），DouDou会帮你制定提升计划。'
  },
  {
    icon: '⭐',
    title: '综合评价',
    description: '你的能力均衡发展，有很好的成长潜力！'
  }
])

// C. 新人进阶路线数据 - Todo List形式
const careerProgression = ref([
  {
    id: 1,
    category: '软技能',
    icon: '🤝',
    tasks: [
      {
        id: 1,
        title: '完成月度工作汇报',
        description: '准备并完成本月的项目进展汇报，包括数据分析和成果展示',
        completed: true,
        completedAt: '2024-01-15'
  },
  {
    id: 2,
        title: '参与团队建设活动',
        description: '参加公司组织的团队建设活动，增进同事关系，提升团队协作能力',
        completed: true,
        completedAt: '2024-01-20'
  },
  {
    id: 3,
        title: '学习演讲技巧',
        description: '观看TED演讲视频，学习公众演讲技巧，提升表达能力',
        completed: false,
        completedAt: null
  },
  {
    id: 4,
        title: '主动承担项目负责人',
        description: '主动申请担任新项目的负责人角色，锻炼领导能力',
        completed: false,
        completedAt: null
      },
      {
        id: 5,
        title: '完成跨部门沟通培训',
        description: '参加跨部门沟通技巧培训，学习如何与不同部门有效协作',
        completed: true,
        completedAt: '2024-01-25'
      },
      {
        id: 6,
        title: '建立导师关系',
        description: '寻找一位经验丰富的导师，定期进行职业发展指导',
        completed: false,
        completedAt: null
      }
    ]
  },
  {
    id: 2,
    category: '硬技能',
    icon: '💻',
    tasks: [
      {
        id: 8,
        title: '掌握Excel高级功能',
        description: '学习数据透视表、VLOOKUP、宏等高级功能，提升数据处理效率',
        completed: true,
        completedAt: '2024-01-18'
      },
      {
        id: 9,
        title: '学习Python基础',
        description: '完成Python编程基础课程学习，掌握基本语法和常用库',
        completed: false,
        completedAt: null
      },
      {
        id: 10,
        title: '熟悉项目管理工具',
        description: '学习使用Jira、Trello等项目管理工具，提升工作效率',
        completed: false,
        completedAt: null
      },
      {
        id: 11,
        title: '完成数据分析报告',
        description: '使用学到的技能完成一份完整的数据分析报告',
        completed: false,
        completedAt: null
      },
      {
        id: 12,
        title: '学习SQL数据库操作',
        description: '掌握SQL基础语法，能够进行数据查询和分析',
        completed: true,
        completedAt: '2024-01-28'
      },
      {
        id: 13,
        title: '熟悉版本控制工具',
        description: '学习使用Git进行代码版本管理，提升开发协作能力',
        completed: false,
        completedAt: null
      },
      {
        id: 14,
        title: '掌握API接口调用',
        description: '学习如何调用和设计RESTful API接口',
        completed: false,
        completedAt: null
      }
    ]
  },
  {
    id: 3,
    category: '情绪管理',
    icon: '🧠',
    tasks: [
      {
        id: 16,
        title: '建立每日冥想习惯',
        description: '每天进行10分钟冥想练习，提升专注力和情绪稳定性',
        completed: true,
        completedAt: '2024-01-22'
      },
      {
        id: 17,
        title: '学习压力管理技巧',
        description: '阅读相关书籍，学习有效的压力管理方法和放松技巧',
        completed: false,
        completedAt: null
      },
      {
        id: 18,
        title: '记录情绪日记',
        description: '每天记录情绪变化，分析情绪触发因素，提升自我认知',
        completed: false,
        completedAt: null
      },
      {
        id: 19,
        title: '寻求心理咨询',
        description: '如有需要，主动寻求专业心理咨询帮助，维护心理健康',
        completed: false,
        completedAt: null
      },
      {
        id: 20,
        title: '建立健康作息',
        description: '制定并执行规律的作息时间表，保证充足睡眠',
        completed: true,
        completedAt: '2024-01-30'
      },
      {
        id: 21,
        title: '学习正念练习',
        description: '学习正念冥想技巧，提升当下意识和专注力',
        completed: false,
        completedAt: null
      },
      {
        id: 22,
        title: '建立支持网络',
        description: '与朋友、家人建立良好的支持关系，获得情感支持',
        completed: false,
        completedAt: null
      }
    ]
  }
])

// 任务管理相关状态
const showHistoryModal = ref(false)
const showManageModal = ref(false)
const editModes = ref({}) // 存储每个分类的编辑状态
const newTask = ref({
  title: '',
  description: '',
  category: '软技能'
})

// 任务管理方法
const toggleTaskComplete = (categoryId, taskId) => {
  const category = careerProgression.value.find(c => c.id === categoryId)
  if (category) {
    const task = category.tasks.find(t => t.id === taskId)
    if (task && !task.completed) {
      // 标记任务为已完成
      task.completed = true
      task.completedAt = new Date().toISOString().split('T')[0]
      
      // 显示完成提示
      uni.showToast({
        title: `✅ ${task.title} 已完成！`,
        icon: 'success',
        duration: 2000
      })
      
      // 任务会自动从列表中消失（因为使用了filter过滤）
    }
  }
}

const addNewTask = () => {
  if (!newTask.value.title.trim()) {
    uni.showToast({
      title: '请输入任务标题',
      icon: 'none'
    })
    return
  }
  
  const category = careerProgression.value.find(c => c.category === newTask.value.category)
  if (category) {
    // 检查未完成任务数量是否已达到上限
    const uncompletedTasks = category.tasks.filter(t => !t.completed)
    if (uncompletedTasks.length >= 5) {
      uni.showToast({
        title: '该分类任务已达上限(5个)，请先删除或完成现有任务',
        icon: 'none',
        duration: 3000
      })
      return
    }
    
    const newId = Math.max(...category.tasks.map(t => t.id)) + 1
    category.tasks.push({
      id: newId,
      title: newTask.value.title,
      description: newTask.value.description,
      completed: false,
      completedAt: null
    })
    
    // 重置表单
    newTask.value = {
      title: '',
      description: '',
      category: '软技能'
    }
    
    uni.showToast({
      title: '任务添加成功',
      icon: 'success'
    })
  }
}

const deleteTask = (categoryId, taskId) => {
  uni.showModal({
    title: '确认删除',
    content: '确定要删除这个任务吗？',
    success: (res) => {
      if (res.confirm) {
        const category = careerProgression.value.find(c => c.id === categoryId)
        if (category) {
          category.tasks = category.tasks.filter(t => t.id !== taskId)
          uni.showToast({
            title: '任务已删除',
            icon: 'success'
          })
        }
      }
    }
  })
}

const getCompletedTasks = () => {
  const completed = []
  careerProgression.value.forEach(category => {
    category.tasks.forEach(task => {
      if (task.completed) {
        completed.push({
          ...task,
          categoryName: category.category,
          categoryIcon: category.icon
        })
      }
    })
  })
  return completed.sort((a, b) => new Date(b.completedAt) - new Date(a.completedAt))
}

// 编辑模式管理
const toggleEditMode = (categoryId) => {
  editModes.value[categoryId] = !editModes.value[categoryId]
}

const getEditMode = (categoryId) => {
  return editModes.value[categoryId] || false
}


// 已删除 D. 思维转型对照数据

// E. 目标展示数据（重点内容）
const goalShowcase = ref([
  {
    id: 1,
    title: '提升团队领导力',
    progress: 75,
    strength: '沟通能力和同理心',
    action: '每周组织团队分享会，主动了解成员需求',
    outcome: '团队满意度提升，项目交付质量改善',
    actualProgress: '已完成3次分享会',
    progressDesc: '团队满意度提升'
  },
  {
    id: 2,
    title: '掌握数据分析技能',
    progress: 60,
    strength: '学习能力和逻辑思维',
    action: '每天学习1小时数据分析工具，完成3个实践项目',
    outcome: '能够独立完成数据分析报告，为决策提供支持',
    actualProgress: '完成1个实践项目',
    progressDesc: '独立完成分析报告'
  },
  {
    id: 3,
    title: '建立个人品牌',
    progress: 45,
    strength: '专业能力和表达能力',
    action: '每月发布2篇专业文章，参与行业交流活动',
    outcome: '在行业内建立影响力，获得更多合作机会',
    actualProgress: '发布2篇专业文章',
    progressDesc: '获得行业认可'
  }
])


// 计算属性
const radarClipPath = computed(() => {
  const points = radarAxes.value.map(axis => {
    const x = 50 + (axis.value / 100) * 40 * Math.cos((axis.angle - 90) * Math.PI / 180)
    const y = 50 + (axis.value / 100) * 40 * Math.sin((axis.angle - 90) * Math.PI / 180)
    return `${x}% ${y}%`
  }).join(', ')
  return `polygon(${points})`
})

// 雷达图准备就绪回调
const onRadarChartReady = () => {
  console.log('雷达图加载完成')
}

// 同步状态
const isSyncing = ref(false)

// 生命周期
onMounted(() => {
  console.log('动态报告页面加载完成')
  // 优先从"复盘知识库"载入数据以填充报告
  loadFromKnowledgeStorage()
})

// 从本地"知识库"载入数据以驱动报告各模块
const loadFromKnowledgeStorage = () => {
  try {
    const cards = uni.getStorageSync('knowledge_cards') || []
    if (!Array.isArray(cards) || cards.length === 0) return

    // 计算各类试错次数
    let totalCount = 0
    let dialogueCountTotal = 0
    let problemAnalysisTotal = 0
    let actionAttemptTotal = 0
    
    cards.forEach(card => {
      // 对话复盘次数
      const chatCount = card.chatCount || 0
      dialogueCountTotal += chatCount
      
      // 问题分析次数（基于失败分析）
      if (card.failureAnalysis) {
        const externalFactors = card.failureAnalysis.externalFactors?.length || 0
        const internalFactors = card.failureAnalysis.internalFactors?.length || 0
        const keyObstacles = card.failureAnalysis.keyObstacles?.length || 0
        problemAnalysisTotal += externalFactors + internalFactors + keyObstacles
      }
      
      // 行动尝试次数
      if (card.actionPlan && card.actionPlan.length > 0) {
        actionAttemptTotal += card.actionPlan.length
      }
    })
    
    // 更新统计数据
    courageValue.value = dialogueCountTotal + problemAnalysisTotal + actionAttemptTotal
    dialogueCount.value = dialogueCountTotal
    problemAnalysisCount.value = problemAnalysisTotal
    actionAttemptCount.value = actionAttemptTotal

    // 使用最近一张知识卡片作为数据源
    const latest = cards[0]

    // A. 情绪模式/安慰文案（用 summary/insights 近似映射）
    if (latest.summary && typeof latest.summary === 'string') {
      comfortMessage.value = latest.summary.substring(0, 80)
    } else {
      // 基于勇气值智能选择鼓励语
      let selectedMessage = ''
      if (courageValue.value >= 20) {
        // 高勇气值：选择强调职场试错价值的语句
        selectedMessage = encouragementMessages[0] // "学生时代怕犯错，职场里敢试错才是真本事。"
      } else if (courageValue.value >= 15) {
        // 中高勇气值：选择强调经验积累的语句
        selectedMessage = encouragementMessages[1] // "你每一次试错，都是在为未来少踩一次坑积累经验。"
      } else if (courageValue.value >= 10) {
        // 中等勇气值：选择鼓励出手的语句
        selectedMessage = encouragementMessages[2] // "别怕出错，真正危险的是不敢出手。"
      } else if (courageValue.value >= 5) {
        // 中低勇气值：选择强调福利的语句
        selectedMessage = encouragementMessages[3] // "试错是职场给新人最好的福利，因为代价最小、收获最大。"
      } else {
        // 低勇气值：选择强调必修课的语句
        selectedMessage = encouragementMessages[4] // "今天的试错，是你迈向成熟职业人的必修课。"
      }
      comfortMessage.value = selectedMessage
    }
    if (Array.isArray(latest.insights) && latest.insights.length) {
      // 将洞察前三条映射为"常见挑战"展示，转换为直白易懂的标签
      emotionTriggers.value = latest.insights.slice(0, 3).map((text, i) => ({
        id: i + 1,
        text: convertToSimpleLabel(String(text)), // 转换为直白标签
        frequency: Math.max(1, Math.min(8, dialogueCount.value - i)) // 基于对话次数，限制在1-8之间
      }))
      radarInsights.value = latest.insights.slice(0, 3).map((text) => ({
        icon: '💡',
        title: '洞察',
        description: String(text)
      }))
    }

    // B. 优势画像（用 tags 近似：分值做简单衰减）
    if (Array.isArray(latest.tags) && latest.tags.length) {
      topStrengths.value = latest.tags.slice(0, 5).map((tag, idx) => ({
        name: String(tag),
        description: '来自知识库标签',
        score: Math.max(60, 92 - idx * 6)
      }))
      // 固定六维度：将标签映射到固定维度，剩余用默认值
      const values = fixedIndicators.map((_, i) => Math.max(55, 90 - i * 5))
      radarChartData.value = {
        indicator: fixedIndicators.map((n) => ({ name: n, max: 100 })),
        series: [{ name: '当前能力', value: values, color: '#FF9500' }]
      }
    }

    // C. 新人进阶路线（保持原有的模拟数据，不覆盖）
    // 注释掉原有的数据覆盖逻辑，保持模拟数据
    /*
    if (Array.isArray(latest.chats) && latest.chats.length) {
      const chatCount = latest.chats.length
      const tagCount = latest.tags?.length || 0
      
      careerProgression.value = [
        {
          id: 1,
          category: '软技能',
          icon: '🤝',
          skills: [
            {
              name: '沟通表达',
              progress: `已完成${Math.min(chatCount, 3)}次汇报`,
              desc: '提升表达能力'
            },
            {
              name: '团队协作',
              progress: `参与${Math.min(chatCount + 1, 4)}个项目`,
              desc: '增强协作能力'
            },
            {
              name: '领导力',
              progress: `带领${Math.min(Math.floor(chatCount / 2), 2)}个小组`,
              desc: '培养领导潜质'
            }
          ]
        },
        {
          id: 2,
          category: '硬技能',
          icon: '💻',
          skills: [
            {
              name: '专业技能',
              progress: `掌握${Math.min(tagCount, 3)}个工具`,
              desc: '提升专业能力'
            },
            {
              name: '数据分析',
              progress: `完成${Math.min(chatCount, 2)}个分析`,
              desc: '增强分析能力'
            },
            {
              name: '项目管理',
              progress: `管理${Math.min(Math.floor(chatCount / 3), 1)}个项目`,
              desc: '培养管理技能'
            }
          ]
        },
        {
          id: 3,
          category: '情绪管理',
          icon: '🧠',
          skills: [
            {
              name: '压力管理',
              progress: `应对${Math.min(chatCount, 4)}次挑战`,
              desc: '提升抗压能力'
            },
            {
              name: '情绪调节',
              progress: `调节${Math.min(chatCount - 1, 3)}次情绪`,
              desc: '增强情绪控制'
            },
            {
              name: '心态调整',
              progress: `调整${Math.min(Math.floor(chatCount / 2), 2)}次心态`,
              desc: '培养积极心态'
            }
          ]
        }
      ]
    }
    */

    // 已删除 D. 思维转型自动映射逻辑

    // E. 目标展示（基于标签/对话数量生成占位目标）
    const goalBase = (latest.tags && latest.tags[0]) ? String(latest.tags[0]) : '提升沟通能力'
    const chatCount = latest.chatCount || 0
    const tagCount = latest.tags?.length || 0
    
    goalShowcase.value = [
      {
        id: 1,
        title: `围绕"${goalBase}"的实践`,
        progress: 65,
        strength: goalBase,
        action: '每周输出复盘卡1张，复盘一次对话',
        outcome: '沉淀方法论，提升落地能力',
        actualProgress: `已完成${Math.min(chatCount, 5)}次对话复盘`,
        progressDesc: '方法论已沉淀'
      },
      {
        id: 2,
        title: '构建复盘-行动闭环',
        progress: 50,
        strength: '持续学习',
        action: '知识卡片→行动清单→复盘更新',
        outcome: '形成稳定成长节奏',
        actualProgress: `生成${Math.min(tagCount, 3)}个知识卡片`,
        progressDesc: '成长节奏稳定'
      }
    ]
  } catch (e) {
    console.warn('加载知识库卡片失败：', e)
  }
}

// 获取勇气值描述
const getCourageDescription = () => {
  if (courageValue.value >= 20) {
    return "职场试错达人，勇气可嘉！"
  } else if (courageValue.value >= 15) {
    return "勇敢尝试，不断成长中"
  } else if (courageValue.value >= 10) {
    return "开始展现勇气，继续加油"
  } else if (courageValue.value >= 5) {
    return "勇气正在积累中"
  } else {
    return "每一次尝试都是勇气的体现"
  }
}

// 将复杂洞察文本转换为直白易懂的标签
const convertToSimpleLabel = (text) => {
  const lowerText = text.toLowerCase()
  
  // 定义关键词映射
  const keywordMap = {
    // 情绪相关
    '害怕': '害怕失败',
    '担心': '担心出错', 
    '焦虑': '容易焦虑',
    '紧张': '容易紧张',
    '压力': '压力过大',
    '恐惧': '害怕挑战',
    '不安': '内心不安',
    '犹豫': '犹豫不决',
    '胆怯': '缺乏勇气',
    '退缩': '容易退缩',
    
    // 能力相关
    '能力': '能力不足',
    '技能': '技能欠缺',
    '经验': '经验不够',
    '知识': '知识盲区',
    '技巧': '技巧生疏',
    '方法': '方法不当',
    '策略': '策略失误',
    '思路': '思路不清',
    '逻辑': '逻辑混乱',
    '表达': '表达不清',
    
    // 行为相关
    '拖延': '习惯拖延',
    '逃避': '习惯逃避',
    '放弃': '容易放弃',
    '退缩': '容易退缩',
    '被动': '过于被动',
    '依赖': '过度依赖',
    '完美': '追求完美',
    '控制': '控制欲强',
    '固执': '过于固执',
    '冲动': '容易冲动',
    
    // 环境相关
    '环境': '环境不利',
    '条件': '条件不足',
    '资源': '资源缺乏',
    '支持': '缺乏支持',
    '理解': '不被理解',
    '认可': '缺乏认可',
    '机会': '机会有限',
    '时间': '时间不够',
    '空间': '空间受限',
    '氛围': '氛围不佳',
    
    // 关系相关
    '沟通': '沟通困难',
    '合作': '合作不畅',
    '冲突': '容易冲突',
    '误解': '容易误解',
    '孤立': '感到孤立',
    '排斥': '被排斥感',
    '竞争': '竞争激烈',
    '比较': '过度比较',
    '评价': '在意评价',
    '批评': '害怕批评',
    
    // 职场相关
    '主动': '缺乏主动性',
    '暴露': '害怕暴露',
    '问题': '问题处理',
    '职场': '职场适应',
    '领导': '领导力不足',
    '团队': '团队协作',
    '项目': '项目管理',
    '汇报': '汇报困难',
    '会议': '会议参与',
    '客户': '客户沟通',
    
    // 心理相关
    '心理': '心理压力',
    '心态': '心态调整',
    '情绪': '情绪管理',
    '自信': '缺乏自信',
    '勇气': '缺乏勇气',
    '坚持': '难以坚持',
    '耐心': '缺乏耐心',
    '专注': '专注力差',
    '记忆': '记忆力差',
    '理解': '理解困难'
  }
  
  // 查找匹配的关键词
  for (const [keyword, label] of Object.entries(keywordMap)) {
    if (lowerText.includes(keyword)) {
      return label
    }
  }
  
  // 如果没有匹配到关键词，尝试提取核心概念
  if (lowerText.includes('大脑空白') || lowerText.includes('思维') || lowerText.includes('思考') || lowerText.includes('脑子')) {
    return '思维卡顿'
  }
  if (lowerText.includes('准备') || lowerText.includes('计划') || lowerText.includes('规划') || lowerText.includes('充分')) {
    return '准备不足'
  }
  if (lowerText.includes('执行') || lowerText.includes('行动') || lowerText.includes('实施') || lowerText.includes('落实')) {
    return '执行力差'
  }
  if (lowerText.includes('学习') || lowerText.includes('掌握') || lowerText.includes('理解') || lowerText.includes('学会')) {
    return '学习困难'
  }
  if (lowerText.includes('创新') || lowerText.includes('创造') || lowerText.includes('突破') || lowerText.includes('新颖')) {
    return '缺乏创新'
  }
  if (lowerText.includes('时间') || lowerText.includes('效率') || lowerText.includes('快速') || lowerText.includes('速度')) {
    return '效率低下'
  }
  if (lowerText.includes('专注') || lowerText.includes('集中') || lowerText.includes('分心') || lowerText.includes('注意力')) {
    return '专注力差'
  }
  if (lowerText.includes('自信') || lowerText.includes('信心') || lowerText.includes('底气') || lowerText.includes('勇气')) {
    return '缺乏自信'
  }
  if (lowerText.includes('决策') || lowerText.includes('选择') || lowerText.includes('判断') || lowerText.includes('决定')) {
    return '决策困难'
  }
  if (lowerText.includes('适应') || lowerText.includes('变化') || lowerText.includes('灵活') || lowerText.includes('调整')) {
    return '适应力差'
  }
  
  // 如果都没有匹配，尝试智能截取
  if (text.length <= 8) {
    return text
  } else if (text.length <= 12) {
    return text.substring(0, 8) + '...'
  } else {
    // 尝试在合适的位置截断
    const truncateAt = text.indexOf('，') !== -1 ? text.indexOf('，') : 
                      text.indexOf('。') !== -1 ? text.indexOf('。') :
                      text.indexOf('的') !== -1 ? text.indexOf('的') + 1 :
                      8
    return text.substring(0, truncateAt) + '...'
  }
}

// 同步知识库数据
const syncWithKnowledgeBase = async () => {
  if (isSyncing.value) return
  
  try {
    isSyncing.value = true
    
    // 显示同步提示
    uni.showToast({
      title: '正在同步知识库...',
      icon: 'loading',
      duration: 1000
    })
    
    // 模拟同步延迟，让用户看到同步过程
    await new Promise(resolve => setTimeout(resolve, 800))
    
    // 重新加载知识库数据
    loadFromKnowledgeStorage()
    
    // 显示同步成功提示
    uni.showToast({
      title: '同步完成！',
      icon: 'success',
      duration: 1500
    })
    
  } catch (error) {
    console.error('同步知识库失败：', error)
    uni.showToast({
      title: '同步失败，请重试',
      icon: 'error',
      duration: 2000
    })
  } finally {
    isSyncing.value = false
  }
}
</script>

<style lang="scss" scoped>
/* 全局样式 - 防止水平滚动 */
* {
  box-sizing: border-box;
}

.report-container {
  min-height: 100vh;
  background: #ffffff;
  padding-bottom: 68px; /* 为底部导航栏留出空间 */
  width: 100%;
  box-sizing: border-box;
  overflow-x: hidden; /* 防止水平滚动 */
}

/* CTA卡片（嵌入内容，不固定） */
.cta-card {
  margin: 30rpx 20rpx 50rpx 20rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 14rpx;
  padding: 22rpx 28rpx;
  border-radius: 22rpx;
  background: linear-gradient(135deg, #FF9500 0%, #FFB84D 100%);
  color: #ffffff;
  box-shadow: 0 12rpx 28rpx rgba(255, 149, 0, 0.25), 0 4rpx 10rpx rgba(0, 0, 0, 0.08);
  border: 2rpx solid rgba(255, 255, 255, 0.6);
}

/* 去除点击缩放与浮动动画，保持稳定位置与外观 */

.cta-icon {
  font-size: 30rpx;
  filter: drop-shadow(0 2rpx 4rpx rgba(0,0,0,0.15));
}

.cta-text {
  font-size: 30rpx;
  font-weight: 800;
  letter-spacing: 1rpx;
  text-shadow: 0 1rpx 2rpx rgba(0,0,0,0.15);
}

/* 顶部感谢区域 */
.header-section {
  padding: 120rpx 20rpx 40rpx 10rpx;
  text-align: left;
  background: url('/static/beijing.png') no-repeat center center;
  background-size: cover;
  border-radius: 0 0 30rpx 30rpx;
}

.back-button-container {
  position: absolute;
  top: 24rpx;
  left: 20rpx;
  z-index: 50;
}

.back-button {
  display: flex;
  align-items: center;
  gap: 14rpx;
  padding: 16rpx 24rpx;
  background: linear-gradient(135deg, rgba(255, 239, 224, 0.85) 0%, rgba(255, 225, 181, 0.75) 100%);
  border: 2rpx solid rgba(242, 158, 56, 0.55);
  border-radius: 999rpx;
  box-shadow: 0 10rpx 24rpx rgba(255, 149, 0, 0.22), 0 2rpx 8rpx rgba(0, 0, 0, 0.06);
  transition: all 0.3s ease;
  backdrop-filter: blur(8rpx);
  position: relative;
  overflow: hidden;
}

.back-button::before {
  content: '';
  position: absolute;
  inset: 0;
  border-radius: 999rpx;
  padding: 2rpx;
  background: linear-gradient(135deg, rgba(242,158,56,.45), rgba(255,184,77,.35));
  -webkit-mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
  -webkit-mask-composite: xor;
          mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
          mask-composite: exclude;
  pointer-events: none;
}

.back-button::after {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 40%;
  background: linear-gradient(180deg, rgba(255,255,255,.35), rgba(255,255,255,0));
  border-top-left-radius: 999rpx;
  border-top-right-radius: 999rpx;
  pointer-events: none;
}

.back-icon {
  width: 36rpx;
  height: 36rpx;
  border-radius: 50%;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  font-size: 24rpx;
  color: #ffffff;
  font-weight: 800;
  background: linear-gradient(135deg, #FF9500, #FFB84D);
  box-shadow: 0 4rpx 10rpx rgba(255, 149, 0, 0.35);
  border: 1rpx solid rgba(255, 255, 255, 0.6);
}

.back-label {
  font-size: 24rpx;
  font-weight: 800;
  letter-spacing: 1rpx;
  background: linear-gradient(135deg, #2E3A59 0%, #F29E38 100%);
  background-clip: text;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  text-shadow: 0 1rpx 2rpx rgba(0,0,0,0.08);
}

.back-button:hover {
  transform: translateY(-2rpx);
  box-shadow: 0 14rpx 30rpx rgba(255, 149, 0, 0.28), 0 6rpx 12rpx rgba(0, 0, 0, 0.08);
  background: linear-gradient(135deg, rgba(255, 230, 204, 0.9) 0%, rgba(255, 237, 204, 0.8) 100%);
}

.back-button:active {
  transform: scale(0.98);
  box-shadow: 0 10rpx 22rpx rgba(255, 149, 0, 0.26), 0 4rpx 10rpx rgba(0, 0, 0, 0.08);
}


.thank-you-header {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 20rpx;
  padding: 0 20rpx 0 0;
}

.header-content {
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  gap: 30rpx;
}

.header-text {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  justify-content: flex-start;
  gap: 15rpx;
  flex: 1;
  text-align: left;
  width: 100%;
  margin-left: 20rpx;
}

.header-image {
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.doudou-avatar {
  width: 120rpx;
  height: 120rpx;
  border-radius: 60rpx;
  box-shadow: 0 8rpx 24rpx rgba(255, 149, 0, 0.2);
}


.thank-title {
  font-size: 64rpx;
  font-weight: 700;
  color: #2E3A59;
  text-shadow: 0 2rpx 8rpx rgba(255, 255, 255, 0.3);
  letter-spacing: 2rpx;
  text-align: left;
  align-self: flex-start;
}

.thank-subtitle {
  font-size: 28rpx;
  color: #666;
  text-shadow: 0 1rpx 4rpx rgba(255, 255, 255, 0.2);
  text-align: left;
  align-self: flex-start;
}

/* 同步按钮样式 */
.sync-section {
  margin-top: 40rpx;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 15rpx;
}

.sync-button {
  display: flex;
  align-items: center;
  gap: 15rpx;
  padding: 24rpx 48rpx;
  background: linear-gradient(135deg, #FFE8CC 0%, #FFD79A 50%, #FFECB3 100%);
  border-radius: 60rpx;
  box-shadow: 
    0 12rpx 30rpx rgba(255, 149, 0, 0.4),
    0 6rpx 12rpx rgba(0, 0, 0, 0.1),
    inset 0 1rpx 0 rgba(255, 255, 255, 0.2);
  transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
  position: relative;
  overflow: hidden;
  backdrop-filter: blur(10rpx);
  border: 2rpx solid rgba(255, 255, 255, 0.2);
  
  &:active {
    transform: scale(0.95);
    box-shadow: 
      0 8rpx 20rpx rgba(255, 149, 0, 0.5),
      0 4rpx 8rpx rgba(0, 0, 0, 0.15);
  }
  
  &.syncing {
    background: linear-gradient(135deg, #FFD0B3 0%, #FFC38A 50%, #FFECB3 100%);
    box-shadow: 
      0 12rpx 30rpx rgba(255, 107, 53, 0.4),
      0 6rpx 12rpx rgba(0, 0, 0, 0.1),
      inset 0 1rpx 0 rgba(255, 255, 255, 0.2);
  }
  
  &::before {
    content: '';
    position: absolute;
    top: -50%;
    left: -50%;
    width: 200%;
    height: 200%;
    background: conic-gradient(
      from 0deg,
      transparent 0deg,
      rgba(255, 255, 255, 0.1) 90deg,
      transparent 180deg,
      rgba(255, 255, 255, 0.1) 270deg,
      transparent 360deg
    );
    animation: syncRotate 2s linear infinite;
    z-index: 0;
  }
  
  &::after {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: linear-gradient(135deg, rgba(255, 255, 255, 0.1) 0%, rgba(255, 255, 255, 0.05) 100%);
    border-radius: 60rpx;
    z-index: 1;
  }
  
  &:hover {
    transform: translateY(-4rpx) scale(1.02);
    box-shadow: 
      0 16rpx 40rpx rgba(255, 149, 0, 0.5),
      0 8rpx 16rpx rgba(0, 0, 0, 0.15),
      inset 0 1rpx 0 rgba(255, 255, 255, 0.3);
  }
}

@keyframes syncRotate {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

.sync-icon {
  font-size: 32rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  
  .spinning {
    animation: spin 1s linear infinite;
  }
}

@keyframes spin {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

.sync-text {
  font-size: 28rpx;
  color: white;
  font-weight: 600;
  text-shadow: 0 1rpx 3rpx rgba(0, 0, 0, 0.2);
}

.sync-tip {
  font-size: 24rpx;
  color: #999;
  text-align: center;
  opacity: 0.8;
}

/* 顶部导航栏 */
.header-toolbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 15px 20px;
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(10px);
  border-bottom: 1px solid rgba(0, 0, 0, 0.1);
}

.toolbar-left {
  display: flex;
  align-items: center;
  gap: 15px;
}

.back-button {
  padding: 8px 16px;
  background: rgba(102, 126, 234, 0.1);
  border-radius: 20px;
}

.back-text {
  color: #667eea;
  font-size: 14px;
  font-weight: 500;
}

.page-title {
  font-size: 18px;
  font-weight: 600;
  color: #333;
}

.header-buttons {
  display: flex;
  gap: 10px;
}

.header-btn {
  padding: 8px 12px;
  background: rgba(102, 126, 234, 0.1);
  border-radius: 15px;
}

.btn-text {
  color: #667eea;
  font-size: 12px;
  font-weight: 500;
}

/* 报告内容区域 */
.report-content {
  padding: 0 20rpx;
  width: 100%;
  box-sizing: border-box;
  overflow-x: hidden;
  background: #ffffff;
}

/* 报告部分样式 */
.report-section {
  padding: 32rpx;
  margin: 0 auto 44rpx auto;
  width: 100%;
  max-width: 750rpx;
  box-sizing: border-box;
}

.section-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 20rpx;
  margin-bottom: 26rpx;
  padding: 20rpx 22rpx;
  background: linear-gradient(135deg, rgba(255, 243, 224, 0.9), rgba(255, 255, 255, 0.9));
  border-radius: 22rpx;
  border: 2rpx solid rgba(255, 193, 7, 0.15);
  box-shadow: 0 6rpx 18rpx rgba(255, 193, 7, 0.12);
}

.section-title {
  font-size: 34rpx;
  font-weight: 800;
  color: #2E3A59;
  line-height: 1.2;
  display: inline-flex;
  align-items: center;
  gap: 10rpx;
}
.section-title::before {
  content: '';
  width: 12rpx; height: 12rpx; border-radius: 50%;
  background: linear-gradient(135deg, #FFC58F, #FF9500);
  box-shadow: 0 0 0 6rpx rgba(255, 149, 0, 0.12);
}

.section-icon {
  font-size: 32rpx;
  color: #F29E38;
  margin-bottom: 5rpx;
}

.section-content { line-height: 1.7; position: relative; }

/* 分割线（淡渐变） */
.section-divider {
  height: 2rpx;
  background: linear-gradient(90deg, rgba(255,149,0,0), rgba(255,149,0,.35), rgba(255,149,0,0));
  margin: 20rpx 0;
}

/* A. 情绪模式总结样式 */
.emotion-pattern {
  background: #ffffff;
  border-radius: 20rpx;
  border: 1rpx solid rgba(0, 0, 0, 0.05);
}

/* 勇气值统计样式 */
.courage-stats {
  margin-bottom: 30rpx;
}

.stats-card {
  background: #FFFFFF;
  border-radius: 16rpx;
  padding: 36rpx 28rpx;
  text-align: center;
  border: 1rpx solid rgba(0, 0, 0, 0.08);
  box-shadow: 0 4rpx 10rpx rgba(0,0,0,0.06);
  margin: 0 20rpx;
}

.stats-card::before {
  content: '';
  position: absolute;
  top: -50%;
  left: -50%;
  width: 200%;
  height: 200%;
  background: conic-gradient(
    from 0deg,
    transparent 0deg,
    rgba(255, 255, 255, 0.1) 90deg,
    transparent 180deg,
    rgba(255, 255, 255, 0.1) 270deg,
    transparent 360deg
  );
  animation: rotate 4s linear infinite;
  z-index: 0;
}

.stats-card::after {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(135deg, rgba(255, 255, 255, 0.1) 0%, rgba(255, 255, 255, 0.05) 100%);
  border-radius: 24rpx;
  z-index: 1;
}

@keyframes rotate {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

.stats-title {
  display: block;
  font-size: 40rpx;
  color: #F29E38;
  font-weight: 700;
  margin-bottom: 12rpx;
  text-shadow: 0 2rpx 6rpx rgba(242, 158, 56, 0.25);
}

.stats-number {
  display: block;
  font-size: 80rpx;
  font-weight: 800;
  margin-bottom: 8rpx;
  line-height: 1.05;
  letter-spacing: 2rpx;
  background: linear-gradient(135deg, #FF9500 0%, #FFB84D 100%);
  background-clip: text;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  text-shadow: 0 3rpx 10rpx rgba(255, 149, 0, 0.28);
}

.stats-desc {
  display: block;
  font-size: 24rpx;
  color: #6B7280;
  font-weight: 500;
  margin-bottom: 8rpx;
}

.courage-explanation {
  margin-top: 16rpx;
  padding: 16rpx 18rpx;
  background: #F8FAFC;
  border-radius: 12rpx;
  border: 1rpx solid rgba(15, 23, 42, 0.06);
  display: flex;
  flex-direction: column;
  gap: 6rpx;
  position: relative;
}

.courage-explanation::before {
  content: '';
  position: absolute;
  left: 0;
  top: 0;
  bottom: 0;
  width: 6rpx;
  border-radius: 12rpx 0 0 12rpx;
  background: #F29E38;
}

.explanation-text {
  display: block;
  font-size: 24rpx;
  color: #111827;
  font-weight: 700;
  margin: 0;
  line-height: 1.35;
}

.explanation-tip {
  display: block;
  font-size: 22rpx;
  color: #6B7280;
  font-weight: 500;
  line-height: 1.4;
}

@keyframes pulse {
  0%, 100% { 
    transform: scale(1);
    text-shadow: 
      0 4rpx 8rpx rgba(0, 0, 0, 0.3),
      0 0 20rpx rgba(255, 255, 255, 0.5);
  }
  50% { 
    transform: scale(1.05);
    text-shadow: 
      0 6rpx 12rpx rgba(0, 0, 0, 0.4),
      0 0 30rpx rgba(255, 255, 255, 0.7);
  }
}

/* 勇气值构成分析样式 */
.courage-breakdown {
  display: flex;
  justify-content: space-around;
  margin-top: 20rpx;
  padding: 20rpx 16rpx;
  background: #FFFFFF;
  border-radius: 12rpx;
  border: 1rpx solid rgba(0,0,0,0.06);
  box-shadow: 0 4rpx 10rpx rgba(0,0,0,0.06);
}

.breakdown-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10rpx;
  flex: 1;
  padding: 15rpx 10rpx;
  border-radius: 12rpx;
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;
}

.breakdown-item::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(242, 158, 56, 0.08);
  border-radius: 16rpx;
  opacity: 0;
  transition: opacity 0.3s ease;
}

.breakdown-item:hover::before {
  opacity: 1;
}

.breakdown-item:hover {
  transform: translateY(-3rpx);
  box-shadow: 0 6rpx 14rpx rgba(0, 0, 0, 0.08);
}

.breakdown-label {
  font-size: 24rpx;
  color: #374151;
  font-weight: 600;
  text-align: center;
  position: relative;
  z-index: 1;
}

.breakdown-count {
  font-size: 34rpx;
  color: #DC6803;
  font-weight: 800;
  text-shadow: none;
  position: relative;
  z-index: 1;
  animation: none;
}

@keyframes countGlow {
  0%, 100% { 
    color: #F29E38;
    text-shadow: 0 2rpx 4rpx rgba(255, 149, 0, 0.2);
  }
  50% { 
    color: #F4AA52;
    text-shadow: 0 2rpx 8rpx rgba(255, 143, 0, 0.4);
  }
}

/* 常见挑战标题 */
.highlights-title {
  display: block;
  font-size: 30rpx;
  color: #1F2937;
  font-weight: 700;
  margin: 4rpx 20rpx 16rpx 20rpx;
  text-align: left;
  position: relative;
}

.highlights-title::after {
  content: '';
  display: block;
  height: 2rpx;
  width: 64rpx;
  background: rgba(31, 41, 55, 0.12);
  margin-top: 8rpx;
  border-radius: 2rpx;
}

/* 挑战标签容器 */
.challenge-tags {
  margin: 24rpx 0 28rpx 0;
}

.tags-container {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 16rpx;
  align-items: stretch;
  padding: 0 20rpx;
}

.challenge-tag {
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  gap: 12rpx;
  background: #FFFFFF;
  border: 1rpx solid rgba(0,0,0,0.08);
  border-radius: 14rpx;
  padding: 16rpx 16rpx 16rpx 20rpx;
  box-shadow: 0 4rpx 10rpx rgba(0,0,0,0.06);
  transition: transform 0.2s ease, box-shadow 0.2s ease;
  min-height: 72rpx;
  position: relative;
}

.challenge-tag::before {
  content: '';
  position: absolute;
  left: 0;
  top: 8rpx;
  bottom: 8rpx;
  width: 6rpx;
  border-radius: 12rpx 0 0 12rpx;
  background: #F29E38;
}

.challenge-tag::after {
  content: '';
  position: absolute;
  inset: 0;
  background: transparent;
  border-radius: 14rpx;
}

.challenge-tag:hover {
  transform: translateY(-2rpx);
  box-shadow: 0 6rpx 14rpx rgba(0, 0, 0, 0.08);
  background: #F9FAFB;
}

@keyframes tagRotate {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

.tag-text {
  font-size: 26rpx;
  color: #111827;
  font-weight: 600;
  line-height: 1.35;
  word-wrap: break-word;
  word-break: break-all;
  white-space: normal;
  flex: 1;
}

.tag-frequency {
  background: #FFF7ED;
  color: #92400E;
  font-size: 22rpx;
  font-weight: 700;
  padding: 6rpx 12rpx;
  border-radius: 12rpx;
  min-width: 54rpx;
  text-align: center;
  box-shadow: 0 2rpx 6rpx rgba(0, 0, 0, 0.06);
  border: 1rpx solid rgba(146, 64, 14, 0.12);
}

@keyframes frequencyPulse {
  0%, 100% { 
    transform: scale(1);
    box-shadow: 
      0 4rpx 8rpx rgba(255, 107, 53, 0.4),
      inset 0 1rpx 0 rgba(255, 255, 255, 0.2);
  }
  50% { 
    transform: scale(1.1);
    box-shadow: 
      0 6rpx 12rpx rgba(255, 107, 53, 0.6),
      inset 0 1rpx 0 rgba(255, 255, 255, 0.3);
  }
}

.emotion-highlights {
  display: flex;
  flex-direction: column;
  gap: 15rpx;
  margin-bottom: 25rpx;
}

.emotion-highlight {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  padding: 20rpx;
  background: rgba(255, 255, 255, 0.9);
  border-radius: 20rpx;
  border-left: 4rpx solid #4CAF50;
  box-shadow: 0 4rpx 15rpx rgba(0, 0, 0, 0.1);
  gap: 15rpx;
  min-height: auto;
}

.emotion-text {
  font-size: 28rpx;
  color: #333;
  font-weight: 500;
  flex: 1;
  line-height: 1.4;
  word-wrap: break-word;
  word-break: break-all;
  white-space: normal;
  min-width: 0;
}

.emotion-badge {
  background: linear-gradient(135deg, #4CAF50, #45a049);
  color: white;
  padding: 8rpx 16rpx;
  border-radius: 20rpx;
  font-size: 24rpx;
  font-weight: 600;
  flex-shrink: 0;
  align-self: flex-start;
  margin-top: 5rpx;
}

.comfort-message {
  padding: 18rpx 20rpx;
  background: #F8FAFC;
  border-radius: 12rpx;
  border: 1rpx solid rgba(15, 23, 42, 0.06);
}

.comfort-text {
  font-size: 24rpx;
  color: #374151;
  line-height: 1.6;
}

/* B. 优势画像样式 */
.strength-profile {
  background: #ffffff;
  border-radius: 20rpx;
  border: 1rpx solid rgba(0, 0, 0, 0.05);
}

/* 核心优势画像专用样式 */
.strength-header {
  flex-direction: column;
  align-items: center;
  text-align: center;
  gap: 20rpx;
  position: relative;
}

.title-with-icon {
  display: flex;
  align-items: center;
  gap: 15rpx;
  justify-content: center;
}

.header-doudou-large {
  position: absolute;
  top: -20rpx;
  right: -20rpx;
  z-index: 10;
}

.section-doudou-large {
  width: 150rpx;
  height: 150rpx;
  animation: bounce 2s ease-in-out infinite;
  filter: drop-shadow(0 8rpx 16rpx rgba(255, 149, 0, 0.3));
}

@keyframes bounce {
  0%, 100% { 
    transform: translateY(0px) scale(1);
  }
  50% { 
    transform: translateY(-10px) scale(1.05);
  }
}

/* 保留原有的小版本样式用于其他部分 */
.header-doudou {
  margin-right: 25rpx;
  flex-shrink: 0;
}

.section-doudou {
  width: 80rpx;
  height: 80rpx;
  animation: wiggle 3s ease-in-out infinite;
}

@keyframes wiggle {
  0%, 100% { transform: rotate(0deg); }
  25% { transform: rotate(-5deg); }
  75% { transform: rotate(5deg); }
}


.section-subtitle {
  font-size: 26rpx;
  color: #666;
  opacity: 0.8;
  line-height: 1.3;
}

.radar-section {
  margin: 40rpx 0;
  display: flex;
  justify-content: center;
  background: linear-gradient(135deg, rgba(255, 255, 255, 0.95) 0%, rgba(227, 242, 253, 0.8) 100%);
  border-radius: 26rpx;
  padding: 22rpx;
  box-shadow: 0 16rpx 36rpx rgba(33, 150, 243, 0.14), 0 6rpx 14rpx rgba(33, 150, 243, 0.10);
  border: 2rpx solid rgba(33, 150, 243, 0.12);
  position: relative;
  overflow: hidden;
  
  &::before {
    content: '';
    position: absolute;
    top: -2rpx;
    left: -2rpx;
    right: -2rpx;
    bottom: -2rpx;
    background: linear-gradient(45deg, 
      rgba(33, 150, 243, 0.1) 0%, 
      rgba(255, 149, 0, 0.1) 25%, 
      rgba(33, 150, 243, 0.1) 50%, 
      rgba(255, 149, 0, 0.1) 75%, 
      rgba(33, 150, 243, 0.1) 100%);
    border-radius: 32rpx;
    z-index: -1;
    animation: borderGlow 4s ease-in-out infinite;
  }
}

@keyframes borderGlow {
  0%, 100% { opacity: 0.3; }
  50% { opacity: 0.7; }
}

@keyframes sectionFade {
  from { opacity: 0; transform: translateY(16rpx); }
  to { opacity: 1; transform: translateY(0); }
}

.strength-grid {
  display: flex;
  flex-direction: column;
  gap: 20rpx;
  margin: 30rpx 0;
}

.strength-card {
  display: flex;
  align-items: center;
  gap: 20rpx;
  padding: 25rpx;
  background: rgba(255, 255, 255, 0.9);
  border-radius: 20rpx;
  box-shadow: 0 6rpx 20rpx rgba(0, 0, 0, 0.1);
  border-left: 4rpx solid #2196F3;
}

.strength-rank {
  width: 60rpx;
  height: 60rpx;
  background: linear-gradient(135deg, #2196F3, #1976D2);
  color: white;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 28rpx;
  font-weight: 700;
  flex-shrink: 0;
  box-shadow: 0 4rpx 15rpx rgba(33, 150, 243, 0.3);
}

.strength-info {
  flex: 1;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.strength-name {
  font-size: 32rpx;
  font-weight: 600;
  color: #333;
}

.strength-score {
  font-size: 36rpx;
  font-weight: 700;
  color: #2196F3;
  flex-shrink: 0;
}

/* 雷达图洞察样式 */
.radar-insights {
  margin-top: 40rpx;
  display: flex;
  flex-direction: column;
  gap: 25rpx;
}

.insight-item {
  display: flex;
  align-items: center;
  gap: 25rpx;
  padding: 30rpx;
  background: rgba(255, 255, 255, 0.9);
  border-radius: 25rpx;
  border-left: 6rpx solid #2196F3;
  transition: all 0.4s ease;
  box-shadow: 0 5rpx 20rpx rgba(33, 150, 243, 0.1);
  backdrop-filter: blur(10rpx);
  
  &:hover {
    background: rgba(255, 255, 255, 0.95);
    transform: translateX(15rpx) translateY(-5rpx);
    box-shadow: 0 15rpx 35rpx rgba(33, 150, 243, 0.2);
    border-left-color: #1976D2;
  }
  
  &:nth-child(1) {
    animation: slideInLeft 0.6s ease-out 0.2s both;
  }
  
  &:nth-child(2) {
    animation: slideInLeft 0.6s ease-out 0.4s both;
  }
  
  &:nth-child(3) {
    animation: slideInLeft 0.6s ease-out 0.6s both;
  }
}

@keyframes slideInLeft {
  from {
    opacity: 0;
    transform: translateX(-100rpx);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
}

.insight-icon {
  font-size: 45rpx;
  width: 60rpx;
  text-align: center;
  flex-shrink: 0;
  animation: iconBounce 2s ease-in-out infinite;
}

@keyframes iconBounce {
  0%, 100% { transform: scale(1); }
  50% { transform: scale(1.1); }
}

.insight-content {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 10rpx;
}

.insight-title {
  font-size: 32rpx;
  font-weight: 700;
  color: #333;
  text-shadow: 0 1rpx 3rpx rgba(0, 0, 0, 0.1);
}

.insight-desc {
  font-size: 28rpx;
  color: #666;
  line-height: 1.6;
  font-weight: 500;
}


/* C. 场景借力样式（重点内容） */
.scenario-leverage {
  background: linear-gradient(135deg, #FFF3E0 0%, #FFE0B2 100%);
}

.scenario-list {
  display: flex;
  flex-direction: column;
  gap: 20rpx;
}

.scenario-card {
  background: rgba(255, 255, 255, 0.9);
  border-radius: 20rpx;
  padding: 25rpx;
  box-shadow: 0 6rpx 20rpx rgba(0, 0, 0, 0.1);
  border-left: 4rpx solid #FF9500;
}

.scenario-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 15rpx;
  gap: 15rpx;
}

.scenario-context {
  font-size: 30rpx;
  font-weight: 600;
  color: #333;
  flex: 1;
  min-width: 0;
}

.scenario-tag {
  background: rgba(242, 158, 56, 0.12);
  color: #F29E38;
  padding: 8rpx 16rpx;
  border-radius: 20rpx;
  font-size: 24rpx;
  font-weight: 500;
  flex-shrink: 0;
}

.scenario-flow {
  margin-bottom: 15rpx;
}

.flow-text {
  font-size: 28rpx;
  color: #333;
  line-height: 1.5;
  font-weight: 500;
}

.scenario-impact {
  display: flex;
  align-items: center;
  gap: 15rpx;
}

.impact-bar {
  flex: 1;
  height: 8rpx;
  background: rgba(255, 149, 0, 0.2);
  border-radius: 4rpx;
  overflow: hidden;
}

.impact-fill {
  height: 100%;
  background: linear-gradient(90deg, #FF9500, #FF8F00);
  border-radius: 4rpx;
  transition: width 0.3s ease;
}

.impact-value {
  font-size: 26rpx;
  color: #F29E38;
  font-weight: 600;
  flex-shrink: 0;
}

/* C. 新人进阶路线 */
.career-progression {
  background: #ffffff;
  border-radius: 20rpx;
  border: 1rpx solid rgba(0, 0, 0, 0.05);
}

.progression-list {
  display: flex;
  flex-direction: column;
  gap: 24rpx;
}

.progression-card {
  background: linear-gradient(135deg, rgba(255, 255, 255, 0.95) 0%, rgba(255, 248, 225, 0.9) 100%);
  border-radius: 24rpx;
  padding: 28rpx;
  box-shadow: 
    0 8rpx 24rpx rgba(255, 149, 0, 0.15),
    0 4rpx 12rpx rgba(0, 0, 0, 0.08),
    inset 0 1rpx 0 rgba(255, 255, 255, 0.8);
  border: 2rpx solid rgba(255, 149, 0, 0.2);
  transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
  position: relative;
  overflow: hidden;
  backdrop-filter: blur(10rpx);
}

.progression-card::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 4rpx;
  background: linear-gradient(90deg, #FF9500 0%, #FF8F00 50%, #FFB84D 100%);
  border-radius: 24rpx 24rpx 0 0;
}

.progression-card:hover {
  transform: translateY(-4rpx);
  box-shadow: 
    0 12rpx 32rpx rgba(255, 149, 0, 0.2),
    0 6rpx 16rpx rgba(0, 0, 0, 0.1),
    inset 0 1rpx 0 rgba(255, 255, 255, 0.9);
}

.category-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20rpx;
  padding: 16rpx 20rpx;
  background: linear-gradient(135deg, rgba(255, 149, 0, 0.05) 0%, rgba(255, 193, 7, 0.03) 100%);
  border-radius: 16rpx;
  border: 1rpx solid rgba(255, 149, 0, 0.1);
  box-shadow: 0 2rpx 8rpx rgba(255, 149, 0, 0.08);
}

.category-info {
  display: flex;
  align-items: center;
  gap: 12rpx;
  flex: 1;
}

.category-icon {
  font-size: 28rpx;
  line-height: 1;
  filter: drop-shadow(0 1rpx 2rpx rgba(255, 149, 0, 0.3));
}

.category-title {
  font-size: 28rpx;
  font-weight: 700;
  color: #F29E38;
  text-shadow: 0 1rpx 2rpx rgba(255, 149, 0, 0.2);
}

.category-separator {
  font-size: 20rpx;
  color: #FFB84D;
  font-weight: 400;
  margin: 0 4rpx;
}

.category-count {
  font-size: 22rpx;
  color: #666;
  font-weight: 600;
  background: rgba(255, 255, 255, 0.8);
  padding: 4rpx 12rpx;
  border-radius: 12rpx;
  border: 1rpx solid rgba(255, 149, 0, 0.15);
  box-shadow: 0 1rpx 3rpx rgba(255, 149, 0, 0.1);
}

.category-actions {
  display: flex;
  align-items: center;
  margin-left: 16rpx;
}

.edit-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 10rpx 20rpx;
  background: linear-gradient(135deg, #FFEFE0 0%, #FFE1B5 100%);
  border: 1rpx solid #F29E38;
  border-radius: 20rpx;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 2rpx 6rpx rgba(255, 149, 0, 0.3);
}

.edit-btn:hover {
  background: linear-gradient(135deg, #FFE6CC 0%, #FFEDCC 100%);
  transform: translateY(-1rpx);
  box-shadow: 0 4rpx 12rpx rgba(255, 149, 0, 0.4);
}

.edit-text {
  font-size: 22rpx;
  color: #ffffff;
  font-weight: 600;
  text-shadow: 0 1rpx 2rpx rgba(0, 0, 0, 0.1);
}

/* 空状态样式 */
.empty-tasks {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 60rpx 20rpx;
  text-align: center;
  background: rgba(76, 175, 80, 0.05);
  border-radius: 16rpx;
  border: 2rpx dashed rgba(76, 175, 80, 0.2);
}

.empty-icon {
  font-size: 48rpx;
  margin-bottom: 16rpx;
}

.empty-text {
  font-size: 28rpx;
  font-weight: 600;
  color: #4CAF50;
  margin-bottom: 8rpx;
}

.empty-subtext {
  font-size: 22rpx;
  color: #666;
  font-style: italic;
}


/* 右上角操作按钮 */
.section-actions {
  display: flex;
  gap: 12rpx;
}

.action-btn {
  display: flex;
  align-items: center;
  gap: 6rpx;
  padding: 8rpx 16rpx;
  border-radius: 20rpx;
  transition: all 0.3s ease;
  cursor: pointer;
}

.history-btn {
  background: rgba(255, 149, 0, 0.1);
  border: 1rpx solid rgba(255, 149, 0, 0.2);
}

.history-btn:hover {
  background: rgba(255, 149, 0, 0.2);
}

.manage-btn {
  background: rgba(76, 175, 80, 0.1);
  border: 1rpx solid rgba(76, 175, 80, 0.2);
}

.manage-btn:hover {
  background: rgba(76, 175, 80, 0.2);
}

.btn-icon {
  font-size: 20rpx;
}

.btn-text {
  font-size: 22rpx;
  font-weight: 600;
  color: #333;
}

/* Todo List 样式 */
.tasks-list {
  display: flex;
  flex-direction: column;
  gap: 12rpx;
}

.task-item {
  display: flex;
  align-items: flex-start;
  gap: 12rpx;
  padding: 16rpx 20rpx;
  background: rgba(255, 255, 255, 0.8);
  border-radius: 16rpx;
  border: 2rpx solid rgba(255, 149, 0, 0.15);
  transition: all 0.3s ease;
  position: relative;
}

.task-item:hover {
  background: rgba(255, 255, 255, 0.95);
  border-color: rgba(255, 149, 0, 0.25);
  transform: translateY(-2rpx);
  box-shadow: 0 4rpx 12rpx rgba(255, 149, 0, 0.1);
}

.task-item.completed {
  background: rgba(76, 175, 80, 0.1);
  border-color: rgba(76, 175, 80, 0.2);
}

.task-item.completed .task-title {
  text-decoration: line-through;
  color: #666;
}

.task-checkbox {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40rpx;
  height: 40rpx;
  cursor: pointer;
  transition: all 0.3s ease;
}

.checkbox-icon {
  font-size: 24rpx;
  transition: all 0.3s ease;
}

.task-content {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 8rpx;
}

.task-title {
  font-size: 26rpx;
  font-weight: 600;
  color: #333;
  line-height: 1.3;
  margin-bottom: 8rpx;
}

.task-description {
  font-size: 22rpx;
  color: #666;
  line-height: 1.4;
}

.task-completed-info {
  margin-top: 4rpx;
}

.completed-text {
  font-size: 20rpx;
  color: #4CAF50;
  font-weight: 500;
}

.task-actions {
  display: flex;
  align-items: center;
}

.delete-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 32rpx;
  height: 32rpx;
  cursor: pointer;
  transition: all 0.3s ease;
  border-radius: 8rpx;
}

.delete-btn:hover {
  background: rgba(255, 107, 107, 0.1);
}

.delete-icon {
  font-size: 20rpx;
}

/* 弹窗样式 */
.modal-overlay {
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
  padding: 40rpx;
}

.modal-content {
  background: #ffffff;
  border-radius: 24rpx;
  max-width: 600rpx;
  width: 100%;
  max-height: 80vh;
  overflow: hidden;
  box-shadow: 0 20rpx 40rpx rgba(0, 0, 0, 0.2);
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 24rpx 28rpx;
  border-bottom: 2rpx solid rgba(255, 149, 0, 0.1);
  background: linear-gradient(135deg, #FFF8E1 0%, #FFF3C4 100%);
}

.modal-title {
  font-size: 32rpx;
  font-weight: 700;
  color: #F29E38;
}

.close-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40rpx;
  height: 40rpx;
  border-radius: 20rpx;
  background: rgba(255, 149, 0, 0.1);
  cursor: pointer;
  transition: all 0.3s ease;
}

.close-btn:hover {
  background: rgba(255, 149, 0, 0.2);
}

.close-icon {
  font-size: 24rpx;
  color: #F29E38;
  font-weight: 600;
}

.modal-body {
  padding: 28rpx;
  max-height: 60vh;
  overflow-y: auto;
}

/* 历史任务弹窗 */
.empty-state {
  text-align: center;
  padding: 60rpx 20rpx;
}

.empty-text {
  font-size: 28rpx;
  color: #999;
  font-style: italic;
}

.completed-tasks {
  display: flex;
  flex-direction: column;
  gap: 16rpx;
}

.completed-task-item {
  padding: 20rpx;
  background: rgba(76, 175, 80, 0.05);
  border-radius: 16rpx;
  border: 2rpx solid rgba(76, 175, 80, 0.1);
}

.completed-task-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 8rpx;
}

.completed-task-title {
  font-size: 26rpx;
  font-weight: 600;
  color: #333;
  flex: 1;
}

.completed-task-category {
  font-size: 22rpx;
  color: #4CAF50;
  font-weight: 500;
}

.completed-task-desc {
  font-size: 22rpx;
  color: #666;
  line-height: 1.4;
  margin-bottom: 8rpx;
}

.completed-task-date {
  font-size: 20rpx;
  color: #4CAF50;
  font-weight: 500;
}

/* 任务管理弹窗 */
.add-task-form {
  display: flex;
  flex-direction: column;
  gap: 20rpx;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 8rpx;
}

.form-label {
  font-size: 24rpx;
  font-weight: 600;
  color: #333;
}

.form-input, .form-textarea {
  padding: 16rpx 20rpx;
  border: 2rpx solid rgba(255, 149, 0, 0.2);
  border-radius: 12rpx;
  font-size: 24rpx;
  background: #ffffff;
  transition: all 0.3s ease;
}

.form-input:focus, .form-textarea:focus {
  border-color: #F29E38;
  box-shadow: 0 0 0 4rpx rgba(255, 149, 0, 0.1);
}

.form-textarea {
  min-height: 120rpx;
  resize: vertical;
}

.picker-display {
  padding: 16rpx 20rpx;
  border: 2rpx solid rgba(255, 149, 0, 0.2);
  border-radius: 12rpx;
  font-size: 24rpx;
  background: #ffffff;
  color: #333;
}

.form-actions {
  display: flex;
  gap: 16rpx;
  margin-top: 20rpx;
}

.btn-cancel, .btn-confirm {
  flex: 1;
  padding: 16rpx 24rpx;
  border-radius: 12rpx;
  text-align: center;
  cursor: pointer;
  transition: all 0.3s ease;
}

.btn-cancel {
  background: rgba(158, 158, 158, 0.1);
  border: 2rpx solid rgba(158, 158, 158, 0.2);
}

.btn-cancel:hover {
  background: rgba(158, 158, 158, 0.2);
}

.btn-confirm {
  background: linear-gradient(135deg, #FF9500 0%, #FF8F00 100%);
  border: 2rpx solid #FF9500;
}

.btn-confirm:hover {
  background: linear-gradient(135deg, #FF8F00 0%, #FF9500 100%);
  box-shadow: 0 4rpx 12rpx rgba(255, 149, 0, 0.3);
}

.btn-text {
  font-size: 24rpx;
  font-weight: 600;
  color: #333;
}

.btn-confirm .btn-text {
  color: #ffffff;
}

.combined-card {
  background: linear-gradient(135deg, rgba(255, 255, 255, 0.95) 0%, rgba(255, 248, 225, 0.9) 100%);
  border-radius: 24rpx;
  padding: 28rpx;
  box-shadow: 
    0 8rpx 24rpx rgba(255, 149, 0, 0.15),
    0 4rpx 12rpx rgba(0, 0, 0, 0.08),
    inset 0 1rpx 0 rgba(255, 255, 255, 0.8);
  border: 2rpx solid rgba(255, 149, 0, 0.2);
  transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
  position: relative;
  overflow: hidden;
  backdrop-filter: blur(10rpx);
}

.combined-card::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 4rpx;
  background: linear-gradient(90deg, #FF9500 0%, #FF8F00 50%, #FFB84D 100%);
  border-radius: 24rpx 24rpx 0 0;
}

.combined-card:hover {
  transform: translateY(-4rpx);
  box-shadow: 
    0 12rpx 32rpx rgba(255, 149, 0, 0.2),
    0 6rpx 16rpx rgba(0, 0, 0, 0.1),
    inset 0 1rpx 0 rgba(255, 255, 255, 0.9);
}

.combined-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16rpx;
  gap: 16rpx;
}

.combined-title {
  font-size: 32rpx;
  font-weight: 700;
  color: #2E3A59;
  flex: 1;
  min-width: 0;
}

.combined-progress {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 4rpx;
  background: linear-gradient(135deg, rgba(255, 149, 0, 0.1) 0%, rgba(255, 193, 7, 0.1) 100%);
  padding: 12rpx 16rpx;
  border-radius: 16rpx;
  border: 1rpx solid rgba(255, 149, 0, 0.2);
  flex-shrink: 0;
  min-width: 120rpx;
}

.progress-value {
  font-size: 24rpx;
  font-weight: 700;
  color: #F29E38;
  text-align: right;
  line-height: 1.2;
}

.progress-desc {
  font-size: 20rpx;
  font-weight: 500;
  color: #F4AA52;
  text-align: right;
  line-height: 1.2;
}

.combined-flow {
  margin: 10rpx 0 18rpx 0;
}

.combined-flow .flow-text {
  font-size: 28rpx;
  color: #374151;
  line-height: 1.5;
  font-weight: 600;
}

.combined-scenario {
  display: flex;
  flex-direction: column;
  gap: 16rpx;
  margin-top: 16rpx;
}

.scenario-pill {
  display: flex;
  flex-direction: column;
  gap: 8rpx;
  padding: 16rpx 20rpx;
  border-radius: 16rpx;
  background: linear-gradient(135deg, rgba(255,149,0,.12), rgba(255,224,178,.22));
  border: 2rpx solid rgba(255,149,0,.18);
  box-shadow: 0 4rpx 12rpx rgba(255, 149, 0, 0.1);
  min-width: 0;
  flex: 1;
}

.scenario-pill .scenario-name {
  font-size: 24rpx;
  font-weight: 700;
  color: #3A3A3A;
  line-height: 1.4;
  word-wrap: break-word;
  word-break: break-all;
  white-space: normal;
  min-width: 0;
  flex: 1;
}

.scenario-pill .scenario-tag {
  background: linear-gradient(135deg, rgba(242,158,56,.18), rgba(255,193,7,.12));
  color: #F29E38;
  padding: 6rpx 12rpx;
  border-radius: 12rpx;
  font-size: 20rpx;
  font-weight: 700;
  text-align: center;
  align-self: flex-start;
  border: 1rpx solid rgba(255, 149, 0, 0.3);
  box-shadow: 0 2rpx 4rpx rgba(255, 149, 0, 0.1);
}

.scenario-impact {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 16rpx;
}

.impact-info {
  display: flex;
  flex-direction: column;
  gap: 4rpx;
  flex: 1;
}

.impact-value {
  font-size: 24rpx;
  font-weight: 700;
  color: #F29E38;
  line-height: 1.2;
}

.impact-desc {
  font-size: 20rpx;
  font-weight: 500;
  color: #F4AA52;
  line-height: 1.2;
}

.impact-badge {
  background: linear-gradient(135deg, #FF9500 0%, #FF8F00 100%);
  padding: 8rpx 12rpx;
  border-radius: 12rpx;
  box-shadow: 0 4rpx 8rpx rgba(255, 149, 0, 0.3);
  flex-shrink: 0;
}

.badge-text {
  font-size: 20rpx;
  font-weight: 700;
  color: #ffffff;
  text-shadow: 0 1rpx 2rpx rgba(0, 0, 0, 0.2);
}

/* D. 思维转型对照样式 */
/* 已删除 思维转型样式 */


/* E. 目标展示样式（重点内容） */
.goal-showcase {
  background: linear-gradient(135deg, #E8F5E8 0%, #C8E6C9 100%);
}

.goal-list {
  display: flex;
  flex-direction: column;
  gap: 20rpx;
}

.goal-card {
  background: rgba(255, 255, 255, 0.9);
  border-radius: 20rpx;
  padding: 25rpx;
  box-shadow: 0 6rpx 20rpx rgba(0, 0, 0, 0.1);
  border-left: 4rpx solid #4CAF50;
}

.goal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 15rpx;
}

.goal-title {
  font-size: 32rpx;
  font-weight: 600;
  color: #333;
}

.goal-progress {
  background: rgba(76, 175, 80, 0.1);
  color: #4CAF50;
  padding: 8rpx 16rpx;
  border-radius: 20rpx;
  font-size: 28rpx;
  font-weight: 600;
}

.goal-flow {
  margin-bottom: 15rpx;
}

.flow-text {
  font-size: 28rpx;
  color: #333;
  line-height: 1.5;
  font-weight: 500;
}

.goal-progress-bar {
  margin-top: 15rpx;
}

.progress-bar {
  width: 100%;
  height: 8rpx;
  background: rgba(76, 175, 80, 0.2);
  border-radius: 4rpx;
  overflow: hidden;
}

.progress-fill {
  height: 100%;
  background: linear-gradient(90deg, #4CAF50, #45a049);
  border-radius: 4rpx;
  transition: width 0.3s ease;
}

/* 响应式设计 */
@media (max-width: 768px) {
  /* 已删除 思维转型响应式样式 */
}


@media (max-width: 480px) {
  .report-content {
    padding: 0 15rpx;
  }
  
  .header-section {
    padding: 120rpx 20rpx 40rpx 5rpx;
  }
  
  .header-content {
    flex-direction: column;
    align-items: center;
    gap: 20rpx;
  }
  
  .header-text {
    align-items: flex-start;
    text-align: left;
    margin-left: 10rpx;
  }
  
  .doudou-avatar {
    width: 100rpx;
    height: 100rpx;
    border-radius: 50rpx;
  }
  
  .report-section {
    padding: 20rpx;
    margin: 0 auto 30rpx auto;
    width: 100%;
    max-width: 100%;
  }
  
  .section-header {
  flex-direction: column;
    text-align: center;
    gap: 15rpx;
  }
  
  .tags-container {
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: 12rpx;
    padding: 0 10rpx;
  }
  
  .challenge-tag {
    padding: 16rpx 12rpx;
    min-width: 100rpx;
    max-width: 160rpx;
  }
  
  .tag-text {
    font-size: 20rpx;
    line-height: 1.2;
  }
  
  .tag-frequency {
    font-size: 18rpx;
    padding: 4rpx 8rpx;
  }
  
  .stats-card {
    padding: 40rpx 30rpx;
    margin: 0 10rpx;
  }
  
  .stats-title {
    font-size: 32rpx;
    margin-bottom: 15rpx;
  }
  
  .stats-number {
    font-size: 64rpx;
  }
  
  .stats-desc {
    font-size: 24rpx;
  }
  
  .courage-explanation {
    margin-top: 12rpx;
    padding: 10rpx 12rpx;
  }
  
  .explanation-text {
    font-size: 20rpx;
    margin-bottom: 4rpx;
  }
  
  .explanation-tip {
    font-size: 18rpx;
  }
  
  .progression-card {
    padding: 20rpx;
  }
  
  .category-header {
    margin-bottom: 16rpx;
    padding-bottom: 12rpx;
  }
  
  .category-icon {
    font-size: 28rpx;
  }
  
  .category-title {
    font-size: 28rpx;
  }
  
  .skill-item {
    padding: 12rpx 16rpx;
  }
  
  .skill-name {
    font-size: 24rpx;
  }
  
  .skill-progress {
    font-size: 20rpx;
    padding: 4rpx 8rpx;
  }
  
  .skill-desc {
    font-size: 20rpx;
  }
  
  .section-actions {
    gap: 8rpx;
  }
  
  .action-btn {
    padding: 6rpx 12rpx;
  }
  
  .btn-icon {
    font-size: 18rpx;
  }
  
  .btn-text {
    font-size: 20rpx;
  }
  
  .task-item {
    padding: 12rpx 16rpx;
  }
  
  .task-title {
    font-size: 24rpx;
  }
  
  .task-description {
    font-size: 20rpx;
  }
  
  
  .modal-content {
    max-width: 90%;
    margin: 20rpx;
  }
  
  .modal-header {
    padding: 20rpx 24rpx;
  }
  
  .modal-title {
    font-size: 28rpx;
  }
  
  .modal-body {
    padding: 24rpx;
  }
  
  .form-input, .form-textarea, .picker-display {
    padding: 12rpx 16rpx;
    font-size: 22rpx;
  }
  
  .form-label {
    font-size: 22rpx;
  }
  
  .category-header {
    padding: 12rpx 16rpx;
    margin-bottom: 16rpx;
  }
  
  .category-info {
    gap: 8rpx;
  }
  
  .category-icon {
    font-size: 24rpx;
  }
  
  .category-title {
    font-size: 24rpx;
  }
  
  .category-separator {
    font-size: 18rpx;
    margin: 0 2rpx;
  }
  
  .category-count {
    font-size: 20rpx;
    padding: 3rpx 8rpx;
  }
  
  .edit-btn {
    padding: 8rpx 16rpx;
  }
  
  .edit-text {
    font-size: 20rpx;
  }
  
  .empty-tasks {
    padding: 40rpx 16rpx;
  }
  
  .empty-icon {
    font-size: 40rpx;
  }
  
  .empty-text {
    font-size: 24rpx;
  }
  
  .empty-subtext {
    font-size: 20rpx;
  }
  
  .scenario-pill {
    padding: 12rpx 16rpx;
    gap: 6rpx;
  }
  
  .scenario-pill .scenario-name {
    font-size: 22rpx;
    line-height: 1.3;
  }
  
  .scenario-pill .scenario-tag {
    font-size: 18rpx;
    padding: 4rpx 8rpx;
  }
  
  .scenario-impact {
    flex-direction: column;
    align-items: flex-start;
    gap: 12rpx;
  }
  
  .impact-badge {
    align-self: flex-end;
  }
  
  .strength-card {
    padding: 20rpx;
  }
  
  .strength-rank {
    width: 50rpx;
    height: 50rpx;
    font-size: 24rpx;
  }
  
  .strength-name {
  font-size: 28rpx;
  }
  
  .scenario-card {
    padding: 20rpx;
  }
  
  .scenario-context {
    font-size: 26rpx;
  }
  
  .flow-text {
    font-size: 24rpx;
  }
  
  /* 已删除 思维转型响应式样式（小屏） */
  
  .goal-card {
    padding: 20rpx;
  }
  
  .goal-title {
  font-size: 28rpx;
  }
  
  .flow-text {
    font-size: 24rpx;
  }
}

/* 新增动画效果 */
@keyframes goalRotate {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

@keyframes progressGlow {
  0%, 100% { 
    box-shadow: 0 4rpx 8rpx rgba(255, 149, 0, 0.3);
  }
  50% { 
    box-shadow: 0 6rpx 12rpx rgba(255, 149, 0, 0.5);
  }
}

@keyframes badgePulse {
  0%, 100% { 
    transform: scale(1);
    box-shadow: 0 4rpx 8rpx rgba(255, 149, 0, 0.3);
  }
  50% { 
    transform: scale(1.05);
    box-shadow: 0 6rpx 12rpx rgba(255, 149, 0, 0.4);
  }
}

/* 添加动画到元素 */
.combined-progress {
  animation: progressGlow 3s ease-in-out infinite;
}

.impact-badge {
  animation: badgePulse 2s ease-in-out infinite;
}

@media (max-width: 360px) {
  .report-content {
    padding: 0 10rpx;
  }
  
  .report-section {
    padding: 15rpx;
    margin: 0 auto 20rpx auto;
    width: 100%;
  }
  
  .section-header {
    margin-bottom: 20rpx;
    padding-bottom: 15rpx;
  }
  
  .section-title {
    font-size: 30rpx;
  }
  
  .section-icon {
    font-size: 30rpx;
  }
}
</style>
