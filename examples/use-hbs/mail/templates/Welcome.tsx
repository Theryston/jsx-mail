import React from 'react';
import { Group } from '@jsx-mail/components';
import styled from 'styled-components';

type Props = {
  name: string;
};

export function WelcomeTemplate({
  name,
}: Props) {
  return (
    <Container>
      <Body>
        <h1>Hello, {name}</h1>
        <p>
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Fugiat in
          exercitationem temporibus, commodi harum tempora voluptas minima
          explicabo sequi dolorum quo optio inventore voluptatem corporis?
          Dolorum molestiae asperiores magni cumque? exercitationem temporibus,
          commodi harum tempora voluptas minima explicabo sequi dolorum quo
          optio inventore voluptatem corporis? Dolorum molestiae asperiores
          magni cumque?
        </p>
        <p>
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Fugiat in
          exercitationem temporibus, commodi harum tempora voluptas minima
          explicabo sequi dolorum quo optio inventore voluptatem corporis?
          Dolorum molestiae asperiores magni cumque? exercitationem temporibus,
          commodi harum tempora voluptas minima explicabo sequi dolorum quo
          optio inventore voluptatem corporis? Dolorum molestiae asperiores
          magni cumque?
        </p>
      </Body>
    </Container>
  );
}

const Container = styled(Group)`
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  padding: 20px 100px;
  background-color: #f7f7f7;
`;

const Body = styled(Group)`
  background-color: #fff;
  padding: 20px;
`;
