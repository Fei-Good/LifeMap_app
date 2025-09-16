/**
 * AI大模型服务类
 */
// 导入API服务
import apiService from './apiService'

class AIService {
  constructor() {
    // 配置豆包AI服务，私有仓库工程开发，API密钥不会暴露
    this.apiConfig = {
      baseUrl: 'https://ark.cn-beijing.volces.com/api/v3', // 豆包API地址
      apiKey: 'a4063a05-841a-4a52-8916-70ffc92d7f06', // API密钥
      model: 'doubao-seed-1-6-250615', // 豆包模型名称（聊天对话用）
      contentGenerationModel: 'doubao-seedance-1-0-pro-250528' // 内容生成专用模型
    }
  }

  /**
   * 根据用户问卷回答生成个性化报告
   * @param {Array} questionnaireAnswers 用户的问卷答案
   * @param {Object} userInfo 用户基本信息
   * @returns {Promise<Object>} 生成的报告内容
   */
  async generatePersonalityReport(questionnaireAnswers, userInfo = {}) {
    try {
      // 首先尝试调用后端API
      const backendReport = await this.generateReportFromBackend(questionnaireAnswers, userInfo)
      if (backendReport) {
        return backendReport
      }
    } catch (error) {
      console.warn('后端API调用失败，使用直接调用大模型方式:', error)
    }

    try {
      // 备用方案：直接调用大模型接口
      const prompt = this.buildPrompt(questionnaireAnswers, userInfo)
      const response = await this.callAIAPI(prompt)
      return this.parseAIResponse(response)
      
    } catch (error) {
      console.error('生成个性化报告失败:', error)
      // 返回兜底的默认报告
      return this.getDefaultReport(questionnaireAnswers)
    }
  }

  /**
   * 调用后端API生成个性化报告
   * @param {Array} questionnaireAnswers 用户的问卷答案
   * @param {Object} userInfo 用户基本信息
   * @returns {Promise<Object>} 生成的报告内容
   */
  async generateReportFromBackend(questionnaireAnswers, userInfo = {}) {
    try {
      console.log('调用后端API生成个性化报告...')
      
      // 先提交问卷答案到后端
      const submitResponse = await apiService.submitQuestionnaire(questionnaireAnswers)
      console.log('问卷提交成功:', submitResponse)
      
      // 获取生成的个性化报告
      if (submitResponse.data && submitResponse.data.personalityReport) {
        const report = submitResponse.data.personalityReport
        
        // 转换为前端需要的格式
        return this.convertBackendReportFormat(report)
      } else {
        // 如果提交后没有直接返回报告，尝试获取报告
        const reportResponse = await apiService.getPersonalityReport()
        if (reportResponse.data) {
          return this.convertBackendReportFormat(reportResponse.data)
        }
      }
      
      return null
    } catch (error) {
      console.error('后端API生成报告失败:', error)
      throw error
    }
  }

  /**
   * 转换后端报告格式为前端需要的格式
   * @param {Object} backendReport 后端返回的报告
   * @returns {Object} 转换后的报告格式
   */
  convertBackendReportFormat(backendReport) {
    // 如果后端返回的格式已经符合前端需求，直接返回
    if (backendReport.emotionalSupport || backendReport.userConcerns || backendReport.personalGoals) {
      return {
        emotionalSupport: backendReport.emotionalSupport || this.generateDefaultEmotionalSupport(),
        userConcerns: backendReport.userConcerns || this.generateDefaultUserConcerns(),
        personalGoals: backendReport.personalGoals || this.generateDefaultPersonalGoals(),
        actionSuggestions: backendReport.actionSuggestions || this.generateDefaultActionSuggestions(),
        generatedAt: new Date().toISOString(),
        source: 'backend_api'
      }
    }
    
    // 如果是标准个性化报告格式，转换为问卷结果页面需要的格式
    return {
      emotionalSupport: this.generateEmotionalSupportFromReport(backendReport),
      userConcerns: this.generateUserConcernsFromReport(backendReport),
      personalGoals: backendReport.lifeTips || backendReport.summary || this.generateDefaultPersonalGoals(),
      actionSuggestions: this.convertSuggestionsToActions(backendReport.suggestions || []),
      generatedAt: backendReport.generatedAt || new Date().toISOString(),
      source: 'backend_api_converted'
    }
  }

  /**
   * 从标准报告生成情绪安慰内容
   */
  generateEmotionalSupportFromReport(report) {
    const percentage = Math.floor(Math.random() * 20) + 65 // 65-85%之间
    return `全球有${percentage}%的人具有与你相似的${report.title || '个性特征'}，你并不孤单。${report.description ? report.description.substring(0, 100) + '...' : 'DouDou相信你有独特的魅力和潜力。'} ❤️`
  }

  /**
   * 从标准报告生成用户心声内容
   */
  generateUserConcernsFromReport(report) {
    if (report.traits && report.traits.length > 0) {
      return `通过分析，DouDou发现你是一个${report.traits.slice(0, 3).join('、')}的人。这些特质让你在人生路上有着独特的优势和思考方式。`
    }
    return `通过你的回答，DouDou感受到你是一个有想法、有目标的人。每个人都有自己的成长节奏，相信你会找到属于自己的精彩。`
  }

  /**
   * 转换建议为行动建议格式
   */
  convertSuggestionsToActions(suggestions) {
    const actionTypes = ['hard_skill', 'soft_skill', 'emotion_management']
    
    return suggestions.slice(0, 3).map((suggestion, index) => ({
      type: actionTypes[index] || 'hard_skill',
      content: typeof suggestion === 'string' ? suggestion : suggestion.text || suggestion.content || '继续保持积极的学习态度'
    }))
  }

  /**
   * 生成默认的情绪安慰内容
   */
  generateDefaultEmotionalSupport() {
    const percentage = Math.floor(Math.random() * 20) + 65
    return `全球有${percentage}%的人正在经历类似的成长挑战，你并不孤单。DouDou相信每个人都有独特的价值和潜力，让我们一起探索属于你的成长之路！ ❤️`
  }

  /**
   * 生成默认的用户心声内容
   */
  generateDefaultUserConcerns() {
    return '通过你的回答，DouDou能感受到你是一个有想法、有追求的人。每个人都有自己的成长节奏和方式，相信你会找到最适合自己的发展道路。'
  }

  /**
   * 生成默认的个人目标
   */
  generateDefaultPersonalGoals() {
    return '成为更好的自己，在工作和生活中都能保持积极向上的态度，持续学习和成长，建立有意义的人际关系。'
  }

  /**
   * 生成默认的行动建议
   */
  generateDefaultActionSuggestions() {
    return [
      { type: 'hard_skill', content: '持续学习新技能，提升专业能力和竞争力' },
      { type: 'soft_skill', content: '培养沟通协作能力，建立良好的人际关系' },
      { type: 'emotion_management', content: '学会情绪管理，保持积极乐观的心态面对挑战' }
    ]
  }

  /**
   * 流式生成个性化报告
   * @param {Array} questionnaireAnswers 用户的问卷答案
   * @param {Object} userInfo 用户基本信息
   * @param {Function} onProgress 进度回调函数
   * @returns {Promise<Object>} 生成的报告内容
   */
  async generatePersonalityReportStream(questionnaireAnswers, userInfo = {}, onProgress) {
    try {
      // 首先尝试调用后端API
      const backendReport = await this.generateReportFromBackend(questionnaireAnswers, userInfo)
      if (backendReport) {
        // 模拟流式显示
        if (onProgress) {
          const reportText = JSON.stringify(backendReport, null, 2)
          await this.simulateStreamProgress(reportText, onProgress)
        }
        return backendReport
      }
    } catch (error) {
      console.warn('后端流式API调用失败，使用本地流式方式:', error)
    }

    try {
      // 备用方案：本地流式生成
      const prompt = this.buildStreamPrompt(questionnaireAnswers, userInfo)
      const response = await this.callStreamAPI(prompt, onProgress)
      return this.parseStreamResponse(response)
      
    } catch (error) {
      console.error('流式生成个性化报告失败:', error)
      return this.getDefaultReport(questionnaireAnswers)
    }
  }

  /**
   * 模拟流式进度显示
   * @param {string} text 完整文本
   * @param {Function} onProgress 进度回调
   */
  async simulateStreamProgress(text, onProgress) {
    const chunks = text.match(/.{1,10}/g) || [text]
    let accumulatedText = ''
    
    for (let i = 0; i < chunks.length; i++) {
      await new Promise(resolve => setTimeout(resolve, 30))
      accumulatedText += chunks[i]
      
      if (onProgress) {
        onProgress({
          chunk: chunks[i],
          accumulated: accumulatedText,
          progress: (i + 1) / chunks.length
        })
      }
    }
  }

