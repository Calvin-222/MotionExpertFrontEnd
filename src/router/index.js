import { createRouter, createWebHistory } from 'vue-router'
import HomePage from '../views/HomePage.vue'
import SynopsisEditorPage from '@/views/SynopsisEditorPage.vue'
import LoginPage from '@/views/Login.vue'
import RegisterPage from '@/views/Register.vue'
import SearchUsers from '@/views/SearchUsers.vue'
import RAGPage from '@/views/Rag.vue' // 添加 RAG 頁面導入
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
      path: '/search-users',
      name: 'search-users',
      component: SearchUsers,
      meta: { requiresAuth: true },
    },
    // 添加 RAG 相關路由
    {
      path: '/rag',
      name: 'rag',
      component: RAGPage,
      meta: {
        requiresAuth: true,
        title: 'AI 知識庫',
      },
    },
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
    // 添加好友頁面

  ],
})

// Route guard for authentication
router.beforeEach((to, from, next) => {
  const isAuthenticated = authService.isAuthenticated()

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
