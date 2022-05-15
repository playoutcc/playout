import axios from 'axios';
import { NextApiRequest, NextApiResponse } from 'next';
import { decodeBody, encodeBody, middleware } from 'shared';

type HeaderProps = {
	authorization: string;
	path: string;
};

export default async function handler(
	req: NextApiRequest,
	res: NextApiResponse
) {
	const { path } = req.headers as HeaderProps;
	const method = (req.method?.toLowerCase() || 'get') as unknown as
		| 'get'
		| 'post'
		| 'put'
		| 'delete';
	if (!path) return res.status(404).end();
	try {
		middleware(req, res);
		console.info(
			(process.env.BACKEND_URL || 'http://localhost:8080') + '/v1/api' + path
		);
		const response = await axios[method](
			(process.env.BACKEND_URL || 'http://localhost:8080') + '/v1/api' + path,
			!req.body ? {} : decodeBody(req.body),
			{
				headers: {
					'Content-Type': 'application/json',
				},
			}
		);
		console.info(response);
		return res.status(response.status).json(encodeBody({ ...response.data }));
	} catch (err) {
		console.error(err);
		return res
			.status((err as any).response?.status || 500)
			.json({ ...(err as any).response?.data });
	}
}
