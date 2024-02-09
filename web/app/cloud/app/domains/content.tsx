'use client';

import axios from '@/app/utils/axios';
import { Button, Card, CardBody, Chip, useDisclosure } from '@nextui-org/react';
import { useCallback, useState } from 'react';
import { toast } from 'react-toastify';
import DNSDomainModal from './DNSDomainModal';
import DeleteForm from '../DeleteForm';
import { Domain } from './types';
import CreationDomainModal from './CreationDomainModal';
import { PlusIcon } from '@radix-ui/react-icons';

const statusColors: Record<string, 'warning' | 'success' | 'danger'> = {
  pending: 'warning',
  verified: 'success',
  failed: 'danger',
};

export default function Domains({
  domains: initialDomains,
}: {
  domains: Domain[];
}) {
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
  const [domains, setDomains] = useState<Domain[]>(initialDomains);
  const [selectedDomain, setSelectedDomain] = useState<Domain | null>(null);
  const {
    isOpen: isCreationModalOpen,
    onOpen: onCreationModalOpen,
    onOpenChange: onCreationModalOpenChange,
  } = useDisclosure();

  const fetchDomains = useCallback(async () => {
    try {
      const response = await axios.get('/domain');

      setDomains(response.data);
    } catch (error: any) {
      toast.error(error.message);
    }
  }, []);

  const requestDomainDelete = useCallback(
    (id: string) => {
      setSelectedDomain(domains.find((domain) => domain.id === id) || null);
      onDeleteModalOpen();
    },
    [domains, onDeleteModalOpen],
  );

  const deleteDomain = useCallback(
    async (id: string) => {
      try {
        await axios.delete(`/domain/${id}`);
        await fetchDomains();
      } catch (error: any) {
        toast.error(error.message);
      }
    },
    [fetchDomains],
  );

  return (
    <>
      <ul className="flex flex-col gap-3">
        {!domains.length && (
          <li className="text-center text-gray-500">No domains found</li>
        )}
        {domains.map((domain) => (
          <li key={domain.id}>
            <Card shadow="none" isBlurred fullWidth>
              <CardBody>
                <div className="flex justify-between items-center gap-4 w-full flex-wrap">
                  <div className="flex gap-2">
                    <span>{domain.name}</span>
                    <Chip
                      color={statusColors[domain.status]}
                      variant="flat"
                      size="sm"
                    >
                      {domain.status}
                    </Chip>
                  </div>
                  <div className="flex gap-3">
                    <Button
                      onClick={() => {
                        setSelectedDomain(domain);
                        onDNSModalOpen();
                      }}
                      size="sm"
                      color={
                        domain.status === 'pending' ? 'success' : 'primary'
                      }
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
                  </div>
                </div>
              </CardBody>
            </Card>
          </li>
        ))}
      </ul>
      <Button className="max-w-max mt-4 ml-auto" onClick={onCreationModalOpen}>
        <PlusIcon />
        New domain
      </Button>
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
        fetchDomains={async () => fetchDomains()}
      />
    </>
  );
}
