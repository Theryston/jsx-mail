'use client';

import axios from '@/app/utils/axios';
import handleRedirectUrl from '@/app/utils/handle-redirect-url';
import { Card, CardBody, CardHeader, Spinner } from '@nextui-org/react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useCallback, useEffect, useState } from 'react';
import { toast } from 'react-toastify';

export default function Page() {
  const [redirect, setRedirect] = useState('' as string);
  const searchParams = useSearchParams();
  const router = useRouter();

  const verifyEmail = useCallback(async () => {
    if (!redirect) return;

    try {
      const { data } = await axios.put('/user/validate-email');
      let redirectUrl: URL | string = new URL(redirect);
      redirectUrl.searchParams.append('token', data.token);
      redirectUrl.searchParams.append('sessionId', data.sessionId);
      redirectUrl = redirectUrl.toString();
      router.push(redirectUrl);
    } catch (error: any) {
      toast.error(error.message);
      router.push('/cloud/sign-up');
    }
  }, [redirect, router]);

  useEffect(() => {
    setRedirect(handleRedirectUrl(searchParams));
  }, [searchParams]);

  useEffect(() => {
    verifyEmail();
  }, [verifyEmail]);

  return (
    <main className="h-screen w-full flex justify-center items-center">
      <Card className="w-11/12 md:w-[400px] pb-5">
        <CardHeader className="flex flex-col">
          <h1 className="text-xl font-bold">Verifying email</h1>
          <p className="text-center">
            Please just await while we verify your email
          </p>
        </CardHeader>
        <CardBody>
          <div className="flex justify-center items-center mt-4">
            <Spinner size="lg" />
          </div>
        </CardBody>
      </Card>
    </main>
  );
}
