'use client';

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@jsx-mail/ui/dialog';
import { UserAdmin } from '@/types/user';
import {
  useUserSettings,
  useUpdateUserSettings,
  useDeleteUserSettings,
} from '@/hooks/settings';
import { SettingsForm } from '../settings/settings-form';

interface UserSettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: UserAdmin;
}

export function UserSettingsModal({
  isOpen,
  onClose,
  user,
}: UserSettingsModalProps) {
  const { data: userSettings, isLoading } = useUserSettings(user.id);
  const { mutateAsync: updateUserSettings } = useUpdateUserSettings(user.id);
  const { mutateAsync: deleteUserSettings } = useDeleteUserSettings(user.id);

  if (isLoading) {
    return null;
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>User Settings - {user.name || user.email}</DialogTitle>
          <DialogDescription>
            Update the settings for this specific user. These settings will
            override the default settings.
          </DialogDescription>
        </DialogHeader>

        <SettingsForm
          initialData={userSettings}
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          onSubmit={async (data: any) => {
            await updateUserSettings(data);
            onClose();
          }}
          onDiscard={async () => {
            await deleteUserSettings();
            onClose();
          }}
          isUserSettings
          forcePerRow
        />
      </DialogContent>
    </Dialog>
  );
}
