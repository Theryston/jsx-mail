import type { NextApiRequest, NextApiResponse } from "next";
import { createRouter } from "next-connect";
import error from "../../utils/error";

const router = createRouter<NextApiRequest, NextApiResponse>();

function getHandler(req: NextApiRequest, res: NextApiResponse) {
  res.json({ message: 'Welcome to JSX Mail v2.x API' });
}

router.get(getHandler);

export default router.handler(error);