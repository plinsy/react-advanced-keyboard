import { useEffect, useRef, useState, type FC } from 'react'
import { cva, type VariantProps } from 'class-variance-authority'
import { clsx } from 'clsx'
import type { KeyboardKey } from '../types'

const keyVariants = cva('keyboard-key', {
  variants: {
    width: {
      normal: '',
      wide: 'keyboard-key-wide',
      'extra-wide': 'keyboard-key-extra-wide'
    },
    pressed: {
      true: 'scale-95 bg-keyboard-key-active',
      false: ''
    },
    disabled: {
      true: 'opacity-50 cursor-not-allowed',
      false: ''
    }
  },
  defaultVariants: {
    width: 'normal',
    pressed: false,
    disabled: false
  }
})

interface KeyProps extends VariantProps<typeof keyVariants> {
  keyData: KeyboardKey
  onPress?: (key: string) => void
  onLongPress?: (key: string) => void
  isShiftPressed?: boolean
  isCapsLockOn?: boolean
  isCtrlPressed?: boolean
  isAltPressed?: boolean
  isMetaPressed?: boolean
  disabled?: boolean
  className?: string
}

export const Key: FC<KeyProps> = ({
  keyData,
  onPress,
  onLongPress,
  isShiftPressed = false,
  isCapsLockOn = false,
  isCtrlPressed = false,
  isAltPressed = false,
  isMetaPressed = false,
  disabled = false,
  className,
  ...props
}) => {
  const [isPressed, setIsPressed] = useState(false)
  const [isLongPressing, setIsLongPressing] = useState(false)
  const longPressTimeoutRef = useRef<NodeJS.Timeout | null>(null)
  const longPressIntervalRef = useRef<NodeJS.Timeout | null>(null)

  const clearLongPressTimers = () => {
    if (longPressTimeoutRef.current) {
      clearTimeout(longPressTimeoutRef.current)
      longPressTimeoutRef.current = null
    }
    if (longPressIntervalRef.current) {
      clearInterval(longPressIntervalRef.current)
      longPressIntervalRef.current = null
    }
  }

  const startLongPress = () => {
    if (keyData.key !== 'Backspace') return

    // Start long press after 500ms
    longPressTimeoutRef.current = setTimeout(() => {
      setIsLongPressing(true)
      // Initial long press action
      onLongPress?.(keyData.key)
      // Repeat backspace every 150ms while pressed (progressive speed)
      let interval = 150
      longPressIntervalRef.current = setInterval(() => {
        onLongPress?.(keyData.key)
        // Gradually increase speed (decrease interval) up to 50ms
        if (interval > 50) {
          interval = Math.max(50, interval - 10)
          clearInterval(longPressIntervalRef.current!)
          longPressIntervalRef.current = setInterval(() => {
            onLongPress?.(keyData.key)
          }, interval)
        }
      }, interval)
    }, 500)
  }

  const handleMouseDown = (e: React.MouseEvent) => {
    if (disabled) return
    
    // Prevent default behavior to avoid focus loss
    e.preventDefault()
    
    setIsPressed(true)
    startLongPress()
  }

  const handleMouseUp = () => {
    setIsPressed(false)
    setIsLongPressing(false)
    clearLongPressTimers()
  }

  const handleMouseLeave = () => {
    setIsPressed(false)
    setIsLongPressing(false)
    clearLongPressTimers()
  }

  const handleTouchStart = (e: React.TouchEvent) => {
    if (disabled) return
    
    // Prevent default behavior to avoid focus loss
    e.preventDefault()
    
    setIsPressed(true)
    startLongPress()
  }

  const handleTouchEnd = () => {
    setIsPressed(false)
    setIsLongPressing(false)
    clearLongPressTimers()
  }

  const handleClick = (e: React.MouseEvent) => {
    if (disabled) return
    
    // Prevent default behavior to avoid focus loss
    e.preventDefault()
    
    // Only fire single click if not in long press mode
    if (!isLongPressing) {
      onPress?.(getKeyToSend())
    }
  }

  // Cleanup timers on unmount
  useEffect(() => {
    return () => {
      clearLongPressTimers()
    }
  }, [])

  const getDisplayText = () => {
    if (keyData.label) return keyData.label

    // Handle shift key combinations
    if (keyData.shiftKey && isShiftPressed) {
      return keyData.shiftKey
    }

    if (keyData.type === 'letter') {
      const shouldCapitalize = isShiftPressed || isCapsLockOn
      return shouldCapitalize ? keyData.key.toUpperCase() : keyData.key
    }

    return keyData.key
  }

  const getKeyToSend = () => {
    // Send the shift key combination if shift is pressed and available
    if (keyData.shiftKey && isShiftPressed) {
      return keyData.shiftKey
    }

    if (keyData.type === 'letter') {
      const shouldCapitalize = isShiftPressed || isCapsLockOn
      return shouldCapitalize ? keyData.key.toUpperCase() : keyData.key
    }

    return keyData.key
  }

  const isModifierActive = () => {
    switch (keyData.key) {
      case 'Shift':
        return isShiftPressed
      case 'CapsLock':
        return isCapsLockOn
      case 'Control':
        return isCtrlPressed
      case 'Alt':
        return isAltPressed
      case 'Meta':
        return isMetaPressed
      default:
        return false
    }
  }

  const getKeyStyles = () => {
    const isActive = isModifierActive()

    const baseStyles = {
      'bg-blue-200 border-blue-400 dark:bg-blue-800 dark:border-blue-600':
        isActive,
      'bg-green-200 border-green-400 dark:bg-green-800 dark:border-green-600':
        keyData.type === 'modifier' && !isActive,
      'bg-yellow-200 border-yellow-400 dark:bg-yellow-800 dark:border-yellow-600':
        keyData.type === 'function'
    }

    return baseStyles
  }

  return (
    <button
      type="button"
      data-type={keyData.type}
      className={clsx(
        keyVariants({
          width: keyData.width,
          pressed: isPressed,
          disabled
        }),
        getKeyStyles(),
        className
      )}
      onMouseDown={handleMouseDown}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseLeave}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
      onClick={handleClick}
      disabled={disabled}
      tabIndex={-1}
      aria-label={keyData.label || keyData.key}
      {...props}>
      {getDisplayText()}
    </button>
  )
}
