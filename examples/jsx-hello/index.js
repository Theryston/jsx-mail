const jsxMail = require("jsx-mail");
const nodemailer = require("nodemailer");
require("dotenv").config();

const transport = nodemailer.createTransport({
  service: process.env.EMAIL_SENDER_SERVICE,
  auth: {
    user: process.env.EMAIL_SENDER_USERNAME,
    pass: process.env.EMAIL_SENDER_PASSWORD,
  },
});

(async () => {
  const html = await jsxMail.render("Welcome", {
    name: "Jonh Doe",
  });

  const sentEmail = await transport.sendMail({
    from: process.env.EMAIL_SENDER_USERNAME,
    to: process.env.EMAIL_RECEIVER,
    subject: "Welcome To Jsx Mail",
    html,
  });

  console.log(`Email sent: ${sentEmail.messageId}`);
})();
