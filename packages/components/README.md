# JSXMail

```tsx
import React from 'react';
import { Group } from '@jsx-mail/components';

export default function hello({ name }) {
  return (
    <Group align="center">
      <h1>Hello {name}, welcome to our website!</h1>
    </Group>
  );
}
```

The jsx-mail component is a package of the jsx-mail framework that makes your email templates easier and simpler. Example: One of the components is the Group which must be used instead of the HTML div tag. This component creates an HTML table (this so you don't write lines of code to create your table, which is indicated by email clients)

## Usage

It is very simple to use the jsx-mail components, just install it (`pnpm add/yarn add/npm i @jsx-mail/components`) and then just import the component from `@jsx-mail/components` that you want to use

## Documentation

See the documentation [here](https://jsx-mail.org/docs/components)
