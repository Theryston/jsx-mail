import React from 'react';
import { WelcomeTemplate } from './templates/Welcome';
import dotenv from 'dotenv';

dotenv.config();

export default function App() {
  return {
    Welcome: {
      componentFunction: WelcomeTemplate,
      props: {
        name: 'Jonh Doe',
      },
    },
  };
}
