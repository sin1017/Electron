import { useState } from "react"

const Translation = () => {
  const [translationText, setTranslationText] = useState<string>('')
  window.ipcRenderer.on('clipboardText', (_event, message) => {
    setTranslationText(message)
    console.log("ffff", message)
  })
  return (
    <>
      {/* 翻譯頁面，內容 */}
      翻譯頁面，內容{translationText}
    </>
  )
}

export default Translation