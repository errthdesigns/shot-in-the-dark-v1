import { defineConfig } from "vite";
import path from "path";
import fs from "fs";
import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";

// 1x1 transparent PNG – fallback when no local asset exists.
// (Local dev / Vercel build both use this when a figma:asset image isn't present.)
const PLACEHOLDER_PNG =
  "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==";

const SRC_ASSETS_DIR = path.join(__dirname, "src", "assets");
const FIGMA_ASSETS_DIR = path.join(__dirname, "public", "figma-assets");

function figmaAssetPlugin() {
  return {
    name: "vite-plugin-figma-asset-placeholder",
    resolveId(id: string) {
      if (!id.startsWith("figma:asset/")) return null;
      const assetFile = id.replace("figma:asset/", "");
      const srcPath = path.join(SRC_ASSETS_DIR, assetFile);
      if (fs.existsSync(srcPath)) return srcPath; // use real PNG in src/assets if present
      return id; // let load() handle placeholder/public
    },
    load(id: string) {
      if (!id.startsWith("figma:asset/")) return null;
      const assetFile = id.replace("figma:asset/", "");
      const publicPath = path.join(FIGMA_ASSETS_DIR, assetFile);
      if (fs.existsSync(publicPath)) {
        // serve from public/figma-assets if available
        return `export default ${JSON.stringify("/figma-assets/" + assetFile)}`;
      }
      // final fallback: tiny transparent PNG so build never fails
      return `export default ${JSON.stringify(PLACEHOLDER_PNG)}`;
    },
  };
}

export default defineConfig({
  // For GitHub Pages you can set VITE_BASE_PATH=/shot-in-the-dark-v1/
  base: process.env.VITE_BASE_PATH || "/",
  plugins: [figmaAssetPlugin(), react(), tailwindcss()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  // File types to support raw imports. Never add .css, .tsx, or .ts here.
  assetsInclude: ["**/*.svg", "**/*.csv"],
});
