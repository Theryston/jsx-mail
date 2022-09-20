import Image from 'next/image';
import LogoImage from './assets/images/logo.png';

export default {
  defaultMenuCollapsed: true,
  projectLink: 'https://github.com/Theryston/jsx-mail',
  docsRepositoryBase:
    'https://github.com/Theryston/jsx-mail/blob/master/web/pages',
  titleSuffix: ' – JSX Mail',
  nextLinks: true,
  prevLinks: true,
  search: true,
  customSearch: null,
  darkMode: true,
  footer: true,
  footerText: `MIT ${new Date().getFullYear()} © Theryston.`,
  footerEditLink: `Edit this page on GitHub`,
  logo: (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <Image src={LogoImage} height="30px" width="30px" objectFit="cover" />
      <p
        style={{
          marginBottom: 'auto',
          marginTop: 'auto',
          marginLeft: '20px',
          lineHeight: '20px',
        }}
      >
        A framework to create the email template
      </p>
    </div>
  ),
  head: ({ title, description }) => (
    <>
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <meta
        name="description"
        content={description || 'JSX Mail Documentations'}
      />
      <meta name="og:title" content={title || 'JSX Mail Documentations'} />
    </>
  ),
};
