import { app, BrowserWindow, clipboard } from 'electron'
import { fileURLToPath } from 'node:url'
import process from 'node:process'
import path from 'node:path'
import fs from 'fs'
import os from 'os';
import { exec } from 'child_process'
import { execSync } from "node:child_process";
import http from 'http'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

process.env.APP_ROOT = path.join(__dirname, '..')

export const VITE_DEV_SERVER_URL = process.env['VITE_DEV_SERVER_URL']
export const MAIN_DIST = path.join(process.env.APP_ROOT, 'dist-electron')
export const RENDERER_DIST = path.join(process.env.APP_ROOT, 'dist')

process.env.VITE_PUBLIC = VITE_DEV_SERVER_URL ? path.join(process.env.APP_ROOT, 'public') : RENDERER_DIST

let win: BrowserWindow | null

function createWindow(hasHammerspoon?: boolean) {
  win = new BrowserWindow({
    width: 1200,
    height: 600,
    webPreferences: {
      contextIsolation: true,
      preload: path.join(__dirname, 'preload.mjs'),
    },
  })

  if (hasHammerspoon) {
    const clipboardText = getClipboard();
    win.webContents.on('did-finish-load', () => {
      win?.webContents.send(`hasHammerspoon`, true)
      win?.webContents.send('clipboardText', clipboardText)
    })
  }

  if (VITE_DEV_SERVER_URL) {
    win.loadURL(VITE_DEV_SERVER_URL)
  } else {
    win.loadFile(path.join(RENDERER_DIST, 'index.html'))
  }
  win.webContents.openDevTools();
}
function writeLuaScript() {
  const src = path.join(__dirname, 'hammerspoon', 'init.lua');
  const dest = path.join(os.homedir(), '.hammerspoon', 'init.lua');
  fs.copyFileSync(src, dest);
}
function launchHammerspoon() {
  const isRunning = execSync('pgrep -x Hammerspoon || echo ""').toString().trim();
  if (!isRunning) {
    exec('open -a Hammerspoon');
  }
}

function startLuaServer() {
  const server = http.createServer((req, res) => {
    if (req.url === '/open' && req.method === 'POST') {
      if (win && !win.isDestroyed()) {
        const clipboardText = getClipboard();
        win.webContents.on('did-finish-load', () => {
          win?.webContents.send(clipboardText)
        })
        win.focus()
      } else {
        createWindow(true);
      }
      res.end('ok')
    } else {
      res.statusCode = 404;
      res.end();
    }
  })

  server.listen(3030, () => {
    console.log("listening for lua at http://localhost:3030")
  })
}

function getClipboard(): string {
  return clipboard.readText()
}

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
    win = null
  }
})
app.on('quit', () => {
  exec('killall Hammerspoon')
})


app.whenReady().then(
  async () => {
    // 檢查是否有安裝
    const hasHammerspoon = fs.existsSync("/Applications/Hammerspoon.app");

    if (hasHammerspoon) {
      await writeLuaScript();
      await launchHammerspoon();
      startLuaServer();
    } else {
      // 開啟安裝頁面
      createWindow(false);
    }
  }
)
