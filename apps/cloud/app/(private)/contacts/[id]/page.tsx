'use client';

import { Container } from '@/components/container';
import { Button } from '@jsx-mail/ui/button';
import { PlusIcon, FileUpIcon, UserPlusIcon } from 'lucide-react';
import { use, useEffect, useState } from 'react';
import {
  useGetContactGroup,
  useContactGroupContacts,
  useContactImports,
  useMarkContactImportAsRead,
} from '@/hooks/contact-group';
import { Skeleton } from '@jsx-mail/ui/skeleton';
import { useRouter } from 'next/navigation';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@jsx-mail/ui/dropdown-menu';
import { DataTable } from './data-table';
import { columns } from './columns';
import { Badge } from '@jsx-mail/ui/badge';
import { PaginationControls } from '@jsx-mail/ui/pagination-controls';
import { Input } from '@jsx-mail/ui/input';
import AddContactManually from './add-contact-manually';
import { ContactImport } from '@/types/contact-group';
import { cn } from '@jsx-mail/ui/lib/utils';
import { DialogContent, DialogTitle, DialogHeader } from '@jsx-mail/ui/dialog';
import { Dialog } from '@jsx-mail/ui/dialog';
import { useQueryClient } from '@tanstack/react-query';

export default function ContactGroupPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const router = useRouter();
  const [isAddContactManuallyOpen, setIsAddContactManuallyOpen] =
    useState(false);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');

  const { data: contactGroup, isPending: isContactGroupPending } =
    useGetContactGroup(id);
  const { data: contactsPagination, isPending: isContactsPending } =
    useContactGroupContacts(id, page, search);
  const [processingImport, setProcessingImport] =
    useState<ContactImport | null>(null);
  const [notReadFinalStatusImports, setNotReadFinalStatusImports] = useState<
    ContactImport[]
  >([]);
  const { data: contactImports } = useContactImports(id, {
    refetchInterval: processingImport ? 5000 : false,
  });
  const queryClient = useQueryClient();

  useEffect(() => {
    queryClient.invalidateQueries({
      queryKey: ['contactGroupContacts', id],
    });

    queryClient.invalidateQueries({
      queryKey: ['contactGroup'],
    });
  }, [contactImports, id]);

  useEffect(() => {
    if (!contactImports) return;
    setProcessingImport(
      contactImports.find(
        (contactImport) =>
          contactImport.status === 'processing' ||
          contactImport.status === 'pending',
      ) || null,
    );
  }, [contactImports]);

  useEffect(() => {
    if (!contactImports) return;
    setNotReadFinalStatusImports(
      contactImports.filter(
        (contactImport) =>
          (contactImport.status === 'failed' ||
            contactImport.status === 'completed') &&
          !contactImport.readFinalStatusAt,
      ),
    );
  }, [contactImports]);

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
        {processingImport && <ImportsBanner imports={[processingImport]} />}

        {notReadFinalStatusImports.length > 0 && (
          <ImportsBanner imports={notReadFinalStatusImports} />
        )}

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

      <AddContactManually
        isOpen={isAddContactManuallyOpen}
        onOpenChange={setIsAddContactManuallyOpen}
        id={id}
      />
    </Container>
  );
}

function ImportsBanner({ imports }: { imports: ContactImport[] }) {
  const [selectedImport, setSelectedImport] = useState<ContactImport | null>(
    null,
  );
  const [isViewingErrors, setIsViewingErrors] = useState(false);
  const { mutate: markContactImportAsRead, isPending: isMarkingAsRead } =
    useMarkContactImportAsRead();

  return (
    <div className="flex flex-col gap-2">
      {imports.map((importItem) => (
        <div
          key={importItem.id}
          className={cn(
            'rounded-md p-4 flex flex-col md:flex-row justify-between md:items-center gap-2',
            {
              'bg-amber-500/10 text-amber-500 border border-amber-500/20 animate-pulse':
                importItem.status === 'pending' ||
                importItem.status === 'processing',
              'bg-green-500/10 text-green-500 border border-green-500/20':
                importItem.status === 'completed',
              'bg-red-500/10 text-red-500 border border-red-500/20':
                importItem.status === 'failed',
            },
          )}
        >
          <div className="flex flex-col gap-1">
            {(importItem.status === 'pending' ||
              importItem.status === 'processing') && (
              <p className="text-sm">
                There&apos;s a contact import in progress.
              </p>
            )}

            {importItem.status === 'failed' && (
              <p className="text-sm">
                There was an error importing the contacts.
              </p>
            )}

            {importItem.status === 'completed' && (
              <p className="text-sm">
                The contacts were imported successfully.
              </p>
            )}

            {importItem.failures.length > 0 && (
              <p className="text-xs">
                {importItem.failures.length} failures found.
              </p>
            )}

            {importItem.totalLines > 0 && (
              <p className="text-xs">
                {importItem.processedLines}/{importItem.totalLines} lines
                processed
              </p>
            )}
          </div>

          <div className="flex gap-2">
            {(importItem.status === 'completed' ||
              importItem.status === 'failed') && (
              <Button
                size="sm"
                variant="outline"
                className="text-white"
                onClick={() => {
                  setSelectedImport(importItem);
                  markContactImportAsRead(importItem.id);
                }}
                disabled={
                  isMarkingAsRead && selectedImport?.id === importItem.id
                }
              >
                {isMarkingAsRead && selectedImport?.id === importItem.id
                  ? 'Ignoring...'
                  : 'Ignore'}
              </Button>
            )}

            {importItem.failures.length > 0 && (
              <Button
                size="sm"
                variant="outline"
                className="text-white"
                onClick={() => {
                  setSelectedImport(importItem);
                  setIsViewingErrors(true);
                }}
              >
                View errors
              </Button>
            )}
          </div>
        </div>
      ))}

      <ViewErrorsDialog
        isOpen={isViewingErrors}
        onOpenChange={setIsViewingErrors}
        importItem={selectedImport}
      />
    </div>
  );
}

function ViewErrorsDialog({
  isOpen,
  onOpenChange,
  importItem,
}: {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  importItem: ContactImport | null;
}) {
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Errors</DialogTitle>
        </DialogHeader>

        <div className="flex flex-col gap-2">
          {importItem?.failures.map((failure) => (
            <code
              key={failure.message}
              className="flex flex-col gap-1 p-2 rounded-md bg-zinc-900 overflow-auto"
            >
              {failure.line && (
                <p className="text-xs">
                  <span className="font-bold">Line:</span> {failure.line}
                </p>
              )}
              <p className="text-xs">{failure.createdAt.toLocaleString()}</p>
              <p className="text-xs">{failure.message}</p>
            </code>
          ))}
        </div>
      </DialogContent>
    </Dialog>
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
