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
    selection: controlledSelection,
    onSelectionChange,
  } = options;

  const [state, setState] = useState<KeyboardState>(() => {
    const initialValue = controlledValue || '';
    const defaultCursorPosition = initialValue.length;
    
    return {
      value: initialValue,
      isShiftPressed: false,
      isCapsLockOn: false,
      isCtrlPressed: false,
      isAltPressed: false,
      isMetaPressed: false,
      suggestions: [],
      activeSuggestionIndex: -1,
      showSuggestions: false,
      selectionStart: controlledSelection?.start ?? defaultCursorPosition,
      selectionEnd: controlledSelection?.end ?? defaultCursorPosition,
    };
  });

  const isControlled = controlledValue !== undefined;
  const currentValue = isControlled ? controlledValue : state.value;
  const isSelectionControlled = controlledSelection !== undefined;
  const currentSelection = isSelectionControlled ? controlledSelection : { start: state.selectionStart, end: state.selectionEnd };

  // Update selection when controlled selection changes
  useEffect(() => {
    if (controlledSelection && isSelectionControlled) {
      setState(prev => ({
        ...prev,
        selectionStart: controlledSelection.start,
        selectionEnd: controlledSelection.end,
      }));
    }
  }, [controlledSelection, isSelectionControlled]);

  // Update cursor position when controlled value changes (but selection is not controlled)
  useEffect(() => {
    if (isControlled && !isSelectionControlled && controlledValue !== undefined) {
      setState(prev => {
        // Only update if the value actually changed and we don't have a controlled selection
        if (prev.value !== controlledValue) {
          const newCursorPosition = controlledValue.length;
          return {
            ...prev,
            selectionStart: newCursorPosition,
            selectionEnd: newCursorPosition,
          };
        }
        return prev;
      });
    }
  }, [controlledValue, isControlled, isSelectionControlled]);

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

  const updateValue = useCallback((newValue: string, newSelectionStart?: number, newSelectionEnd?: number) => {
    if (!isControlled) {
      setState(prev => ({ 
        ...prev, 
        value: newValue,
        selectionStart: newSelectionStart ?? newValue.length,
        selectionEnd: newSelectionEnd ?? newValue.length,
      }));
    }
    onChange?.(newValue);
    
    if (!isSelectionControlled && (newSelectionStart !== undefined || newSelectionEnd !== undefined)) {
      const selection = {
        start: newSelectionStart ?? newValue.length,
        end: newSelectionEnd ?? newValue.length,
      };
      onSelectionChange?.(selection);
    }
  }, [isControlled, isSelectionControlled, onChange, onSelectionChange]);

  const updateSelection = useCallback((start: number, end: number) => {
    if (!isSelectionControlled) {
      setState(prev => ({
        ...prev,
        selectionStart: start,
        selectionEnd: end,
      }));
    }
    onSelectionChange?.({ start, end });
  }, [isSelectionControlled, onSelectionChange]);

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
          updateSelection(0, currentValue.length);
          onShortcut?.('selectAll', currentValue);
          return;
        case 'c':
          // Copy - copy selected text or current value to clipboard
          const textToCopy = currentSelection.start !== currentSelection.end 
            ? currentValue.substring(currentSelection.start, currentSelection.end)
            : currentValue;
          onShortcut?.('copy', textToCopy);
          if (navigator.clipboard) {
            navigator.clipboard.writeText(textToCopy);
          }
          return;
        case 'v':
          // Paste - this would need access to clipboard
          onShortcut?.('paste', currentValue);
          if (navigator.clipboard) {
            navigator.clipboard.readText().then(text => {
              // Insert pasted text at cursor position, replacing selection if any
              const beforeCursor = currentValue.substring(0, currentSelection.start);
              const afterCursor = currentValue.substring(currentSelection.end);
              const newVal = beforeCursor + text + afterCursor;
              updateValue(newVal, currentSelection.start + text.length, currentSelection.start + text.length);
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
        const hasSelection = currentSelection.start !== currentSelection.end;
        
        if (hasSelection) {
          // Delete selected text
          const beforeSelection = currentValue.substring(0, currentSelection.start);
          const afterSelection = currentValue.substring(currentSelection.end);
          newValue = beforeSelection + afterSelection;
          updateValue(newValue, currentSelection.start, currentSelection.start);
          return;
        } else if (currentSelection.start > 0) {
          // Delete character before cursor
          const beforeCursor = currentValue.substring(0, currentSelection.start - 1);
          const afterCursor = currentValue.substring(currentSelection.start);
          newValue = beforeCursor + afterCursor;
          updateValue(newValue, currentSelection.start - 1, currentSelection.start - 1);
          return;
        } else {
          // Nothing to delete
          return;
        }
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
          updateValue(newValue);
          return;
        } else {
          // Insert newline at cursor position, replacing selection if any
          const beforeCursor = currentValue.substring(0, currentSelection.start);
          const afterCursor = currentValue.substring(currentSelection.end);
          newValue = beforeCursor + '\n' + afterCursor;
          updateValue(newValue, currentSelection.start + 1, currentSelection.start + 1);
          return;
        }
        break;
      case 'Shift':
        setState(prev => ({ ...prev, isShiftPressed: !prev.isShiftPressed }));
        return; // Don't update value for shift
      case 'CapsLock':
        setState(prev => ({ ...prev, isCapsLockOn: !prev.isCapsLockOn }));
        return; // Don't update value for caps lock
      case 'Tab':
        // Insert tab at cursor position, replacing selection if any
        const beforeCursor = currentValue.substring(0, currentSelection.start);
        const afterCursor = currentValue.substring(currentSelection.end);
        newValue = beforeCursor + '\t' + afterCursor;
        updateValue(newValue, currentSelection.start + 1, currentSelection.start + 1);
        return;
        break;
      case ' ':
        // Insert space at cursor position, replacing selection if any
        const beforeCursorSpace = currentValue.substring(0, currentSelection.start);
        const afterCursorSpace = currentValue.substring(currentSelection.end);
        newValue = beforeCursorSpace + ' ' + afterCursorSpace;
        updateValue(newValue, currentSelection.start + 1, currentSelection.start + 1);
        // Hide suggestions when space is pressed
        setState(prev => ({ ...prev, showSuggestions: false, activeSuggestionIndex: -1 }));
        return;
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
        
        // Insert character at cursor position, replacing selection if any
        const beforeCursorChar = currentValue.substring(0, currentSelection.start);
        const afterCursorChar = currentValue.substring(currentSelection.end);
        newValue = beforeCursorChar + keyToAdd + afterCursorChar;
        updateValue(newValue, currentSelection.start + keyToAdd.length, currentSelection.start + keyToAdd.length);
        return;
        break;
    }
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
    selection: { start: currentSelection.start, end: currentSelection.end },
    handleKeyPress,
    selectSuggestion,
    navigateSuggestions,
    hideSuggestions,
    updateSelection,
  };
}
