import { defineConfig } from 'vitest/config';
import { resolve } from 'path';

export default defineConfig({
    test: {
        environment: 'jsdom',
        globals: true,
        include: [
            'src/tests/**/*.test.ts'
        ],
        setupFiles: "./src/tests/mocks/phaser.ts",
    },
    resolve: {
        alias: {
            '@src': resolve(__dirname, 'src'),
            '@game': resolve(__dirname, 'src/game'),
            '@scenes': resolve(__dirname, 'src/game/scenes'),
            '@ui': resolve(__dirname, 'src/game/ui'),
            '@utils': resolve(__dirname, 'src/utils'),
            '@api': resolve(__dirname, 'src/game/api'),
            '@tests': resolve(__dirname, 'src/tests'),
            '@mocks': resolve(__dirname, 'src/tests/mocks'),
        },
    },
});