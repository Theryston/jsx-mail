const withNextra = require('nextra')({
  theme: 'nextra-theme-docs',
  themeConfig: './theme.config.tsx',
});

/** @type {import('next').NextConfig} */
const nextConfig = {
  ...withNextra(),
  experimental: {
    serverActions: true,
  },
};

module.exports = nextConfig;
