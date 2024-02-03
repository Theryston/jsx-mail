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

  const handleSubmit: any = useCallback(
    async (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      setIsLoading(true);
      try {
        const formData = new FormData(e.currentTarget);
        const password = formData.get('password') as string;
        const password2 = formData.get('password2') as string;

        if (password !== password2) {
          throw new Error('Passwords do not match');
        }

        const { data } = await axios.post('/user/reset-password', {
          newPassword: password,
        });

        toast.success('The password has been reset successfully');

        let redirectUrl: URL | string = new URL(redirect);
        redirectUrl.searchParams.append('token', data.token);
        redirectUrl = redirectUrl.toString();

        if (data.isEmailVerified === false) {
          redirectUrl = `/cloud/security-code?permission=self:email-validate&email=${data.email}&redirect=${encodeURIComponent(`/cloud/verify-email?redirect=${redirectUrl}`)}`;
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
          <h1 className="text-xl font-bold">Reset password</h1>
        </CardHeader>
        <CardBody>
          <form onSubmit={handleSubmit} className="w-full flex flex-col gap-5">
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
              label="Type a password"
              className="w-full"
              name="password"
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
              label="Repeat the password"
              className="w-full"
              name="password2"
            />
            <Button
              isLoading={isLoading}
              color="primary"
              fullWidth
              type="submit"
            >
              Reset Password
            </Button>
          </form>
        </CardBody>
        <CardFooter className="flex justify-center items-center">
          <Link
            href={`/cloud/sign-in?redirect=${redirect}`}
            className="text-sm"
          >
            I remember my password
          </Link>
        </CardFooter>
      </Card>
    </main>
  );
}
