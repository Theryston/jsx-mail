// eslint-disable-next-line
const jsxMail = require('jsx-mail');

jsxMail
  .render('Welcome', {
    paragraph:
      'Lorem ipsum dolor sit amet consectetur adipisicing elit. Omnis ratione vel distinctio nulla illum consequuntur quaerat laboriosam ad sequi mollitia, in dolores necessitatibus',
    name: 'John Doe',
  })
  .then(result => {
    console.log(result);
  });
