import * as React from 'react';
import { Group } from '@jsx-mail/components';

export default function App() {
  return {
    Welcome: {
      componentFunction: ({ name }) => {
        const [state, setState] = React.useState(0);

        setState(1);

        return (
          <Group>
            Hello {name}. State: {state}
          </Group>
        );
      },
      props: {
        name: 'string',
      },
    },
  };
}
