import type { KeyboardLayout } from './types';

export const qwertyLayout: KeyboardLayout = {
  rows: [
    // Number row
    [
      { key: '1', type: 'number' },
      { key: '2', type: 'number' },
      { key: '3', type: 'number' },
      { key: '4', type: 'number' },
      { key: '5', type: 'number' },
      { key: '6', type: 'number' },
      { key: '7', type: 'number' },
      { key: '8', type: 'number' },
      { key: '9', type: 'number' },
      { key: '0', type: 'number' },
      { key: 'Backspace', label: '⌫', width: 'wide', type: 'backspace' },
    ],
    // Top row
    [
      { key: 'q', type: 'letter' },
      { key: 'w', type: 'letter' },
      { key: 'e', type: 'letter' },
      { key: 'r', type: 'letter' },
      { key: 't', type: 'letter' },
      { key: 'y', type: 'letter' },
      { key: 'u', type: 'letter' },
      { key: 'i', type: 'letter' },
      { key: 'o', type: 'letter' },
      { key: 'p', type: 'letter' },
    ],
    // Middle row
    [
      { key: 'a', type: 'letter' },
      { key: 's', type: 'letter' },
      { key: 'd', type: 'letter' },
      { key: 'f', type: 'letter' },
      { key: 'g', type: 'letter' },
      { key: 'h', type: 'letter' },
      { key: 'j', type: 'letter' },
      { key: 'k', type: 'letter' },
      { key: 'l', type: 'letter' },
      { key: 'Enter', label: '↵', width: 'wide', type: 'enter' },
    ],
    // Bottom row
    [
      { key: 'Shift', label: '⇧', width: 'wide', type: 'shift' },
      { key: 'z', type: 'letter' },
      { key: 'x', type: 'letter' },
      { key: 'c', type: 'letter' },
      { key: 'v', type: 'letter' },
      { key: 'b', type: 'letter' },
      { key: 'n', type: 'letter' },
      { key: 'm', type: 'letter' },
      { key: ',', type: 'special' },
      { key: '.', type: 'special' },
    ],
    // Space row
    [
      { key: ' ', label: 'Space', width: 'extra-wide', type: 'space' },
    ],
  ],
};

export const numberPadLayout: KeyboardLayout = {
  rows: [
    [
      { key: '7', type: 'number' },
      { key: '8', type: 'number' },
      { key: '9', type: 'number' },
    ],
    [
      { key: '4', type: 'number' },
      { key: '5', type: 'number' },
      { key: '6', type: 'number' },
    ],
    [
      { key: '1', type: 'number' },
      { key: '2', type: 'number' },
      { key: '3', type: 'number' },
    ],
    [
      { key: '0', width: 'wide', type: 'number' },
      { key: '.', type: 'special' },
    ],
  ],
};

export const compactLayout: KeyboardLayout = {
  rows: [
    [
      { key: 'q', type: 'letter' },
      { key: 'w', type: 'letter' },
      { key: 'e', type: 'letter' },
      { key: 'r', type: 'letter' },
      { key: 't', type: 'letter' },
      { key: 'y', type: 'letter' },
      { key: 'u', type: 'letter' },
      { key: 'i', type: 'letter' },
      { key: 'o', type: 'letter' },
      { key: 'p', type: 'letter' },
      { key: 'Backspace', label: '⌫', type: 'backspace' },
    ],
    [
      { key: 'a', type: 'letter' },
      { key: 's', type: 'letter' },
      { key: 'd', type: 'letter' },
      { key: 'f', type: 'letter' },
      { key: 'g', type: 'letter' },
      { key: 'h', type: 'letter' },
      { key: 'j', type: 'letter' },
      { key: 'k', type: 'letter' },
      { key: 'l', type: 'letter' },
      { key: 'Enter', label: '↵', type: 'enter' },
    ],
    [
      { key: 'z', type: 'letter' },
      { key: 'x', type: 'letter' },
      { key: 'c', type: 'letter' },
      { key: 'v', type: 'letter' },
      { key: 'b', type: 'letter' },
      { key: 'n', type: 'letter' },
      { key: 'm', type: 'letter' },
      { key: ',', type: 'special' },
      { key: '.', type: 'special' },
      { key: ' ', label: 'Space', width: 'wide', type: 'space' },
    ],
  ],
};
