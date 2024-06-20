import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueDevTools from 'vite-plugin-vue-devtools'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue(), vueDevTools()],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
      'b%': fileURLToPath(new URL('node_modules/bootstrap/dist/css', import.meta.url)),
      'bi%': fileURLToPath(new URL('node_modules/bootstrap-icons/font', import.meta.url))
    }
  }
})
