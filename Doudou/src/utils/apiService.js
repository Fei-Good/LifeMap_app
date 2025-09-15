/**
 * API服务类 - 统一管理所有API接口
 * 基于API接口需求文档 v1.3
 * 基础URL: https://byuvzkydmpop.sealosbja.site/api
 */

class ApiService {
  constructor() {
    // API配置
    this.baseURL = 'https://byuvzkydmpop.sealosbja.site/api'
    this.timeout = 10000
    
    // Token相关
    this.tokenKey = 'lifemap_token'
    this.token = null
    
    // 初始化token
    this.initToken()
  }

  /**
   * 初始化token
   */
  initToken() {
    try {
      this.token = uni.getStorageSync(this.tokenKey)
    } catch (error) {
      console.error('获取token失败:', error)
      this.token = null
    }
  }

  /**
   * 设置token
   * @param {string} token JWT token
   */
  setToken(token) {
    this.token = token
    try {
      uni.setStorageSync(this.tokenKey, token)
    } catch (error) {
      console.error('保存token失败:', error)
    }
  }

  /**
   * 清除token
   */
  clearToken() {
    this.token = null
    try {
      uni.removeStorageSync(this.tokenKey)
    } catch (error) {
      console.error('清除token失败:', error)
    }
  }

  /**
   * 获取请求头
   * @param {boolean} needAuth 是否需要认证
   * @returns {object} 请求头对象
   */
  getHeaders(needAuth = false) {
    const headers = {
      'Content-Type': 'application/json'
    }
    
    if (needAuth && this.token) {
      headers['Authorization'] = `Bearer ${this.token}`
    }
    
    return headers
  }

  /**
   * 统一请求方法
   * @param {object} options 请求选项
   * @returns {Promise} 请求结果
   */
  request(options) {
    const { url, method = 'GET', data, needAuth = false, timeout = this.timeout } = options
    
    return new Promise((resolve, reject) => {
      uni.request({
        url: `${this.baseURL}${url}`,
        method: method.toUpperCase(),
        data: data,
        header: this.getHeaders(needAuth),
        timeout: timeout,
        success: (res) => {
          console.log(`API请求成功 ${method} ${url}:`, res.data)
          
          // 处理HTTP状态码
          if (res.statusCode >= 200 && res.statusCode < 300) {
            // 处理业务状态码
            if (res.data && res.data.code !== undefined) {
              if (res.data.code === 200) {
                resolve(res.data)
              } else {
                // 处理业务错误 - 保留完整错误信息
                console.error(`API业务错误 ${method} ${url}:`, res.data)
                
                // 创建包含完整错误信息的错误对象
                const error = new Error(res.data.message || '请求失败')
                error.code = res.data.code
                error.errors = res.data.errors || null
                error.data = res.data.data || null
                
                reject(error)
              }
            } else {
              // 没有业务状态码，直接返回数据
              resolve(res.data)
            }
          } else {
            // HTTP状态码错误
            const errorMessage = `HTTP ${res.statusCode}: ${res.data?.message || 'HTTP请求失败'}`
            console.error(`API HTTP错误 ${method} ${url}:`, errorMessage)
            
            const error = new Error(errorMessage)
            error.statusCode = res.statusCode
            error.data = res.data
            
            reject(error)
          }
        },
        fail: (error) => {
          console.error(`API请求失败 ${method} ${url}:`, error)
          let errorMessage = '网络请求失败'
          
          if (error.errMsg) {
            if (error.errMsg.includes('timeout')) {
              errorMessage = '请求超时，请检查网络'
            } else if (error.errMsg.includes('fail')) {
              errorMessage = '网络连接失败'
            } else {
              errorMessage = error.errMsg
            }
          }
          
          reject(new Error(errorMessage))
        }
      })
    })
  }

  // ==================== 用户认证模块 ====================

  /**
   * 用户登录
   * @param {string} username 用户名
   * @param {string} password 密码
   * @returns {Promise} 登录结果
   */
  async login(username, password) {
    const response = await this.request({
      url: '/auth/login',
      method: 'POST',
      data: { username, password }
    })
    
    // 保存token
    if (response.data && response.data.token) {
      this.setToken(response.data.token)
    }
    
    return response
  }

  /**
   * 用户注册
   * @param {object} registrationData 注册数据 {username, email, password}
   * @returns {Promise} 注册结果
   */
  async register(registrationData) {
    return await this.request({
      url: '/auth/register',
      method: 'POST',
      data: registrationData
    })
  }

  /**
   * 检查用户名是否存在
   * @param {string} username 用户名
   * @returns {Promise} 检查结果
   */
  async checkUsername(username) {
    return await this.request({
      url: `/auth/check-username?username=${encodeURIComponent(username)}`,
      method: 'GET'
    })
  }

