/// <reference types="vitest" />
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import viteTsconfigPaths from 'vite-tsconfig-paths'
import { configDefaults } from 'vitest/config';

export default defineConfig({
    base: './',
    build: {
        outDir: './build',
        emptyOutDir: true,
    },
    test: {
        exclude: [
            ...configDefaults.exclude,
            'node_modules',
            'build',
            'coverage',
            'src/index.tsx',
            'vite.config.mjs',
            'src/e2e-tests',
        ],
        environment: 'jsdom',
        coverage: {
            exclude: [
                ...configDefaults.exclude,
                'node_modules',
                'build',
                'coverage',
                'src/index.tsx',
                'vite.config.mjs',
                'src/e2e-tests',
                'playwright.config.ts',
            ],
        }
    },
    plugins: [react(), viteTsconfigPaths()],
    server: {
        // this ensures that the browser opens upon server start
        open: true,
        // this sets a default port to 3000  
        port: 3000,
    },
})