'use client';

import { Link } from '@heroui/link';
import { Button } from '@heroui/button';
import { useEffect, useState } from 'react';
import { getCloudUrl } from '@/lib/utils';
import { useUtmInfo } from '@/app/utm-context';
import { useTranslations } from 'next-intl';

export default function Hero() {
  const [bottom, setBottom] = useState(0);
  const [cloudUrl, setCloudUrl] = useState('');
  const { utmGroupId } = useUtmInfo();
  const t = useTranslations('HomePage.hero');

  useEffect(() => {
    let lastScrollY = window.scrollY;

    const handleScroll = () => {
      const isMobile = window.innerWidth < 768;

      if (!isMobile) {
        setBottom(0);
        return;
      }

      if (window.scrollY > lastScrollY) {
        setBottom(-100);
      } else {
        setBottom(0);
      }
      lastScrollY = window.scrollY;
    };

    window.addEventListener('scroll', handleScroll);

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  useEffect(() => {
    setCloudUrl(getCloudUrl('/app', utmGroupId));
  }, [utmGroupId]);

  return (
    <div className="flex flex-col gap-3 md:gap-5 items-center justify-between md:justify-center h-[calc(100dvh-64px)] py-6">
      <div />
      <div className="flex flex-col items-center justify-end md:justify-center gap-2 h-fit">
        <Link
          href="https://github.com/Theryston/jsx-mail"
          target="_blank"
          style={{
            fontSize: '10px',
            lineHeight: '10px',
          }}
          aria-label={t('github')}
        >
          {t('github')}
        </Link>

        <div className="flex flex-col items-center gap-4">
          <h1 className="hidden md:block text-7xl 2xl:text-8xl font-bold text-center bg-gradient-to-br from-primary-900 to-primary-700 text-transparent bg-clip-text">
            {t('title.one-tool')} {t('title.one-seamless')} <br />{' '}
            {t('title.email-workflow')}
          </h1>

          <h1 className="md:hidden text-4xl font-bold text-center bg-gradient-to-br from-primary-900 to-primary-700 text-transparent bg-clip-text">
            {t('title.one-tool')}
            <br />
            {t('title.one-seamless')}
            <br />
            {t('title.email-workflow')}
          </h1>

          <p className="text-center w-full text-xs 2xl:text-sm md:text-sm md:w-7/12">
            {t('subtitle')}
          </p>
        </div>
      </div>

      <div className="block md:hidden" />

      <div
        className="flex fixed z-50 md:z-0 p-4 bg-background/70 backdrop-blur-lg md:relative gap-4 w-full md:w-4/12 2xl:w-3/12 shadow-[10px_0_10px_rgba(0,0,0,0.5)] md:shadow-none transition-all duration-200"
        style={{ bottom }}
      >
        <Button
          color="primary"
          variant="shadow"
          as={Link}
          href={cloudUrl}
          target="_blank"
          fullWidth
          size="sm"
          aria-label="Go to JSX Mail Cloud"
        >
          {t('cloud')}
        </Button>
        <Button
          color="primary"
          variant="flat"
          as={Link}
          href="https://docs.jsxmail.org"
          target="_blank"
          fullWidth
          size="sm"
          aria-label="View JSX Mail Documentation"
        >
          {t('docs')}
        </Button>
      </div>
    </div>
  );
}
