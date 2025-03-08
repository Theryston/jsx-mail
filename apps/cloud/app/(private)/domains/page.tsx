'use client';

import { Container } from '@/components/container';
import { Button } from '@jsx-mail/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@jsx-mail/ui/dialog';
import { PlusIcon } from 'lucide-react';
import { useState } from 'react';
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
import { Input } from '@jsx-mail/ui/input';
import { toast } from '@jsx-mail/ui/sonner';
import { useCreateDomain, useDomains } from '@/hooks/domain';
import { Skeleton } from '@jsx-mail/ui/skeleton';
import { columns } from './columns';
import { DataTable } from './data-table';

const domainFormSchema = z.object({
  domain: z
    .string()
    .min(1, 'Domain is required')
    .regex(
      /^([a-zA-Z0-9]([a-zA-Z0-9\-]{0,61}[a-zA-Z0-9])?\.)+[a-zA-Z]{2,}$/,
      'Invalid domain format',
    ),
});

export default function DomainsPage() {
  const [isOpenAddDomain, setIsOpenAddDomain] = useState(false);
  const { data: domains, isPending } = useDomains();

  return (
    <Container header>
      <div className="flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl">
            <span className="font-bold">Your</span> domains
          </h1>

          <Button size="icon" onClick={() => setIsOpenAddDomain(true)}>
            <PlusIcon className="size-4" />
          </Button>
        </div>

        {isPending ? (
          <Skeleton className="h-[300px] w-full" />
        ) : (
          <div className="rounded-xl bg-zinc-900 p-4 w-full">
            <DataTable columns={columns} data={domains || []} />
          </div>
        )}
      </div>

      <AddDomainModal
        isOpen={isOpenAddDomain}
        onClose={() => setIsOpenAddDomain(false)}
      />
    </Container>
  );
}

function AddDomainModal({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose: () => void;
}) {
  const { mutateAsync: createDomain } = useCreateDomain();
  const form = useForm<z.infer<typeof domainFormSchema>>({
    resolver: zodResolver(domainFormSchema),
    defaultValues: {
      domain: '',
    },
  });

  const onSubmit = async (data: z.infer<typeof domainFormSchema>) => {
    await createDomain(data.domain);
    toast.success('Domain added successfully');

    onClose();
    form.reset();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add domain</DialogTitle>
          <DialogDescription>
            Add a new domain to your account
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <div className="flex flex-col gap-4">
              <FormField
                control={form.control}
                name="domain"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Input placeholder="example.com" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button
                type="submit"
                className="w-full"
                isLoading={form.formState.isSubmitting}
              >
                Add Domain
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
