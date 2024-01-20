import { send } from 'jsx-mail'
import type { NextApiRequest, NextApiResponse } from 'next'

type ResponseData = {
  message: string
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ResponseData>
) {
  const email = req.query.email as string

  if (!email) {
    res.status(400).json({ message: `The email query param is required` })
  }

  await send('welcome', {
    subject: 'Welcome to NextJS and JSX Mail',
    to: [email]
  })

  res.status(200).json({ message: `And welcome email was sent to: ${email}` })
}