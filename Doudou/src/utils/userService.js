/**
 * 用户服务 - 处理用户认证和用户信息管理
 */

class UserService {
  constructor() {
    this.currentUser = null
    this.storageKey = 'lifemap_user'
  }

  /**
   * 用户登录
   * @param {string} username 用户名
   * @param {string} password 密码
   * @returns {Promise} 登录结果
   */
  async login(username, password) {
    return new Promise((resolve, reject) => {
      // 模拟网络请求
      setTimeout(() => {
        // 简单验证逻辑（实际项目中应该调用后端API）
        if (username && password) {
          const userData = {
            id: Date.now(),
            username: username,
            loginTime: new Date().toISOString(),
            isNewUser: !this.hasUserData(username) // 判断是否为新用户
          }
          
          this.currentUser = userData
          this.saveToStorage(userData)
          
          resolve({
            success: true,
            user: userData
          })
        } else {
          reject(new Error('用户名或密码不能为空'))
        }
      }, 1000)
    })
  }

  /**
   * 用户注册
   * @param {object} registrationData 注册数据 {username, email, password}
   * @returns {Promise} 注册结果
   */
  async register(registrationData) {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const { username, email, password } = registrationData
        
        if (!username || !email || !password) {
          reject(new Error('用户名、邮箱和密码不能为空'))
          return
        }
        
        // 检查用户名是否已存在
        if (this.hasUserData(username)) {
          reject(new Error('用户名已存在，请换一个用户名'))
          return
        }
        
        // 验证邮箱格式
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
        if (!emailRegex.test(email)) {
          reject(new Error('请输入有效的邮箱地址'))
          return
        }
        
        // 验证密码长度
        if (password.length < 6) {
          reject(new Error('密码长度至少6位'))
          return
        }
        
        const userData = {
          id: Date.now(),
          username: username,
          email: email,
          registerTime: new Date().toISOString(),
          isNewUser: true,
          avatar: '', // 默认头像为空
          profile: {
            personalityType: '',
            completedAssessment: false
          }
        }
        
        this.currentUser = userData
        this.saveToStorage(userData)
        
        resolve({
          success: true,
          user: userData,
          message: '注册成功'
        })
      }, 1500) // 稍微增加延时，模拟真实的网络请求
    })
  }

  /**
   * 获取当前用户
   * @returns {object|null} 当前用户信息
   */
  getCurrentUser() {
    if (!this.currentUser) {
      this.currentUser = this.getFromStorage()
    }
    return this.currentUser
  }

  /**
   * 判断是否为新用户
   * @param {object} user 用户对象
   * @returns {boolean} 是否为新用户
   */
  isNewUser(user) {
    if (!user) return true
    return user.isNewUser === true
  }

  /**
   * 用户登出
   */
  logout() {
    this.currentUser = null
    uni.removeStorageSync(this.storageKey)
  }

  /**
   * 更新用户信息
   * @param {object} updates 更新的信息
   */
  updateUserInfo(updates) {
    if (this.currentUser) {
      this.currentUser = { ...this.currentUser, ...updates }
      this.saveToStorage(this.currentUser)
    }
  }

  /**
   * 标记用户完成信息收集（不再是新用户）
   */
  markUserInfoCompleted() {
    if (this.currentUser) {
      this.currentUser.isNewUser = false
      this.currentUser.infoCompletedTime = new Date().toISOString()
      this.saveToStorage(this.currentUser)
    }
  }

  /**
   * 检查用户是否存在（模拟）
   * @param {string} username 用户名
   * @returns {boolean} 用户是否存在
   */
  hasUserData(username) {
    // 简单的模拟逻辑，实际应该查询后端
    const existingUsers = ['admin', 'test', 'demo']
    return existingUsers.includes(username.toLowerCase())
  }

  /**
   * 保存到本地存储
   * @param {object} userData 用户数据
   */
  saveToStorage(userData) {
    try {
      uni.setStorageSync(this.storageKey, JSON.stringify(userData))
    } catch (error) {
      console.error('保存用户信息失败:', error)
    }
  }

  /**
   * 从本地存储获取
   * @returns {object|null} 用户数据
   */
  getFromStorage() {
    try {
      const userData = uni.getStorageSync(this.storageKey)
      return userData ? JSON.parse(userData) : null
    } catch (error) {
      console.error('获取用户信息失败:', error)
      return null
    }
  }

  /**
   * 检查用户是否已登录
   * @returns {boolean} 是否已登录
   */
  isLoggedIn() {
    const user = this.getCurrentUser()
    return user !== null
  }
}

// 创建单例实例
const userService = new UserService()

export default userService
