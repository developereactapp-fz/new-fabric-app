/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#faf5f0',
          100: '#f5ebe5',
          200: '#ebd7cb',
          300: '#e0c3b0',
          400: '#d4a896',
          500: '#c98e7c',
          600: '#a67056',
          700: '#7a3f43',
          800: '#5b3432',
          900: '#3c2825',
        },
        accent: {
          50: '#faf0f5',
          100: '#f5dce7',
          200: '#ebc3d4',
          300: '#dfa0bf',
          400: '#d47da9',
          500: '#c95a93',
          600: '#a01f7c',
          700: '#8c1565',
          800: '#6b0f4d',
          900: '#4a0a35',
        },
      },
      screens: {
        'xs': '320px',
        'sm': '640px',
        'md': '768px',
        'lg': '1024px',
        'xl': '1280px',
        '2xl': '1536px',
      },
      spacing: {
        'safe-top': 'env(safe-area-inset-top)',
        'safe-right': 'env(safe-area-inset-right)',
        'safe-bottom': 'env(safe-area-inset-bottom)',
        'safe-left': 'env(safe-area-inset-left)',
      },
    },
  },
  plugins: [
    require('@tailwindcss/vite'),
    require('tailwindcss-animate'),
  ],
}
