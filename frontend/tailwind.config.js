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
        navy: {
          950: '#060B14',
          900: '#0A1120',
          800: '#0F1A2E',
          700: '#1A2942',
          600: '#263B5D',
        },
        teal: {
          500: '#14B8A6',
          600: '#0D9488',
          700: '#0F766E',
        },
        sky: {
          400: '#38BDF8',
          500: '#0EA5E9',
          600: '#0284C7',
        },
        warning: {
          red: '#DC2626',
          amber: '#D97706',
          green: '#059669',
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'Segoe UI', 'Roboto', 'sans-serif'],
      }
    },
  },
  plugins: [],
}
