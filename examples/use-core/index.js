// eslint-disable-next-line
const { Core } = require('@jsx-mail/core');

console.log();

const core = new Core(__dirname + '/mail-app', 'dist');

core.build().then(result => {
  console.log('Build result:', result);
  core
    .render(
      'Welcome',
      {
        name: 'John Doe',
      },
      {
        lang: 'pt-BR',
      },
    )
    .then(result => {
      console.log('Render result:', result);
    });
});
