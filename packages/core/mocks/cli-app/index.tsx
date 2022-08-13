import React from 'react';

import { Welcome } from './templates/Welcome';
import { ResetPassword } from './templates/ResetPassword';

export default function App() {
  return {
    Welcome: {
      componentFunction: Welcome,
      props: {
        prefix: 'string',
      },
    },
    ResetPassword: {
      componentFunction: ResetPassword,
      props: {},
    },
  };
}
