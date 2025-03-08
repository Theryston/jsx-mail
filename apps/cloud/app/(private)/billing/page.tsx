'use client';

import { Container } from '@/components/container';
import { Skeleton } from '@jsx-mail/ui/skeleton';
import { useCreateCheckoutSession, useFullBalance } from '@/hooks/user';
import { SmallCard } from '@jsx-mail/ui/small-card';
import { PlusIcon } from 'lucide-react';
import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@jsx-mail/ui/dialog';
import { CurrencyInput } from '@jsx-mail/ui/currency-input';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { COUNTRIES } from '@jsx-mail/ui/lib/countries';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from '@jsx-mail/ui/form';
import { Combobox } from '@jsx-mail/ui/combobox';
import { Button } from '@jsx-mail/ui/button';
import { toast } from '@jsx-mail/ui/sonner';

const formSchema = z.object({
  amount: z.coerce.number().min(1),
  country: z.string(),
});

export default function Billing() {
  const { data: fullBalance, isPending } = useFullBalance();
  const [isOpenAddBalance, setIsOpenAddBalance] = useState(false);

  return (
    <Container header>
      <div className="flex flex-col gap-4">
        <h1 className="text-2xl">
          <span className="font-bold">Your</span> billing & transactions
        </h1>

        {isPending ? (
          <>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              <Skeleton className="h-32 w-full" />
              <Skeleton className="h-32 w-full" />
              <Skeleton className="h-32 w-full" />
              <Skeleton className="h-32 w-full" />
            </div>

            <Skeleton className="h-[300px] w-full" />
          </>
        ) : (
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <SmallCard
              title="Your balance"
              value={fullBalance?.CURRENT.friendlyFullAmount ?? ''}
            />

            <SmallCard
              title="Balance added"
              value={fullBalance?.MONTH_ADDED.friendlyFullAmount ?? ''}
            />

            <SmallCard
              title="Balance charged"
              value={fullBalance?.MONTH_CHARGED.friendlyFullAmount ?? ''}
              valueColor="destructive"
            />

            <div
              onClick={() => setIsOpenAddBalance(true)}
              className="flex flex-col gap-2 bg-zinc-900 p-4 rounded-2xl items-center justify-center text-muted-foreground cursor-pointer hover:bg-zinc-800 transition-colors"
            >
              <PlusIcon className="size-6" />
              <h2 className="text-sm">Add balance</h2>
            </div>
          </div>
        )}
      </div>

      <AddBalanceModal
        isOpen={isOpenAddBalance}
        onClose={() => setIsOpenAddBalance(false)}
      />
    </Container>
  );
}

function AddBalanceModal({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose: () => void;
}) {
  const { mutateAsync: createCheckoutSession } = useCreateCheckoutSession();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      amount: 0,
      country: 'United States',
    },
  });

  const onSubmit = async (data: z.infer<typeof formSchema>) => {
    const amount = data.amount;
    const countryCode = COUNTRIES.find(
      (country) => country.name === data.country,
    )?.code;

    if (!amount || !countryCode) {
      toast.error('Please fill in all fields');
      return;
    }

    const session = await createCheckoutSession({
      amount,
      country: countryCode,
    });

    if (!session.url) {
      toast.error('Something went wrong');
      return;
    }

    window.location.href = session.url;
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add balance</DialogTitle>
          <DialogDescription>Add balance to your account</DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <div className="flex flex-col gap-4">
              <FormField
                control={form.control}
                name="amount"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <CurrencyInput
                        value={field.value}
                        onValueChange={field.onChange}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="country"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Combobox
                        items={COUNTRIES.map((country) => ({
                          value: country.code,
                          label: country.name,
                        }))}
                        value={field.value}
                        onChange={field.onChange}
                        placeholder="Select country"
                      />
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
                Pay
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
