'use client';

import handleRedirectUrl from '@/utils/handle-redirect-url';
import { Button, Card, CardBody, CardHeader, Input } from '@nextui-org/react';
import { ArrowLeftIcon } from '@radix-ui/react-icons';
import { useRouter, useSearchParams } from 'next/navigation';
import { useCallback, useEffect, useState } from 'react';

export default function Page() {
  const [redirect, setRedirect] = useState('');
  const router = useRouter();
  const searchParams = useSearchParams();

  const handleSubmit = useCallback(
    async (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      const formData = new FormData(e.currentTarget);
      const email = formData.get('email') as string;

      if (!email) {
        return;
      }

      const url = `/cloud/security-code?permission=self:reset-password&email=${email}&redirect=${encodeURIComponent(`/cloud/password-reset?redirect=${redirect}`)}`;

      router.push(url);
    },
    [redirect, router],
  );

  useEffect(() => {
    if (!searchParams) {
      router.push('/cloud/sign-up');
      return;
    }

    setRedirect(handleRedirectUrl(searchParams));
  }, [searchParams, router]);

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
          <h1 className="text-xl font-bold">Password recovery</h1>
        </CardHeader>
        <CardBody>
          <form
            onSubmit={handleSubmit}
            className="w-full flex flex-col gap-5 items-center"
          >
            <Input
              isRequired
              type="email"
              name="email"
              label="Enter your email"
              className="w-full text-center"
            />
            <Button color="primary" fullWidth type="submit">
              Send code
            </Button>
          </form>
        </CardBody>
      </Card>
    </main>
  );
}
