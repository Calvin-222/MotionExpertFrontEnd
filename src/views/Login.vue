<template>
  <div class="login-page">
    <div class="login-container">
      <div class="login-header">
        <div class="login-logo">
          <img src="@/components/icons/mthinker.svg" alt="Mthinker Logo" />
        </div>
        <h1>Mthinker</h1>
        <p>Please sign in to your account</p>
      </div>

      <form @submit.prevent="handleLogin" class="login-form">
        <div class="form-group">
          <label for="username">Username</label>
          <input
            type="text"
            id="username"
            v-model="loginForm.username"
            required
            :disabled="isLoading"
            placeholder="Enter your username"
          />
        </div>

        <div class="form-group">
          <label for="password">Password</label>
          <input
            type="password"
            id="password"
            v-model="loginForm.password"
            required
            :disabled="isLoading"
            placeholder="Enter your password"
          />
        </div>

        <button
          type="submit"
          class="login-btn"
          :disabled="isLoading"
        >
          {{ isLoading ? 'Signing In...' : 'Sign In' }}
        </button>
      </form>

      <div v-if="errorMessage" class="error-message">
        {{ errorMessage }}
      </div>
      <div class="register-link">
      <p>Don't have an account?</p>
      <router-link to="/register">Create one here</router-link>
    </div>
    </div>
  </div>
</template>

<script>
import { authService } from '@/services/authService'
import '@/assets/login.css'

export default {
  name: 'LoginPage', // Changed to multi-word to fix eslint warning
  data() {
    return {
      loginForm: {
        username: '',
        password: ''
      },
      isLoading: false,
      errorMessage: ''
    }
  },
  methods: {
    async handleLogin() {
      this.isLoading = true
      this.errorMessage = ''

      try {
        const response = await authService.login(
          this.loginForm.username,
          this.loginForm.password
        )

        if (response.success) {
          // Store token and user info
          localStorage.setItem('token', response.token)
          localStorage.setItem('user', JSON.stringify(response.user))

          // Redirect to home or intended route
          this.$router.push('/')
        } else {
          this.errorMessage = response.message
        }
      } catch (error) {
        this.errorMessage = 'Login failed. Please try again.'
        console.error('Login error:', error)
      } finally {
        this.isLoading = false
      }
    }
  }
}
</script>