  /**
   * 验证Token
   * @returns {Promise} 验证结果
   */
  async verifyToken() {
    return await this.request({
      url: '/auth/verify',
      method: 'GET',
      needAuth: true
    })
  }

  /**
   * 刷新Token
   * @returns {Promise} 刷新结果
   */
  async refreshToken() {
    const response = await this.request({
      url: '/auth/refresh',
      method: 'POST',
      needAuth: true
    })
    
    // 保存新token
    if (response.data && response.data.token) {
      this.setToken(response.data.token)
    }
    
    return response
  }

  /**
   * 用户登出
   * @returns {Promise} 登出结果
   */
  async logout() {
    try {
      const response = await this.request({
        url: '/auth/logout',
        method: 'POST',
        needAuth: true
      })
      
      // 清除token
      this.clearToken()
      
      return response
    } catch (error) {
      // 即使API失败也要清除本地token
      this.clearToken()
      throw error
    }
  }

  // ==================== 用户信息管理 ====================

  /**
   * 获取用户资料
   * @returns {Promise} 用户资料
   */
  async getUserProfile() {
    return await this.request({
      url: '/user/profile',
      method: 'GET',
      needAuth: true
    })
  }

  /**
   * 更新用户资料
   * @param {object} profileData 资料数据
   * @returns {Promise} 更新结果
   */
  async updateUserProfile(profileData) {
    return await this.request({
      url: '/user/profile',
      method: 'PUT',
      data: profileData,
      needAuth: true
    })
  }

  /**
   * 完成信息收集
   * @returns {Promise} 完成结果
   */
  async completeUserInfo() {
    return await this.request({
      url: '/user/complete-info',
      method: 'POST',
      needAuth: true
    })
  }

  /**
   * 获取用户等级
   * @returns {Promise} 等级信息
   */
  async getUserLevel() {
    return await this.request({
      url: '/user/level',
      method: 'GET',
      needAuth: true
    })
  }

  /**
   * 获取用户统计
   * @returns {Promise} 统计数据
   */
  async getUserStats() {
    return await this.request({
      url: '/user/stats',
      method: 'GET',
      needAuth: true
    })
  }

  /**
   * 获取排行榜
   * @returns {Promise} 排行榜数据
   */
  async getLeaderboard() {
    return await this.request({
      url: '/user/leaderboard',
      method: 'GET'
    })
  }

  /**
   * 搜索用户
   * @param {string} keyword 搜索关键词
   * @param {number} limit 结果数量限制
   * @returns {Promise} 搜索结果
   */
  async searchUsers(keyword, limit = 10) {
    const params = new URLSearchParams({ q: keyword, limit })
    return await this.request({
      url: `/user/search?${params.toString()}`,
      method: 'GET'
    })
  }

  // ==================== 问卷系统 ====================

  /**
   * 获取问卷题目
   * @returns {Promise} 题目列表
   */
  async getQuestionnaireQuestions() {
    return await this.request({
      url: '/questionnaire/questions',
      method: 'GET'
    })
  }

  /**
   * 按类型获取题目
   * @param {string} type 题目类型 (objective/subjective)
   * @returns {Promise} 题目列表
   */
  async getQuestionsByType(type) {
    return await this.request({
      url: `/questionnaire/questions/${type}`,
      method: 'GET'
    })
  }

  /**
   * 提交问卷答案
   * @param {Array} answers 答案数组
   * @returns {Promise} 提交结果
   */
  async submitQuestionnaire(answers) {
    return await this.request({
      url: '/questionnaire/submit',
      method: 'POST',
      data: { answers },
      needAuth: true
    })
  }

  /**
   * 获取用户答案
   * @returns {Promise} 用户答案历史
   */
  async getQuestionnaireAnswers() {
    return await this.request({
      url: '/questionnaire/answers',
      method: 'GET',
      needAuth: true
    })
  }

  /**
   * 获取个性化报告
   * @returns {Promise} 个性化报告
   */
  async getPersonalityReport() {
    return await this.request({
      url: '/questionnaire/report',
      method: 'GET',
      needAuth: true
    })
  }

  /**
   * 重新生成报告
   * @returns {Promise} 新报告
   */
  async regenerateReport() {
    return await this.request({
      url: '/questionnaire/regenerate-report',
      method: 'POST',
      needAuth: true
    })
  }

  // ==================== AI服务 ====================

  /**
   * AI聊天对话
   * @param {string} message 用户消息
   * @param {Array} context 对话上下文
   * @returns {Promise} AI回复
   */
  async chatWithAI(message, context = []) {
    return await this.request({
      url: '/ai/chat',
      method: 'POST',
      data: { message, context },
      needAuth: true
    })
  }

