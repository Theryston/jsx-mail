/* eslint-disable turbo/no-undeclared-env-vars */
import type { NextApiRequest, NextApiResponse } from 'next';
import { createRouter } from 'next-connect';
import error from '../../../utils/error';
import { connectToDatabase } from '@/config/mongodb';
import * as jwt from 'jsonwebtoken';
import sendEmail from '../../../use-cases/sendEmail';

const router = createRouter<NextApiRequest, NextApiResponse>();

async function postHandler(req: NextApiRequest, res: NextApiResponse) {
  const { username } = req.body;

  if (!username) {
    return res.status(400).json({
      message: 'Username invalid',
    });
  }

  const { db } = await connectToDatabase();

  const mail = await db.collection('mails').findOne({
    username,
  });

  if (!mail) {
    return res.status(400).json({
      code: 'NOT_EXISTS',
    });
  }

  const token = jwt.sign(
    { _id: mail._id },
    process.env.JWT_SECRET || 'secret',
    {
      expiresIn: '200y',
    },
  );

  await sendEmail({
    from: 'auth@jsxmail.org',
    html: `<p>Your token:</p> <p>${token}</p> <p>We recommend that you copy the token above, store it in a safe location and then delete this email so that no one can access your token.</p>`,
    subject: `Here's your token`,
    to: [mail.email],
  });

  const hideEmail = mail.email.replace(/(?<=.).(?=.*@)/g, '*');

  return res.status(200).json({
    code: 'SENT',
    sentTo: hideEmail,
  });
}

router.post(postHandler);

export default router.handler(error);
