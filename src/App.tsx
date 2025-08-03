import './App.css';
import LanguageSelector from './components/GameSetup/LanguageSelector';
import { useState } from 'react';

function App() {
  const [selectedLanguage, setSelectedLanguage] = useState<string | null>(null);

  const handleLanguageSelect = (langCode: string) => {
    console.log(`Selected language: ${langCode}`);
    setSelectedLanguage(langCode);
    // Add your navigation logic here (e.g., routing to next screen)
  };

  return (
    <div className="App">
      <LanguageSelector onLanguageSelect={handleLanguageSelect} />
      
      {selectedLanguage && (
        <div className="fixed bottom-4 left-4 bg-blue-100 dark:bg-blue-900 p-2 rounded-md">
          Current Language: {selectedLanguage.toUpperCase()}
        </div>
      )}
    </div>
  );
}

export default App;