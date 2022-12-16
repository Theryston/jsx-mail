import Image from 'next/image';
import LogoImage from './assets/images/logo.png';
import { ThemeSwitch } from 'nextra-theme-docs';

export default {
  project: {
    link: 'https://github.com/Theryston/jsx-mail',
  },
  docsRepositoryBase: 'https://github.com/Theryston/jsx-mail/blob/main/web',
  logo: <Image src={LogoImage} height="26.99px" width="30px" />,
  useNextSeoProps: () => {
    return {
      titleTemplate: '%s | Jsx Mail',
    };
  },
  sidebar: {
    defaultMenuCollapseLevel: 0,
  },
  footer: {
    component: () => (
      <footer className="nx-bg-gray-100 nx-pb-[env(safe-area-inset-bottom)] dark:nx-bg-neutral-900">
        <div className="nx-mx-auto nx-flex nx-max-w-[90rem] nx-gap-2 nx-py-2 nx-px-4 nx-flex">
          <ThemeSwitch />
        </div>
        <hr class="dark:nx-border-neutral-800" />
        <div class="nx-mx-auto nx-flex nx-max-w-[90rem] nx-justify-center nx-py-12 nx-text-gray-600 dark:nx-text-gray-400 md:nx-justify-start nx-pl-[max(env(safe-area-inset-left),1.5rem)] nx-pr-[max(env(safe-area-inset-right),1.5rem)]">
          MIT {new Date().getFullYear()} ©{' '}
          <a href="https://jsx-mail.org" target="_blank">
            Jsx Mail
          </a>
        </div>
      </footer>
    ),
  },
};
