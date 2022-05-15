import { ChakraProvider, cookieStorageManager } from '@chakra-ui/react';
import { UserProvider } from 'contexts';
import type { AppProps } from 'next/app';
import Head from 'next/head';
import { theme } from 'shared';
import 'styles/global.scss';

function MyApp({ Component, pageProps }: AppProps) {
	return (
		<ChakraProvider
			colorModeManager={cookieStorageManager('@DATA-THEME')}
			resetCSS
			theme={theme}
		>
			<Head>
				<title>Playout</title>
			</Head>
			<UserProvider>
				<Component {...pageProps} />
			</UserProvider>
		</ChakraProvider>
	);
}

export default MyApp;
