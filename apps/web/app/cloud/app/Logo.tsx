'use client';

import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

type Props = {
  variant?: 'normal' | 'full';
};

export default function Logo({ variant = 'normal' }: Props) {
  const pathname = usePathname();

  return (
    <Link
      href={pathname === '/cloud/app' ? '/' : '/cloud/app'}
      aria-label="Go to the home page"
      className="flex items-center"
    >
      <Image
        width={variant === 'full' ? 155 : 40}
        height={variant === 'full' ? 24 : 40}
        src={variant === 'full' ? '/logo-full.svg' : '/logo.svg'}
        alt="JSX Mail Cloud"
        className="object-contain w-44"
      />
    </Link>
  );
}
