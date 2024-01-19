const jsxMail = require('jsx-mail');

const TEST_EMAIL = 'devtheryston@gmail.com';

console.time('Jsx mail send');

jsxMail
  .send('news', {
    subject: 'Hi! I have news for you!',
    to: [TEST_EMAIL],
    props: {
      name: 'John Doe',
    },
  })
  .then(() => {
    console.timeEnd('Jsx mail send');
    console.log(`The email was send successfully to: ${TEST_EMAIL}`);
  })
  .catch((error) => {
    console.error('error', error);
  });
