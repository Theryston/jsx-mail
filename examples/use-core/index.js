const core = require('@jsx-mail/core').default;
const path = require('path');
const fs = require('fs');

core
  .prepare('./mail', {
    onProcessChange: (name, data) => {
      console.log(`Process ${name} was called`);

      if (name === 'template_executed') {
        fs.writeFileSync('./example-vd.json', JSON.stringify(data.virtualDOM));
        const templateName = path.basename(data.path);
        console.log(
          `Virtual DOM for ${templateName} is in file ./example-vd.json`,
        );
      }
    },
    ignoreCloud: false,
    storage: 'JSX_MAIL_CLOUD',
    // awsAccessKeyId: 'AWS_ACCESS_KEY_ID',
    // awsSecretAccessKey: 'AWS_SECRET_ACCESS_KEY',
    // awsBucket: 'AWS_BUCKET',
    // awsRegion: 'AWS_REGION',
    // awsFolder: 'AWS_FOLDER',
  })
  .then((resultPrepare) => {
    console.log('Prepare result: ', resultPrepare);

    core
      .render({
        builtDirPath: resultPrepare.outDir,
        lang: 'pt-BR',
        template: 'user:welcome',
        props: {
          name: 'Theryston',
          createdAt: Date(),
        },
      })
      .then((resultRender) => {
        fs.writeFileSync('./example-vd.html', resultRender.code);
        console.log(
          'The render result of welcome is into the file: ./example-vd.html',
        );

        core
          .cleanCache()
          .then(() => {
            console.log('Cache cleaned');
          })
          .catch((error) => {
            console.log(error);
          });
      })
      .catch((error) => {
        console.log(error);
      });
  })
  .catch((error) => {
    console.log(error);
  });
