import { Link } from '@nextui-org/link';
import Logo from './Logo';

export default function Footer() {
  return (
    <footer className="bg-zinc-900/30 text-foreground py-5 px-6 flex flex-col md:flex-row gap-4 items-center justify-between">
      <Logo className="w-28" />
      <div className="flex gap-4">
        <Link
          color="foreground"
          href="https://cloud.jsxmail.org"
          isExternal
          size="sm"
        >
          Cloud
        </Link>
        <Link
          color="foreground"
          href="https://docs.jsxmail.org"
          isExternal
          size="sm"
        >
          Docs
        </Link>
        <Link
          color="foreground"
          href="https://github.com/Theryston/jsx-mail"
          isExternal
          size="sm"
        >
          GitHub
        </Link>
      </div>
      <p className="text-center text-sm">JSX Mail is licensed under MIT</p>
    </footer>
  );
}
