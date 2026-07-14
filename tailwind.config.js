/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#D96C8F',
          hover: '#C25A7C',
          light: '#F7E8EC'
        },
        background: '#FFFDFB',
        textMain: '#2E2E2E',
        textMuted: '#666666',
        textLight: '#EAEAEA',
        success: '#4CAF50',
        error: '#E53935',
        gray: {
          50: '#fafafa',
          100: '#f4f4f5',
          200: '#e4e4e7',
          300: '#d4d4d8',
          800: '#27272a',
          900: '#18181b',
        }
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        serif: ['"Playfair Display"', 'serif'],
        logo: ['"Tangerine"', 'cursive'],
      },
      boxShadow: {
        'soft': '0 4px 20px -2px rgba(0, 0, 0, 0.05)',
        'hover': '0 10px 30px -5px rgba(217, 108, 143, 0.15)',
      }
    },
  },
  plugins: [],
}
