'use client';

import { Container } from '@/components/container';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  Form,
  FormField,
  FormItem,
  FormControl,
  FormMessage,
} from '@jsx-mail/ui/form';
import { Input } from '@jsx-mail/ui/input';
import { Button } from '@jsx-mail/ui/button';
import Link from 'next/link';
import { useState, useEffect, useCallback } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import handleRedirectUrl from '@/utils/handle-redirect-url';

const passwordRecoverySchema = z.object({
  email: z.string({ required_error: 'Email is required' }).email({
    message: 'Invalid email address',
  }),
});

type PasswordRecoveryForm = z.infer<typeof passwordRecoverySchema>;

export default function PasswordRecovery() {
  const [redirect, setRedirect] = useState('' as string);
  const router = useRouter();
  const searchParams = useSearchParams();

  const form = useForm<PasswordRecoveryForm>({
    resolver: zodResolver(passwordRecoverySchema),
  });

  useEffect(() => {
    if (!searchParams) {
      router.push('/sign-in');
      return;
    }

    setRedirect(handleRedirectUrl(searchParams));
  }, [searchParams, router]);

  const onSubmit = useCallback(
    async ({ email }: PasswordRecoveryForm) => {
      const url = `/security-code?permission=self:reset-password&email=${email}&redirect=${encodeURIComponent(`/password-reset?redirect=${redirect}`)}`;
      router.push(url);
    },
    [redirect, router],
  );

  return (
    <Container anonymousHeader>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="w-full max-w-md mx-auto fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex flex-col gap-4 items-center px-4 text-center"
        >
          <div className="flex flex-col gap-2 items-center">
            <h1 className="text-2xl font-bold">Password Recovery</h1>
            <p className="text-muted-foreground text-xs">
              Please enter your email below and we will send you a code to reset
              your password
            </p>
          </div>

          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem className="flex flex-col gap-2 w-full text-left">
                <FormControl>
                  <Input placeholder="Enter your email" {...field} />
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
            Send Code
          </Button>

          <div className="flex flex-col gap-1">
            <Link
              href={`/sign-in?redirect=${redirect}`}
              className="text-xs text-primary text-center hover:underline"
            >
              I remember my password
            </Link>
          </div>
        </form>
      </Form>
    </Container>
  );
}
