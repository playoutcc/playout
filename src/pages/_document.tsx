import NextDocument, { Head, Html, Main, NextScript } from 'next/document';
import { theme } from 'shared';

export default class Document extends NextDocument {
	render() {
		return (
			<Html lang="pt-BR">
				<Head>
					<meta name="theme-color" content={theme.colors.primary.main} />
					<link
						rel="apple-touch-icon"
						sizes="180x180"
						href="/browser/apple-touch-icon.png"
					/>
					<link
						rel="icon"
						type="image/png"
						sizes="32x32"
						href="/browser/favicon-32x32.png"
					/>
					<link
						rel="icon"
						type="image/png"
						sizes="194x194"
						href="/browser/favicon-194x194.png"
					/>
					<link
						rel="icon"
						type="image/png"
						sizes="192x192"
						href="/browser/android-chrome-192x192.png"
					/>
					<link
						rel="icon"
						type="image/png"
						sizes="16x16"
						href="/browser/favicon-16x16.png"
					/>
					<link rel="manifest" href="/site.webmanifest" />
					<link
						rel="mask-icon"
						href="/browser/safari-pinned-tab.svg"
						color="#000000"
					/>
					<link rel="shortcut icon" href="/browser/favicon.ico" />
					<meta name="msapplication-TileColor" content="#000000" />
					<meta
						name="msapplication-TileImage"
						content="/browser/mstile-144x144.png"
					/>
					<meta name="msapplication-config" content="/browserconfig.xml" />
				</Head>
				<body>
					<Main />
					<NextScript />
				</body>
			</Html>
		);
	}
}
