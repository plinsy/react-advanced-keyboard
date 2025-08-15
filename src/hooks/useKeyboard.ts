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
    inputRef,
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
      lastDeletedPosition: null,
      progressiveDeletionActive: false,
    };
  });

  // Add a ref to track if a deletion operation is in progress
  const deletionInProgressRef = useRef(false);
  
  // Add a ref to track progressive deletion timer
  const progressiveDeletionTimerRef = useRef<NodeJS.Timeout | null>(null);

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

    // Maintain focus on the input element after value update
    if (inputRef?.current && document.activeElement !== inputRef.current) {
      // Use setTimeout to ensure focus happens after React updates
      setTimeout(() => {
        if (inputRef.current) {
          inputRef.current.focus();
          // Also update the cursor position in the DOM element
          if (newSelectionStart !== undefined && newSelectionEnd !== undefined) {
            inputRef.current.setSelectionRange(newSelectionStart, newSelectionEnd);
          }
        }
      }, 0);
    }
  }, [isControlled, isSelectionControlled, onChange, onSelectionChange, inputRef]);

  const updateValueWithCallback = useCallback((updateFn: (currentValue: string, currentSelection: { start: number; end: number }) => { 
    newValue: string; 
    newSelectionStart?: number; 
    newSelectionEnd?: number;
    resetProgressiveDeletion?: boolean;
    enableProgressiveDeletion?: boolean;
    newDeletedPosition?: number;
  }) => {
    setState(prev => {
      const currentVal = isControlled ? (controlledValue ?? '') : prev.value;
      const currentSel = isSelectionControlled ? (controlledSelection ?? { start: 0, end: 0 }) : { start: prev.selectionStart, end: prev.selectionEnd };
      
      const result = updateFn(currentVal, currentSel);
      
      // Call onChange callback
      onChange?.(result.newValue);
      
      // Call onSelectionChange if needed
      if (!isSelectionControlled && (result.newSelectionStart !== undefined || result.newSelectionEnd !== undefined)) {
        const selection = {
          start: result.newSelectionStart ?? result.newValue.length,
          end: result.newSelectionEnd ?? result.newValue.length,
        };
        onSelectionChange?.(selection);
      }

      // Handle progressive deletion state updates
      let progressiveDeletionUpdate = {};
      if (result.resetProgressiveDeletion) {
        progressiveDeletionUpdate = {
          progressiveDeletionActive: false,
          lastDeletedPosition: null,
        };
      } else if (result.enableProgressiveDeletion) {
        progressiveDeletionUpdate = {
          progressiveDeletionActive: true,
          lastDeletedPosition: result.newDeletedPosition,
        };
      }

      // Update local state only if not controlled
      if (!isControlled) {
        return {
          ...prev,
          value: result.newValue,
          selectionStart: result.newSelectionStart ?? result.newValue.length,
          selectionEnd: result.newSelectionEnd ?? result.newValue.length,
          ...progressiveDeletionUpdate,
        };
      }
      
      // Update selection even in controlled mode if selection is not controlled
      if (!isSelectionControlled) {
        return {
          ...prev,
          selectionStart: result.newSelectionStart ?? result.newValue.length,
          selectionEnd: result.newSelectionEnd ?? result.newValue.length,
          ...progressiveDeletionUpdate,
        };
      }
      
      return {
        ...prev,
        ...progressiveDeletionUpdate,
      };
    });

    // Maintain focus on the input element after value update
    if (inputRef?.current && document.activeElement !== inputRef.current) {
      // Use setTimeout to ensure focus happens after React updates
      setTimeout(() => {
        if (inputRef.current) {
          inputRef.current.focus();
        }
      }, 0);
    }
  }, [isControlled, isSelectionControlled, onChange, onSelectionChange, inputRef, controlledValue, controlledSelection]);

  const updateSelection = useCallback((start: number, end: number) => {
    if (!isSelectionControlled) {
      setState(prev => ({
        ...prev,
        selectionStart: start,
        selectionEnd: end,
      }));
    }
    onSelectionChange?.({ start, end });

    // Maintain focus and update cursor position in the DOM element
    if (inputRef?.current) {
      if (document.activeElement !== inputRef.current) {
        inputRef.current.focus();
      }
      // Update cursor position in the DOM
      setTimeout(() => {
        if (inputRef.current) {
          inputRef.current.setSelectionRange(start, end);
        }
      }, 0);
    }
  }, [isSelectionControlled, onSelectionChange, inputRef]);

  const handleKeyPress = useCallback((key: string) => {
    // Ensure input element maintains focus
    if (inputRef?.current && document.activeElement !== inputRef.current) {
      inputRef.current.focus();
    }

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
          // Select all text - use callback to get current value
          updateValueWithCallback((currentValue) => {
            updateSelection(0, currentValue.length);
            onShortcut?.('selectAll', currentValue);
            return { newValue: currentValue, newSelectionStart: 0, newSelectionEnd: currentValue.length };
          });
          return;
        case 'c':
          // Copy - copy selected text or current value to clipboard
          updateValueWithCallback((currentValue, currentSelection) => {
            const textToCopy = currentSelection.start !== currentSelection.end 
              ? currentValue.substring(currentSelection.start, currentSelection.end)
              : currentValue;
            onShortcut?.('copy', textToCopy);
            if (navigator.clipboard) {
              navigator.clipboard.writeText(textToCopy);
            }
            return { newValue: currentValue };
          });
          return;
        case 'v':
          // Paste - this would need access to clipboard
          updateValueWithCallback((currentValue) => {
            onShortcut?.('paste', currentValue);
            if (navigator.clipboard) {
              navigator.clipboard.readText().then(text => {
                // Insert pasted text at cursor position, replacing selection if any
                updateValueWithCallback((currentVal, currentSel) => {
                  const beforeCursor = currentVal.substring(0, currentSel.start);
                  const afterCursor = currentVal.substring(currentSel.end);
                  const newVal = beforeCursor + text + afterCursor;
                  return { 
                    newValue: newVal, 
                    newSelectionStart: currentSel.start + text.length, 
                    newSelectionEnd: currentSel.start + text.length 
                  };
                });
              }).catch(err => {
                console.log('Failed to read clipboard:', err);
              });
            }
            return { newValue: currentValue };
          });
          return;
        case 'z':
          // Undo
          updateValueWithCallback((currentValue) => {
            onShortcut?.('undo', currentValue);
            return { newValue: currentValue };
          });
          return;
        case 'y':
          // Redo
          updateValueWithCallback((currentValue) => {
            onShortcut?.('redo', currentValue);
            return { newValue: currentValue };
          });
          return;
        default:
          // For other Ctrl combinations, don't add to text
          return;
      }
    }

    // Handle other special keys
    switch (key) {
      case 'Backspace':
        // Prevent overlapping deletion operations
        if (deletionInProgressRef.current) return;
        
        deletionInProgressRef.current = true;
        updateValueWithCallback((currentValue, currentSelection) => {
          const hasSelection = currentSelection.start !== currentSelection.end;
          
          if (hasSelection) {
            // Delete selected text - reset progressive deletion
            const beforeSelection = currentValue.substring(0, currentSelection.start);
            const afterSelection = currentValue.substring(currentSelection.end);
            const newValue = beforeSelection + afterSelection;
            
            // Clear progressive deletion timer and reset state
            if (progressiveDeletionTimerRef.current) {
              clearTimeout(progressiveDeletionTimerRef.current);
              progressiveDeletionTimerRef.current = null;
            }
            
            return { 
              newValue, 
              newSelectionStart: currentSelection.start, 
              newSelectionEnd: currentSelection.start,
              resetProgressiveDeletion: true
            };
          } else if (currentSelection.start > 0) {
            // Check for progressive deletion logic
            const currentPosition = currentSelection.start;
            
            // Progressive deletion: only allow deletion of the next character if previous was deleted
            if (state.progressiveDeletionActive && state.lastDeletedPosition !== null) {
              // Check if we're trying to delete the expected next character
              if (currentPosition !== state.lastDeletedPosition) {
                // Not the expected position, don't delete
                return { newValue: currentValue };
              }
            }
            
            // Check if Ctrl is pressed for word deletion
            if (state.isCtrlPressed) {
              // Delete whole word or whitespace before cursor
              const beforeCursor = currentValue.substring(0, currentSelection.start);
              const afterCursor = currentValue.substring(currentSelection.start);
              
              // Find the start of the current word or group of whitespace
              let deleteStart = currentSelection.start;
              
              // If we're at whitespace, delete all whitespace before cursor
              if (beforeCursor[deleteStart - 1] && /\s/.test(beforeCursor[deleteStart - 1])) {
                while (deleteStart > 0 && /\s/.test(beforeCursor[deleteStart - 1])) {
                  deleteStart--;
                }
              } else {
                // Delete word characters before cursor
                while (deleteStart > 0 && /\w/.test(beforeCursor[deleteStart - 1])) {
                  deleteStart--;
                }
              }
              
              const newValue = currentValue.substring(0, deleteStart) + afterCursor;
              
              // Clear progressive deletion timer and reset state for word deletion
              if (progressiveDeletionTimerRef.current) {
                clearTimeout(progressiveDeletionTimerRef.current);
                progressiveDeletionTimerRef.current = null;
              }
              
              return { 
                newValue, 
                newSelectionStart: deleteStart, 
                newSelectionEnd: deleteStart,
                resetProgressiveDeletion: true
              };
            } else {
              // Delete single character before cursor
              const beforeCursor = currentValue.substring(0, currentSelection.start - 1);
              const afterCursor = currentValue.substring(currentSelection.start);
              const newValue = beforeCursor + afterCursor;
              const newPosition = currentSelection.start - 1;
              
              // Set up progressive deletion state
              // Clear existing timer
              if (progressiveDeletionTimerRef.current) {
                clearTimeout(progressiveDeletionTimerRef.current);
              }
              
              // Set up timer to reset progressive deletion after 2 seconds of inactivity
              progressiveDeletionTimerRef.current = setTimeout(() => {
                setState(prev => ({
                  ...prev,
                  progressiveDeletionActive: false,
                  lastDeletedPosition: null,
                }));
                progressiveDeletionTimerRef.current = null;
              }, 2000);
              
              return { 
                newValue, 
                newSelectionStart: newPosition, 
                newSelectionEnd: newPosition,
                enableProgressiveDeletion: true,
                newDeletedPosition: newPosition
              };
            }
          } else {
            // Nothing to delete - reset progressive deletion
            if (progressiveDeletionTimerRef.current) {
              clearTimeout(progressiveDeletionTimerRef.current);
              progressiveDeletionTimerRef.current = null;
            }
            return { 
              newValue: currentValue,
              resetProgressiveDeletion: true
            };
          }
        });
        
        // Reset the flag after a small delay to allow the state update to complete
        setTimeout(() => {
          deletionInProgressRef.current = false;
        }, 50);
        return;
      case 'Delete':
        // Prevent overlapping deletion operations
        if (deletionInProgressRef.current) return;
        
        deletionInProgressRef.current = true;
        updateValueWithCallback((currentValue, currentSelection) => {
          const hasSelection = currentSelection.start !== currentSelection.end;
          
          if (hasSelection) {
            // Delete selected text (same as backspace when text is selected)
            const beforeSelection = currentValue.substring(0, currentSelection.start);
            const afterSelection = currentValue.substring(currentSelection.end);
            const newValue = beforeSelection + afterSelection;
            return { 
              newValue, 
              newSelectionStart: currentSelection.start, 
              newSelectionEnd: currentSelection.start 
            };
          } else if (currentSelection.start < currentValue.length) {
            // Check if Ctrl is pressed for word deletion
            if (state.isCtrlPressed) {
              // Delete whole word or whitespace after cursor
              const beforeCursor = currentValue.substring(0, currentSelection.start);
              const afterCursor = currentValue.substring(currentSelection.start);
              
              // Find the end of the current word or group of whitespace
              let deleteEnd = currentSelection.start;
              
              // If we're at whitespace, delete all whitespace after cursor
              if (afterCursor[0] && /\s/.test(afterCursor[0])) {
                while (deleteEnd < currentValue.length && /\s/.test(currentValue[deleteEnd])) {
                  deleteEnd++;
                }
              } else {
                // Delete word characters after cursor
                while (deleteEnd < currentValue.length && /\w/.test(currentValue[deleteEnd])) {
                  deleteEnd++;
                }
              }
              
              const newValue = beforeCursor + currentValue.substring(deleteEnd);
              return { 
                newValue, 
                newSelectionStart: currentSelection.start, 
                newSelectionEnd: currentSelection.start 
              };
            } else {
              // Delete single character after cursor
              const beforeCursor = currentValue.substring(0, currentSelection.start);
              const afterCursor = currentValue.substring(currentSelection.start + 1);
              const newValue = beforeCursor + afterCursor;
              return { 
                newValue, 
                newSelectionStart: currentSelection.start, 
                newSelectionEnd: currentSelection.start 
              };
            }
          } else {
            // Nothing to delete
            return { newValue: currentValue };
          }
        });
        
        // Reset the flag after a small delay to allow the state update to complete
        setTimeout(() => {
          deletionInProgressRef.current = false;
        }, 50);
        return;
      case 'Enter':
        if (state.showSuggestions && state.activeSuggestionIndex >= 0) {
          // Apply selected suggestion
          updateValueWithCallback((currentValue) => {
            const suggestion = state.suggestions[state.activeSuggestionIndex];
            const newValue = applySuggestion(currentValue, suggestion.text);
            setState(prev => ({
              ...prev,
              showSuggestions: false,
              activeSuggestionIndex: -1,
            }));
            return { newValue };
          });
        } else {
          // Insert newline at cursor position, replacing selection if any
          updateValueWithCallback((currentValue, currentSelection) => {
            const beforeCursor = currentValue.substring(0, currentSelection.start);
            const afterCursor = currentValue.substring(currentSelection.end);
            const newValue = beforeCursor + '\n' + afterCursor;
            return { 
              newValue, 
              newSelectionStart: currentSelection.start + 1, 
              newSelectionEnd: currentSelection.start + 1 
            };
          });
        }
        return;
      case 'Shift':
        setState(prev => ({ ...prev, isShiftPressed: !prev.isShiftPressed }));
        return; // Don't update value for shift
      case 'CapsLock':
        setState(prev => ({ ...prev, isCapsLockOn: !prev.isCapsLockOn }));
        return; // Don't update value for caps lock
      case 'Tab':
        // Insert tab at cursor position, replacing selection if any
        updateValueWithCallback((currentValue, currentSelection) => {
          const beforeCursor = currentValue.substring(0, currentSelection.start);
          const afterCursor = currentValue.substring(currentSelection.end);
          const newValue = beforeCursor + '\t' + afterCursor;
          return { 
            newValue, 
            newSelectionStart: currentSelection.start + 1, 
            newSelectionEnd: currentSelection.start + 1 
          };
        });
        return;
      case ' ':
        // Insert space at cursor position, replacing selection if any
        updateValueWithCallback((currentValue, currentSelection) => {
          const beforeCursorSpace = currentValue.substring(0, currentSelection.start);
          const afterCursorSpace = currentValue.substring(currentSelection.end);
          const newValue = beforeCursorSpace + ' ' + afterCursorSpace;
          // Hide suggestions when space is pressed
          setState(prev => ({ ...prev, showSuggestions: false, activeSuggestionIndex: -1 }));
          
          // Clear progressive deletion timer and reset state
          if (progressiveDeletionTimerRef.current) {
            clearTimeout(progressiveDeletionTimerRef.current);
            progressiveDeletionTimerRef.current = null;
          }
          
          return { 
            newValue, 
            newSelectionStart: currentSelection.start + 1, 
            newSelectionEnd: currentSelection.start + 1,
            resetProgressiveDeletion: true
          };
        });
        return;
      case 'Escape':
        // Hide suggestions when escape is pressed
        setState(prev => ({ ...prev, showSuggestions: false, activeSuggestionIndex: -1 }));
        return;
      default:
        // Handle letter keys with shift/caps lock
        updateValueWithCallback((currentValue, currentSelection) => {
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
          
          // Clear progressive deletion timer and reset state when typing
          if (progressiveDeletionTimerRef.current) {
            clearTimeout(progressiveDeletionTimerRef.current);
            progressiveDeletionTimerRef.current = null;
          }
          
          // Insert character at cursor position, replacing selection if any
          const beforeCursorChar = currentValue.substring(0, currentSelection.start);
          const afterCursorChar = currentValue.substring(currentSelection.end);
          const newValue = beforeCursorChar + keyToAdd + afterCursorChar;
          return { 
            newValue, 
            newSelectionStart: currentSelection.start + keyToAdd.length, 
            newSelectionEnd: currentSelection.start + keyToAdd.length,
            resetProgressiveDeletion: true
          };
        });
        return;
    }
  }, [state.isShiftPressed, state.isCapsLockOn, state.isCtrlPressed, state.showSuggestions, state.activeSuggestionIndex, state.suggestions, state.lastDeletedPosition, state.progressiveDeletionActive, updateValueWithCallback, updateSelection, onShortcut, inputRef]);

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

  // Cleanup effect for progressive deletion timer
  useEffect(() => {
    return () => {
      if (progressiveDeletionTimerRef.current) {
        clearTimeout(progressiveDeletionTimerRef.current);
        progressiveDeletionTimerRef.current = null;
      }
    };
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
