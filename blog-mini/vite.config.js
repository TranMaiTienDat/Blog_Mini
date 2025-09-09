import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig(({ mode }) => ({
  plugins: [react()],
  // Set base path for GitHub Pages project site
  // This should be the repo name with leading/trailing slashes
  base: mode === 'production' ? '/Blog_Mini/' : '/',
}))
