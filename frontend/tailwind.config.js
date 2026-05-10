/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx}"
  ],
  theme: {
    extend: {
      fontFamily: {
        display: ['Playfair Display', 'Georgia', 'serif'],
        body: ['Inter', 'system-ui', 'sans-serif'],
      },
      colors: {
        sage: {
          50: '#f4f6f4',
          100: '#e3e8e3',
          200: '#c7d2c7',
          300: '#a3b4a2',
          400: '#7e937d',
          500: '#627761',
          600: '#4d5d4d',
          700: '#404c40',
          800: '#343f35',
          900: '#2b342d',
          DEFAULT: '#7e937d',
        },
        sand: {
          50: '#fdfcfb',
          100: '#f9f8f5',
          200: '#f1eee7',
          300: '#e5dfd3',
          400: '#d5c9b6',
          500: '#c1b096',
          600: '#b09b7d',
          700: '#937f65',
          800: '#7a6a56',
          900: '#635647',
          DEFAULT: '#f9f8f5',
        },
        forest: {
          DEFAULT: '#2b342d',
          light: '#4d5d4d',
          muted: '#737b70'
        },
        earth: {
          DEFAULT: '#a6927b',
          light: '#c2b3a1'
        }
      },
      animation: {
        'shimmer': 'shimmer 1.6s ease-in-out infinite',
      },
      keyframes: {
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' }
        },
      },
      boxShadow: {
        'soft': '0 10px 40px -10px rgba(0,0,0,0.05)',
        'float': '0 20px 40px -20px rgba(0,0,0,0.08)',
        'glass': '0 8px 32px 0 rgba(31, 38, 135, 0.05)',
      }
    },
  },
  plugins: [],
};
