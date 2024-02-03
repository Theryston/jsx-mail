'use client';

import axios from '@/utils/axios';
import {
  Button,
  Card,
  CardBody,
  CardHeader,
  Input,
  Link,
} from '@nextui-org/react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useCallback, useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import BackButton from '../BackButton';

export default function Page() {
  const [email, setEmail] = useState('');
  const [redirect, setRedirect] = useState('');
  const [permission, setPermission] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [stateIsSubmitted, setStateIsSubmitted] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();

  const handleSubmit = useCallback(
    async (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      const formData = new FormData(e.currentTarget);
      const code = formData.get('code') as string;

      if (!code) {
        toast.error('Code is required');
        return;
      }

      setIsLoading(true);
      try {
        const response = await axios.post('/user/security-code/use', {
          securityCode: code,
          permission,
        });

        if (!response.data.token) {
          throw new Error('Invalid code');
        }

        localStorage.setItem('token', response.data.token);

        router.push(redirect);
      } catch (error: any) {
        toast.error(error.message);
      } finally {
        setIsLoading(false);
      }
    },
    [permission, redirect, router],
  );

  const setIsSubmitted = useCallback(
    (value: string) => {
      let pageSubmitted: URL | string = new URL(window.location.href);
      pageSubmitted.searchParams.append('isSubmitted', value);
      pageSubmitted = pageSubmitted.toString();

      router.push(pageSubmitted);
      setStateIsSubmitted(value === 'true');
    },
    [router],
  );

  const handleSendCode = useCallback(async () => {
    if (isLoading) return;

    setIsLoading(true);
    try {
      await axios.post('/user/security-code', {
        email,
      });
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setIsLoading(false);
    }
  }, [email, isLoading]);

  useEffect(() => {
    if (!searchParams) {
      router.push('/cloud/sign-up');
      return;
    }

    const searchPermission = searchParams.get('permission');
    const searchEmail = searchParams.get('email');
    const searchRedirect = searchParams.get('redirect');

    if (!searchPermission || !searchEmail || !searchRedirect) {
      router.push('/cloud/sign-up');
      return;
    }

    if (!searchRedirect.startsWith('/')) {
      router.push('/cloud/sign-up');
      return;
    }

    setPermission(searchPermission);
    setEmail(searchEmail);
    setRedirect(searchRedirect);
  }, [searchParams, router]);

  useEffect(() => {
    if (!email) {
      return;
    }

    const isSubmitted = searchParams?.get('isSubmitted');

    if (isSubmitted === 'true' || stateIsSubmitted) {
      return;
    }

    console.log('passou!');

    handleSendCode();

    setIsSubmitted('true');
  }, [email, setIsSubmitted, handleSendCode, searchParams, stateIsSubmitted]);

  return (
    <main className="h-screen w-full flex justify-center items-center">
      <BackButton />
      <Card className="w-11/12 md:w-[400px]">
        <CardHeader className="flex flex-col">
          <h1 className="text-xl font-bold">Security code</h1>
          <p className="text-center">
            We have just sent a security code to: {email}
          </p>
        </CardHeader>
        <CardBody>
          <form
            onSubmit={handleSubmit}
            className="w-full flex flex-col gap-5 items-center"
          >
            <Input
              isRequired
              type="text"
              name="code"
              label="Enter the code"
              className="w-full text-center"
            />
            <Button
              isLoading={isLoading}
              color="primary"
              fullWidth
              type="submit"
            >
              Verify
            </Button>
            <Link
              onClick={handleSendCode}
              href="#"
              className="text-sm text-center"
            >
              Resend code
            </Link>
          </form>
        </CardBody>
      </Card>
    </main>
  );
}
