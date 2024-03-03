/** @type {import('tailwindcss').Config} */

const colors = require('tailwindcss/colors')

module.exports = {
  content: [],
  theme: {
    extend: {
      colors: {
        ...colors
      }
    },
  },
  plugins: [],
}
module.exports = {
  // ...
  variants: {
    extend: {
      textOpacity: ['dark']
    }
  }
}

