/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./App.{js,jsx,ts,tsx}', './src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        'rubik-regular': 'Rubik-Regular',
        'rubik-medium': 'Rubik-Medium',
        'rubik-bold': 'Rubik-Bold',
        'rubik-italic': 'Rubik-Italic',
      },
      colors: {
        vermillion: '#FF0000',
        officeGreen: '#008000',
        primary: {
          1: '#FF2400',
          2: '#FF5000',
        },
        night: {
          1: '#000000',
          2: '#0A0A0A',
          3: '#141414',
        },
        smoke: {
          1: '#FFFFFF',
          2: '#FAFAFA',
          3: '#F2F2F2',
        },
      },
    },
  },
  plugins: [],
}
