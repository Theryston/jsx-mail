'use client';

import { Link } from '@heroui/link';
import Image from 'next/image';
import { getCloudUrl } from '@/lib/utils';
import { useState, useEffect } from 'react';
import { useUtmInfo } from '@/app/utm-context';

export default function Footer() {
  const { utmGroupId } = useUtmInfo();
  const [cloudUrl, setCloudUrl] = useState('');

  useEffect(() => {
    setCloudUrl(getCloudUrl('/app', utmGroupId));
  }, [utmGroupId]);

  return (
    <footer className="bg-zinc-900/30 text-foreground py-5 px-6 flex flex-col md:flex-row gap-4 items-center justify-between">
      <Image
        src="/logo.svg"
        alt="Logo"
        className="w-24"
        width={100}
        height={100}
      />
      <div className="flex gap-4">
        <Link
          color="foreground"
          href={cloudUrl}
          isExternal
          size="sm"
          aria-label="Go to JSX Mail Cloud"
        >
          Cloud
        </Link>
        <Link
          color="foreground"
          href="https://docs.jsxmail.org"
          isExternal
          size="sm"
          aria-label="View JSX Mail Documentation"
        >
          Docs
        </Link>
        <Link
          color="foreground"
          href="https://github.com/Theryston/jsx-mail"
          isExternal
          size="sm"
          aria-label="Visit JSX Mail GitHub repository"
        >
          GitHub
        </Link>
      </div>
      <p className="text-center text-sm">JSX Mail is licensed under MIT</p>
    </footer>
  );
}
