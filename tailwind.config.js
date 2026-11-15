/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        dark: {
          950: '#07080b',
          900: '#0b0d13',
          850: '#0f121a',
          800: '#141824',
          750: '#1a2030',
          700: '#22293d',
        },
        brand: {
          50: '#ecfdf5',
          100: '#d1fae5',
          200: '#a7f3d0',
          300: '#6ee7b7',
          400: '#34d399',
          500: '#10b981',
          600: '#059669',
          neon: '#00E676',
        },
        trail: {
          50: '#fdf6ef',
          100: '#fbead9',
          200: '#f5d0b0',
          300: '#e5a976',
          400: '#d48446',
          500: '#b8682d',
          600: '#98501e',
        }
      },
      fontFamily: {
        sans: ['Plus Jakarta Sans', 'Inter', 'system-ui', '-apple-system', 'sans-serif'],
        mono: ['JetBrains Mono', 'ui-monospace', 'monospace'],
      },
      boxShadow: {
        'glow-sm': '0 0 15px -3px rgba(16, 185, 129, 0.2)',
        'glow-md': '0 0 30px -5px rgba(16, 185, 129, 0.3)',
        'card': '0 4px 24px -2px rgba(0, 0, 0, 0.6)',
      },
      backgroundImage: {
        'grid-pattern': "radial-gradient(rgba(255, 255, 255, 0.08) 1px, transparent 1px)",
      }
    },
  },
  plugins: [],
}
