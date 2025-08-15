export interface KeyboardKey {
  key: string;
  label?: string;
  width?: 'normal' | 'wide' | 'extra-wide';
  type?: 'letter' | 'number' | 'space' | 'backspace' | 'enter' | 'shift' | 'special' | 'modifier' | 'function';
  shiftKey?: string; // Alternative key when shift is pressed
}

export interface KeyboardLayout {
  rows: KeyboardKey[][];
  name: string;
  type: 'qwerty' | 'azerty' | 'dvorak' | 'compact' | 'numpad';
  platform: 'windows' | 'mac' | 'universal';
}

export interface KeyboardConfig {
  layout: 'qwerty' | 'azerty' | 'dvorak';
  platform: 'windows' | 'mac';
  showFunctionKeys: boolean;
  showModifierKeys: boolean;
  showNumpad: boolean;
  showArrowKeys: boolean;
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
  /** Callback for handling keyboard shortcuts */
  onShortcut?: (shortcut: string, currentValue: string) => void;
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
  /** Keyboard configuration */
  config?: KeyboardConfig;
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
  /** Current text selection */
  selection?: { start: number; end: number };
  /** Callback when selection changes */
  onSelectionChange?: (selection: { start: number; end: number }) => void;
  /** Reference to input element to maintain focus */
  inputRef?: React.RefObject<HTMLInputElement | HTMLTextAreaElement | null>;
}

export interface UseKeyboardOptions {
  value?: string;
  onChange?: (value: string) => void;
  onShortcut?: (shortcut: string, currentValue: string) => void;
  enableAutocomplete?: boolean;
  suggestions?: AutocompleteSuggestion[];
  getSuggestions?: (input: string) => Promise<AutocompleteSuggestion[]>;
  maxSuggestions?: number;
  selection?: { start: number; end: number };
  onSelectionChange?: (selection: { start: number; end: number }) => void;
  /** Reference to input element to maintain focus */
  inputRef?: React.RefObject<HTMLInputElement | HTMLTextAreaElement | null>;
}

export interface KeyboardState {
  value: string;
  isShiftPressed: boolean;
  isCapsLockOn: boolean;
  isCtrlPressed: boolean;
  isAltPressed: boolean;
  isMetaPressed: boolean;
  suggestions: AutocompleteSuggestion[];
  activeSuggestionIndex: number;
  showSuggestions: boolean;
  selectionStart: number;
  selectionEnd: number;
}
