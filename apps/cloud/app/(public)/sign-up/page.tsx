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
import { useSignUp } from '@/hooks/user';
import { toast } from '@jsx-mail/ui/sonner';
import { EyeIcon, EyeOffIcon } from 'lucide-react';
import { sendGTMEvent } from '@next/third-parties/google';
import { Turnstile } from 'next-turnstile';

const signUpScheme = z
  .object({
    name: z.string({ required_error: 'Name is required' }),
    email: z.string({ required_error: 'Email is required' }).email({
      message: 'Invalid email address',
    }),
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

type SignUpForm = z.infer<typeof signUpScheme>;

export default function SignUp() {
  const [redirect, setRedirect] = useState('' as string);
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [turnstileToken, setTurnstileToken] = useState<string | null>(null);
  const [turnstileKey, setTurnstileKey] = useState<number>(0);
  const searchParams = useSearchParams();
  const form = useForm<SignUpForm>({
    resolver: zodResolver(signUpScheme),
  });
  const { mutateAsync: signUp } = useSignUp();
  const router = useRouter();

  useEffect(() => {
    setRedirect(handleRedirectUrl(searchParams));
  }, [searchParams]);

  const togglePasswordVisibility = () => setIsPasswordVisible((prev) => !prev);

  const resetTurnstile = () => {
    setTurnstileToken(null);
    setTurnstileKey((prev) => prev + 1);
  };

  const onSubmit = useCallback(
    async ({ name, email, password }: SignUpForm) => {
      if (!turnstileToken) {
        toast.error('Please complete the captcha');
        return;
      }

      try {
        const utmGroupId = localStorage.getItem('utmGroupId');

        await signUp({
          name,
          email,
          password,
          utmGroupId: utmGroupId || undefined,
          turnstileToken,
        });

        sendGTMEvent({ event: 'sign_up' });

        toast.success('Account created successfully');
        router.push(
          `/security-code?permission=self:email-validate&email=${email}&redirect=${encodeURIComponent(`/verify-email?redirect=${redirect}`)}`,
        );
      } catch (error) {
        resetTurnstile();
        throw error;
      }
    },
    [router, redirect, signUp, turnstileToken],
  );

  return (
    <Container anonymousHeader>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="w-full max-w-md mx-auto fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex flex-col gap-4 items-center px-4 text-center"
        >
          <div className="flex flex-col gap-2 items-center">
            <h1 className="text-2xl font-bold">Sign up to your account</h1>
            <p className="text-muted-foreground text-xs">
              Enter your details below to create your account
            </p>
          </div>

          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem className="flex flex-col gap-2 w-full text-left">
                <FormControl>
                  <Input placeholder="Enter your name" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

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
                  <div className="relative">
                    <Input
                      placeholder="Enter your password"
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
                      placeholder="Confirm your password"
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

          <div className="w-full" key={turnstileKey}>
            <Turnstile
              siteKey={process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY as string}
              // eslint-disable-next-line @typescript-eslint/no-explicit-any
              size={'flexible' as any}
              onVerify={(token) => setTurnstileToken(token)}
            />
          </div>

          <Button
            type="submit"
            className="w-full"
            isLoading={form.formState.isSubmitting}
            disabled={!turnstileToken}
          >
            Sign up
          </Button>

          <div className="flex flex-col gap-1">
            <Link
              href={`/sign-in?redirect=${redirect}`}
              className="text-xs text-primary text-center hover:underline"
            >
              Already have an account? Sign in
            </Link>
          </div>
        </form>
      </Form>
    </Container>
  );
}
