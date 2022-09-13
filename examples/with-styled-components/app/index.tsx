import React from 'react';

import { Welcome } from './templates/Welcome';
import { ResetPassword } from './templates/ResetPassword';

export default function App() {
  return {
    Welcome: {
      componentFunction: Welcome,
      props: {
        paragraph:
          'Lorem ipsum dolor sit amet consectetur adipisicing elit. Omnis ratione vel distinctio nulla illum consequuntur quaerat laboriosam ad sequi mollitia, in dolores necessitatibus',
        name: 'John Doe',
      },
    },
    ResetPassword: {
      componentFunction: ResetPassword,
      props: {},
    },
  };
}
