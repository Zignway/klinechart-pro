/// <reference types="vite/client" />

import { defineConfig } from 'vite'
import solidPlugin from 'vite-plugin-solid'

export default defineConfig({
  plugins: [solidPlugin()],
  build: {
    cssTarget: 'chrome61',
    sourcemap: true,
    rollupOptions: {
      external: ['@numlemon/klinecharts'],
      output: {
        assetFileNames: (chunkInfo) => {
          if (chunkInfo.name === 'style.css') {
            return 'klinecharts-pro.css'
          }
        },
        globals: {
          klinecharts: '@numlemon/klinecharts'
        },
      },
    },
    lib: {
      entry: './src/index.ts',
      name: 'klinechartspro',
      fileName: (format) => {
        if (format === 'es') {
          return 'klinecharts-pro.js'
        }
        if (format === 'umd') {
          return 'klinecharts-pro.umd.js'
        }
      }
    }
  }
})
