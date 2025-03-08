'use client';

import { useState } from 'react';
import { useCreateSession, usePermissions } from '@/hooks/user';
import { toast } from '@jsx-mail/ui/sonner';
import { Button } from '@jsx-mail/ui/button';
import { Input } from '@jsx-mail/ui/input';
import { Checkbox } from '@jsx-mail/ui/checkbox';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@jsx-mail/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@jsx-mail/ui/select';
import { Permission } from '@/types/user';
import { format } from 'date-fns';

interface CreateSessionModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function CreateSessionModal({
  isOpen,
  onClose,
}: CreateSessionModalProps) {
  const { data: permissions } = usePermissions();
  const { mutateAsync: createSession, isPending } = useCreateSession();

  const [description, setDescription] = useState('');
  const [selectedPermissions, setSelectedPermissions] = useState<string[]>([]);
  const [neverExpires, setNeverExpires] = useState(false);
  const [expiresAt, setExpiresAt] = useState<string>('');

  const [createdSession, setCreatedSession] = useState<{
    token: string;
    sessionId: string;
  } | null>(null);

  const handlePermissionChange = (value: string) => {
    setSelectedPermissions((prev) => {
      if (prev.includes(value)) {
        return prev.filter((p) => p !== value);
      } else {
        return [...prev, value];
      }
    });
  };

  const handleSubmit = async () => {
    if (!description) {
      toast.error('Description is required');
      return;
    }

    if (!neverExpires && !expiresAt) {
      toast.error('Expiration date is required');
      return;
    }

    try {
      const result = await createSession({
        description,
        permissions: selectedPermissions,
        expirationDate: neverExpires ? null : new Date(expiresAt).toISOString(),
      });

      setCreatedSession(result);
      toast.success('Session created successfully');
    } catch (error) {
      toast.error('Failed to create session');
      console.error(error);
    }
  };

  const handleClose = () => {
    if (!isPending) {
      setDescription('');
      setSelectedPermissions([]);
      setNeverExpires(false);
      setExpiresAt('');
      setCreatedSession(null);
      onClose();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[500px]">
        {!createdSession ? (
          <>
            <DialogHeader>
              <DialogTitle>Create Session</DialogTitle>
              <DialogDescription>
                Create a new session to use in your applications
              </DialogDescription>
            </DialogHeader>

            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <label htmlFor="description" className="text-sm font-medium">
                  Description
                </label>
                <Input
                  id="description"
                  placeholder="Session for my production app"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                />
              </div>

              <div className="grid gap-2">
                <label className="text-sm font-medium">Permissions</label>
                <div className="max-h-[200px] overflow-y-auto border rounded-md p-2">
                  {permissions?.map((permission: Permission) => (
                    <div
                      key={permission.value}
                      className="flex items-center space-x-2 py-1"
                    >
                      <Checkbox
                        id={`permission-${permission.value}`}
                        checked={selectedPermissions.includes(permission.value)}
                        onCheckedChange={() =>
                          handlePermissionChange(permission.value)
                        }
                      />
                      <label
                        htmlFor={`permission-${permission.value}`}
                        className="text-sm cursor-pointer"
                      >
                        {permission.value} - {permission.description}
                      </label>
                    </div>
                  ))}
                </div>
              </div>

              <div className="grid gap-2">
                <div className="flex items-center justify-between">
                  <label htmlFor="expiresAt" className="text-sm font-medium">
                    Expires At
                  </label>
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="neverExpires"
                      checked={neverExpires}
                      onCheckedChange={(checked) => setNeverExpires(!!checked)}
                    />
                    <label
                      htmlFor="neverExpires"
                      className="text-sm cursor-pointer"
                    >
                      Never expires
                    </label>
                  </div>
                </div>

                {!neverExpires && (
                  <Input
                    id="expiresAt"
                    type="date"
                    value={expiresAt}
                    onChange={(e) => setExpiresAt(e.target.value)}
                    min={format(new Date(), 'yyyy-MM-dd')}
                  />
                )}
              </div>
            </div>

            <DialogFooter>
              <Button variant="outline" onClick={handleClose}>
                Cancel
              </Button>
              <Button onClick={handleSubmit} isLoading={isPending}>
                Create Session
              </Button>
            </DialogFooter>
          </>
        ) : (
          <>
            <DialogHeader>
              <DialogTitle>Session Created</DialogTitle>
              <DialogDescription>
                Your session has been created successfully. Save this
                information in a safe place. This is the only time you will see
                this token.
              </DialogDescription>
            </DialogHeader>

            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <label className="text-sm font-medium">Session ID</label>
                <div className="bg-zinc-900 p-3 rounded-md font-mono text-sm overflow-x-auto">
                  {createdSession.sessionId}
                </div>
              </div>

              <div className="grid gap-2">
                <label className="text-sm font-medium">Session Token</label>
                <div className="bg-zinc-900 p-3 rounded-md font-mono text-sm overflow-x-auto">
                  {createdSession.token}
                </div>
              </div>
            </div>

            <DialogFooter>
              <Button onClick={handleClose}>Close</Button>
            </DialogFooter>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}
