<!-- filepath: /Users/cc/Desktop/MotionExpert_MyVersion/lab-spa/src/views/NotFound.vue -->
<template>
  <div class="not-found-container">
    <div class="not-found-content">
      <div class="error-code">404</div>
      <h1 class="error-title">頁面不存在</h1>
      <p class="error-message">抱歉，您訪問的頁面不存在或已被移除。</p>

      <div class="action-buttons">
        <button @click="goHome" class="btn-primary">
          🏠 返回首頁
        </button>
        <button @click="goBack" class="btn-secondary">
          ← 返回上頁
        </button>
      </div>

      <div class="suggestions">
        <h3>您可能想要：</h3>
        <ul>
          <li><router-link to="/">🏠 首頁</router-link></li>
          <li><router-link to="/rag">🤖 AI 知識庫</router-link></li>
          <li><router-link to="/synopsis-editor">✏️ 劇本編輯器</router-link></li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'NotFound',
  methods: {
    goHome() {
      this.$router.push('/')
    },
    goBack() {
      this.$router.go(-1)
    }
  }
}
</script>

<style scoped>
.not-found-container {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  padding: 20px;
}

.not-found-content {
  background: white;
  border-radius: 20px;
  padding: 60px 40px;
  text-align: center;
  max-width: 600px;
  box-shadow: 0 20px 60px rgba(0,0,0,0.3);
}

.error-code {
  font-size: 8rem;
  font-weight: bold;
  color: #e74c3c;
  margin-bottom: 20px;
  text-shadow: 2px 2px 4px rgba(0,0,0,0.1);
}

.error-title {
  font-size: 2.5rem;
  color: #2c3e50;
  margin-bottom: 15px;
}

.error-message {
  font-size: 1.2rem;
  color: #7f8c8d;
  margin-bottom: 40px;
  line-height: 1.6;
}

.action-buttons {
  display: flex;
  gap: 20px;
  justify-content: center;
  margin-bottom: 40px;
  flex-wrap: wrap;
}

.btn-primary, .btn-secondary {
  padding: 12px 24px;
  border: none;
  border-radius: 8px;
  font-size: 1rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s;
  text-decoration: none;
  display: inline-flex;
  align-items: center;
  gap: 8px;
}

.btn-primary {
  background: #3498db;
  color: white;
}

.btn-primary:hover {
  background: #2980b9;
  transform: translateY(-2px);
}

.btn-secondary {
  background: #95a5a6;
  color: white;
}

.btn-secondary:hover {
  background: #7f8c8d;
  transform: translateY(-2px);
}

.suggestions {
  border-top: 1px solid #ecf0f1;
  padding-top: 30px;
}

.suggestions h3 {
  color: #2c3e50;
  margin-bottom: 20px;
}

.suggestions ul {
  list-style: none;
  padding: 0;
  display: flex;
  justify-content: center;
  gap: 30px;
  flex-wrap: wrap;
}

.suggestions li a {
  color: #3498db;
  text-decoration: none;
  font-weight: 500;
  padding: 8px 16px;
  border-radius: 6px;
  transition: all 0.2s;
}

.suggestions li a:hover {
  background: #e3f2fd;
  transform: translateY(-1px);
}

@media (max-width: 768px) {
  .not-found-content {
    padding: 40px 20px;
  }

  .error-code {
    font-size: 6rem;
  }

  .error-title {
    font-size: 2rem;
  }

  .action-buttons {
    flex-direction: column;
    align-items: center;
  }

  .suggestions ul {
    flex-direction: column;
    gap: 15px;
  }
}
</style>
