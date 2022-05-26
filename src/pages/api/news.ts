const NewsAPI = require('newsapi');
import { Cache } from 'memory-cache';
import { NextApiRequest, NextApiResponse } from 'next';
import { middleware, News } from 'shared';

const cache = new Cache();

export default async function handlerNews(
	req: NextApiRequest,
	res: NextApiResponse
) {
	try {
		let response: News[] = [];
		const games = (req.query.games as string).split(',');
		if (games[0] === '') return res.status(200).json([]);
		if (req.method !== 'GET') throw new Error('Method not allowed');
		middleware(req, res);
		games.forEach((game) => {
			if (cache.get(game)) {
				console.info(`O ${game} estava em cache`);
				response.push(cache.get(game) as any);
				games.splice(games.indexOf(game), 1);
			}
		});
		const newsapi = new NewsAPI(process.env.API_KEY_NEWS);
		const responses = await Promise.all(
			games.map(
				async (game) =>
					await newsapi.v2.everything({
						q: game,
						language: 'pt',
						sortBy: 'relevancy',
						page: 1,
						pageSize: 5,
					})
			)
		);
		let responseCache: { [key: string]: News[] } = {};
		responses.forEach(({ articles }, index) => {
			responseCache[games[index]] = articles;
			articles.forEach((article: any) => response.push(article));
		});
		Object.entries(responseCache).forEach(([key, articles]) => {
			cache.put(key, articles, Number(4.32e7));
		});
		return res.status(200).json(response);
	} catch (err) {
		return res
			.status((err as any).response?.status || 500)
			.json({ ...(err as any).response?.data });
	}
}
