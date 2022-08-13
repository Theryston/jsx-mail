import React from 'react';

export default function App() {
  return {
    Welcome: {
      componentFunction: ({ name }) => {
        return <div>Hello {name}</div>;
      },
      props: {
        name: 'string',
      },
    },
  };
}
