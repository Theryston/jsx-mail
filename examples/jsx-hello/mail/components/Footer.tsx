import React from "react";
import styled from "styled-components";
import { Button, Image, Group } from "@jsx-mail/components";
import { getAbsolutePath } from "jsx-mail";

export function Footer() {
  return (
    <Container align="center">
      <Anchor href="https://github.com/Theryston/jsx-mail">
        <Image
          path={getAbsolutePath("assets/icons/github.png")}
          imgbbApiKey={process.env.IMGBB_API_KEY}
          width={20}
          height={20}
        />
      </Anchor>
      <Anchor href="https://www.npmjs.com/package/jsx-mail">
        <Image
          path={getAbsolutePath("assets/icons/npm.png")}
          imgbbApiKey={process.env.IMGBB_API_KEY}
          width={20}
          height={20}
        />
      </Anchor>
      <Anchor href="https://github.com/Theryston/jsx-mail/blob/master/LICENSE">
        <Image
          path={getAbsolutePath("assets/icons/license.png")}
          imgbbApiKey={process.env.IMGBB_API_KEY}
          width={20}
          height={20}
        />
      </Anchor>
    </Container>
  );
}

const Container = styled(Group)`
  margin: 20px 0px 0px 0px;
`;

const Anchor = styled(Button)`
  background: transparent;
  border: none;
  padding: 0px 10px;
`;
