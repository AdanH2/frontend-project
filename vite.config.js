import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      "/sportradar": {
        target: "https://api.sportradar.com",
        changeOrigin: true,
        secure: true,
        rewrite: (path) => path.replace(/^\/sportradar/, ""),
      },
    },
  },

  //  Vitest config
  test: {
    environment: "jsdom",
    globals: true,
    setupFiles: "./test/setup.js",
  },
});
