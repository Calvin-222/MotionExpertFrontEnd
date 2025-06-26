const API_BASE_URL = 'http://localhost:3000/api'

const authService = {
  // 統一 token 存儲鍵名
  TOKEN_KEY: 'authToken',

  // 修復登錄方法
  async login(username, password) {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
      })

      const data = await response.json()

      if (data.success) {
        // 清理舊數據並保存新數據
        this.cleanupStorage()
        localStorage.setItem(this.TOKEN_KEY, data.token)
        localStorage.setItem('user', JSON.stringify(data.user))
        console.log('登錄成功，token 已保存:', this.TOKEN_KEY)
        return { success: true, user: data.user, token: data.token }
      } else {
        return { success: false, message: data.message }
      }
    } catch (error) {
      console.error('Login error:', error)
      return { success: false, message: '登錄失敗，請檢查網絡連接' }
    }
  },

  // 修復認證檢查方法
  isAuthenticated() {
    const token = localStorage.getItem(this.TOKEN_KEY)
    return !!token
  },

  // 修復獲取用戶方法
  getUser() {
    const userStr = localStorage.getItem('user')
    return userStr ? JSON.parse(userStr) : null
  },

  // 修復獲取 token 方法
  getToken() {
    return localStorage.getItem(this.TOKEN_KEY)
  },

  // 添加數據清理方法
  cleanupStorage() {
    // 清除重複的認證相關鍵
    const keysToRemove = ['token', 'currentUser', 'currentUserId', 'userId']
    keysToRemove.forEach((key) => {
      if (localStorage.getItem(key)) {
        localStorage.removeItem(key)
        console.log(`已清除重複鍵: ${key}`)
      }
    })
  },

  // 修復登出方法
  logout() {
    // 清除所有認證相關數據
    localStorage.removeItem(this.TOKEN_KEY)
    localStorage.removeItem('user')
    this.cleanupStorage()
    console.log('已登出，清除所有認證信息')
  },

  // 註冊方法
  async register(username, password, confirmPassword) {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password, confirmPassword }),
      })

      const data = await response.json()

      if (data.success) {
        this.cleanupStorage()
        localStorage.setItem(this.TOKEN_KEY, data.token)
        localStorage.setItem('user', JSON.stringify(data.user))
        return { success: true, user: data.user, token: data.token }
      } else {
        return { success: false, message: data.message }
      }
    } catch (error) {
      console.error('Register error:', error)
      return { success: false, message: '註冊失敗，請檢查網絡連接' }
    }
  },

  async getCurrentUser() {
    const token = this.getToken()
    if (!token) return null

    try {
      const response = await fetch(`${API_BASE_URL}/auth/me`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      const data = await response.json()

      if (data.success) {
        localStorage.setItem('user', JSON.stringify(data.user))
        return data.user
      } else {
        this.logout()
        return null
      }
    } catch (error) {
      console.error('Get current user error:', error)
      this.logout()
      return null
    }
  },
}

export { authService }
