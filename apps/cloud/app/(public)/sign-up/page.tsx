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
  FormLabel,
} from '@jsx-mail/ui/form';
import { Input } from '@jsx-mail/ui/input';
import { Button } from '@jsx-mail/ui/button';
import Link from 'next/link';
import { useState, useEffect, useCallback } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import handleRedirectUrl from '@/utils/handle-redirect-url';
import { useCreateLead, useSignUp } from '@/hooks/user';
import { toast } from '@jsx-mail/ui/sonner';
import { EyeIcon, EyeOffIcon } from 'lucide-react';
import { sendGTMEvent } from '@next/third-parties/google';
import { Turnstile } from 'next-turnstile';
import PhoneInput from 'react-phone-number-input/react-hook-form-input';
import { isValidPhoneNumber } from 'react-phone-number-input';
import { cn } from '@jsx-mail/ui/lib/utils';

const signUpScheme = z
  .object({
    name: z
      .string({ required_error: 'Name is required' })
      .min(3, { message: 'Name must be at least 3 characters' })
      .max(100, { message: 'Name must be less than 100 characters' }),
    email: z.string({ required_error: 'Email is required' }).email({
      message: 'Invalid email address',
    }),
    phone: z
      .string()
      .optional()
      .nullable()
      .refine(
        (value) => {
          if (!value || value === '') return true;
          return isValidPhoneNumber(value);
        },
        {
          message: 'Invalid phone number',
        },
      ),
    password: z
      .string({ required_error: 'Password is required' })
      .min(6, { message: 'Password must be at least 6 characters' })
      .max(200, { message: 'Password must be less than 200 characters' }),
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
  const [currentStep, setCurrentStep] = useState(1);
  const searchParams = useSearchParams();
  const form = useForm<SignUpForm>({
    resolver: zodResolver(signUpScheme),
  });
  const { mutateAsync: signUp } = useSignUp();
  const router = useRouter();
  const { mutateAsync: createLead, isPending: isCreatingLead } =
    useCreateLead();

  useEffect(() => {
    setRedirect(handleRedirectUrl(searchParams));
  }, [searchParams]);

  const togglePasswordVisibility = () => setIsPasswordVisible((prev) => !prev);

  const resetTurnstile = () => {
    setTurnstileToken(null);
    setTurnstileKey((prev) => prev + 1);
  };

  const onSubmit = useCallback(
    async ({ name, email, phone, password }: SignUpForm) => {
      if (!turnstileToken) {
        toast.error('Please complete the captcha');
        return;
      }

      try {
        const utmGroupId = localStorage.getItem('utmGroupId');
        const leadId = localStorage.getItem('leadId');

        await signUp({
          name,
          email,
          phone: phone || undefined,
          password,
          utmGroupId: utmGroupId || undefined,
          turnstileToken,
          leadId: leadId || undefined,
        });

        if (leadId) localStorage.removeItem('leadId');
        if (utmGroupId) localStorage.removeItem('utmGroupId');

        const hasCalledSignUpEvent =
          localStorage.getItem('hasCalledSignUpEvent') === 'true';

        if (!hasCalledSignUpEvent) {
          localStorage.setItem('hasCalledSignUpEvent', 'true');
          sendGTMEvent({ event: 'sign_up' });
        }

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

  const nextStep = () => {
    if (currentStep === 1) {
      form.trigger(['name', 'email', 'phone']).then(async (isValid) => {
        if (!isValid) return;

        const existsLeadId = localStorage.getItem('leadId');
        const phone = form.getValues('phone');

        if (!existsLeadId) {
          const { id } = await createLead({
            email: form.getValues('email'),
            name: form.getValues('name'),
            phone: phone || undefined,
          });

          if (id) localStorage.setItem('leadId', id);
        }

        setCurrentStep(2);
      });
    }
  };

  const prevStep = () => {
    setCurrentStep(1);
  };

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

          <div className="flex items-center justify-center gap-2 w-full mb-4">
            <div className="flex items-center">
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center ${currentStep === 1 ? 'bg-primary text-primary-foreground' : 'bg-muted'}`}
              >
                1
              </div>
              <div
                className={cn(
                  'text-xs ml-2',
                  currentStep !== 1 ? 'text-muted-foreground' : 'text-primary',
                )}
              >
                Personal Info
              </div>
            </div>
            <div className="h-0.5 w-8 bg-muted" />
            <div className="flex items-center">
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center ${currentStep === 2 ? 'bg-primary text-primary-foreground' : 'bg-muted'}`}
              >
                2
              </div>
              <div
                className={cn(
                  'text-xs ml-2',
                  currentStep !== 2 ? 'text-muted-foreground' : 'text-primary',
                )}
              >
                Login Info
              </div>
            </div>
          </div>

          {currentStep === 1 && (
            <>
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem className="flex flex-col gap-2 w-full text-left">
                    <FormLabel>Name *</FormLabel>
                    <FormControl>
                      <Input {...field} />
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
                    <FormLabel>Email *</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="phone"
                render={({ field }) => (
                  <FormItem className="flex flex-col gap-2 w-full text-left">
                    <FormLabel>Phone</FormLabel>
                    <FormControl>
                      <PhoneInput {...field} inputComponent={Input} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button
                type="button"
                className="w-full"
                onClick={nextStep}
                isLoading={isCreatingLead}
              >
                Next Step
              </Button>
            </>
          )}

          {currentStep === 2 && (
            <>
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

              <div className="grid grid-cols-2 gap-2 w-full">
                <Button
                  type="button"
                  variant="outline"
                  className="w-full"
                  onClick={prevStep}
                  disabled={form.formState.isSubmitting}
                >
                  Back
                </Button>
                <Button
                  type="submit"
                  className="w-full"
                  isLoading={form.formState.isSubmitting}
                  disabled={!turnstileToken}
                >
                  Sign up
                </Button>
              </div>
            </>
          )}

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
