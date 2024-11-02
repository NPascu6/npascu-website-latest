/** @type {import('tailwindcss').Config} */
const defaultTheme = require('tailwindcss/defaultTheme')

module.exports = {
    content: [
        "./index.html",
        "./src/**/**/*.{js,ts,jsx,tsx}",
        "./node_modules/react-tailwindcss-datepicker/dist/index.esm.js"
    ],
    theme: {
        screens: {
            'xs': '275px',
            ...defaultTheme.screens,
        },
        extend: {},
    },
    plugins: [],
}

