/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#f5f3ff',
          100: '#ede9fe',
          500: '#8b5cf6',
          600: '#7c3aed',
          700: '#6d28d9',
        },
        secondary: {
          50: '#f3f4f6',
          500: '#6b7280',
          600: '#4b5563',
        },
      },
    },
  },
  plugins: [require('@tailwindcss/forms')],
};
