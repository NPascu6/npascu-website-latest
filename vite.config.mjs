import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import viteTsconfigPaths from 'vite-tsconfig-paths';
import compression from 'vite-plugin-compression';
import { VitePWA } from 'vite-plugin-pwa';
import { configDefaults } from 'vitest/config';

export default defineConfig({
  base: './',
  build: {
    outDir: './build',
    emptyOutDir: true,
  },
  test: {
    // your test config...
  },
  plugins: [
    react(),
    viteTsconfigPaths(),
    compression({
      algorithm: 'gzip',
      threshold: 1024,
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
