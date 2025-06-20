const API_BASE_URL = 'http://localhost:3000/api'

export const authService = {
  async login(username, password) {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ username, password })
      })

      const data = await response.json()
      return data
    } catch (error) {
      console.error('Login service error:', error)
      throw error
    }
  },

  // NEW: Register method
  async register(username, password, confirmPassword) {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ username, password, confirmPassword })
      })

      const data = await response.json()
      return data
    } catch (error) {
      console.error('Registration service error:', error)
      throw error
    }
  },

  async getCurrentUser() {
    try {
      const token = localStorage.getItem('token')
      if (!token) {
        return null
      }

      const response = await fetch(`${API_BASE_URL}/auth/me`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })

      const data = await response.json()
      return data.success ? data.user : null
    } catch (error) {
      console.error('Get current user error:', error)
      return null
    }
  },

  logout() {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
  },

  isAuthenticated() {
    const token = localStorage.getItem('token')
    return !!token
  },

  getToken() {
    return localStorage.getItem('token')
  },

  getUser() {
    const user = localStorage.getItem('user')
    return user ? JSON.parse(user) : null
  }
}
