import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Keyboard } from '../components/Keyboard';

export function BackspaceDemo() {
  const [value, setValue] = useState('This is a test text. Try selecting some text and pressing backspace. You can also long-press backspace to delete progressively.');
  const [selection, setSelection] = useState({ start: 0, end: 0 });

  const handleValueChange = (newValue: string) => {
    setValue(newValue);
  };

  const handleSelectionChange = (newSelection: { start: number; end: number }) => {
    setSelection(newSelection);
  };

  const handleSelectText = (start: number, end: number) => {
    setSelection({ start, end });
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto">
        <div className="mb-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                Enhanced Backspace Demo
              </h1>
              <p className="text-gray-600">
                Test the enhanced backspace functionality with text selection and long-press progressive deletion.
              </p>
            </div>
            <Link 
              to="/"
              className="inline-flex items-center px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors"
            >
              ← Back to Main Demo
            </Link>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
          <div className="mb-4">
            <h2 className="text-xl font-semibold mb-2">Features to Test:</h2>
            <ul className="list-disc list-inside text-gray-700 space-y-1">
              <li>
                <strong>Long Press Backspace:</strong> Hold down the backspace key for progressive deletion
              </li>
              <li>
                <strong>Selection Deletion:</strong> Select text using the buttons below and press backspace
              </li>
              <li>
                <strong>Normal Backspace:</strong> Single press deletes one character at a time
              </li>
              <li>
                <strong>Keyboard Shortcuts:</strong> Ctrl+A to select all, Ctrl+C to copy, Ctrl+V to paste
              </li>
            </ul>
          </div>

          <div className="mb-4">
            <h3 className="text-lg font-medium mb-2">Text Selection Helper:</h3>
            <div className="flex flex-wrap gap-2 mb-2">
              <button
                onClick={() => handleSelectText(0, 4)}
                className="px-3 py-1 bg-blue-500 text-white rounded text-sm hover:bg-blue-600"
              >
                Select "This"
              </button>
              <button
                onClick={() => handleSelectText(5, 15)}
                className="px-3 py-1 bg-blue-500 text-white rounded text-sm hover:bg-blue-600"
              >
                Select "is a test"
              </button>
              <button
                onClick={() => handleSelectText(16, 21)}
                className="px-3 py-1 bg-blue-500 text-white rounded text-sm hover:bg-blue-600"
              >
                Select "text."
              </button>
              <button
                onClick={() => handleSelectText(0, value.length)}
                className="px-3 py-1 bg-green-500 text-white rounded text-sm hover:bg-green-600"
              >
                Select All
              </button>
              <button
                onClick={() => handleSelectText(0, 0)}
                className="px-3 py-1 bg-gray-500 text-white rounded text-sm hover:bg-gray-600"
              >
                Clear Selection
              </button>
            </div>
            <p className="text-sm text-gray-600">
              Current selection: {selection.start} - {selection.end}
              {selection.start !== selection.end && (
                <span className="font-medium">
                  {' '}("{value.substring(selection.start, selection.end)}")
                </span>
              )}
            </p>
          </div>

          <div className="mb-4">
            <h3 className="text-lg font-medium mb-2">Current Text:</h3>
            <div className="p-3 bg-gray-100 border rounded font-mono text-sm min-h-[60px] whitespace-pre-wrap">
              {value.split('').map((char, index) => {
                const isSelected = index >= selection.start && index < selection.end;
                return (
                  <span
                    key={index}
                    className={isSelected ? 'bg-blue-200' : ''}
                  >
                    {char}
                  </span>
                );
              })}
              <span
                className={selection.start === value.length ? 'border-l-2 border-blue-500' : ''}
              />
            </div>
          </div>

          <div className="mb-4">
            <h3 className="text-lg font-medium mb-2">Virtual Keyboard:</h3>
            <Keyboard
              value={value}
              onChange={handleValueChange}
              selection={selection}
              onSelectionChange={handleSelectionChange}
              enableAutocomplete={false}
              theme="light"
              className="border rounded-lg p-4 bg-gray-50"
            />
          </div>

          <div className="text-sm text-gray-600">
            <h3 className="font-medium mb-1">Instructions:</h3>
            <ol className="list-decimal list-inside space-y-1">
              <li>Use the selection buttons above to select different parts of the text</li>
              <li>Press backspace on the virtual keyboard to delete selected text</li>
              <li>Long-press the backspace key to see progressive deletion</li>
              <li>Try typing new text to replace selections</li>
              <li>Use keyboard shortcuts like Ctrl+A, Ctrl+C, Ctrl+V</li>
            </ol>
          </div>
        </div>
      </div>
    </div>
  );
}
