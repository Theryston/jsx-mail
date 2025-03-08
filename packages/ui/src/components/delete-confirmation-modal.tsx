'use client';

import * as React from 'react';
import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from './dialog.js';
import { Button } from './button.js';
import { Input } from './input.js';
import { Label } from './label.js';

interface DeleteConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (confirmationKey: string) => void;
  title: string;
  description: string;
  confirmationKeyPlaceholder: string;
  expectedConfirmationKey: string;
}

export function DeleteConfirmationModal({
  isOpen,
  onClose,
  onConfirm,
  title,
  description,
  confirmationKeyPlaceholder,
  expectedConfirmationKey,
}: DeleteConfirmationModalProps) {
  const [confirmationKey, setConfirmationKey] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleConfirm = async () => {
    if (confirmationKey !== expectedConfirmationKey) {
      return;
    }

    setIsSubmitting(true);
    try {
      await onConfirm(confirmationKey);
      onClose();
    } catch (error) {
      console.error(error);
    } finally {
      setIsSubmitting(false);
      setConfirmationKey('');
    }
  };

  const handleClose = () => {
    setConfirmationKey('');
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-2">
          <div className="flex flex-col gap-2">
            <Label
              htmlFor="confirmationKey"
              className="text-muted-foreground text-xs font-normal text-center"
            >
              Type "{expectedConfirmationKey}" to confirm
            </Label>
            <Input
              id="confirmationKey"
              value={confirmationKey}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                setConfirmationKey(e.target.value)
              }
              placeholder={confirmationKeyPlaceholder}
              autoComplete="off"
            />
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={handleClose}>
            Cancel
          </Button>
          <Button
            variant="destructive"
            onClick={handleConfirm}
            disabled={
              confirmationKey !== expectedConfirmationKey || isSubmitting
            }
            isLoading={isSubmitting}
          >
            Delete
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
