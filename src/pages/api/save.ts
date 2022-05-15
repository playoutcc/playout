import OSS from 'ali-oss';
import { NextApiRequest, NextApiResponse } from 'next';
import { middleware } from 'shared';
import { v4 as uuidv4 } from 'uuid';

type HeaderProps = {
	authorization: string;
	path: string;
};

const client = new OSS({
	bucket: 'playout-storage',
	region: 'oss-us-west-1',
	accessKeyId: process.env.ALIBABA_KEY_ID!,
	accessKeySecret: process.env.ALIBABA_KEY_SECRET!,
});

export default async function handler(
	req: NextApiRequest,
	res: NextApiResponse
) {
	const { file } = req.body;
	if (req.method != 'POST') return res.status(405).end();
	if (!file) return res.status(404).end();
	const [meta, body] = file.split(',');
	const ext = meta.split('/')[1].replace(';base64', '');
	const filepath = `${ext}/${uuidv4()}.${ext}`;
	try {
		middleware(req, res);
		const response = await client.put(filepath, Buffer.from(body, 'base64'));
		return res.status(200).json({ ...response });
	} catch (err) {
		return res
			.status((err as any).response?.status || 500)
			.json({ ...(err as any).response?.data });
	}
}
