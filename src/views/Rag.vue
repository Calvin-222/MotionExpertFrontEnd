<!-- filepath: /Users/cc/Desktop/MotionExpert_MyVersion/lab-spa/src/views/Rag.vue -->
<template>
  <div class="rag-container">
    <!-- 全局載入遮罩 -->
    <div v-if="globalLoading" class="global-loading">
      <div class="loading-content">
        <div class="loading-spinner"></div>
        <h3>{{ loadingMessage }}</h3>
      </div>
    </div>

    <!-- 通知系統 -->
    <div v-if="notification" :class="['notification', notification.type]">
      <span>{{ notification.message }}</span>
      <button @click="notification = null" class="notification-close">×</button>
    </div>

    <!-- 頂部導航欄 -->
    <header class="rag-header">
      <div class="header-left">
        <h1>🤖 個人 AI 知識庫</h1>
        <span class="subtitle">RAG Engine 管理與 Engine 內全域搜索</span>
      </div>
      <div class="header-right">
        <div class="user-profile">
          <span class="user-name">{{ userInfo.username || '用戶' }}</span>
          <button @click="logout" class="logout-btn">登出</button>
        </div>
      </div>
    </header>

    <!-- 主要內容區域 -->
    <div class="main-content">
      <!-- 左側：Engine 管理面板 -->
      <aside class="document-panel">
        <!-- RAG 狀態卡片 -->
        <div class="status-card">
          <div class="status-header">
            <h3>📊 RAG Engines 狀態</h3>
            <button @click="refreshStatus" class="refresh-btn" :disabled="loading">
              <i :class="loading ? 'icon-spin' : ''">🔄</i>
            </button>
          </div>
          <div class="status-content">
            <div class="stat-item">
              <span class="stat-label">Engines 數量：</span>
              <span class="stat-value">{{ engineCount }} 個</span>
            </div>
            <div class="stat-item">
              <span class="stat-label">活躍 Engines：</span>
              <span class="stat-value">{{ ragStatus.activeEngines || 0 }} 個</span>
            </div>
            <div class="stat-item">
              <span class="stat-label">處理中：</span>
              <span class="stat-value">{{ ragStatus.processingEngines || 0 }} 個</span>
            </div>
            <div class="stat-item">
              <span class="stat-label">搜索模式：</span>
              <span class="stat-value engine-mode">🔧 Engine 全域搜索</span>
            </div>
          </div>
        </div>

        <!-- 文檔上傳區域 -->
        <div class="upload-section">
          <h3>📤 上傳文檔</h3>
          <div
            :class="['upload-area', { dragging: isDragging }]"
            @drop="handleDrop"
            @dragover="handleDragOver"
            @dragleave="handleDragLeave"
            @click="$refs.fileInput.click()"
          >
            <input
              ref="fileInput"
              type="file"
              multiple
              accept=".txt,.pdf,.doc,.docx"
              @change="handleFileSelect"
              style="display: none;"
            >

            <div v-if="!uploading" class="upload-content">
              <div class="upload-icon">📁</div>
              <div class="upload-text">
                <p><strong>點擊上傳</strong> 或 <strong>拖拽文檔到此處</strong></p>
                <p class="upload-hint">支援 TXT, PDF, DOC, DOCX 格式 (最大 50MB)</p>
                <p class="upload-hint">
                  {{ engineCount > 0 ? '將添加到您的個人知識庫' : '將創建您的個人知識庫' }}
                </p>
              </div>
            </div>

            <div v-else class="upload-progress">
              <div class="progress-bar">
                <div class="progress-fill" :style="{ width: uploadProgress + '%' }"></div>
              </div>
              <p class="progress-text">上傳中... {{ uploadProgress }}%</p>
            </div>
          </div>
        </div>

        <!-- 我的 RAG Engines -->
        <div class="documents-section">
          <div class="section-header">
            <h3>🔧 我的個人知識庫</h3>
            <span class="doc-count">({{ engineCount }})</span>
          </div>

          <div v-if="engines.length === 0" class="empty-docs">
            <div class="empty-icon">🔧</div>
            <p>還沒有創建個人知識庫</p>
            <p class="empty-hint">上傳第一個文檔後會自動創建</p>
          </div>

          <div v-else class="documents-list">
            <div v-if="selectedEngine" class="engine-search-hint">
              <div class="hint-icon">🔍</div>
              <p>AI 會在 "{{ selectedEngine.name }}" 的所有文件中搜索答案</p>
            </div>

            <div
              v-for="engine in engines"
              :key="engine.id"
              :class="['document-item', 'engine-item', {
                processing: engine.status === 'processing',
                active: engine.status === 'active',
                selected: selectedEngine?.id === engine.id
              }]"
              @click="selectEngine(engine)"
            >
              <div class="doc-icon engine-icon">🔧</div>
              <div class="doc-info">
                <div class="doc-name">{{ engine.name }}</div>
                <div class="doc-meta">
                  <span class="doc-status">{{ getStatusText(engine.status) }}</span>
                  <span class="file-count">{{ engine.fileCount }} 個文件</span>
                  <span class="doc-date">{{ formatDate(engine.createdAt) }}</span>
                </div>
                <div v-if="engine.description" class="engine-description">
                  {{ engine.description }}
                </div>
              </div>
              <div class="doc-actions">
                <button
                  v-if="engine.status === 'active'"
                  @click.stop="selectEngine(engine)"
                  class="doc-action-btn select"
                  title="選擇此 Engine 進行對話"
                >
                  💬
                </button>
                <button
                  @click.stop="deleteEngine(engine)"
                  :disabled="deleting === engine.id"
                  class="doc-action-btn delete"
                  title="刪除 Engine"
                >
                  {{ deleting === engine.id ? '⏳' : '🗑️' }}
                </button>
              </div>
            </div>
          </div>
        </div>
      </aside>

      <!-- 右側：AI 對話區域 -->
      <main class="chat-panel">
        <!-- 無 Engine 時的提示 -->
        <div v-if="engineCount === 0" class="chat-placeholder">
          <div class="placeholder-content">
            <div class="placeholder-icon">🤖</div>
            <h3>歡迎使用 RAG Engine 系統</h3>
            <p>請先上傳文檔來創建您的第一個 RAG Engine</p>

            <div class="placeholder-steps">
              <div class="step">
                <span class="step-number">1</span>
                <span class="step-text">上傳文檔創建 Engine</span>
              </div>
              <div class="step">
                <span class="step-number">2</span>
                <span class="step-text">等待 Engine 處理完成</span>
              </div>
              <div class="step">
                <span class="step-number">3</span>
                <span class="step-text">選擇 Engine 開始對話</span>
              </div>
            </div>
          </div>
        </div>

        <!-- 未選擇 Engine 時的提示 -->
        <div v-else-if="!selectedEngine" class="chat-placeholder">
          <div class="placeholder-content">
            <div class="placeholder-icon">🔧</div>
            <h3>請選擇一個 RAG Engine</h3>
            <p>選擇左側的 Engine 來開始 Engine 內全域對話</p>

            <div class="engine-list-preview">
              <h4>可用的 Engines：</h4>
              <div v-for="engine in engines.filter(e => e.status === 'active')" :key="engine.id" class="engine-preview">
                <span class="engine-name">🔧 {{ engine.name }}</span>
                <span class="engine-files">({{ engine.fileCount }} 個文件)</span>
              </div>
            </div>
          </div>
        </div>

        <!-- 選中 Engine 的對話界面 -->
        <div v-else-if="selectedEngine.status === 'active'" class="chat-active">
          <!-- 聊天標題 -->
          <div class="chat-header">
            <div class="chat-doc-info">
              <h3>💬 Engine 內全域對話</h3>
              <p>正在與 <strong>{{ selectedEngine.name }}</strong> 對話 ({{ selectedEngine.fileCount }} 個文件)</p>
            </div>
            <div class="chat-actions">
              <button @click="selectedEngine = null" class="chat-action-btn">🔄 切換 Engine</button>
              <button @click="clearChat" class="chat-action-btn">🗑️ 清空對話</button>
            </div>
          </div>

          <!-- 聊天消息區域 -->
          <div ref="chatContainer" class="chat-messages">
            <div v-if="chatMessages.length === 0" class="chat-welcome">
              <div class="welcome-message">
                <h4>🎉 開始 Engine 內對話吧！</h4>
                <p>AI 會在 "{{ selectedEngine.name }}" 的所有 {{ selectedEngine.fileCount }} 個文件中搜索相關信息</p>
                <div class="example-questions">
                  <p><strong>您可以問：</strong></p>
                  <ul>
                    <li>"總結這個 Engine 中所有文檔的重點"</li>
                    <li>"這些文檔中有提到XXX嗎？"</li>
                    <li>"找出關於XXX的所有相關信息"</li>
                    <li>"比較不同文檔中的觀點"</li>
                  </ul>
                </div>
              </div>
            </div>

            <div v-for="(message, index) in chatMessages" :key="index" :class="['message', message.type]">
              <div class="message-avatar">
                {{ message.type === 'user' ? '👤' : '🤖' }}
              </div>
              <div class="message-content">
                <div class="message-text" v-html="formatMessageText(message.text)"></div>
                <div class="message-time">{{ formatTime(message.timestamp) }}</div>
                <!-- 顯示搜索來源文件 -->
                <div v-if="message.sources && message.sources.length > 0" class="message-sources">
                  <div class="sources-header">📁 來源文件：</div>
                  <div class="sources-list">
                    <span v-for="source in message.sources" :key="source" class="source-tag">
                      {{ source }}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <div v-if="isTyping" class="message ai typing">
              <div class="message-avatar">🤖</div>
              <div class="message-content">
                <div class="typing-indicator">
                  <span></span>
                  <span></span>
                  <span></span>
                </div>
                <div class="typing-text">正在 Engine 內搜索 {{ selectedEngine.fileCount }} 個文件...</div>
              </div>
            </div>
          </div>

          <!-- 消息輸入區域 -->
          <div class="chat-input">
            <div class="input-container">
              <textarea
                ref="messageInput"
                v-model="currentMessage"
                @keydown="handleKeyDown"
                placeholder="輸入您的問題，AI 會在此 Engine 的所有文件中搜索答案... (Shift+Enter 換行，Enter 發送)"
                rows="3"
                :disabled="isTyping"
              ></textarea>
              <button
                @click="sendMessage"
                :disabled="!canSendEngineMessage"
                :title="getSendButtonTitle()"
                class="send-btn"
              >
                {{ isTyping ? '⏳' : '🔍' }}
              </button>
            </div>
            <div class="input-hint">
              <span class="engine-hint">
                🔧 Engine 搜索：AI 會在 "{{ selectedEngine.name }}" 的 {{ selectedEngine.fileCount }} 個文件中搜索
              </span>
            </div>
          </div>
        </div>

        <!-- Engine 處理中的狀態 -->
        <div v-else class="chat-processing">
          <div class="processing-content">
            <div class="processing-icon">⏳</div>
            <h3>Engine 處理中</h3>
            <p>Engine "{{ selectedEngine.name }}" 正在處理中，請稍候片刻</p>
            <div class="processing-stats">
              <p>包含 {{ selectedEngine.fileCount }} 個文件</p>
            </div>
          </div>
        </div>
      </main>
    </div>
  </div>
