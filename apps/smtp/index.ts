import { SMTPServer } from 'smtp-server';
import type { SMTPServerAuthentication, SMTPServerSession } from 'smtp-server';
import { simpleParser } from 'mailparser';
import axios from 'axios';

const apiClient = axios.create({
  baseURL: process.env.API_BASE_URL,
});

const server = new SMTPServer({
  secure: false,
  disabledCommands: ['STARTTLS'],
  onAuth: async (
    auth: SMTPServerAuthentication,
    _session: SMTPServerSession,
    callback: (err: Error | null, response?: { user: string }) => void,
  ) => {
    if (!auth.username) {
      callback(new Error('Username is required'));
      return;
    }

    if (!auth.password) {
      callback(new Error('Password is required'));
      return;
    }

    if (auth.username !== 'jsxmail') {
      callback(new Error('Invalid username'));
      return;
    }
    try {
      await apiClient.get('/user/me', {
        headers: {
          Authorization: `Bearer ${auth.password}`,
        },
      });

      callback(null, { user: auth.password });
    } catch (error) {
      callback(
        new Error('Invalid credentials. Set the password as your API key.'),
      );
      return;
    }
  },
  onData: async (stream, session, callback) => {
    const apiKey = session.user;

    if (!apiKey) {
      callback(
        new Error('Invalid credentials. Set the password as your API key.'),
      );
      return;
    }

    if (typeof apiKey !== 'string') {
      callback(
        new Error('Invalid credentials. Set the password as your API key.'),
      );
      return;
    }

    const parsed = await simpleParser(stream);

    const toTexts = Array.isArray(parsed.to)
      ? parsed.to.map((to) => to.text)
      : [parsed.to?.text];

    const to = toTexts.flatMap((toText) => {
      if (!toText) {
        return [];
      }

      return toText.split(', ');
    });

    const sender = parsed.from?.value[0]?.address;
    const subject = parsed.subject;
    const html = parsed.html || parsed.text;
    const attachments =
      parsed.attachments?.map((attachment) => ({
        fileName: attachment.filename,
        content: attachment.content.toString('base64'),
      })) || [];

    try {
      await apiClient.post(
        '/sender/send',
        {
          to,
          sender,
          subject,
          html,
          attachments,
        },
        {
          headers: {
            Authorization: `Bearer ${apiKey}`,
          },
        },
      );

      console.log(`Email sent from ${sender} to ${to}`);

      callback(null);
    } catch (error: any) {
      const errorData = error.response?.data?.message || error.message;
      callback(new Error(errorData));
    }
  },
});

server.listen(Number(process.env.PORT), '0.0.0.0', () => {
  console.log(`SMTP Server running on port ${process.env.PORT}`);
});

server.on('error', (err) => {
  console.error('SMTP Server error:', err);
});
