import { Spinner } from '@chakra-ui/react';
import Head from 'next/head';
import { FC, Fragment } from 'react';
import { Footer } from './Footer';
import { Main } from './Main';

export const PageLoading: FC = () => {
	return (
		<Fragment>
			<Head>Playout | Carregando...</Head>
			<Main
				css={{
					flex: 1,
					minHeight: '1000px',
					justifyContent: 'center',
					alignItems: 'center',
				}}
			>
				<Spinner size="md" />
			</Main>
			<Footer />
		</Fragment>
	);
};
