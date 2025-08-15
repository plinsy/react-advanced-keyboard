import React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { clsx } from 'clsx';
import type { KeyboardKey } from '../types';

const keyVariants = cva(
  'keyboard-key',
  {
    variants: {
      width: {
        normal: '',
        wide: 'keyboard-key-wide',
        'extra-wide': 'keyboard-key-extra-wide',
      },
      pressed: {
        true: 'scale-95 bg-keyboard-key-active',
        false: '',
      },
      disabled: {
        true: 'opacity-50 cursor-not-allowed',
        false: '',
      },
    },
    defaultVariants: {
      width: 'normal',
      pressed: false,
      disabled: false,
    },
  }
);

interface KeyProps extends VariantProps<typeof keyVariants> {
  keyData: KeyboardKey;
  onPress?: (key: string) => void;
  isShiftPressed?: boolean;
  isCapsLockOn?: boolean;
  disabled?: boolean;
  className?: string;
}

export const Key: React.FC<KeyProps> = ({
  keyData,
  onPress,
  isShiftPressed = false,
  isCapsLockOn = false,
  disabled = false,
  className,
  ...props
}) => {
  const [isPressed, setIsPressed] = React.useState(false);

  const handleMouseDown = () => {
    if (disabled) return;
    setIsPressed(true);
  };

  const handleMouseUp = () => {
    setIsPressed(false);
  };

  const handleMouseLeave = () => {
    setIsPressed(false);
  };

  const handleClick = () => {
    if (disabled) return;
    onPress?.(getKeyToSend());
  };

  const getDisplayText = () => {
    if (keyData.label) return keyData.label;
    
    // Handle shift key combinations
    if (keyData.shiftKey && isShiftPressed) {
      return keyData.shiftKey;
    }
    
    if (keyData.type === 'letter') {
      const shouldCapitalize = isShiftPressed || isCapsLockOn;
      return shouldCapitalize ? keyData.key.toUpperCase() : keyData.key;
    }

    return keyData.key;
  };

  const getKeyToSend = () => {
    // Send the shift key combination if shift is pressed and available
    if (keyData.shiftKey && isShiftPressed) {
      return keyData.shiftKey;
    }
    
    if (keyData.type === 'letter') {
      const shouldCapitalize = isShiftPressed || isCapsLockOn;
      return shouldCapitalize ? keyData.key.toUpperCase() : keyData.key;
    }
    
    return keyData.key;
  };

  const getKeyStyles = () => {
    const baseStyles = {
      'bg-blue-200 border-blue-400 dark:bg-blue-800 dark:border-blue-600': 
        keyData.type === 'shift' && isShiftPressed,
      'bg-green-200 border-green-400 dark:bg-green-800 dark:border-green-600': 
        keyData.type === 'modifier',
      'bg-yellow-200 border-yellow-400 dark:bg-yellow-800 dark:border-yellow-600': 
        keyData.type === 'function',
    };
    
    return baseStyles;
  };

  return (
    <button
      type="button"
      data-type={keyData.type}
      className={clsx(
        keyVariants({
          width: keyData.width,
          pressed: isPressed,
          disabled,
        }),
        getKeyStyles(),
        className
      )}
      onMouseDown={handleMouseDown}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseLeave}
      onClick={handleClick}
      disabled={disabled}
      aria-label={keyData.label || keyData.key}
      {...props}
    >
      {getDisplayText()}
    </button>
  );
};
