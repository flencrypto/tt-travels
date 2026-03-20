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
      includeAssets: ["favicon-16x16.png", "favicon-32x32.png", "apple-touch-icon.png", "icon.svg", "icons/*.png"],
      manifest: {
        name: "TTs Travels – Curated Journeys · Effortlessly Beautiful",
        short_name: "TTs Travels",
        description: "Plan and organise your travels with AI-powered recommendations, flight search, and itinerary planning.",
        start_url: base,
        scope: base,
        display: "standalone",
        orientation: "portrait-primary",
        background_color: "#FEFCF5",
        theme_color: "#B76C7A",
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
          {
            name: "My Trips",
            short_name: "Trips",
            description: "View and manage your trips",
            url: `${base}trips`,
            icons: [{ src: "icons/icon-96x96.png", sizes: "96x96" }],
          },
          {
            name: "Bookings",
            short_name: "Bookings",
            description: "View your flight and hotel bookings",
            url: `${base}bookings`,
            icons: [{ src: "icons/icon-96x96.png", sizes: "96x96" }],
          },
          {
            name: "Travel Journal",
            short_name: "Journal",
            description: "Write and read your travel journal",
            url: `${base}journal`,
            icons: [{ src: "icons/icon-96x96.png", sizes: "96x96" }],
          },
        ],

        // ── Enhanced PWA capabilities ──────────────────────────────────────

        // Controls how the app launches: re-use an existing window if one is
        // open, rather than opening a duplicate tab (single-instance behaviour).
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        launch_handler: { client_mode: ["navigate-existing", "auto"] } as any,

        // Progressive enhancement for display: prefer window-controls-overlay
        // (title bar canvas), fall back to standalone → minimal-ui.
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        display_override: [
          "window-controls-overlay",
          "standalone",
          "minimal-ui",
        ] as any,

        // Edge sidebar panel (preferred panel width in px).
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        edge_side_panel: { preferred_width: 480 } as any,

        // Registers the Journal page as the target for OS note-taking shortcuts.
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        note_taking: { new_note_url: `${base}journal` } as any,

        // Home-screen / lock-screen widget declaration.
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        widgets: [
          {
            name: "TTs Travels",
            tag: "tt-travels-widget",
            description: "Quick access to your trips and destinations",
            icons: [{ src: "icons/icon-192x192.png", sizes: "192x192" }],
            screenshots: [],
          },
        ] as any,
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
