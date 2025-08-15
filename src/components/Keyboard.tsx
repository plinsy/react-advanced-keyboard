import React from 'react';
import { clsx } from 'clsx';
import type { KeyboardProps, KeyboardConfig, KeyboardLayout } from '../types';
import { useKeyboard } from '../hooks/useKeyboard';
import { qwertyLayout } from '../layouts';
import { Key } from './Key';
import { Autocomplete } from './Autocomplete';

// Helper function to filter keyboard rows based on config
const filterKeyboardRows = (layout: KeyboardLayout, config?: KeyboardConfig) => {
  if (!config) return layout.rows;
  
  return layout.rows.filter((_, index) => {
    // For Windows/Mac layouts with function keys
    if (layout.platform !== 'universal' && index === 0) {
      return config.showFunctionKeys;
    }
    
    // Show all other rows by default
    return true;
  });
};

export const Keyboard: React.FC<KeyboardProps> = ({
  value,
  onChange,
  onKeyPress,
  onShortcut,
  enableAutocomplete = true,
  suggestions,
  getSuggestions,
  maxSuggestions = 5,
  layout = qwertyLayout,
  config,
  disabled = false,
  className,
  theme = 'light',
  showNumbers = true,
  selection,
  onSelectionChange,
  inputRef,
}) => {
  const {
    isShiftPressed,
    isCapsLockOn,
    isCtrlPressed,
    isAltPressed,
    isMetaPressed,
    suggestions: currentSuggestions,
    activeSuggestionIndex,
    showSuggestions,
    handleKeyPress,
    selectSuggestion,
    navigateSuggestions,
    hideSuggestions,
  } = useKeyboard({
    value,
    onChange,
    onShortcut,
    enableAutocomplete,
    suggestions,
    getSuggestions,
    maxSuggestions,
    selection,
    onSelectionChange,
    inputRef,
  });

  // Handle physical keyboard events
  React.useEffect(() => {
    const handlePhysicalKeyPress = (event: KeyboardEvent) => {
      event.preventDefault();
      
      if (event.key === 'ArrowUp' && showSuggestions) {
        navigateSuggestions('up');
        return;
      }
      
      if (event.key === 'ArrowDown' && showSuggestions) {
        navigateSuggestions('down');
        return;
      }
      
      if (event.key === 'Escape' && showSuggestions) {
        hideSuggestions();
        return;
      }
      
      // Handle Ctrl combinations
      if (event.ctrlKey && event.key !== 'Control') {
        handleKeyPress(event.key);
        onKeyPress?.(event.key);
        return;
      }
      
      handleKeyPress(event.key);
      onKeyPress?.(event.key);
    };

    window.addEventListener('keydown', handlePhysicalKeyPress);
    return () => window.removeEventListener('keydown', handlePhysicalKeyPress);
  }, [handleKeyPress, onKeyPress, showSuggestions, navigateSuggestions, hideSuggestions]);

  const handleVirtualKeyPress = (key: string) => {
    // Ensure input maintains focus before processing the key
    if (inputRef?.current && document.activeElement !== inputRef.current) {
      inputRef.current.focus();
    }
    
    handleKeyPress(key);
    onKeyPress?.(key);
  };

  const handleVirtualKeyLongPress = (key: string) => {
    // For long press, we mainly handle backspace
    if (key === 'Backspace') {
      // Ensure input maintains focus before processing the key
      if (inputRef?.current && document.activeElement !== inputRef.current) {
        inputRef.current.focus();
      }
      
      handleKeyPress(key);
      onKeyPress?.(key);
    }
  };

  const filteredLayout = React.useMemo(() => {
    let filteredRows = filterKeyboardRows(layout, config);
    
    // Filter out number row if showNumbers is false
    if (!showNumbers) {
      filteredRows = filteredRows.filter(row => 
        !row.every(key => key.type === 'number' || key.type === 'backspace')
      );
    }
    
    return {
      ...layout,
      rows: filteredRows,
    };
  }, [layout, config, showNumbers]);

  return (
    <div className={clsx('relative', className)}>
      {/* Autocomplete suggestions */}
      {enableAutocomplete && (
        <Autocomplete
          suggestions={currentSuggestions}
          activeSuggestionIndex={activeSuggestionIndex}
          onSuggestionClick={selectSuggestion}
          show={showSuggestions}
          className="mb-2"
        />
      )}
      
      {/* Virtual keyboard */}
      <div
        className={clsx(
          'keyboard-container pt-12',
          {
            'opacity-50 pointer-events-none': disabled,
            'bg-gray-800 border-gray-600': theme === 'dark',
          }
        )}
      >
        {filteredLayout.rows.map((row, rowIndex) => (
          <div key={rowIndex} className="keyboard-row">
            {row.map((keyData, keyIndex) => (
              <Key
                key={`${rowIndex}-${keyIndex}-${keyData.key}`}
                keyData={keyData}
                onPress={handleVirtualKeyPress}
                onLongPress={handleVirtualKeyLongPress}
                isShiftPressed={isShiftPressed}
                isCapsLockOn={isCapsLockOn}
                isCtrlPressed={isCtrlPressed}
                isAltPressed={isAltPressed}
                isMetaPressed={isMetaPressed}
                disabled={disabled}
                className={clsx({
                  'text-white border-gray-500': theme === 'dark',
                })}
              />
            ))}
          </div>
        ))}
      </div>
    </div>
  );
};
