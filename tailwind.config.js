/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        'pastel-1': '#C4DFDF',
        'pastel-2': '#D2E9E9',
        'pastel-3': '#E3F4F4',
        'pastel-4': '#F8F6F4',
        'dark-bg': '#1a1a2e',
        'dark-nav': '#16213e',
        'dark-card': '#0f3460',
      },
      fontFamily: {
        'mono': ['Courier New', 'monospace'],
      },
    },
  },
  plugins: [],
}
