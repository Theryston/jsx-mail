import React from 'react';
import { WelcomeTemplate } from './templates/Welcome';

export default function App() {
  return {
    Welcome: {
      componentFunction: WelcomeTemplate,
      props: {
        name: 'string',
      },
    },
  };
}
