import type { KeyboardConfig, KeyboardLayout } from './types';
import { availableLayouts } from './layouts';

/**
 * Get the recommended keyboard layout based on configuration
 */
export function getRecommendedLayout(config: KeyboardConfig): KeyboardLayout {
  const { layout, platform } = config;
  
  // Try to find platform-specific layout first
  const platformSpecificKey = `${layout}${platform === 'mac' ? 'Mac' : platform === 'windows' ? 'Windows' : ''}`;
  const platformLayout = availableLayouts[platformSpecificKey as keyof typeof availableLayouts];
  
  if (platformLayout) {
    return platformLayout;
  }
  
  // Fall back to generic layout
  const genericLayout = availableLayouts[layout as keyof typeof availableLayouts];
  if (genericLayout) {
    return genericLayout;
  }
  
  // Ultimate fallback
  return availableLayouts.qwerty;
}

/**
 * Get the default keyboard configuration for a platform
 */
export function getDefaultConfig(platform: 'windows' | 'mac' = 'windows'): KeyboardConfig {
  return {
    layout: 'qwerty',
    platform,
    showFunctionKeys: true,
    showModifierKeys: true,
    showNumpad: false,
    showArrowKeys: false,
  };
}

/**
 * Detect platform from user agent (for initial setup)
 */
export function detectPlatform(): 'windows' | 'mac' {
  if (typeof window !== 'undefined') {
    const userAgent = window.navigator.userAgent.toLowerCase();
    if (userAgent.includes('mac')) {
      return 'mac';
    }
  }
  return 'windows';
}

/**
 * Get layout variants for a specific layout type
 */
export function getLayoutVariants(layoutType: 'qwerty' | 'azerty' | 'dvorak'): KeyboardLayout[] {
  return Object.values(availableLayouts).filter(layout => layout.type === layoutType);
}

/**
 * Check if a layout supports a specific feature
 */
export function layoutSupportsFeature(layout: KeyboardLayout, feature: 'functionKeys' | 'modifierKeys'): boolean {
  switch (feature) {
    case 'functionKeys':
      // Check if layout has function keys (typically first row for full layouts)
      return layout.platform !== 'universal' && layout.rows.length > 4;
    case 'modifierKeys':
      // Check if layout has modifier keys
      return layout.rows.some(row => 
        row.some(key => key.type === 'modifier')
      );
    default:
      return false;
  }
}

/**
 * Create a custom keyboard configuration
 */
export function createCustomConfig(
  layout: 'qwerty' | 'azerty' | 'dvorak',
  platform: 'windows' | 'mac',
  features: Partial<Pick<KeyboardConfig, 'showFunctionKeys' | 'showModifierKeys' | 'showNumpad' | 'showArrowKeys'>> = {}
): KeyboardConfig {
  return {
    layout,
    platform,
    showFunctionKeys: features.showFunctionKeys ?? true,
    showModifierKeys: features.showModifierKeys ?? true,
    showNumpad: features.showNumpad ?? false,
    showArrowKeys: features.showArrowKeys ?? false,
  };
}
