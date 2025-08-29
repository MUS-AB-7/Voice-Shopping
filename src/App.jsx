import { useState } from "react";
import useShoppingAssistant from "./hooks/useShoppingAssistant";
import ShoppingList from "./components/ShoppingList";
import StatusBar from "./components/StatusBar";
import Controls from "./components/Controls";
import Suggestions from "./components/Suggestions";
import SearchResults from "./components/SearchResults";

function App() {
  const [language, setLanguage] = useState("en-IN");
  const {
    shoppingList,
    suggestions,
    searchResults,
    listening,
    loading,
    error,
    command,
    transcript,
    browserSupportsSpeechRecognition,
    startListening,
    stopListening,
    clearAll,
  } = useShoppingAssistant(language);

  if (!browserSupportsSpeechRecognition) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <span className="text-red-500 font-bold text-lg">
          Browser doesn't support speech recognition.
        </span>
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-center p-4 font-sans text-white bg-subtle">
      
      <div className="w-full max-w-5xl h-[85vh] max-h-[800px]
                      bg-black/20 backdrop-blur-xl border border-white/10 rounded-3xl shadow-2xl
                      flex flex-col overflow-hidden">
        
        <header className="flex-shrink-0 p-6 text-center border-b border-white/10">
          <h1 className="text-3xl md:text-4xl font-bold tracking-wider text-brand-primary">
            Voice Shopping Assistant
          </h1>
          <p className="text-muted mt-2 text-base">
            A smarter way to build your shopping list.
          </p>
        </header>

        <div className="flex flex-col items-center p-4 border-b border-white/10">
          <Controls
            startListening={startListening}
            stopListening={stopListening}
            clearAll={clearAll}
            listening={listening}
          />
          <StatusBar
            listening={listening}
            loading={loading}
            error={error}
            transcript={transcript}
            command={command}
          />
          <div className="flex justify-center mt-4">
            <label className="mr-2 font-medium self-center text-muted">🌐</label>
            <select
              value={language}
              onChange={(e) => setLanguage(e.target.value)}
              className="border border-gray-300 text-black p-2 rounded-lg shadow-sm focus:ring-2 focus:ring-brand-secondary"
            >
              <option value="en-IN">English (India)</option>
              <option value="en-US">English (US)</option>
              <option value="hi-IN">Hindi</option>
              <option value="fr-FR">French</option>
              <option value="es-ES">Spanish</option>
            </select>
          </div>
        </div>

        <main className="flex-grow grid grid-cols-1 lg:grid-cols-3 gap-6 p-6 overflow-y-auto">
          <div className="lg:col-span-2">
            <ShoppingList items={shoppingList} />
          </div>

          <aside className="space-y-6">
            <Suggestions suggestions={suggestions} />
            <SearchResults results={searchResults} />
          </aside>
        </main>
      </div>
    </div>
  );
}

export default App;
  