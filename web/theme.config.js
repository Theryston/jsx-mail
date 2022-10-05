import Image from 'next/image';
import LogoImage from './assets/images/logo.png';

export default {
  projectLink: 'https://github.com/Theryston/jsx-mail',
  docsRepositoryBase:
    'https://github.com/Theryston/jsx-mail/blob/master/web/pages',
  titleSuffix: ' – JSX Mail',
  footerText: `MIT ${new Date().getFullYear()} © Theryston.`,
  footerEditLink: `Edit this page on GitHub`,
  floatTOC: true,
  unstable_flexsearch: true,
  search: true,
  logo: (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <Image src={LogoImage} height="30px" width="30px" objectFit="cover" />
      <span
        className="mx-2 font-extrabold hidden md:inline select-none"
        title={'Jsx Mail: A framework to create the email template'}
      >
        Jsx Mail
      </span>
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
