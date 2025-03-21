'use client';

import { Container } from '@/components/container';
import { Button } from '@jsx-mail/ui/button';
import { PlusIcon } from 'lucide-react';
import { useState } from 'react';
import { useContactGroups } from '@/hooks/bulk-sending';
import { Skeleton } from '@jsx-mail/ui/skeleton';
import { columns } from './columns';
import { DataTable } from './data-table';
import { CreateContactGroupModal } from './create-contact-group-modal';
import { PaginationControls } from '@jsx-mail/ui/pagination-controls';

export default function ContactsPage() {
  const [isOpenCreateContactGroup, setIsOpenCreateContactGroup] =
    useState(false);
  const [page, setPage] = useState(1);
  const { data: contactGroupsPagination, isPending } = useContactGroups(page);

  const handlePageChange = (newPage: number) => {
    setPage(newPage);
  };

  return (
    <Container header>
      <div className="flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl">
            <span className="font-bold">Your</span> contact groups
          </h1>

          <Button size="icon" onClick={() => setIsOpenCreateContactGroup(true)}>
            <PlusIcon className="size-4" />
          </Button>
        </div>

        {isPending ? (
          <Skeleton className="h-[300px] w-full" />
        ) : (
          <div className="rounded-xl bg-zinc-900 p-4 w-full">
            <DataTable
              columns={columns}
              data={contactGroupsPagination?.contactGroups || []}
            />
          </div>
        )}

        {contactGroupsPagination && (
          <PaginationControls
            currentPage={page}
            totalPages={contactGroupsPagination.totalPages}
            onPageChange={handlePageChange}
          />
        )}
      </div>

      <CreateContactGroupModal
        isOpen={isOpenCreateContactGroup}
        onClose={() => setIsOpenCreateContactGroup(false)}
      />
    </Container>
  );
}
