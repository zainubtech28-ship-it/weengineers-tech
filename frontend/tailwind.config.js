/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        bg: '#07070a',
        s1: '#0d0d11',
        s2: '#131318',
        ln: '#2e2614',
        gold: {
          DEFAULT: '#e8b84a',
          50: '#fffbf0',
          100: '#fff2c4',
          200: '#ffe58f',
          300: '#ffd666',
          400: '#f5c342',
          500: '#e8b84a',
          600: '#c69527',
          700: '#a87a1c',
          800: '#875d14',
          900: '#5c3e08',
        },
        tx: '#f4efe4',
        mu: '#a29c8c',
        brand: {
          50: '#fffbf0',
          100: '#fff2c4',
          200: '#ffe58f',
          300: '#ffd666',
          400: '#f5c342',
          500: '#e8b84a',
          600: '#c69527',
          700: '#a87a1c',
          800: '#875d14',
          900: '#5c3e08',
          950: '#07070a',
        },
        navy: {
          800: '#131318',
          900: '#0d0d11',
          950: '#07070a',
        },
        surface: {
          DEFAULT: '#131318',
          subtle: '#0d0d11',
          muted: '#181820',
          border: '#2e2614',
        }
      },
      fontFamily: {
        sans: ['Inter', 'Plus Jakarta Sans', 'system-ui', 'sans-serif'],
        heading: ['Outfit', 'Inter', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        'subtle': '0 1px 2px 0 rgba(0, 0, 0, 0.4)',
        'gold-glow': '0 0 0 1px rgba(232,184,74,.25), 0 16px 40px rgba(0,0,0,.5)',
        'gold-button': '0 10px 28px rgba(232,184,74,.28)',
        'card': '0 4px 20px -2px rgba(0, 0, 0, 0.5), 0 2px 6px -1px rgba(0, 0, 0, 0.3)',
        'card-hover': '0 0 0 1px rgba(232, 184, 74, 0.25), 0 16px 40px rgba(0, 0, 0, 0.5)',
        'elevated': '0 20px 40px -15px rgba(0, 0, 0, 0.7)',
      }
    },
  },
  plugins: [],
}
