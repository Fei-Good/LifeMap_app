/**
 * 用户服务 - 处理用户认证和用户信息管理
 * 基于真实API接口
 */

import apiService from './apiService.js'

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
    try {
      // 调用API登录
      const response = await apiService.login(username, password)
      
      if (response.data && response.data.user) {
        const userData = response.data.user
        
        // 保存用户信息到本地
        this.currentUser = userData
        this.saveToStorage(userData)
        
        return {
          success: true,
          user: userData,
          message: response.message || '登录成功'
        }
      } else {
        throw new Error('登录响应数据格式错误')
      }
    } catch (error) {
      console.error('用户登录失败:', error)
      // 直接抛出原始错误，保留完整的错误信息（包括code和errors等字段）
      throw error
    }
  }

  /**
   * 用户注册
   * @param {object} registrationData 注册数据 {username, email, password}
   * @returns {Promise} 注册结果
   */
  async register(registrationData) {
    try {
      // 调用API注册
      const response = await apiService.register(registrationData)
      
      if (response.data && response.data.user) {
        const userData = response.data.user
        
        // 保存用户信息到本地（注册后不自动登录，所以不设置currentUser）
        // this.currentUser = userData
        // this.saveToStorage(userData)
        
        return {
          success: true,
          user: userData,
          message: response.message || '注册成功'
        }
      } else {
        throw new Error('注册响应数据格式错误')
      }
    } catch (error) {
      console.error('用户注册失败:', error)
      throw new Error(error.message || '注册失败')
    }
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
    // 用户标记为新用户，且未完成信息收集
    return user.isNewUser === true && !user.infoCollected
  }

  /**
   * 用户登出
   */
  async logout() {
    try {
      // 调用API登出
      await apiService.logout()
    } catch (error) {
      console.warn('API登出失败:', error.message)
      // 即使API失败也要清除本地数据
    } finally {
      // 清除本地用户数据
      this.currentUser = null
      uni.removeStorageSync(this.storageKey)
    }
  }

  /**
   * 更新用户信息
   * @param {object} updates 更新的信息
   * @returns {Promise} 更新结果
   */
  async updateUserInfo(updates) {
    try {
      // 调用API更新用户资料
      const response = await apiService.updateUserProfile(updates)
      
      if (response.data && this.currentUser) {
        // 更新本地用户信息
        this.currentUser = { ...this.currentUser, ...response.data }
        this.saveToStorage(this.currentUser)
      }
      
      return {
        success: true,
        message: response.message || '用户信息更新成功'
      }
    } catch (error) {
      console.error('更新用户信息失败:', error)
      // 如果API调用失败，仍然更新本地信息（离线支持）
      if (this.currentUser) {
        this.currentUser = { ...this.currentUser, ...updates }
        this.saveToStorage(this.currentUser)
      }
      throw new Error(error.message || '更新用户信息失败')
    }
  }

  /**
   * 标记用户完成信息收集（不再是新用户）
   * @returns {Promise} 完成结果
   */
  async markUserInfoCompleted() {
    try {
      // 调用API标记信息收集完成
      await apiService.completeUserInfo()
      
      // 更新本地用户信息
      if (this.currentUser) {
        this.currentUser.isNewUser = false
        this.currentUser.infoCollected = true
        this.currentUser.infoCompletedTime = new Date().toISOString()
        this.saveToStorage(this.currentUser)
      }
      
      return {
        success: true,
        message: '信息收集已完成'
      }
    } catch (error) {
      console.error('标记信息收集完成失败:', error)
      // 如果API调用失败，仍然更新本地信息
      if (this.currentUser) {
        this.currentUser.isNewUser = false
        this.currentUser.infoCollected = true
        this.currentUser.infoCompletedTime = new Date().toISOString()
        this.saveToStorage(this.currentUser)
      }
      throw new Error(error.message || '标记信息收集完成失败')
    }
  }

  /**
   * 检查用户名是否存在
   * @param {string} username 用户名
   * @returns {Promise<boolean>} 用户名是否存在
   */
  async checkUsername(username) {
    try {
      const response = await apiService.checkUsername(username)
      return response.data?.exists || false
    } catch (error) {
      console.error('检查用户名失败:', error)
      // 如果API调用失败，返回false（乐观策略）
      return false
    }
  }

  /**
   * 验证当前Token是否有效
   * @returns {Promise<boolean>} Token是否有效
   */
  async verifyToken() {
    try {
      const response = await apiService.verifyToken()
      return response.code === 200
    } catch (error) {
      console.error('Token验证失败:', error)
      // Token无效，清除本地数据
      this.currentUser = null
      uni.removeStorageSync(this.storageKey)
      return false
    }
  }

  /**
   * 刷新Token
   * @returns {Promise} 刷新结果
   */
  async refreshToken() {
    try {
      await apiService.refreshToken()
      return {
        success: true,
        message: 'Token刷新成功'
      }
    } catch (error) {
      console.error('Token刷新失败:', error)
      // Token刷新失败，清除本地数据
      this.currentUser = null
      uni.removeStorageSync(this.storageKey)
      throw new Error(error.message || 'Token刷新失败')
    }
  }

  /**
   * 获取用户等级信息
   * @returns {Promise} 等级信息
   */
  async getUserLevel() {
    try {
      const response = await apiService.getUserLevel()
      return response.data
    } catch (error) {
      console.error('获取用户等级失败:', error)
      throw new Error(error.message || '获取用户等级失败')
    }
  }

  /**
   * 获取用户统计信息
   * @returns {Promise} 统计信息
   */
  async getUserStats() {
    try {
      const response = await apiService.getUserStats()
      return response.data
    } catch (error) {
      console.error('获取用户统计失败:', error)
      throw new Error(error.message || '获取用户统计失败')
    }
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
