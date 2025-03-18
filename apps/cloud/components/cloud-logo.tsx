import Image from 'next/image';
import Link from 'next/link';

export function CloudLogo({ imageOnly }: { imageOnly?: boolean }) {
  if (imageOnly) return <ImageLogo />;

  return (
    <Link href="/" className="hover:opacity-80 transition-opacity">
      <ImageLogo />
    </Link>
  );
}

function ImageLogo() {
  return (
    <Image
      src="/logo-cloud.svg"
      alt="JSX Mail Cloud"
      width={100}
      height={100}
      className="h-6 w-auto"
    />
  );
}
