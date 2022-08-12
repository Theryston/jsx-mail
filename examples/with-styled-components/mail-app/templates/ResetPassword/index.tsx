import React from 'react';
import { HelloComponent } from '../../components/HelloComponent';
import GlobalStyle from '../../globalStyle';

export function ResetPassword() {
  return (
    <div>
      <GlobalStyle />
      <HelloComponent text="ResetPassword" />
    </div>
  );
}
