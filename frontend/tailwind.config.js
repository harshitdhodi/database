/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{html,js,jsx}"],
  theme: {
    extend: {
      colors: {
        primary: 'var(--primary-color)',
        secondary: 'var(--secondary-color)',
        accent1: 'var(--accent1-color)',
        accent2: 'var(--accent2-color)',
      },
    },
  },
  plugins: [],
}