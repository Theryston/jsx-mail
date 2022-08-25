// eslint-disable-next-line
const jsxMail = require('jsx-mail');

jsxMail
  .render('Welcome', {
    name: 'John Doe',
  })
  .then(result => {
    console.log(result);
  });
