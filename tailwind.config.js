/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      animation: {
        'key-press': 'keyPress 0.1s ease-in-out',
        'suggestion-slide': 'suggestionSlide 0.2s ease-out',
      },
      keyframes: {
        keyPress: {
          '0%': { transform: 'scale(1)' },
          '50%': { transform: 'scale(0.95)' },
          '100%': { transform: 'scale(1)' },
        },
        suggestionSlide: {
          '0%': { opacity: '0', transform: 'translateY(-10px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
      },
      colors: {
        keyboard: {
          bg: '#f8f9fa',
          key: '#ffffff',
          'key-hover': '#e9ecef',
          'key-active': '#dee2e6',
          border: '#dee2e6',
          text: '#212529',
          'text-secondary': '#6c757d',
        },
      },
      fontFamily: {
        keyboard: ['ui-monospace', 'SFMono-Regular', 'monospace'],
      },
    },
  },
  plugins: [],
}
