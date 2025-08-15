import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Keyboard } from '../components/Keyboard'
import type { AutocompleteSuggestion } from '../types'

export function Demo() {
  const [value, setValue] = useState('')

  // Simple autocomplete suggestions for demo
  const getSuggestions = async (
    input: string
  ): Promise<AutocompleteSuggestion[]> => {
    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 150))

    const commonWords = [
      'the',
      'hello',
      'world',
      'react',
      'typescript',
      'javascript',
      'keyboard',
      'component',
      'demo',
      'test',
      'example',
      'awesome',
      'amazing',
      'beautiful',
      'coding',
      'programming',
      'development',
      'software',
      'application',
      'interface',
      'user',
      'experience',
      'design',
      'modern',
      'advanced',
      'simple',
      'easy',
      'quick',
      'fast',
      'efficient',
      'powerful',   
      'flexible',
      'customizable'
    ]

    const lastWord = input.split(' ').pop()?.toLowerCase() || ''
    if (lastWord.length < 2) return []

    return commonWords
      .filter((word) => word.startsWith(lastWord))
      .slice(0, 5)
      .map((word) => ({
        text: word,
        confidence: Math.random() * 0.4 + 0.6
      }))
  }

  const handleKeyPress = (key: string) => {
    console.log('Key pressed:', key)
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <header className="text-center mb-8">
          <h1 className="text-3xl font-bold mb-2 text-gray-900 dark:text-white">
            React Advanced Keyboard Demo
          </h1>
          <p className="text-gray-600 dark:text-gray-300 mb-4">
            Simple keyboard test with autocomplete
          </p>
        </header>

        {/* Text Input Area */}
        <div className="relative bg-white dark:bg-gray-800 rounded-lg shadow-lg mb-6">
          <textarea
            value={value}
            onChange={(e) => setValue(e.target.value)}
            className="w-full h-40 px-4 py-6 text-lg border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white resize-none font-mono focus:outline-none focus:ring-0"
            placeholder="Click on the virtual keyboard below to start typing..."
          />

          <div className="absolute top-2 right-2 text-sm text-gray-500 dark:text-gray-400">
            {value.length} characters
          </div>
        </div>

        {/* Virtual Keyboard */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg">
          <Keyboard
            value={value}
            onChange={setValue}
            enableAutocomplete={true}
            getSuggestions={getSuggestions}
            maxSuggestions={5}
            theme="light"
            showNumbers={true}
            onKeyPress={handleKeyPress}
          />
        </div>
      </div>
    </div>
  )
}
