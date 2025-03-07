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
  plugins: [
    nextui({
      themes: {
        dark: {
          colors: {
            content1: 'rgb(24 24 27)',
            default: {
              100: 'rgb(39 39 42)',
              200: 'rgb(63 63 70)',
              700: 'rgb(63 63 70)',
              DEFAULT: 'rgb(39 39 42)',
              foreground: 'rgb(250 250 250)',
            },
            content2: 'rgb(39 39 42)',
          },
        },
      },
    }),
  ],
};
