'use client';

import { Container } from '@/components/container';
import { Button } from '@jsx-mail/ui/button';
import { PlusIcon } from 'lucide-react';
import { useState } from 'react';
import { useSenders } from '@/hooks/sender';
import { Skeleton } from '@jsx-mail/ui/skeleton';
import { columns } from './columns';
import { DataTable } from './data-table';
import { AddSenderModal } from './add-sender-modal';

export default function SendersPage() {
  const [isOpenAddSender, setIsOpenAddSender] = useState(false);
  const { data: senders, isPending } = useSenders();

  return (
    <Container header>
      <div className="flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl">
            <span className="font-bold">Your</span> senders
          </h1>

          <Button size="icon" onClick={() => setIsOpenAddSender(true)}>
            <PlusIcon className="size-4" />
          </Button>
        </div>

        {isPending ? (
          <Skeleton className="h-[300px] w-full" />
        ) : (
          <div className="rounded-xl bg-zinc-900 p-4 w-full">
            <DataTable columns={columns} data={senders || []} />
          </div>
        )}
      </div>

      <AddSenderModal
        isOpen={isOpenAddSender}
        onClose={() => setIsOpenAddSender(false)}
      />
    </Container>
  );
}
