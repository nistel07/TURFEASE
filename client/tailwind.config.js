/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'black-opacity-50': 'rgba(0,0,0,0.5)',
      },
    },
  },
  plugins: [],
}