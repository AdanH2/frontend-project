import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      // Proxy `/sportradar/*` to the Sportradar API to avoid CORS during development.
      // Requests to `/sportradar/mlb/trial/v8/en/league/teams.json` will be
      // forwarded to `https://api.sportradar.com/mlb/trial/v8/en/league/teams.json`.
      "/sportradar": {
        target: "https://api.sportradar.com",
        changeOrigin: true,
        secure: true,
        rewrite: (path) => path.replace(/^\/sportradar/, ""),
      },
    },
  },
});
