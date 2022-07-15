import express from 'express';
import { Core } from '../core';

const app = express();

export async function server(path: string, port: number) {
  const core = new Core(path, `${path}/dist`);
  await core.build();

  app.get('/:templateName', async (req, res) => {
    const templateName = req.params.templateName;

    if (templateName.indexOf('.') !== -1) {
      console.log(`Ignoring template name ${templateName}`);
      return res.status(400).send('Missing extension');
    }

    const variables = req.query;

    const htmlCode = await core.render(templateName, variables);

    res.send(htmlCode);
  });

  app.listen(port, () => {
    console.log(`Server listening on port ${port}`);
  });
}
