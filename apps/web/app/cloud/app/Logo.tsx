'use client';

import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

type Props = {
  variant?: 'normal' | 'cloud';
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
        width={155}
        height={24}
        src={variant === 'cloud' ? '/logo-cloud.svg' : '/logo.svg'}
        alt="JSX Mail Cloud"
        className="object-contain w-44"
      />
    </Link>
  );
}