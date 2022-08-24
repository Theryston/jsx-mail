import React from 'react';
import { HelloComponent } from '../../components/HelloComponent';
import { Group } from '@jsx-mail/components';

export function ResetPassword() {
  return (
    <Group>
      <HelloComponent text="ResetPassword" />
    </Group>
  );
}
