import React from "react";
import { Group } from "@jsx-mail/components";
import styled from "styled-components";
import { Footer } from "./Footer";
import { Header } from "./Header";

export function Layout({ children }: { children: React.ReactNode }) {
  return (
    <Container>
      <Header />
      <Body>{children}</Body>
      <Footer />
    </Container>
  );
}

const Container = styled(Group)`
  font-family: "Segoe UI", Tahoma, Geneva, Verdana, sans-serif;
  padding: 20px 150px;
  background-color: #f7f7f7;
`;

const Body = styled(Group)`
  background-color: #fff;
  padding: 20px;
`;
