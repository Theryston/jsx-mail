// eslint-disable-next-line
const jsxMail = require('jsx-mail');

jsxMail
  .render('Welcome', {
    prefix: 'hello',
  })
  .then(result => {
    console.log(result);
  });
