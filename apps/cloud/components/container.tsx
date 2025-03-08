'use client';

import { Button } from '@jsx-mail/ui/button';
import { BookOpenIcon } from 'lucide-react';
import Link from 'next/link';
import { CloudLogo } from './cloud-logo';
import { SidebarTrigger } from '@jsx-mail/ui/sidebar';
import { useMe } from '@/hooks/user';
import { titleCase } from '@/utils/title-case';

type ContainerProps = {
  children: React.ReactNode;
  anonymousHeader?: boolean;
  header?: boolean;
};

export function Container({
  children,
  anonymousHeader,
  header,
}: ContainerProps) {
  return (
    <div>
      {anonymousHeader && <AnonymousHeader />}
      {header && <Header />}
      <main className="container mx-auto p-4 md:p-8">{children}</main>
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

function Header() {
  const { data: me } = useMe();

  return (
    <div className="h-16">
      <header className="w-full px-4 border-b flex items-center justify-between fixed left-0 bg-background">
        <div className="md:hidden">
          <CloudLogo />
        </div>
        <div className="flex h-16 items-center">
          <SidebarTrigger className="md:hidden" />
        </div>
        <Link
          href="/account"
          className="flex-col w-[50vw] md:w-fit h-16 justify-center items-end md:items-start border-l md:pl-8 md:pr-6 hover:opacity-80 transition-opacity hidden md:flex"
        >
          <span className="text-sm font-medium">
            {titleCase(me?.name || '')}
          </span>
          <span className="text-xs text-muted-foreground">{me?.email}</span>
        </Link>
      </header>
    </div>
  );
}
