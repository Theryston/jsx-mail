'use client';

import {
  Button,
  Card,
  CardHeader,
  CardBody,
  CardFooter,
  Input,
  Link,
} from '@nextui-org/react';
import { useCallback, useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { useRouter, useSearchParams } from 'next/navigation';
import { EyeClosedIcon, EyeOpenIcon } from '@radix-ui/react-icons';
import axios from '@/utils/axios';
import handleRedirectUrl from '@/utils/handle-redirect-url';
import BackButton from '../BackButton';

export default function Page() {
  const [isLoading, setIsLoading] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [redirect, setRedirect] = useState('' as string);
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    setRedirect(handleRedirectUrl(searchParams));
  }, [searchParams]);

  const toggleVisibility = () => setIsVisible((old) => !old);

  const handleSubmit = useCallback(
    async (e: React.FormEvent<HTMLFormElement>) => {
      if (!redirect) return;

      e.preventDefault();
      setIsLoading(true);
      try {
        const formData = new FormData(e.currentTarget);
        const email = formData.get('email') as string;
        const password = formData.get('password') as string;

        const { data } = await axios.post('/user/auth', {
          email,
          password,
        });

        toast.success('Logged in successfully');

        let redirectUrl: URL | string = new URL(redirect);
        redirectUrl.searchParams.append('token', data.token);
        redirectUrl.searchParams.append('sessionId', data.sessionId);
        redirectUrl = redirectUrl.toString();

        if (data.isEmailVerified === false) {
          redirectUrl = `/cloud/security-code?permission=self:email-validate&email=${email}&redirect=${encodeURIComponent(`/cloud/verify-email?redirect=${redirectUrl}`)}`;
        }

        router.push(redirectUrl);
      } catch (error: any) {
        toast.error(error.message);
      } finally {
        setIsLoading(false);
      }
    },
    [router, redirect],
  );

  return (
    <main className="h-screen w-full flex justify-center items-center">
      <BackButton />
      <Card className="w-11/12 md:w-[400px]">
        <CardHeader className="flex flex-col">
          <h1 className="text-xl font-bold">Sign In</h1>
        </CardHeader>
        <CardBody>
          <form onSubmit={handleSubmit} className="w-full flex flex-col gap-5">
            <Input
              isRequired
              type="email"
              name="email"
              label="Email"
              placeholder="Enter your email"
              className="w-full"
            />
            <Input
              endContent={
                <button
                  className="focus:outline-none"
                  type="button"
                  onClick={toggleVisibility}
                >
                  {isVisible ? <EyeOpenIcon /> : <EyeClosedIcon />}
                </button>
              }
              isRequired
              type={isVisible ? 'text' : 'password'}
              label="Password"
              placeholder="********"
              className="w-full"
              name="password"
            />
            <Button
              isLoading={isLoading}
              color="primary"
              fullWidth
              type="submit"
            >
              Sign In
            </Button>
          </form>
        </CardBody>
        <CardFooter className="flex flex-col justify-center items-center">
          <Link
            href={`/cloud/sign-up?redirect=${redirect}`}
            className="text-sm"
          >
            Do not have an account?
          </Link>
          <Link
            href={`/cloud/password-recovery?redirect=${redirect}`}
            className="text-sm text-gray-600 mt-2"
          >
            Forgot your password?
          </Link>
        </CardFooter>
      </Card>
    </main>
  );
}
