/**
 * Test to verify the rapid typing fix
 * This test ensures that when characters are typed quickly,
 * they appear in the correct order in the text value.
 */

import { renderHook, act } from '@testing-library/react';
import { useKeyboard } from '../hooks/useKeyboard';

describe('Rapid Typing Fix', () => {
  it('should handle rapid key presses in correct order', async () => {
    const { result } = renderHook(() => useKeyboard({}));

    // Simulate rapid typing of 't' then 'y'
    act(() => {
      result.current.handleKeyPress('t');
    });

    act(() => {
      result.current.handleKeyPress('y');
    });

    // Characters should appear in correct order
    expect(result.current.value).toBe('ty');
  });

  it('should handle multiple rapid key presses correctly', async () => {
    const { result } = renderHook(() => useKeyboard({}));

    // Simulate typing "hello" rapidly
    act(() => {
      result.current.handleKeyPress('h');
      result.current.handleKeyPress('e');
      result.current.handleKeyPress('l');
      result.current.handleKeyPress('l');
      result.current.handleKeyPress('o');
    });

    expect(result.current.value).toBe('hello');
  });

  it('should maintain cursor position during rapid typing', async () => {
    const { result } = renderHook(() => useKeyboard({}));

    // Type some text
    act(() => {
      result.current.handleKeyPress('a');
      result.current.handleKeyPress('b');
    });

    // Check that cursor is at the end
    expect(result.current.selection.start).toBe(2);
    expect(result.current.selection.end).toBe(2);
    expect(result.current.value).toBe('ab');
  });

  it('should handle backspace during rapid typing', async () => {
    const { result } = renderHook(() => useKeyboard({}));

    // Type and then backspace rapidly
    act(() => {
      result.current.handleKeyPress('a');
      result.current.handleKeyPress('b');
      result.current.handleKeyPress('Backspace');
    });

    expect(result.current.value).toBe('a');
    expect(result.current.selection.start).toBe(1);
  });
});
