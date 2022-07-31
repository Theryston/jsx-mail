import express from 'express';
import { cliCommands } from '../cli';
import { Core } from '../core';

const app = express();

export async function server(path: string, port: number) {
  const core = new Core(path, `dist`);
  await cliCommands.build();

  app.get('/:templateName', async (req, res) => {
    const templateName = req.params.templateName;

    if (templateName.indexOf('.') !== -1) {
      return res.status(400).send('Missing extension');
    }

    const variables = req.query;

    try {
      const htmlCode = await core.render(templateName, variables);
      res.send(htmlCode);
    } catch (error) {
      res.status(500).send(error.message);
    }
  });

  app.listen(port, () => {
    console.log(`Server listening on port ${port}`);
  });
}
