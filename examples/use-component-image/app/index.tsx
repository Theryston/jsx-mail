import React from 'react';
import { Image, Group } from '@jsx-mail/components';
import { getAbsolutePath } from 'jsx-mail';
import styled from 'styled-components';

export default function App() {
  return {
    Welcome: {
      componentFunction: ({ name }) => {
        return (
          <Group>
            <h1>{name}, see this:</h1>
            <StyledImage
              alt="Image from url"
              height="128"
              src="https://cdn.pixabay.com/photo/2022/08/15/09/14/koyasan-temple-7387445_960_720.jpg"
            />
            <Image
              alt="Image from path"
              path={getAbsolutePath('assets/screenshot.png')}
              imgbbApiKey="1a375e669ceebf6721ce2150d36d90c2"
              height="128"
            />
          </Group>
        );
      },
      props: {
        name: 'string',
      },
    },
  };
}

const StyledImage = styled(Image)`
  width: 128px;
`;
