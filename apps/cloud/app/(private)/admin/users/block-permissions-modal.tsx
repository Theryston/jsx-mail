'use client';

import { useState, useEffect } from 'react';
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
import {
  usePermissions,
  useCreateBlockPermission,
  useDeleteBlockPermission,
  useGetBlockedPermissions,
} from '@/hooks/user';
import { Permission, User } from '@/types/user';
import { Checkbox } from '@jsx-mail/ui/checkbox';
import { Skeleton } from '@jsx-mail/ui/skeleton';

interface BlockPermissionsModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: User;
}

export function BlockPermissionsModal({
  isOpen,
  onClose,
  user,
}: BlockPermissionsModalProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedPermissions, setSelectedPermissions] = useState<string[]>([]);
  const { data: permissions, isLoading: permissionsLoading } = usePermissions();
  const { data: blockedPermissions, isLoading: blockedPermissionsLoading } =
    useGetBlockedPermissions(user.id);
  const { mutateAsync: createBlockPermission } = useCreateBlockPermission();
  const { mutateAsync: deleteBlockPermission } = useDeleteBlockPermission();

  useEffect(() => {
    if (blockedPermissions) {
      setSelectedPermissions(blockedPermissions);
    }
  }, [blockedPermissions]);

  const handleClose = () => {
    onClose();
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    const toastId = toast.loading('Updating permissions...');

    try {
      // Find permissions to add (in selectedPermissions but not in blockedPermissions)
      const permissionsToAdd = selectedPermissions.filter(
        (permission) => !blockedPermissions?.includes(permission),
      );

      // Find permissions to remove (in blockedPermissions but not in selectedPermissions)
      const permissionsToRemove =
        blockedPermissions?.filter(
          (permission) => !selectedPermissions.includes(permission),
        ) || [];

      // Add new blocked permissions
      for (const permission of permissionsToAdd) {
        await createBlockPermission({ permission, userId: user.id });
      }

      // Remove blocked permissions
      for (const permission of permissionsToRemove) {
        await deleteBlockPermission({ permission, userId: user.id });
      }

      toast.success('Permissions updated successfully', { id: toastId });
      onClose();
    } catch (error) {
      console.error('Failed to update permissions:', error);
      toast.error('Failed to update permissions', { id: toastId });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleTogglePermission = (permission: string) => {
    setSelectedPermissions((prev) =>
      prev.includes(permission)
        ? prev.filter((p) => p !== permission)
        : [...prev, permission],
    );
  };

  const isLoading = permissionsLoading || blockedPermissionsLoading;

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Block Permissions for {user.name}</DialogTitle>
          <DialogDescription>
            Select permissions that will be blocked for this user
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-2 max-h-[50vh] overflow-y-auto pr-2">
          {isLoading ? (
            <div className="space-y-2">
              <Skeleton className="h-8 w-full" />
              <Skeleton className="h-8 w-full" />
              <Skeleton className="h-8 w-full" />
            </div>
          ) : (
            <div className="space-y-2">
              {permissions?.map((permission: Permission) => (
                <div
                  key={permission.value}
                  className="flex items-center space-x-2"
                >
                  <Checkbox
                    id={`permission-${permission.value}`}
                    checked={selectedPermissions.includes(permission.value)}
                    onCheckedChange={() =>
                      handleTogglePermission(permission.value)
                    }
                  />
                  <label
                    htmlFor={`permission-${permission.value}`}
                    className="text-sm cursor-pointer flex-1"
                  >
                    <div className="font-medium">{permission.title}</div>
                    <div className="text-muted-foreground text-xs">
                      {permission.description}
                    </div>
                  </label>
                </div>
              ))}
            </div>
          )}
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
            disabled={isLoading || isSubmitting}
            isLoading={isSubmitting}
          >
            Save Changes
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
