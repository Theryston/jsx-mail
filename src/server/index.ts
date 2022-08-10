import express from 'express';
import { cliCommands } from '../cli';
import { Core } from '../core';
import { engine } from 'express-handlebars';

const app = express();
let server: any;

export async function start(path: string, port: number) {
  app.engine('handlebars', engine());
  app.set('view engine', 'handlebars');
  app.set('views', `${__dirname}/views`);

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

  server = app.listen(port);
}

export async function stop() {
  server.close();
}
