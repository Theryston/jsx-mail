'use client';

import { useState } from 'react';
import { SessionTable } from '../sessions';
import { Container } from '@/components/container';
import { Button } from '@jsx-mail/ui/button';
import { PlusIcon } from 'lucide-react';

export default function ApiKeys() {
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  return (
    <Container header>
      <div className="flex flex-col gap-8">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl">
            <span className="font-bold">Your</span> sessions (API Keys)
          </h1>

          <Button size="icon" onClick={() => setIsCreateModalOpen(true)}>
            <PlusIcon className="size-4" />
          </Button>
        </div>

        <div className="rounded-xl bg-zinc-900 p-4 w-full">
          <SessionTable
            isCreateModalOpen={isCreateModalOpen}
            setIsCreateModalOpen={setIsCreateModalOpen}
          />
        </div>
      </div>
    </Container>
  );
}
