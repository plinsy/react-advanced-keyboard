import React from 'react';
import type { KeyboardConfig, KeyboardLayout } from '../types';
import { availableLayouts } from '../layouts';
import { getRecommendedLayout as getRecommendedLayoutUtil, detectPlatform } from '../keyboardUtils';

interface KeyboardConfiguratorProps {
  config: KeyboardConfig;
  onConfigChange: (config: KeyboardConfig) => void;
  currentLayout: KeyboardLayout;
  onLayoutChange: (layout: KeyboardLayout) => void;
}

export const KeyboardConfigurator: React.FC<KeyboardConfiguratorProps> = ({
  config,
  onConfigChange,
  currentLayout,
  onLayoutChange,
}) => {
  const handleConfigChange = (key: keyof KeyboardConfig, value: any) => {
    const newConfig = { ...config, [key]: value };
    onConfigChange(newConfig);
    
    // Auto-select appropriate layout based on config
    if (key === 'layout' || key === 'platform') {
      const layoutKey = `${newConfig.layout}${newConfig.platform === 'mac' ? 'Mac' : newConfig.platform === 'windows' ? 'Windows' : ''}`;
      const newLayout = availableLayouts[layoutKey as keyof typeof availableLayouts] || 
                       availableLayouts[newConfig.layout as keyof typeof availableLayouts] ||
                       availableLayouts.qwerty;
      onLayoutChange(newLayout);
    }
  };

  const getRecommendedLayout = () => {
    return getRecommendedLayoutUtil(config);
  };

  return (
    <div className="bg-white rounded-lg p-6 shadow-lg">
      <h2 className="text-xl font-semibold mb-4">Keyboard Configuration</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Layout Type */}
        <div>
          <label className="block text-sm font-medium mb-2 text-gray-700">Layout Type</label>
          <select 
            value={config.layout}
            onChange={(e) => handleConfigChange('layout', e.target.value as any)}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="qwerty">QWERTY</option>
            <option value="azerty">AZERTY (French)</option>
            <option value="dvorak">Dvorak</option>
          </select>
        </div>

        {/* Platform */}
        <div>
          <label className="block text-sm font-medium mb-2 text-gray-700">Platform</label>
          <select 
            value={config.platform}
            onChange={(e) => handleConfigChange('platform', e.target.value as any)}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="windows">Windows/PC</option>
            <option value="mac">Mac</option>
          </select>
        </div>

        {/* Layout Variant */}
        <div>
          <label className="block text-sm font-medium mb-2 text-gray-700">Layout Variant</label>
          <select 
            value={Object.keys(availableLayouts).find(key => availableLayouts[key as keyof typeof availableLayouts] === currentLayout) || 'qwerty'}
            onChange={(e) => onLayoutChange(availableLayouts[e.target.value as keyof typeof availableLayouts])}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            {Object.entries(availableLayouts).map(([key, layout]) => (
              <option key={key} value={key}>{(layout as KeyboardLayout).name}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Feature Toggles */}
      <div className="mt-6">
        <h3 className="text-lg font-medium mb-3 text-gray-700">Features</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <label className="flex items-center space-x-2 cursor-pointer">
            <input
              type="checkbox"
              checked={config.showFunctionKeys}
              onChange={(e) => handleConfigChange('showFunctionKeys', e.target.checked)}
              className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
            />
            <span className="text-sm text-gray-700">Function Keys (F1-F12)</span>
          </label>

          <label className="flex items-center space-x-2 cursor-pointer">
            <input
              type="checkbox"
              checked={config.showModifierKeys}
              onChange={(e) => handleConfigChange('showModifierKeys', e.target.checked)}
              className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
            />
            <span className="text-sm text-gray-700">Modifier Keys (Ctrl, Alt, etc.)</span>
          </label>

          <label className="flex items-center space-x-2 cursor-pointer">
            <input
              type="checkbox"
              checked={config.showNumpad}
              onChange={(e) => handleConfigChange('showNumpad', e.target.checked)}
              className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
            />
            <span className="text-sm text-gray-700">Number Pad</span>
          </label>

          <label className="flex items-center space-x-2 cursor-pointer">
            <input
              type="checkbox"
              checked={config.showArrowKeys}
              onChange={(e) => handleConfigChange('showArrowKeys', e.target.checked)}
              className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
            />
            <span className="text-sm text-gray-700">Arrow Keys</span>
          </label>
        </div>
      </div>

      {/* Layout Info */}
      <div className="mt-4 p-4 bg-blue-50 rounded-lg">
        <div className="flex items-center justify-between">
          <div>
            <h4 className="font-medium text-blue-900">Current Layout</h4>
            <p className="text-sm text-blue-700">{currentLayout.name}</p>
            <p className="text-xs text-blue-600">
              Platform: {currentLayout.platform} • Type: {currentLayout.type}
            </p>
          </div>
          {getRecommendedLayout() !== currentLayout && (
            <button
              onClick={() => onLayoutChange(getRecommendedLayout())}
              className="px-3 py-1 bg-blue-600 text-white text-xs rounded hover:bg-blue-700"
            >
              Use Recommended
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
