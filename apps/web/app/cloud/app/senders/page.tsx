'use client';

import { Button, useDisclosure } from '@nextui-org/react';
import { Sender } from './types';
import { useCallback, useState } from 'react';
import DeleteForm from '../DeleteForm';
import axios from '@/app/utils/axios';
import { toast } from 'react-toastify';
import { Add } from 'iconsax-react';
import CreationSenderModal from './CreationSenderModal';
import Table from '../Table';
import moment from 'moment';
import useSWR from 'swr';
import fetcher from '@/app/utils/fetcher';

export default function Content() {
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
  const {
    data: senders,
    mutate,
    isLoading,
  } = useSWR<Sender[]>('/sender', fetcher);

  const requestSenderDelete = useCallback(
    (id: string) => {
      const sender = senders?.find((sender) => sender.id === id) || null;

      setSelectedSender(sender);
      onDeleteModalOpen();
    },
    [senders, onDeleteModalOpen],
  );

  const deleteSender = useCallback(
    async (id: string) => {
      try {
        await axios.delete(`/sender/${id}`);
        await mutate();
      } catch (error: any) {
        toast.error(error.message);
      }
    },
    [mutate],
  );

  return (
    <>
      <div className="flex w-full justify-between items-center">
        <h1 className="text-2xl">
          <span className="font-bold">Your</span> senders
        </h1>
        <Button
          size="sm"
          isIconOnly
          color="primary"
          onClick={onCreationModalOpen}
        >
          <Add />
        </Button>
      </div>
      <Table
        isLoading={isLoading}
        columns={['ID', 'Name', 'Email', 'Created at', <></>]}
        rows={
          senders?.map((sender) => [
            sender.id,
            sender.name,
            sender.email,
            moment(sender.createdAt).format('MMMM Do YYYY, h:mm:ss a'),
            <Button
              onClick={() => requestSenderDelete(sender.id)}
              size="sm"
              color="danger"
              variant="flat"
            >
              Delete
            </Button>,
          ]) || []
        }
      />
      <CreationSenderModal
        isOpen={isCreationModalOpen}
        onOpenChange={onCreationModalOpenChange}
        fetchSenders={async () => {
          await mutate();
        }}
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
