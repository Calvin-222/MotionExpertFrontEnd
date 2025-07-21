<template>
  <div class="rag-container">
    <h1>RAG 系統測試界面</h1>

    <!-- 連接狀態檢查 -->
    <div class="section">
      <h2>系統狀態檢查</h2>
      <button @click="checkBackendStatus">檢查後端連接</button>
      <div class="response" :class="statusResponseClass" v-html="statusResponse"></div>
    </div>

    <!-- 登錄後顯示的部分 -->

      <!-- 用戶信息 -->
      <div class="section">
        <h2>用戶信息</h2>
        <div>當前用戶 ID: {{ currentUserId }}</div>
        <button @click="logout">登出</button>
      </div>

      <!-- RAG Engine 管理 -->
      <div class="section">
        <h2>2. RAG Engine 管理</h2>

        <!-- 創建 RAG Engine -->
        <div>
          <h3>創建新 RAG Engine</h3>
          <form @submit.prevent="createEngine">
            <div>
              <label for="engineName">引擎名稱:</label>
              <input type="text" id="engineName" v-model="engineForm.name" required>
            </div>
            <div>
              <label for="engineDescription">描述 (選填):</label>
              <input type="text" id="engineDescription" v-model="engineForm.description">
            </div>
            <button type="submit">創建 RAG Engine</button>
          </form>
          <div class="response" :class="createEngineResponseClass" v-html="createEngineResponse"></div>
        </div>

        <!-- 列出用戶的 RAG Engines -->
       <div>
          <h3>我的 RAG Engines</h3>
          <button @click="listEngines">刷新列表</button>
          <div class="response" :class="listEnginesResponseClass" v-html="listEnginesResponse"></div>
          <table v-if="userEngines.length > 0">
            <thead>
              <tr>

                <th>ID</th>
                <th>名稱</th>
                <th>更改瀏覽權限</th>
                <th>建立日期</th>
                <th>操作</th>
                <th>分享</th>
                <th>coming from</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="engine in userEngines" :key="engine.id">
                <td>{{ engine.id }}</td>
                <td>{{ engine.name }}</td>
                <td v-if ="engine.isOwner">
                  <select
                    v-model="engineVisibilities[engine.id]"
                    :disabled=" !engine.isOwner"
                  >
                    <option value="Private">Private</option>
                    <option value="Public">Public</option>
                    <option value="Friend">Friends only</option>
                  </select>
                  <button
                    @click="updateVisibility(engine.id, engineVisibilities[engine.id])"
                    style="margin-left: 5px;"
                  >
                    儲存
                  </button>
                  <span v-if="updatingVisibility[engine.id]" style="margin-left: 5px;">更新中...</span>
                </td>
                        <td v-else> Cannot Change</td>
                <td>{{ formatDate(engine.createdAt) }}</td>
                <td>
                  <button v-if="engine.isOwner" @click="deleteEngine(engine.id)">刪除</button>
                </td>
                <td>
                  <input v-if="engine.isOwner"
                    type="text"
                    v-model="shareTargets[engine.id]"
                    placeholder="對方 userId"
                    style="width: 120px;"
                  >
                  <button v-if="engine.isOwner"
                    @click="shareEngine(engine.id)"
                    :disabled="sharingStates[engine.id]"
                  >
                    {{ sharingStates[engine.id] ? '分享中...' : '分享' }}
                  </button>
                </td>
                <td>
                  <span v-if="engine.isOwner" class="owner-badge">{{ engine.comingFrom }}</span>
                  <span v-else class="shared-badge">{{ engine.comingFrom }}</span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <!-- 文件管理 -->
      <div class="section">
        <h2>3. 文件管理</h2>

        <!-- 上傳文件 -->
        <div>
          <h3>上傳文件到 RAG Engine</h3>
          <form @submit.prevent="uploadFile">
            <div>
              <label for="engineForUpload">選擇 RAG Engine:</label>
              <select id="engineForUpload" v-model="selectedEngineForUpload" required>
                <option v-for="engine in userEngines.filter(e => e.isOwner)" :key="engine.id" :value="engine.id">
                  {{ engine.name }}
                </option>
              </select>
            </div>
            <div>
              <label for="fileToUpload">選擇文件 (支援多個文件):</label>
              <input type="file" id="fileToUpload" ref="fileInput" multiple>
            </div>
            <button type="submit">上傳文件</button>
          </form>
          <div class="response" :class="uploadFileResponseClass" v-html="uploadFileResponse"></div>
        </div>

        <!-- 列出引擎的文件 -->
        <div>
          <h3>查看 RAG Engine 中的文件</h3>
          <div>
            <label for="engineForDocuments">選擇 RAG Engine:</label>
            <select id="engineForDocuments" v-model="selectedEngineForDocuments">
              <option v-for="engine in userEngines.filter(e => e.isOwner)" :key="engine.id" :value="engine.id">
                {{ engine.name }}
              </option>
            </select>
            <button @click="listDocuments">獲取文檔列表</button>
          </div>
          <div class="response" :class="listDocumentsResponseClass" v-html="listDocumentsResponse"></div>
          <table v-if="documents.length > 0">
            <thead>
              <tr>
                <th>文件ID</th>
                <th>原始文件名</th>
                <th>操作</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="doc in documents" :key="doc.fileId || doc.id">
                <td>{{ doc.fileId || doc.id || 'N/A' }}</td>
                <td>{{ doc.originalFileName || doc.displayName || doc.filename || doc.name || 'Unknown' }}</td>
                <td>
                  <button @click="deleteDocument(doc.fileId || doc.id)">刪除</button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <!-- 查詢功能 -->
      <div class="section">
        <h2>4. RAG 查詢</h2>
        <form @submit.prevent="queryEngine">
          <div>
            <label for="engineForQuery">選擇 RAG Engine:</label>
            <select id="engineForQuery" v-model="selectedEngineForQuery">
              <option v-for="engine in userEngines" :key="engine.id" :value="engine.id">
                {{ engine.name }}
              </option>
            </select>
          </div>
          <div>
            <label for="question">提問:</label>
            <textarea id="question" v-model="queryForm.question" rows="4" required></textarea>
          </div>
          <button type="submit">發送查詢</button>
        </form>
        <div class="response" :class="queryResponseClass" v-html="queryResponse"></div>
      </div>
    </div>

