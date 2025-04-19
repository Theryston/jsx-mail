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
  Cloud,
  Send,
  File,
  MessageCircle,
  Wallet,
  LogOutIcon,
  BookOpen,
  UserIcon,
  Shield,
  Key,
  Users,
  Mail,
  Home,
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
import { Badge } from '@jsx-mail/ui/badge';

export const ITEMS = [
  {
    label: 'Dashboard',
    href: '/',
    icon: Home,
  },
  {
    label: 'Bulk Sending',
    href: '/bulk-sending',
    icon: Mail,
    isBeta: true,
  },
  {
    label: 'Contact Groups',
    href: '/contacts',
    icon: Users,
  },
  {
    label: 'Domains',
    href: '/domains',
    icon: Cloud,
  },
  {
    label: 'Billing',
    href: '/billing',
    icon: Wallet,
  },
  {
    label: 'Senders',
    href: '/senders',
    icon: Send,
  },
  {
    label: 'API Keys',
    href: '/account?tab=api-keys',
    icon: Key,
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

export function CloudSidebar() {
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
    <Sidebar side={isMobile ? 'right' : 'left'} pathname={pathname}>
      <SidebarHeader className="px-2">
        <CloudLogo />
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupContent className="mt-8">
            <SidebarMenu className="flex flex-col gap-2">
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
                      {item.isBeta && (
                        <Badge className="!text-xs !font-normal bg-primary/10 text-primary">
                          beta
                        </Badge>
                      )}
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
