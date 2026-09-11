import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        saffron: {
          50: '#fff7ed',
          100: '#ffedd5',
          200: '#fed7aa',
          300: '#fdba74',
          400: '#fb923c',
          500: '#f97316',
          600: '#ea580c',
          700: '#c2410c',
          800: '#9a3412',
          900: '#7c2d12',
          950: '#431407',
        },
        gold: {
          50: '#fefce8',
          100: '#fef9c3',
          200: '#fef08a',
          300: '#fde047',
          400: '#facc15',
          500: '#eab308',
          600: '#ca8a04',
          700: '#a16207',
          800: '#854d0e',
          900: '#713f12',
        },
        kumkum: {
          50: '#fff1f2',
          100: '#ffe4e6',
          500: '#f43f5e',
          600: '#e11d48',
          700: '#be123c',
          800: '#9f1239',
          900: '#881337',
        },
        sand: {
          50: '#fdfbf7',
          100: '#f7f3ea',
          200: '#eee5d5',
          300: '#dfd2bd',
          400: '#cbb69c',
          800: '#2c251e',
          900: '#1c1713',
          950: '#0f0c0a',
        },
      },
      fontFamily: {
        devanagari: ['var(--font-noto-sans)', '"Noto Sans Devanagari"', '"Mukta"', 'system-ui', 'sans-serif'],
        grantha: ['var(--font-noto-serif)', '"Noto Serif Devanagari"', 'Georgia', 'serif'],
        mukta: ['var(--font-mukta)', '"Mukta"', 'sans-serif'],
      },
      lineHeight: {
        'compact': '1.85',
        'normal-dev': '2.2',
        'relaxed-dev': '2.6',
      },
      keyframes: {
        diyaGlow: {
          '0%, 100%': { opacity: '0.8', transform: 'scale(1)' },
          '50%': { opacity: '1', transform: 'scale(1.08)' },
        },
        bellSwing: {
          '0%, 100%': { transform: 'rotate(0deg)' },
          '25%': { transform: 'rotate(12deg)' },
          '75%': { transform: 'rotate(-12deg)' },
        }
      },
      animation: {
        'diya-glow': 'diyaGlow 3s ease-in-out infinite',
        'bell-swing': 'bellSwing 0.5s ease-in-out',
      }
    },
  },
  plugins: [],
};
export default config;
