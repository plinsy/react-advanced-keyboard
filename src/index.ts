// Main components
export { Keyboard } from './components/Keyboard';
export { Key } from './components/Key';
export { Autocomplete } from './components/Autocomplete';

// Hooks
export { useKeyboard } from './hooks/useKeyboard';

// Types
export type {
  KeyboardKey,
  KeyboardLayout,
  AutocompleteSuggestion,
  KeyboardProps,
  UseKeyboardOptions,
  KeyboardState,
} from './types';

// Layouts
export {
  qwertyLayout,
  numberPadLayout,
  compactLayout,
} from './layouts';

// Utilities
export {
  getDefaultSuggestions,
  getLastWord,
  calculateConfidence,
  applySuggestion,
  debounce,
  rankSuggestions,
} from './utils';

// Styles (users need to import this separately)
export const styles = './index.css';