</template>

<script>
import '@/assets/ragtest.css'
import {authService} from '@/services/authService'
export default {
  name: 'RagTestInterface',
  data() {
    return {
      // Auth state
      authToken: localStorage.getItem('token'),
      engineVisibilities: {},
      // Forms
      engineForm: {
        name: '',
        description: ''
      },
      queryForm: {
        question: ''
      },

      // Data
      userEngines: [],
      documents: [],

      // Selected values
      selectedEngineForUpload: '',
      selectedEngineForDocuments: '',
      selectedEngineForQuery: '',

      // Share functionality
      shareTargets: {},
      sharingStates: {},

      updatingVisibility: {},

      // Response messages and classes
      statusResponse: '',
      statusResponseClass: '',
      loginResponse: '',
      loginResponseClass: '',
      registerResponse: '',
      registerResponseClass: '',
      createEngineResponse: '',
      createEngineResponseClass: '',
      listEnginesResponse: '',
      listEnginesResponseClass: '',
      uploadFileResponse: '',
      uploadFileResponseClass: '',
      listDocumentsResponse: '',
      listDocumentsResponseClass: '',
      queryResponse: '',
      queryResponseClass: ''
    }
  },
  computed: {
    username() {
    const user = authService.getUser()
    return user?.username || 'Loading...'
  },
    currentUserId(){
      const user = authService.getUser()
      return user?.userid || 'Loading...'
    }
  },
  mounted() {
    this.checkBackendStatus();
    this.listEngines();

  },
  methods: {

    async updateVisibility(engineId, newVisibility) {
      this.updatingVisibility, engineId, true;

      try {
        const response = await fetch(`/api/rag/users/engines/${engineId}/visibility`, {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + this.authToken
          },
          body: JSON.stringify({ visibility: newVisibility })
        });

        const result = await response.json();

        if (result.success) {
          const engine = this.userEngines.find(e => e.id === engineId);
          if (engine) {
            engine.visibility = newVisibility;
          }
        }
      } catch (error) {
        console.error('Error updating visibility:', error);
      } finally {
        this.updatingVisibility, engineId, false;
      }
    },
    // 檢查後端狀態
    async checkBackendStatus() {
      try {
        this.statusResponse = '檢查中...';
        this.statusResponseClass = '';

        const response = await fetch('/', {
          method: 'GET',
        });

        if (response.ok) {
          this.statusResponse = '✅ 後端連接正常 (狀態碼: ' + response.status + ')';
          this.statusResponseClass = 'success';
        } else {
          this.statusResponse = '❌ 後端狀態異常 (狀態碼: ' + response.status + ')';
          this.statusResponseClass = 'error';
        }
      } catch (error) {
        this.statusResponse = '❌ 無法連接後端: ' + error.message;
        this.statusResponseClass = 'error';
      }
    },


    // 登出功能
    logout() {
      authService.logout()
      this.$router.push('/login')
    },

    // 創建 RAG Engine
    async createEngine() {
      try {
        const response = await fetch('/api/rag/users/engines', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + this.authToken,
          },
          body: JSON.stringify({
            engineName: this.engineForm.name,
            description: this.engineForm.description
          }),
        });

        const data = await response.json();
        this.createEngineResponse = JSON.stringify(data, null, 2);

        if (data.success) {
          this.createEngineResponseClass = 'success';
          this.engineForm.name = '';
          this.engineForm.description = '';
          this.listEngines();
        } else {
          this.createEngineResponseClass = 'error';
        }
      } catch (error) {
        this.createEngineResponse = 'Error: ' + error.message;
        this.createEngineResponseClass = 'error';
      }
    },

    // 列出用戶的 RAG Engines
