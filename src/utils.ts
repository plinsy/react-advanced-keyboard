import type { AutocompleteSuggestion } from './types';

// Common English words for autocomplete suggestions
export const commonWords = [
  'the', 'be', 'to', 'of', 'and', 'a', 'in', 'that', 'have', 'i', 'it', 'for', 'not', 'on', 'with',
  'he', 'as', 'you', 'do', 'at', 'this', 'but', 'his', 'by', 'from', 'they', 'she', 'or', 'an',
  'will', 'my', 'one', 'all', 'would', 'there', 'their', 'what', 'so', 'up', 'out', 'if', 'about',
  'who', 'get', 'which', 'go', 'me', 'when', 'make', 'can', 'like', 'time', 'no', 'just', 'him',
  'know', 'take', 'people', 'into', 'year', 'your', 'good', 'some', 'could', 'them', 'see', 'other',
  'than', 'then', 'now', 'look', 'only', 'come', 'its', 'over', 'think', 'also', 'back', 'after',
  'use', 'two', 'how', 'our', 'work', 'first', 'well', 'way', 'even', 'new', 'want', 'because',
  'any', 'these', 'give', 'day', 'most', 'us', 'is', 'was', 'are', 'been', 'has', 'had', 'were',
  'said', 'each', 'which', 'she', 'do', 'how', 'their', 'if', 'will', 'up', 'other', 'about',
  'out', 'many', 'then', 'them', 'these', 'so', 'some', 'her', 'would', 'make', 'like', 'into',
  'him', 'time', 'has', 'two', 'more', 'go', 'no', 'way', 'could', 'my', 'than', 'first', 'water',
  'been', 'call', 'who', 'its', 'now', 'find', 'long', 'down', 'day', 'did', 'get', 'come', 'made',
  'may', 'part', 'over', 'new', 'sound', 'take', 'only', 'little', 'work', 'know', 'place', 'year',
  'live', 'me', 'back', 'give', 'most', 'very', 'after', 'thing', 'our', 'name', 'good', 'sentence',
  'man', 'think', 'say', 'great', 'where', 'help', 'through', 'much', 'before', 'line', 'right',
  'too', 'mean', 'old', 'any', 'same', 'tell', 'boy', 'follow', 'came', 'want', 'show', 'also',
  'around', 'form', 'three', 'small', 'set', 'put', 'end', 'why', 'again', 'turn', 'here', 'off',
  'went', 'old', 'number', 'great', 'tell', 'men', 'say', 'small', 'every', 'found', 'still',
  'between', 'mane', 'should', 'home', 'big', 'give', 'air', 'line', 'set', 'own', 'under', 'read',
  'last', 'never', 'us', 'left', 'end', 'along', 'while', 'might', 'next', 'sound', 'below', 'saw',
  'something', 'thought', 'both', 'few', 'those', 'always', 'looked', 'show', 'large', 'often',
  'together', 'asked', 'house', 'dont', 'world', 'going', 'want', 'school', 'important', 'until',
  'form', 'food', 'keep', 'children', 'feet', 'land', 'side', 'without', 'boy', 'once', 'animal',
  'life', 'enough', 'took', 'four', 'head', 'above', 'kind', 'began', 'almost', 'live', 'page',
  'got', 'earth', 'need', 'far', 'hand', 'high', 'year', 'mother', 'light', 'country', 'father',
  'let', 'night', 'picture', 'being', 'study', 'second', 'soon', 'story', 'since', 'white', 'ever',
  'paper', 'hard', 'near', 'sentence', 'better', 'best', 'across', 'during', 'today', 'however',
  'sure', 'knew', 'its', 'try', 'told', 'young', 'sun', 'thing', 'whole', 'hear', 'example',
  'heard', 'several', 'change', 'answer', 'room', 'sea', 'against', 'top', 'turned', 'learn',
  'point', 'city', 'play', 'toward', 'five', 'himself', 'usually', 'money', 'seen', 'didnt',
  'car', 'morning', 'Im', 'body', 'upon', 'family', 'later', 'turn', 'move', 'face', 'door',
  'cut', 'done', 'group', 'true', 'leave', 'youll', 'font'
];

/**
 * Get autocomplete suggestions based on current input
 */
export function getDefaultSuggestions(
  input: string,
  maxSuggestions = 5
): AutocompleteSuggestion[] {
  if (!input || input.length < 1) {
    return [];
  }

  const lastWord = getLastWord(input);
  if (!lastWord || lastWord.length < 1) {
    return [];
  }

  const suggestions = commonWords
    .filter(word => 
      word.toLowerCase().startsWith(lastWord.toLowerCase()) && 
      word.toLowerCase() !== lastWord.toLowerCase()
    )
    .slice(0, maxSuggestions)
    .map(word => ({
      text: word,
      confidence: calculateConfidence(lastWord, word),
    }));

  return suggestions.sort((a, b) => (b.confidence || 0) - (a.confidence || 0));
}

/**
 * Extract the last word from the input string
 */
export function getLastWord(input: string): string {
  const words = input.trim().split(/\s+/);
  return words[words.length - 1] || '';
}

/**
 * Calculate confidence score for a suggestion
 */
export function calculateConfidence(input: string, suggestion: string): number {
  if (!input || !suggestion) return 0;
  
  const inputLower = input.toLowerCase();
  const suggestionLower = suggestion.toLowerCase();
  
  // Exact prefix match gets highest score
  if (suggestionLower.startsWith(inputLower)) {
    const lengthRatio = input.length / suggestion.length;
    return lengthRatio * 0.9 + 0.1; // 0.1 to 1.0 range
  }
  
  // Character similarity for fuzzy matching
  let matches = 0;
  for (let i = 0; i < Math.min(input.length, suggestion.length); i++) {
    if (inputLower[i] === suggestionLower[i]) {
      matches++;
    } else {
      break;
    }
  }
  
  return (matches / Math.max(input.length, suggestion.length)) * 0.5;
}

/**
 * Apply a suggestion to the current input
 */
export function applySuggestion(
  currentInput: string,
  suggestion: string
): string {
  const words = currentInput.trim().split(/\s+/);
  if (words.length === 0) {
    return suggestion + ' ';
  }
  
  // Replace the last word with the suggestion
  words[words.length - 1] = suggestion;
  return words.join(' ') + ' ';
}

/**
 * Debounce function for async suggestions
 */
export function debounce<T extends (...args: unknown[]) => unknown>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout;
  return (...args: Parameters<T>) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
}

/**
 * Filter and rank suggestions
 */
export function rankSuggestions(
  suggestions: AutocompleteSuggestion[],
  input: string,
  maxSuggestions = 5
): AutocompleteSuggestion[] {
  const lastWord = getLastWord(input);
  
  return suggestions
    .map(suggestion => ({
      ...suggestion,
      confidence: suggestion.confidence || calculateConfidence(lastWord, suggestion.text),
    }))
    .sort((a, b) => (b.confidence || 0) - (a.confidence || 0))
    .slice(0, maxSuggestions);
}
