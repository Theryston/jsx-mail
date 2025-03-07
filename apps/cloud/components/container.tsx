'use client';

import { Button } from '@jsx-mail/ui/button';
import { BookOpenIcon } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

type ContainerProps = {
  children: React.ReactNode;
  anonymousHeader?: boolean;
};

export function Container({ children, anonymousHeader }: ContainerProps) {
  return (
    <div>
      {anonymousHeader && <AnonymousHeader />}
      <main className="container mx-auto p-4">{children}</main>
    </div>
  );
}

function AnonymousHeader() {
  return (
    <div className="w-full px-4">
      <div className="flex h-16 items-center justify-between container mx-auto">
        <CloudLogo />

        <Link href="https://docs.jsxmail.org" target="_blank">
          <Button variant="ghost" size="icon" title="Documentation">
            <BookOpenIcon />
          </Button>
        </Link>
      </div>
    </div>
  );
}

function CloudLogo() {
  return (
    <Link href="/">
      <Image
        src="/logo-cloud.svg"
        alt="Logo"
        width={100}
        height={100}
        className="h-6 w-auto"
      />
    </Link>
  );
}
