# JSXMail

![jsx-mail-comparation](https://user-images.githubusercontent.com/72868196/183707838-19065b95-34fa-430e-a3e1-f4f353a05259.jpg)

All the basic functioning of jsx-mail. Build or render functions directly.

## Usage

```jsx
// eslint-disable-next-line
const { Core } = require('@jsx-mail/core');

const core = new Core(__dirname + '/mail-app', 'dist');

core.build().then((result) => {
  console.log('Build result:', result);
  core
    .render(
      'Welcome',
      {
        name: 'John Doe',
      },
      {
        lang: 'pt-BR',
      }
    )
    .then((result) => {
      console.log('Render result:', result);
    });
});
```

## Documentation

See the documentation [here](https://jsx-mail.org/docs/core)
