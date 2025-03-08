'use client';

import { Container } from '@/components/container';
import { UserForm } from './user-form';
import { Sessions } from './sessions';
import { Separator } from '@jsx-mail/ui/separator';

export default function AccountPage() {
  return (
    <Container header>
      <div className="flex flex-col gap-8">
        <h1 className="text-2xl">
          <span className="font-bold">Your</span> account & sessions
        </h1>

        <UserForm />

        <Separator className="my-2" />

        <Sessions />
      </div>
    </Container>
  );
}
