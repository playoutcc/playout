import { NextApiRequest, NextApiResponse } from 'next';
import { SitemapStream, streamToPromise } from 'sitemap';

export default async function handler(
	req: NextApiRequest,
	res: NextApiResponse
) {
	try {
		const smStream = new SitemapStream({
			hostname: `https://${req.headers.host}`,
		});
		const posts: any[] = [];
		posts.forEach((post) => {
			smStream.write({
				url: `/post/${post.slug}`,
				changefreq: 'daily',
				priority: 0.9,
			});
		});
		smStream.end();
		const sitemapOutput = (await streamToPromise(smStream)).toString();
		res.writeHead(200, {
			'Content-Type': 'application/xml',
		});
		res.end(sitemapOutput);
	} catch (e) {
		console.log(e);
		res.send(JSON.stringify(e));
	}
}
