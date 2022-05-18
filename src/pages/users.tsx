import { Button, Spinner, StackDivider, Text, VStack } from '@chakra-ui/react';
import { CardUser } from 'components/actions/user';
import { Footer, Header, Main, Pagination, SearchBar } from 'components/layout';
import { useUser } from 'contexts';
import { removeCookies } from 'cookies-next';
import { NextPage } from 'next';
import Head from 'next/head';
import { destroyCookie, parseCookies } from 'nookies';
import { Fragment, useState } from 'react';
import { BiLogOut } from 'react-icons/bi';
import { api, decodeBody, decodeKeyAuthorization, User } from 'shared';

type ResultPage = {
	users?: User[];
	max: number;
};

type Props = {
	result: string;
	username: string;
};

const takeDefault = 8;

const Users: NextPage<Props> = ({ result, username }) => {
	const { logout } = useUser();
	const [{ users, max }, setData] = useState<ResultPage>(decodeBody(result));
	const [{ take, skip }, setPage] = useState({ take: takeDefault, skip: 0 });
	const nextPage = () => {
		setPage({ take, skip: skip + 1 });
		handleUser(skip + 1);
	};
	const previousPage = () => {
		setPage({ take, skip: skip - 1 });
		handleUser(skip - 1);
	};
	const goToPage = (skip: number) => {
		setPage({ take, skip });
		handleUser(skip);
	};
	const handleUser = (skip: number) => {
		setData({ users: undefined, max });
		api(`/users/pages-users/${username}?take=${take}&skip=${skip}`)
			.get('')
			.then(({ data }) => {
				setData(decodeBody(data));
			});
	};
	return (
		<Fragment>
			<Head>
				<title>Playout | {username}</title>
			</Head>
			<Header>
				<SearchBar />
				<Button
					size="sm"
					w="fit-content"
					color="white"
					backgroundColor="transparent"
					onClick={logout}
					_hover={{ backgroundColor: 'transparent' }}
					_active={{ backgroundColor: 'transparent' }}
					_focus={{ backgroundColor: 'transparent' }}
				>
					<BiLogOut title="Sair da conta" size={20} />
				</Button>
			</Header>
			<Main>
				{!users && <Spinner size="xl" />}
				{users?.length === 0 && <Text>Não há nenhum resultado.</Text>}
				{users?.length !== 0 && (
					<Fragment>
						<VStack divider={<StackDivider />} w="100%" maxW="600px" gap={6}>
							{users?.map((user) => {
								return <CardUser key={user.email} user={user} />;
							})}
						</VStack>
						<Pagination
							goToPage={goToPage}
							nextPage={nextPage}
							previousPage={previousPage}
							active={skip}
							maxPage={max}
						/>
					</Fragment>
				)}
			</Main>
			<Footer />
		</Fragment>
	);
};

Users.getInitialProps = async (ctx) => {
	const { req, res } = ctx;
	const { nextauth } = parseCookies(ctx);
	const username = ctx.query.username as string;
	let result: any = { users: undefined, max: 1 };
	try {
		if (!nextauth) throw new Error('Usuário não autenticado');
		await api(
			`/auth/login?token=${encodeURI(decodeKeyAuthorization(nextauth))}`
		).post('');
		const { data } = await api(
			`/users/pages-users/${username}?take=${takeDefault}`
		).get('');
		result = data;
	} catch (err) {
		removeCookies('nextauth', { req, res });
		destroyCookie(ctx, 'nextauth');
		if (!nextauth) {
			res
				?.writeHead(302, {
					Location: '/',
				})
				.end();
		}
	} finally {
		return {
			result,
			username,
		};
	}
};

export default Users;
