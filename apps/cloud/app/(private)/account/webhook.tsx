'use client';

import { useState } from 'react';
import { useDeleteUserWebhook, useListUserWebhooks } from '@/hooks/user';
import { toast } from '@jsx-mail/ui/sonner';
import { Button } from '@jsx-mail/ui/button';
import { PlusIcon, TrashIcon, MoreHorizontal } from 'lucide-react';
import { DeleteConfirmationModal } from '@jsx-mail/ui/delete-confirmation-modal';
import { CreateWebhookModal } from './create-webhook-modal';
import { Card, CardContent, CardHeader, CardTitle } from '@jsx-mail/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@jsx-mail/ui/table';
import { format } from 'date-fns';
import { Skeleton } from '@jsx-mail/ui/skeleton';
import {
  DropdownMenuContent,
  DropdownMenuItem,
} from '@jsx-mail/ui/dropdown-menu';
import { DropdownMenu, DropdownMenuTrigger } from '@jsx-mail/ui/dropdown-menu';

export function Webhook() {
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const { data: webhooks, isLoading } = useListUserWebhooks();
  const { mutateAsync: deleteWebhook } = useDeleteUserWebhook();

  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedWebhook, setSelectedWebhook] = useState<{
    id: string;
    url: string;
  } | null>(null);

  const handleDeleteWebhook = async (id: string, url: string) => {
    setSelectedWebhook({ id, url });
    setIsDeleteModalOpen(true);
  };

  const confirmDeleteWebhook = async () => {
    if (!selectedWebhook) return;

    try {
      await deleteWebhook(selectedWebhook.id);
      toast.success('Webhook deleted successfully');
    } catch (error) {
      toast.error('Failed to delete webhook');
      console.error(error);
    }
  };

  if (isLoading) {
    return (
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Webhooks</CardTitle>
          <Skeleton className="h-9 w-9" />
        </CardHeader>
        <CardContent>
          <Skeleton className="h-[300px] w-full" />
        </CardContent>
      </Card>
    );
  }

  return (
    <>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Webhooks</CardTitle>
          <Button size="icon" onClick={() => setIsCreateModalOpen(true)}>
            <PlusIcon className="size-4" />
          </Button>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>URL</TableHead>
                <TableHead>Statuses</TableHead>
                <TableHead>Created At</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {webhooks && webhooks.length > 0 ? (
                webhooks.map((webhook) => (
                  <TableRow key={webhook.id}>
                    <TableCell>{webhook.url}</TableCell>
                    <TableCell>{webhook.messageStatuses.join(', ')}</TableCell>
                    <TableCell>
                      {format(new Date(webhook.createdAt), 'dd MMM yyyy HH:mm')}
                    </TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="outline" size="icon">
                            <MoreHorizontal className="size-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem
                            onClick={() =>
                              handleDeleteWebhook(webhook.id, webhook.url)
                            }
                          >
                            <TrashIcon className="size-4" />
                            Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell
                    colSpan={4}
                    className="text-center py-6 text-muted-foreground"
                  >
                    No webhooks found
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <CreateWebhookModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
      />

      <DeleteConfirmationModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={confirmDeleteWebhook}
        title="Delete Webhook"
        description={`Are you sure you want to delete this webhook? This action cannot be undone.`}
        confirmationKeyPlaceholder="Type delete to confirm"
        expectedConfirmationKey="delete"
      />
    </>
  );
}
