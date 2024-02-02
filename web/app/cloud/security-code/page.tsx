'use client';

import axios from '@/utils/axios';
import { Button, Card, CardBody, CardHeader, Input } from '@nextui-org/react';
import { ArrowLeftIcon } from '@radix-ui/react-icons';
import { useRouter, useSearchParams } from 'next/navigation';
import { useCallback, useEffect, useState } from 'react';
import { toast } from 'react-toastify';

export default function Page() {
  const [email, setEmail] = useState('');
  const [redirect, setRedirect] = useState('');
  const [permission, setPermission] = useState('');
  const [isLoading, setIsLoading] = useState(false);
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

  const handleSendCode = useCallback(async () => {
    const isSubmitted = sessionStorage.getItem('isSubmitted');
    if (isSubmitted) {
      return;
    }

    setIsLoading(true);
    try {
      await axios.post('/user/security-code', {
        email,
      });

      sessionStorage.setItem('isSubmitted', 'true');
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setIsLoading(false);
    }
  }, [email]);

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

    handleSendCode();
  }, [email, handleSendCode]);

  return (
    <main className="h-screen w-full flex justify-center items-center">
      <Button
        isIconOnly
        onClick={() => router.back()}
        className="absolute top-5 left-5"
      >
        <ArrowLeftIcon />
      </Button>
      <Card className="w-11/12 md:w-[400px]">
        <CardHeader className="flex flex-col">
          <h1 className="text-xl font-bold">Security code</h1>
          <p className="text-center">
            We have just sent a security code to: {email}
          </p>
        </CardHeader>
        <CardBody>
          <form onSubmit={handleSubmit} className="w-full flex flex-col gap-5">
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
          </form>
        </CardBody>
      </Card>
    </main>
  );
}
