import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueJsx from '@vitejs/plugin-vue-jsx'
import tsEnumVirtualOptions from '@ts-enum-virtual-options/rollup-plugin'

// https://vite.dev/config/
export default defineConfig({
  plugins: [tsEnumVirtualOptions({ outputFormat: 'both' }), vue(), vueJsx()],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
})
