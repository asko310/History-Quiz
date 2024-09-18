/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{html,js}"],
  theme: {
    extend: {
      colors:{
        'primary':'#030303',
        'secondary' : '#f4f3ee',
        'primWhite' : '#ffffff',
        'highlight' : '#f9550b',
        'highlight2': '#bcc452'
      }
    },
  },
  plugins: [],
}

