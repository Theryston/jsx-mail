/* eslint-disable turbo/no-undeclared-env-vars */
import type { NextApiRequest, NextApiResponse } from 'next';
import { createRouter } from 'next-connect';
import error from '../../../utils/error';
import { connectToDatabase } from '../../../config/mongodb';
import { CommunicationServiceManagementClient } from '@azure/arm-communication';
import azureCredential from '@/config/azure-credential';

const router = createRouter<NextApiRequest, NextApiResponse>();

async function postHandler(req: NextApiRequest, res: NextApiResponse) {
  try {
    const { username: receivedUsername, email: receivedEmail, name } = req.body;

    if (!receivedUsername) {
      return res.status(400).json({ message: 'Invalid username' });
    }

    const username = receivedUsername.trim().toLocaleLowerCase();

    if (!receivedEmail) {
      return res.status(400).json({ message: 'Invalid email' });
    }

    if (!name) {
      return res.status(400).json({ message: 'Invalid name' });
    }

    const email = receivedEmail.trim().toLocaleLowerCase();

    const { db } = await connectToDatabase();

    const mailExists = await db.collection('mails').findOne({
      username,
    });

    if (mailExists) {
      return res.status(200).json({
        code: 'EXISTS',
        username: mailExists.username,
        mail: mailExists.mail,
      });
    }

    const mgmtClient = new CommunicationServiceManagementClient(
      azureCredential,
      process.env.AZURE_SUBSCRIPTION_ID as string,
    );

    const parameters = {
      username,
      displayName: name,
    };

    await mgmtClient.senderUsernames.createOrUpdate(
      process.env.AZURE_RESOURCE_GROUP_NAME as string,
      process.env.AZURE_EMAIL_SERVICE_NAME as string,
      process.env.AZURE_DOMAIN_NAME as string,
      parameters.username,
      parameters,
    );

    const mail = `${username}@${process.env.AZURE_DOMAIN_NAME}`;

    await db.collection('mails').insertOne({
      username,
      email,
      mail,
      name,
      created_at: new Date(),
    });

    return res.status(201).json({
      code: 'CREATED',
      username,
      mail,
      name,
    });
  } catch (error: any) {
    return res.status(500).json({
      message: error.message || 'Error while creating mail',
    });
  }
}

router.post(postHandler);

export default router.handler(error);
