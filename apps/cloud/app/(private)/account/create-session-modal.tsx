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
import { MultiCombobox } from '@jsx-mail/ui/multi-combobox';
import { Permission } from '@/types/user';
import { format } from 'date-fns';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@jsx-mail/ui/form';
import { CopyIcon, CheckIcon } from 'lucide-react';

interface CreateSessionModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const formSchema = z
  .object({
    description: z.string().min(1, { message: 'Description is required' }),
    permissions: z
      .array(z.string())
      .min(1, { message: 'At least one permission is required' }),
    neverExpires: z.boolean().default(false),
    expiresAt: z.string().optional(),
  })
  .refine((data) => data.neverExpires || !!data.expiresAt, {
    message: "Expiration date is required when 'Never expires' is not checked",
    path: ['expiresAt'],
  });

export function CreateSessionModal({
  isOpen,
  onClose,
}: CreateSessionModalProps) {
  const { data: permissions } = usePermissions();
  const { mutateAsync: createSession, isPending } = useCreateSession();
  const [createdSession, setCreatedSession] = useState<{
    token: string;
    sessionId: string;
  } | null>(null);
  const [copiedField, setCopiedField] = useState<string | null>(null);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      description: '',
      permissions: [],
      neverExpires: false,
      expiresAt: '',
    },
  });

  const handleSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      const result = await createSession({
        description: values.description,
        permissions: values.permissions,
        expirationDate: values.neverExpires
          ? null
          : new Date(values.expiresAt!).toISOString(),
      });

      setCreatedSession(result);
      toast.success('Session created successfully');
    } catch (error) {
      console.error(error);
    }
  };

  const handleClose = () => {
    if (!isPending) {
      form.reset();
      setCreatedSession(null);
      setCopiedField(null);
      onClose();
    }
  };

  const copyToClipboard = (text: string, fieldId: string) => {
    navigator.clipboard.writeText(text);
    setCopiedField(fieldId);
    toast.success('Copied to clipboard');

    setTimeout(() => {
      setCopiedField(null);
    }, 2000);
  };

  const permissionItems =
    permissions?.map((permission: Permission) => ({
      value: permission.value,
      label: `${permission.value} - ${permission.description}`,
    })) || [];

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

            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(handleSubmit)}
                className="space-y-4 py-4"
              >
                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Description</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Session for my production app"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="permissions"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Permissions</FormLabel>
                      <FormControl>
                        <MultiCombobox
                          items={permissionItems}
                          values={field.value}
                          onChange={field.onChange}
                          placeholder="Select permissions..."
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <FormLabel>
                      {form.watch('neverExpires') ? 'Expiration' : 'Expires At'}
                    </FormLabel>
                    <FormField
                      control={form.control}
                      name="neverExpires"
                      render={({ field }) => (
                        <FormItem className="flex items-center space-x-2">
                          <FormControl>
                            <Checkbox
                              checked={field.value}
                              onCheckedChange={field.onChange}
                            />
                          </FormControl>
                          <label
                            htmlFor="neverExpires"
                            className="text-sm cursor-pointer"
                            onClick={() =>
                              form.setValue(
                                'neverExpires',
                                !form.watch('neverExpires'),
                              )
                            }
                          >
                            Never expires
                          </label>
                        </FormItem>
                      )}
                    />
                  </div>

                  {!form.watch('neverExpires') && (
                    <FormField
                      control={form.control}
                      name="expiresAt"
                      render={({ field }) => (
                        <FormItem>
                          <FormControl>
                            <Input
                              type="date"
                              {...field}
                              min={format(new Date(), 'yyyy-MM-dd')}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  )}
                </div>

                <DialogFooter>
                  <Button variant="outline" type="button" onClick={handleClose}>
                    Cancel
                  </Button>
                  <Button type="submit" isLoading={isPending}>
                    Create Session
                  </Button>
                </DialogFooter>
              </form>
            </Form>
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
                <div className="flex items-center justify-between">
                  <label className="text-sm font-medium">Session ID</label>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() =>
                      copyToClipboard(createdSession.sessionId, 'sessionId')
                    }
                  >
                    {copiedField === 'sessionId' ? (
                      <CheckIcon className="h-4 w-4 text-green-500" />
                    ) : (
                      <CopyIcon className="h-4 w-4" />
                    )}
                  </Button>
                </div>
                <div className="bg-zinc-900 p-3 rounded-md font-mono text-sm overflow-x-auto">
                  {createdSession.sessionId}
                </div>
              </div>

              <div className="grid gap-2">
                <div className="flex items-center justify-between">
                  <label className="text-sm font-medium">Session Token</label>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() =>
                      copyToClipboard(createdSession.token, 'token')
                    }
                  >
                    {copiedField === 'token' ? (
                      <CheckIcon className="h-4 w-4 text-green-500" />
                    ) : (
                      <CopyIcon className="h-4 w-4" />
                    )}
                  </Button>
                </div>
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
