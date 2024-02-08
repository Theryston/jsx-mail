'use client';

import { Button, Card, CardBody, Chip, useDisclosure } from '@nextui-org/react';
import SectionsList from '../../SectionsList';
import SectionItem from '../../SectionItem';
import { useCallback, useEffect, useState } from 'react';
import DeleteForm from '../../DeleteForm';
import axios from '@/utils/axios';
import { toast } from 'react-toastify';
import moment from 'moment';
import { PlusIcon } from '@radix-ui/react-icons';
import CreationSessionModal from './CreationSessionModal';

type Session = {
  id: string;
  createdAt: string;
  description: string;
  expiresAt: string | null;
  permissions: string[];
};

type Props = {
  sessions: Session[];
};

export default function ContentSessions({ sessions: initialSessions }: Props) {
  const [sessions, setSessions] = useState(initialSessions);
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

  const requestSessionDelete = useCallback(
    (id: string) => {
      setSelectedSession(sessions.find((session) => session.id === id) || null);
      onDeleteModalOpen();
    },
    [sessions, onDeleteModalOpen],
  );

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
      <SectionsList>
        <SectionItem
          title="Sessions"
          description="See all sessions of your account. You also can delete or generate a new session token for use into your application."
        >
          <ul className="flex flex-col gap-3">
            {sessions.map((session) => (
              <li key={session.id}>
                <Card shadow="none" isBlurred fullWidth>
                  <CardBody>
                    <div className="flex justify-between items-start gap-4 w-full flex-wrap">
                      <div className="flex flex-col gap-2">
                        <p>
                          <b>Session Id:</b> {session.id}
                        </p>
                        <p>
                          <b>Description:</b> {session.description}
                        </p>
                        <p>
                          <b>Permissions: </b>
                          {session.permissions.join(', ')}
                        </p>
                        <p>
                          <b>Created at:</b>{' '}
                          {moment(session.createdAt).format(
                            'MMMM Do YYYY, h:mm:ss a',
                          )}
                        </p>
                        <p>
                          <b>Expires at:</b>{' '}
                          {session.expiresAt
                            ? moment(session.expiresAt).format(
                                'MMMM Do YYYY, h:mm:ss a',
                              )
                            : 'Never'}
                        </p>
                        {session.id === currentSessionId && (
                          <Chip color="success" variant="flat" size="sm">
                            Current
                          </Chip>
                        )}
                      </div>
                      <div className="flex gap-3">
                        {session.id !== currentSessionId && (
                          <Button
                            onClick={() => requestSessionDelete(session.id)}
                            size="sm"
                            color="danger"
                            variant="flat"
                          >
                            Delete
                          </Button>
                        )}
                      </div>
                    </div>
                  </CardBody>
                </Card>
              </li>
            ))}
          </ul>
          <Button
            className="max-w-max mt-4 ml-auto"
            onClick={onCreationModalOpen}
          >
            <PlusIcon />
            New session
          </Button>
        </SectionItem>
      </SectionsList>
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
