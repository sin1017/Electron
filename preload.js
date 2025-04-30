// preload.js
const { contextBridge, ipcRenderer } = require('electron');

// 安全地暴露部分 IPC 功能给渲染进程
contextBridge.exposeInMainWorld('clipboardAPI', {
  // 接收剪贴板内容的函数
  onClipboardContent: (callback) => {
    ipcRenderer.on('clipboard-content', (event, content) => {
      callback(content);
    });
  }
});