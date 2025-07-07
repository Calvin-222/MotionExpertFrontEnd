const authService = {
  // 統一 token 存儲鍵名
  TOKEN_KEY: 'token',

  // 修復登錄方法
  async login(username, password) {
    try {
      const response = await fetch(`/api/auth/login`, {
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
        return { success: true, user: data.user, token: data.token }
      } else {
        console.log('❌ Login failed:', data.message)
        return { success: false, message: data.message }
      }
    } catch (error) {
      console.error('💥 Login error:', error)
      return { success: false, message: '登錄失敗，請檢查網絡連接' }
    }
  },

  // 修復認證檢查方法
 async isAuthenticated() {
  // Step 1: Check if token exists in localStorage
  const token = localStorage.getItem(this.TOKEN_KEY)
  console.log('🔍 Checking authentication - Token exists:', !!token)

  if (!token) {
    console.log('❌ No token found')
    return false // No token = definitely not authenticated
  }

  // Step 2: Client-side expiration check (optional but fast)
  try {
    const payload = JSON.parse(atob(token.split('.')[1])) //split token to get header(userid and expdate)
    const now = Math.floor(Date.now() / 1000)

    if (payload.exp && now > payload.exp) {
      console.log('❌ Token expired (client-side check)')
      this.logout()
      return false
    }
  // eslint-disable-next-line no-unused-vars
  } catch (error) {
    console.log('❌ Token malformed')
    this.logout()
    return false
  }

  // Step 3: Server-side verification (authoritative)
  try {
    console.log('🔑 Verifying token with server...')
    const response = await fetch('/api/auth/verify', {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    })

    if (response.ok) {
      console.log('✅ Token is valid')
      return true
    } else {
      console.log('❌ Token is invalid/expired')
      this.logout()
      return false
    }
  } catch (error) {
    console.error('❌ Error verifying token:', error)
    this.logout()
    return false
  }
},

  // 修復獲取 token 方法
  getToken() {
    const token = localStorage.getItem(this.TOKEN_KEY)
    console.log('🔑 Getting token:', token)
    return token
  },

  // 修復獲取用戶方法
  getUser() {
    const userStr = localStorage.getItem('user')
    const user = userStr ? JSON.parse(userStr) : null
    console.log('👤 Getting user:', user)
    return user
  },

  // 添加數據清理方法
  cleanupStorage() {
    const keysToRemove = ['token', 'user']
    keysToRemove.forEach((key) => {
      if (localStorage.getItem(key)) {
        localStorage.removeItem(key)
        console.log(`🧹 已清除重複鍵: ${key}`)
      }
    })
  },

  // 修復登出方法
  logout() {
    const currentToken = localStorage.getItem('token')
    console.log('🔑 Token being removed:', currentToken)

    // 清除所有認證相關數據
    localStorage.removeItem(this.TOKEN_KEY)
    localStorage.removeItem('user')
    this.cleanupStorage()
    console.log('✅ 已登出，清除所有認證信息')
  },

  // 註冊方法
  async register(username, password, confirmPassword) {
    try {
      const response = await fetch(`/api/auth/register`, {
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
        console.log('❌ Registration failed:', data.message)
        return { success: false, message: data.message }
      }
    } catch (error) {
      console.error('💥 Register error:', error)
      return { success: false, message: '註冊失敗，請檢查網絡連接' }
    }
  },

  async getCurrentUser() {
    const token = this.getToken()
    if (!token) {
      console.log('❌ No token found, cannot get current user')
      return null
    }

    console.log('🔄 Fetching current user with token:', token)

    try {
      const response = await fetch(`/api/auth/me`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      const data = await response.json()

      if (data.success) {
        localStorage.setItem('user', JSON.stringify(data.user))
        console.log('✅ Current user fetched successfully:', data.user)
        return data.user
      } else {
        console.log('❌ Failed to get current user, logging out')
        this.logout()
        return null
      }
    } catch (error) {
      console.error('💥 Get current user error:', error)
      this.logout()
      return null
    }
  },
}

export { authService }
