'use client';

import { Container } from '@/components/container';
import { Button } from '@jsx-mail/ui/button';
import { PlusIcon } from 'lucide-react';
import { useState } from 'react';
import { useFiles } from '@/hooks/file';
import { Skeleton } from '@jsx-mail/ui/skeleton';
import { columns } from './columns';
import { DataTable } from './data-table';
import { UploadFileModal } from './upload-file-modal';
import { PaginationControls } from '@jsx-mail/ui/pagination-controls';

export default function FilesPage() {
  const [isOpenUploadFile, setIsOpenUploadFile] = useState(false);
  const [page, setPage] = useState(1);
  const { data: filesPagination, isPending } = useFiles(page);

  const handlePageChange = (newPage: number) => {
    setPage(newPage);
  };

  return (
    <Container header>
      <div className="flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl">
            <span className="font-bold">Your</span> files
          </h1>

          <Button size="icon" onClick={() => setIsOpenUploadFile(true)}>
            <PlusIcon className="size-4" />
          </Button>
        </div>

        {isPending ? (
          <Skeleton className="h-[300px] w-full" />
        ) : (
          <div className="rounded-xl bg-zinc-900 p-4 w-full">
            <DataTable columns={columns} data={filesPagination?.files || []} />
          </div>
        )}

        {filesPagination && (
          <PaginationControls
            currentPage={page}
            totalPages={filesPagination.totalPages}
            onPageChange={handlePageChange}
          />
        )}
      </div>

      <UploadFileModal
        isOpen={isOpenUploadFile}
        onClose={() => setIsOpenUploadFile(false)}
      />
    </Container>
  );
}
