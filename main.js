import { app, BrowserWindow } from 'electron';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const createWindow = () => {
  const win = new BrowserWindow({
    width: 1000,
    height: 600,
    webPreferences: {
      contextIsolation: true, // 分離主程式與 web environment 
      nodeIntegration: false, // 使用 esm 時需要把這個打開，而這個打開時 sandbox 會自行切換成 false 關閉無法使用
      preload: path.join(__dirname, 'preload.js'),
    }
  })

  win.loadFile('index.html')
  // win.webContents.openDevTools();
}

app.whenReady().then(() => {
  createWindow()
  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
  })
})

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit()
})
