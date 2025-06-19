import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

// https://vitejs.dev/config/
export default defineConfig({
    base: './',
    plugins: [
        vue(),
    ],
    resolve: {
        alias: {
            '@': fileURLToPath(new URL('../src', import.meta.url)),
            '@game': fileURLToPath(new URL('../src/game', import.meta.url)),
            '@scenes': fileURLToPath(new URL('../src/game/scenes', import.meta.url)),
            '@ui': fileURLToPath(new URL('../src/game/ui', import.meta.url)),
            '@utils': fileURLToPath(new URL('../src/game/utils', import.meta.url)),
        }
    },
    server: {
        port: 8080
    }
})
