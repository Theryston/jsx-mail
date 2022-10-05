// eslint-disable-next-line
const withNextra = require('nextra')({
  theme: 'nextra-theme-docs',
  themeConfig: './theme.config.js',
  unstable_flexsearch: true,
  unstable_staticImage: true,
});

module.exports = withNextra({
  redirects: () => {
    return [
      {
        source: '/docs',
        destination: '/docs/get-started',
        statusCode: 301,
      },
      {
        source: '/get-started',
        destination: '/docs/get-started',
        statusCode: 301,
      },
      {
        source: '/components',
        destination: '/docs/components',
        statusCode: 301,
      },
      {
        source: '/core',
        destination: '/docs/core',
        statusCode: 301,
      },
    ];
  },
});
