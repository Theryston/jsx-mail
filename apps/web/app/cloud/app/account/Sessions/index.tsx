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
import { AddSquare } from 'iconsax-react';

export type Session = {
  id: string;
  createdAt: string;
  description: string;
  expiresAt: string | null;
  permissions: string[];
};

type Props = {
  sessions: Session[];
};

export default function Sessions({ sessions: initialSessions }: Props) {
  const [sessions, setSessions] = useState<Session[]>([]);
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

  const logout = useCallback(async () => {
    const toastId = toast.loading('Logging out...');

    try {
      await axios.delete('/session');
      toast.success('Logged out successfully');
      document.cookie = 'token=; path=/; max-age=0;';
      document.cookie = 'sessionId=; path=/; max-age=0;';
      window.location.href = '/cloud/sign-in';
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

      setSelectedSession(sessions.find((session) => session.id === id) || null);
      onDeleteModalOpen();
    },
    [sessions, onDeleteModalOpen, currentSessionId, logout],
  );

  useEffect(() => {
    setSessions((prev) => {
      const currentSession = prev.find(
        (session) => session.id === currentSessionId,
      );

      let allSessions = [...prev];

      if (currentSession) {
        allSessions = allSessions.filter(
          (session) => session.id !== currentSession.id,
        );

        allSessions = [currentSession, ...allSessions];
      }

      return allSessions;
    });
  }, [currentSessionId]);

  useEffect(() => {
    setSessions(initialSessions);
  }, [initialSessions]);

  const fetchSessions = useCallback(async () => {
    try {
      const response = await axios.get('/session');

      setSessions(response.data);
    } catch (error: any) {
      toast.error(error.message);
    }
  }, []);

  const deleteSession = useCallback(
    async (id: string) => {
      try {
        await axios.delete(`/session?id=${id}`);
        await fetchSessions();
      } catch (error: any) {
        toast.error(error.message);
      }
    },
    [fetchSessions],
  );

  useEffect(() => {
    const sessionId = document.cookie
      .split(';')
      .find((c) => c.trim().startsWith('sessionId='))
      ?.split('=')[1];

    setCurrentSessionId(sessionId || null);
  }, []);

  return (
    <>
      <Table
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
        rows={sessions.map((s) => [
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
        ])}
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
        fetchSessions={fetchSessions}
      />
    </>
  );
}
