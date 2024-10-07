'use client';

import {
  Navbar,
  NavbarBrand,
  NavbarContent,
  NavbarItem,
  NavbarMenuToggle,
  NavbarMenu,
  NavbarMenuItem,
  Link,
  Button,
} from '@nextui-org/react';
import Logo from './Logo';
import { useState } from 'react';

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const menuItems = [
    {
      label: "What's?",
      href: '#whats',
    },
    {
      label: 'Why?',
      href: '#why',
    },
    {
      label: 'Pricing',
      href: '#pricing',
    },
    {
      label: 'FAQ',
      href: '#faq',
    },
  ];

  return (
    <Navbar onMenuOpenChange={setIsMenuOpen} maxWidth="2xl">
      <NavbarContent>
        <NavbarBrand>
          <Link href="/">
            <Logo className="w-28" />
          </Link>
        </NavbarBrand>
      </NavbarContent>

      <NavbarContent className="hidden sm:flex gap-4" justify="center">
        {menuItems.map((item, index) => (
          <NavbarItem key={`${item}-${index}`}>
            <Link href={item.href} color="foreground" className="text-sm">
              {item.label}
            </Link>
          </NavbarItem>
        ))}
      </NavbarContent>

      <NavbarContent className="hidden sm:flex gap-4" justify="end">
        <NavbarItem>
          <Button
            as={Link}
            className="w-28"
            color="primary"
            href="https://cloud.jsxmail.org"
            variant="shadow"
            isExternal
            size="sm"
          >
            Cloud
          </Button>
        </NavbarItem>
      </NavbarContent>

      <NavbarMenuToggle
        aria-label={isMenuOpen ? 'Close menu' : 'Open menu'}
        className="sm:hidden"
      />

      <NavbarMenu>
        {menuItems.map((item, index) => (
          <NavbarMenuItem key={`${item}-${index}`}>
            <Link href={item.href} color="foreground" className="text-sm">
              {item.label}
            </Link>
          </NavbarMenuItem>
        ))}
        <NavbarMenuItem>
          <Button
            as={Link}
            className="w-28"
            color="primary"
            href="https://cloud.jsxmail.org"
            variant="shadow"
            isExternal
            size="sm"
          >
            Cloud
          </Button>
        </NavbarMenuItem>
      </NavbarMenu>
    </Navbar>
  );
}
