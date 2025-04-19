'use client';

import { useState, useEffect } from 'react';
import { useSessions, useDeleteSession } from '@/hooks/user';
import { toast } from '@jsx-mail/ui/sonner';
import { Button } from '@jsx-mail/ui/button';
import { PlusIcon, TrashIcon, MoreHorizontal } from 'lucide-react';
import { Session } from '@/types/user';
import { DeleteConfirmationModal } from '@jsx-mail/ui/delete-confirmation-modal';
import { CreateSessionModal } from './create-session-modal';
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
import { useRouter } from 'next/navigation';
import {
  DropdownMenuContent,
  DropdownMenuItem,
} from '@jsx-mail/ui/dropdown-menu';
import { DropdownMenu, DropdownMenuTrigger } from '@jsx-mail/ui/dropdown-menu';

export function Sessions() {
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const { isPending } = useSessions();

  if (isPending) {
    return (
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Sessions</CardTitle>
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
          <CardTitle>Sessions</CardTitle>
          <Button size="icon" onClick={() => setIsCreateModalOpen(true)}>
            <PlusIcon className="size-4" />
          </Button>
        </CardHeader>
        <CardContent>
          <SessionTable
            isCreateModalOpen={isCreateModalOpen}
            setIsCreateModalOpen={setIsCreateModalOpen}
          />
        </CardContent>
      </Card>
    </>
  );
}

export function SessionTable({
  isCreateModalOpen,
  setIsCreateModalOpen,
}: {
  isCreateModalOpen: boolean;
  setIsCreateModalOpen: (isOpen: boolean) => void;
}) {
  const { data: sessions } = useSessions();
  const { mutateAsync: deleteSession } = useDeleteSession();

  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedSession, setSelectedSession] = useState<Session | null>(null);
  const [currentSessionId, setCurrentSessionId] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const sessionId = document.cookie
      .split(';')
      .find((c) => c.trim().startsWith('sessionId='))
      ?.split('=')[1];

    setCurrentSessionId(sessionId || null);
  }, []);

  const handleDeleteSession = async (id: string) => {
    if (id === currentSessionId) {
      router.push('/sign-out');
      return;
    }

    const session = sessions?.find((s) => s.id === id) || null;
    setSelectedSession(session);
    setIsDeleteModalOpen(true);
  };

  const confirmDeleteSession = async () => {
    if (!selectedSession) return;

    try {
      await deleteSession(selectedSession.id);
      toast.success('Session deleted successfully');
    } catch (error) {
      toast.error('Failed to delete session');
      console.error(error);
    }
  };

  return (
    <>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>ID</TableHead>
            <TableHead>Description</TableHead>
            <TableHead>Permissions</TableHead>
            <TableHead>Created At</TableHead>
            <TableHead>Expires At</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {sessions && sessions.length > 0 ? (
            sessions.map((session) => (
              <TableRow key={session.id}>
                <TableCell>
                  {session.id}
                  {session.id === currentSessionId && (
                    <span className="ml-2 text-xs text-green-500">
                      (current)
                    </span>
                  )}
                </TableCell>
                <TableCell>{session.description}</TableCell>
                <TableCell>{session.permissions.join(', ')}</TableCell>
                <TableCell>
                  {format(new Date(session.createdAt), 'dd MMM yyyy HH:mm')}
                </TableCell>
                <TableCell>
                  {session.expiresAt
                    ? format(new Date(session.expiresAt), 'dd MMM yyyy HH:mm')
                    : 'Never'}
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
                        onClick={() => handleDeleteSession(session.id)}
                      >
                        <TrashIcon className="size-4" />
                        {session.id === currentSessionId ? 'Logout' : 'Delete'}
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell
                colSpan={6}
                className="text-center py-6 text-muted-foreground"
              >
                No sessions found
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>

      <CreateSessionModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
      />

      <DeleteConfirmationModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={confirmDeleteSession}
        title="Delete Session"
        description={`Are you sure you want to delete this session? This action cannot be undone.`}
        confirmationKeyPlaceholder="Type the session ID to confirm"
        expectedConfirmationKey={selectedSession?.id || ''}
      />
    </>
  );
}
