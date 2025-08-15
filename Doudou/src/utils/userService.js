class UserService {
  constructor() {
    this.users = this.loadUsersFromStorage()
    this.currentUser = null
    this.restoreLoginStatus()
  }

  loadUsersFromStorage() {
    try {
      const users = uni.getStorageSync('users') || []
      return users
    } catch (e) {
      console.error('加载用户数据失败:', e)
      return []
    }
  }

  saveUsersToStorage() {
    try {
      uni.setStorageSync('users', this.users)
    } catch (e) {
      console.error('保存用户数据失败:', e)
    }
  }

  isUsernameExists(username) {
    return this.users.some(user => user.username === username)
  }

  isPhoneExists(phone) {
    return this.users.some(user => user.phone === phone)
  }

  async register(userData) {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        try {
          if (!userData.username || !userData.password) {
            reject(new Error('请填写完整的注册信息'))
            return
          }

          if (this.isUsernameExists(userData.username)) {
            reject(new Error('用户名已存在，请选择其他用户名'))
            return
          }

          if (userData.phone && this.isPhoneExists(userData.phone)) {
            reject(new Error('手机号码已被注册，请使用其他手机号码'))
            return
          }

          const newUser = {
            id: Date.now().toString(),
            username: userData.username,
            phone: userData.phone,
            password: userData.password,
            createdAt: new Date().toISOString(),
            lastLoginAt: null
          }

          this.users.push(newUser)
          this.saveUsersToStorage()

          const { password, ...userInfo } = newUser
          resolve({
            success: true,
            message: '注册成功',
            user: userInfo
          })
        } catch (error) {
          reject(error)
        }
      }, 1000)
    })
  }

  async login(username, password) {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        try {
          const user = this.users.find(u => 
            (u.username === username || u.phone === username) && u.password === password
          )

          if (!user) {
            reject(new Error('用户名或密码错误'))
            return
          }

          user.lastLoginAt = new Date().toISOString()
          this.saveUsersToStorage()

          this.currentUser = user
          uni.setStorageSync('currentUserId', user.id)

          const { password: _, ...userInfo } = user
          resolve({
            success: true,
            message: '登录成功',
            user: userInfo
          })
        } catch (error) {
          reject(error)
        }
      }, 800)
    })
  }

  logout() {
    this.currentUser = null
    uni.removeStorageSync('currentUserId')
    return {
      success: true,
      message: '登出成功'
    }
  }

  getCurrentUser() {
    return this.currentUser
  }

  restoreLoginStatus() {
    try {
      const currentUserId = uni.getStorageSync('currentUserId')
      if (currentUserId) {
        const user = this.users.find(u => u.id === currentUserId)
        if (user) {
          this.currentUser = user
        } else {
          uni.removeStorageSync('currentUserId')
        }
      }
    } catch (e) {
      console.error('恢复登录状态失败:', e)
      uni.removeStorageSync('currentUserId')
    }
  }

  isLoggedIn() {
    return !!this.currentUser
  }

  async updateUserProfile(userId, updates) {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        try {
          const userIndex = this.users.findIndex(u => u.id === userId)
          if (userIndex === -1) {
            reject(new Error('用户不存在'))
            return
          }

          this.users[userIndex] = { ...this.users[userIndex], ...updates }
          this.saveUsersToStorage()

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
}

const userService = new UserService()
export default userService
