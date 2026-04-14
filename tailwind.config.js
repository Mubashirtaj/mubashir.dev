/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
  ],
 theme: {
  extend: {
    colors: {
        bg: "var(--bg-color)",
        text: "var(--text-color)",
        primary: "var(--primary-color)",
        secondary: "var(--secondary-color)",
        hover: "var(--primary-hover)",
      },
    keyframes: {
      float: {
        '0%, 100%': { transform: 'translateY(0px)' },
        '50%':       { transform: 'translateY(-6px)' },
      },
    },
    animation: {
      float: 'float 3.5s ease-in-out infinite',
    },
  },
},
  plugins: [],
}