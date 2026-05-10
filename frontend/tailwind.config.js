/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx}"
  ],
  theme: {
    extend: {
      fontFamily: {
        display: ['Cormorant Garamond', 'Georgia', 'serif'],
        body: ['Outfit', 'system-ui', 'sans-serif'],
      },
      colors: {
        night: {
          DEFAULT: '#0f0d0b',
          secondary: '#151210',
          elevated: '#1d1915',
          surface: '#252019',
        },
        ash: {
          DEFAULT: '#38302a',
          subtle: '#2a2320',
        },
        ember: {
          DEFAULT: '#e09040',
          hover: '#cc7e2e',
          dark: '#a86520',
          dim: 'rgba(224,144,64,0.18)',
        },
        cream: {
          DEFAULT: '#f2ece0',
          secondary: '#a89478',
          muted: '#5c4e42',
        },
      },
      animation: {
        'page-in':    'pageIn 0.45s ease-out both',
        'float-up':   'floatUp 0.55s ease-out both',
        'scale-in':   'scaleIn 0.4s cubic-bezier(0.34,1.56,0.64,1) both',
        'badge-pop':  'badgePop 0.4s cubic-bezier(0.34,1.56,0.64,1) both',
        'pulse-warm': 'pulseWarm 2s cubic-bezier(0.4,0,0.6,1) infinite',
        shimmer:      'shimmer 1.6s ease-in-out infinite',
      },
      keyframes: {
        pageIn:    { from: { opacity:'0', transform:'translateY(14px)' }, to: { opacity:'1', transform:'translateY(0)' } },
        floatUp:   { from: { opacity:'0', transform:'translateY(22px)' }, to: { opacity:'1', transform:'translateY(0)' } },
        scaleIn:   { from: { opacity:'0', transform:'scale(0.92)' }, to: { opacity:'1', transform:'scale(1)' } },
        badgePop:  { '0%':{ opacity:'0', transform:'scale(0) rotate(-180deg)' }, '50%':{ transform:'scale(1.2) rotate(5deg)' }, '100%':{ opacity:'1', transform:'scale(1) rotate(0)' } },
        pulseWarm: { '0%,100%':{ opacity:'1' }, '50%':{ opacity:'0.55' } },
        shimmer:   { '0%':{ backgroundPosition:'-200% 0' }, '100%':{ backgroundPosition:'200% 0' } },
      },
      boxShadow: {
        ember: '0 4px 24px rgba(224,144,64,0.22)',
        'ember-lg': '0 8px 40px rgba(224,144,64,0.28)',
        card: '0 2px 16px rgba(0,0,0,0.4)',
        'card-hover': '0 8px 32px rgba(0,0,0,0.55)',
      },
    },
  },
  plugins: [],
};
