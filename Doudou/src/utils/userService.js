<<<<<<< HEAD
class UserService {
  constructor() {
=======
// 用户服务 - 模拟后端API
class UserService {
  constructor() {
    // 模拟本地存储的用户数据
>>>>>>> ef06d39 (feat: 完善注册功能，优化样式，添加手机号码字段，修复登录跳转问题)
    this.users = this.loadUsersFromStorage()
    this.currentUser = null
    this.restoreLoginStatus()
  }

<<<<<<< HEAD
=======
  // 从本地存储加载用户数据
>>>>>>> ef06d39 (feat: 完善注册功能，优化样式，添加手机号码字段，修复登录跳转问题)
  loadUsersFromStorage() {
    try {
      const users = uni.getStorageSync('users') || []
      return users
    } catch (e) {
      console.error('加载用户数据失败:', e)
      return []
    }
  }

<<<<<<< HEAD
=======
  // 保存用户数据到本地存储
>>>>>>> ef06d39 (feat: 完善注册功能，优化样式，添加手机号码字段，修复登录跳转问题)
  saveUsersToStorage() {
    try {
      uni.setStorageSync('users', this.users)
    } catch (e) {
      console.error('保存用户数据失败:', e)
    }
  }

<<<<<<< HEAD
=======
  // 检查用户名是否已存在
>>>>>>> ef06d39 (feat: 完善注册功能，优化样式，添加手机号码字段，修复登录跳转问题)
  isUsernameExists(username) {
    return this.users.some(user => user.username === username)
  }

<<<<<<< HEAD
=======
  // 检查手机号码是否已存在
>>>>>>> ef06d39 (feat: 完善注册功能，优化样式，添加手机号码字段，修复登录跳转问题)
  isPhoneExists(phone) {
    return this.users.some(user => user.phone === phone)
  }

<<<<<<< HEAD
  async register(userData) {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        try {
=======
  // 用户注册
  async register(userData) {
    return new Promise((resolve, reject) => {
      // 模拟网络延迟
      setTimeout(() => {
        try {
          // 验证数据
>>>>>>> ef06d39 (feat: 完善注册功能，优化样式，添加手机号码字段，修复登录跳转问题)
          if (!userData.username || !userData.password) {
            reject(new Error('请填写完整的注册信息'))
            return
          }

<<<<<<< HEAD
=======
          // 检查用户名是否已存在
>>>>>>> ef06d39 (feat: 完善注册功能，优化样式，添加手机号码字段，修复登录跳转问题)
          if (this.isUsernameExists(userData.username)) {
            reject(new Error('用户名已存在，请选择其他用户名'))
            return
          }

<<<<<<< HEAD
          if (userData.phone && this.isPhoneExists(userData.phone)) {
            reject(new Error('手机号码已被注册，请使用其他手机号码'))
            return
          }

=======
                  // 检查手机号码是否已存在（如果提供了的话）
        if (userData.phone && this.isPhoneExists(userData.phone)) {
          reject(new Error('手机号码已被注册，请使用其他手机号码'))
          return
        }

          // 创建新用户
>>>>>>> ef06d39 (feat: 完善注册功能，优化样式，添加手机号码字段，修复登录跳转问题)
          const newUser = {
            id: Date.now().toString(),
            username: userData.username,
            phone: userData.phone,
<<<<<<< HEAD
            password: userData.password,
=======
            password: userData.password, // 实际项目中应该加密
>>>>>>> ef06d39 (feat: 完善注册功能，优化样式，添加手机号码字段，修复登录跳转问题)
            createdAt: new Date().toISOString(),
            lastLoginAt: null
          }

<<<<<<< HEAD
          this.users.push(newUser)
          this.saveUsersToStorage()

=======
          // 添加到用户列表
          this.users.push(newUser)
          this.saveUsersToStorage()

          // 返回成功结果（不包含密码）
>>>>>>> ef06d39 (feat: 完善注册功能，优化样式，添加手机号码字段，修复登录跳转问题)
          const { password, ...userInfo } = newUser
          resolve({
            success: true,
            message: '注册成功',
            user: userInfo
          })
        } catch (error) {
          reject(error)
        }
<<<<<<< HEAD
      }, 1000)
    })
  }

=======
      }, 1000) // 模拟1秒延迟
    })
  }

  // 用户登录
