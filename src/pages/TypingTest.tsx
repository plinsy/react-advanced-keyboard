import { useState, useRef } from 'react'
import { Keyboard } from '../components/Keyboard'

export function TypingTest() {
  const [value, setValue] = useState('')
  const [testResults, setTestResults] = useState<string[]>([])
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  const handleKeyPress = (key: string) => {
    console.log('Key pressed:', key)
  }

  const runRapidTypingTest = () => {
    // Clear the textarea first
    setValue('')
    setTestResults([])
    
    // Simulate rapid typing of "ty" sequence
    setTimeout(() => {
      console.log('Simulating rapid typing: t then y')
      setTestResults(prev => [...prev, 'Starting rapid typing test: t then y'])
      
      // Simulate pressing 't' then 'y' very quickly
      handleKeyPress('t')
      setTimeout(() => handleKeyPress('y'), 10) // 10ms delay to simulate very fast typing
      
      setTimeout(() => {
        setTestResults(prev => [...prev, `Result: "${value}"`])
        setTestResults(prev => [...prev, value === 'ty' ? '✅ PASS: Characters in correct order' : '❌ FAIL: Characters out of order'])
      }, 100)
    }, 100)
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <header className="text-center mb-8">
          <h1 className="text-3xl font-bold mb-2 text-gray-900 dark:text-white">
            Rapid Typing Test
          </h1>
          <p className="text-gray-600 dark:text-gray-300 mb-4">
            Test keyboard behavior with rapid key presses
          </p>
        </header>

        {/* Test Controls */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg mb-6 p-6">
          <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">
            Rapid Typing Test
          </h2>
          <p className="text-gray-600 dark:text-gray-300 mb-4">
            This test simulates typing 't' followed quickly by 'y'. The characters should appear in the correct order.
          </p>
          <button
            onClick={runRapidTypingTest}
            className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg font-medium"
          >
            Run Rapid Typing Test
          </button>
          
          {testResults.length > 0 && (
            <div className="mt-4 p-4 bg-gray-100 dark:bg-gray-700 rounded-lg">
              <h3 className="font-semibold mb-2 text-gray-900 dark:text-white">Test Results:</h3>
              {testResults.map((result, index) => (
                <div key={index} className="text-sm text-gray-700 dark:text-gray-300 font-mono">
                  {result}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Manual Testing Instructions */}
        <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4 mb-6">
          <h3 className="font-semibold text-yellow-800 dark:text-yellow-200 mb-2">
            Manual Testing Instructions
          </h3>
          <p className="text-yellow-700 dark:text-yellow-300 text-sm">
            1. Focus on the text area below<br/>
            2. Type 't' and 'y' very quickly using your physical keyboard<br/>
            3. Observe that the characters appear in the correct order (ty, not yt)
          </p>
        </div>

        {/* Text Input Area */}
        <div className="relative bg-white dark:bg-gray-800 rounded-lg shadow-lg mb-6">
          <textarea
            ref={textareaRef}
            value={value}
            onChange={(e) => setValue(e.target.value)}
            className="w-full h-40 px-4 py-6 text-lg border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white resize-none font-mono focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Type here to test rapid keyboard input..."
          />

          <div className="absolute top-2 right-2 text-sm text-gray-500 dark:text-gray-400">
            {value.length} characters
          </div>
          
          <div className="absolute bottom-2 left-2 text-sm text-gray-500 dark:text-gray-400">
            Current value: "{value}"
          </div>
        </div>

        {/* Virtual Keyboard */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg">
          <Keyboard
            value={value}
            onChange={setValue}
            enableAutocomplete={false}
            theme="light"
            showNumbers={true}
            onKeyPress={handleKeyPress}
            inputRef={textareaRef}
          />
        </div>
      </div>
    </div>
  )
}
