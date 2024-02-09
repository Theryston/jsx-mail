'use client';

import { useCallback, useEffect, useState } from 'react';
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  Input,
  Snippet,
  Select,
  SelectItem,
  Selection,
  Checkbox,
} from '@nextui-org/react';
import { toast } from 'react-toastify';
import axios from '@/app/utils/axios';
import moment from 'moment';

type Permission = {
  title: string;
  value: string;
  description: string;
  friendlyName: string;
};

type Props = {
  isOpen: boolean;
  // eslint-disable-next-line no-unused-vars
  onOpenChange: (isOpen: boolean) => void;
  fetchSessions: () => Promise<void>;
};

export default function CreationSessionModal({
  isOpen,
  onOpenChange,
  fetchSessions,
}: Props) {
  const [sessionDescription, setSessionDescription] = useState('');
  const [permissions, setPermissions] = useState<Permission[]>([]);
  const [selectedPermissions, setSelectedPermissions] = useState<Selection>(
    new Set([]),
  );
  const [neverExpires, setNeverExpires] = useState(false);
  const [expiresAt, setExpiresAt] = useState<moment.Moment | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [generatedToken, setGeneratedToken] = useState('');
  const [generatedSessionId, setGeneratedSessionId] = useState('');

  const createSession = useCallback(async () => {
    if (!neverExpires && !expiresAt) {
      toast.error('Expiration date is required');
      return;
    }

    setIsLoading(true);
    try {
      const permissionAr = Array.from(selectedPermissions);
      const { data } = await axios.post('/session', {
        description: sessionDescription,
        permissions: permissionAr,
        expirationDate: neverExpires ? null : expiresAt?.toISOString(),
      });
      await fetchSessions();

      setGeneratedToken(data.token);
      setGeneratedSessionId(data.sessionId);
      toast.success('Session created successfully');
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setIsLoading(false);
    }
  }, [
    sessionDescription,
    fetchSessions,
    neverExpires,
    expiresAt,
    selectedPermissions,
  ]);

  const fetchPermissions = useCallback(async () => {
    try {
      const { data } = await axios.get('/session/permissions');

      setPermissions(
        data.map((p: any) => ({
          ...p,
          friendlyName: `${p.value} - ${p.description}`,
        })),
      );
    } catch (error: any) {
      toast.error(error.message);
    }
  }, []);

  useEffect(() => {
    fetchPermissions();
  }, [fetchPermissions]);

  return (
    <Modal
      isOpen={isOpen}
      onOpenChange={(value) => {
        if (isLoading && !value) return;

        if (!value) {
          setSessionDescription('');
          setSelectedPermissions(new Set([]));
          setNeverExpires(false);
          setExpiresAt(null);
          setGeneratedToken('');
          setGeneratedSessionId('');
        }
        onOpenChange(value);
      }}
    >
      <ModalContent>
        {(onClose) => (
          <>
            {!generatedToken && !generatedSessionId && (
              <>
                <ModalHeader className="flex flex-col gap-1">
                  <h1 className="text-xl font-bold">Create a session</h1>
                  <p className="text-sm text-gray-500">
                    Create a new session to use into your application
                  </p>
                </ModalHeader>
                <ModalBody>
                  <div className="flex flex-col gap-4">
                    <Select
                      label="Permissions"
                      placeholder="Select the permissions"
                      selectionMode="multiple"
                      items={permissions}
                      selectedKeys={selectedPermissions}
                      onSelectionChange={(keys) => setSelectedPermissions(keys)}
                    >
                      {(permission) => (
                        <SelectItem
                          key={permission.value}
                          value={permission.value}
                        >
                          {permission.friendlyName}
                        </SelectItem>
                      )}
                    </Select>
                    <Input
                      type="text"
                      label="Session description"
                      placeholder="Session for my production app"
                      value={sessionDescription}
                      onChange={(e) => setSessionDescription(e.target.value)}
                      fullWidth
                    />
                    {!neverExpires && (
                      <Input
                        type="date"
                        label="Expires at"
                        placeholder="Expires"
                        fullWidth
                        value={expiresAt?.format('YYYY-MM-DD')}
                        onValueChange={(value) => setExpiresAt(moment(value))}
                      />
                    )}
                    <Checkbox
                      isSelected={neverExpires}
                      onValueChange={setNeverExpires}
                      size="sm"
                      className="ml-auto"
                    >
                      Never expires
                    </Checkbox>
                  </div>
                </ModalBody>
                <ModalFooter>
                  <Button
                    color="danger"
                    variant="flat"
                    onPress={onClose}
                    fullWidth
                  >
                    Close
                  </Button>
                  <Button
                    isLoading={isLoading}
                    color="primary"
                    onPress={() => createSession()}
                    fullWidth
                  >
                    Create
                  </Button>
                </ModalFooter>
              </>
            )}
            {generatedToken && generatedSessionId && (
              <>
                <ModalHeader className="flex flex-col gap-1">
                  <h1 className="text-xl font-bold">Session Created</h1>
                  <p className="text-sm text-gray-500">
                    Your section has been created successfully, save the
                    information below in a safe place. Keep in mind that this is
                    the only time you will see this token
                  </p>
                </ModalHeader>
                <ModalBody>
                  <div className="flex flex-col gap-1">
                    <p className="text-sm text-gray-500">Session Id</p>
                    <Snippet
                      symbol=""
                      classNames={{
                        pre: 'w-full overflow-ellipsis overflow-hidden whitespace-nowrap',
                      }}
                    >
                      {generatedSessionId}
                    </Snippet>
                  </div>
                  <div className="flex flex-col gap-1">
                    <p className="text-sm text-gray-500">Session Token</p>
                    <Snippet
                      symbol=""
                      classNames={{
                        pre: 'w-full overflow-ellipsis overflow-hidden whitespace-nowrap',
                      }}
                    >
                      {generatedToken}
                    </Snippet>
                  </div>
                </ModalBody>
                <ModalFooter>
                  <Button
                    color="danger"
                    variant="flat"
                    onPress={onClose}
                    fullWidth
                  >
                    Close
                  </Button>
                </ModalFooter>
              </>
            )}
          </>
        )}
      </ModalContent>
    </Modal>
  );
}
