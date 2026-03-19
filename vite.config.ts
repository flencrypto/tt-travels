import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react-swc";
import { defineConfig, PluginOption } from "vite";
import { VitePWA } from "vite-plugin-pwa";

import sparkPlugin from "@github/spark/spark-vite-plugin";
import createIconImportProxy from "@github/spark/vitePhosphorIconProxyPlugin";
import { resolve } from 'path'

const projectRoot = process.env.PROJECT_ROOT || import.meta.dirname

const base = process.env.VERCEL ? "/" : "/tt-travels/";

// https://vite.dev/config/
export default defineConfig({
  base,
  plugins: [
    react(),
    tailwindcss(),
    // DO NOT REMOVE
    createIconImportProxy() as PluginOption,
    sparkPlugin() as PluginOption,
    VitePWA({
      registerType: "autoUpdate",
      injectRegister: "auto",
      base,
      scope: base,
      includeAssets: ["favicon-16x16.png", "favicon-32x32.png", "apple-touch-icon.png", "icons/*.png"],
      manifest: {
        name: "TT Travels – Your Travel Companion",
        short_name: "TT Travels",
        description: "Plan and organise your travels with AI-powered recommendations, flight search, and itinerary planning.",
        start_url: base,
        scope: base,
        display: "standalone",
        orientation: "portrait-primary",
        background_color: "#09090b",
        theme_color: "#6366f1",
        lang: "en",
        categories: ["travel", "lifestyle"],
        icons: [
          { src: "icons/icon-72x72.png", sizes: "72x72", type: "image/png", purpose: "any" },
          { src: "icons/icon-96x96.png", sizes: "96x96", type: "image/png", purpose: "any" },
          { src: "icons/icon-128x128.png", sizes: "128x128", type: "image/png", purpose: "any" },
          { src: "icons/icon-144x144.png", sizes: "144x144", type: "image/png", purpose: "any" },
          { src: "icons/icon-152x152.png", sizes: "152x152", type: "image/png", purpose: "any" },
          { src: "icons/icon-192x192.png", sizes: "192x192", type: "image/png", purpose: "any maskable" },
          { src: "icons/icon-384x384.png", sizes: "384x384", type: "image/png", purpose: "any" },
          { src: "icons/icon-512x512.png", sizes: "512x512", type: "image/png", purpose: "any maskable" },
        ],
        shortcuts: [
          {
            name: "Explore Destinations",
            short_name: "Explore",
            description: "Browse travel destinations",
            url: `${base}explore`,
            icons: [{ src: "icons/icon-96x96.png", sizes: "96x96" }],
          },
          {
            name: "AI Planner",
            short_name: "Planner",
            description: "Plan your trip with AI",
            url: `${base}ai-planner`,
            icons: [{ src: "icons/icon-96x96.png", sizes: "96x96" }],
          },
        ],
      },
      workbox: {
        globPatterns: ["**/*.{js,css,html,ico,png,svg,woff,woff2}"],
        navigateFallback: "index.html",
        navigateFallbackDenylist: [/^\/api\//],
        runtimeCaching: [
          {
            urlPattern: /^https:\/\/fonts\.googleapis\.com\/.*/i,
            handler: "CacheFirst",
            options: {
              cacheName: "google-fonts-cache",
              expiration: { maxEntries: 10, maxAgeSeconds: 60 * 60 * 24 * 365 },
              cacheableResponse: { statuses: [0, 200] },
            },
          },
          {
            urlPattern: /^https:\/\/fonts\.gstatic\.com\/.*/i,
            handler: "CacheFirst",
            options: {
              cacheName: "gstatic-fonts-cache",
              expiration: { maxEntries: 10, maxAgeSeconds: 60 * 60 * 24 * 365 },
              cacheableResponse: { statuses: [0, 200] },
            },
          },
          {
            urlPattern: /^https:\/\/images\.unsplash\.com\/.*/i,
            handler: "StaleWhileRevalidate",
            options: {
              cacheName: "unsplash-image-cache",
              expiration: { maxEntries: 50, maxAgeSeconds: 60 * 60 * 24 * 7 },
              cacheableResponse: { statuses: [0, 200] },
            },
          },
        ],
      },
      devOptions: {
        enabled: true,
        type: "module",
      },
    }) as PluginOption,
  ],
  resolve: {
    alias: {
      '@': resolve(projectRoot, 'src')
    }
  },
});
