// eslint-disable-next-line
const withNextra = require('nextra')({
  theme: 'nextra-theme-docs',
  themeConfig: './theme.config.jsx',
  unstable_staticImage: true,
})

module.exports = withNextra()