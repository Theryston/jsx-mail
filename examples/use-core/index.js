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
      })
      .catch((error) => {
        console.log(error);
      });
  })
  .catch((error) => {
    console.log(error);
  });
