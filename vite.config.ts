import { defineConfig } from "vite";
import path from "path";
import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";

// Vite config
export default defineConfig({
  // For GitHub Pages: set VITE_BASE_PATH=/shot-in-the-dark-v1/
  base: process.env.VITE_BASE_PATH || "/",

  plugins: [react(), tailwindcss()],

  resolve: {
    alias: {
      // Alias @ to the src directory
      "@": path.resolve(__dirname, "./src"),
      // Treat `figma:asset/...` as if it were importing from src/assets/...
      "figma:asset": path.resolve(__dirname, "./src/assets"),
    },
  },

  // File types to support raw imports. Never add .css, .tsx, or .ts here.
  assetsInclude: ["**/*.svg", "**/*.csv"],
});
