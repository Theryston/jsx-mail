'use client';

import axios from '@/utils/axios';
import {
  Button,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
} from '@nextui-org/react';
import { useCallback, useState } from 'react';
import { toast } from 'react-toastify';

export function UploadFileModal({
  isOpen,
  onOpenChange,
  fetchFiles,
}: {
  isOpen: boolean;
  // eslint-disable-next-line no-unused-vars
  onOpenChange: (isOpen: boolean) => void;
  fetchFiles: () => Promise<void>;
}) {
  const [isLoading, setIsLoading] = useState(false);
  const [file, setFile] = useState<File | null>(null);

  const uploadFile = useCallback(
    async (onClose: () => void) => {
      setIsLoading(true);
      try {
        const formData = new FormData();
        formData.append('file', file as Blob);

        await axios.post('/file', formData);
        await fetchFiles();
        onClose();
      } catch (error: any) {
        toast.error(error.message);
      } finally {
        setIsLoading(false);
      }
    },
    [fetchFiles, file],
  );

  return (
    <Modal
      isOpen={isOpen}
      onOpenChange={(value) => {
        if (isLoading) return;

        onOpenChange(value);
      }}
    >
      <ModalContent>
        {(onClose) => (
          <>
            <ModalHeader className="flex flex-col gap-1">
              <h1 className="text-xl font-bold">Upload File</h1>
              <p className="text-sm text-gray-500">
                Upload a file manually to your account
              </p>
            </ModalHeader>
            <ModalBody>
              <input
                type="file"
                onChange={(event) => {
                  setFile(event.target.files?.[0] ?? null);
                }}
                className="w-full"
                disabled={isLoading}
              />
            </ModalBody>

            <ModalFooter>
              <Button
                variant="flat"
                color="danger"
                onClick={() => {
                  onClose();
                }}
                fullWidth
              >
                Close
              </Button>
              <Button
                onClick={() => uploadFile(onClose)}
                isLoading={isLoading}
                fullWidth
                color="primary"
              >
                Upload
              </Button>
            </ModalFooter>
          </>
        )}
      </ModalContent>
    </Modal>
  );
}
