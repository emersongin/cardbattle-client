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
            '@api': fileURLToPath(new URL('../src/game/api', import.meta.url)),
            '@constants': fileURLToPath(new URL('../src/game/constants', import.meta.url)),
            '@objects': fileURLToPath(new URL('../src/game/objects', import.meta.url)),
            '@scenes': fileURLToPath(new URL('../src/game/scenes', import.meta.url)),
            '@types': fileURLToPath(new URL('../src/game/types', import.meta.url)),
            '@ui': fileURLToPath(new URL('../src/game/ui', import.meta.url)),
            '@utils': fileURLToPath(new URL('../src/game/utils', import.meta.url)),
            '@mocks': fileURLToPath(new URL('../src/tests/mocks', import.meta.url)),
            '@tests': fileURLToPath(new URL('../src/tests', import.meta.url))
        }
    },
    server: {
        host: '0.0.0.0',
        port: 5173,
        strictPort: true
    }
})
