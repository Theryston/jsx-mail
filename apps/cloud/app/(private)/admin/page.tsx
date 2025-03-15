import { Container } from '@/components/container';
import { SmallCard } from '@jsx-mail/ui/small-card';
import Link from 'next/link';

export default function Admin() {
  const adminActions = [
    {
      label: 'Users',
      href: '/admin/users',
    },
  ];

  return (
    <Container header>
      <div className="flex flex-col gap-4">
        <h1 className="text-2xl">
          <span className="font-bold">Admin,</span> actions
        </h1>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {adminActions.map((action) => (
            <Link
              key={action.label}
              href={action.href}
              className="w-full hover:scale-105 transition-all duration-300"
            >
              <SmallCard title={action.label} value={action.label} />
            </Link>
          ))}
        </div>
      </div>
    </Container>
  );
}
