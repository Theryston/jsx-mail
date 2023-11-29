import type { NextApiRequest, NextApiResponse } from "next";

export default {
	onError: (error: any, req: NextApiRequest, res: NextApiResponse) => {
		console.error(error)
		res.status(500).end(error.toString());
	},
}