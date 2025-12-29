<!-- filepath: /Users/cc/Desktop/MotionExpert_MyVersion/lab-spa/src/views/DebugAuth.vue -->
<template>
  <div class="debug-container">
    <h1>🔧 認證調試工具</h1>

    <div class="debug-section">
      <h2>LocalStorage 內容</h2>
      <pre>{{ localStorageContent }}</pre>
    </div>

    <div class="debug-section">
      <h2>認證狀態</h2>
      <ul>
        <li>isAuthenticated(): {{ isAuthenticated }}</li>
        <li>getToken(): {{ currentToken || '無' }}</li>
        <li>getUser(): {{ currentUser || '無' }}</li>
      </ul>
    </div>

    <div class="debug-section">
      <h2>測試操作</h2>
      <button @click="testAuth" class="debug-btn">測試認證 API</button>
      <button @click="clearStorage" class="debug-btn danger">清除存儲</button>
      <button @click="goLogin" class="debug-btn">返回登錄</button>
    </div>

    <div v-if="testResult" class="debug-section">
      <h2>測試結果</h2>
      <pre>{{ testResult }}</pre>
    </div>
  </div>
</template>

<script>
import { authService } from '@/services/authService'
import axios from 'axios'

export default {
  name: 'DebugAuth',
  data() {
    return {
      testResult: null
    }
  },

  computed: {
    localStorageContent() {
      const storage = {}
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i)
        storage[key] = localStorage.getItem(key)
      }
      return JSON.stringify(storage, null, 2)
    },

    isAuthenticated() {
      return authService.isAuthenticated()
    },

    currentToken() {
      return authService.getToken()
    },

    currentUser() {
      return JSON.stringify(authService.getUser(), null, 2)
    }
  },

  methods: {
    async testAuth() {
      try {
        const token = authService.getToken()
        const response = await axios.get('/api/auth/me', {
          headers: { 'Authorization': `Bearer ${token}` }
        })
        this.testResult = JSON.stringify(response.data, null, 2)
      } catch (error) {
        this.testResult = `錯誤: ${error.message}\n${JSON.stringify(error.response?.data, null, 2)}`
      }
    },

    clearStorage() {
      if (confirm('確定要清除所有存儲嗎？')) {
        localStorage.clear()
        this.$forceUpdate()
      }
    },

    goLogin() {
      this.$router.push('/login')
    }
  }
}
</script>

<style scoped>
.debug-container {
  max-width: 800px;
  margin: 20px auto;
  padding: 20px;
  background: #f8f9fa;
  border-radius: 8px;
}

.debug-section {
  background: white;
  margin: 20px 0;
  padding: 20px;
  border-radius: 6px;
  border: 1px solid #dee2e6;
}

.debug-section h2 {
  margin-top: 0;
  color: #495057;
}

.debug-section pre {
  background: #f8f9fa;
  padding: 15px;
  border-radius: 4px;
  overflow-x: auto;
  border: 1px solid #dee2e6;
}

.debug-section ul {
  list-style: none;
  padding: 0;
}

.debug-section li {
  padding: 8px 0;
  border-bottom: 1px solid #eee;
}

.debug-btn {
  margin: 0 10px 10px 0;
  padding: 10px 20px;
  border: 1px solid #007bff;
  background: #007bff;
  color: white;
  border-radius: 4px;
  cursor: pointer;
}

.debug-btn:hover {
  background: #0056b3;
}

.debug-btn.danger {
  background: #dc3545;
  border-color: #dc3545;
}

.debug-btn.danger:hover {
  background: #c82333;
}
</style>
