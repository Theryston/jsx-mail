'use client';

import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
} from '@nextui-org/react';
import { Domain } from './types';

type Props = {
  isOpen: boolean;
  // eslint-disable-next-line no-unused-vars
  onOpenChange: (isOpen: boolean) => void;
  domain: Domain | null;
};

export default function DNSDomainModal({
  isOpen,
  onOpenChange,
  domain,
}: Props) {
  if (!domain) return null;

  return (
    <Modal isOpen={isOpen} onOpenChange={onOpenChange} size="full">
      <ModalContent>
        <ModalHeader className="flex flex-col gap-1">
          <h1 className="text-xl font-bold">Domain DNS Records</h1>
          <p className="text-sm text-gray-500">
            Here is the list of DNS records for this domain.{' '}
            {domain.status !== 'verified' && (
              <>
                Please add this records to your domain&apos;s DNS settings for
                verification.
              </>
            )}
          </p>
        </ModalHeader>
        <ModalBody>
          <Table aria-label="Domain DNS Records">
            <TableHeader>
              <TableColumn>TYPE</TableColumn>
              <TableColumn>NAME</TableColumn>
              <TableColumn>VALUE</TableColumn>
            </TableHeader>
            <TableBody>
              {domain.dnsRecords.map((record) => (
                <TableRow key={record.id}>
                  <TableCell>{record.type}</TableCell>
                  <TableCell>{record.name}</TableCell>
                  <TableCell>{record.value}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
}
