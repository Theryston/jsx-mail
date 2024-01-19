/* eslint-disable turbo/no-undeclared-env-vars */
import type { NextApiRequest, NextApiResponse } from 'next';
import { createRouter } from 'next-connect';
import error from '../../../utils/error';
import * as jwt from 'jsonwebtoken';
import { connectToDatabase } from '../../../config/mongodb';
import sendEmail from '../../../use-cases/sendEmail';
import { ObjectId } from 'mongodb';

const router = createRouter<NextApiRequest, NextApiResponse>();

const MAX_SENDS_PER_HOUR = 20;

async function postHandler(req: NextApiRequest, res: NextApiResponse) {
  try {
    const auth = req.headers['authorization'];

    if (!auth) {
      return res.status(403).json({
        message: 'Auth not found',
      });
    }

    const token = auth.split(' ')[1];

    if (!token) {
      return res.status(403).json({
        message: 'Token not found',
      });
    }

    let _id = '';

    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET || 'secret');
      _id = (decoded as any)._id;
    } catch (error) {
      return res.status(403).json({
        message: 'Invalid token',
      });
    }

    const { subject, html, to } = req.body;

    if (!subject) {
      return res.status(400).json({
        message: 'Invalid subject',
      });
    }

    if (!html) {
      return res.status(400).json({
        message: 'Invalid html',
      });
    }

    if (!to || !Array.isArray(to)) {
      return res.status(400).json({
        message: 'Invalid to',
      });
    }

    const { db } = await connectToDatabase();

    const mail = await db.collection('mails').findOne({
      _id: new ObjectId(_id),
    });

    if (!mail) {
      return res.status(400).json({
        code: 'NOT_EXISTS',
      });
    }

    const startOfHour = new Date();
    startOfHour.setSeconds(0, 0);
    startOfHour.setMinutes(0, 0);
    startOfHour.setMilliseconds(0);

    const count = await db.collection('sent_messages').countDocuments({
      mail_id: mail._id,
      created_at: { $gte: startOfHour },
    });

    if (count >= MAX_SENDS_PER_HOUR) {
      const nextHour = new Date();
      nextHour.setHours(nextHour.getHours() + 1);
      nextHour.setSeconds(0, 0);
      nextHour.setMinutes(0, 0);
      nextHour.setMilliseconds(0);

      return res.status(429).json({
        message: `The limit of ${MAX_SENDS_PER_HOUR} has been reached. Try again at: ${nextHour}`,
      });
    }

    await sendEmail({
      from: mail.mail,
      html,
      subject,
      to,
    });

    await db.collection('sent_messages').insertOne({
      mail_id: mail._id,
      subject,
      to,
      created_at: new Date(),
    });

    return res.status(200).json({
      message: 'SENT',
    });
  } catch (error: any) {
    return res.status(500).json({
      message: error.message || 'Error while sending the email',
    });
  }
}

router.post(postHandler);

export default router.handler(error);
