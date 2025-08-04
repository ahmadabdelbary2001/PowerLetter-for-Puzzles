import { useState } from 'react'
import type { ReactElement } from 'react'
import type { Language } from './contexts/GameModeContext'
import './index.css'   // Tailwind base/utilities
import './App.css'     // your @apply helpers

import { GameModeProvider, useGameMode } from './contexts/GameModeContext'
import LanguageSelector from './components/GameSetup/LanguageSelector'
import GameModeSelector from './components/GameSetup/GameModeSelector'

// Define your flow states inline so TS knows their literal types
const FLOW_STATES = {
  LANGUAGE_SELECTION: 'language_selection',
  MODE_SELECTION: 'mode_selection',
  TEAM_SETUP: 'team_setup',
  GAME_TYPE_SELECTION: 'game_type_selection',
} as const

type FlowState = typeof FLOW_STATES[keyof typeof FLOW_STATES]

function AppContent(): ReactElement {
  const { language, setLanguage } = useGameMode()
  const [currentFlow, setCurrentFlow] = useState<FlowState>(
    FLOW_STATES.LANGUAGE_SELECTION
  )
  const [selectedLanguage, setSelectedLanguage] = useState<Language | null>(null)

  // Accept plain string from the selector, then cast to our union
  const handleLanguageSelect = (langCode: string): void => {
    const lang = langCode as Language
    setLanguage(lang)
    setSelectedLanguage(lang)
    setCurrentFlow(FLOW_STATES.MODE_SELECTION)
  }

  const handleModeSelect = (mode: 'single' | 'competitive'): void => {
    setCurrentFlow(
      mode === 'competitive'
        ? FLOW_STATES.TEAM_SETUP
        : FLOW_STATES.GAME_TYPE_SELECTION
    )
  }

  const handleBackToLanguage = (): void => {
    setSelectedLanguage(null)
    setCurrentFlow(FLOW_STATES.LANGUAGE_SELECTION)
  }

  const renderScreen = (): ReactElement => {
    switch (currentFlow) {
      case FLOW_STATES.LANGUAGE_SELECTION:
        return <LanguageSelector onLanguageSelect={handleLanguageSelect} />

      case FLOW_STATES.MODE_SELECTION:
        return (
          <GameModeSelector
            onModeSelect={handleModeSelect}
            onBack={handleBackToLanguage}
          />
        )

      case FLOW_STATES.TEAM_SETUP:
        return <div>🛠 Team setup (TODO)</div>

      case FLOW_STATES.GAME_TYPE_SELECTION:
        return <div>🎯 Game type selection (TODO)</div>

      default:
        return <div>❓ Unknown flow state</div>
    }
  }

  return (
    <div
      className="
        min-h-screen flex items-center justify-center p-4
        bg-gradient-to-br from-blue-50 to-indigo-100
        dark:bg-gradient-to-br dark:from-gray-900 dark:to-gray-800
      "
    >
      <div className="w-full max-w-4xl">
        {renderScreen()}

        {selectedLanguage && (
          <div className="language-badge">
            Current Language: {language.toUpperCase()}
          </div>
        )}

      </div>
    </div>
  )
}

export default function App(): ReactElement {
  return (
    <GameModeProvider>
      <AppContent />
    </GameModeProvider>
  )
}
