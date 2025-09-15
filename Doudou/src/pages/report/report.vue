<template>
  <view class="report-container">
    <!-- 顶部感谢区域 -->
    <view class="header-section">
      <view class="thank-you-header">
        <image 
          class="doudou-character"
          src="@/static/login/DouDou_主形象.png"
          mode="aspectFit"
        />
        <text class="thank-title">你的成长报告</text>
        <text class="thank-subtitle">DouDou陪伴你的每一步成长</text>
      </view>
    </view>

    <!-- 报告内容滚动区域 -->
    <scroll-view class="report-content" scroll-y="true" :show-scrollbar="false">
      
      <!-- A. 情绪模式总结 -->
      <view class="report-section emotion-pattern">
        <view class="section-header">
          <text class="section-title">
            <text class="section-icon">💭</text>
            情绪模式总结
          </text>
        </view>
        <view class="section-content">
          <view class="emotion-highlights">
            <view v-for="trigger in emotionTriggers.slice(0, 3)" :key="trigger.id" class="emotion-highlight">
              <text class="emotion-text">{{ trigger.text }}</text>
              <view class="emotion-badge">{{ trigger.frequency }}次</view>
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
              :width="420"
              :height="420"
              :animated="true"
              :show-legend="false"
              :show-data-labels="true"
              :grid-color="'#e8f4fd'"
              :label-color="'#2E3A59'"
              :default-color="'#FF9500'"
              @chart-ready="onRadarChartReady"
            />
          </view>
          
          <!-- 优势列表 -->
          <view class="strength-grid">
            <view v-for="(strength, index) in topStrengths.slice(0, 3)" :key="index" class="strength-card">
              <view class="strength-rank">{{ index + 1 }}</view>
              <view class="strength-info">
                <text class="strength-name">{{ strength.name }}</text>
                <text class="strength-score">{{ strength.score }}%</text>
              </view>
            </view>
          </view>
          
          <!-- 雷达图洞察 -->
          <view class="radar-insights">
            <view class="insight-item" v-for="(insight, index) in radarInsights" :key="index">
              <text class="insight-icon">{{ insight.icon }}</text>
              <view class="insight-content">
                <text class="insight-title">{{ insight.title }}</text>
                <text class="insight-desc">{{ insight.description }}</text>
              </view>
            </view>
          </view>
        </view>
      </view>

      <!-- C. 场景借力（重点内容） -->
      <view class="report-section scenario-leverage">
        <view class="section-header">
          <text class="section-title">
            <text class="section-icon">🎯</text>
            场景借力
          </text>
        </view>
        <view class="section-content">
          <view class="scenario-list">
            <view v-for="scenario in scenarioLeverage.slice(0, 2)" :key="scenario.id" class="scenario-card">
              <view class="scenario-header">
                <text class="scenario-context">{{ scenario.context }}</text>
                <view class="scenario-tag">{{ scenario.category }}</view>
          </view>
              <view class="scenario-flow">
                <text class="flow-text">{{ scenario.strength }} → {{ scenario.result }}</text>
            </view>
              <view class="scenario-impact">
                <view class="impact-bar">
                  <view class="impact-fill" :style="{ width: scenario.impact + '%' }"></view>
          </view>
                <text class="impact-value">{{ scenario.impact }}%</text>
        </view>
      </view>
          </view>
          </view>
        </view>

      <!-- D. 思维转型对照 -->
      <view class="report-section mindset-transformation">
        <view class="section-header">
          <text class="section-title">
            <text class="section-icon">🔄</text>
            思维转型
          </text>
        </view>
        <view class="section-content">
          <view class="mindset-comparison">
            <view class="mindset-column student-mindset">
              <text class="mindset-title">学生思维</text>
              <view class="mindset-traits">
                <view v-for="trait in studentMindset.slice(0, 3)" :key="trait.id" class="trait-item">
                  <text class="trait-text">{{ trait.text }}</text>
                </view>
              </view>
            </view>
            <view class="mindset-arrow">→</view>
            <view class="mindset-column workplace-mindset">
              <text class="mindset-title">职场思维</text>
              <view class="mindset-traits">
                <view v-for="trait in workplaceMindset.slice(0, 3)" :key="trait.id" class="trait-item">
                  <text class="trait-text">{{ trait.text }}</text>
          </view>
                  </view>
                </view>
              </view>
            </view>
          </view>

      <!-- E. 目标展示（重点内容） -->
      <view class="report-section goal-showcase">
        <view class="section-header">
          <text class="section-title">
            <text class="section-icon">🎯</text>
            成长目标
          </text>
        </view>
        <view class="section-content">
          <view class="goal-list">
            <view v-for="goal in goalShowcase.slice(0, 2)" :key="goal.id" class="goal-card">
              <view class="goal-header">
                <text class="goal-title">{{ goal.title }}</text>
                <view class="goal-progress">{{ goal.progress }}%</view>
                </view>
              <view class="goal-flow">
                <text class="flow-text">{{ goal.strength }} → {{ goal.action }} → {{ goal.outcome }}</text>
              </view>
              <view class="goal-progress-bar">
                    <view class="progress-bar">
                  <view class="progress-fill" :style="{ width: goal.progress + '%' }"></view>
                    </view>
                  </view>
                </view>
              </view>
            </view>
          </view>

    </scroll-view>

    <!-- 底部导航栏 -->
    <BottomNavigation currentPage="report" />
  </view>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import BottomNavigation from '@/components/BottomNavigation.vue'
