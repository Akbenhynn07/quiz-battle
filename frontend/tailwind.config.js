/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        neonBlue: '#00f3ff',
        neonPurple: '#9d00ff',
        neonGreen: '#39ff14',
        neonRed: '#ff003c',
        darkBg: '#050505',
        cardBg: 'rgba(20, 20, 30, 0.7)'
      }
    },
  },
  plugins: [],
}
