# React Advanced Keyboard

[![npm version](https://badge.fury.io/js/react-advanced-keyboard.svg)](https://badge.fury.io/js/react-advanced-keyboard)
[![TypeScript](https://img.shields.io/badge/%3C%2F%3E-TypeScript-%230074c1.svg)](http://www.typescriptlang.org/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

A highly configurable virtual keyboard component for React with comprehensive layout support, autocomplete functionality, and platform-specific customization.

## 🚀 Quick Start

```bash
npm install react-advanced-keyboard
# or
pnpm add react-advanced-keyboard
```

```tsx
import { Keyboard } from 'react-advanced-keyboard';

function App() {
  const [value, setValue] = useState('');

  return (
    <Keyboard
      value={value}
      onChange={setValue}
      layout="qwerty"
      showAutocomplete
    />
  );
}
```

## 🚀 Features

### 📱 Platform Support
- **Windows/PC layouts** with full modifier key support (Ctrl, Win, Alt, etc.)
- **Mac layouts** with proper symbol representations (⌘, ⌥, ⌃)
- **Universal layouts** for cross-platform compatibility

### ⌨️ Keyboard Layouts
- **QWERTY** (English) - Full and compact versions
- **AZERTY** (French) - Full Windows layout
- **Dvorak** (Planned)
- **Number Pad** - Dedicated numeric input
- **Arrow Keys** - Navigation controls
- **Function Keys** (F1-F12) with system integration

### 🎨 Customization Options
- **Theme Support** - Light and Dark modes
- **Configurable Sections**:
  - Function keys (F1-F12)
  - Modifier keys (Ctrl, Alt, Shift, etc.)
  - Number pad
  - Arrow keys
  - Number row
- **Key Types**:
  - Letters with proper capitalization
  - Numbers with symbol combinations (Shift + number)
  - Special characters and symbols
  - Modifier keys with platform-specific labels
  - Function keys

### 🔧 Advanced Features
- **Real-time Autocomplete** with async suggestion loading
- **Physical Keyboard Integration** - Works alongside virtual keyboard
- **Keyboard Shortcuts** - Full support for Ctrl+A, Ctrl+C, Ctrl+V, Ctrl+Z, Ctrl+Y
- **Enhanced Deletion**:
  - **Long-press Backspace/Delete** - Hold to delete continuously with progressive acceleration
  - **Word-level deletion** - Ctrl+Backspace deletes words before cursor, Ctrl+Delete deletes words after cursor
  - **Selection deletion** - Delete entire text selections instantly
  - **Visual feedback** - Deletion keys pulse red during long-press operations
- **Modifier Key State** - Visual indication when Ctrl, Alt, Shift are active
- **Smart Key Handling** - Modifier keys don't print text, only trigger actions
- **Shift Key Support** - Proper symbol combinations (e.g., Shift + 1 = !)
- **Caps Lock Support** - Toggle capitalization
- **Key Press Animations** - Visual feedback
- **Rapid Typing Support** - Fixed race conditions for fast typing (characters appear in correct order)
- **TypeScript Support** - Full type safety
- **Responsive Design** - Works on all screen sizes

## 🐛 Recent Fixes

### Fast Typing Character Order Issue
Fixed an issue where typing very quickly (like pressing 't' then 'y' rapidly) would sometimes cause characters to appear in the wrong order (e.g., "yt" instead of "ty"). This was caused by race conditions in state updates. The fix uses atomic state updates to ensure characters always appear in the correct sequence.

### Enhanced Backspace & Delete Functionality
- **Progressive acceleration**: Long-press deletion starts slow and speeds up for better control
- **Word-level deletion**: Ctrl+Backspace/Delete for deleting entire words
- **Visual feedback**: Keys pulse red during long-press operations
- **Improved selection handling**: Better text selection deletion behavior
- **Delete key support**: Full delete functionality with forward deletion

## 📦 Installation

```bash
npm install react-advanced-keyboard
# or
yarn add react-advanced-keyboard
# or
pnpm add react-advanced-keyboard
```

## 🎯 Quick Start

```tsx
import React, { useState } from 'react';
import { Keyboard } from 'react-advanced-keyboard';
// Import styles
import 'react-advanced-keyboard/styles';

function App() {
  const [value, setValue] = useState('');

  return (
    <div>
      <input value={value} onChange={(e) => setValue(e.target.value)} />
      <Keyboard
        value={value}
        onChange={setValue}
        layout="qwerty"
        theme="light"
        enableAutocomplete={true}
      />
    </div>
  );
}
```

### Alternative: Manual CSS Import

If you prefer to import CSS separately:

```tsx
import { Keyboard } from 'react-advanced-keyboard';
// Import CSS file manually
import 'react-advanced-keyboard/dist/react-advanced-keyboard.css';
```

## 🔧 Configuration

### Basic Props

```tsx
interface KeyboardProps {
  value?: string;                    // Current input value
  onChange?: (value: string) => void; // Value change handler
  onKeyPress?: (key: string) => void; // Key press handler
  onShortcut?: (shortcut: string, currentValue: string) => void; // Keyboard shortcut handler
  layout?: KeyboardLayout;           // Keyboard layout
  config?: KeyboardConfig;           // Keyboard configuration
  theme?: 'light' | 'dark';          // Theme
  enableAutocomplete?: boolean;      // Enable autocomplete
  showNumbers?: boolean;             // Show number row
  disabled?: boolean;                // Disable keyboard
}
```

### Keyboard Configuration

```tsx
interface KeyboardConfig {
  layout: 'qwerty' | 'azerty' | 'dvorak';
  platform: 'windows' | 'mac';
  showFunctionKeys: boolean;
  showModifierKeys: boolean;
  showNumpad: boolean;
  showArrowKeys: boolean;
}
```

### Available Layouts

```tsx
import {
  qwertyWindowsLayout,    // Full QWERTY for Windows
  qwertyMacLayout,        // Full QWERTY for Mac
  azertyWindowsLayout,    // Full AZERTY for Windows
  qwertyLayout,           // Compact QWERTY
  compactLayout,          // Ultra-compact layout
  numberPadLayout,        // Number pad only
  arrowKeysLayout,        // Arrow keys only
} from 'react-advanced-keyboard/layouts';
```

## 📋 Examples

### Platform-Specific Setup

```tsx
import { detectPlatform, getDefaultConfig, getRecommendedLayoutFromConfig } from 'react-advanced-keyboard/utils';

function SmartKeyboard() {
  const platform = detectPlatform(); // Auto-detect Mac/Windows
  const config = getDefaultConfig(platform);
  const layout = getRecommendedLayoutFromConfig(config);

  return (
    <Keyboard
      layout={layout}
      config={config}
      theme="light"
    />
  );
}
```

### With Autocomplete

```tsx
const getSuggestions = async (input: string) => {
  const response = await fetch(`/api/suggestions?q=${input}`);
  return response.json();
};

<Keyboard
  enableAutocomplete={true}
  getSuggestions={getSuggestions}
  maxSuggestions={5}
/>
```

### Custom Configuration

```tsx
const customConfig = {
  layout: 'qwerty',
  platform: 'windows',
  showFunctionKeys: true,
  showModifierKeys: true,
  showNumpad: false,
  showArrowKeys: true,
};

<Keyboard config={customConfig} />
```

### Theme Support

```tsx
// Light theme
<Keyboard theme="light" />

// Dark theme  
<Keyboard theme="dark" />

// With custom CSS classes
<Keyboard 
  theme="dark"
  className="my-custom-keyboard" 
/>
```

### Keyboard Shortcuts

The component supports common keyboard shortcuts when Ctrl modifier is pressed:

```tsx
function MyApp() {
  const [value, setValue] = useState('');

  const handleShortcut = (shortcut: string, currentValue: string) => {
    switch (shortcut) {
      case 'selectAll':
        // Handle Ctrl+A - Select all text
        console.log('Select all triggered');
        break;
      case 'copy':
        // Handle Ctrl+C - Copy to clipboard
        console.log('Copy triggered');
        break;
      case 'paste':
        // Handle Ctrl+V - Paste from clipboard
        console.log('Paste triggered');
        break;
      case 'undo':
        // Handle Ctrl+Z - Undo
        console.log('Undo triggered');
        break;
      case 'redo':
        // Handle Ctrl+Y - Redo
        console.log('Redo triggered');
        break;
    }
  };

  return (
    <Keyboard
      value={value}
      onChange={setValue}
      onShortcut={handleShortcut}
    />
  );
}
```

### Long-press Functionality

- **Backspace Key**: Hold down the backspace key (mouse or touch) to continuously delete characters
- **Auto-repeat**: After 500ms, backspace will repeat every 100ms until released
- **Touch Support**: Works on both desktop (mouse) and mobile (touch) devices

## 🎨 Styling

The component uses CSS modules and supports custom styling:

```css
/* Custom key styling */
.keyboard-key[data-type="function"] {
  background-color: #fef3c7;
  border-color: #f59e0b;
}

.keyboard-key[data-type="modifier"] {
  background-color: #dcfce7;
  border-color: #16a34a;
}
```

## 🌍 Internationalization

### AZERTY (French) Layout

```tsx
import { azertyWindowsLayout } from 'react-advanced-keyboard/layouts';

<Keyboard layout={azertyWindowsLayout} />
```

### Custom Layout Creation

```tsx
const customLayout: KeyboardLayout = {
  name: 'Custom Layout',
  type: 'qwerty',
  platform: 'universal',
  rows: [
    [
      { key: 'q', type: 'letter' },
      { key: 'w', type: 'letter' },
      // ... more keys
    ],
    // ... more rows
  ],
};
```

## 🔧 Key Types

- `letter` - Standard letters (a-z)
- `number` - Numbers (0-9) with shift combinations
- `special` - Special characters (punctuation, symbols)
- `modifier` - Modifier keys (Ctrl, Alt, Shift, etc.)
- `function` - Function keys (F1-F12, Esc)
- `space` - Space bar
- `enter` - Enter key
- `backspace` - Backspace key
- `shift` - Shift key with toggle state

## 📱 Mobile Support

The keyboard is fully responsive and supports touch interactions:

```tsx
// Touch-friendly configuration
<Keyboard
  layout={compactLayout}  // Use compact layout for mobile
  theme="light"
  showNumbers={true}
/>
```

## 🔌 Integration Examples

### With Form Libraries

```tsx
// React Hook Form
import { useController } from 'react-hook-form';

function FormKeyboard({ control, name }) {
  const { field } = useController({ control, name });
  
  return (
    <Keyboard
      value={field.value}
      onChange={field.onChange}
    />
  );
}

// Formik
<Field name="message">
  {({ field, form }) => (
    <Keyboard
      value={field.value}
      onChange={(value) => form.setFieldValue(field.name, value)}
    />
  )}
</Field>
```

### With State Management

```tsx
// Redux
const dispatch = useDispatch();
const value = useSelector(state => state.input.value);

<Keyboard
  value={value}
  onChange={(newValue) => dispatch(updateInput(newValue))}
/>

// Zustand
const { value, setValue } = useInputStore();

<Keyboard value={value} onChange={setValue} />
```

## 🛠️ Development

### Setup

```bash
git clone https://github.com/yourusername/react-advanced-keyboard
cd react-advanced-keyboard
npm install
npm run dev
```

### Building

```bash
npm run build    # Build library
npm run preview  # Preview build
```

### Testing

The demo application is available at http://localhost:5175 when running `npm run dev`.

## 📄 API Reference

### Components

- `<Keyboard />` - Main keyboard component
- `<KeyboardConfigurator />` - Configuration UI
- `<Key />` - Individual key component
- `<Autocomplete />` - Autocomplete suggestions

### Hooks

- `useKeyboard()` - Keyboard state management

### Utilities

- `detectPlatform()` - Auto-detect user platform
- `getDefaultConfig()` - Get default configuration
- `getRecommendedLayoutFromConfig()` - Get recommended layout
- `createCustomConfig()` - Create custom configuration

## 🤝 Contributing

Contributions are welcome! Please read our [Contributing Guide](CONTRIBUTING.md) for details.

### Adding New Layouts

```tsx
// 1. Define the layout
export const myCustomLayout: KeyboardLayout = {
  name: 'My Custom Layout',
  type: 'custom',
  platform: 'universal',
  rows: [
    // Define your key rows
  ],
};

// 2. Add to available layouts
export const availableLayouts = {
  // ... existing layouts
  myCustom: myCustomLayout,
};
```

## 📊 Browser Support

- Chrome/Edge 88+
- Firefox 85+
- Safari 14+
- Mobile Safari 14+
- Chrome Android 88+

## 📝 License

MIT License - see [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Inspired by modern virtual keyboard implementations
- Built with React, TypeScript, and Tailwind CSS
- Uses class-variance-authority for component variants

## 📞 Support

- 🐛 Issues: [GitHub Issues](https://github.com/yourusername/react-advanced-keyboard/issues)
- 💬 Discussions: [GitHub Discussions](https://github.com/yourusername/react-advanced-keyboard/discussions)

---

Made with ❤️ by the React Advanced Keyboard team
  });

  // Custom implementation
}
```

## 🎨 Layouts

### Built-in Layouts

```tsx
import { qwertyLayout, compactLayout, numberPadLayout } from 'react-advanced-keyboard';

// Full QWERTY layout with numbers
<Keyboard layout={qwertyLayout} />

// Compact layout without number row
<Keyboard layout={compactLayout} />

// Number pad only
<Keyboard layout={numberPadLayout} />
```

### Custom Layouts

```tsx
import { KeyboardLayout } from 'react-advanced-keyboard';

const customLayout: KeyboardLayout = {
  rows: [
    [
      { key: 'q', type: 'letter' },
      { key: 'w', type: 'letter' },
      { key: 'e', type: 'letter' },
      // ... more keys
    ],
    // ... more rows
  ],
};

<Keyboard layout={customLayout} />
```

## 🧠 Autocomplete

### Default Autocomplete

The component includes built-in English word suggestions:

```tsx
<Keyboard enableAutocomplete={true} maxSuggestions={5} />
```

### Custom Suggestions

Provide your own suggestion list:

```tsx
const customSuggestions = [
  { text: 'react', confidence: 0.9 },
  { text: 'typescript', confidence: 0.85 },
  { text: 'javascript', confidence: 0.8 },
];

<Keyboard suggestions={customSuggestions} />
```

### Async Suggestions

Fetch suggestions from an API:

```tsx
const getSuggestions = async (input: string) => {
  const response = await fetch(`/api/suggestions?q=${input}`);
  return response.json();
};

<Keyboard getSuggestions={getSuggestions} />
```

## 🎨 Styling

### Tailwind CSS

The component uses Tailwind CSS. Make sure to include the styles:

```tsx
import 'react-advanced-keyboard/dist/style.css';
```

### Custom Themes

```tsx
// Light theme (default)
<Keyboard theme="light" />

// Dark theme
<Keyboard theme="dark" />

// Custom styling
<Keyboard 
  className="my-custom-keyboard" 
  theme="light"
/>
```

### CSS Custom Properties

Override default colors using CSS variables:

```css
.my-custom-keyboard {
  --keyboard-bg: #f0f0f0;
  --keyboard-key: #ffffff;
  --keyboard-key-hover: #e0e0e0;
  --keyboard-border: #cccccc;
}
```

## 🔧 Development

### Building the Project

```bash
# Install dependencies
pnpm install

# Development server
pnpm run dev

# Build library
pnpm run build:lib

# Type checking
pnpm run type-check

# Linting
pnpm run lint
```

### Project Structure

```
src/
├── components/          # React components
│   ├── Keyboard.tsx    # Main keyboard component
│   ├── Key.tsx         # Individual key component
│   └── Autocomplete.tsx # Suggestion dropdown
├── hooks/              # Custom React hooks
│   └── useKeyboard.ts  # Main keyboard logic
├── layouts.ts          # Keyboard layout definitions
├── types.ts           # TypeScript type definitions
├── utils.ts           # Utility functions
└── index.ts           # Main export file
```

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the project
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Inspired by various virtual keyboard implementations
- Built with modern React and TypeScript best practices
- Uses Tailwind CSS for styling and class-variance-authority for component variants

## 📊 Package Stats

- **Bundle Size**: ~15KB gzipped
- **Dependencies**: Minimal (clsx, class-variance-authority)
- **Peer Dependencies**: React 18+, React DOM 18+
- **TypeScript**: Full type support included
