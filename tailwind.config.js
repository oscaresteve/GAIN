/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./App.{js,jsx,ts,tsx}', './src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        custom: ['rubik'],
      },
      colors: {
        vermillion: '#FF3333',
        primary: {
          1: '#FF2400',
          2: '#FF5000',
        },
        night: {
          1: '#0D0D0D',
          2: '#1A1A1A',
          3: '#262626',
        },
        smoke: {
          1: '#F2F2F2',
          2: '#E6E6E6',
          3: '#D9D9D9',
        },
      },
    },
  },
  plugins: [],
}
