'use client';

import { useCallback, useEffect, useState } from 'react';
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  Autocomplete,
  AutocompleteItem,
  Input,
} from '@nextui-org/react';
import { toast } from 'react-toastify';
import axios from '@/utils/axios';

type Props = {
  isOpen: boolean;
  // eslint-disable-next-line no-unused-vars
  onOpenChange: (isOpen: boolean) => void;
  fetchSenders: () => Promise<void>;
};

export default function CreationSenderModal({
  isOpen,
  onOpenChange,
  fetchSenders,
}: Props) {
  const [senderName, setSenderName] = useState('');
  const [senderUsername, setSenderUsername] = useState('');
  const [domainNames, setDomainsNames] = useState<string[]>([]);
  const [domainName, setDomainName] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const createSender = useCallback(
    async (onClose: () => void) => {
      setIsLoading(true);
      try {
        await axios.post('/sender', {
          name: senderName,
          domainName: domainName,
          username: senderUsername,
        });
        await fetchSenders();

        toast.success('Sender created successfully');
        onClose();
      } catch (error: any) {
        toast.error(error.message);
      } finally {
        setIsLoading(false);
      }
    },

    [senderName, fetchSenders, domainName, senderUsername],
  );

  const fetchDomains = useCallback(async () => {
    try {
      const response = await axios.get('/domain');

      let newNames = [...response.data.map((domain: any) => domain.name)];

      if (!newNames.includes('jsxmail.org')) {
        newNames = ['jsxmail.org', ...newNames];
      }

      setDomainsNames(newNames);
    } catch (error: any) {
      toast.error(error.message);
    }
  }, []);

  useEffect(() => {
    fetchDomains();
  }, [fetchDomains, isOpen]);

  return (
    <Modal
      isOpen={isOpen}
      onOpenChange={(value) => {
        if (isLoading && !value) return;

        if (!value) {
          setSenderName('');
          setSenderUsername('');
          setDomainName(null);
        }
        onOpenChange(value);
      }}
    >
      <ModalContent>
        {(onClose) => (
          <>
            <ModalHeader className="flex flex-col gap-1">
              <h1 className="text-xl font-bold">Create a sender</h1>
              <p className="text-sm text-gray-500">
                A sender is an email address that will be used to send emails.
              </p>
            </ModalHeader>
            <ModalBody>
              <div className="flex flex-col gap-4">
                <Autocomplete
                  label="Domain"
                  placeholder="jsxmail.org"
                  onSelectionChange={(value) => {
                    setDomainName(
                      domainNames.find((name) => name === value) || null,
                    );
                  }}
                >
                  {domainNames.map((name) => (
                    <AutocompleteItem key={name} value={name}>
                      {name}
                    </AutocompleteItem>
                  ))}
                </Autocomplete>
                {domainName && (
                  <>
                    <Input
                      type="text"
                      label="Username"
                      placeholder="john"
                      value={senderUsername}
                      onChange={(e) => setSenderUsername(e.target.value)}
                      fullWidth
                      endContent={
                        <div className="pointer-events-none flex items-center">
                          <span className="text-default-400 text-small">
                            @{domainName}
                          </span>
                        </div>
                      }
                    />
                    <Input
                      type="text"
                      label="Name"
                      placeholder="John Doe"
                      value={senderName}
                      onChange={(e) => setSenderName(e.target.value)}
                      fullWidth
                    />
                  </>
                )}
              </div>
            </ModalBody>
            <ModalFooter>
              <Button color="danger" variant="flat" onPress={onClose} fullWidth>
                Close
              </Button>
              <Button
                isLoading={isLoading}
                color="primary"
                onPress={() => createSender(onClose)}
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
