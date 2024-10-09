'use client';

import clsx from 'clsx';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { HEADER_ITEMS } from './constants';

export default function Sidebar() {
  const pathname = usePathname();

  const sizeClassnames = 'w-80 h-[70vh]';

  return (
    <div className={sizeClassnames}>
      <div
        className={clsx(
          sizeClassnames,
          'bg-zinc-900 fixed rounded-2xl flex flex-col py-5 px-8 gap-3',
        )}
      >
        {HEADER_ITEMS.map((item) => (
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
