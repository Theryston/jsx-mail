'use client';

import axios from '@/app/utils/axios';
import { Button, useDisclosure } from '@nextui-org/react';
import { useCallback, useState } from 'react';
import { toast } from 'react-toastify';
import DNSDomainModal from './DNSDomainModal';
import DeleteForm from '../DeleteForm';
import { Domain } from './types';
import CreationDomainModal from './CreationDomainModal';
import { Add } from 'iconsax-react';
import Table from '../Table';
import moment from 'moment';
import useSWR from 'swr';
import fetcher from '@/app/utils/fetcher';

export default function Domains() {
  const {
    isOpen: isDNSModalOpen,
    onOpen: onDNSModalOpen,
    onOpenChange: onDNSModalOpenChange,
  } = useDisclosure();
  const {
    isOpen: isDeleteModalOpen,
    onOpen: onDeleteModalOpen,
    onOpenChange: onDeleteModalOpenChange,
  } = useDisclosure();
  const [selectedDomain, setSelectedDomain] = useState<Domain | null>(null);
  const {
    isOpen: isCreationModalOpen,
    onOpen: onCreationModalOpen,
    onOpenChange: onCreationModalOpenChange,
  } = useDisclosure();
  const {
    data: domains,
    mutate,
    isLoading,
  } = useSWR<Domain[]>('/domain', fetcher);

  const requestDomainDelete = useCallback(
    (id: string) => {
      setSelectedDomain(domains?.find((domain) => domain.id === id) || null);
      onDeleteModalOpen();
    },
    [domains, onDeleteModalOpen],
  );

  const deleteDomain = useCallback(
    async (id: string) => {
      try {
        await axios.delete(`/domain/${id}`);
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
          <span className="font-bold">Your</span> domains
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
        columns={['ID', 'Name', 'Status', 'Created at', <></>]}
        rows={
          domains?.map((domain) => [
            domain.id,
            domain.name,
            domain.status,
            moment(domain.createdAt).format('DD/MM/YYYY'),
            <div className="flex gap-3">
              <Button
                onClick={() => {
                  setSelectedDomain(domain);
                  onDNSModalOpen();
                }}
                size="sm"
                color={domain.status === 'pending' ? 'success' : 'primary'}
                variant="flat"
              >
                {domain.status === 'pending' ? 'Verify' : 'View DNS'}
              </Button>
              <Button
                onClick={() => requestDomainDelete(domain.id)}
                size="sm"
                color="danger"
                variant="flat"
              >
                Delete
              </Button>
            </div>,
          ]) || []
        }
      />
      <DNSDomainModal
        isOpen={isDNSModalOpen}
        onOpenChange={(value) => {
          if (!value) setSelectedDomain(null);
          onDNSModalOpenChange();
        }}
        domain={selectedDomain}
      />
      <DeleteForm
        confirmKey={selectedDomain?.name || ''}
        id={selectedDomain?.id || ''}
        isOpen={isDeleteModalOpen}
        onOpenChange={onDeleteModalOpenChange}
        onDelete={deleteDomain}
      />
      <CreationDomainModal
        isOpen={isCreationModalOpen}
        onOpenChange={onCreationModalOpenChange}
        fetchDomains={async () => {
          await mutate();
        }}
      />
    </>
  );
}
