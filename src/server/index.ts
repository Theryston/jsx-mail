import express from 'express';
import { cliCommands } from '../cli';
import { Core } from '../core';
import { engine } from 'express-handlebars';

export async function server(path: string, port: number) {
  const app = express();

  app.engine('handlebars', engine());
  app.set('view engine', 'handlebars');
  app.set('views', './views');

  const core = new Core(path, `dist`);
  await cliCommands.build();

  app.get('/', (req, res) => {
    res.render('index');
  });

  app.get('/:templateName', async (req, res) => {
    const templateName = req.params.templateName;

    if (templateName.indexOf('.') !== -1) {
      return res.status(400).send('Missing extension');
    }

    const variables = req.query;

    try {
      const htmlCode = await core.render(templateName, variables);

      res.render('template', {
        htmlCode,
      });
    } catch (error) {
      res.status(500).send(error.message);
    }
  });

  app.listen(port, () => {
    console.log(`Server listening on port ${port}`);
  });
}
