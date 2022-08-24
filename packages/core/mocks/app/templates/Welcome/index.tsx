import React from 'react';
import { HelloComponent } from '../../components/HelloComponent';
import { Group } from '@jsx-mail/components';

export function Welcome({ prefix }: { prefix: string }) {
  return (
    <Group>
      {prefix}
      <HelloComponent text="Welcome" />
    </Group>
  );
}
