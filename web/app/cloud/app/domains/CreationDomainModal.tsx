'use client';

import { useCallback, useState } from 'react';
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  Input,
} from '@nextui-org/react';
import { toast } from 'react-toastify';
import axios from '@/app/utils/axios';

type Props = {
  isOpen: boolean;
  // eslint-disable-next-line no-unused-vars
  onOpenChange: (isOpen: boolean) => void;
  fetchDomains: () => Promise<void>;
};

export default function CreationDomainModal({
  isOpen,
  onOpenChange,
  fetchDomains,
}: Props) {
  const [domainName, setDomainName] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const createDomain = useCallback(
    async (onClose: () => void) => {
      setIsLoading(true);
      try {
        await axios.post('/domain', { name: domainName });
        await fetchDomains();

        toast.success('Domain created successfully');
        onClose();
      } catch (error: any) {
        toast.error(error.message);
      } finally {
        setIsLoading(false);
      }
    },

    [domainName, fetchDomains],
  );

  return (
    <Modal
      isOpen={isOpen}
      onOpenChange={(value) => {
        if (isLoading && !value) return;

        if (!value) setDomainName('');
        onOpenChange(value);
      }}
    >
      <ModalContent>
        {(onClose) => (
          <>
            <ModalHeader className="flex flex-col gap-1">
              <h1 className="text-xl font-bold">Create a domain</h1>
              <p className="text-sm text-gray-500">
                You can add a custom domain to create email addresses with it.
              </p>
            </ModalHeader>
            <ModalBody>
              <div className="flex flex-col gap-4">
                <Input
                  type="text"
                  label="Domain Name"
                  placeholder="jsxmail.org"
                  value={domainName}
                  onChange={(e) => setDomainName(e.target.value)}
                  fullWidth
                />
              </div>
            </ModalBody>
            <ModalFooter>
              <Button color="danger" variant="flat" onPress={onClose} fullWidth>
                Close
              </Button>
              <Button
                isLoading={isLoading}
                color="primary"
                onPress={() => createDomain(onClose)}
                fullWidth
              >
                Create
              </Button>
            </ModalFooter>
          </>
        )}
      </ModalContent>
    </Modal>
  );
}
