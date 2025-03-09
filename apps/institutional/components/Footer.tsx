import { Link } from '@heroui/link';
import Image from 'next/image';

export default function Footer() {
  return (
    <footer className="bg-zinc-900/30 text-foreground py-5 px-6 flex flex-col md:flex-row gap-4 items-center justify-between">
      <Image
        src="/logo.svg"
        alt="Logo"
        className="w-24"
        width={100}
        height={100}
      />
      <div className="flex gap-4">
        <Link
          color="foreground"
          href="https://cloud.jsxmail.org/app"
          isExternal
          size="sm"
          aria-label="Go to JSX Mail Cloud"
        >
          Cloud
        </Link>
        <Link
          color="foreground"
          href="https://docs.jsxmail.org"
          isExternal
          size="sm"
          aria-label="View JSX Mail Documentation"
        >
          Docs
        </Link>
        <Link
          color="foreground"
          href="https://github.com/Theryston/jsx-mail"
          isExternal
          size="sm"
          aria-label="Visit JSX Mail GitHub repository"
        >
          GitHub
        </Link>
      </div>
      <p className="text-center text-sm">JSX Mail is licensed under MIT</p>
    </footer>
  );
}
