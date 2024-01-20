import { render } from 'jsx-mail'
import type { NextApiRequest, NextApiResponse } from 'next'

type ResponseData = {
  message: string
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ResponseData>
) {
  const html = await render('welcome')

  res.status(200).json({
    message: `The template welcome was rendered! Look tht html: ${html}`
  })
}