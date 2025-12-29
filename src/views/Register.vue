<template>
  <div class="register-page">
    <div class="register-container">
      <div class="register-header">
        <div class="register-logo">

           <img src="@/components/icons/motionexpaiicon.svg" alt="Motion Expert Logo" />
        </div>
        <h1>Motion Expert</h1>
        <p>Create your account</p>
      </div>
      <div v-if="errorMessage" class="error-message">
        {{ errorMessage }}
      </div>

      <form @submit.prevent="handleRegister" class="register-form">
        <div class="form-group">
          <label for="username">Username</label>
          <input
            type="text"
            id="username"
            v-model="registerForm.username"
            required
            :disabled="isLoading"
            placeholder="Choose a username"
          />
        </div>

        <div class="form-group">
          <label for="password">Password</label>
          <input
            type="password"
            id="password"
            v-model="registerForm.password"
            required
            :disabled="isLoading"
            placeholder="Create a password (min 6 characters)"
          />
        </div>

        <div class="form-group">
          <label for="confirmPassword">Confirm Password</label>
          <input
            type="password"
            id="confirmPassword"
            v-model="registerForm.confirmPassword"
            required
            :disabled="isLoading"
            placeholder="Confirm your password"
          />
        </div>

        <button
          type="submit"
          class="register-btn"
          :disabled="isLoading"
        >
          {{ isLoading ? 'Creating Account...' : 'Create Account' }}
        </button>
      </form>



      <div v-if="successMessage" class="success-message">
        {{ successMessage }}
      </div>

      <div class="login-link">
        <p>Already have an account?</p>
        <router-link to="/login">Sign in here</router-link>
      </div>
    </div>
  </div>
</template>

<script>
import { authService } from '@/services/authService'
import '@/assets/Register.css'

export default {
  name: 'RegisterPage',
  data() {
    return {
      registerForm: {
        username: '',
        password: '',
        confirmPassword: ''
      },
      isLoading: false,
      errorMessage: '',
      successMessage: ''
    }
  },
  methods: {
    async handleRegister() {
      this.isLoading = true
      this.errorMessage = ''
      this.successMessage = ''

      try {
        const response = await authService.register(
          this.registerForm.username,
          this.registerForm.password,
          this.registerForm.confirmPassword
        )

        if (response.success) {
          // Store token and user info
          localStorage.setItem('token', response.token)
          localStorage.setItem('user', JSON.stringify(response.user))

          this.successMessage = 'Account created successfully! Redirecting...'

          // Redirect after a short delay
          setTimeout(() => {
            this.$router.push('/')
          }, 1500)
        } else {
          this.errorMessage = response.message
        }
      } catch (error) {
        this.errorMessage = 'Registration failed. Please try again.'
        console.error('Registration error:', error)
      } finally {
        this.isLoading = false
      }
    }
  }
}
</script>
