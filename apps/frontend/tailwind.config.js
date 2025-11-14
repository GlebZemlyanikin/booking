/** @type {import('tailwindcss').Config} */
export default {
    content: ['./index.html', './src/**/*.{js,jsx,ts,tsx}'],
    theme: {
        extend: {
            colors: {
                bg: 'rgb(var(--bg) / <alpha-value>)',
                card: 'rgb(var(--card) / <alpha-value>)',
                stroke: 'rgb(var(--stroke) / <alpha-value>)',
            },
        },
    },
    plugins: [],
};
