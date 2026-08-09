/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{html,ts}",
  ],
  theme: {
    extend: {
      colors: {
        accent: {
          DEFAULT: '#2563eb',
          hover: '#1d4ed8',
        },
        warm: {
          50: '#fafaf7',
          100: '#f5f4ed',
        },
      },
    },
  },
  plugins: [],
}