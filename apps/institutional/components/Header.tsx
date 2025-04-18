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
} from '@heroui/react';
import { useState, useEffect } from 'react';
import Image from 'next/image';
import { getCloudUrl } from '@/lib/utils';
import { useUtmInfo } from '@/app/utm-context';

export default function Header({
  menuItems,
}: {
  menuItems: { label: string; href: string }[];
}) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { utmGroupId } = useUtmInfo();
  const [cloudUrl, setCloudUrl] = useState('');

  useEffect(() => {
    setCloudUrl(getCloudUrl('/app', utmGroupId));
  }, [utmGroupId]);

  return (
    <Navbar onMenuOpenChange={setIsMenuOpen} maxWidth="2xl">
      <NavbarContent>
        <NavbarBrand>
          <Link href="/">
            <Image
              src="/logo.svg"
              alt="Logo"
              className="w-28"
              width={100}
              height={100}
            />
          </Link>
        </NavbarBrand>
      </NavbarContent>

      <NavbarContent className="hidden sm:flex gap-4" justify="center">
        {menuItems.map((item, index) => (
          <NavbarItem key={`${item}-${index}`}>
            <Link
              href={item.href}
              color="foreground"
              className="text-sm"
              aria-label={item.label}
            >
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
            href={cloudUrl}
            variant="shadow"
            isExternal
            size="sm"
            aria-label="Cloud"
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
            <Link
              href={item.href}
              color="foreground"
              className="text-sm"
              aria-label={item.label}
            >
              {item.label}
            </Link>
          </NavbarMenuItem>
        ))}
        <NavbarMenuItem>
          <Button
            as={Link}
            className="w-28"
            color="primary"
            href={cloudUrl}
            variant="shadow"
            isExternal
            size="sm"
            aria-label="Cloud"
          >
            Cloud
          </Button>
        </NavbarMenuItem>
      </NavbarMenu>
    </Navbar>
  );
}
