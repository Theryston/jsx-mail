'use client';

import { useCallback, useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@jsx-mail/ui/dialog';
import { Button } from '@jsx-mail/ui/button';
import { toast } from '@jsx-mail/ui/sonner';
import { Checkbox } from '@jsx-mail/ui/checkbox';
import { useUpdateUserPriority } from '@/hooks/user';
import { UserAdmin } from '@/types/user';

interface UserPriorityModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: UserAdmin;
}

export function UserPriorityModal({
  isOpen,
  onClose,
  user,
}: UserPriorityModalProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isPriority, setIsPriority] = useState(user.isUserPriority?.length > 0);
  const { mutateAsync: updateUserPriority } = useUpdateUserPriority();

  const handleClose = () => {
    onClose();
  };

  const handleSubmit = useCallback(async () => {
    setIsSubmitting(true);
    const toastId = toast.loading('Updating user priority...');

    try {
      await updateUserPriority({
        userId: user.id,
        isUserPriority: isPriority,
      });

      toast.success('User priority updated successfully', { id: toastId });
      onClose();
    } catch (error) {
      console.error('Failed to update user priority:', error);
      toast.error('Failed to update user priority', { id: toastId });
    } finally {
      setIsSubmitting(false);
    }
  }, [isPriority, updateUserPriority, user.id, onClose]);

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>User Priority - {user.name || user.email}</DialogTitle>
          <DialogDescription>
            Set whether this user should be treated as a priority user
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-2">
          <div className="flex items-center space-x-2">
            <Checkbox
              id="user-priority"
              checked={isPriority}
              onCheckedChange={(checked) => setIsPriority(!!checked)}
            />
            <label htmlFor="user-priority" className="text-sm cursor-pointer">
              Mark as priority user
            </label>
          </div>
        </div>

        <DialogFooter>
          <Button
            variant="outline"
            onClick={handleClose}
            disabled={isSubmitting}
          >
            Cancel
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={isSubmitting}
            isLoading={isSubmitting}
          >
            Save Changes
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