  /**
   * 多模态AI调用（支持图片和文本）
   * @param {string} text 文本内容
   * @param {string} imageUrl 图片URL
   * @returns {Promise<string>} AI响应内容
   */
  async callMultimodalAPI(text, imageUrl) {
    try {
      const messages = [{
        role: 'user',
        content: []
      }]
      
      // 添加图片内容
      if (imageUrl) {
        messages[0].content.push({
          type: 'image_url',
          image_url: {
            url: imageUrl
          }
        })
      }
      
      // 添加文本内容
      if (text) {
        messages[0].content.push({
          type: 'text',
          text: text
        })
      }
      
      const response = await fetch(`${this.apiConfig.baseUrl}/chat/completions`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.apiConfig.apiKey}`
        },
        body: JSON.stringify({
          model: this.apiConfig.model,
          messages: messages,
          max_tokens: 1500,
          temperature: 0.7
        })
      })
      
      if (!response.ok) {
        throw new Error(`多模态API调用失败: ${response.status} ${response.statusText}`)
      }
      
      const data = await response.json()
      
      if (!data.choices || !data.choices[0] || !data.choices[0].message) {
        throw new Error('多模态API响应格式不正确')
      }
      
      return data.choices[0].message.content
      
    } catch (error) {
      console.error('多模态API调用失败:', error)
      throw error
    }
  }

  /**
   * 构建发送给AI的提示词
   * @param {Array} answers 用户答案
   * @param {Object} userInfo 用户信息
   * @returns {string} 构建好的提示词
   */
  buildPrompt(answers, userInfo) {
    const username = userInfo.username || '用户'
    
    // 整理用户的回答
    const answerSummary = answers.map(answer => {
      return `问题: ${answer.question}\n选择: ${answer.selectedLabel} (${answer.selectedDescription})`
    }).join('\n\n')

    const prompt = `
作为一名专业的心理分析师，请基于用户的问卷回答，生成一份详细的个性化心理报告。

用户信息:
- 用户名: ${username}
- 完成时间: ${new Date().toLocaleString()}

用户的问卷回答:
${answerSummary}

请生成一份包含以下内容的个性化报告，并以JSON格式返回：

{
  "title": "个性类型标题（如：积极行动者、深度思考者等）",
  "subtitle": "个性类型副标题（简短描述特征）",
  "description": "详细的个性分析描述（200-300字，温暖、专业的语调）",
  "traits": ["特征标签1", "特征标签2", "特征标签3", "特征标签4"],
  "suggestions": [
    {
      "icon": "📋",
      "text": "具体的建议文本1"
    },
    {
      "icon": "🌟", 
      "text": "具体的建议文本2"
    },
    {
      "icon": "💪",
      "text": "具体的建议文本3"
    }
  ],
  "strengths": ["优势1", "优势2", "优势3"],
  "developmentAreas": ["发展领域1", "发展领域2"],
  "lifeTips": "生活建议（100字左右）",
  "summary": "整体评价总结（50字左右）"
}

要求:
1. 分析要专业、温暖、积极正面
2. 建议要具体可行，不要过于泛泛而谈
3. 语言风格要亲切友好，符合DouDou的角色设定
4. 个性类型要独特，不要过于通用化
5. 确保返回的是有效的JSON格式
`;

    return prompt
  }

  /**
   * 调用AI API
   * @param {string} prompt 提示词
   * @param {Object} options 配置选项
   * @returns {Promise<string>} AI响应内容
   */
  async callAIAPI(prompt, options = {}) {
    try {
      const response = await fetch(`${this.apiConfig.baseUrl}/chat/completions`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.apiConfig.apiKey}`
        },
        body: JSON.stringify({
          model: this.apiConfig.model,
          messages: [
            {
              role: 'user',
              content: prompt
            }
          ],
          max_tokens: options.max_tokens || 1500,
          temperature: options.temperature || 0.7
        })
      })
      
      if (!response.ok) {
        throw new Error(`API调用失败: ${response.status} ${response.statusText}`)
      }
      
      const data = await response.json()
      
      if (!data.choices || !data.choices[0] || !data.choices[0].message) {
        throw new Error('API响应格式不正确')
      }
      
      return data.choices[0].message.content
      
    } catch (error) {
      console.error('API调用失败:', error)
      // 如果API调用失败，返回模拟数据作为兜底方案
      console.warn('使用模拟数据作为兜底方案')
      return this.getMockAIResponse(prompt)
    }
  }

  /**
   * 模拟AI响应（用于开发测试）
   * @param {string} prompt 提示词
   * @returns {string} 模拟的AI响应
   */
  getMockAIResponse(prompt) {
    // 基于提示词中的答案分析，返回不同的模拟响应
    const responses = [
      {
        condition: (p) => p.includes('proactive') || p.includes('action_oriented') || p.includes('achievement'),
        response: JSON.stringify({
          "title": "积极行动者",
          "subtitle": "目标明确 · 执行力强",
          "description": "通过你的回答，我能看出你是一个非常积极主动的人。面对挑战时，你不会轻易退缩，而是会主动寻找解决方案。你有很强的目标导向性，喜欢制定计划并付诸行动。这种积极的态度让你在生活和工作中都能取得不错的成绩。同时，你也善于在压力下保持冷静，用理性的方式分析问题。DouDou认为，你的这种行动力是很宝贵的品质，但也要记得适当给自己一些放松的时间。",
          "traits": ["目标导向", "执行力强", "积极主动", "理性分析"],
          "suggestions": [
            {
              "icon": "🎯",
              "text": "继续保持你的目标导向性，但记得设定合理的时间节点"
            },
            {
              "icon": "🤝",
              "text": "可以尝试与团队合作，分享你的行动经验"
            },
            {
              "icon": "🧘",
              "text": "适当安排休息时间，避免过度疲劳"
            }
          ],
          "strengths": ["强烈的行动力", "优秀的执行能力", "面对压力的冷静"],
          "developmentAreas": ["学会适度放松", "培养耐心"],
          "lifeTips": "你的行动力是你最大的优势，但记住有时候慢下来思考也很重要。给自己设定明确但不过于紧迫的目标，这样既能保持动力，又不会给自己太大压力。",
          "summary": "你是天生的行动派，DouDou会陪伴你在行动中成长！"
        })
      },
      {
        condition: (p) => p.includes('thoughtful') || p.includes('guidance') || p.includes('space'),
        response: JSON.stringify({
          "title": "深度思考者", 
          "subtitle": "内省智慧 · 稳重可靠",
          "description": "从你的回答中，DouDou感受到了你深思熟虑的智慧。你不是那种冲动行事的人，而是会仔细考虑各种可能性后再做决定。你有很强的自我反思能力，善于从经历中学习和成长。在人际关系中，你是一个值得信赖的朋友，总是能给予他人很好的建议。你喜欢独处的时光，这让你能更好地了解自己。DouDou觉得你的这种深度思考能力非常珍贵，它让你在复杂的世界中保持清醒和理智。",
          "traits": ["深度思考", "稳重可靠", "自我反思", "值得信赖"],
          "suggestions": [
            {
              "icon": "💭",
              "text": "相信自己的直觉，有时候不需要想得太多"
            },
            {
              "icon": "🌱",
              "text": "可以尝试一些新体验，走出舒适圈"
            },
            {
              "icon": "👥",
              "text": "多与他人分享你的想法和见解"
            }
          ],
          "strengths": ["深度分析能力", "情绪稳定", "善于倾听"],
          "developmentAreas": ["增强行动的果断性", "扩大社交圈"],
          "lifeTips": "你的思考能力是你的超能力，但记住有时候行动比完美的计划更重要。相信你的判断，勇敢地迈出第一步。",
          "summary": "你是智慧的思考者，DouDou会陪你一起探索内心的深度！"
        })
      },
      {
        condition: (p) => p.includes('social') || p.includes('collaborative') || p.includes('harmony'),
        response: JSON.stringify({
          "title": "和谐协调者",
          "subtitle": "善于沟通 · 团队精神",
          "description": "通过你的选择，DouDou看到了一个非常注重人际关系的你。你善于与他人沟通，能够很好地理解别人的感受和需求。在团队中，你往往能发挥桥梁的作用，帮助大家达成共识。你重视和谐的关系，不喜欢冲突，总是努力寻找让所有人都满意的解决方案。你的同理心很强，这让你在社交中很受欢迎。DouDou认为你的这种协调能力在当今社会非常珍贵，它能帮助你建立更广泛的人脉关系。",
          "traits": ["善于沟通", "团队协作", "同理心强", "协调能力"],
          "suggestions": [
            {
              "icon": "👑",
              "text": "学会适当表达自己的需求，不要总是迁就他人"
            },
            {
              "icon": "🎨",
              "text": "可以尝试一些创意性的活动来表达自己"
            },
            {
              "icon": "💪",
              "text": "在必要时要学会坚持自己的原则"
            }
          ],
          "strengths": ["出色的人际交往能力", "团队合作精神", "冲突调解能力"],
          "developmentAreas": ["提升自我表达", "学会适度拒绝"],
          "lifeTips": "你的协调能力让你成为团队中的润滑剂，但也要记得照顾自己的需求。有时候适当的冲突也是成长的催化剂。",
          "summary": "你是天然的团队建设者，DouDou会陪你建立更美好的关系！"
        })
      }
    ]

    // 根据条件选择合适的响应
    for (const item of responses) {
      if (item.condition(prompt)) {
        return item.response
      }
    }

    // 默认响应
    return JSON.stringify({
      "title": "平衡发展者",
      "subtitle": "全面发展 · 适应性强", 
      "description": "从你的回答中，DouDou看到了一个很有平衡感的你。你不会偏向某一个极端，而是能够根据不同的情况灵活调整自己的应对方式。你有学习的热情，也有行动的勇气，还有思考的深度。这种平衡的特质让你能够在各种环境中都表现得不错。DouDou觉得你就像一块海绵，能够不断吸收新的知识和经验，并将它们融合到自己的人生中。",
      "traits": ["适应性强", "学习能力", "平衡发展", "灵活应变"],
      "suggestions": [
        {
          "icon": "📚",
          "text": "继续保持学习的热情，探索更多感兴趣的领域"
        },
        {
          "icon": "🎯",
          "text": "可以尝试设定一些具体的短期目标来提升专注度"
        },
        {
          "icon": "🌟",
          "text": "发挥你的适应优势，尝试更多新的挑战"
        }
      ],
      "strengths": ["良好的适应能力", "学习热情", "全面的视角"],
      "developmentAreas": ["提升专业深度", "建立核心优势"],
      "lifeTips": "你的平衡是你的优势，但也可以尝试在某些领域深耕，打造自己的核心竞争力。",
      "summary": "你是全面发展的学习者，DouDou会陪你一起成长！"
    })
  }

  /**
   * 解析AI响应内容
   * @param {string} response AI返回的字符串
   * @returns {Object} 解析后的报告对象
   */
  parseAIResponse(response) {
    try {
      // 尝试解析JSON
      const report = JSON.parse(response)
      
      // 验证必要字段
      if (!report.title || !report.description || !report.traits) {
        throw new Error('AI响应格式不完整')
      }
      
      return {
        ...report,
        generatedAt: new Date().toISOString(),
        source: 'ai_generated'
      }
      
    } catch (error) {
      console.error('解析AI响应失败:', error)
      throw error
    }
  }

  /**
   * 获取默认报告（兜底方案）
   * @param {Array} answers 用户答案
   * @returns {Object} 默认报告
   */
  getDefaultReport(answers) {
    return {
      title: "独特的你",
      subtitle: "每个人都是独一无二的",
      description: "感谢你完成了这次性格测试！虽然目前无法生成详细的AI分析报告，但DouDou相信每个人都有自己独特的魅力和特点。通过你的回答，DouDou能感受到你是一个很有想法的人。让我们在日常的聊天中慢慢了解彼此吧！",
      traits: ["独特个性", "勇于尝试", "真实自我", "积极成长"],
      suggestions: [
        {
          "icon": "💬",
          "text": "多与DouDou聊天，让我们更好地了解彼此"
        },
        {
          "icon": "🌈",
          "text": "保持开放的心态，拥抱生活中的各种可能性"
        },
        {
          "icon": "✨",
          "text": "相信自己，每个人都有独特的价值和魅力"
        }
      ],
      strengths: ["真诚的态度", "探索的勇气"],
      developmentAreas: ["继续自我探索"],
      lifeTips: "生活就像一场冒险，保持好奇心和学习的热情，你会发现更多精彩！",
      summary: "你是独一无二的，DouDou期待与你一起探索更多可能！",
      generatedAt: new Date().toISOString(),
      source: 'default'
    }
  }

  /**
   * 构建流式提示词
   * @param {Array} answers 用户答案
   * @param {Object} userInfo 用户信息
   * @returns {string} 提示词
   */
  buildStreamPrompt(answers, userInfo) {
    let prompt = `你是DouDou，一个温暖贴心的AI伙伴。请根据用户的问卷回答生成一份个性化报告，包含以下四个部分：

1. 情绪安慰板块：以"全球有XX%的人正在经历..."开始，给予用户情感支持
2. 用户心声：根据用户的主观回答，理解用户的烦恼或想做的事
3. 个人目标：为用户设定可修改的个人成长目标
4. 行动建议：提供具体的小目标，分为硬技能、软技能、情绪管理三类

用户的问卷回答：
`
    
    answers.forEach((answer, index) => {
      if (answer.type === 'subjective') {
        prompt += `问题${index + 1}：${answer.question}\n回答：${answer.answer}\n\n`
      } else {
        prompt += `问题${index + 1}：${answer.question}\n选择：${answer.selectedLabel} (${answer.selectedValue})\n\n`
      }
    })
    
    prompt += `
请以JSON格式返回报告，包含：
{
  "emotionalSupport": "情绪安慰内容",
  "userConcerns": "用户心声分析",
  "personalGoals": "个人目标设定",
  "actionSuggestions": [
    {"type": "hard_skill", "content": "硬技能建议"},
    {"type": "soft_skill", "content": "软技能建议"},
    {"type": "emotion_management", "content": "情绪管理建议"}
  ]
}

请确保内容温暖、积极、具有可操作性。`
    
    return prompt
  }

  /**
   * 调用流式API
   * @param {string} prompt 提示词
   * @param {Function} onProgress 进度回调
   * @returns {Promise<string>} API响应
   */
  async callStreamAPI(prompt, onProgress) {
    try {
      // 模拟流式响应（实际应该调用真实的流式API）
      const mockResponse = await this.mockStreamResponse(prompt, onProgress)
      return mockResponse
      
    } catch (error) {
      console.error('流式API调用失败:', error)
      throw error
    }
  }

  /**
   * 模拟流式响应
   * @param {string} prompt 提示词
   * @param {Function} onProgress 进度回调
   * @returns {Promise<string>} 模拟响应
   */
  async mockStreamResponse(prompt, onProgress) {
    const mockReport = {
      emotionalSupport: "全球有73%的人正在经历职场适应的挑战，你并不孤单。DouDou理解你的感受，每一份努力都值得被看见。让我们一起找到属于你的成长节奏！ ❤️",
      userConcerns: "通过你的分享，DouDou感受到你在面对新环境时的勇敢和思考。这些都是成长路上珍贵的品质，相信你会找到属于自己的节奏。",
      personalGoals: "成为一个适应力强、善于学习的职场新人，在工作和人际关系中都能积极主动地成长。",
      actionSuggestions: [
        { type: "hard_skill", content: "制定学习计划，每周掌握一个新的工作技能" },
        { type: "soft_skill", content: "主动与同事交流，每天至少和一位同事进行友好互动" },
        { type: "emotion_management", content: "建立情绪调节习惯，遇到挫折时给自己积极的心理暗示" }
      ]
    }

    const fullText = JSON.stringify(mockReport, null, 2)
    const chunks = fullText.match(/.{1,10}/g) || [fullText]
    
    let accumulatedText = ''
    
    for (let i = 0; i < chunks.length; i++) {
      await new Promise(resolve => setTimeout(resolve, 50))
      accumulatedText += chunks[i]
      
      if (onProgress) {
        onProgress({
          chunk: chunks[i],
          accumulated: accumulatedText,
          progress: (i + 1) / chunks.length
        })
      }
    }
    
    return fullText
  }

  /**
   * 解析流式响应
   * @param {string} response 完整响应
   * @returns {Object} 解析后的报告对象
   */
  parseStreamResponse(response) {
    try {
      const report = JSON.parse(response)
      
      return {
        ...report,
        generatedAt: new Date().toISOString(),
        source: 'stream_generated'
      }
      
    } catch (error) {
      console.error('解析流式响应失败:', error)
      throw error
    }
  }

  /**
   * 调用AI API进行聊天对话
   * @param {string} userMessage 用户消息
   * @param {Array} conversationHistory 对话历史
   * @param {Object} options 配置选项
   * @returns {Promise<string>} AI回复内容
   */
  async chatWithAI(userMessage, conversationHistory = [], options = {}) {
    try {
      // 构建聊天提示词
      const prompt = this.buildChatPrompt(userMessage, conversationHistory, options)
      
      // 调用AI API
      const response = await this.callAIAPI(prompt, {
        max_tokens: options.maxTokens || 150, // 限制token数量，确保回复简洁
        temperature: options.temperature || 0.7,
        stream: options.stream || false
      })
      
      return response
      
    } catch (error) {
      console.error('AI聊天失败:', error)
      // 返回友好的错误回复
      return this.getFriendlyFallbackResponse(userMessage)
    }
  }

  /**
   * 构建聊天提示词
   * @param {string} userMessage 用户消息
   * @param {Array} conversationHistory 对话历史
   * @param {Object} options 配置选项
   * @returns {string} 构建好的提示词
   */
  buildChatPrompt(userMessage, conversationHistory = [], options = {}) {
    const systemPrompt = `你是DouDou，一个温暖、友善、专业的AI助手。

你的核心能力：
• 提供温暖贴心的情感支持和建议
• 帮助用户解决工作、学习、生活中的问题
• 给予积极正面的鼓励和指导
• 用简洁明了的方式回答问题

回答要求：
• 语调温暖友好，像朋友一样交流
• 回答简洁实用，控制在150字以内
• 根据用户需求提供具体可行的建议
• 保持积极正面的态度
• 回答必须控制在100字以内

请根据用户的问题，用温暖简洁的方式给予帮助。`

    // 构建对话历史上下文
    let contextPrompt = ''
    if (conversationHistory.length > 0) {
      // 只取最近4条消息作为上下文，保持简洁
      const recentHistory = conversationHistory.slice(-4)
      contextPrompt = '\n\n对话上下文：\n' + recentHistory.map(msg => 
        `${msg.role === 'user' ? '用户' : 'DouDou'}: ${msg.content}`
      ).join('\n')
    }

    // 构建完整提示词
    return `${systemPrompt}${contextPrompt}\n\n用户消息：${userMessage}`
  }

  /**
   * 获取友好的兜底回复
   * @param {string} userMessage 用户消息
   * @returns {string} 兜底回复内容
   */
  getFriendlyFallbackResponse(userMessage) {
    const fallbackResponses = [
      '抱歉，我现在有点忙，请稍后再试一下~ 😅',
      '网络有点卡，让我重新连接一下，请稍等~ 🌐',
      '我这边遇到了一点小问题，但我会尽快恢复的！ 💪',
      '技术故障，正在修复中，请耐心等待一下~ 🔧',
      '系统维护中，我马上就能继续为你服务了！ ⚡'
    ]
    
    // 根据用户消息内容选择合适的兜底回复
    if (userMessage.includes('你好') || userMessage.includes('hi') || userMessage.includes('hello')) {
      return '你好！我是DouDou，很高兴见到你！虽然现在有点小问题，但我很快就能继续为你服务了~ 😊'
    }
    
    if (userMessage.includes('帮助') || userMessage.includes('问题') || userMessage.includes('怎么办')) {
      return '我理解你的困扰，虽然现在暂时无法详细回复，但请相信问题总有解决的办法。稍后我会继续为你提供帮助！ 💪'
    }
    
    // 随机选择一个兜底回复
    const randomIndex = Math.floor(Math.random() * fallbackResponses.length)
    return fallbackResponses[randomIndex]
  }

  /**
   * 流式聊天（支持实时显示）
   * @param {string} userMessage 用户消息
   * @param {Array} conversationHistory 对话历史
   * @param {Function} onProgress 进度回调
   * @param {Object} options 配置选项
   * @returns {Promise<string>} 完整回复
   */
  async chatWithAIStream(userMessage, conversationHistory = [], onProgress, options = {}) {
    try {
      const prompt = this.buildChatPrompt(userMessage, conversationHistory, options)
      
      if (options.stream) {
        // 调用流式API
        return await this.callStreamAPI(prompt, onProgress)
      } else {
        // 调用普通API
        const response = await this.callAIAPI(prompt, options)
        
        // 模拟流式效果
        if (onProgress) {
          await this.simulateStreamProgress(response, onProgress)
        }
        
        return response
      }
      
    } catch (error) {
      console.error('流式AI聊天失败:', error)
      const fallbackResponse = this.getFriendlyFallbackResponse(userMessage)
      
      if (onProgress) {
        await this.simulateStreamProgress(fallbackResponse, onProgress)
      }
      
      return fallbackResponse
    }
  }

  /**
   * 知识库总结相关方法
   * 用于对收藏的对话进行深度分析和总结
   */

  /**
   * 对收藏的对话进行AI总结分析
   * @param {Array} selectedChats 选中的对话列表
   * @param {Object} options 配置选项
   * @returns {Promise<Object>} 总结结果
   */
  async summarizeChatsForKnowledge(selectedChats, options = {}) {
    try {
      // 优先使用豆包AI进行深度分析
      if (options.useDoubao !== false) {
        const doubaoResult = await this.analyzeChatsWithDoubao(selectedChats, options)
        if (doubaoResult) {
          return doubaoResult
        }
      }
      
      // 备用方案：使用原有方法
      const prompt = this.buildKnowledgeSummaryPrompt(selectedChats, options)
      
      // 调用AI API进行总结
      const response = await this.callAIAPI(prompt, {
        max_tokens: options.maxTokens || 500,
        temperature: options.temperature || 0.3, // 降低温度，使总结更稳定
        ...options
      })
      
      // 解析AI响应
      return this.parseKnowledgeSummaryResponse(response, selectedChats)
      
    } catch (error) {
      console.error('知识库总结失败:', error)
      // 返回默认总结
      return this.getDefaultKnowledgeSummary(selectedChats)
    }
  }

  /**
   * 使用豆包AI进行对话复盘分析
   * @param {Array} chats 对话数据
   * @param {Object} options 配置选项
   * @returns {Promise<Object>} 分析结果
   */
  async analyzeChatsWithDoubao(chats, options = {}) {
    try {
      console.log('开始使用豆包AI进行对话复盘分析...')
      
      // 构建豆包AI分析提示词
      const prompt = this.buildDoubaoAnalysisPrompt(chats, options)
      
      // 调用豆包AI API
      const response = await this.callAIAPI(prompt, {
        temperature: 0.6,
        max_tokens: 3000,
        ...options
      })
      
      return this.parseDoubaoAnalysisResponse(response, chats)
      
    } catch (error) {
      console.error('豆包AI分析失败:', error)
      return null // 返回null让调用方使用备用方案
    }
  }

  /**
   * 构建豆包AI分析提示词
   * @param {Array} chats 对话数据
   * @param {Object} options 配置选项
   * @returns {string} 构建好的提示词
   */
  buildDoubaoAnalysisPrompt(chats, options = {}) {
    const systemPrompt = `你是豆包AI，一个专业的复盘分析师。请对用户的对话进行深度分析，重点关注问题拆解、内因外因分析。

分析要求：
1. 【情感支撑】- 提供温暖的情感支持，让用户知道这种经历很常见
2. 【问题拆解】- 深入分析外在因素和内在因素
3. 【肯定正确】- 识别用户做对的事情
4. 【多角度视野】- 提供不同视角的思考
5. 【行动计划】- 给出具体的改进建议

请以专业、温暖、建设性的态度进行分析。`

    // 构建对话内容
    let conversationContent = ''
    chats.forEach((chat, index) => {
      conversationContent += `\n\n=== 对话 ${index + 1} ===\n`
      conversationContent += `时间：${new Date(chat.timestamp).toLocaleString()}\n`
      conversationContent += `标题：${chat.title}\n`
      conversationContent += `内容：\n`
      
      if (chat.messages && chat.messages.length > 0) {
        chat.messages.forEach(msg => {
          conversationContent += `${msg.isUser ? '用户' : 'AI'}: ${msg.content}\n`
        })
      } else {
        conversationContent += chat.content || '无具体内容\n'
      }
    })

    const fullPrompt = `${systemPrompt}

请分析以下对话内容：

${conversationContent}

请返回JSON格式的分析结果：
{
  "title": "复盘标题",
  "summary": "核心总结",
  "emotionalSupport": {
    "universality": "普遍性分析",
    "percentage": 78
  },
  "failureAnalysis": {
    "externalFactors": ["外在因素1", "外在因素2"],
    "internalFactors": ["内在因素1", "内在因素2"],
    "keyObstacles": ["关键卡点1", "关键卡点2"]
  },
  "positiveActions": {
    "correctBehaviors": ["正确行为1", "正确行为2"],
    "effectiveStrategies": ["有效策略1", "有效策略2"],
    "strengths": ["展现优势1", "展现优势2"]
  },
  "multiPerspective": {
    "alternativeViews": ["不同视角1", "不同视角2"],
    "systematicThinking": ["系统思考1", "系统思考2"],
    "growthMindset": ["成长思维1", "成长思维2"]
  },
  "actionPlan": ["行动1", "行动2", "行动3"],
  "tags": ["标签1", "标签2", "标签3"],
  "insights": ["洞察1", "洞察2", "洞察3"]
}`

    return fullPrompt
  }

  /**
   * 解析豆包AI分析响应
   * @param {Object} response AI响应
   * @param {Array} chats 原始对话数据
   * @returns {Object} 解析后的分析结果
   */
  parseDoubaoAnalysisResponse(response, chats) {
    try {
      let analysisData
      
      if (typeof response === 'string') {
        // 尝试解析JSON
        const jsonMatch = response.match(/\{[\s\S]*\}/)
        if (jsonMatch) {
          analysisData = JSON.parse(jsonMatch[0])
        } else {
          throw new Error('无法解析AI响应为JSON格式')
        }
      } else if (response.choices && response.choices[0]) {
        const content = response.choices[0].message.content
        const jsonMatch = content.match(/\{[\s\S]*\}/)
        if (jsonMatch) {
          analysisData = JSON.parse(jsonMatch[0])
        } else {
          throw new Error('无法从AI响应中提取JSON')
        }
      } else {
        throw new Error('AI响应格式不正确')
      }

      // 确保必要字段存在
      return {
        title: analysisData.title || '对话复盘分析',
        summary: analysisData.summary || '基于对话内容的深度分析',
        emotionalSupport: {
          universality: analysisData.emotionalSupport?.universality || '这种经历很常见，很多人都会遇到类似的挑战',
          percentage: analysisData.emotionalSupport?.percentage || 75
        },
        failureAnalysis: {
          externalFactors: analysisData.failureAnalysis?.externalFactors || ['环境因素', '时机因素'],
          internalFactors: analysisData.failureAnalysis?.internalFactors || ['思维模式', '技能水平'],
          keyObstacles: analysisData.failureAnalysis?.keyObstacles || ['关键障碍1', '关键障碍2']
        },
        positiveActions: {
          correctBehaviors: analysisData.positiveActions?.correctBehaviors || ['正确行为1', '正确行为2'],
          effectiveStrategies: analysisData.positiveActions?.effectiveStrategies || ['有效策略1', '有效策略2'],
          strengths: analysisData.positiveActions?.strengths || ['优势1', '优势2']
        },
        multiPerspective: {
          alternativeViews: analysisData.multiPerspective?.alternativeViews || ['视角1', '视角2'],
          systematicThinking: analysisData.multiPerspective?.systematicThinking || ['系统思考1', '系统思考2'],
          growthMindset: analysisData.multiPerspective?.growthMindset || ['成长思维1', '成长思维2']
        },
        actionPlan: analysisData.actionPlan || ['行动计划1', '行动计划2', '行动计划3'],
        tags: analysisData.tags || ['复盘', '成长', '反思'],
        insights: analysisData.insights || ['洞察1', '洞察2', '洞察3'],
        chatCount: chats.length,
        needsAIAnalysis: false,
        createdTime: Date.now(),
        source: 'doubao_ai'
      }
      
    } catch (error) {
      console.error('解析豆包AI分析响应失败:', error)
      return this.getDefaultAnalysisResult(chats)
    }
  }

  /**
   * 获取默认分析结果
   * @param {Array} chats 对话数据
   * @returns {Object} 默认分析结果
   */
  getDefaultAnalysisResult(chats) {
    return {
      title: '对话复盘分析',
      summary: '基于对话内容的深度分析，帮助识别问题和成长机会',
      emotionalSupport: {
        universality: '这种经历很常见，很多人都会遇到类似的挑战',
        percentage: 75
      },
      failureAnalysis: {
        externalFactors: ['环境因素', '时机因素', '资源限制'],
        internalFactors: ['思维模式', '技能水平', '情绪管理'],
        keyObstacles: ['关键障碍1', '关键障碍2']
      },
      positiveActions: {
        correctBehaviors: ['正确行为1', '正确行为2'],
        effectiveStrategies: ['有效策略1', '有效策略2'],
        strengths: ['优势1', '优势2']
      },
      multiPerspective: {
        alternativeViews: ['视角1', '视角2'],
        systematicThinking: ['系统思考1', '系统思考2'],
        growthMindset: ['成长思维1', '成长思维2']
      },
      actionPlan: ['行动计划1', '行动计划2', '行动计划3'],
      tags: ['复盘', '成长', '反思'],
      insights: ['洞察1', '洞察2', '洞察3'],
      chatCount: chats.length,
      needsAIAnalysis: false,
      createdTime: Date.now(),
      source: 'default'
    }
  }

  /**
   * 构建知识库总结提示词
   * @param {Array} selectedChats 选中的对话列表
   * @param {Object} options 配置选项
   * @returns {string} 构建好的提示词
   */
  buildKnowledgeSummaryPrompt(selectedChats, options = {}) {
    const systemPrompt = `你是一个专业的复盘分析师，专门帮助用户进行深度反思和成长。你的分析风格温暖、鼓励且具有建设性。

你的复盘逻辑遵循以下四个层次：

1. 【情感支撑】- 从鼓励的视角让用户感觉自己不是孤立的失败者
   • 肯定用户的勇气和努力
   • 指出经历的普遍性和成长价值
   • 提供情感上的理解和支持

2. 【拆解分析】- 把模糊的"失败"拆开，让用户看清"卡在哪"
   • 识别外在因素（环境、时机、资源等）
   • 分析内在因素（思维模式、技能、情绪等）
   • 明确具体的卡点和障碍

3. 【肯定正确】- 避免陷入全盘否定自己
   • 识别用户做对的事情
   • 肯定有效的策略和行为
   • 强化正确的思维模式

4. 【多角度视野】- 帮助用户跳出学生思维进入职场思维
   • 提供不同的视角和解决方案
   • 引导系统性思考
   • 培养成长型思维模式

请以温暖、专业的态度进行分析，帮助用户建立自信并找到成长方向。`

    // 构建对话内容
    let conversationContent = ''
    selectedChats.forEach((chat, index) => {
      conversationContent += `\n\n=== 对话 ${index + 1} ===\n`
      conversationContent += `时间：${new Date(chat.timestamp).toLocaleString()}\n`
      conversationContent += `标题：${chat.title}\n`
      conversationContent += `内容：\n`
      
      if (chat.messages && chat.messages.length > 0) {
        chat.messages.forEach(msg => {
          conversationContent += `${msg.isUser ? '用户' : 'AI'}: ${msg.content}\n`
        })
      } else {
        conversationContent += chat.content || '无具体内容\n'
      }
    })

    // 构建完整提示词
    const fullPrompt = `${systemPrompt}

请分析以下对话内容，并提供详细的总结报告：

${conversationContent}

请按照以下格式返回JSON格式的复盘分析结果：
{
  "title": "复盘标题（温暖且有希望感）",
  "summary": "核心总结（150-200字，体现成长视角）",
  "emotionalSupport": {
    "encouragement": "鼓励话语（肯定用户的努力和勇气）",
    "universality": "普遍性分析（让用户知道这种经历很常见）",
    "value": "价值发现（这次经历的成长意义）"
  },
  "failureAnalysis": {
    "externalFactors": ["外在因素1", "外在因素2"],
    "internalFactors": ["内在因素1", "内在因素2"], 
    "keyObstacles": ["具体卡点1", "具体卡点2"]
  },
  "positiveActions": {
    "correctBehaviors": ["做对的事情1", "做对的事情2"],
    "effectiveStrategies": ["有效策略1", "有效策略2"],
    "strengths": ["展现的优势1", "展现的优势2"]
  },
  "multiPerspective": {
    "alternativeViews": ["不同视角1", "不同视角2"],
    "systematicThinking": ["系统思考要点1", "系统思考要点2"],
    "growthMindset": ["成长型思维建议1", "成长型思维建议2"]
  },
  "actionPlan": ["下一步行动1", "下一步行动2", "下一步行动3"],
  "tags": ["标签1", "标签2", "标签3"],
  "analysisType": "reflection_analysis"
}

要求：
1. 情感支撑要真诚温暖，避免空洞的安慰
2. 失败拆解要具体明确，帮助用户看清问题本质
3. 正确行为要具体肯定，建立用户自信
4. 多角度视野要开阔实用，引导思维升级
5. 行动计划要可操作且循序渐进`

    return fullPrompt
  }

  /**
   * 解析知识库总结响应
   * @param {string} response AI响应内容
   * @param {Array} selectedChats 原始对话数据
   * @returns {Object} 解析后的总结对象
   */
  parseKnowledgeSummaryResponse(response, selectedChats) {
    try {
      // 尝试解析JSON响应
      const summaryData = JSON.parse(response)
      
      return {
        id: Date.now().toString(36) + Math.random().toString(36).substr(2),
        title: summaryData.title || '复盘分析',
        summary: summaryData.summary || '暂无总结内容',
        emotionalSupport: summaryData.emotionalSupport || {
          encouragement: '每一次尝试都是成长的开始',
          universality: '这样的经历很多人都有过',
          value: '这次经历为你带来了宝贵的学习机会'
        },
        failureAnalysis: summaryData.failureAnalysis || {
          externalFactors: [],
          internalFactors: [],
          keyObstacles: []
        },
        positiveActions: summaryData.positiveActions || {
          correctBehaviors: [],
          effectiveStrategies: [],
          strengths: []
        },
        multiPerspective: summaryData.multiPerspective || {
          alternativeViews: [],
          systematicThinking: [],
          growthMindset: []
        },
        actionPlan: summaryData.actionPlan || [],
        tags: summaryData.tags || [],
        analysisType: summaryData.analysisType || 'reflection_analysis',
        chatCount: selectedChats.length,
        chats: selectedChats.map(chat => ({
          id: chat.chatId || chat.id,
          title: chat.title,
          timestamp: chat.timestamp
        })),
        createdTime: Date.now(),
        needsAIAnalysis: false // 已完成AI分析
      }
    } catch (error) {
      console.error('解析AI总结响应失败:', error)
      // 返回基于原始响应的简单总结
      return this.getDefaultKnowledgeSummary(selectedChats, response)
    }
  }

  /**
   * 获取默认的知识库总结
   * @param {Array} selectedChats 选中的对话列表
   * @param {string} rawResponse 原始AI响应（可选）
   * @returns {Object} 默认总结对象
   */
  getDefaultKnowledgeSummary(selectedChats, rawResponse = '') {
    const totalChats = selectedChats.length
    const timeRange = this.calculateTimeRange(selectedChats)
    
    return {
      id: Date.now().toString(36) + Math.random().toString(36).substr(2),
      title: `复盘分析 - ${timeRange}`,
      summary: rawResponse || `基于${totalChats}个对话的复盘总结。这些对话记录了你的思考过程、问题解决方式和成长轨迹。通过回顾这些对话，我们可以看到你在不同话题上的关注点和思考模式。`,
      emotionalSupport: {
        encouragement: '你勇于思考和探索，这本身就是一种成长',
        universality: '每个人都会在成长过程中遇到各种挑战',
        value: '这些对话记录了你宝贵的思考轨迹'
      },
      failureAnalysis: {
        externalFactors: ['需要进一步AI分析'],
        internalFactors: ['需要进一步AI分析'],
        keyObstacles: ['需要进一步AI分析']
      },
      positiveActions: {
        correctBehaviors: ['主动寻求帮助和建议'],
        effectiveStrategies: ['通过对话整理思路'],
        strengths: ['善于思考和反思']
      },
      multiPerspective: {
        alternativeViews: ['需要进一步AI分析'],
        systematicThinking: ['需要进一步AI分析'],
        growthMindset: ['保持学习和成长的心态']
      },
      actionPlan: [
        '定期回顾对话内容，发现自己的思考模式',
        '关注重复出现的问题，寻找根本解决方案',
        '将AI建议应用到实际生活中'
      ],
      tags: this.extractBasicTags(selectedChats),
      analysisType: 'basic_summary',
      chatCount: totalChats,
      chats: selectedChats.map(chat => ({
        id: chat.chatId || chat.id,
        title: chat.title,
        timestamp: chat.timestamp
      })),
      createdTime: Date.now(),
      needsAIAnalysis: true // 标记需要进一步AI分析
    }
  }

  /**
   * 计算对话时间范围
   * @param {Array} chats 对话列表
   * @returns {string} 时间范围描述
   */
  calculateTimeRange(chats) {
    if (chats.length === 0) return '未知时间'
    
    const timestamps = chats.map(chat => chat.timestamp).filter(t => t)
    if (timestamps.length === 0) return '未知时间'
    
    const minTime = Math.min(...timestamps)
    const maxTime = Math.max(...timestamps)
    const minDate = new Date(minTime)
    const maxDate = new Date(maxTime)
    
    if (minDate.toDateString() === maxDate.toDateString()) {
      return minDate.toLocaleDateString()
    } else {
      return `${minDate.toLocaleDateString()} - ${maxDate.toLocaleDateString()}`
    }
  }

  /**
   * 提取基础标签
   * @param {Array} chats 对话列表
   * @returns {Array} 标签列表
   */
  extractBasicTags(chats) {
    const commonTags = ['工作', '学习', '情绪', '效率', '沟通', '技能', '生活', '成长']
    const tags = []
    
    chats.forEach(chat => {
      const content = (chat.messages && chat.messages.length > 0) 
        ? chat.messages.map(msg => msg.content).join(' ')
        : (chat.content || chat.title || '')
      
      commonTags.forEach(tag => {
        if (content.includes(tag) && !tags.includes(tag)) {
          tags.push(tag)
        }
      })
    })
    
    return tags.slice(0, 5) // 最多5个标签
  }

  /**
   * AI创作相关方法
   * 支持基于聊天记录和知识卡片生成图片/视频
   */

  /**
   * 生成AI创作内容（图片或视频）
   * @param {Object} creationData 创作数据
   * @param {Function} onProgress 进度回调
   * @returns {Promise<Object>} 创作结果
   */
  async generateCreativeContent(creationData, onProgress) {
    try {
      console.log('开始AI创作:', creationData)
      
      // 首先尝试调用后端API
      const backendResult = await this.generateCreativeContentFromBackend(creationData, onProgress)
      if (backendResult) {
        return backendResult
      }
    } catch (error) {
      console.warn('后端API创作失败，使用本地模拟:', error)
    }

    try {
      // 备用方案：本地模拟创作过程
      return await this.mockCreativeGeneration(creationData, onProgress)
    } catch (error) {
      console.error('AI创作失败:', error)
      throw new Error('创作失败，请稍后重试')
    }
  }

  /**
   * 调用后端API生成创作内容
   * @param {Object} creationData 创作数据
   * @param {Function} onProgress 进度回调
   * @returns {Promise<Object>} 创作结果
   */
  async generateCreativeContentFromBackend(creationData, onProgress) {
    try {
      // 首先尝试新的Doubao内容生成API
      const doubaoResult = await this.callDoubaoContentGenerationAPI(creationData, onProgress)
      if (doubaoResult) {
        return doubaoResult
      }
    } catch (error) {
      console.warn('Doubao内容生成API调用失败，尝试后端API:', error)
    }

    try {
      // 备用方案：原有的后端API
      const requestData = {
        type: creationData.type, // 'image' 或 'video'
        content: this.buildCreativePrompt(creationData),
        options: {
          style: creationData.style || 'default',
          quality: creationData.quality || 'high',
          dimensions: creationData.dimensions || (creationData.type === 'image' ? '1024x1024' : '1280x720')
        }
      }

      // 调用后端API
      const response = await apiService.generateCreativeContent(requestData)
      
      if (response.data) {
        return {
          id: response.data.id || Date.now().toString(),
          type: creationData.type,
          status: 'completed',
          result: response.data.result,
          url: response.data.url,
          thumbnail: response.data.thumbnail,
          metadata: response.data.metadata || {},
          createdAt: new Date().toISOString(),
          source: 'backend_api'
        }
      }
      
      return null
    } catch (error) {
      console.error('后端创作API调用失败:', error)
      throw error
    }
  }

  /**
   * 调用Doubao内容生成API
   * @param {Object} creationData 创作数据
   * @param {Function} onProgress 进度回调
   * @returns {Promise<Object>} 创作结果
   */
  async callDoubaoContentGenerationAPI(creationData, onProgress) {
    try {
      console.log('调用Doubao内容生成API:', creationData)
      
      if (onProgress) {
        onProgress({ step: 1, message: '准备调用Doubao AI...', progress: 10 })
      }

      // 构建请求数据
      const requestData = {
        model: this.apiConfig.contentGenerationModel,
        prompt: this.buildDoubaoContentPrompt(creationData),
        parameters: {
          width: creationData.type === 'image' ? 1024 : 1280,
          height: creationData.type === 'image' ? 1024 : 720,
          steps: 20,
          scale: 7.5,
          seed: Math.floor(Math.random() * 1000000)
        }
      }

      if (onProgress) {
        onProgress({ step: 2, message: '发送请求到Doubao AI...', progress: 25 })
      }

      // 调用Doubao内容生成API
      const response = await fetch(`${this.apiConfig.baseUrl}/contents/generations/tasks`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.apiConfig.apiKey}`
        },
        body: JSON.stringify(requestData)
      })

      if (onProgress) {
        onProgress({ step: 3, message: '处理API响应...', progress: 40 })
      }

      if (!response.ok) {
        throw new Error(`Doubao API调用失败: ${response.status} ${response.statusText}`)
      }

      const data = await response.json()
      console.log('Doubao API响应:', data)

      if (onProgress) {
        onProgress({ step: 4, message: '解析生成结果...', progress: 60 })
      }

      // 处理任务创建响应
      if (data.task_id) {
        // 轮询任务状态
        const result = await this.pollDoubaoTaskStatus(data.task_id, onProgress)
        return result
      } else if (data.data && data.data.length > 0) {
        // 直接返回结果
        return this.parseDoubaoContentResult(data, creationData)
      } else {
        throw new Error('Doubao API返回数据格式不正确')
      }

    } catch (error) {
      console.error('Doubao内容生成API调用失败:', error)
      throw error
    }
  }

  /**
   * 构建Doubao内容生成提示词
   * @param {Object} creationData 创作数据
   * @returns {string} 构建好的提示词
   */
  buildDoubaoContentPrompt(creationData) {
    let prompt = ''
    
    // 添加选中的聊天记录
    if (creationData.selectedChats && creationData.selectedChats.length > 0) {
      prompt += '基于以下对话内容创作：\n'
      creationData.selectedChats.forEach((chat, index) => {
        const roleText = chat.role === 'user' ? '用户' : 'DouDou'
        prompt += `${roleText}: ${chat.content}\n`
      })
      prompt += '\n'
    }
    
    // 添加选中的知识卡片
    if (creationData.selectedKnowledge && creationData.selectedKnowledge.length > 0) {
      prompt += '结合以下知识内容：\n'
      creationData.selectedKnowledge.forEach(knowledge => {
        prompt += `标题: ${knowledge.title || '无标题'}\n`
        prompt += `摘要: ${knowledge.summary || '暂无总结内容'}\n`
        if (knowledge.insights && knowledge.insights.length > 0) {
          prompt += `关键洞察: ${knowledge.insights.join('；')}\n`
        }
        prompt += '\n'
      })
    }
    
    // 添加自定义文本
    if (creationData.customText && creationData.customText.trim()) {
      prompt += '用户要求：\n'
      prompt += creationData.customText.trim() + '\n\n'
    }
    
    // 添加创作类型和风格指导
    if (creationData.type === 'image') {
      prompt += '请创作一张富有表现力的图片，要求：\n'
      prompt += '- 画面美观，色彩和谐\n'
      prompt += '- 主题明确，情感表达到位\n'
      prompt += '- 构图合理，视觉冲击力强\n'
      prompt += '- 风格现代，符合年轻人审美\n'
    } else if (creationData.type === 'video') {
      prompt += '请创作一段富有表现力的视频，要求：\n'
      prompt += '- 画面流畅，节奏把控好\n'
      prompt += '- 内容连贯，故事性强\n'
      prompt += '- 视觉效果佳，有吸引力\n'
      prompt += '- 时长适中，信息传达清晰\n'
    }
    
    return prompt
  }

  /**
   * 轮询Doubao任务状态
   * @param {string} taskId 任务ID
   * @param {Function} onProgress 进度回调
   * @returns {Promise<Object>} 任务结果
   */
  async pollDoubaoTaskStatus(taskId, onProgress) {
    const maxAttempts = 30 // 最多轮询30次
    const pollInterval = 2000 // 每2秒轮询一次
    
    for (let attempt = 0; attempt < maxAttempts; attempt++) {
      try {
        if (onProgress) {
          const progress = 60 + (attempt / maxAttempts) * 30
          onProgress({ 
            step: 4, 
            message: `生成中，请稍候... (${attempt + 1}/${maxAttempts})`, 
            progress: Math.min(progress, 90) 
          })
        }

        const response = await fetch(`${this.apiConfig.baseUrl}/contents/generations/tasks/${taskId}`, {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${this.apiConfig.apiKey}`
          }
        })

        if (!response.ok) {
          throw new Error(`任务状态查询失败: ${response.status}`)
        }

        const data = await response.json()
        console.log(`任务状态查询 (${attempt + 1}):`, data)

        if (data.status === 'completed' && data.data && data.data.length > 0) {
          if (onProgress) {
            onProgress({ step: 6, message: '生成完成！', progress: 100 })
          }
          return this.parseDoubaoContentResult(data, { type: 'image' }) // 假设是图片
        } else if (data.status === 'failed') {
          throw new Error('内容生成失败: ' + (data.error || '未知错误'))
        }

        // 等待下一次轮询
        await new Promise(resolve => setTimeout(resolve, pollInterval))

      } catch (error) {
        console.error(`任务状态查询失败 (${attempt + 1}):`, error)
        if (attempt === maxAttempts - 1) {
          throw error
        }
      }
    }

    throw new Error('内容生成超时，请稍后重试')
  }

  /**
   * 解析Doubao内容生成结果
   * @param {Object} data API响应数据
   * @param {Object} creationData 原始创作数据
   * @returns {Object} 解析后的结果
   */
  parseDoubaoContentResult(data, creationData) {
    const resultItem = data.data[0] // 取第一个结果
    
    return {
      id: data.task_id || Date.now().toString(),
      type: creationData.type || 'image',
      status: 'completed',
      result: {
        title: `AI创作 - ${creationData.type === 'image' ? '图片' : '视频'}`,
        description: '基于您的内容生成的创意作品',
        generatedBy: 'Doubao AI',
        model: this.apiConfig.contentGenerationModel
      },
      url: resultItem.url || resultItem.image_url,
      thumbnail: resultItem.thumbnail || resultItem.url || resultItem.image_url,
      metadata: {
        prompt: this.buildDoubaoContentPrompt(creationData),
        model: this.apiConfig.contentGenerationModel,
        parameters: resultItem.parameters || {},
        generationTime: Date.now()
      },
      createdAt: new Date().toISOString(),
      source: 'doubao_api'
    }
  }

  /**
   * 构建创作提示词
   * @param {Object} creationData 创作数据
   * @returns {string} 构建好的提示词
   */
  buildCreativePrompt(creationData) {
    let prompt = ''
    
    // 添加选中的聊天记录
    if (creationData.selectedChats && creationData.selectedChats.length > 0) {
      prompt += '【基于以下聊天记录】\n'
      creationData.selectedChats.forEach((chat, index) => {
        const roleText = chat.role === 'user' ? '我' : 'DouDou'
        prompt += `${roleText}: ${chat.content}\n`
      })
      prompt += '\n'
    }
    
    // 添加选中的知识卡片
    if (creationData.selectedKnowledge && creationData.selectedKnowledge.length > 0) {
      prompt += '【基于以下知识内容】\n'
      creationData.selectedKnowledge.forEach(knowledge => {
        prompt += `标题: ${knowledge.title || '无标题'}\n`
        prompt += `内容: ${knowledge.summary || '暂无总结内容'}\n`
        if (knowledge.insights && knowledge.insights.length > 0) {
          prompt += `关键洞察: ${knowledge.insights.join('；')}\n`
        }
        prompt += '\n'
      })
    }
    
    // 添加自定义文本
    if (creationData.customText && creationData.customText.trim()) {
      prompt += '【自定义要求】\n'
      prompt += creationData.customText.trim() + '\n\n'
    }
    
    // 添加创作类型说明
    if (creationData.type === 'image') {
      prompt += '请基于以上内容生成一张富有创意和表现力的图片，要求画面美观、主题明确、色彩和谐。'
    } else if (creationData.type === 'video') {
      prompt += '请基于以上内容生成一段有趣且富有表现力的视频，要求画面流畅、内容连贯、视觉效果佳。'
    }
    
    return prompt
  }

  /**
   * 模拟创作生成过程
   * @param {Object} creationData 创作数据
   * @param {Function} onProgress 进度回调
   * @returns {Promise<Object>} 模拟创作结果
   */
  async mockCreativeGeneration(creationData, onProgress) {
    const steps = [
      { step: 1, message: '正在分析创作内容...', progress: 10 },
      { step: 2, message: '生成创作思路...', progress: 25 },
      { step: 3, message: `开始生成${creationData.type === 'image' ? '图片' : '视频'}...`, progress: 40 },
      { step: 4, message: '优化视觉效果...', progress: 60 },
      { step: 5, message: '渲染最终结果...', progress: 80 },
      { step: 6, message: '生成完成！', progress: 100 }
    ]

    // 模拟创作进度
    for (const step of steps) {
      await new Promise(resolve => setTimeout(resolve, 1000 + Math.random() * 1000))
      if (onProgress) {
        onProgress(step)
      }
    }

    // 返回模拟结果
    return {
      id: Date.now().toString(),
      type: creationData.type,
      status: 'completed',
      result: this.getMockCreativeResult(creationData),
      url: this.getMockCreativeUrl(creationData.type),
      thumbnail: this.getMockThumbnailUrl(creationData.type),
      metadata: {
        prompt: this.buildCreativePrompt(creationData),
        generationTime: Date.now(),
        style: 'default',
        quality: 'high'
      },
      createdAt: new Date().toISOString(),
      source: 'mock_generation'
    }
  }

  /**
   * 获取模拟创作结果
   * @param {Object} creationData 创作数据
   * @returns {Object} 模拟结果描述
   */
  getMockCreativeResult(creationData) {
    const contentSummary = this.summarizeCreationContent(creationData)
    
    if (creationData.type === 'image') {
      return {
        title: `基于"${contentSummary}"的创意图片`,
        description: `根据您提供的内容，我生成了一张富有创意的图片。图片融合了对话中的关键元素和情感，用视觉的方式呈现了您的想法和感受。`,
        style: 'artistic',
        dimensions: '1024x1024',
        format: 'PNG'
      }
    } else {
      return {
        title: `基于"${contentSummary}"的创意视频`,
        description: `根据您提供的内容，我制作了一段富有表现力的视频。视频通过动态画面和转场效果，生动地展现了对话中的故事和情感。`,
        duration: '10秒',
        resolution: '1280x720',
        format: 'MP4'
      }
    }
  }

  /**
   * 总结创作内容
   * @param {Object} creationData 创作数据
   * @returns {string} 内容摘要
   */
  summarizeCreationContent(creationData) {
    const elements = []
    
    if (creationData.selectedChats && creationData.selectedChats.length > 0) {
      elements.push(`${creationData.selectedChats.length}条对话`)
    }
    
    if (creationData.selectedKnowledge && creationData.selectedKnowledge.length > 0) {
      elements.push(`${creationData.selectedKnowledge.length}张知识卡片`)
    }
    
    if (creationData.customText && creationData.customText.trim()) {
      const preview = creationData.customText.trim().substring(0, 20)
      elements.push(`"${preview}${creationData.customText.length > 20 ? '...' : ''}"`)
    }
    
    return elements.length > 0 ? elements.join('和') : '您的创作想法'
  }

  /**
   * 获取模拟创作URL
   * @param {string} type 创作类型
   * @returns {string} 模拟URL
   */
  getMockCreativeUrl(type) {
    if (type === 'image') {
      // 返回一个占位图片URL
      return `https://picsum.photos/1024/1024?random=${Date.now()}`
    } else {
      // 返回一个占位视频URL - 使用多个备用源
      const videoSources = [
        'https://sample-videos.com/zip/10/mp4/SampleVideo_1280x720_1mb.mp4',
        'https://www.learningcontainer.com/wp-content/uploads/2020/05/sample-mp4-file.mp4',
        'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4',
        'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4'
      ]
      
      // 随机选择一个视频源
      const randomIndex = Math.floor(Math.random() * videoSources.length)
      return videoSources[randomIndex]
    }
  }

  /**
   * 获取模拟缩略图URL
   * @param {string} type 创作类型
   * @returns {string} 缩略图URL
   */
  getMockThumbnailUrl(type) {
    if (type === 'image') {
      return `https://picsum.photos/300/300?random=${Date.now()}`
    } else {
      return `https://picsum.photos/400/225?random=${Date.now()}`
    }
  }

  /**
   * 获取创作历史记录
   * @param {number} limit 限制数量
   * @returns {Array} 创作历史列表
   */
  getCreationHistory(limit = 10) {
    try {
      const history = uni.getStorageSync('ai_creation_history') || []
      return history.slice(0, limit)
    } catch (error) {
      console.error('获取创作历史失败:', error)
      return []
    }
  }

  /**
   * 保存创作结果到历史记录
   * @param {Object} creationResult 创作结果
   */
  saveCreationToHistory(creationResult) {
    try {
      const history = this.getCreationHistory(50) // 保留最近50条记录
      history.unshift(creationResult)
      uni.setStorageSync('ai_creation_history', history)
    } catch (error) {
      console.error('保存创作历史失败:', error)
    }
  }

  /**
   * 验证Doubao API连接状态
   * @returns {Promise<boolean>} 连接状态
   */
  async validateDoubaoConnection() {
    try {
      const response = await fetch(`${this.apiConfig.baseUrl}/models`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${this.apiConfig.apiKey}`
        }
      })
      return response.ok
    } catch (error) {
      console.error('Doubao API连接验证失败:', error)
      return false
    }
  }

  /**
   * 获取Doubao API使用统计
   * @returns {Promise<Object>} 使用统计信息
   */
  async getDoubaoUsageStats() {
    try {
      const response = await fetch(`${this.apiConfig.baseUrl}/usage`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${this.apiConfig.apiKey}`
        }
      })
      
      if (response.ok) {
        return await response.json()
      }
      return null
    } catch (error) {
      console.error('获取Doubao使用统计失败:', error)
      return null
    }
  }

  /**
   * 处理创作内容的智能优化
   * @param {Object} creationData 原始创作数据
   * @returns {Object} 优化后的创作数据
   */
  optimizeCreationContent(creationData) {
    const optimized = { ...creationData }
    
    // 智能提取和优化聊天记录
    if (optimized.selectedChats && optimized.selectedChats.length > 0) {
      optimized.selectedChats = this.extractKeyChats(optimized.selectedChats)
    }
    
    // 优化知识卡片内容
    if (optimized.selectedKnowledge && optimized.selectedKnowledge.length > 0) {
      optimized.selectedKnowledge = this.optimizeKnowledgeCards(optimized.selectedKnowledge)
    }
    
    // 优化自定义文本
    if (optimized.customText) {
      optimized.customText = this.optimizeCustomText(optimized.customText)
    }
    
    return optimized
  }

  /**
   * 提取关键聊天记录
   * @param {Array} chats 聊天记录
   * @returns {Array} 优化后的聊天记录
   */
  extractKeyChats(chats) {
    // 过滤掉过短的消息
    const filteredChats = chats.filter(chat => chat.content && chat.content.trim().length > 10)
    
    // 如果聊天记录太多，只取最近的和最重要的
    if (filteredChats.length > 10) {
      // 取最近的5条和包含关键词的5条
      const recentChats = filteredChats.slice(-5)
      const keywordChats = filteredChats.filter(chat => 
        this.containsKeywords(chat.content, ['问题', '建议', '方案', '想法', '目标', '计划'])
      ).slice(0, 5)
      
      // 合并并去重
      const combined = [...recentChats, ...keywordChats]
      const unique = combined.filter((chat, index, self) => 
        self.findIndex(c => c.content === chat.content) === index
      )
      
      return unique.slice(0, 10)
    }
    
    return filteredChats
  }

  /**
   * 优化知识卡片
   * @param {Array} knowledgeCards 知识卡片
   * @returns {Array} 优化后的知识卡片
   */
  optimizeKnowledgeCards(knowledgeCards) {
    return knowledgeCards.map(card => ({
      ...card,
      // 截取摘要长度，避免提示词过长
      summary: card.summary ? card.summary.substring(0, 200) : '',
      // 只保留前3个关键洞察
      insights: card.insights ? card.insights.slice(0, 3) : []
    }))
  }

  /**
   * 优化自定义文本
   * @param {string} text 自定义文本
   * @returns {string} 优化后的文本
   */
  optimizeCustomText(text) {
    // 移除多余的空白字符
    let optimized = text.trim().replace(/\s+/g, ' ')
    
    // 如果文本过长，进行智能截取
    if (optimized.length > 500) {
      // 尝试在句号处截取
      const sentences = optimized.split(/[。！？.!?]/)
      let result = ''
      for (const sentence of sentences) {
        if ((result + sentence).length > 450) break
        result += sentence + '。'
      }
      optimized = result || optimized.substring(0, 450) + '...'
    }
    
    return optimized
  }

  /**
   * 检查文本是否包含关键词
   * @param {string} text 文本
   * @param {Array} keywords 关键词列表
   * @returns {boolean} 是否包含关键词
   */
  containsKeywords(text, keywords) {
    return keywords.some(keyword => text.includes(keyword))
  }

  /**
   * 生成创作建议
   * @param {Object} creationData 创作数据
   * @returns {Array} 创作建议列表
   */
  generateCreationSuggestions(creationData) {
    const suggestions = []
    
    // 基于内容类型的建议
    if (creationData.type === 'image') {
      suggestions.push({
        type: 'style',
        title: '风格建议',
        options: ['现代简约', '温馨治愈', '科技感', '艺术抽象', '自然风光']
      })
      suggestions.push({
        type: 'color',
        title: '色调建议',
        options: ['温暖色调', '冷色调', '黑白经典', '彩色缤纷', '莫兰迪色']
      })
    } else if (creationData.type === 'video') {
      suggestions.push({
        type: 'duration',
        title: '时长建议',
        options: ['5-10秒', '10-15秒', '15-30秒', '30-60秒']
      })
      suggestions.push({
        type: 'style',
        title: '风格建议',
        options: ['动画风格', '真实场景', '科技感', '温馨日常', '励志正能量']
      })
    }
    
    // 基于内容的建议
    if (creationData.selectedChats && creationData.selectedChats.length > 0) {
      suggestions.push({
        type: 'content',
        title: '内容增强',
        options: ['突出情感表达', '强调解决方案', '展现成长过程', '体现人际关系']
      })
    }
    
    return suggestions
  }
}

// 创建单例实例
const aiService = new AIService()
export default aiService
