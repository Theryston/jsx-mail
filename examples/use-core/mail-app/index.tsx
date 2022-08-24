import React from 'react';
import { Group } from '@jsx-mail/components';

export default function App() {
  return {
    Welcome: {
      componentFunction: ({ name }) => {
        return <Group>Hello {name}</Group>;
      },
      props: {
        name: 'string',
      },
    },
  };
}
