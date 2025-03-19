'use client';

import { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@jsx-mail/ui/dialog';
import { Button } from '@jsx-mail/ui/button';
import { Input } from '@jsx-mail/ui/input';
import { toast } from '@jsx-mail/ui/sonner';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from '@jsx-mail/ui/form';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@jsx-mail/ui/select';
import { useCreateSender, useVerifiedDomains } from '@/hooks/sender';
import { Domain } from '@/types/domain';
import { Sender } from '@/types/sender';

const senderFormSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  username: z.string().min(1, 'Username is required'),
  domainName: z.string().min(1, 'Domain is required'),
});

interface AddSenderModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreated?: (sender: Sender) => void;
  defaultUsername?: string;
  defaultName?: string;
  defaultDomain?: string;
}

export function AddSenderModal({
  isOpen,
  onClose,
  onCreated,
  defaultUsername,
  defaultName,
  defaultDomain,
}: AddSenderModalProps) {
  const { data: verifiedDomains, isPending: isLoadingDomains } =
    useVerifiedDomains();
  const { mutateAsync: createSender } = useCreateSender();
  const [domains, setDomains] = useState<Domain[]>([]);

  const form = useForm<z.infer<typeof senderFormSchema>>({
    resolver: zodResolver(senderFormSchema),
    defaultValues: {
      name: '',
      username: '',
      domainName: '',
    },
  });

  const realtimeName = form.watch('name');

  useEffect(() => {
    if (defaultUsername !== undefined) {
      form.setValue('username', defaultUsername);
    }

    if (defaultName !== undefined) {
      form.setValue('name', defaultName);
    }

    if (defaultDomain !== undefined) {
      const exists = verifiedDomains?.some(
        (domain: Domain) => domain.name === defaultDomain,
      );

      if (exists) form.setValue('domainName', defaultDomain);
    }
  }, [defaultUsername, defaultName, defaultDomain, verifiedDomains]);

  useEffect(() => {
    if (verifiedDomains) {
      const hasJsxMailOrg = verifiedDomains.some(
        (domain: Domain) => domain.name === 'jsxmail.org',
      );

      if (!hasJsxMailOrg) {
        setDomains([
          ...verifiedDomains,
          {
            id: 'jsxmail-org',
            name: 'jsxmail.org',
            userId: '',
            status: 'verified',
            dnsRecords: [],
            createdAt: new Date(),
          },
        ]);
      } else {
        setDomains(verifiedDomains);
      }
    }
  }, [verifiedDomains]);

  useEffect(() => {
    if (realtimeName) {
      const slugifiedName = realtimeName
        .toLowerCase()
        .replace(/[^\w\s]/gi, '')
        .replace(/\s+/g, '-');

      form.setValue('username', slugifiedName);
    }
  }, [realtimeName]);

  const onSubmit = async (data: z.infer<typeof senderFormSchema>) => {
    try {
      const sender = await createSender({
        name: data.name,
        username: data.username,
        domainName: data.domainName,
      });

      toast.success('Sender added successfully');
      form.reset();
      onClose();
      onCreated?.(sender);
    } catch (error) {
      toast.error('Failed to add sender');
      console.error(error);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add sender</DialogTitle>
          <DialogDescription>
            A sender is an email address that will be used to send emails.
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="domainName"
              render={({ field }) => (
                <FormItem>
                  <Select
                    disabled={isLoadingDomains}
                    onValueChange={field.onChange}
                    value={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a domain" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {domains?.map((domain) => (
                        <SelectItem key={domain.id} value={domain.name}>
                          {domain.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            {form.watch('domainName') && (
              <>
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Input {...field} placeholder="John Doe" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="username"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <div className="flex items-center">
                          <Input
                            {...field}
                            placeholder="username"
                            className="rounded-r-none"
                          />
                          <div className="bg-zinc-900 h-12 px-3 py-2 border-input rounded-r-xl flex items-center text-sm">
                            @{form.watch('domainName')}
                          </div>
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </>
            )}

            <Button
              type="submit"
              className="w-full"
              isLoading={form.formState.isSubmitting}
              disabled={!form.formState.isValid}
            >
              Add Sender
            </Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
