import { createTransport } from 'nodemailer';

const { PORT } = process.env;

const transporter = createTransport({
  host: 'localhost',
  port: Number(PORT),
  auth: {
    user: 'test@test.com',
    pass: 'test',
  },
});

transporter.sendMail({
  from: 'test@test.com',
  to: 'test@test.com',
  subject: 'Test',
  text: 'Hello',
});
