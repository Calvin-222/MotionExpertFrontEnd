<template>
  <div class="not-found-container">
    <div class="not-found-content">
      <div class="error-code">404</div>
      <h1 class="error-title">Page Not Found</h1>
      <p class="error-message">
        Sorry, the page you are looking for doesn't exist or has been moved.
      </p>
      <div class="action-buttons">
        <router-link to="/" class="btn btn-primary">
          <i class="fas fa-home"></i>
          Back to Home
        </router-link>
        <button @click="goBack" class="btn btn-secondary">
          <i class="fas fa-arrow-left"></i>
          Go Back
        </button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'NotFound',
  methods: {
    goBack() {
      this.$router.go(-1);
    }
  }
}
</script>

<style scoped>
.not-found-container {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  font-family: 'Arial', sans-serif;
}

.not-found-content {
  text-align: center;
  color: white;
  max-width: 600px;
  padding: 2rem;
}

.error-code {
  font-size: 8rem;
  font-weight: bold;
  margin-bottom: 1rem;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.3);
}

.error-title {
  font-size: 2.5rem;
  margin-bottom: 1rem;
  font-weight: 300;
}

.error-message {
  font-size: 1.2rem;
  margin-bottom: 2rem;
  opacity: 0.9;
}

.action-buttons {
  display: flex;
  gap: 1rem;
  justify-content: center;
  flex-wrap: wrap;
}

.btn {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1.5rem;
  border: none;
  border-radius: 5px;
  text-decoration: none;
  font-size: 1rem;
  cursor: pointer;
  transition: all 0.3s ease;
}

.btn-primary {
  background-color: #4CAF50;
  color: white;
}

.btn-primary:hover {
  background-color: #45a049;
  transform: translateY(-2px);
}

.btn-secondary {
  background-color: transparent;
  color: white;
  border: 2px solid white;
}

.btn-secondary:hover {
  background-color: white;
  color: #667eea;
  transform: translateY(-2px);
}

@media (max-width: 768px) {
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

  .btn {
    width: 200px;
  }
}
</style>
