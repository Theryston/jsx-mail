'use client';

import { Button, Card, CardBody, useDisclosure } from '@nextui-org/react';
import { Sender } from './types';
import { useCallback, useState } from 'react';
import DeleteForm from '../DeleteForm';
import axios from '@/app/utils/axios';
import { toast } from 'react-toastify';
import { PlusIcon } from '@radix-ui/react-icons';
import CreationSenderModal from './CreationSenderModal';

export default function Content({
  senders: initialSenders,
}: {
  senders: Sender[];
}) {
  const [senders, setSenders] = useState<Sender[]>(initialSenders);
  const [selectedSender, setSelectedSender] = useState<Sender | null>(null);
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

  const fetchSenders = useCallback(async () => {
    try {
      const response = await axios.get('/sender');

      setSenders(response.data);
    } catch (error: any) {
      toast.error(error.message);
    }
  }, []);

  const requestSenderDelete = useCallback(
    (id: string) => {
      const sender = senders.find((sender) => sender.id === id) || null;

      setSelectedSender(sender);
      onDeleteModalOpen();
    },
    [senders, onDeleteModalOpen],
  );

  const deleteSender = useCallback(
    async (id: string) => {
      try {
        await axios.delete(`/sender/${id}`);
        await fetchSenders();
      } catch (error: any) {
        toast.error(error.message);
      }
    },
    [fetchSenders],
  );

  return (
    <>
      <ul className="flex flex-col gap-3">
        {!senders.length && (
          <li className="text-center text-gray-500">No senders found</li>
        )}
        {senders.map((sender) => (
          <li key={sender.id}>
            <Card shadow="none" isBlurred fullWidth>
              <CardBody>
                <div className="flex justify-between items-center gap-4 w-full flex-wrap">
                  <span>{sender.email}</span>
                  <Button
                    onClick={() => requestSenderDelete(sender.id)}
                    size="sm"
                    color="danger"
                    variant="flat"
                  >
                    Delete
                  </Button>
                </div>
              </CardBody>
            </Card>
          </li>
        ))}
      </ul>
      <Button className="max-w-max mt-4 ml-auto" onClick={onCreationModalOpen}>
        <PlusIcon />
        New Sender
      </Button>
      <CreationSenderModal
        isOpen={isCreationModalOpen}
        onOpenChange={onCreationModalOpenChange}
        fetchSenders={async () => fetchSenders()}
      />
      <DeleteForm
        confirmKey={selectedSender?.email || ''}
        id={selectedSender?.id || ''}
        isOpen={isDeleteModalOpen}
        onOpenChange={onDeleteModalOpenChange}
        onDelete={deleteSender}
      />
    </>
  );
}
