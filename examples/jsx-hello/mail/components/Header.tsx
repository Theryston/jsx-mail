import React from "react";
import { Group, Image } from "@jsx-mail/components";
import { getAbsolutePath } from "jsx-mail";
import styled from "styled-components";

export function Header() {
  return (
    <LogoWrapper align="center">
      <Image
        path={getAbsolutePath("assets/logo.png")}
        imgbbApiKey={process.env.IMGBB_API_KEY}
        width={50}
        height={50}
      />
    </LogoWrapper>
  );
}

const LogoWrapper = styled(Group)`
  margin: 0px 0px 20px 0px;
`;
