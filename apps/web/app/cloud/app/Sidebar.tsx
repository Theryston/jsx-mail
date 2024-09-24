'use client';

import clsx from 'clsx';
import {
  Home,
  Computing,
  CloudSunny,
  Send,
  DocumentSketch,
  MessageTick,
  Document,
} from 'iconsax-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function Sidebar() {
  const pathname = usePathname();

  const sizeClassnames = 'w-80 h-[70vh]';

  const ITEMS = [
    {
      label: 'Home',
      href: '/cloud/app',
      icon: <Home variant="Bold" size="1.5rem" />,
    },
    {
      label: 'Billing',
      href: '/cloud/app/billing',
      icon: <Computing variant="Bold" size="1.5rem" />,
    },
    {
      label: 'Domains',
      href: '/cloud/app/domains',
      icon: <CloudSunny variant="Bold" size="1.5rem" />,
    },
    {
      label: 'Senders',
      href: '/cloud/app/senders',
      icon: <Send variant="Bold" size="1.5rem" />,
    },
    {
      label: 'Files',
      href: '/cloud/app/files',
      icon: <DocumentSketch variant="Bold" size="1.5rem" />,
    },
    {
      label: 'Sending History',
      href: '/cloud/app/sending-history',
      icon: <MessageTick variant="Bold" size="1.5rem" />,
    },
    {
      label: 'Documentation',
      href: '/docs',
      icon: <Document variant="Bold" size="1.5rem" />,
      isExternal: true,
    },
  ];

  return (
    <div className={sizeClassnames}>
      <div
        className={clsx(
          sizeClassnames,
          'bg-zinc-900 fixed rounded-2xl flex flex-col py-5 px-8 gap-3',
        )}
      >
        {ITEMS.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={clsx(
              'flex gap-3 text-sm items-center hover:opacity-80 h-10 transition-all',
              {
                'text-zinc-300': pathname !== item.href,
                'text-primary font-bold': pathname === item.href,
              },
            )}
            target={item.isExternal ? '_blank' : undefined}
            rel={item.isExternal ? 'noopener noreferrer' : undefined}
          >
            {item.icon} {item.label}
          </Link>
        ))}
      </div>
    </div>
  );
}
