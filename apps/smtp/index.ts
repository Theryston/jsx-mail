import { SMTPServer } from 'smtp-server';
import type { SMTPServerAuthentication, SMTPServerSession } from 'smtp-server';
import { simpleParser } from 'mailparser';

const server = new SMTPServer({
  secure: false,
  disabledCommands: ['STARTTLS'],
  onAuth: (
    auth: SMTPServerAuthentication,
    session: SMTPServerSession,
    callback: (err: Error | null, response?: { user: string }) => void,
  ) => {
    // TODO: Implement authentication
    callback(null, { user: auth.username || 'anonymous' });
  },
  onData: async (stream, session, callback) => {
    const parsed = await simpleParser(stream);
    // TODO: Implement email sending by API

    console.log('New email received:');
    console.log(parsed);
    console.log('----------------------------------------');
    callback();
  },
  logger: true,
});

server.listen(Number(process.env.PORT), '0.0.0.0', () => {
  console.log(`SMTP Server running on port ${process.env.PORT}`);
});

server.on('error', (err) => {
  console.error('SMTP Server error:', err);
});
