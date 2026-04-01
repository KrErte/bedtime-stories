/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{html,ts}"],
  theme: {
    extend: {
      colors: {
        navy: {
          50: '#f0f1ff',
          100: '#e0e3ff',
          200: '#c7caff',
          300: '#a3a7fd',
          400: '#7c7df9',
          500: '#6366f1',
          600: '#4f46e5',
          700: '#3730a3',
          800: '#1e1b4b',
          900: '#0f0d2e',
          950: '#080720',
        },
        story: {
          purple: '#7c3aed',
          pink: '#ec4899',
          gold: '#f59e0b',
        }
      },
      fontFamily: {
        serif: ['Merriweather', 'Georgia', 'serif'],
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
};
