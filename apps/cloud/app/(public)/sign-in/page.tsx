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
import { useSignIn } from '@/hooks/user';
import { toast } from '@jsx-mail/ui/sonner';

const signInScheme = z.object({
  email: z.string({ required_error: 'Email is required' }).email({
    message: 'Invalid email address',
  }),
  password: z.string({ required_error: 'Password is required' }),
});

type SignInForm = z.infer<typeof signInScheme>;

export default function SignIn() {
  const [redirect, setRedirect] = useState('' as string);
  const searchParams = useSearchParams();
  const form = useForm<SignInForm>({
    resolver: zodResolver(signInScheme),
  });
  const { mutateAsync: signIn } = useSignIn();
  const router = useRouter();

  useEffect(() => {
    setRedirect(handleRedirectUrl(searchParams));
  }, [searchParams]);

  const onSubmit = useCallback(
    async ({ email, password }: SignInForm) => {
      const { data } = await signIn({ email, password });

      let redirectUrl: URL | string = new URL(redirect);
      redirectUrl.searchParams.append('token', data.token);
      redirectUrl.searchParams.append('sessionId', data.sessionId);
      redirectUrl = redirectUrl.toString();

      if (data.isEmailVerified === false) {
        redirectUrl = `/security-code?permission=self:email-validate&email=${email}&redirect=${encodeURIComponent(`/verify-email?redirect=${redirectUrl}`)}`;
      }

      toast.success('Logged in successfully');
      router.push(redirectUrl);
    },
    [router, redirect, signIn],
  );

  return (
    <Container anonymousHeader>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="w-full max-w-md mx-auto fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex flex-col gap-4 items-center px-4 text-center"
        >
          <div className="flex flex-col gap-2 items-center">
            <h1 className="text-2xl font-bold">Sign in to your account</h1>
            <p className="text-muted-foreground text-xs">
              Enter your details below to sign in to your account
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
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem className="flex flex-col gap-2 w-full text-left">
                <FormControl>
                  <Input
                    placeholder="Enter your password"
                    type="password"
                    {...field}
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
            Sign in
          </Button>

          <div className="flex flex-col gap-1">
            <Link
              href={`/sign-up?redirect=${redirect}`}
              className="text-xs text-primary text-center hover:underline"
            >
              Don&apos;t have an account? Sign up
            </Link>

            <Link
              href={`/password-recovery?redirect=${redirect}`}
              className="text-xs text-muted-foreground text-center hover:underline"
            >
              Forgot your password?
            </Link>
          </div>
        </form>
      </Form>
    </Container>
  );
}
