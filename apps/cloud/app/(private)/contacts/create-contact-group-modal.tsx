'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
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
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@jsx-mail/ui/form';
import { Input } from '@jsx-mail/ui/input';
import { useCreateContactGroup } from '@/hooks/contact-group';
import { usePathname, useRouter } from 'next/navigation';
import { useCallback, useEffect } from 'react';

const formSchema = z.object({
  name: z
    .string()
    .min(3, { message: 'Name must be at least 3 characters long' })
    .max(100, { message: 'Name must be at most 100 characters long' }),
});

interface CreateContactGroupModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultName?: string;
}

export function CreateContactGroupModal({
  isOpen,
  onClose,
  defaultName,
}: CreateContactGroupModalProps) {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
    },
  });

  const router = useRouter();

  const { mutateAsync: createContactGroup, isPending } =
    useCreateContactGroup();
  const pathname = usePathname();

  const onSubmit = useCallback(
    async (values: z.infer<typeof formSchema>) => {
      try {
        const contactGroup = await createContactGroup(values.name);
        toast.success(
          'Contact group created successfully! Add the contacts to it now.',
        );
        form.reset();
        onClose();

        let customBack = pathname;

        if (pathname === '/bulk-sending/create') {
          customBack = encodeURIComponent(
            `${pathname}?contactGroupId=${contactGroup.id}`,
          );
        }

        router.push(`/contacts/${contactGroup.id}?back=${customBack}`);
      } catch (error) {
        toast.error('Failed to create contact group');
        console.error(error);
      }
    },
    [createContactGroup, form, onClose, router, pathname],
  );

  useEffect(() => {
    if (defaultName !== undefined) form.setValue('name', defaultName);
  }, [defaultName, form]);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create Contact Group</DialogTitle>
          <DialogDescription>
            Create a new group to organize your contacts.
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Contact group name (e.g. 'Leads', 'Customers', etc.)"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <DialogFooter>
              <Button type="button" variant="outline" onClick={onClose}>
                Cancel
              </Button>
              <Button type="submit" disabled={isPending}>
                {isPending ? 'Creating...' : 'Create'}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
