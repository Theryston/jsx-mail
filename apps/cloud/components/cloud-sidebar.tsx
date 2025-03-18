'use client';

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from '@jsx-mail/ui/sidebar';
import { CloudLogo } from '@/components/cloud-logo';
import { usePathname } from 'next/navigation';
import {
  Home,
  Cloud,
  Send,
  File,
  MessageCircle,
  Wallet,
  LogOutIcon,
  BookOpen,
  UserIcon,
  Shield,
} from 'lucide-react';
import Link from 'next/link';
import { cn } from '@jsx-mail/ui/lib/utils';
import { Button } from '@jsx-mail/ui/button';
import { useMe } from '@/hooks/user';
import { titleCase } from '@/utils/title-case';
import { useIsMobile } from '@jsx-mail/ui/hooks/use-mobile';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@jsx-mail/ui/dropdown-menu';

export const ITEMS = [
  {
    label: 'Home',
    href: '/',
    icon: Home,
  },
  {
    label: 'Billing',
    href: '/billing',
    icon: Wallet,
  },
  {
    label: 'Domains',
    href: '/domains',
    icon: Cloud,
  },
  {
    label: 'Senders',
    href: '/senders',
    icon: Send,
  },
  {
    label: 'Files',
    href: '/files',
    icon: File,
  },
  {
    label: 'Sending History',
    href: '/sending-history',
    icon: MessageCircle,
  },
  {
    label: 'Documentation',
    href: 'https://docs.jsxmail.org/api-reference/introduction',
    icon: BookOpen,
    isExternal: true,
  },
  {
    label: 'Admin',
    href: '/admin',
    icon: Shield,
    accessLevel: 'other',
  },
];

export function CloudSidebar({ disabled }: { disabled: boolean }) {
  const pathname = usePathname();
  const isMobile = useIsMobile();
  const { data: me } = useMe();

  const items = ITEMS.filter((item) => {
    if (item.accessLevel === 'other') {
      return me?.accessLevel === 'other';
    }
    return true;
  });

  return (
    <Sidebar
      side={isMobile ? 'right' : 'left'}
      pathname={pathname}
      className={cn({
        'pointer-events-none cursor-not-allowed opacity-80': disabled,
      })}
    >
      <SidebarHeader className="px-2">
        <CloudLogo />
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupContent className="mt-8">
            <SidebarMenu className="flex flex-col gap-3">
              {items.map((item) => (
                <SidebarMenuItem key={item.label}>
                  <SidebarMenuButton asChild isActive={pathname === item.href}>
                    <Link
                      href={item.href}
                      target={item.isExternal ? '_blank' : undefined}
                    >
                      <item.icon
                        className={cn('size-5', {
                          'text-muted-foreground': pathname !== item.href,
                          'text-primary': pathname === item.href,
                        })}
                      />
                      <span
                        className={cn('text-xs', {
                          'text-muted-foreground': pathname !== item.href,
                          'text-primary': pathname === item.href,
                        })}
                      >
                        {item.label}
                      </span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter>
        <Link href="/sign-out" className="hidden md:flex">
          <Button
            variant="ghost"
            size="sm"
            className="w-full justify-start text-muted-foreground text-xs"
          >
            <LogOutIcon className="size-4" />
            Logout
          </Button>
        </Link>

        <SidebarMenu className="flex md:hidden">
          <SidebarMenuItem className="w-full">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <SidebarMenuButton>
                  <UserIcon className="size-4" />
                  <span className="text-xs font-medium text-muted-foreground">
                    {titleCase(me?.name || '')}
                  </span>
                </SidebarMenuButton>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                side="top"
                align="start"
                className="w-[13rem] flex flex-col"
              >
                <DropdownMenuItem>
                  <Link
                    href="/account"
                    className="flex md:hidden w-full items-center gap-2"
                  >
                    <UserIcon className="size-4" />
                    <span className="text-muted-foreground text-sm">
                      Account
                    </span>
                  </Link>
                </DropdownMenuItem>
                <hr />
                <DropdownMenuItem>
                  <Link
                    href="/sign-out"
                    className="flex md:hidden w-full items-center gap-2 text-destructive"
                  >
                    <LogOutIcon className="size-4" />
                    <span className="text-sm">Sign out</span>
                  </Link>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}
