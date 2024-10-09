'use client';

import { titleCase } from '@/app/utils/title-case';
import { useCloudAppContext } from './context';
import Logo from './Logo';
import { ArrowRight, EmojiHappy } from 'iconsax-react';
import {
  Navbar,
  NavbarBrand,
  NavbarContent,
  NavbarMenu,
  NavbarMenuItem,
  NavbarMenuToggle,
  Link,
} from '@nextui-org/react';
import { useState } from 'react';
import { HEADER_ITEMS } from './constants';

export default function Header() {
  const { user } = useCloudAppContext();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <Navbar
      isMenuOpen={isMenuOpen}
      onMenuOpenChange={setIsMenuOpen}
      maxWidth="full"
      className="border-b border-b-zinc-700"
      classNames={{
        wrapper: 'md:pr-0',
      }}
    >
      <NavbarContent>
        <NavbarBrand>
          <Logo variant="cloud" />
        </NavbarBrand>
      </NavbarContent>
      <NavbarContent className="hidden md:flex gap-4" justify="end">
        <Link
          className="h-full w-60 border-l border-l-zinc-700 flex justify-center items-center gap-3"
          href="/app/account"
        >
          <EmojiHappy variant="Bold" size="1.75rem" color="#fff" />
          <div className="flex flex-col justify-center items-start gap-1">
            <p className="text-sm leading-3 text-white font-medium m-0">
              {titleCase(user.name)}
            </p>
            <p className="text-xs leading-3 text-zinc-500 m-0">{user.email}</p>
          </div>
        </Link>
      </NavbarContent>

      <NavbarMenuToggle
        aria-label={isMenuOpen ? 'Close menu' : 'Open menu'}
        className="md:hidden"
      />

      <NavbarMenu>
        {HEADER_ITEMS.map((item, index) => (
          <NavbarMenuItem key={`${item.href}-${index}`}>
            <Link
              href={item.href}
              color="foreground"
              className="text-sm"
              onClick={() => setIsMenuOpen(false)}
              isExternal={item.isExternal}
            >
              <div className="flex gap-3 items-center">
                {item.icon}
                <span>{item.label}</span>
              </div>
            </Link>
          </NavbarMenuItem>
        ))}
        <NavbarMenuItem>
          <Link
            className="w-full py-4 px-3 bg-zinc-900 rounded-lg mt-2 flex justify-between items-center"
            href="/app/account"
            onClick={() => setIsMenuOpen(false)}
          >
            <div className="flex justify-start items-center gap-3">
              <EmojiHappy variant="Bold" size="1.75rem" color="#fff" />
              <div className="flex flex-col justify-center items-start gap-1">
                <p className="text-sm leading-3 text-white font-medium m-0">
                  {titleCase(user.name)}
                </p>
                <p className="text-xs leading-3 text-zinc-500 m-0">
                  {user.email}
                </p>
              </div>
            </div>

            <ArrowRight size="1.2rem" color="#fff" />
          </Link>
        </NavbarMenuItem>
      </NavbarMenu>
    </Navbar>
  );
}
