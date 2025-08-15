import React from 'react';
import { clsx } from 'clsx';
import type { AutocompleteSuggestion } from '../types';

interface AutocompleteProps {
  suggestions: AutocompleteSuggestion[];
  activeSuggestionIndex: number;
  onSuggestionClick: (index: number) => void;
  show: boolean;
  className?: string;
}

export const Autocomplete: React.FC<AutocompleteProps> = ({
  suggestions,
  activeSuggestionIndex,
  onSuggestionClick,
  show,
  className,
}) => {
  if (!show || suggestions.length === 0) {
    return null;
  }

  return (
    <div className={clsx('autocomplete-container animate-suggestion-slide', className)}>
      {suggestions.map((suggestion, index) => (
        <div
          key={`${suggestion.text}-${index}`}
          className={clsx(
            'autocomplete-item',
            {
              'autocomplete-item-active': index === activeSuggestionIndex,
            }
          )}
          onClick={() => onSuggestionClick(index)}
          onMouseEnter={() => {
            // Optional: You could add a callback to update active index on hover
          }}
        >
          <span className="font-medium">{suggestion.text}</span>
          {suggestion.confidence && (
            <span className="ml-2 text-xs text-gray-500">
              {Math.round(suggestion.confidence * 100)}%
            </span>
          )}
        </div>
      ))}
    </div>
  );
};
