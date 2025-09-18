import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  // Environment variables are handled by Netlify build environment
  build: {
    // Optimize chunk sizes for deployment
    rollupOptions: {
      output: {
        manualChunks: {
          "react-vendor": ["react", "react-dom"],
          "chart-vendor": [
            "chart.js",
            "react-chartjs-2",
            "chartjs-adapter-date-fns",
          ],
          "ui-vendor": ["lucide-react", "react-router-dom"],
        },
      },
    },
    // Increase chunk size warning limit
    chunkSizeWarningLimit: 600,
  },
  server: {
    // Development server configuration
    port: 5173,
    host: true,
  },
});
