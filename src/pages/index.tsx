import { Box, HStack } from '@chakra-ui/react';
import { Footer, Main } from 'components/layout';
import { Description, Sign } from 'components/pages/home';
import { removeCookies } from 'cookies-next';
import { NextPage } from 'next';
import Head from 'next/head';
import { destroyCookie, parseCookies } from 'nookies';
import { Fragment } from 'react';

const Home: NextPage = () => {
	return (
		<Fragment>
			<Head>
				<title>Playout | entre ou cadastre-se</title>
			</Head>
			<Box backgroundColor="transparent" padding="2rem 0.3rem"></Box>
			<Main>
				<HStack
					css={{ gap: '4rem' }}
					w="100%"
					wrap="wrap-reverse"
					justify="center"
					align="center"
					flex={1}
				>
					<Description />
					<Sign />
				</HStack>
			</Main>
			<Footer />
		</Fragment>
	);
};

Home.getInitialProps = async (ctx) => {
	const { req, res } = ctx;
	const { nextauth } = parseCookies(ctx);
	if (nextauth) {
		try {
			res?.writeHead(302, {
				Location: '/feed',
			});
			res?.end();
		} catch (err) {}
	} else {
		removeCookies('nextauth', { req, res });
		destroyCookie(ctx, 'nextauth');
	}
	return {};
};

export default Home;
