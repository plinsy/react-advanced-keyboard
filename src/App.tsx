import { useState } from 'react';
import { Keyboard } from './components/Keyboard';
import { KeyboardConfigurator } from './components/KeyboardConfigurator';
import { numberPadLayout, arrowKeysLayout } from './layouts';
import { detectPlatform, getDefaultConfig, getRecommendedLayout } from './keyboardUtils';
import type { AutocompleteSuggestion, KeyboardConfig, KeyboardLayout } from './types';
import './index.css';

function App() {
  const [value, setValue] = useState('');
  const [theme, setTheme] = useState<'light' | 'dark'>('light');
  const [enableAutocomplete, setEnableAutocomplete] = useState(true);
  
  // Auto-detect platform and set default config
  const detectedPlatform = detectPlatform();
  const defaultConfig = getDefaultConfig(detectedPlatform);
  
  // Keyboard configuration state
  const [config, setConfig] = useState<KeyboardConfig>(defaultConfig);
  
  const [currentLayout, setCurrentLayout] = useState<KeyboardLayout>(() => 
    getRecommendedLayout(defaultConfig)
  );
  const [showNumbers, setShowNumbers] = useState(true);

  // Custom suggestions example
  const customSuggestions: AutocompleteSuggestion[] = [
    { text: 'react', confidence: 0.9 },
    { text: 'typescript', confidence: 0.85 },
    { text: 'javascript', confidence: 0.8 },
    { text: 'keyboard', confidence: 0.75 },
    { text: 'component', confidence: 0.7 },
  ];

  // Async suggestions example
  const getSuggestions = async (input: string): Promise<AutocompleteSuggestion[]> => {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 200));
    
    const mockApiSuggestions = [
      'amazing', 'awesome', 'application', 'algorithm', 'animation',
      'beautiful', 'brilliant', 'building', 'business', 'browser',
      'creative', 'component', 'computer', 'coding', 'custom',
      'development', 'design', 'digital', 'dynamic', 'data',
    ];

    const lastWord = input.split(' ').pop()?.toLowerCase() || '';
    if (!lastWord) return [];

    return mockApiSuggestions
      .filter(word => word.startsWith(lastWord))
      .slice(0, 5)
      .map(word => ({ text: word, confidence: Math.random() * 0.5 + 0.5 }));
  };

  const handleKeyPress = (key: string) => {
    console.log('Key pressed:', key);
  };

  return (
    <div className={`min-h-screen p-4 ${theme === 'dark' ? 'bg-gray-900 text-white' : 'bg-gray-50'}`}>
      <div className="max-w-7xl mx-auto">
        <header className="text-center mb-8">
          <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Advanced React Keyboard Demo
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-300">
            A configurable virtual keyboard with full PC/Mac support, multiple layouts, and autocomplete
          </p>
        </header>

        {/* Main Input Area */}
        <div className="mb-8">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-lg">
            <h2 className="text-2xl font-semibold mb-4 text-center">Type Here</h2>
            <div className="max-w-4xl mx-auto">
              <textarea
                value={value}
                onChange={(e) => setValue(e.target.value)}
                className="w-full h-32 p-4 text-lg border border-gray-300 dark:border-gray-600 rounded-lg 
                         bg-gray-50 dark:bg-gray-700 focus:ring-2 focus:ring-blue-500 focus:border-blue-500
                         resize-none font-mono"
                placeholder="Start typing with the virtual keyboard below, or use your physical keyboard..."
              />
              <div className="flex justify-between items-center mt-4">
                <div className="flex gap-4">
                  <button
                    onClick={() => setValue('')}
                    className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
                  >
                    Clear
                  </button>
                  <button
                    onClick={() => setValue('Hello World! This is a demo of the advanced keyboard component.')}
                    className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                  >
                    Sample Text
                  </button>
                </div>
                <div className="text-sm text-gray-500 dark:text-gray-400">
                  Characters: {value.length} | Words: {value.trim().split(/\s+/).filter(w => w.length > 0).length}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Keyboard Configurator */}
        <div className="mb-8">
          <KeyboardConfigurator
            config={config}
            onConfigChange={setConfig}
            currentLayout={currentLayout}
            onLayoutChange={setCurrentLayout}
          />
        </div>

        {/* Settings */}
        <div className="mb-8">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-lg">
            <h2 className="text-xl font-semibold mb-4">Display Settings</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {/* Theme Selector */}
              <div>
                <label className="block text-sm font-medium mb-2">Theme</label>
                <select 
                  value={theme}
                  onChange={(e) => setTheme(e.target.value as any)}
                  className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg 
                           bg-white dark:bg-gray-700 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="light">Light</option>
                  <option value="dark">Dark</option>
                </select>
              </div>

              {/* Autocomplete Toggle */}
              <div>
                <label className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={enableAutocomplete}
                    onChange={(e) => setEnableAutocomplete(e.target.checked)}
                    className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                  />
                  <span className="text-sm font-medium">Enable Autocomplete</span>
                </label>
              </div>

              {/* Numbers Toggle */}
              <div>
                <label className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={showNumbers}
                    onChange={(e) => setShowNumbers(e.target.checked)}
                    className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                  />
                  <span className="text-sm font-medium">Show Number Row</span>
                </label>
              </div>
            </div>
          </div>
        </div>

        {/* Virtual Keyboard */}
        <div className="mb-8">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-lg">
            <h2 className="text-xl font-semibold mb-4">Virtual Keyboard</h2>
            
            <Keyboard
              value={value}
              onChange={setValue}
              layout={currentLayout}
              config={config}
              enableAutocomplete={enableAutocomplete}
              getSuggestions={getSuggestions}
              maxSuggestions={5}
              theme={theme}
              showNumbers={showNumbers}
              onKeyPress={handleKeyPress}
            />
          </div>
        </div>

        {/* Additional Keyboards */}
        {config.showNumpad && (
          <div className="mb-8">
            <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-lg">
              <h2 className="text-xl font-semibold mb-4">Number Pad</h2>
              <Keyboard
                value={value}
                onChange={setValue}
                layout={numberPadLayout}
                enableAutocomplete={false}
                theme={theme}
                onKeyPress={handleKeyPress}
              />
            </div>
          </div>
        )}

        {config.showArrowKeys && (
          <div className="mb-8">
            <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-lg">
              <h2 className="text-xl font-semibold mb-4">Arrow Keys</h2>
              <Keyboard
                value={value}
                onChange={setValue}
                layout={arrowKeysLayout}
                enableAutocomplete={false}
                theme={theme}
                onKeyPress={handleKeyPress}
              />
            </div>
          </div>
        )}

        {/* Instructions */}
        <div className="mb-8">
          <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-6">
            <h3 className="text-lg font-semibold mb-4 text-blue-800 dark:text-blue-300">
              How to Use
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-medium mb-2 text-blue-700 dark:text-blue-400">Virtual Keyboard</h4>
                <ul className="text-blue-600 dark:text-blue-300 space-y-1 text-sm">
                  <li>• Click on virtual keys to type</li>
                  <li>• Function keys (F1-F12) for system commands</li>
                  <li>• Modifier keys (Ctrl, Alt, Shift, etc.)</li>
                  <li>• Full symbol support with Shift combinations</li>
                  <li>• Platform-specific layouts (Windows/Mac)</li>
                </ul>
              </div>
              <div>
                <h4 className="font-medium mb-2 text-blue-700 dark:text-blue-400">Features</h4>
                <ul className="text-blue-600 dark:text-blue-300 space-y-1 text-sm">
                  <li>• Real-time autocomplete suggestions</li>
                  <li>• QWERTY, AZERTY, and other layouts</li>
                  <li>• Configurable keyboard sections</li>
                  <li>• Physical keyboard integration</li>
                  <li>• Light/Dark theme support</li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <footer className="text-center text-gray-500 dark:text-gray-400">
          <p>Advanced React Keyboard Component Demo • Built with React & TypeScript</p>
        </footer>
      </div>
    </div>
  );
}

export default App;
