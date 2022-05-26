import { UserEditor } from 'components/actions/user';
import { Dashboard } from 'components/pages/feed';
import { removeCookies } from 'cookies-next';
import { NextPage } from 'next';
import Head from 'next/head';
import { destroyCookie, parseCookies } from 'nookies';
import { Fragment } from 'react';
import {
	api,
	decodeBody,
	decodeKeyAuthorization,
	encodeBody,
	Games,
	PostsPage,
	User,
} from 'shared';

type Props = {
	data: string;
	games: string;
	posts: string;
};

export const takeDefaultPosts = 20;

const Feed: NextPage<Props> = ({ data, games, posts }) => {
	const user: User = decodeBody(data);
	const gamesData: Games[] = decodeBody(games);
	const postsData: PostsPage = decodeBody(posts);
	return (
		<Fragment>
			<Head>
				<title>Playout | Feed</title>
			</Head>
			{!user.username && (
				<UserEditor games={gamesData} fullName={user.fullName} />
			)}
			{user.username && <Dashboard posts={postsData} data={user} />}
		</Fragment>
	);
};

Feed.getInitialProps = async (ctx): Promise<any> => {
	const { req, res } = ctx;
	const { nextauth } = parseCookies(ctx);
	try {
		if (!nextauth) throw new Error('Token inválido');
		await api(
			`/auth/login?token=${encodeURI(decodeKeyAuthorization(nextauth))}`
		).post('');
		const { data } = await api(
			`/users?token=${encodeURI(
				decodeKeyAuthorization(nextauth)
			)}&need_suggest=1`
		).get('');
		const responseGames = await api('/games').get('');
		const responsePosts = await api(
			`/posts/${decodeBody(data).id}?take=${takeDefaultPosts}`
		).get('');
		return {
			data: data,
			games: encodeBody(Object.values(decodeBody(responseGames.data))),
			posts: responsePosts.data,
		};
	} catch (err) {
		removeCookies('nextauth', { req, res });
		destroyCookie(ctx, 'nextauth');
		res?.writeHead(302, {
			Location: '/',
		});
		res?.end();
	}
};

export default Feed;
