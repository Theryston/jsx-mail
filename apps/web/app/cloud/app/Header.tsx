'use client';

import { titleCase } from '@/app/utils/title-case';
import { useCloudAppContext } from './context';
import Link from 'next/link';
import Logo from './Logo';
import { EmojiHappy } from 'iconsax-react';
import clsx from 'clsx';

export default function Header() {
  const { user } = useCloudAppContext();
  const sizeClassnames = 'h-16 w-full';

  return (
    <div className={clsx(sizeClassnames, 'relative')}>
      <div
        className={clsx(
          sizeClassnames,
          'fixed flex justify-between items-center pl-10 border-b border-b-zinc-700 bg-black z-50',
        )}
      >
        <Logo variant="cloud" />
        <Link
          className="h-full w-60 border-l border-l-zinc-700 flex justify-center items-center gap-3 hover:bg-zinc-900"
          href="/cloud/app/account"
        >
          <EmojiHappy variant="Bold" size="1.75rem" />
          <div className="flex flex-col justify-center items-start gap-1">
            <p className="text-sm leading-3 text-white font-medium m-0">
              {titleCase(user.name)}
            </p>
            <p className="text-xs leading-3 text-zinc-500 m-0">{user.email}</p>
          </div>
        </Link>
      </div>
    </div>
  );
}
