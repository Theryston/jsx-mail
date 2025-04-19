import { createTransport } from 'nodemailer';

const PORT = Number(process.argv[2]);
const HOST = process.argv[3];

const user = process.argv[4];
const pass = process.argv[5];
const to = process.argv[6];

console.log(JSON.stringify({ PORT, HOST, user, pass, to }, null, 2));

const transporter = createTransport({
  host: HOST,
  port: PORT,
  auth: {
    user,
    pass,
  },
});

transporter
  .sendMail({
    from: 'cloud@jsxmail.org',
    to,
    subject: 'Test JSX Mail SMTP',
    html: '<p>Hello</p>',
    attachments: [
      {
        filename: 'test.txt',
        content: 'Hello',
      },
    ],
  })
  .then((res) => {
    console.log(res);
  })
  .catch((error) => console.log(error));