async listEngines() {
  try {
    const response = await fetch('/api/rag/users/' + this.currentUserId + '/engines', {
      method: 'GET',
      headers: {
        'Authorization': 'Bearer ' + this.authToken,
      },
    });

    const data = await response.json();
    this.listEnginesResponse = JSON.stringify(data, null, 2);

    if (data.success) {
      this.userEngines = data.engines;
      this.listEnginesResponseClass = 'success';

      // Initialize share targets, states, and visibility values
      this.userEngines.forEach(engine => {
        this.shareTargets[engine.id] = '';
        this.sharingStates[engine.id] = false;
        this.engineVisibilities[engine.id] = engine.visibility;
        console.log(engine.visibility);
        this.updatingVisibility[engine.id] = false;
      });
    } else {
      this.listEnginesResponseClass = 'error';
    }
  } catch (error) {
    this.listEnginesResponse = 'Error: ' + error.message;
    this.listEnginesResponseClass = 'error';
  }
},

    // 刪除 RAG Engine
    async deleteEngine(engineId) {
      if (!confirm('確定要刪除 ID 為 ' + engineId + ' 的 RAG Engine 嗎？')) {
        return;
      }

      try {
        const response = await fetch('/api/rag/users/' + this.currentUserId + '/engines/' + engineId, {
          method: 'DELETE',
          headers: {
            'Authorization': 'Bearer ' + this.authToken,
          },
        });

        const data = await response.json();

        if (data.success) {
          alert('RAG Engine 已成功刪除');
          this.listEngines();
        } else {
          alert('刪除失敗: ' + data.error);
        }
      } catch (error) {
        alert('Error: ' + error.message);
      }
    },

    // 分享 Engine
    async shareEngine(engineId) {
      const targetUserId = this.shareTargets[engineId]?.trim();
      if (!targetUserId) {
        alert('請輸入對方 userId');
        return;
      }

      this.sharingStates, engineId, true;

      try {
        const response = await fetch('/api/rag/users/engines/' + engineId + '/share', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + this.authToken,
          },
          body: JSON.stringify({ targetUserId: targetUserId }),
        });

        const data = await response.json();

        if (data.success) {
          alert('分享成功！');
        } else {
          alert('分享失敗: ' + data.error);
        }
      } catch (error) {
        alert('分享錯誤: ' + error.message);
      }

      this.sharingStates, engineId, false;
    },

    // 上傳文件函數
    async uploadFile() {
      if (!this.selectedEngineForUpload) {
        alert('請選擇一個 RAG Engine');
        return;
      }

      const files = this.$refs.fileInput.files;
      if (files.length === 0) {
        alert('請選擇至少一個文件');
        return;
      }

      const totalFiles = files.length;
      let successCount = 0;
      let failCount = 0;

      for (let i = 0; i < files.length; i++) {
        const file = files[i];

        try {
          this.uploadFileResponse = '上傳文件 ' + (i + 1) + '/' + totalFiles + ': ' + file.name + '，請稍候...';

          const formData = new FormData();
          formData.append('file', file);
          formData.append('ragId', this.selectedEngineForUpload);

          const response = await fetch('/api/rag/users/' + this.currentUserId + '/upload', {
            method: 'POST',
            headers: {
              'Authorization': 'Bearer ' + this.authToken,
            },
            body: formData,
          });

          const data = await response.json();

          if (data.success) {
            successCount++;
            this.uploadFileResponse += '\n✅ ' + file.name + ' 上傳成功';
            this.uploadFileResponseClass = 'success';
          } else {
            failCount++;
            this.uploadFileResponse += '\n❌ ' + file.name + ' 上傳失敗: ' + data.error;
            this.uploadFileResponseClass = 'error';
          }
        } catch (error) {
          failCount++;
          this.uploadFileResponse += '\n❌ ' + file.name + ' 上傳錯誤: ' + error.message;
          this.uploadFileResponseClass = 'error';
        }
      }

      this.$refs.fileInput.value = '';
      this.uploadFileResponse += '\n\n📊 上傳完成！總共處理 ' + totalFiles + ' 個文件（成功：' + successCount + '，失敗：' + failCount + '）';
    },

    // 列出文件
    async listDocuments() {
      if (!this.selectedEngineForDocuments) {
        alert('請選擇一個 RAG Engine');
        return;
      }

      try {
        const response = await fetch('/api/rag/users/' + this.currentUserId + '/engines/' + this.selectedEngineForDocuments + '/documents', {
          method: 'GET',
          headers: {
            'Authorization': 'Bearer ' + this.authToken,
          },
        });

        const data = await response.json();
        this.listDocumentsResponse = JSON.stringify(data, null, 2);

        if (data.success) {
          let documentsList = [];

          if (Array.isArray(data.documents)) {
            documentsList = data.documents;
          } else if (data.documents && typeof data.documents === 'object') {
            documentsList = Object.entries(data.documents).map(entry => ({
              id: entry[0],
              fileId: entry[0],
              originalFileName: entry[1],
              displayName: entry[1],
              filename: entry[1]
            }));
          } else {
            documentsList = [];
          }

          this.documents = documentsList;
          this.listDocumentsResponseClass = 'success';
        } else {
          this.listDocumentsResponseClass = 'error';
        }
      } catch (error) {
        this.listDocumentsResponse = 'Error: ' + error.message;
        this.listDocumentsResponseClass = 'error';
      }
    },

    // 刪除文件
    async deleteDocument(fileId) {
      if (!confirm('確定要刪除 ID 為 ' + fileId + ' 的文件嗎？')) {
        return;
      }

      try {
        const response = await fetch('/api/rag/users/documents/' + fileId + '?ragId=' + this.selectedEngineForDocuments, {
          method: 'DELETE',
          headers: {
            'Authorization': 'Bearer ' + this.authToken,
          },
        });

        const data = await response.json();

        if (data.success) {
          alert('文件已成功刪除');
          this.listDocuments();
        } else {
          alert('刪除失敗: ' + data.error);
        }
      } catch (error) {
        alert('Error: ' + error.message);
      }
    },

    // 查詢 RAG Engine
    async queryEngine() {
      if (!this.selectedEngineForQuery) {
        alert('請選擇一個 RAG Engine');
        return;
      }

      if (!this.queryForm.question.trim()) {
        alert('請輸入問題');
        return;
      }

      try {
        this.queryResponse = '處理中，請稍候...';

        const response = await fetch('/api/rag/users/' + this.currentUserId + '/engines/' + this.selectedEngineForQuery + '/query', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + this.authToken,
          },
          body: JSON.stringify({ question: this.queryForm.question }),
        });

        const data = await response.json();

        if (data.success) {
          let formattedResponse = '問題: ' + this.queryForm.question + '\n\n回答: ' + data.answer + '\n\n來源:';

          if (data.sources && data.sources.length > 0) {
            data.sources.forEach((source, index) => {
              formattedResponse += '\n' + (index + 1) + '. ' + (source.title || source.name || 'Unknown');
            });
          } else {
            formattedResponse += '\n無特定來源';
          }

          formattedResponse += '\n\n時間戳: ' + new Date(data.timestamp).toLocaleString();
          this.queryResponse = formattedResponse;
          this.queryResponseClass = 'success';
        } else {
          this.queryResponse = '錯誤: ' + data.error;
          this.queryResponseClass = 'error';
        }
      } catch (error) {
        this.queryResponse = 'Error: ' + error.message;
        this.queryResponseClass = 'error';
      }
    },

    // Utility method to format dates
    formatDate(dateString) {
      return new Date(dateString).toLocaleString();
    }
  }
}
</script>
