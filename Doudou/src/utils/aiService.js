/**
 * AI大模型服务类
 * 用于调用大模型接口生成个性化报告
 */
// 导入API服务
import apiService from './apiService'

class AIService {
  constructor() {
    // 配置豆包AI服务
    this.apiConfig = {
      baseUrl: 'https://ark.cn-beijing.volces.com/api/v3', // 豆包API地址
      apiKey: 'a4063a05-841a-4a52-8916-70ffc92d7f06', // API密钥
      model: 'doubao-seed-1-6-250615' // 豆包模型名称
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
   * @returns {Promise<string>} AI响应内容
   */
  async callAIAPI(prompt) {
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
          max_tokens: 1500,
          temperature: 0.7
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
}

// 创建单例实例
const aiService = new AIService()
export default aiService
