'use client';

import { Button } from '@jsx-mail/ui/button';
import { BookOpenIcon, LogOutIcon } from 'lucide-react';
import Link from 'next/link';
import { CloudLogo } from './cloud-logo';
import { SidebarTrigger } from '@jsx-mail/ui/sidebar';
import { useMe } from '@/hooks/user';
import { titleCase } from '@/utils/title-case';

type ContainerProps = {
  children: React.ReactNode;
  anonymousHeader?: boolean;
  header?: boolean;
  loggedHeaderNoActions?: boolean;
};

export function Container({
  children,
  anonymousHeader,
  header,
  loggedHeaderNoActions,
}: ContainerProps) {
  return (
    <div>
      {anonymousHeader && <AnonymousHeader />}
      {header && <Header />}
      {loggedHeaderNoActions && <LoggedHeaderNoActions />}
      <main className="container mx-auto p-4 py-8">{children}</main>
    </div>
  );
}

function LoggedHeaderNoActions() {
  return (
    <div className="w-full h-16">
      <header className="w-full px-4 border-b flex items-center justify-between fixed left-0 bg-background z-40 h-16">
        <CloudLogo imageOnly />

        <Link href="/sign-out" className="hidden md:block">
          <Button variant="ghost">
            <LogOutIcon className="size-4" />
            <span className="text-sm font-medium">Sign out</span>
          </Button>
        </Link>

        <Link href="/sign-out" className="md:hidden">
          <Button variant="ghost" size="icon">
            <LogOutIcon className="size-4" />
          </Button>
        </Link>
      </header>
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
      <header className="w-full px-4 border-b flex items-center justify-between fixed left-0 bg-background z-40 h-16">
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
