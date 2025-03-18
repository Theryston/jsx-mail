'use client';

import { Container } from '@/components/container';
import { Button } from '@jsx-mail/ui/button';
import { PlusIcon, FileUpIcon, UserPlusIcon } from 'lucide-react';
import { useState } from 'react';
import {
  useGetContactGroup,
  useContactGroupContacts,
} from '@/hooks/contact-group';
import { Skeleton } from '@jsx-mail/ui/skeleton';
import { useRouter } from 'next/navigation';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@jsx-mail/ui/dropdown-menu';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@jsx-mail/ui/dialog';
import { DataTable } from './data-table';
import { columns } from './columns';
import { Badge } from '@jsx-mail/ui/badge';
import { PaginationControls } from '@jsx-mail/ui/pagination-controls';
import { Input } from '@jsx-mail/ui/input';

export default function ContactGroupPage({
  params,
}: {
  params: { id: string };
}) {
  const { id } = params;
  const router = useRouter();
  const [isAddContactManuallyOpen, setIsAddContactManuallyOpen] =
    useState(false);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');

  const { data: contactGroup, isPending: isContactGroupPending } =
    useGetContactGroup(id);
  const { data: contactsPagination, isPending: isContactsPending } =
    useContactGroupContacts(id, page, search);

  const handlePageChange = (newPage: number) => {
    setPage(newPage);
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
    setPage(1);
  };

  const handleImportCSV = () => {
    router.push(`/contacts/${id}/import`);
  };

  const handleAddManually = () => {
    setIsAddContactManuallyOpen(true);
  };

  if (isContactGroupPending) {
    return (
      <Container header>
        <div className="flex flex-col gap-6">
          <Skeleton className="h-12 w-64" />
          <Skeleton className="h-[400px] w-full" />
        </div>
      </Container>
    );
  }

  return (
    <Container header>
      <div className="flex flex-col gap-4">
        <div className="flex flex-col gap-4 md:flex-row md:items-center justify-between">
          <div className="flex items-center justify-between">
            <div className="flex gap-2 flex-col">
              <h1 className="text-2xl font-bold">{contactGroup?.name}</h1>
              <Badge variant="outline" className="w-fit h-fit">
                {contactGroup?.contactsCount || 0} contacts
              </Badge>
            </div>

            <div className="md:hidden">
              <AddContactButton
                handleAddManually={handleAddManually}
                handleImportCSV={handleImportCSV}
              />
            </div>
          </div>

          <div className="flex gap-2 items-center">
            <div className="hidden md:block">
              <AddContactButton
                handleAddManually={handleAddManually}
                handleImportCSV={handleImportCSV}
              />
            </div>

            <div className="w-full md:w-64">
              <Input
                placeholder="Search contacts..."
                value={search}
                onChange={handleSearchChange}
              />
            </div>
          </div>
        </div>

        <div className="rounded-xl bg-zinc-900 p-4 w-full">
          {isContactsPending ? (
            <Skeleton className="h-[400px] w-full" />
          ) : (
            <DataTable
              columns={columns(id)}
              data={contactsPagination?.contacts || []}
            />
          )}
        </div>

        {contactsPagination && contactsPagination.totalPages > 1 && (
          <div className="flex justify-center">
            <PaginationControls
              currentPage={page}
              totalPages={contactsPagination.totalPages}
              onPageChange={handlePageChange}
            />
          </div>
        )}
      </div>

      <Dialog
        open={isAddContactManuallyOpen}
        onOpenChange={setIsAddContactManuallyOpen}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add Contact Manually</DialogTitle>
            <DialogDescription>
              This is a placeholder modal. The actual implementation will be
              done manually.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button onClick={() => setIsAddContactManuallyOpen(false)}>
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Container>
  );
}

function AddContactButton({
  handleAddManually,
  handleImportCSV,
}: {
  handleAddManually: () => void;
  handleImportCSV: () => void;
}) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button size="icon">
          <PlusIcon className="size-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        <DropdownMenuItem onClick={handleAddManually}>
          <UserPlusIcon className="mr-2 size-4" />
          Add Manually
        </DropdownMenuItem>
        <DropdownMenuItem onClick={handleImportCSV}>
          <FileUpIcon className="mr-2 size-4" />
          Import CSV
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
