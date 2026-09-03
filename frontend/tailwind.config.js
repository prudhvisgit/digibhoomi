/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        gov: {
          blue: '#0F2C59',
          navy: '#0A192F',
          gold: '#D4AF37',
          saffron: '#FF9933',
          green: '#138808',
          light: '#F8FAFC',
          card: '#FFFFFF',
          border: '#E2E8F0'
        }
      }
    },
  },
  plugins: [],
}
