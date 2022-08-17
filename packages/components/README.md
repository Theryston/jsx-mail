# JSXMail

![jsx-mail-comparation](https://user-images.githubusercontent.com/72868196/183707838-19065b95-34fa-430e-a3e1-f4f353a05259.jpg)

jsx-mail is an email framework that uses React to create email templates. Using JSX syntax makes it extremely easy to code your template, allowing you to create highly customized emails and reducing code maintenance work. Also, the main purpose of jsx-mail is to make your email templates compatible with all email clients.

## Usage

JSX works with 2 different sides. the first side is what we call "jsx-side" this is the part where you should define the jsx/tsx content for your email template. the second side is called the "js-side" this is the side of your api (or whoever needs the HTML of the email).

```jsx
// jsx-side
export function Welcome({ name }) {
  return <h1>{name} Welcome to jsx-mail</h1>;
}

export default function App() {
  return {
    Welcome: {
      componentFunction: Welcome,
      props: {
        name: 'string',
      },
    },
  };
}
```

```js
// js-side
import { render } = from 'jsx-mail';
const template = await render('Welcome', { name: 'John' });

console.log(template) // <html>...<h1>John Welcome to jsx-mail</h1>...</html>
```

## Documentation

See the documentation [here](https://theryston.com/jsx-mail-docs)

## Why use jsx-mail?

If you've ever needed to create email templates, you know how complex it can be, from having to host the image on a separate server to a footer that appears overlaying the main button. So why use jsx? Because it solves all that for you! But ok, if you're still not convinced, here's a list of perks:

- Simple Code

```html
<!-- html -->

<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta http-equiv="X-UA-Compatible" content="IE=edge" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Button</title>
  </head>
  <body>
    <table>
      <tr>
        <td>
          <a style="background-color: red" href="https://example.com">
            I'm a button
          </a>
        </td>
      </tr>
    </table>
  </body>
</html>
```

```jsx
// jsx-mail
import { Button } from 'jsx-mail/components';
import styled from 'styled-components';

export function MyButton({ children }) {
  return <ButtonStyled>{children}</ButtonStyled>;
}

const ButtonStyled = styled(Button)`
  background-color: red;
`;
```

Which of these two codes can you understand faster? I believe the second, because the power of jsx is very big when it comes to simplifying codes and making them easier to understand. So this is what jsx-mail brings for creating email templates, all the power of JSX.

- Compatibility with email clients

jsx-mail improves email template compatibility. This means that email templates created with JSX-Mail will display correctly in all email clients, including the most popular ones like Gmail, Yahoo! Mail and Outlook. What it does is block the use of some html tags or css attributes which are not accepted in email clients.

- Simplified Development

With the jsx-mail cli (tool included in jsx-mail) you can simplify the development process, since you can use the `server` command for jsx to start an application that simulates an email client.
