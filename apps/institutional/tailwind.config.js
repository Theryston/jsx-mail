import { nextui } from '@nextui-org/theme';

const isLocal = (process.env.NODE_ENV || 'development') === 'development';

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    isLocal
      ? '../../node_modules/@nextui-org/theme/dist/**/*.{js,ts,jsx,tsx}'
      : './node_modules/@nextui-org/theme/dist/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['var(--font-sans)'],
        mono: ['var(--font-mono)'],
      },
    },
  },
  darkMode: 'class',
  plugins: [nextui()],
};
