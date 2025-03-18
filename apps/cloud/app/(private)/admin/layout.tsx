'use client';

import { Container } from '@/components/container';
import { useMe } from '@/hooks/user';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { data: user } = useMe();

  if (user?.accessLevel !== 'other') {
    return (
      <Container header>
        <p className="text-center text-lg font-bold">
          You are not authorized to access this page
        </p>
      </Container>
    );
  }

  return <div>{children}</div>;
}
