'use client';

import { Container } from '@/components/container';
import { SettingsForm } from './settings-form';
import { useDefaultSettings, useUpdateDefaultSettings } from '@/hooks/settings';
import { Button } from '@jsx-mail/ui/button';
import { useRouter } from 'next/navigation';
import { ArrowLeftIcon } from 'lucide-react';

export default function AdminSettings() {
  const { data: defaultSettings } = useDefaultSettings();
  const { mutateAsync: updateDefaultSettings } = useUpdateDefaultSettings();
  const router = useRouter();

  return (
    <Container header>
      <Button
        variant="outline"
        className="mb-4"
        onClick={() => router.back()}
        size="sm"
      >
        <ArrowLeftIcon className="size-4" />
        Back
      </Button>
      <SettingsForm
        initialData={defaultSettings}
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        onSubmit={async (data: any) => {
          await updateDefaultSettings(data);
        }}
        title="Default Settings"
        description="Update the default settings for all users. These settings will be used as fallback when user-specific settings are not set."
      />
    </Container>
  );
}