>>>>>>> ef06d39 (feat: 完善注册功能，优化样式，添加手机号码字段，修复登录跳转问题)
  async login(username, password) {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        try {
<<<<<<< HEAD
=======
          // 查找用户
>>>>>>> ef06d39 (feat: 完善注册功能，优化样式，添加手机号码字段，修复登录跳转问题)
          const user = this.users.find(u => 
            (u.username === username || u.phone === username) && u.password === password
          )

          if (!user) {
            reject(new Error('用户名或密码错误'))
            return
          }

<<<<<<< HEAD
          user.lastLoginAt = new Date().toISOString()
          this.saveUsersToStorage()

          this.currentUser = user
          uni.setStorageSync('currentUserId', user.id)

=======
          // 更新最后登录时间
          user.lastLoginAt = new Date().toISOString()
          this.saveUsersToStorage()

          // 设置当前用户
          this.currentUser = user
          
          // 将当前用户ID保存到本地存储
          uni.setStorageSync('currentUserId', user.id)

          // 返回用户信息（不包含密码）
>>>>>>> ef06d39 (feat: 完善注册功能，优化样式，添加手机号码字段，修复登录跳转问题)
          const { password: _, ...userInfo } = user
          resolve({
            success: true,
            message: '登录成功',
            user: userInfo
          })
        } catch (error) {
          reject(error)
        }
<<<<<<< HEAD
      }, 800)
    })
  }

  logout() {
    this.currentUser = null
=======
      }, 800) // 模拟800ms延迟
    })
  }

  // 用户登出
  logout() {
    this.currentUser = null
    // 清除本地存储的登录状态
>>>>>>> ef06d39 (feat: 完善注册功能，优化样式，添加手机号码字段，修复登录跳转问题)
    uni.removeStorageSync('currentUserId')
    return {
      success: true,
      message: '登出成功'
    }
  }

<<<<<<< HEAD
=======
  // 获取当前用户信息
>>>>>>> ef06d39 (feat: 完善注册功能，优化样式，添加手机号码字段，修复登录跳转问题)
  getCurrentUser() {
    return this.currentUser
  }

<<<<<<< HEAD
=======
  // 恢复登录状态
>>>>>>> ef06d39 (feat: 完善注册功能，优化样式，添加手机号码字段，修复登录跳转问题)
  restoreLoginStatus() {
    try {
      const currentUserId = uni.getStorageSync('currentUserId')
      if (currentUserId) {
        const user = this.users.find(u => u.id === currentUserId)
        if (user) {
          this.currentUser = user
        } else {
<<<<<<< HEAD
=======
          // 如果用户不存在，清除存储的ID
>>>>>>> ef06d39 (feat: 完善注册功能，优化样式，添加手机号码字段，修复登录跳转问题)
          uni.removeStorageSync('currentUserId')
        }
      }
    } catch (e) {
      console.error('恢复登录状态失败:', e)
      uni.removeStorageSync('currentUserId')
    }
  }

<<<<<<< HEAD
=======
  // 检查是否已登录
>>>>>>> ef06d39 (feat: 完善注册功能，优化样式，添加手机号码字段，修复登录跳转问题)
  isLoggedIn() {
    return !!this.currentUser
  }

<<<<<<< HEAD
=======
  // 更新用户信息
>>>>>>> ef06d39 (feat: 完善注册功能，优化样式，添加手机号码字段，修复登录跳转问题)
  async updateUserProfile(userId, updates) {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        try {
          const userIndex = this.users.findIndex(u => u.id === userId)
          if (userIndex === -1) {
            reject(new Error('用户不存在'))
            return
          }

<<<<<<< HEAD
          this.users[userIndex] = { ...this.users[userIndex], ...updates }
          this.saveUsersToStorage()

=======
          // 更新用户信息
          this.users[userIndex] = { ...this.users[userIndex], ...updates }
          this.saveUsersToStorage()

          // 如果更新的是当前用户，同步更新
>>>>>>> ef06d39 (feat: 完善注册功能，优化样式，添加手机号码字段，修复登录跳转问题)
          if (this.currentUser && this.currentUser.id === userId) {
            this.currentUser = { ...this.currentUser, ...updates }
          }

          const { password, ...userInfo } = this.users[userIndex]
          resolve({
            success: true,
            message: '更新成功',
            user: userInfo
          })
        } catch (error) {
          reject(error)
        }
      }, 500)
    })
  }
<<<<<<< HEAD
}

const userService = new UserService()
=======

  // 重置密码（模拟）
  async resetPassword(email) {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        try {
          const user = this.users.find(u => u.email === email)
          if (!user) {
            reject(new Error('邮箱不存在'))
            return
          }

          // 模拟发送重置密码邮件
          resolve({
            success: true,
            message: '重置密码邮件已发送，请查收邮箱'
          })
        } catch (error) {
          reject(error)
        }
      }, 1000)
    })
  }

  // 获取用户统计信息
  getUserStats() {
    return {
      totalUsers: this.users.length,
      activeUsers: this.users.filter(u => u.lastLoginAt).length,
      newUsersToday: this.users.filter(u => {
        const today = new Date().toDateString()
        const userDate = new Date(u.createdAt).toDateString()
        return today === userDate
      }).length
    }
  }
}

// 创建单例实例
const userService = new UserService()

>>>>>>> ef06d39 (feat: 完善注册功能，优化样式，添加手机号码字段，修复登录跳转问题)
export default userService
