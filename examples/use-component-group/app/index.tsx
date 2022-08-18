import React from 'react';
import { Group } from '@jsx-mail/components';
import styled from 'styled-components';

export default function App() {
  return {
    Welcome: {
      componentFunction: ({ name }) => {
        return (
          <StyledBody>
            <Group align="center">
              <StyledGroup>
                <Group align="center">
                  <h1>Hello {name}, welcome to our website!</h1>
                </Group>
                <Group>
                  <p>
                    Lorem ipsum, dolor sit amet consectetur adipisicing elit. Ad
                    deserunt temporibus blanditiis molestias fugiat tempora
                    eveniet molestiae assumenda dolores dicta quas modi,
                    expedita in nesciunt obcaecati? Quasi laudantium facilis
                    aspernatur.
                  </p>
                  <p>
                    Lorem ipsum, dolor sit amet consectetur adipisicing elit. Ad
                    deserunt temporibus blanditiis molestias fugiat tempora
                    eveniet molestiae assumenda dolores dicta quas modi,
                    expedita in nesciunt obcaecati? Quasi laudantium facilis
                    aspernatur.
                  </p>
                </Group>
              </StyledGroup>
            </Group>
          </StyledBody>
        );
      },
      props: {
        name: 'string',
      },
    },
  };
}

const StyledGroup = styled(Group)`
  background-color: #ffffff;
  padding: 20px;
  width: 500px;
  border: 1px solid #e2e2e2;
`;

const StyledBody = styled(Group)`
  background-color: #f5f5f5;
  height: 100%;
`;
