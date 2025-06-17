import { createRouter, createWebHistory } from 'vue-router'
import HomePage from '../views/HomePage.vue'
import SynopsisEditorPage from '@/views/SynopsisEditorPage.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomePage,
    },
    {
      path: '/synopsis-editor',
      name: 'synopsis-editor',
      component: SynopsisEditorPage,
    },
  ],
})

export default router
