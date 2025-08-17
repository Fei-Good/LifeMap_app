/**
 * AI大模型服务类
 * 用于调用大模型接口生成个性化报告
 */
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
      // 构建提示词
      const prompt = this.buildPrompt(questionnaireAnswers, userInfo)
      
      // 调用大模型接口
      const response = await this.callAIAPI(prompt)
      
      // 解析并格式化返回结果
      return this.parseAIResponse(response)
      
    } catch (error) {
      console.error('生成个性化报告失败:', error)
      // 返回兜底的默认报告
      return this.getDefaultReport(questionnaireAnswers)
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
}

// 创建单例实例
const aiService = new AIService()
export default aiService