</template>

<script>
import axios from 'axios'

export default {
  name: 'RAGPage',
  data() {
    return {
      // 用戶信息
      userInfo: {
        username: '',
        userid: ''
      },
      token: null,

      // RAG 狀態 - 改為 Engine 概念
      ragStatus: {
        hasRAGEngine: false,
        totalEngines: 0,
        activeEngines: 0,
        processingEngines: 0
      },
      engines: [], // 改為 engines 而不是 documents
      selectedEngine: null, // 選中的 Engine

      // 聊天相關
      chatMessages: [],
      currentMessage: '',
      isTyping: false,

      // 上傳相關
      uploading: false,
      uploadProgress: 0,
      isDragging: false,

      // 載入狀態
      loading: false,
      globalLoading: false,
      loadingMessage: '',
      deleting: null,

      // 通知
      notification: null,

      // API 配置
      baseURL: 'http://localhost:3000/api',

      // 自動刷新定時器
      statusTimer: null,
      refreshInterval: 30000
    }
  },

  computed: {
    engineCount() {
      return this.engines?.length || 0
    },

    // 修改：Engine 級別的全域搜索條件
    canSendEngineMessage() {
      return this.selectedEngine &&
             this.selectedEngine.status === 'active' &&
             this.selectedEngine.fileCount > 0 &&
             this.currentMessage.trim() &&
             !this.isTyping
    }
  },

  async mounted() {
    await this.initialize()
    this.startAutoRefresh()
  },

  beforeUnmount() {
    this.stopAutoRefresh()
  },

  methods: {
    // 初始化系統
    async initialize() {
      try {
        this.globalLoading = true
        this.loadingMessage = '正在初始化 RAG Engine 系統...'

        await this.loadUserInfo()
        await this.checkRAGSystem()

        this.showNotification('RAG Engine 系統已準備就緒！', 'success')
      } catch (error) {
        console.error('初始化失敗:', error)
        this.showNotification('初始化失敗: ' + error.message, 'error')

        if (error.message.includes('登錄') || error.message.includes('認證')) {
          this.$router.push('/login')
        }
      } finally {
        this.globalLoading = false
      }
    },

    // 載入用戶信息
    async loadUserInfo() {
      this.token = localStorage.getItem('authToken')

      if (!this.token) {
        throw new Error('請重新登錄')
      }

      try {
        const response = await axios.get(`${this.baseURL}/auth/me`, {
          headers: { 'Authorization': `Bearer ${this.token}` }
        })

        if (response.data.success) {
          this.userInfo = response.data.user
          console.log('用戶信息載入成功:', this.userInfo)
        } else {
          throw new Error('認證失敗')
        }
      } catch (error) {
        console.error('載入用戶信息失敗:', error)
        if (error.response?.status === 401 || error.response?.status === 403) {
          localStorage.removeItem('authToken')
          throw new Error('登錄已過期，請重新登錄')
        }
        throw error
      }
    },

    // 檢查 RAG 系統狀態
    async checkRAGSystem() {
      try {
        this.loading = true

        await this.testRAGConnection()
        await this.loadUserEngines()

      } catch (error) {
        console.error('RAG 系統檢查失敗:', error)
        this.showNotification('RAG 系統連接失敗，但您仍可以上傳文檔', 'warning')

        this.ragStatus = {
          hasRAGEngine: false,
          totalEngines: 0,
          activeEngines: 0,
          processingEngines: 0
        }
        this.engines = []
      } finally {
        this.loading = false
      }
    },

    // 測試 RAG 基本連接
    async testRAGConnection() {
      try {
        const response = await axios.get(`${this.baseURL}/rag/test`)
        if (response.data.success) {
          console.log('RAG 系統連接成功')
          return true
        }
      // eslint-disable-next-line no-unused-vars
      } catch (error) {
        console.log('RAG 基本測試失敗')
        return false
      }
    },

    // 載入用戶的 RAG Engines - 添加配額處理
    async loadUserEngines() {
      try {
        console.log('正在載入用戶 RAG Engines...')

        const response = await axios.get(`${this.baseURL}/rag/users/${this.userInfo.userid}/engines`, {
          headers: { 'Authorization': `Bearer ${this.token}` }
        })

        console.log('用戶 Engines 響應:', response.data)

        if (response.data.success) {
          // 處理配額超限情況
          if (response.data.quotaExceeded) {
            console.log('API 配額超限，稍後再試')
            this.showNotification('API 配額超限，請稍後再試', 'warning')

            // 設置空狀態但不拋出錯誤
            this.engines = []
            this.ragStatus = {
              hasRAGEngine: false,
              totalEngines: 0,
              activeEngines: 0,
              processingEngines: 0
            }
            return
          }

          this.engines = (response.data.engines || []).map(engine => ({
            id: engine.id,
            name: engine.name || engine.fileName,
            status: engine.status,
            fileCount: engine.fileCount || 0,
            createdAt: engine.createdAt || engine.createTime,
            description: engine.description || `包含 ${engine.fileCount || 0} 個文件`
        }))


          this.ragStatus = {
            hasRAGEngine: this.engines.length > 0,
            totalEngines: this.engines.length,
            activeEngines: this.engines.filter(engine => engine.status === 'active').length,
            processingEngines: this.engines.filter(engine => engine.status === 'processing').length
          }

          console.log('Engines 載入成功:', this.engines.length, '個 Engine，', this.ragStatus.activeEngines, '個活躍')
        } else {
          throw new Error(response.data.message || '載入 Engines 失敗')
        }
      } catch (error) {
        if (error.response?.status === 404) {
          console.log('用戶尚未創建任何 RAG Engine')
          this.engines = []
          this.ragStatus = {
            hasRAGEngine: false,
            totalEngines: 0,
            activeEngines: 0,
            processingEngines: 0
          }
        } else if (error.response?.status === 429) {
          // 處理速率限制錯誤
          console.log('API 請求過於頻繁，稍後再試')
          this.showNotification('請求過於頻繁，請稍後再試', 'warning')

          // 停止自動刷新一段時間
          this.stopAutoRefresh()
          setTimeout(() => {
            this.startAutoRefresh()
          }, 60000) // 1分鐘後重新開始自動刷新

        } else {
          console.error('載入用戶 Engines 失敗:', error)
          // 非關鍵錯誤，不拋出異常
          this.showNotification('載入 Engines 時發生錯誤，請稍後再試', 'warning')
        }
      }
    },

    // 上傳文件 - 修正邏輯
    async uploadFile(file) {
      if (file.size > 50 * 1024 * 1024) {
        this.showNotification(`文件 "${file.name}" 超過 50MB 限制`, 'error')
        return
      }

      const allowedTypes = ['.txt', '.md', '.pdf', '.doc', '.docx']
      const fileExtension = '.' + file.name.split('.').pop().toLowerCase()
      if (!allowedTypes.includes(fileExtension)) {
        this.showNotification(`不支持的文件類型: ${fileExtension}`, 'error')
        return
      }

      try {
        this.uploading = true
        this.uploadProgress = 0

        const formData = new FormData()
        formData.append('file', file)

        console.log(`開始上傳文件: ${file.name}`)

        const response = await axios.post(
          `${this.baseURL}/rag/users/${this.userInfo.userid}/upload`,
          formData,
          {
            headers: {
              'Authorization': `Bearer ${this.token}`,
              'Content-Type': 'multipart/form-data'
            },
            onUploadProgress: (progressEvent) => {
              if (progressEvent.total) {
                this.uploadProgress = Math.round((progressEvent.loaded / progressEvent.total) * 100)
              }
            }
          }
        )

        console.log('上傳響應:', response.data)

        if (response.data.success) {
          // 檢查是否創建了新的 Engine
          if (response.data.engineCreated) {
            this.showNotification(`新的個人知識庫已創建，文檔 "${file.name}" 已成功上傳！`, 'success')
          } else {
            this.showNotification(`文檔 "${file.name}" 已成功添加到您的知識庫！`, 'success')
          }

          // 延遲刷新以讓後端處理完成
          setTimeout(() => {
            this.loadUserEngines()
          }, 2000)

        } else {
          throw new Error(response.data.message || response.data.error || '上傳失敗')
        }
      } catch (error) {
        console.error('上傳失敗:', error)

        let errorMessage = '上傳失敗'
        if (error.response) {
          if (error.response.status === 401 || error.response.status === 403) {
            errorMessage = '認證失敗，請重新登錄'
            localStorage.removeItem('authToken')
            this.$router.push('/login')
          } else if (error.response.data?.message) {
            errorMessage = error.response.data.message
          } else if (error.response.data?.error) {
            errorMessage = error.response.data.error
          }
        } else if (error.request) {
          errorMessage = '網絡連接失敗，請檢查網絡'
        } else {
          errorMessage = error.message
        }

        this.showNotification(`上傳 "${file.name}" 失敗: ${errorMessage}`, 'error')
      } finally {
        this.uploading = false
        this.uploadProgress = 0
      }
    },

    // 修改：Engine 內全域搜索發送消息 - 修正API路徑
    async sendMessage() {
      if (!this.canSendEngineMessage) return

      const message = this.currentMessage.trim()
      this.currentMessage = ''

      this.addMessage('user', message)

      try {
        this.isTyping = true

        console.log(`發送 Engine 內全域查詢: ${message}`)
        console.log(`在 Engine "${this.selectedEngine.name}" 的 ${this.selectedEngine.fileCount} 個文件中搜索`)

        // 修正API路徑：使用正確的後端路由
        const response = await axios.post(
          `${this.baseURL}/rag/users/${this.userInfo.userid}/engines/${this.selectedEngine.id}/query`,
          { question: message },
          { headers: { 'Authorization': `Bearer ${this.token}` } }
        )

        console.log('Engine 內搜索響應:', response.data)

        if (response.data.success) {
          const answer = response.data.answer || '抱歉，在此 Engine 的文檔中沒有找到相關信息。'

          // 如果響應包含來源文件信息
          const sources = response.data.sources || []

          this.addMessage('ai', answer, sources)
        } else {
          throw new Error(response.data.error || response.data.message || '查詢失敗')
        }
      } catch (error) {
        console.error('Engine 內搜索失敗:', error)

        let errorMessage = '搜索失敗'
        if (error.response?.status === 404) {
          errorMessage = '未找到相關信息，請確認 Engine 已處理完成'
        } else if (error.response?.data?.error) {
          errorMessage = error.response.data.error
        } else if (error.response?.data?.message) {
          errorMessage = error.response.data.message
        } else if (error.message) {
          errorMessage = error.message
        }

        this.addMessage('ai', `抱歉，搜索時出現錯誤：${errorMessage}`)
      } finally {
        this.isTyping = false
      }
    },

    // 選擇 Engine
    selectEngine(engine) {
      if (engine.status !== 'active') {
        this.showNotification('Engine 還在處理中，請稍後再試', 'warning')
        return
      }

      if (engine.fileCount === 0) {
        this.showNotification('此 Engine 沒有文件，無法進行對話', 'warning')
        return
      }

      this.selectedEngine = engine
      this.chatMessages = []
      this.showNotification(`已選擇 Engine: ${engine.name} (${engine.fileCount} 個文件)`, 'info')

      this.$nextTick(() => {
        if (this.$refs.messageInput) {
          this.$refs.messageInput.focus()
        }
      })
    },

    // 刪除 Engine - 修正API路徑
    async deleteEngine(engine) {
      const confirmed = confirm(`確定要刪除 RAG Engine "${engine.name}" 嗎？\n\n此操作會刪除 Engine 內的所有 ${engine.fileCount} 個文件，無法撤銷。`)
      if (!confirmed) return

      try {
        this.deleting = engine.id

        console.log(`刪除 RAG Engine: ${engine.name}`)

        // 修正API路徑：使用正確的後端路由
        const response = await axios.delete(
          `${this.baseURL}/rag/users/${this.userInfo.userid}/engines/${engine.id}`,
          {
            headers: { 'Authorization': `Bearer ${this.token}` }
          }
        )

        console.log('刪除響應:', response.data)

        if (response.data.success) {
          this.showNotification(`Engine "${engine.name}" 已刪除`, 'success')

          // 如果刪除的是當前選中的 Engine
          if (this.selectedEngine?.id === engine.id) {
            this.selectedEngine = null
            this.chatMessages = []
          }

          await this.loadUserEngines()
        } else {
          throw new Error(response.data.message || '刪除失敗')
        }
      } catch (error) {
        console.error('刪除失敗:', error)

        let errorMessage = '刪除失敗'
        if (error.response?.data?.message) {
          errorMessage = error.response.data.message
        } else if (error.response?.data?.error) {
          errorMessage = error.response.data.error
        } else {
          errorMessage = error.message
        }

        this.showNotification(errorMessage, 'error')
      } finally {
        this.deleting = null
      }
    },

    // 刷新狀態
    async refreshStatus() {
      this.loading = true
      try {
        await this.loadUserEngines()
        this.showNotification('RAG Engines 狀態已刷新', 'success')
      } catch (error) {
        console.error('刷新失敗:', error)
        if (error.response?.status === 429) {
          this.showNotification('刷新過於頻繁，請稍後再試', 'warning')
        } else {
          this.showNotification('刷新失敗，請稍後再試', 'error')
        }
      } finally {
        this.loading = false
      }
    },

    // 文件處理方法
    async handleFileSelect(event) {
      const files = Array.from(event.target.files)
      if (files.length === 0) return

      for (const file of files) {
        await this.uploadFile(file)
        await new Promise(resolve => setTimeout(resolve, 1000))
      }

      event.target.value = ''
    },

    handleDrop(event) {
      event.preventDefault()
      this.isDragging = false

      const files = Array.from(event.dataTransfer.files)
      files.forEach(async (file, index) => {
        setTimeout(() => {
          this.uploadFile(file)
        }, index * 2000)
      })
    },

    handleDragOver(event) {
      event.preventDefault()
      this.isDragging = true
    },

    handleDragLeave(event) {
      event.preventDefault()
      this.isDragging = false
    },

    // 聊天功能
    handleKeyDown(event) {
      if (event.key === 'Enter' && !event.shiftKey) {
        event.preventDefault()
        this.sendMessage()
      }
    },

    // 支持來源信息的消息添加
    addMessage(type, text, sources = []) {
      this.chatMessages.push({
        type,
        text,
        sources,
        timestamp: new Date()
      })

      this.$nextTick(() => {
        this.scrollToBottom()
      })
    },

    clearChat() {
      if (confirm('確定要清空所有對話記錄嗎？')) {
        this.chatMessages = []
        this.showNotification('對話記錄已清空', 'info')
      }
    },

    scrollToBottom() {
      const container = this.$refs.chatContainer
      if (container) {
        container.scrollTop = container.scrollHeight
      }
    },

    // 工具方法
    startAutoRefresh() {
      // 清除現有的定時器
      this.stopAutoRefresh()

      this.statusTimer = setInterval(async () => {
        try {
          await this.loadUserEngines()
        } catch (error) {
          console.error('自動刷新失敗:', error)
          // 如果連續失敗，停止自動刷新
          this.stopAutoRefresh()
        }
      }, this.refreshInterval)
    },

    stopAutoRefresh() {
      if (this.statusTimer) {
        clearInterval(this.statusTimer)
        this.statusTimer = null
      }
    },

    logout() {
      if (confirm('確定要登出嗎？')) {
        localStorage.clear()
        this.$router.push('/login')
      }
    },

    showNotification(message, type = 'info') {
      this.notification = { message, type }
      setTimeout(() => {
        this.notification = null
      }, 5000)
    },

    // 格式化方法
    formatDate(dateString) {
      if (!dateString) return '無日期'
      return new Date(dateString).toLocaleString('zh-TW', {
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      })
    },

    formatTime(date) {
      return date.toLocaleTimeString('zh-TW', {
        hour: '2-digit',
        minute: '2-digit'
      })
    },

    formatMessageText(text) {
      return text
        .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
        .replace(/\*(.*?)\*/g, '<em>$1</em>')
        .replace(/`(.*?)`/g, '<code>$1</code>')
        .replace(/\n/g, '<br>')
    },

    getStatusText(status) {
      const statusMap = {
        'active': '✅ 活躍',
        'processing': '⏳ 處理中',
        'empty': '📝 空白',
        'error': '❌ 錯誤'
      }
      return statusMap[status] || status
    },

    getSendButtonTitle() {
      if (!this.selectedEngine) return '請先選擇一個 RAG Engine'
      if (this.selectedEngine.status !== 'active') return 'Engine 處理中'
      if (this.selectedEngine.fileCount === 0) return 'Engine 沒有文件'
      if (!this.currentMessage.trim()) return '請輸入搜索問題'
      if (this.isTyping) return 'AI 正在 Engine 內搜索中...'
      return `在 Engine 的 ${this.selectedEngine.fileCount} 個文件中搜索`
    }
  }
}
</script>

<style scoped>
@import '@/assets/styles/rag.css'

</style>



