# NextJS and JSX Mail

Using JSX Mail with NextJS is very simple and here is an example of how to do it. But in a nutshell the process is:

1.Install the JSX Mail and init it into your Next.JS application:

```sh copy
yarn add jsx-mail && yarn jsxm init
```

2.Add the prepare command to the `package.json``:

```json /jsxm prepare/ filename="package.json" copy
{
  "scripts": {
    "dev": "jsxm prepare && next dev",
    "build": "next build && jsxm prepare"
  }
}
```

Perfect, now you can normally use jsx mail and all its features directly in your Next.js application.

You can see an example of [template rendering](https://jsxmail.org/docs#rendering-in-code) in the [/pages/api/render-email.ts](/pages/api/render-email.ts) file and an example of [sending an email with JSX Mail Cloud](https://jsxmail.org/docs/email#sending-emails) in the [/pages/api/send-email.ts](/pages/api/send-email.ts) file.
