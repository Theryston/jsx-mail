'use client';

import { Container } from '@/components/container';
import { useState } from 'react';
import { useAdminUsers } from '@/hooks/user';
import { Skeleton } from '@jsx-mail/ui/skeleton';
import { columns } from './columns';
import { DataTable } from './data-table';
import { PaginationControls } from '@jsx-mail/ui/pagination-controls';
import { Input } from '@jsx-mail/ui/input';
import { useDebounce } from '@/hooks/use-debounce';

export default function AdminUsers() {
  const [page, setPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const debouncedSearchTerm = useDebounce(searchTerm, 500);

  const { data: usersPagination, isPending } = useAdminUsers(
    page,
    debouncedSearchTerm,
  );

  const handlePageChange = (newPage: number) => {
    setPage(newPage);
  };

  return (
    <Container header>
      <div className="flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl">
            <span className="font-bold">Admin,</span> users
          </h1>

          <Input
            placeholder="Search users..."
            value={searchTerm}
            className="w-64"
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        {isPending ? (
          <Skeleton className="h-[300px] w-full" />
        ) : (
          <div className="rounded-xl bg-zinc-900 p-4 w-full">
            <DataTable columns={columns} data={usersPagination?.users || []} />
          </div>
        )}

        {usersPagination && (
          <PaginationControls
            currentPage={page}
            totalPages={usersPagination.totalPages}
            onPageChange={handlePageChange}
          />
        )}
      </div>
    </Container>
  );
}
