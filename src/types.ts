export interface KeyboardKey {
  key: string;
  label?: string;
  width?: 'normal' | 'wide' | 'extra-wide';
  type?: 'letter' | 'number' | 'space' | 'backspace' | 'enter' | 'shift' | 'special';
}

export interface KeyboardLayout {
  rows: KeyboardKey[][];
}

export interface AutocompleteSuggestion {
  text: string;
  confidence?: number;
}

export interface KeyboardProps {
  /** Current input value */
  value?: string;
  /** Callback when value changes */
  onChange?: (value: string) => void;
  /** Callback when a key is pressed */
  onKeyPress?: (key: string) => void;
  /** Enable autocomplete functionality */
  enableAutocomplete?: boolean;
  /** Custom autocomplete suggestions */
  suggestions?: AutocompleteSuggestion[];
  /** Async function to fetch suggestions */
  getSuggestions?: (input: string) => Promise<AutocompleteSuggestion[]>;
  /** Maximum number of suggestions to show */
  maxSuggestions?: number;
  /** Custom keyboard layout */
  layout?: KeyboardLayout;
  /** Disable the keyboard */
  disabled?: boolean;
  /** Custom CSS classes */
  className?: string;
  /** Theme variants */
  theme?: 'light' | 'dark' | 'custom';
  /** Show number row */
  showNumbers?: boolean;
  /** Keyboard language/layout */
  locale?: 'en' | 'es' | 'fr' | 'de';
}

export interface UseKeyboardOptions {
  value?: string;
  onChange?: (value: string) => void;
  enableAutocomplete?: boolean;
  suggestions?: AutocompleteSuggestion[];
  getSuggestions?: (input: string) => Promise<AutocompleteSuggestion[]>;
  maxSuggestions?: number;
}

export interface KeyboardState {
  value: string;
  isShiftPressed: boolean;
  isCapsLockOn: boolean;
  suggestions: AutocompleteSuggestion[];
  activeSuggestionIndex: number;
  showSuggestions: boolean;
}
