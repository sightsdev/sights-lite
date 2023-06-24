/** @type {import('tailwindcss').Config} */
module.exports = {
    content: ["./src/**/*.{js,jsx,ts,tsx}"],
    theme: {
        extend: {
            transitionProperty: {
                'width': 'width'
            },
        },
    },
    plugins: [

    ],
    safelist: [
        {
            pattern: /grid-cols-([12345678])/, // Need for runtime padding on tree menu items
        }
    ]
}

