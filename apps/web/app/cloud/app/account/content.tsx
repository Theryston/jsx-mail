'use client';

import { useCloudAppContext } from '../context';
import { z } from 'zod';
import PhoneInput from 'react-phone-number-input/react-hook-form-input';
import { parsePhoneNumber, isValidPhoneNumber } from 'react-phone-number-input';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useCallback, useMemo } from 'react';
import { Input, DateInput, Button, Divider } from '@nextui-org/react';
import { parseDate } from '@internationalized/date';
import Link from 'next/link';
import axios from '@/app/utils/axios';
import { toast } from 'react-toastify';
import Sessions, { Session } from './Sessions';
import { titleCase } from '@/app/utils/title-case';

const userSchema = z.object({
  name: z.string().min(3).max(100),
  phone: z
    .string()
    .optional()
    .nullable()
    .refine(
      (value) => {
        if (!value) return true;
        return isValidPhoneNumber(value);
      },
      {
        message: 'Invalid phone number',
      },
    ),
  birthdate: z.date().optional().nullable(),
});

type User = z.infer<typeof userSchema>;

type Props = {
  sessions: Session[];
};

export default function AccountContent({ sessions }: Props) {
  const { user, fetchUser } = useCloudAppContext();
  const {
    register,
    handleSubmit,
    setValue,
    setError,
    control,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<User>({
    resolver: zodResolver(userSchema),
  });

  const realTimeBirthdate = useMemo(() => {
    const birthdate = watch('birthdate');
    if (!birthdate) return undefined;

    try {
      return parseDate(birthdate.toISOString().split('T')[0]);
    } catch {
      return undefined;
    }
  }, [watch('birthdate')]);

  const onSubmit = useCallback(
    async (data: User) => {
      try {
        await axios.put('/user', data);
        await fetchUser();
        toast.success('Your account has been updated');
      } catch (error: any) {
        toast.error(error.message || 'An error has occurred');
      }
    },
    [fetchUser],
  );

  return (
    <>
      <h1 className="text-2xl">
        <span className="font-bold">Your</span> account & sessions
      </h1>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="w-4/6 grid grid-cols-2 gap-4"
      >
        <Input
          isRequired
          label="Name"
          size="sm"
          {...register('name')}
          defaultValue={titleCase(user?.name)}
          classNames={{
            inputWrapper: 'bg-zinc-900 hover:bg-zinc-800',
          }}
          errorMessage={errors.name?.message}
          isInvalid={!!errors.name?.message}
        />
        <PhoneInput
          name="phone"
          control={control}
          inputComponent={Input}
          label="Phone"
          size="sm"
          defaultValue={
            user?.phone ? parsePhoneNumber(user?.phone)?.number : undefined
          }
          classNames={{ inputWrapper: 'bg-zinc-900 hover:bg-zinc-800' }}
          isInvalid={!!errors.phone?.message}
          errorMessage={errors.phone?.message}
        />
        <DateInput
          label="Birthdate"
          size="sm"
          defaultValue={
            user?.birthdate
              ? parseDate(user?.birthdate.toISOString().split('T')[0])
              : undefined
          }
          classNames={{
            inputWrapper: 'bg-zinc-900 hover:bg-zinc-800',
          }}
          isInvalid={!!errors.birthdate?.message}
          errorMessage={errors.birthdate?.message}
          onChange={(value) => {
            setValue('birthdate', value?.toDate('America/Sao_Paulo'));
          }}
          value={realTimeBirthdate}
        />
        <Input
          label="Email"
          size="sm"
          defaultValue={user?.email}
          title="This field is not editable."
          disabled
          classNames={{
            inputWrapper: 'bg-zinc-900 hover:bg-zinc-800 opacity-70',
          }}
        />
        <Input
          label="Password"
          type="text"
          size="sm"
          value="********"
          disabled
          title="This field is not editable."
          classNames={{
            inputWrapper: 'bg-zinc-900 hover:bg-zinc-800 opacity-70',
          }}
          description={
            <Link href="/cloud/password-recovery" className="text-xs">
              Change password
            </Link>
          }
        />

        <Button
          color="primary"
          className="h-12"
          type="submit"
          isLoading={isSubmitting}
        >
          Save
        </Button>
      </form>
      <Divider />
      <Sessions sessions={sessions} />
    </>
  );
}
