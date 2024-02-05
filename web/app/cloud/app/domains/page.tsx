'use client';

import axios from '@/utils/axios';
import {
  Button,
  Chip,
  Spinner,
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
  useDisclosure,
} from '@nextui-org/react';
import { useCallback, useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import CreationDomainModal from './CreationDomainModal';
import DNSDomainModal from './DNSDomainModal';
import DeleteForm from '../DeleteForm';
import { Domain } from './types';

const statusColors: Record<string, 'warning' | 'success' | 'danger'> = {
  pending: 'warning',
  verified: 'success',
  failed: 'danger',
};

export default function Domains() {
  const {
    isOpen: isCreationModalOpen,
    onOpen: onCreationModalOpen,
    onOpenChange: onCreationModalOpenChange,
  } = useDisclosure();
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
  const [isLoading, setIsLoading] = useState(true);
  const [domains, setDomains] = useState<Domain[]>([]);
  const [selectedDomain, setSelectedDomain] = useState<Domain | null>(null);

  const fetchDomains = useCallback(async () => {
    setIsLoading(true);
    try {
      const response = await axios.get('/domain');

      setDomains(response.data);
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setIsLoading(false);
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

  useEffect(() => {
    fetchDomains();
  }, [fetchDomains]);

  return (
    <>
      <div className="flex w-full justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Domains</h1>
        <Button
          color="primary"
          className="max-w-max"
          onPress={onCreationModalOpen}
        >
          Add Domain
        </Button>
      </div>
      <Table
        aria-label="List of domains"
        className="overflow-x-auto"
        removeWrapper
      >
        <TableHeader>
          <TableColumn>ID</TableColumn>
          <TableColumn>NAME</TableColumn>
          <TableColumn>STATUS</TableColumn>
          <TableColumn>ACTIONS</TableColumn>
        </TableHeader>
        <TableBody
          isLoading={isLoading}
          loadingContent={<Spinner />}
          emptyContent="No domains found"
        >
          {domains.map((domain) => (
            <TableRow key={domain.id}>
              <TableCell>{domain.id}</TableCell>
              <TableCell>{domain.name}</TableCell>
              <TableCell>
                <Chip variant="flat" color={statusColors[domain.status]}>
                  {domain.status}
                </Chip>
              </TableCell>
              <TableCell>
                <Button
                  color="danger"
                  variant="light"
                  onPress={() => requestDomainDelete(domain.id)}
                >
                  Delete
                </Button>
                {domain.status === 'pending' && (
                  <Button
                    color="success"
                    variant="light"
                    onPress={() => {
                      setSelectedDomain(domain);
                      onDNSModalOpen();
                    }}
                  >
                    Verify Domain
                  </Button>
                )}
                {domain.status !== 'pending' && (
                  <Button
                    color="primary"
                    variant="light"
                    onPress={() => {
                      setSelectedDomain(domain);
                      onDNSModalOpen();
                    }}
                  >
                    View DNS
                  </Button>
                )}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <CreationDomainModal
        isOpen={isCreationModalOpen}
        onOpenChange={onCreationModalOpenChange}
        fetchDomains={fetchDomains}
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
    </>
  );
}
