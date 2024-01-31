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
import { createUser } from './actions';
import {
  // @ts-ignore
  experimental_useFormState as useFormState,
  // @ts-ignore
  experimental_useFormStatus as useFormStatus,
} from 'react-dom';
import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { EyeSlashFilledIcon } from '@/app/icons/EyeSlashFilledIcon';
import { EyeFilledIcon } from '@/app/icons/EyeFilledIcon';
import { useRouter } from 'next/navigation';

function SubmitButton() {
  const { pending } = useFormStatus();

  return (
    <Button isLoading={pending} color="primary" fullWidth type="submit">
      Create
    </Button>
  );
}

export default function Page() {
  const [state, formAction] = useFormState(createUser);
  const [isVisible, setIsVisible] = useState(false);
  const router = useRouter();

  const toggleVisibility = () => setIsVisible((old) => !old);

  useEffect(() => {
    if (!state) return;

    if (state.isError) {
      toast.error(state.message);
    } else {
      toast.success(state.message);
      localStorage.setItem('token', state.token);
      localStorage.setItem('refreshToken', state.refreshToken);
      router.push('/cloud/verify-email');
    }
  }, [state]);

  return (
    <main className="h-screen w-full flex justify-center items-center">
      <Card className="w-[400px]">
        <CardHeader className="flex flex-col">
          <h1 className="text-xl font-bold">Create Account</h1>
        </CardHeader>
        <CardBody>
          <form action={formAction} className="w-full flex flex-col gap-5">
            <Input
              isRequired
              type="text"
              name="name"
              label="Enter your name"
              className="w-full"
            />
            <Input
              isRequired
              type="email"
              name="email"
              label="Enter your email"
              className="w-full"
            />
            <Input
              endContent={
                <button
                  className="focus:outline-none"
                  type="button"
                  onClick={toggleVisibility}
                >
                  {isVisible ? (
                    <EyeSlashFilledIcon className="text-2xl text-default-400 pointer-events-none" />
                  ) : (
                    <EyeFilledIcon className="text-2xl text-default-400 pointer-events-none" />
                  )}
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
                  {isVisible ? (
                    <EyeSlashFilledIcon className="text-2xl text-default-400 pointer-events-none" />
                  ) : (
                    <EyeFilledIcon className="text-2xl text-default-400 pointer-events-none" />
                  )}
                </button>
              }
              isRequired
              type={isVisible ? 'text' : 'password'}
              label="Repeat the password"
              className="w-full"
              name="password2"
            />
            <SubmitButton />
          </form>
        </CardBody>
        <CardFooter className="flex justify-center items-center">
          <Link href="/cloud/sign-in" className="text-sm">
            Already have an account
          </Link>
        </CardFooter>
      </Card>
    </main>
  );
}
