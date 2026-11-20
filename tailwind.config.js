/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        dm: {
          black: '#171717',
          graphite: '#262626',
          ivory: '#F1EBDD',
          white: '#FAF9F6',
          gold: '#B49A68',
          bronze: '#806747',
        }
      },
      fontFamily: {
        serif: ['"Cinzel"', 'serif'], // <-- Fonte trocada para combinar com a Logo
        sans: ['"Inter"', 'sans-serif'],
      },
      boxShadow: {
        'premium': '0 4px 20px -2px rgba(23, 23, 23, 0.05)',
      }
    },
  },
  plugins: [],
}