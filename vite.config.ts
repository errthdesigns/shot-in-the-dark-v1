import { defineConfig } from 'vite'
import path from 'path'
import fs from 'fs'
import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'

const PLACEHOLDER_PNG =
  'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg=='
const SRC_ASSETS_DIR = path.join(__dirname, 'src', 'assets')
const FIGMA_ASSETS_DIR = path.join(__dirname, 'public', 'figma-assets')

function figmaAssetPlugin() {
  return {
    name: 'vite-plugin-figma-asset-placeholder',
    resolveId(id: string) {
      if (!id.startsWith('figma:asset/')) return null
      const assetFile = id.replace('figma:asset/', '')
      const srcPath = path.join(SRC_ASSETS_DIR, assetFile)
      if (fs.existsSync(srcPath)) return srcPath
      return id
    },
    load(id: string) {
      if (!id.startsWith('figma:asset/')) return null
      const assetFile = id.replace('figma:asset/', '')
      const publicPath = path.join(FIGMA_ASSETS_DIR, assetFile)
      if (fs.existsSync(publicPath)) {
        return `export default ${JSON.stringify('/figma-assets/' + assetFile)}`
      }
      return `export default ${JSON.stringify(PLACEHOLDER_PNG)}`
    },
  }
}

export default defineConfig({
  plugins: [figmaAssetPlugin(), react(), tailwindcss()],
  resolve: { alias: { '@': path.resolve(__dirname, './src') } },
  assetsInclude: ['**/*.svg', '**/*.csv'],
})
