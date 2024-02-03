'use client';

import { titleCase } from '@/utils/title-case';
import {
  Navbar,
  NavbarBrand,
  NavbarContent,
  NavbarItem,
  DropdownItem,
  DropdownTrigger,
  Dropdown,
  DropdownMenu,
  NavbarMenuToggle,
  NavbarMenu,
  NavbarMenuItem,
  Avatar,
} from '@nextui-org/react';
import Image from 'next/image';
import { usePathname, useRouter } from 'next/navigation';
import { useCallback, useEffect, useState } from 'react';
import { useCloudAppContext } from '../context';
import Link from 'next/link';
import axios from '@/utils/axios';
import { toast } from 'react-toastify';

type ItemNav = {
  name: string;
  link: string;
  isCurrent: boolean;
};

const ITEMS_NAV: ItemNav[] = [
  { name: 'Domains', link: '/cloud/app/domains', isCurrent: false },
  { name: 'Emails', link: '/cloud/app/emails', isCurrent: false },
  { name: 'Images', link: '/cloud/app/images', isCurrent: false },
];

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [itemsNav, setItemsNav] = useState<ItemNav[]>(ITEMS_NAV);
  const pathname = usePathname();
  const { user } = useCloudAppContext();
  const router = useRouter();

  useEffect(() => {
    const items = ITEMS_NAV.map((item) => {
      return {
        ...item,
        isCurrent: pathname ? pathname.startsWith(item.link) : false,
      };
    });
    setItemsNav(items);
  }, [pathname]);

  const logout = useCallback(async () => {
    const toastId = toast.loading('Logging out...');

    try {
      await axios.delete('/session');
      toast.success('Logged out successfully');
      localStorage.removeItem('token');
      router.push('/cloud/sign-in');
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      toast.dismiss(toastId);
    }
  }, [router]);

  return (
    <Navbar
      onMenuOpenChange={setIsMenuOpen}
      isMenuOpen={isMenuOpen}
      isBordered
      isBlurred
      shouldHideOnScroll
    >
      <NavbarContent className="sm:hidden" justify="start">
        <NavbarMenuToggle
          aria-label={isMenuOpen ? 'Close menu' : 'Open menu'}
        />
      </NavbarContent>

      <NavbarContent className="sm:hidden pr-3" justify="center">
        <NavbarBrand>
          <Logo />
        </NavbarBrand>
      </NavbarContent>

      <NavbarContent className="hidden sm:flex" justify="center">
        <NavbarBrand>
          <Logo />
        </NavbarBrand>
      </NavbarContent>
      <NavbarContent className="hidden sm:flex gap-4 w-full" justify="center">
        {itemsNav.map((item) => (
          <NavbarItem key={item.link} isActive={item.isCurrent}>
            <Link
              className={item.isCurrent ? 'text-primary' : 'text-foreground'}
              href={item.link}
            >
              {item.name}
            </Link>
          </NavbarItem>
        ))}
      </NavbarContent>

      <NavbarContent as="div" justify="end">
        <Dropdown placement="bottom-end">
          <DropdownTrigger>
            <Avatar
              isBordered
              as="button"
              className="transition-transform"
              name={titleCase(user?.name || '')}
              showFallback={false}
              size="sm"
            />
          </DropdownTrigger>
          <DropdownMenu aria-label="Profile Actions" variant="flat">
            <DropdownItem key="profile" className="h-14 gap-2">
              <p className="font-semibold">{titleCase(user?.name || '')}</p>
              <p className="font-semibold">{user?.email}</p>
            </DropdownItem>
            <DropdownItem key="settings">
              <Link href="/cloud/app/account/settings" className="w-full block">
                My Settings
              </Link>
            </DropdownItem>
            <DropdownItem key="sessions">
              <Link href="/cloud/app/account/sessions" className="w-full block">
                Sessions
              </Link>
            </DropdownItem>
            <DropdownItem key="logout" color="danger" onClick={logout}>
              Log Out
            </DropdownItem>
          </DropdownMenu>
        </Dropdown>
      </NavbarContent>

      <NavbarMenu>
        {itemsNav.map((item) => (
          <NavbarMenuItem key={item.link}>
            <Link
              className={
                item.isCurrent ? 'text-primary font-bold' : 'text-foreground'
              }
              href={item.link}
            >
              {item.name}
            </Link>
          </NavbarMenuItem>
        ))}
      </NavbarMenu>
    </Navbar>
  );
}

function Logo() {
  return (
    <Link
      href="/cloud/app"
      aria-label="Go to the home page"
      className="flex items-center gap-2"
    >
      <Image src="/logo.svg" alt="Logo" width={35} height={35} />
    </Link>
  );
}
