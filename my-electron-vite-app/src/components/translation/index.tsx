import { useEffect, useState } from "react"

const Translation = () => {
  const [translationText, setTranslationText] = useState<string>('')

  useEffect(() => {
    window.ipcRenderer.on('update-counter', (_event, message) => {
      setTranslationText(message)
    })
  }, [])

  return (
    <>
      {/* 翻譯頁面，內容 */}
      翻譯頁面，內容{translationText}
    </>
  )
}

export default Translation