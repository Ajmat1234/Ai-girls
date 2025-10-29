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
          // ... add more if needed, but defaults enough
        },
        purple: {
          50: '#faf5ff',
          // ...
        },
      },
    },
  },
  plugins: [],
  darkMode: 'class',  // Optional, agar dark theme chahiye
}
