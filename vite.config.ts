import { defineConfig } from "vite"
import react from "@vitejs/plugin-react-swc"
import { VitePWA } from "vite-plugin-pwa"
// @ts-expect-error Vite can import the local ESM middleware at runtime.
import { createAuthMiddleware } from "./server/authMiddleware.mjs"

export default defineConfig({
  plugins: [
    {
      name: "webpidp-auth-api",
      configureServer(server) {
        server.middlewares.use(createAuthMiddleware())
      },
      configurePreviewServer(server) {
        server.middlewares.use(createAuthMiddleware())
      },
    },
    react(),
    VitePWA({
      registerType: "autoUpdate",
      devOptions: {
        enabled: true,
      },
      manifest: {
        name: "Xquare Infra User",
        short_name: "",
        description: "WebpIdp PWA Application",
        theme_color: "#03a9f4",
        background_color: "#03a9f4",
        display: "minimal-ui",
        start_url: "/",
        icons: [
          {
            src: "/logo/pwa-192x192.png",
            sizes: "192x192",
            type: "image/png",
          },
          {
            src: "/logo/pwa-512x512.png",
            sizes: "512x512",
            type: "image/png",
          },
        ],
      },
    }),
  ],
})
