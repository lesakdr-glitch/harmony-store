import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        brown: {
          DEFAULT: '#8B7355',
          light: '#A89176',
          dark: '#7A6345',
        },
        olive: {
          DEFAULT: '#6B8E4E',
          light: '#85A96B',
          dark: '#5A7C3F',
        },
        cream: {
          DEFAULT: '#FAF7F2',
          light: '#FFFCF7',
          dark: '#F5F1E8',
        },
        text: {
          primary: '#2D2D2D',
          secondary: '#5D5D5D',
        },
      },
      fontFamily: {
        raleway: ['var(--font-raleway)', 'serif'],
        inter: ['var(--font-inter)', 'sans-serif'],
      },
      borderRadius: {
        xl: '16px',
        '2xl': '20px',
        '3xl': '24px',
      },
      boxShadow: {
        card: '0 2px 12px rgba(0, 0, 0, 0.04)',
        'card-hover': '0 4px 24px rgba(0, 0, 0, 0.08)',
      },
      animation: {
        'fade-in': 'fadeIn 0.6s ease-out',
        'slide-up': 'slideUp 0.5s ease-out',
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      },
    },
  },
  plugins: [],
};
export default config;