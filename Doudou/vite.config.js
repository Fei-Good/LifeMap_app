import { defineConfig } from 'vite'
import uni from '@dcloudio/vite-plugin-uni'
import { resolve } from 'path'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    uni(),
  ],
  resolve: {
    alias: {
      '@': resolve(__dirname, 'src'),
      '@static': resolve(__dirname, 'src/static'),
    }
  },
  // 静态资源处理
  build: {
    assetsDir: 'static', // 静态资源输出目录
    rollupOptions: {
      output: {
        // 确保图片路径正确
        assetFileNames: 'static/[ext]/[name]-[hash].[ext]'
      }
    }
  },
  // 针对小程序平台的特殊配置
  define: {
    __UNI_PLATFORM__: JSON.stringify(process.env.UNI_PLATFORM)
  }
})
