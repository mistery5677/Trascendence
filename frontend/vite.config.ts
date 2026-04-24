import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    host: true,
    port: 5173,
    proxy: {
      "/api": {
        target: "http://backend:3000",
        changeOrigin: true,
      },
      "/assets": {
        target: "http://backend:3000",
        changeOrigin: true,
      },
      "/socket.io": {
        target: "http://backend:3000",
        ws: true, // Habilita el proxy para WebSocket
        changeOrigin: true,
      },
    },
  },
});
