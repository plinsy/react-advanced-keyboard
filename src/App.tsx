import React, { useState } from 'react';
import { Keyboard } from './components/Keyboard';
import { qwertyLayout, compactLayout, numberPadLayout } from './layouts';
import type { AutocompleteSuggestion } from './types';
import './index.css';

function App() {
  const [value, setValue] = useState('');
  const [selectedLayout, setSelectedLayout] = useState<'qwerty' | 'compact' | 'numberpad'>('qwerty');
  const [theme, setTheme] = useState<'light' | 'dark'>('light');
  const [enableAutocomplete, setEnableAutocomplete] = useState(true);
  const [showNumbers, setShowNumbers] = useState(true);

  const layouts = {
    qwerty: qwertyLayout,
    compact: compactLayout,
    numberpad: numberPadLayout,
  };

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

  return (
    <div className={`min-h-screen p-8 ${theme === 'dark' ? 'bg-gray-900 text-white' : 'bg-gray-50'}`}>
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8 text-center">
          React Advanced Keyboard Demo
        </h1>

        {/* Controls */}
        <div className="bg-white rounded-lg p-6 mb-6 shadow-lg">
          <h2 className="text-xl font-semibold mb-4">Controls</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Layout Selector */}
            <div>
              <label className="block text-sm font-medium mb-2">Layout</label>
              <select 
                value={selectedLayout}
                onChange={(e) => setSelectedLayout(e.target.value as any)}
                className="w-full p-2 border border-gray-300 rounded"
              >
                <option value="qwerty">QWERTY</option>
                <option value="compact">Compact</option>
                <option value="numberpad">Number Pad</option>
              </select>
            </div>

            {/* Theme Selector */}
            <div>
              <label className="block text-sm font-medium mb-2">Theme</label>
              <select 
                value={theme}
                onChange={(e) => setTheme(e.target.value as any)}
                className="w-full p-2 border border-gray-300 rounded"
              >
                <option value="light">Light</option>
                <option value="dark">Dark</option>
              </select>
            </div>

            {/* Autocomplete Toggle */}
            <div>
              <label className="block text-sm font-medium mb-2">
                <input
                  type="checkbox"
                  checked={enableAutocomplete}
                  onChange={(e) => setEnableAutocomplete(e.target.checked)}
                  className="mr-2"
                />
                Autocomplete
              </label>
            </div>

            {/* Numbers Toggle */}
            <div>
              <label className="block text-sm font-medium mb-2">
                <input
                  type="checkbox"
                  checked={showNumbers}
                  onChange={(e) => setShowNumbers(e.target.checked)}
                  className="mr-2"
                />
                Show Numbers
              </label>
            </div>
          </div>
        </div>

        {/* Input Display */}
        <div className="bg-white rounded-lg p-6 mb-6 shadow-lg">
          <h2 className="text-xl font-semibold mb-4">Input Value</h2>
          <div className="p-4 bg-gray-100 rounded border min-h-[100px] font-mono whitespace-pre-wrap">
            {value || 'Start typing with the virtual keyboard below...'}
          </div>
          <div className="mt-4 flex gap-2">
            <button
              onClick={() => setValue('')}
              className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
            >
              Clear
            </button>
            <span className="text-sm text-gray-500 flex items-center">
              Length: {value.length} characters
            </span>
          </div>
        </div>

        {/* Keyboard */}
        <div className="bg-white rounded-lg p-6 shadow-lg">
          <h2 className="text-xl font-semibold mb-4">Virtual Keyboard</h2>
          
          <Keyboard
            value={value}
            onChange={setValue}
            layout={layouts[selectedLayout]}
            enableAutocomplete={enableAutocomplete}
            getSuggestions={getSuggestions}
            maxSuggestions={5}
            theme={theme}
            showNumbers={showNumbers}
            onKeyPress={(key) => console.log('Key pressed:', key)}
          />
        </div>

        {/* Instructions */}
        <div className="mt-6 bg-blue-50 rounded-lg p-6">
          <h3 className="text-lg font-semibold mb-2 text-blue-800">Instructions</h3>
          <ul className="text-blue-700 space-y-1">
            <li>• Click on virtual keys to type</li>
            <li>• Use your physical keyboard for input (when focused)</li>
            <li>• Autocomplete suggestions appear as you type</li>
            <li>• Use ↑/↓ arrow keys to navigate suggestions</li>
            <li>• Press Enter to accept a suggestion</li>
            <li>• Press Escape to hide suggestions</li>
            <li>• Try different layouts and themes</li>
          </ul>
        </div>
      </div>
    </div>
  );
}

export default App;
