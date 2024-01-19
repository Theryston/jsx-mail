const jsxMail = require('jsx-mail');
const fs = require('fs');

console.time('Jsx mail render');

jsxMail
  .render('news', {
    name: 'John Doe',
  })
  .then((html) => {
    console.timeEnd('Jsx mail render');
    fs.writeFileSync('news.html', html);
    console.log('Mail template HTML saved to news.html');
  })
  .catch((error) => {
    console.error('error', error);
  });
