/// <reference types="vitest" />
import {defineConfig} from 'vite'
import react from '@vitejs/plugin-react'
import viteTsconfigPaths from 'vite-tsconfig-paths'
import compression from 'vite-plugin-compression'
import {configDefaults} from 'vitest/config';

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
    plugins: [react(), viteTsconfigPaths(), compression({
        // Optional: specify which algorithm to use, e.g. gzip or brotli
        algorithm: 'gzip',
        // Optional: only compress if size is bigger than 1kB, etc.
        threshold: 1024,
      }),],
    server: {
        // this ensures that the browser opens upon server start
        open: true,
        // this sets a default port to 3000  
        port: 3000,
    },
})