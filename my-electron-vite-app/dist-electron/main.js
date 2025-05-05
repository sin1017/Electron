import { app as i, BrowserWindow as p } from "electron";
import { fileURLToPath as h } from "node:url";
import e from "node:process";
import n from "node:path";
import c from "fs";
import u from "os";
import { exec as d } from "child_process";
import { execSync as R } from "node:child_process";
import w from "http";
const m = n.dirname(h(import.meta.url));
e.env.APP_ROOT = n.join(m, "..");
const a = e.env.VITE_DEV_SERVER_URL, A = n.join(e.env.APP_ROOT, "dist-electron"), f = n.join(e.env.APP_ROOT, "dist");
e.env.VITE_PUBLIC = a ? n.join(e.env.APP_ROOT, "public") : f;
let o;
function l(t) {
  o = new p({
    width: 1200,
    height: 600,
    webPreferences: {
      contextIsolation: !0,
      preload: n.join(m, "preload.mjs")
    }
  }), t && o.webContents.on("did-finish-load", () => {
    o == null || o.webContents.send("hasHammerspoon", !0);
  }), a ? o.loadURL(a) : o.loadFile(n.join(f, "index.html")), o.webContents.openDevTools();
}
function _() {
  const t = n.join(m, "hammerspoon", "init.lua"), r = n.join(u.homedir(), ".hammerspoon", "init.lua");
  c.copyFileSync(t, r);
}
function v() {
  R('pgrep -x Hammerspoon || echo ""').toString().trim() || d("open -a Hammerspoon");
}
function E() {
  w.createServer((r, s) => {
    r.url === "/open" && r.method === "POST" ? (l(), s.end("ok")) : (s.statusCode = 404, s.end());
  }).listen(3030, () => {
    console.log("listening for lua at http://localhost:3030");
  });
}
i.on("window-all-closed", () => {
  e.platform !== "darwin" && (i.quit(), o = null);
});
i.on("quit", () => {
  d("killall Hammerspoon");
});
i.on("activate", () => {
  p.getAllWindows().length === 0 && l();
});
i.whenReady().then(
  async () => {
    c.existsSync("/Applications/Hammerspoon.app") ? (await _(), await v(), E()) : l(!1);
  }
);
export {
  A as MAIN_DIST,
  f as RENDERER_DIST,
  a as VITE_DEV_SERVER_URL
};
