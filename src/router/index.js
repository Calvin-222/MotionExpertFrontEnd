import { createRouter, createWebHistory } from 'vue-router'
import HomePage from '../views/HomePage.vue'
import SynopsisEditorPage from '@/views/SynopsisEditorPage.vue'
import TranslationPage from '@/views/TranslationPage.vue'
import LoginPage from '@/views/Login.vue'
import RegisterPage from '@/views/Register.vue'
import SearchUsers from '@/views/SearchUsers.vue'
import Notifcations from '@/views/notifcations.vue'
import Ragtest from '@/views/ragtest.vue'
import AdminDashboard from '@/views/AdminDashboard.vue'
import { authService } from '@/services/authService'



const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/login',
      name: 'login',
      component: LoginPage,
      meta: { requiresAuth: false },
    },
    {
      path: '/register',
      name: 'register',
      component: RegisterPage,
      meta: { requiresAuth: false },
    },
    {
      path: '/',
      name: 'home',
      component: HomePage,
      meta: { requiresAuth: true },
    },
    {
      path: '/synopsis-editor',
      name: 'synopsis-editor',
      component: SynopsisEditorPage,
      meta: { requiresAuth: true },
    },
    {
      path: '/translation',
      name: 'translation',
      component: TranslationPage,
      meta: { requiresAuth: true },
    },
    {
      path: '/search-users',
      name: 'search-users',
      component: SearchUsers,
      meta: { requiresAuth: true },
    },
    {
      path: '/admin',
      name: 'admin',
      component: AdminDashboard,
      meta: { requiresAuth: true },
    },
    {
      path: '/notifcations',
      name: 'notifications',
      component: Notifcations,
      meta: { requiresAuth: true },
    },
    {
      path: '/ragtest',
      name: 'ragtest',
      component: Ragtest,
      meta: {requiresAuth: true},
    },
    // 添加 RAG 相關路由

    {
      path: '/ai-assistant',
      redirect: '/rag', // 別名路由
    },
    {
      path: '/knowledge-base',
      redirect: '/rag', // 別名路由
    },
    // 添加調試頁面（僅開發環境）
    {
      path: '/debug-auth',
      name: 'debug-auth',
      component: () => import('@/views/DebugAuth.vue'),
      meta: { requiresAuth: false },
    },
    // 404 頁面
    {
      path: '/:pathMatch(.*)*',
      name: 'notFound',
      component: () => import('@/views/NotFound.vue'),
      meta: { requiresAuth: false },
    },


  ],
})

// Route guard for authentication
router.beforeEach(async (to, from, next) => {
  const isAuthenticated = await authService.isAuthenticated()

  // 設置頁面標題
  if (to.meta.title) {
    document.title = `${to.meta.title} - MotionExpert`
  } else {
    document.title = 'MotionExpert'
  }

  if (to.meta.requiresAuth && !isAuthenticated) {
    next({ name: 'login', query: { redirect: to.fullPath } })
  } else if ((to.name === 'login' || to.name === 'register') && isAuthenticated) {
    next({ name: 'home' })
  } else {
    next()
  }
})

export default router
