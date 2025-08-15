# Focus Management

The React Advanced Keyboard now includes automatic focus management to ensure that the cursor stays in your input field (textarea or input) even when typing with the virtual keyboard.

## How it works

When you provide an `inputRef` to the `Keyboard` component, it will:

1. **Maintain focus**: Automatically keep the input element focused when virtual keys are pressed
2. **Preserve cursor position**: Maintain the correct cursor position after each keystroke
3. **Prevent focus loss**: Use `preventDefault()` on keyboard button events to avoid focus being stolen
4. **Sync selection**: Keep the DOM selection in sync with the virtual keyboard state

## Usage

```tsx
import { useState, useRef } from 'react';
import { Keyboard } from 'react-advanced-keyboard';

function MyComponent() {
  const [value, setValue] = useState('');
  const inputRef = useRef<HTMLTextAreaElement>(null);

  return (
    <div>
      <textarea
        ref={inputRef}
        value={value}
        onChange={(e) => setValue(e.target.value)}
        placeholder="Type here..."
      />
      
      <Keyboard
        value={value}
        onChange={setValue}
        inputRef={inputRef}  // This enables focus management
      />
    </div>
  );
}
```

## Features

- ✅ Cursor stays in textarea when clicking virtual keys
- ✅ Proper text selection and cursor positioning
- ✅ Works with both `input` and `textarea` elements
- ✅ Compatible with controlled and uncontrolled components
- ✅ Handles keyboard shortcuts (Ctrl+A, Ctrl+C, etc.)
- ✅ Maintains accessibility standards

## Technical Details

The focus management works by:

1. Adding `tabIndex={-1}` to keyboard buttons to prevent tab focus
2. Using `preventDefault()` on mouse and touch events
3. Automatically calling `focus()` and `setSelectionRange()` on the input element
4. Using `setTimeout()` to ensure DOM updates happen after React state changes

## Browser Compatibility

This feature works in all modern browsers that support:
- `document.activeElement`
- `element.focus()`
- `element.setSelectionRange()`
