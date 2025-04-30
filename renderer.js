
const information = document.getElementById('info');
information.innerText = `正在使用 Chrome (v${versions.chrome()}), Node.js (v${versions.node()}), 和 Electron (v${versions.electron()})`

// const func = async () => {
//   const response = await window.versions.ping()
//   console.log("response", response)
//   information.innerText = `寫入：${response}`
// }

// func()