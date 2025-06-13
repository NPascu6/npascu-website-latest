import {defineConfig} from 'vite';
import react from '@vitejs/plugin-react';
import viteTsconfigPaths from 'vite-tsconfig-paths';
import compression from 'vite-plugin-compression';
import {VitePWA} from 'vite-plugin-pwa';
import viteImagemin from 'vite-plugin-imagemin';
import { createHtmlPlugin } from 'vite-plugin-html';

export default defineConfig({
    base: '/',
    build: {
        outDir: './build',
        emptyOutDir: true,
        minify: 'terser',
        assetsInlineLimit: 0,
        rollupOptions: {
            output: {
                manualChunks: {
                    vendor: [
                        'react',
                        'react-dom',
                        'react-router-dom',
                    ],
                    chart: [
                        'chart.js',
                        'react-chartjs-2',
                    ],
                    grid: [
                        'ag-grid-react',
                        'ag-grid-community',
                    ],
                    signalr: ['@microsoft/signalr'],
                    motion: ['framer-motion'],
                },
            },
        },
    },
    test: {
        // your test config...
    },
    plugins: [
        react(),
        viteTsconfigPaths(),
        createHtmlPlugin({ minify: true }),
        compression({
            algorithm: 'gzip',
            threshold: 1024,
        }),
        compression({
            algorithm: 'brotliCompress',
            ext: '.br',
            threshold: 1024,
        }),
        viteImagemin({
            gifsicle: { optimizationLevel: 7, interlaced: false },
            optipng: { optimizationLevel: 7 },
            mozjpeg: { quality: 70 },
            pngquant: { quality: [0.7, 0.9], speed: 4 },
            webp: { quality: 75 },
            svgo: {
                plugins: [{ name: 'removeViewBox', active: false }],
            },
        }),
        VitePWA({
            registerType: 'autoUpdate',
            manifest: {
                short_name: "Pascu.io",
                name: "Norbert Pascu's Portfolio",
                description: "Norbert Pascu's personal portfolio website showcasing projects and experience.",
                icons: [
                    {
                        src: "favicon-16x16.png",
                        sizes: "16x16",
                        type: "image/png"
                    },
                    {
                        src: "favicon-32x32.png",
                        sizes: "32x32",
                        type: "image/png"
                    }
                ],
                start_url: "/",
                display: "standalone",
                theme_color: "#000000",
                background_color: "#ffffff"
            },
        }),
    ],
    server: {
        open: true,
        port: 3000,
    },
});
