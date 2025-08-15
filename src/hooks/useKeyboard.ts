import { useState, useCallback, useEffect, useRef } from 'react';
import type { UseKeyboardOptions, KeyboardState } from '../types';
import { getDefaultSuggestions, applySuggestion, debounce } from '../utils';

export function useKeyboard(options: UseKeyboardOptions = {}) {
  const {
    value: controlledValue,
    onChange,
    onShortcut,
    enableAutocomplete = true,
    suggestions: customSuggestions,
    getSuggestions,
    maxSuggestions = 5,
  } = options;

  const [state, setState] = useState<KeyboardState>({
    value: controlledValue || '',
    isShiftPressed: false,
    isCapsLockOn: false,
    isCtrlPressed: false,
    isAltPressed: false,
    isMetaPressed: false,
    suggestions: [],
    activeSuggestionIndex: -1,
    showSuggestions: false,
  });

  const isControlled = controlledValue !== undefined;
  const currentValue = isControlled ? controlledValue : state.value;

  // Debounced function for fetching async suggestions
  const debouncedGetSuggestions = useRef(
    debounce(async (input: string) => {
      if (!enableAutocomplete || !getSuggestions) return;
      
      try {
        const suggestions = await getSuggestions(input);
        setState(prev => ({
          ...prev,
          suggestions,
          showSuggestions: suggestions.length > 0,
          activeSuggestionIndex: -1,
        }));
      } catch (error) {
        console.error('Error fetching suggestions:', error);
      }
    }, 300)
  ).current;

  // Update suggestions when value changes
  useEffect(() => {
    if (!enableAutocomplete) return;

    if (getSuggestions) {
      debouncedGetSuggestions(currentValue);
    } else if (customSuggestions) {
      setState(prev => ({
        ...prev,
        suggestions: customSuggestions,
        showSuggestions: customSuggestions.length > 0,
        activeSuggestionIndex: -1,
      }));
    } else {
      const suggestions = getDefaultSuggestions(currentValue, maxSuggestions);
      setState(prev => ({
        ...prev,
        suggestions,
        showSuggestions: suggestions.length > 0,
        activeSuggestionIndex: -1,
      }));
    }
  }, [currentValue, enableAutocomplete, customSuggestions, getSuggestions, maxSuggestions, debouncedGetSuggestions]);

  const updateValue = useCallback((newValue: string) => {
    if (!isControlled) {
      setState(prev => ({ ...prev, value: newValue }));
    }
    onChange?.(newValue);
  }, [isControlled, onChange]);

  const handleKeyPress = useCallback((key: string) => {
    let newValue = currentValue;

    // Handle modifier keys - they should not print text
    if (key === 'Control') {
      setState(prev => ({ ...prev, isCtrlPressed: !prev.isCtrlPressed }));
      return;
    }
    if (key === 'Alt') {
      setState(prev => ({ ...prev, isAltPressed: !prev.isAltPressed }));
      return;
    }
    if (key === 'Meta') {
      setState(prev => ({ ...prev, isMetaPressed: !prev.isMetaPressed }));
      return;
    }

    // Handle keyboard shortcuts when Ctrl is pressed
    if (state.isCtrlPressed) {
      switch (key.toLowerCase()) {
        case 'a':
          // Select all text
          onShortcut?.('selectAll', currentValue);
          return;
        case 'c':
          // Copy - copy current value to clipboard
          onShortcut?.('copy', currentValue);
          if (navigator.clipboard) {
            navigator.clipboard.writeText(currentValue);
          }
          return;
        case 'v':
          // Paste - this would need access to clipboard
          onShortcut?.('paste', currentValue);
          if (navigator.clipboard) {
            navigator.clipboard.readText().then(text => {
              updateValue(currentValue + text);
            }).catch(err => {
              console.log('Failed to read clipboard:', err);
            });
          }
          return;
        case 'z':
          // Undo
          onShortcut?.('undo', currentValue);
          return;
        case 'y':
          // Redo
          onShortcut?.('redo', currentValue);
          return;
        default:
          // For other Ctrl combinations, don't add to text
          return;
      }
    }

    // Handle other special keys
    switch (key) {
      case 'Backspace':
        newValue = currentValue.slice(0, -1);
        break;
      case 'Enter':
        if (state.showSuggestions && state.activeSuggestionIndex >= 0) {
          // Apply selected suggestion
          const suggestion = state.suggestions[state.activeSuggestionIndex];
          newValue = applySuggestion(currentValue, suggestion.text);
          setState(prev => ({
            ...prev,
            showSuggestions: false,
            activeSuggestionIndex: -1,
          }));
        } else {
          newValue = currentValue + '\n';
        }
        break;
      case 'Shift':
        setState(prev => ({ ...prev, isShiftPressed: !prev.isShiftPressed }));
        return; // Don't update value for shift
      case 'CapsLock':
        setState(prev => ({ ...prev, isCapsLockOn: !prev.isCapsLockOn }));
        return; // Don't update value for caps lock
      case 'Tab':
        newValue = currentValue + '\t';
        break;
      case ' ':
        newValue = currentValue + ' ';
        // Hide suggestions when space is pressed
        setState(prev => ({ ...prev, showSuggestions: false, activeSuggestionIndex: -1 }));
        break;
      case 'Escape':
        // Hide suggestions when escape is pressed
        setState(prev => ({ ...prev, showSuggestions: false, activeSuggestionIndex: -1 }));
        return;
      default:
        // Handle letter keys with shift/caps lock
        let keyToAdd = key;
        if (key.length === 1 && key.match(/[a-z]/)) {
          if (state.isShiftPressed || state.isCapsLockOn) {
            keyToAdd = key.toUpperCase();
          }
          // Reset shift after typing a letter
          if (state.isShiftPressed) {
            setState(prev => ({ ...prev, isShiftPressed: false }));
          }
        }
        newValue = currentValue + keyToAdd;
        break;
    }

    updateValue(newValue);
  }, [currentValue, state.isShiftPressed, state.isCapsLockOn, state.isCtrlPressed, state.isAltPressed, state.isMetaPressed, state.showSuggestions, state.activeSuggestionIndex, state.suggestions, updateValue]);

  const selectSuggestion = useCallback((index: number) => {
    if (index >= 0 && index < state.suggestions.length) {
      const suggestion = state.suggestions[index];
      const newValue = applySuggestion(currentValue, suggestion.text);
      updateValue(newValue);
      setState(prev => ({
        ...prev,
        showSuggestions: false,
        activeSuggestionIndex: -1,
      }));
    }
  }, [currentValue, state.suggestions, updateValue]);

  const navigateSuggestions = useCallback((direction: 'up' | 'down') => {
    if (!state.showSuggestions || state.suggestions.length === 0) return;

    setState(prev => {
      let newIndex = prev.activeSuggestionIndex;
      
      if (direction === 'down') {
        newIndex = newIndex < prev.suggestions.length - 1 ? newIndex + 1 : -1;
      } else {
        newIndex = newIndex > -1 ? newIndex - 1 : prev.suggestions.length - 1;
      }

      return { ...prev, activeSuggestionIndex: newIndex };
    });
  }, [state.showSuggestions, state.suggestions.length]);

  const hideSuggestions = useCallback(() => {
    setState(prev => ({
      ...prev,
      showSuggestions: false,
      activeSuggestionIndex: -1,
    }));
  }, []);

  return {
    value: currentValue,
    isShiftPressed: state.isShiftPressed,
    isCapsLockOn: state.isCapsLockOn,
    isCtrlPressed: state.isCtrlPressed,
    isAltPressed: state.isAltPressed,
    isMetaPressed: state.isMetaPressed,
    suggestions: state.suggestions,
    activeSuggestionIndex: state.activeSuggestionIndex,
    showSuggestions: state.showSuggestions,
    handleKeyPress,
    selectSuggestion,
    navigateSuggestions,
    hideSuggestions,
  };
}
