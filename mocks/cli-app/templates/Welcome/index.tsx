import React from 'react';
import { HelloComponent } from '../../components/HelloComponent';
import GlobalStyle from '../../globalStyle';

export function Welcome({ prefix }: { prefix: string }) {
  return (
    <div>
      <GlobalStyle />
      <HelloComponent text={prefix} />
    </div>
  );
}
