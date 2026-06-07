import { defineConfig } from "vite"
import react from "@vitejs/plugin-react-swc"
import { VitePWA } from "vite-plugin-pwa"

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: "autoUpdate",
      devOptions: {
        enabled: true,
      },
      manifest: {
        name: "IDP Service",
        short_name: "IDP",
        description: "Integrated document platform for feature specs, API specs, ERD, review, AI, and audit logs.",
        theme_color: "#0f172a",
        background_color: "#f6f8fb",
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
