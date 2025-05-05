import { defineConfig } from 'vite'
import path from 'node:path'
import fs from 'fs';
import electron from 'vite-plugin-electron/simple'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    electron({
      main: {
        entry: 'electron/main.ts',
      },
      preload: {
        input: path.join(__dirname, 'electron/preload.ts'),
      },
      renderer: process.env.NODE_ENV === 'test'
        ? undefined
        : {},
    }),
    {
      name: 'copy-lua-to-dist',
      apply: 'build',
      closeBundle() {
        const from = path.resolve(__dirname, 'electron/hammerspoon/init.lua');
        const to = path.resolve(__dirname, 'dist-electron/hammerspoon/init.lua');
        fs.mkdirSync(path.dirname(to), { recursive: true });
        fs.copyFileSync(from, to);
      }
    }
  ],
})
