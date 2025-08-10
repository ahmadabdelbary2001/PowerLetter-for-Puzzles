import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import './App.css'
import { GameModeProvider } from './contexts/GameModeProvider'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <GameModeProvider>
      <App />
    </GameModeProvider>
  </StrictMode>,
)
