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
import { Button } from '@jsx-mail/ui/button';
import { useState, useEffect, useCallback } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useCreateSecurityCode, useVerifySecurityCode } from '@/hooks/user';
import { toast } from '@jsx-mail/ui/sonner';
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSeparator,
  InputOTPSlot,
} from '@jsx-mail/ui/input-otp';

const securityCodeSchema = z.object({
  code: z
    .string({ required_error: 'Security code is required' })
    .length(6, { message: 'Security code must be 6 digits long' }),
});

type SecurityCodeForm = z.infer<typeof securityCodeSchema>;

export default function SecurityCode() {
  const [email, setEmail] = useState('');
  const [redirect, setRedirect] = useState('');
  const [permission, setPermission] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();

  const form = useForm<SecurityCodeForm>({
    resolver: zodResolver(securityCodeSchema),
  });

  const { mutateAsync: createSecurityCode } = useCreateSecurityCode();
  const { mutateAsync: verifySecurityCode } = useVerifySecurityCode();

  useEffect(() => {
    if (!searchParams) {
      router.push('/sign-up');
      return;
    }

    const searchPermission = searchParams.get('permission');
    const searchEmail = searchParams.get('email');
    const searchRedirect = searchParams.get('redirect');
    const searchIsSubmitted = searchParams.get('isSubmitted');

    if (!searchPermission || !searchEmail || !searchRedirect) {
      router.push('/sign-up');
      return;
    }

    if (!searchRedirect.startsWith('/')) {
      router.push('/sign-up');
      return;
    }

    setPermission(searchPermission);
    setEmail(searchEmail);
    setRedirect(searchRedirect);
    setIsSubmitted(searchIsSubmitted === 'true');
  }, [searchParams, router]);

  useEffect(() => {
    if (!email || isSubmitted) {
      return;
    }

    const sendCode = async () => {
      await createSecurityCode({ email });

      const pageUrl = new URL(window.location.href);
      pageUrl.searchParams.set('isSubmitted', 'true');
      router.push(pageUrl.toString());

      setIsSubmitted(true);
    };

    sendCode();
  }, [email, isSubmitted, router, createSecurityCode]);

  const onSubmit = useCallback(
    async ({ code }: SecurityCodeForm) => {
      const { data } = await verifySecurityCode({
        securityCode: code,
        permission,
      });

      if (!data.token) {
        throw new Error('Invalid code');
      }

      document.cookie = `token=${data.token}; path=/; max-age=604800;`;
      document.cookie = `sessionId=${data.sessionId}; path=/; max-age=604800;`;

      toast.success('Code verified successfully');
      router.push(redirect);
    },
    [permission, redirect, router, verifySecurityCode],
  );

  const handleResendCode = useCallback(async () => {
    if (!email) return;

    await createSecurityCode({ email });
    toast.success('Security code resent');
  }, [email, createSecurityCode]);

  return (
    <Container anonymousHeader>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="w-full max-w-md mx-auto fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex flex-col gap-4 items-center px-4 text-center"
        >
          <div className="flex flex-col gap-2 items-center">
            <h1 className="text-2xl font-bold">Security Code</h1>
            <p className="text-muted-foreground text-sm">
              We have just sent a security code to:{' '}
              <span className="font-medium">{email}</span>
            </p>
          </div>

          <FormField
            control={form.control}
            name="code"
            render={({ field }) => (
              <FormItem className="flex flex-col gap-2 w-full">
                <FormControl>
                  <InputOTP
                    maxLength={6}
                    value={field.value}
                    onChange={(value) => field.onChange(value)}
                    onComplete={(value) => {
                      field.onChange(value);
                      form.handleSubmit(onSubmit)();
                    }}
                  >
                    <InputOTPGroup>
                      <InputOTPSlot index={0} />
                      <InputOTPSlot index={1} />
                      <InputOTPSlot index={2} />
                    </InputOTPGroup>
                    <InputOTPSeparator />
                    <InputOTPGroup>
                      <InputOTPSlot index={3} />
                      <InputOTPSlot index={4} />
                      <InputOTPSlot index={5} />
                    </InputOTPGroup>
                  </InputOTP>
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
            Verify
          </Button>

          <Button
            type="button"
            variant="link"
            onClick={handleResendCode}
            size="sm"
            className="text-xs"
          >
            Resend code
          </Button>
        </form>
      </Form>
    </Container>
  );
}
