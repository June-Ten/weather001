import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import  path  from 'path'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue()],
  resolve: {
    alias: {
      '@src': path.resolve(__dirname, "src"),
    }
  },
  server: {
    proxy: {// 跨域代理
      '/juhe': {
        // target: 'http://' + env.VUE_APP_BASE_API,
        target: 'http://apis.juhe.cn', // 聚合数据
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/juhe/, '')
      },
    }
  }
})
