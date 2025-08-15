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
    onPress?.(keyData.key);
  };

  const getDisplayText = () => {
    if (keyData.label) return keyData.label;
    
    if (keyData.type === 'letter') {
      const shouldCapitalize = isShiftPressed || isCapsLockOn;
      return shouldCapitalize ? keyData.key.toUpperCase() : keyData.key;
    }

    return keyData.key;
  };

  const getKeyVariant = () => {
    switch (keyData.type) {
      case 'shift':
        return isShiftPressed ? 'pressed' : 'normal';
      default:
        return 'normal';
    }
  };

  return (
    <button
      type="button"
      className={clsx(
        keyVariants({
          width: keyData.width,
          pressed: isPressed,
          disabled,
        }),
        {
          'bg-blue-200 border-blue-400': keyData.type === 'shift' && isShiftPressed,
        },
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
