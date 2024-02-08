'use client';

import { titleCase } from '@/utils/title-case';
import { useCloudAppContext } from '../context';
import { Avatar, Button, Card, CardBody, CardHeader } from '@nextui-org/react';
import Link from 'next/link';

export default function BasicInformation() {
  const { user } = useCloudAppContext();

  return (
    <div className="flex justify-center items-center w-full">
      <Card className="flex flex-col w-full md:w-[400px] gap-2">
        <CardHeader className="flex flex-col justify-center items-center pb-0">
          <Avatar isBordered size="lg" name={titleCase(user.name)} />
        </CardHeader>
        <CardBody className="flex flex-col justify-center items-center pt-0">
          <h2 className="text-xl font-bold">{titleCase(user.name)}</h2>
          <p className="text-gray-500">{user.email}</p>
          <Link href="/cloud/password-recovery" className="mt-4">
            <Button color="danger" variant="flat">
              Reset Password
            </Button>
          </Link>
        </CardBody>
      </Card>
    </div>
  );
}
