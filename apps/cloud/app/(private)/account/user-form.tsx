'use client';

import { useMe, useUpdateUser } from '@/hooks/user';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useState, useEffect } from 'react';
import { toast } from '@jsx-mail/ui/sonner';
import { Button } from '@jsx-mail/ui/button';
import { Input } from '@jsx-mail/ui/input';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@jsx-mail/ui/form';
import { Card, CardContent } from '@jsx-mail/ui/card';
import Link from 'next/link';
import { titleCase } from '@/utils/title-case';
import PhoneInput from 'react-phone-number-input/react-hook-form-input';
import { parsePhoneNumber, isValidPhoneNumber } from 'react-phone-number-input';

const userSchema = z.object({
  name: z
    .string()
    .min(3, 'Name must be at least 3 characters')
    .max(100, 'Name must be at most 100 characters'),
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
  birthdate: z.coerce.date().optional().nullable(),
});

type UserFormValues = z.infer<typeof userSchema>;

export function UserForm() {
  const { data: me } = useMe();
  const { mutateAsync: updateUser } = useUpdateUser();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<UserFormValues>({
    resolver: zodResolver(userSchema),
    defaultValues: {
      name: '',
      phone: '',
      birthdate: null,
    },
  });

  useEffect(() => {
    if (me) {
      form.reset({
        name: titleCase(me.name),
        phone: me.phone,
        birthdate: me.birthdate,
      });
    }
  }, [me]);

  async function onSubmit(data: UserFormValues) {
    setIsSubmitting(true);
    try {
      await updateUser(data);
      toast.success('Your account has been updated');
    } catch (error: any) {
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <Card>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Name</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="phone"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Phone</FormLabel>
                    <FormControl>
                      <PhoneInput {...field} inputComponent={Input} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="birthdate"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Birthdate</FormLabel>
                    <FormControl>
                      <Input
                        type="date"
                        value={
                          field.value
                            ? new Date(field.value).toISOString().split('T')[0]
                            : ''
                        }
                        onChange={(e) =>
                          field.onChange(
                            e.target.value ? new Date(e.target.value) : null,
                          )
                        }
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input value={me?.email || ''} disabled />
                </FormControl>
              </FormItem>

              <FormItem>
                <FormLabel>Password</FormLabel>
                <FormControl>
                  <Input type="password" value="********" disabled />
                </FormControl>
                <div className="text-xs text-muted-foreground mt-1">
                  <Link href="/password-recovery" className="hover:underline">
                    Change password
                  </Link>
                </div>
              </FormItem>
            </div>

            <Button type="submit" className="mt-4" isLoading={isSubmitting}>
              Save Changes
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
