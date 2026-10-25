/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: [
    './index.html',
    './src/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        display: ['"Plus Jakarta Sans"', 'Inter', 'sans-serif'],
      },
      colors: {
        // emergency is an alias for rose — keeps all standard Tailwind variants
        emergency: {
          50:  '#fff1f2',
          100: '#ffe4e6',
          200: '#fecdd3',
          300: '#fda4af',
          400: '#fb7185',
          500: '#f43f5e',
          600: '#e11d48',
          700: '#be123c',
          800: '#9f1239',
          900: '#881337',
          950: '#4c0519',
        },
      },
      backgroundImage: {
        'hero-gradient': 'linear-gradient(135deg, #4c1d95 0%, #6d28d9 30%, #7c3aed 60%, #8b5cf6 100%)',
        'sos-gradient': 'linear-gradient(135deg, #be123c 0%, #e11d48 50%, #f43f5e 100%)',
        'safe-gradient': 'linear-gradient(135deg, #0d9488 0%, #14b8a6 100%)',
      },
      boxShadow: {
        'glow-violet': '0 0 40px rgba(124, 58, 237, 0.3)',
        'glow-red':    '0 0 40px rgba(225, 29, 72, 0.4)',
        'glow-teal':   '0 0 30px rgba(20, 184, 166, 0.3)',
        'card':        '0 4px 24px rgba(0, 0, 0, 0.08)',
        'card-hover':  '0 8px 40px rgba(0, 0, 0, 0.12)',
        'sos':         '0 0 0 8px rgba(225, 29, 72, 0.2), 0 8px 32px rgba(225, 29, 72, 0.4)',
      },
      animation: {
        'pulse-ring':     'pulse-ring 2s cubic-bezier(0.455, 0.03, 0.515, 0.955) infinite',
        'float':          'float 3s ease-in-out infinite',
        'slide-up':       'slide-up 0.3s ease-out',
        'fade-in':        'fade-in 0.2s ease-out',
        'bounce-subtle':  'bounce-subtle 2s ease-in-out infinite',
        'shimmer':        'shimmer 2s linear infinite',
      },
      keyframes: {
        'pulse-ring': {
          '0%':   { transform: 'scale(0.97)', opacity: '1'    },
          '50%':  { transform: 'scale(1.03)', opacity: '0.75' },
          '100%': { transform: 'scale(0.97)', opacity: '1'    },
        },
        'float': {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%':      { transform: 'translateY(-8px)' },
        },
        'slide-up': {
          '0%':   { transform: 'translateY(12px)', opacity: '0' },
          '100%': { transform: 'translateY(0)',    opacity: '1' },
        },
        'fade-in': {
          '0%':   { opacity: '0' },
          '100%': { opacity: '1' },
        },
        'bounce-subtle': {
          '0%, 100%': { transform: 'translateY(-2px)' },
          '50%':       { transform: 'translateY(2px)'  },
        },
        'shimmer': {
          '0%':   { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition:  '200% 0' },
        },
      },
      borderRadius: {
        '4xl': '2rem',
      },
    },
  },
  plugins: [],
}
