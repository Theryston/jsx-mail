'use client';

import { titleCase } from '@/app/utils/title-case';
import { useCloudAppContext } from '../context';
import { Avatar, Card, CardBody, CardHeader } from '@nextui-org/react';

export default function BasicInformation() {
  const { user } = useCloudAppContext();

  return (
    <Card className="flex flex-col w-full gap-2">
      <CardHeader className="flex flex-col justify-center items-center pb-0">
        <Avatar isBordered size="lg" name={titleCase(user.name)} />
      </CardHeader>
      <CardBody className="flex flex-col justify-center items-center pt-0">
        <h2 className="text-xl font-bold">{titleCase(user.name)}</h2>
        <p className="text-gray-500">{user.email}</p>
        <p className="text-gray-500">{user.balance.friendlyAmount}</p>
      </CardBody>
    </Card>
  );
}
