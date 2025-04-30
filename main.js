const { app, BrowserWindow, clipboard, ipcMain } = require('electron');
const path = require('path');

// 保存主窗口的引用，避免被垃圾回收
let mainWindow;
// 剪贴板窗口引用
let clipboardWindow;

// 创建主窗口
function createMainWindow() {
  mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
      preload: path.join(__dirname, 'preload.js')
    }
  });

  // 加载主窗口页面
  mainWindow.loadFile(path.join(__dirname, 'index.html'));

  // 设置剪贴板监听器 - 替代了快捷键监听器
  setupClipboardMonitor();

  // 当窗口关闭时，解除引用
  mainWindow.on('closed', () => {
    mainWindow = null;
  });
}

// 创建剪贴板窗口
function createClipboardWindow() {
  // 如果窗口已存在，则聚焦它
  if (clipboardWindow) {
    clipboardWindow.focus();
    return;
  }

  // 创建新窗口
  clipboardWindow = new BrowserWindow({
    width: 400,
    height: 300,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false
    }
  });

  // 加载剪贴板窗口页面
  clipboardWindow.loadFile(path.join(__dirname, 'clipboard.html'));

  // 获取剪贴板的内容并发送到窗口
  const clipboardContent = clipboard.readText();
  clipboardWindow.webContents.on('did-finish-load', () => {
    clipboardWindow.webContents.send('clipboard-content', clipboardContent);
  });

  // 当窗口关闭时，解除引用
  clipboardWindow.on('closed', () => {
    clipboardWindow = null;
  });
}

// 监听剪贴板变化
function setupClipboardMonitor() {
  console.log('设置剪贴板监听器');
  
  // 储存上一次的剪贴板内容，用于检测变化
  let lastClipboardContent = clipboard.readText();
  
  // 设置定时器，定期检查剪贴板内容是否发生变化
  const checkInterval = setInterval(() => {
    const currentContent = clipboard.readText();
    
    // 如果内容有变化，说明可能发生了复制
    if (currentContent !== lastClipboardContent) {
      console.log('检测到剪贴板内容变化');
      lastClipboardContent = currentContent;
      
      // 打开窗口显示新复制的内容
      createClipboardWindow();
    }
  }, 300); // 每300毫秒检查一次
  
  // 当应用退出时清除定时器
  app.on('will-quit', () => {
    clearInterval(checkInterval);
  });
}

// 当 Electron 完成初始化后创建窗口
app.whenReady().then(() => {
  createMainWindow();

  // 在 macOS 上，当点击 dock 图标并且没有其他窗口打开时，
  // 通常在应用程序中重新创建一个窗口。
  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createMainWindow();
    }
  });
});

// 当所有窗口都被关闭时退出应用
app.on('window-all-closed', () => {
  // 在 macOS 上，除非用户用 Cmd + Q 确定地退出，
  // 否则绝大多数应用及其菜单栏会保持激活。
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

// 当应用退出前清理资源
app.on('will-quit', () => {
  // 不再需要注销快捷键，因为我们没有使用全局快捷键
});