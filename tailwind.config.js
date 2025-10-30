/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        pink: {
          50: '#fdf2f8',
          100: '#fce7f3',
          200: '#fbcfe8',
        },
        purple: {
          50: '#faf5ff',
        },
      },
      animation: {
        pulseGlow: 'pulseGlow 2s infinite ease-in-out',
        auraGlow: 'auraGlow 3s infinite ease-in-out',
      },
      keyframes: {
        pulseGlow: {
          '0%, 100%': { filter: 'brightness(1)' },
          '50%': { filter: 'brightness(1.4)' },
        },
        auraGlow: {
          '0%': { filter: 'drop-shadow(0 0 4px #ff80ff)' },
          '50%': { filter: 'drop-shadow(0 0 12px #ff00ff)' },
          '100%': { filter: 'drop-shadow(0 0 4px #ff80ff)' },
        }
      },
    },
  },
  plugins: [],
  darkMode: 'class',
}
