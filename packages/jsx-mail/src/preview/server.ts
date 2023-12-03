import core from '@jsx-mail/core';
import express, { Request, Response } from 'express';
import http from 'http';
import path from 'path';
import { Server } from 'socket.io';
import { getMailAppPath } from '../utils/get-mail-app-path';
import { prepare } from '../prepare';
import { render } from '..';
import load from '../utils/load';
import showCoreError from '../utils/show-core-error';

const app = express();
const server = http.createServer(app);
const io = new Server(server);
let currentTemplate: string | null = null;

app.use(express.static(path.join(__dirname, 'client')));

app.get('/', (req: Request, res: Response) => {
  res.sendFile('index.html', { root: path.join(__dirname, 'client') });
});

io.on('connection', (socket) => {
  socket.on('template', async (template?: string) => {
    const templates = await getAllTemplates();

    const newTemplate = template || templates[0] || '';

    currentTemplate = newTemplate;

    await emitAllTemplates();
  });
});

async function getAllTemplates(): Promise<string[]> {
  const mailAppPath = getMailAppPath();
  const templates = await core.getAllTemplates(mailAppPath);
  const templatesNames = templates.map((template) => {
    const templateRelativePath = path.relative(
      path.resolve(mailAppPath, 'templates'),
      template.path,
    );
    const templateName = templateRelativePath
      .replace(/[/\\]/g, ':')
      .replace(/\.[jt]sx?$/, '');
    return templateName;
  });

  return templatesNames;
}

async function emitAllTemplates() {
  const templates = await getAllTemplates();

  if (!templates.includes(currentTemplate || '')) {
    currentTemplate = templates[0] || null;
  }

  io.emit('templates', {
    templates,
    currentTemplate,
  });

  await emitCode();
}

async function emitCode() {
  try {
    await prepare();

    load.start(`Refreshing template ${currentTemplate}...`);

    const code = await render(currentTemplate || '', {}, true);
    io.emit('code', { code });

    load.succeed(`Template ${currentTemplate} refreshed`);
  } catch (error) {
    load.fail(`Template refresh failed`);
    showCoreError(error);
  }
}

export async function serverFileChanged(): Promise<void> {
  if (!currentTemplate || io.sockets.sockets.size === 0) {
    return;
  }

  await emitAllTemplates();
}

export async function startServer(): Promise<void> {
  await new Promise<void>((resolve, reject) => {
    server
      .listen(3256, () => {
        resolve();
      })
      .on('error', reject);
  });
}

export async function stopServer(): Promise<void> {
  const disconnectPromises = Array.from(io.sockets.sockets.values()).map(
    (socket) =>
      new Promise<void>((resolve) => {
        socket.on('disconnect', () => resolve());
        socket.disconnect(true);
      }),
  );

  await Promise.all(disconnectPromises);

  return new Promise((resolve, reject) => {
    server.close((err) => {
      if (err) {
        reject(err);
      }
      resolve();
    });
  });
}
