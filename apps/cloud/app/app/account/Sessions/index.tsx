'use client';

import { Button, useDisclosure } from '@nextui-org/react';
import { useCallback, useEffect, useState } from 'react';
import DeleteForm from '../../DeleteForm';
import axios from '@/app/utils/axios';
import { toast } from 'react-toastify';
import moment from 'moment';
import CreationSessionModal from './CreationSessionModal';
import { useRouter } from 'next/navigation';
import Table from '../../Table';
import fetcher from '@/app/utils/fetcher';
import useSWR from 'swr';

export type Session = {
  id: string;
  createdAt: string;
  description: string;
  expiresAt: string | null;
  permissions: string[];
};

export default function Sessions() {
  const {
    isOpen: isDeleteModalOpen,
    onOpen: onDeleteModalOpen,
    onOpenChange: onDeleteModalOpenChange,
  } = useDisclosure();
  const {
    isOpen: isCreationModalOpen,
    onOpen: onCreationModalOpen,
    onOpenChange: onCreationModalOpenChange,
  } = useDisclosure();
  const [selectedSession, setSelectedSession] = useState<Session | null>(null);
  const [currentSessionId, setCurrentSessionId] = useState<string | null>(null);
  const router = useRouter();
  const {
    data: sessions,
    isLoading,
    mutate,
  } = useSWR<Session[]>('/session', fetcher);

  const logout = useCallback(async () => {
    const toastId = toast.loading('Logging out...');

    try {
      await axios.delete('/session');
      toast.success('Logged out successfully');
      document.cookie = 'token=; path=/; max-age=0;';
      document.cookie = 'sessionId=; path=/; max-age=0;';
      window.location.href = '/sign-in';
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      toast.dismiss(toastId);
    }
  }, [router]);

  const requestSessionDelete = useCallback(
    (id: string) => {
      if (currentSessionId === id) {
        logout();
        return;
      }

      setSelectedSession(
        sessions?.find((session) => session.id === id) || null,
      );
      onDeleteModalOpen();
    },
    [sessions, onDeleteModalOpen, currentSessionId, logout],
  );

  const deleteSession = useCallback(
    async (id: string) => {
      try {
        await axios.delete(`/session?id=${id}`);
        await mutate();
      } catch (error: any) {
        toast.error(error.message);
      }
    },
    [mutate],
  );

  useEffect(() => {
    const sessionId = document.cookie
      .split(';')
      .find((c) => c.trim().startsWith('sessionId='))
      ?.split('=')[1];

    setCurrentSessionId(sessionId || null);
  }, []);

  return (
    <div id="sessions">
      <Table
        isLoading={isLoading}
        columns={[
          'ID',
          'Permissions',
          'Description',
          'Created At',
          'Expires At',
          <Button
            size="sm"
            color="primary"
            variant="flat"
            className="w-16"
            onClick={onCreationModalOpen}
          >
            Create
          </Button>,
        ]}
        rows={
          sessions?.map((s) => [
            s.id,
            s.permissions.join(', '),
            s.description,
            moment(s.createdAt).format('DD/MM/YYYY HH:mm:ss'),
            s.expiresAt
              ? moment(s.expiresAt).format('DD/MM/YYYY HH:mm:ss')
              : 'Never',
            <Button
              onClick={() => requestSessionDelete(s.id)}
              size="sm"
              color="danger"
              variant="flat"
              className="w-16"
            >
              {s.id === currentSessionId ? 'Logout' : 'Delete'}
            </Button>,
          ]) || []
        }
      />
      <DeleteForm
        confirmKey={selectedSession?.id || ''}
        id={selectedSession?.id || ''}
        isOpen={isDeleteModalOpen}
        onOpenChange={onDeleteModalOpenChange}
        onDelete={deleteSession}
      />
      <CreationSessionModal
        isOpen={isCreationModalOpen}
        onOpenChange={onCreationModalOpenChange}
        fetchSessions={async () => {
          await mutate();
        }}
      />
    </div>
  );
}
