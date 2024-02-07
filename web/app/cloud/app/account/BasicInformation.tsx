'use client';

import { titleCase } from '@/utils/title-case';
import { useCloudAppContext } from '../context';
import { Button, Input } from '@nextui-org/react';
import Link from 'next/link';

export default function BasicInformation() {
  const { user } = useCloudAppContext();

  return (
    <div className="flex flex-col gap-3">
      <Input
        label="Name"
        value={titleCase(user.name)}
        className="max-w-xs"
        disabled
      />
      <Input label="Email" value={user.email} className="max-w-xs" disabled />
      <div>
        <Link href="/cloud/password-recovery">
          <Button color="danger" variant="flat">
            Reset Password
          </Button>
        </Link>
      </div>
    </div>
  );
}
