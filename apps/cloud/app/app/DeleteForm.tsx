'use client';

import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  Input,
} from '@nextui-org/react';
import { useState } from 'react';

type Props = {
  // eslint-disable-next-line no-unused-vars
  onDelete: (id: string) => Promise<void>;
  id: string;
  confirmKey: string;
  isOpen: boolean;
  // eslint-disable-next-line no-unused-vars
  onOpenChange: (isOpen: boolean) => void;
};

export default function DeleteForm({
  isOpen,
  onOpenChange,
  confirmKey,
  onDelete,
  id,
}: Props) {
  const [isDeleting, setIsDeleting] = useState(false);
  const [typedKey, setTypedKey] = useState('');

  return (
    <Modal
      isOpen={isOpen}
      onOpenChange={(value) => {
        if (isDeleting && !value) return;

        if (!value) {
          setTypedKey('');
        }

        onOpenChange(value);
      }}
    >
      <ModalContent>
        {(onClose) => (
          <>
            <ModalHeader className="flex flex-col gap-1">
              <h1 className="text-xl font-bold">Delete</h1>
              <p className="text-md text-red-500">
                This action cannot be undone. This will permanently delete the
                item. Just type the confirmation key to delete it.
              </p>
            </ModalHeader>
            <ModalBody>
              <p>
                Confirmation key: <strong>{confirmKey}</strong>
              </p>
              <Input
                type="text"
                value={typedKey}
                onChange={(e) => setTypedKey(e.target.value)}
                label="Confirmation key"
              />
            </ModalBody>
            <ModalFooter>
              <Button
                isLoading={isDeleting}
                disabled={typedKey !== confirmKey}
                fullWidth
                color="danger"
                variant="flat"
                onPress={async () => {
                  if (typedKey !== confirmKey) {
                    return;
                  }

                  setIsDeleting(true);

                  try {
                    await onDelete(id);
                  } finally {
                    setIsDeleting(false);
                    onClose();
                  }
                }}
              >
                Delete
              </Button>
              <Button fullWidth color="primary" onPress={onClose}>
                Cancel
              </Button>
            </ModalFooter>
          </>
        )}
      </ModalContent>
    </Modal>
  );
}
