import Image from 'next/image';
import Link from 'next/link';

export function CloudLogo() {
  return (
    <Link href="/" className="hover:opacity-80 transition-opacity">
      <Image
        src="/logo-cloud.svg"
        alt="JSX Mail Cloud"
        width={100}
        height={100}
        className="h-6 w-auto"
      />
    </Link>
  );
}