import RadarChart from '@/components/RadarChart.vue'

// A. 情绪模式总结数据
const emotionTriggers = ref([
  { id: 1, text: '害怕打扰别人', frequency: 8 },
  { id: 2, text: '担心做不好', frequency: 6 },
  { id: 3, text: '害怕被拒绝', frequency: 5 },
  { id: 4, text: '担心时间不够', frequency: 4 }
])

const comfortMessage = ref('这些都是很常见的情绪反应，说明你是一个有同理心和责任感的人。很多人都会有这样的担心，这是完全正常的体验。')

// B. 优势画像数据
const topStrengths = ref([
  { name: '沟通能力', description: '善于表达和倾听，能够有效传达想法', score: 92 },
  { name: '学习能力', description: '快速掌握新知识，持续自我提升', score: 88 },
  { name: '责任感', description: '对工作认真负责，值得信赖', score: 85 },
  { name: '执行力', description: '能够将计划转化为实际行动', score: 82 },
  { name: '团队协作', description: '善于与他人合作，营造良好氛围', score: 78 }
])

// 雷达图数据
const radarChartData = ref({
  indicator: [
    { name: '沟通能力', max: 100 },
    { name: '学习能力', max: 100 },
    { name: '抗压能力', max: 100 },
    { name: '创新能力', max: 100 },
    { name: '团队协作', max: 100 },
    { name: '执行力', max: 100 }
  ],
  series: [
    {
      name: '当前能力',
      value: [92, 88, 75, 70, 78, 82],
      color: '#FF9500'
    }
  ]
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

// C. 场景借力数据（重点内容）
const scenarioLeverage = ref([
  {
    id: 1,
    context: '项目汇报会议',
    category: '职场沟通',
    strength: '清晰的逻辑表达和自信的演讲能力',
    result: '成功获得领导认可，项目获得额外资源支持',
    impact: 95
  },
  {
    id: 2,
    context: '团队冲突调解',
    category: '人际关系',
    strength: '同理心和倾听技巧',
    result: '化解了团队内部矛盾，提升了团队凝聚力',
    impact: 88
  },
  {
    id: 3,
    context: '新技能学习',
    category: '个人成长',
    strength: '快速学习能力和持续改进意识',
    result: '在3个月内掌握了新工具，提升了工作效率30%',
    impact: 92
  },
  {
    id: 4,
    context: '客户谈判',
    category: '商务沟通',
    strength: '耐心倾听和灵活应变能力',
    result: '成功达成合作，为公司带来新的业务机会',
    impact: 85
  }
])

// D. 思维转型对照数据
const studentMindset = ref([
  { id: 1, text: '被动接受任务' },
  { id: 2, text: '害怕犯错' },
  { id: 3, text: '追求标准答案' },
  { id: 4, text: '依赖他人指导' },
  { id: 5, text: '避免承担责任' }
])

const workplaceMindset = ref([
  { id: 1, text: '主动思考stakeholder需求' },
  { id: 2, text: '从错误中学习成长' },
  { id: 3, text: '创新解决方案' },
  { id: 4, text: '独立决策和行动' },
  { id: 5, text: '主动承担责任' }
])

// E. 目标展示数据（重点内容）
const goalShowcase = ref([
  {
    id: 1,
    title: '提升团队领导力',
    progress: 75,
    strength: '沟通能力和同理心',
    action: '每周组织团队分享会，主动了解成员需求',
    outcome: '团队满意度提升，项目交付质量改善'
  },
  {
    id: 2,
    title: '掌握数据分析技能',
    progress: 60,
    strength: '学习能力和逻辑思维',
    action: '每天学习1小时数据分析工具，完成3个实践项目',
    outcome: '能够独立完成数据分析报告，为决策提供支持'
  },
  {
    id: 3,
    title: '建立个人品牌',
    progress: 45,
    strength: '专业能力和表达能力',
    action: '每月发布2篇专业文章，参与行业交流活动',
    outcome: '在行业内建立影响力，获得更多合作机会'
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

// 生命周期
onMounted(() => {
  console.log('动态报告页面加载完成')
})
</script>

<style lang="scss" scoped>
/* 全局样式 - 防止水平滚动 */
* {
  box-sizing: border-box;
}

.report-container {
  min-height: 100vh;
  background: linear-gradient(135deg, #FFE0B2 0%, #FFCC80 100%);
  padding-bottom: 68px; /* 为底部导航栏留出空间 */
  width: 100%;
  box-sizing: border-box;
  overflow-x: hidden; /* 防止水平滚动 */
}

/* 顶部感谢区域 */
.header-section {
  padding: 120rpx 20rpx 40rpx;
  text-align: center;
}

.thank-you-header {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 30rpx;
}

.doudou-character {
  width: 150rpx;
  height: 150rpx;
  border-radius: 50%;
  background: rgba(255, 193, 7, 0.2);
  padding: 20rpx;
}

.thank-title {
  font-size: 36rpx;
  font-weight: 600;
  color: #2E3A59;
  text-shadow: 0 2rpx 8rpx rgba(255, 255, 255, 0.3);
}

.thank-subtitle {
  font-size: 28rpx;
  color: #666;
  text-shadow: 0 1rpx 4rpx rgba(255, 255, 255, 0.2);
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
}

/* 报告部分样式 */
.report-section {
  background: rgba(255, 255, 255, 0.95);
  border-radius: 25rpx;
  padding: 30rpx;
  margin: 0 auto 40rpx auto;
  box-shadow: 0 10rpx 40rpx rgba(0, 0, 0, 0.1);
  backdrop-filter: blur(10rpx);
  width: 100%;
  max-width: 750rpx;
  box-sizing: border-box;
}

.section-header {
  display: flex;
  align-items: center;
  margin-bottom: 40rpx;
  padding: 20rpx;
  background: rgba(255, 255, 255, 0.6);
  border-radius: 25rpx;
  backdrop-filter: blur(10rpx);
  box-shadow: 0 5rpx 20rpx rgba(0, 0, 0, 0.1);
}

.section-title {
  font-size: 36rpx;
  font-weight: 700;
  color: #333;
  line-height: 1.2;
}

.section-icon {
  font-size: 32rpx;
  color: #FF9500;
  margin-bottom: 5rpx;
}

.section-content {
  line-height: 1.6;
  position: relative;
}

/* A. 情绪模式总结样式 */
.emotion-pattern {
  background: linear-gradient(135deg, #E8F5E8 0%, #F1F8E9 100%);
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
  align-items: center;
  padding: 20rpx;
  background: rgba(255, 255, 255, 0.9);
  border-radius: 20rpx;
  border-left: 4rpx solid #4CAF50;
  box-shadow: 0 4rpx 15rpx rgba(0, 0, 0, 0.1);
}

.emotion-text {
  font-size: 28rpx;
  color: #333;
  font-weight: 500;
  flex: 1;
}

.emotion-badge {
  background: linear-gradient(135deg, #4CAF50, #45a049);
  color: white;
  padding: 8rpx 16rpx;
  border-radius: 20rpx;
  font-size: 24rpx;
  font-weight: 600;
  flex-shrink: 0;
}

.comfort-message {
  padding: 25rpx;
  background: rgba(255, 193, 7, 0.1);
  border-radius: 20rpx;
  border-left: 4rpx solid #FFC107;
}

.comfort-text {
  font-size: 28rpx;
  color: #444;
  line-height: 1.6;
}

/* B. 优势画像样式 */
.strength-profile {
  background: linear-gradient(135deg, #E3F2FD 0%, #BBDEFB 50%, #90CAF9 100%);
  border: 3rpx solid rgba(33, 150, 243, 0.3);
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

.header-content {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 8rpx;
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
  border-radius: 30rpx;
  padding: 30rpx;
  box-shadow: 
    0 20rpx 40rpx rgba(33, 150, 243, 0.15),
    0 8rpx 16rpx rgba(33, 150, 243, 0.1),
    inset 0 1rpx 0 rgba(255, 255, 255, 0.8);
  border: 2rpx solid rgba(33, 150, 243, 0.1);
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
  background: rgba(255, 149, 0, 0.1);
  color: #FF9500;
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
  color: #FF9500;
  font-weight: 600;
  flex-shrink: 0;
}

/* D. 思维转型对照样式 */
.mindset-transformation {
  background: linear-gradient(135deg, #F3E5F5 0%, #E1BEE7 100%);
}

.mindset-comparison {
  display: flex;
  align-items: flex-start;
  gap: 15rpx;
}

.mindset-column {
  flex: 1;
  background: rgba(255, 255, 255, 0.9);
  border-radius: 15rpx;
  padding: 20rpx;
  box-shadow: 0 4rpx 15rpx rgba(0, 0, 0, 0.1);
  min-width: 0;
}

.mindset-title {
  font-size: 26rpx;
  font-weight: 600;
  color: #333;
  text-align: center;
  margin-bottom: 15rpx;
  display: block;
}

.student-mindset .mindset-title {
  color: #E91E63;
}

.workplace-mindset .mindset-title {
  color: #4CAF50;
}

.mindset-traits {
  display: flex;
  flex-direction: column;
  gap: 8rpx;
}

.trait-item {
  padding: 12rpx;
  background: rgba(0, 0, 0, 0.05);
  border-radius: 12rpx;
}

.trait-text {
  font-size: 22rpx;
  color: #444;
  line-height: 1.3;
}

.mindset-arrow {
  font-size: 32rpx;
  color: #9C27B0;
  font-weight: bold;
  flex-shrink: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 10rpx;
}


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
  .mindset-comparison {
    gap: 10rpx;
  }
  
  .mindset-column {
    padding: 15rpx;
  }
  
  .mindset-title {
    font-size: 24rpx;
    margin-bottom: 12rpx;
  }
  
  .trait-item {
    padding: 10rpx;
  }
  
  .trait-text {
    font-size: 20rpx;
  }
  
  .mindset-arrow {
    font-size: 28rpx;
    margin: 0 5rpx;
  }
}


@media (max-width: 480px) {
  .report-content {
    padding: 0 15rpx;
  }
  
  .report-section {
    padding: 20rpx;
    margin: 0 auto 30rpx auto;
    width: 100%;
    max-width: 100%;
  border-radius: 20rpx;
  }
  
  .section-header {
  flex-direction: column;
    text-align: center;
    gap: 15rpx;
  }
  
  .emotion-highlight {
    padding: 15rpx;
  }
  
  .emotion-text {
    font-size: 26rpx;
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
  
  .mindset-column {
    padding: 12rpx;
  }
  
  .mindset-title {
    font-size: 22rpx;
    margin-bottom: 10rpx;
  }
  
  .trait-item {
    padding: 8rpx;
  }
  
  .trait-text {
    font-size: 18rpx;
  }
  
  .mindset-arrow {
    font-size: 24rpx;
    margin: 0 3rpx;
  }
  
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

@media (max-width: 360px) {
  .report-content {
    padding: 0 10rpx;
  }
  
  .report-section {
    padding: 15rpx;
    margin: 0 auto 20rpx auto;
    width: 100%;
    border-radius: 15rpx;
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
