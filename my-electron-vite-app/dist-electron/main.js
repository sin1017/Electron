import { app, BrowserWindow } from "electron";
import { fileURLToPath } from "node:url";
import process from "node:process";
import path from "node:path";
import fs from "fs";
const __dirname = path.dirname(fileURLToPath(import.meta.url));
process.env.APP_ROOT = path.join(__dirname, "..");
const VITE_DEV_SERVER_URL = process.env["VITE_DEV_SERVER_URL"];
const MAIN_DIST = path.join(process.env.APP_ROOT, "dist-electron");
const RENDERER_DIST = path.join(process.env.APP_ROOT, "dist");
process.env.VITE_PUBLIC = VITE_DEV_SERVER_URL ? path.join(process.env.APP_ROOT, "public") : RENDERER_DIST;
let win;
function createWindow(hasHammerspoon) {
  win = new BrowserWindow({
    width: 1200,
    height: 600,
    webPreferences: {
      contextIsolation: true,
      preload: path.join(__dirname, "preload.mjs")
    }
  });
  if (hasHammerspoon) {
    win.webContents.on("did-finish-load", () => {
      win == null ? void 0 : win.webContents.send(`hasHammerspoon`, true);
    });
  }
  if (VITE_DEV_SERVER_URL) {
    win.loadURL(VITE_DEV_SERVER_URL);
  } else {
    win.loadFile(path.join(RENDERER_DIST, "index.html"));
  }
  win.webContents.openDevTools();
}
app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
    win = null;
  }
});
app.on("activate", () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});
app.whenReady().then(
  () => {
    const hasHammerspoon = fs.existsSync("/Applications/Hammerspoon.app");
    createWindow(hasHammerspoon);
  }
);
export {
  MAIN_DIST,
  RENDERER_DIST,
  VITE_DEV_SERVER_URL
};
