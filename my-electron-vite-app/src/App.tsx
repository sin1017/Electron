import { useEffect, useState } from 'react'
import './App.css'
import Translation from './components/translation'
import Description from './components/description'

function App() {
  const [status, setStatus] = useState<boolean>(false)

  useEffect(() => {
    window.ipcRenderer.on('hasHammerspoon', (_event, message) => {
      if (message) {
        setStatus(true)
      }
    })
  }, [])

  return (
    status ? <Translation /> : <Description />
  )
}

export default App
