'use client';

import { useCallback, useState } from 'react';
import { useCreateUserWebhook } from '@/hooks/user';
import { toast } from '@jsx-mail/ui/sonner';
import { Button } from '@jsx-mail/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@jsx-mail/ui/dialog';
import { Input } from '@jsx-mail/ui/input';
import { Label } from '@jsx-mail/ui/label';
import { useMessageStatuses } from '@/hooks/message';
import { Checkbox } from '@jsx-mail/ui/checkbox';

interface CreateWebhookModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function CreateWebhookModal({
  isOpen,
  onClose,
}: CreateWebhookModalProps) {
  const [url, setUrl] = useState('');
  const [status, setStatus] = useState<string[]>([]);
  const { mutateAsync: createWebhook, isPending } = useCreateUserWebhook();
  const { data: messageStatuses } = useMessageStatuses();

  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();

      if (url.length === 0) {
        toast.error('Please enter a valid URL');
        return;
      }

      if (!url.startsWith('https://')) {
        toast.error('Please enter a valid URL');
        return;
      }

      if (status.length === 0) {
        toast.error('Please select at least one status');
        return;
      }

      try {
        await createWebhook({ url, status });
        toast.success('Webhook created successfully');
        onClose();
        setUrl('');
        setStatus([]);
      } catch (error) {
        console.error(error);
      }
    },
    [createWebhook, url, status],
  );

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create Webhook</DialogTitle>
          <DialogDescription>
            Add a new webhook URL to receive notifications.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="url">Webhook URL</Label>
              <Input
                id="url"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                placeholder="https://example.com/webhook"
                required
              />
            </div>
            <div className="flex flex-col gap-2">
              <Label className="text-xs text-muted-foreground">Statuses</Label>
              <div className="flex items-center gap-2 flex-wrap">
                <div className="flex items-center gap-2 w-fit">
                  <Checkbox
                    id="all"
                    checked={status.length === messageStatuses?.length}
                    onCheckedChange={(checked) => {
                      setStatus(
                        checked
                          ? messageStatuses?.map((s) => s.value) || []
                          : [],
                      );
                    }}
                  />
                  <Label
                    htmlFor="all"
                    className="text-xs text-muted-foreground"
                  >
                    All
                  </Label>
                </div>
                {messageStatuses?.map((currentStatus) => (
                  <div
                    key={currentStatus.value}
                    className="flex items-center gap-2 w-fit"
                  >
                    <Checkbox
                      id={currentStatus.value}
                      checked={status.includes(currentStatus.value)}
                      onCheckedChange={(checked) => {
                        if (checked) {
                          setStatus([...status, currentStatus.value]);
                        } else {
                          setStatus(
                            status.filter((s) => s !== currentStatus.value),
                          );
                        }
                      }}
                    />
                    <Label
                      htmlFor={currentStatus.value}
                      className="text-xs text-muted-foreground"
                    >
                      {currentStatus.label}
                    </Label>
                  </div>
                ))}
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" disabled={isPending}>
              Create
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
