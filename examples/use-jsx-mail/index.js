const jsxMail = require('jsx-mail');

jsxMail
  .render()
  .then((html) => {
    console.log(html);
  })
  .catch((error) => {
    console.error(error);
  });
