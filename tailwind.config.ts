import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        background: '#FAF7F2',
        card: '#FFFFFF',
        'accent-brown': '#8B7355',
        'accent-olive': '#6B8E4E',
        'text-primary': '#2D2D2D',
        'text-secondary': '#5D5D5D',
      },
      fontFamily: {
        raleway: ['var(--font-raleway)', 'sans-serif'],
        inter: ['var(--font-inter)', 'sans-serif'],
      },
      borderRadius: {
        'xl': '16px',
        '2xl': '20px',
      },
    },
  },
  plugins: [],
};
export default config;
