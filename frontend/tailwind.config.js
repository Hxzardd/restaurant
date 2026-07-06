/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx}"
  ],
  theme: {
    extend: {
      fontFamily: {
        display: ['"Bricolage Grotesque"', 'Georgia', 'serif'],
        body: ['"Instrument Sans"', 'system-ui', 'sans-serif'],
      },
      colors: {
        // Warm neutral base
        cream: {
          DEFAULT: '#FAF5EE',
          dark: '#F1E9DD',
        },
        // Near-black espresso text
        ink: {
          DEFAULT: '#201A16',
          soft: '#6B615A',
        },
        // Primary accent — CTAs, prices, active states
        paprika: {
          50: '#FDF0EC',
          100: '#F9DCD3',
          500: '#C8401F',
          600: '#A83318',
          700: '#8A2A14',
          DEFAULT: '#C8401F',
        },
        // Secondary accent — chips, veg badge, highlights
        olive: {
          50: '#F2F4E8',
          100: '#E4E9D2',
          600: '#6B7F3E',
          700: '#556632',
          DEFAULT: '#6B7F3E',
        },
        // Warm border tone
        linen: '#E8DFD2',
      },
      animation: {
        'shimmer': 'shimmer 1.6s ease-in-out infinite',
        'fade-up': 'fade-up 0.5s ease-out both',
      },
      keyframes: {
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' }
        },
        'fade-up': {
          '0%': { opacity: '0', transform: 'translateY(16px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' }
        },
      },
      boxShadow: {
        'card': '0 1px 2px rgba(32, 26, 22, 0.04), 0 8px 24px -12px rgba(32, 26, 22, 0.12)',
        'lift': '0 2px 4px rgba(32, 26, 22, 0.06), 0 16px 32px -12px rgba(32, 26, 22, 0.18)',
      }
    },
  },
  plugins: [],
};
