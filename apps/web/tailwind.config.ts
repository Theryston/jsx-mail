import type { Config } from 'tailwindcss';
import { nextui } from '@nextui-org/react';

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './node_modules/@nextui-org/theme/dist/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {},
  },
  darkMode: 'class',
  plugins: [
    nextui({
      themes: {
        dark: {
          colors: {
            content1: 'rgb(24 24 27)',
            default: {
              '100': 'rgb(39 39 42)',
              '200': 'rgb(63 63 70)',
              '700': 'rgb(63 63 70)',
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
export default config;
