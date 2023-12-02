const jsxMail = require('jsx-mail');
const fs = require('fs');

console.time('Jsx mail render');

jsxMail
  .render('user-created', {
    name: 'John Doe',
  })
  .then((html) => {
    console.timeEnd('Jsx mail render');
    fs.writeFileSync('user-created.html', html);
    console.log('Mail template HTML saved to user-created.html');
  })
  .catch((error) => {
    console.error('error', error);
  });
