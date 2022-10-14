import React from "react";
import { Group } from "@jsx-mail/components";
import { Layout } from "../components/Layout";

type Props = {
  name: string;
};

export function WelcomeTemplate({ name }: Props) {
  return (
    <Layout>
      <Group align="center">
        <h1>Hello, {name}</h1>
      </Group>
      <p>
        This is an email developed with the Jsx Mail framework. In this email
        template we have a basic structure of an email template, with a logo, a
        background and a container in the center with data, to see the code of
        this email template you can open the jsx mail repository in the
        examples.
      </p>
      <p>
        Jsx Mail is an email framework that uses React to create email
        templates. Using JSX syntax makes it extremely easy to code your
        template, allowing you to create highly customized emails and reducing
        code maintenance work. Also, the main <b>purpose</b> of Jsx Mail is to
        make your email templates compatible with all email clients.
      </p>
    </Layout>
  );
}
