import { GluegunToolbox } from 'gluegun';
import load from '../../utils/load';
import render from '../../render';
import showCoreError from '../../utils/show-core-error';
import { prepare } from '../../prepare';
import core from '@jsx-mail/core';
import { getJsxMailConfig } from '../../utils/get-config';
import fs from 'fs';
import os from 'os';
import archiver from 'archiver';
import path from 'path';

module.exports = {
  command: 'zip',
  alias: ['z'],
  description: 'Render and zip the template and assets',
  run: async (toolbox: GluegunToolbox) => {
    const { parameters } = toolbox;
    const templateName = parameters.first;
    const outPath = parameters.options['out'];
    const props = parameters.options;

    if (!templateName) {
      load.fail('Template name is required');
      return;
    }

    if (!outPath) {
      load.fail('Output path is required');
      return;
    }

    if (!outPath.endsWith('.zip')) {
      load.fail('Output path must be a zip file');
      return;
    }

    load.start('Rendering');
    try {
      await core.cleanCache();

      const config = getJsxMailConfig();

      await prepare(false, {
        ...config,
        storage: 'LOCAL',
        baseImagePath: './assets',
      });

      const html = await render(templateName, props);

      if (!html) {
        load.fail('No result');
        return;
      }

      const tempPath = fs.mkdtempSync(os.tmpdir() + '/jsx-mail-');
      const assetsPath = path.join(tempPath, 'assets');
      await fs.promises.mkdir(assetsPath, { recursive: true });

      await fs.promises.writeFile(`${tempPath}/index.html`, html);

      const allImages = core.getImagesFolder();

      for (const image of allImages) {
        const src = path.join(
          core.getBaseCorePath(),
          'optimized-images',
          image,
        );
        const dest = path.join(assetsPath, image);
        await fs.promises.copyFile(src, dest);
      }

      const outputZip = fs.createWriteStream(outPath);
      const archive = archiver('zip', {
        zlib: { level: 9 },
      });

      outputZip.on('close', () => {
        load.succeed(`Template saved at ${outPath}`);
      });

      archive.pipe(outputZip);
      archive.directory(tempPath, false);
      await archive.finalize();
      outputZip.close();
    } catch (error) {
      load.stop();
      showCoreError(error);
      return;
    }
  },
};
