'use client';

import handleRedirectUrl from '@/utils/handle-redirect-url';
import { Card, CardBody, CardHeader, Spinner } from '@nextui-org/react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function Page() {
  const [redirect, setRedirect] = useState('' as string);
  const [token, setToken] = useState('' as string);
  const [sessionId, setSessionId] = useState('' as string);
  const searchParams = useSearchParams();
  const router = useRouter();

  useEffect(() => {
    if (!redirect || !token) return;

    document.cookie = `token=${token}; path=/; max-age=604800;`;
    document.cookie = `sessionId=${sessionId}; path=/; max-age=604800;`;

    router.push(redirect);
  }, [redirect, token, router, sessionId]);

  useEffect(() => {
    setRedirect(handleRedirectUrl(searchParams));
    setToken(searchParams?.get('token') || '');
    setSessionId(searchParams?.get('sessionId') || '');
  }, [searchParams]);

  return (
    <main className="h-screen w-full flex justify-center items-center">
      <Card className="w-11/12 md:w-[400px] pb-5">
        <CardHeader className="flex flex-col">
          <h1 className="text-xl font-bold">Authenticating</h1>
          <p className="text-center">
            Please just await while we authenticate your account
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
