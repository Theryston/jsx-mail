import Image from 'next/image';
import { useRouter } from 'next/router';
import { useConfig, type DocsThemeConfig } from 'nextra-theme-docs';
import { Github } from './components/Social';

const config: DocsThemeConfig = {
  navbar: {
    extraContent: <Github />,
  },
  sidebar: {
    defaultMenuCollapseLevel: 1,
    toggleButton: true,
  },
  docsRepositoryBase: 'https://github.com/Theryston/jsx-mail/blob/main/web',
  useNextSeoProps: function SEO() {
    const router = useRouter();
    const { frontMatter } = useConfig();

    const mainTitle = 'JSX Mail';

    let titleTemplate = `%s – ${mainTitle}`;

    if (router?.pathname === '/') {
      titleTemplate = mainTitle;
    }

    const defaultTitle = frontMatter.overrideTitle || mainTitle;

    return {
      description: frontMatter.description,
      defaultTitle,
      titleTemplate,
    };
  },
  toc: {
    float: true,
    backToTop: true,
  },
  logo: (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: 8,
      }}
    >
      <Image width={45} height={36} src="/logo.svg" alt="JSX Mail Logo" />
      <span>JSX Mail</span>
    </div>
  ),
  head: function Head() {
    return (
      <>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <link rel="icon" href="/favicon.ico" />
        <meta name="msapplication-TileColor" content="#000000" />
        <meta name="theme-color" content="#000" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta property="og:type" content="website" />
        <meta property="og:locale" content="en_IE" />
        <meta property="og:site_name" content="JSX Mail" />
      </>
    );
  },
  i18n: [],
  editLink: {
    text: 'Edit this page on GitHub',
  },
  search: {
    placeholder: 'Search documentation…',
  },
  nextThemes: {
    defaultTheme: 'dark',
  },
  themeSwitch: {
    component: <p>JSX Mail</p>,
  },
  footer: {
    text: 'MIT License © JSX Mail.',
  },
};

export default config;
