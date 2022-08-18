import React from 'react';
import { Image } from '@jsx-mail/components';
import { getAbsolutePath } from 'jsx-mail';
import styled from 'styled-components';

export default function App() {
  return {
    Welcome: {
      componentFunction: ({ name }) => {
        return (
          <div>
            <h1>{name}, see this:</h1>
            <Image
              alt="Image from url"
              height="128"
              width="128"
              src="https://i.ibb.co/GdDPZRf/Ellipse-6.png"
            />
            <StyledImage
              alt="Image from path"
              path={getAbsolutePath('assets/screenshot.png')}
            />
          </div>
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
