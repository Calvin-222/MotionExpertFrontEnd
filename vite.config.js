// filepath: /Users/cc/Desktop/MotionExpert_Backend/lab-spa/vite.config.js
import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    vue(),
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    }
  },
  server: { // 新增 server 設定
    proxy: {
      // 將 /api 開頭的請求代理到後端伺服器
      // 假設您的 Express 後端運行在 http://localhost:3000
      '/api': {
        target: 'http://localhost:3000',
        changeOrigin: true, // 需要 changeOrigin 來避免某些伺服器的來源檢查
        // rewrite: (path) => path.replace(/^\/api/, '') // 如果後端 API 沒有 /api 前綴，則取消註解此行
      }
    }
  }
})
