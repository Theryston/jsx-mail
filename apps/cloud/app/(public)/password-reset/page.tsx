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
import { useResetPassword } from '@/hooks/user';
import { toast } from '@jsx-mail/ui/sonner';
import { EyeIcon, EyeOffIcon } from 'lucide-react';

const passwordResetSchema = z
  .object({
    password: z
      .string({ required_error: 'Password is required' })
      .min(8, { message: 'Password must be at least 8 characters' }),
    password2: z.string({
      required_error: 'Password confirmation is required',
    }),
  })
  .refine((data) => data.password === data.password2, {
    message: "Passwords don't match",
    path: ['password2'],
  });

type PasswordResetForm = z.infer<typeof passwordResetSchema>;

export default function PasswordReset() {
  const [redirect, setRedirect] = useState('' as string);
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();

  const form = useForm<PasswordResetForm>({
    resolver: zodResolver(passwordResetSchema),
  });

  const { mutateAsync: resetPassword } = useResetPassword();

  useEffect(() => {
    setRedirect(handleRedirectUrl(searchParams));
  }, [searchParams]);

  const togglePasswordVisibility = () => setIsPasswordVisible((prev) => !prev);

  const onSubmit = useCallback(
    async ({ password }: PasswordResetForm) => {
      try {
        const { data } = await resetPassword({ newPassword: password });

        toast.success('Password has been reset successfully');

        let redirectUrl: URL | string = new URL(redirect);
        redirectUrl.searchParams.append('token', data.token);
        redirectUrl.searchParams.append('sessionId', data.sessionId);
        redirectUrl = redirectUrl.toString();

        if (data.isEmailVerified === false) {
          redirectUrl = `/security-code?permission=self:email-validate&email=${data.email}&redirect=${encodeURIComponent(`/verify-email?redirect=${redirectUrl}`)}`;
        }

        router.push(redirectUrl);
      } catch (error: any) {
        toast.error('Failed to reset password');
      }
    },
    [router, redirect, resetPassword],
  );

  return (
    <Container anonymousHeader>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="w-full max-w-md mx-auto fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex flex-col gap-4 items-center px-4 text-center"
        >
          <div className="flex flex-col gap-2 items-center">
            <h1 className="text-2xl font-bold">Reset Password</h1>
            <p className="text-muted-foreground text-xs">
              Enter your new password below
            </p>
          </div>

          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem className="flex flex-col gap-2 w-full text-left">
                <FormControl>
                  <div className="relative">
                    <Input
                      placeholder="Enter new password"
                      type={isPasswordVisible ? 'text' : 'password'}
                      {...field}
                    />
                    <button
                      type="button"
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground"
                      onClick={togglePasswordVisibility}
                    >
                      {isPasswordVisible ? (
                        <EyeOffIcon className="h-4 w-4" />
                      ) : (
                        <EyeIcon className="h-4 w-4" />
                      )}
                    </button>
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="password2"
            render={({ field }) => (
              <FormItem className="flex flex-col gap-2 w-full text-left">
                <FormControl>
                  <div className="relative">
                    <Input
                      placeholder="Confirm new password"
                      type={isPasswordVisible ? 'text' : 'password'}
                      {...field}
                    />
                    <button
                      type="button"
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground"
                      onClick={togglePasswordVisibility}
                    >
                      {isPasswordVisible ? (
                        <EyeOffIcon className="h-4 w-4" />
                      ) : (
                        <EyeIcon className="h-4 w-4" />
                      )}
                    </button>
                  </div>
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
            Reset Password
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
