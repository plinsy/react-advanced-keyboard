# React Advanced Keyboard

A modern, customizable React virtual keyboard component with intelligent autocomplete functionality. Built with TypeScript, Tailwind CSS, and modern React patterns.

## ✨ Features

- 🎯 **Virtual Keyboard**: Full QWERTY, compact, and number pad layouts
- 🧠 **Smart Autocomplete**: Built-in word suggestions with confidence scoring
- ⚡ **Fast & Lightweight**: Optimized for performance with minimal dependencies
- 🎨 **Customizable**: Multiple themes, layouts, and styling options
- 🔧 **TypeScript**: Full type safety and excellent developer experience
- ♿ **Accessible**: Built with accessibility in mind
- 🎮 **Dual Input**: Supports both virtual and physical keyboard input
- 📱 **Responsive**: Works great on desktop and mobile devices

## 📦 Installation

```bash
npm install react-advanced-keyboard
# or
yarn add react-advanced-keyboard
# or
pnpm add react-advanced-keyboard
```

## 🚀 Quick Start

```tsx
import React, { useState } from 'react';
import { Keyboard } from 'react-advanced-keyboard';
import 'react-advanced-keyboard/dist/style.css';

function App() {
  const [value, setValue] = useState('');

  return (
    <Keyboard
      value={value}
      onChange={setValue}
      enableAutocomplete={true}
      onKeyPress={(key) => console.log('Key pressed:', key)}
    />
  );
}
```

## 📚 Components

### Keyboard

The main virtual keyboard component.

```tsx
import { Keyboard } from 'react-advanced-keyboard';

<Keyboard
  value={value}
  onChange={setValue}
  enableAutocomplete={true}
  maxSuggestions={5}
  theme="light"
  layout={qwertyLayout}
  showNumbers={true}
/>
```

#### Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `value` | `string` | `undefined` | Current input value (controlled) |
| `onChange` | `(value: string) => void` | `undefined` | Callback when value changes |
| `onKeyPress` | `(key: string) => void` | `undefined` | Callback when a key is pressed |
| `enableAutocomplete` | `boolean` | `true` | Enable autocomplete functionality |
| `suggestions` | `AutocompleteSuggestion[]` | `undefined` | Custom suggestions array |
| `getSuggestions` | `(input: string) => Promise<AutocompleteSuggestion[]>` | `undefined` | Async function to fetch suggestions |
| `maxSuggestions` | `number` | `5` | Maximum number of suggestions to show |
| `layout` | `KeyboardLayout` | `qwertyLayout` | Keyboard layout configuration |
| `disabled` | `boolean` | `false` | Disable the keyboard |
| `className` | `string` | `undefined` | Custom CSS classes |
| `theme` | `'light' \| 'dark'` | `'light'` | Theme variant |
| `showNumbers` | `boolean` | `true` | Show number row |

### useKeyboard Hook

For building custom keyboard components.

```tsx
import { useKeyboard } from 'react-advanced-keyboard';

function CustomKeyboard() {
  const {
    value,
    suggestions,
    showSuggestions,
    handleKeyPress,
    selectSuggestion,
  } = useKeyboard({
    enableAutocomplete: true,
    maxSuggestions: 5,
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
