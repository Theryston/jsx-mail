'use client';

import { titleCase } from '@/app/utils/title-case';
import {
  Navbar,
  NavbarBrand,
  NavbarContent,
  DropdownItem,
  DropdownTrigger,
  Dropdown,
  DropdownMenu,
  Avatar,
  User,
} from '@nextui-org/react';
import Image from 'next/image';
import { usePathname, useRouter } from 'next/navigation';
import { useState } from 'react';
import { useCloudAppContext } from './context';
import Link from 'next/link';

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { user } = useCloudAppContext();

  const items = [
    {
      label: 'Account',
      href: '/cloud/app/account',
    },
    {
      label: 'Billing',
      href: '/cloud/app/billing',
    },
    {
      label: 'Resources',
      href: '/cloud/app/resources',
    },
  ];

  return (
    <Navbar
      onMenuOpenChange={setIsMenuOpen}
      isMenuOpen={isMenuOpen}
      isBordered
      isBlurred
      shouldHideOnScroll
      maxWidth="full"
    >
      <NavbarContent className="pr-3" justify="center">
        <NavbarBrand>
          <Logo />
        </NavbarBrand>
      </NavbarContent>
      <NavbarContent as="div" justify="end">
        <Dropdown placement="bottom-end">
          <DropdownTrigger>
            <div>
              <Avatar
                as="button"
                className="flex sm:hidden"
                name={titleCase(user.name)}
                showFallback={false}
              />
              <User
                name={titleCase(user.name)}
                description={user.email}
                as="button"
                className="hidden sm:flex"
              />
            </div>
          </DropdownTrigger>
          <DropdownMenu aria-label="Profile Actions" variant="flat">
            <DropdownItem key="profile" className="h-14 gap-2 cursor-default">
              <p className="font-semibold">
                Balance: {user.balance.friendlyAmount}
              </p>
              <p className="font-semibold">{user.email}</p>
            </DropdownItem>
            {
              items.map((item) => (
                <DropdownItem key={item.label} color="default">
                  <Link
                    href={item.href as string}
                    className="w-full text-white text-small block"
                  >
                    {item.label}
                  </Link>
                </DropdownItem>
              )) as any
            }
          </DropdownMenu>
        </Dropdown>
      </NavbarContent>
    </Navbar>
  );
}

function Logo() {
  const pathname = usePathname();
  return (
    <Link
      href={pathname === '/cloud/app' ? '/' : '/cloud/app'}
      aria-label="Go to the home page"
      className="flex items-center"
    >
      <div className="flex items-center gap-2">
        <Image width={40} height={31} src="/logo.svg" alt="JSX Mail Logo" />
        <span>JSX Mail</span>
      </div>
    </Link>
  );
}
