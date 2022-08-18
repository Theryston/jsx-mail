import React from 'react';
import { Button } from '@jsx-mail/components';
import styled from 'styled-components';

export default function App() {
  return {
    Welcome: {
      componentFunction: ({ name }) => {
        return (
          <StyledButton href="http://localhost:3000">
            {name}, Click Here
          </StyledButton>
        );
      },
      props: {
        name: 'string',
      },
    },
  };
}

const StyledButton = styled(Button)`
  background-color: #ffffff;
  border: 1px solid rgba(0, 0, 0, 0.1);
  color: rgba(0, 0, 0, 0.85);
  display: inline-flex;
  font-family: system-ui, -apple-system, system-ui, 'Helvetica Neue', Helvetica,
    Arial, sans-serif;
  font-size: 16px;
  font-weight: 600;
  line-height: 1.25;
  margin: 0;
  padding: calc(0.875rem - 1px) calc(1.5rem - 1px);
  text-decoration: none;
  vertical-align: baseline;
  width: auto;
`;