  /**
   * 生成个性化建议
   * @param {object} userInfo 用户信息
   * @returns {Promise} 建议内容
   */
  async generateAdvice(userInfo) {
    return await this.request({
      url: '/ai/advice',
      method: 'POST',
      data: userInfo,
      needAuth: true
    })
  }

  /**
   * AI创作内容生成
   * @param {object} creationData 创作数据
   * @returns {Promise} 创作结果
   */
  async generateCreativeContent(creationData) {
    return await this.request({
      url: '/ai/create',
      method: 'POST',
      data: creationData,
      needAuth: true
    })
  }

  /**
   * 获取AI创作历史
   * @param {object} params 查询参数
   * @returns {Promise} 创作历史列表
   */
  async getCreationHistory(params = {}) {
    return await this.request({
      url: '/ai/creations',
      method: 'GET',
      data: params,
      needAuth: true
    })
  }

  /**
   * 获取创作详情
   * @param {string} creationId 创作ID
   * @returns {Promise} 创作详情
   */
  async getCreationDetail(creationId) {
    return await this.request({
      url: `/ai/creations/${creationId}`,
      method: 'GET',
      needAuth: true
    })
  }

  /**
   * 删除创作记录
   * @param {string} creationId 创作ID
   * @returns {Promise} 删除结果
   */
  async deleteCreation(creationId) {
    return await this.request({
      url: `/ai/creations/${creationId}`,
      method: 'DELETE',
      needAuth: true
    })
  }

  // ==================== 任务系统 ====================

  /**
   * 获取任务列表
   * @param {object} params 分页参数
   * @returns {Promise} 任务列表
   */
  async getTasks(params = {}) {
    const { page = 1, limit = 20 } = params
    const queryParams = new URLSearchParams({ page, limit })
    return await this.request({
      url: `/tasks?${queryParams.toString()}`,
      method: 'GET',
      needAuth: true
    })
  }

  /**
   * 获取任务详情
   * @param {number} taskId 任务ID
   * @returns {Promise} 任务详情
   */
  async getTaskDetail(taskId) {
    return await this.request({
      url: `/tasks/${taskId}`,
      method: 'GET',
      needAuth: true
    })
  }

  /**
   * 完成任务
   * @param {number} taskId 任务ID
   * @param {object} result 任务结果
   * @returns {Promise} 完成结果
   */
  async completeTask(taskId, result = {}) {
    return await this.request({
      url: `/tasks/${taskId}/complete`,
      method: 'POST',
      data: result,
      needAuth: true
    })
  }

  // ==================== 聊天记录 ====================

  /**
   * 获取聊天记录
   * @param {object} params 查询参数
   * @returns {Promise} 聊天记录
   */
  async getChatHistory(params = {}) {
    const { page = 1, limit = 20 } = params
    const queryParams = new URLSearchParams({ page, limit })
    return await this.request({
      url: `/chat/history?${queryParams.toString()}`,
      method: 'GET',
      needAuth: true
    })
  }

  /**
   * 保存聊天记录
   * @param {object} message 消息对象
   * @returns {Promise} 保存结果
   */
  async saveChatMessage(message) {
    return await this.request({
      url: '/chat/message',
      method: 'POST',
      data: message,
      needAuth: true
    })
  }

  // ==================== 技能系统 ====================

  /**
   * 获取技能列表
   * @returns {Promise} 技能列表
   */
  async getSkills() {
    return await this.request({
      url: '/skills',
      method: 'GET',
      needAuth: true
    })
  }

  /**
   * 解锁技能
   * @param {number} skillId 技能ID
   * @returns {Promise} 解锁结果
   */
  async unlockSkill(skillId) {
    return await this.request({
      url: `/skills/${skillId}/unlock`,
      method: 'POST',
      needAuth: true
    })
  }

  // ==================== 成就系统 ====================

  /**
   * 获取成就列表
   * @returns {Promise} 成就列表
   */
  async getAchievements() {
    return await this.request({
      url: '/achievements',
      method: 'GET',
      needAuth: true
    })
  }

  /**
   * 获取徽章列表
   * @returns {Promise} 徽章列表
   */
  async getBadges() {
    return await this.request({
      url: '/badges',
      method: 'GET',
      needAuth: true
    })
  }

  // ==================== 系统配置 ====================

  /**
   * 获取系统配置
   * @returns {Promise} 系统配置
   */
  async getSystemConfig() {
    return await this.request({
      url: '/system/config',
      method: 'GET'
    })
  }

  /**
   * 获取应用版本信息
   * @returns {Promise} 版本信息
   */
  async getVersionInfo() {
    return await this.request({
      url: '/system/version',
      method: 'GET'
    })
  }
}

// 创建单例实例
const apiService = new ApiService()

export default apiService
