import { extendTheme } from '@chakra-ui/react';

const colors = {
	transparent: 'transparent',
	black: '#0D1317',
	white: '#EDF2EF',
	primary: {
		main: '#23F0C7',
		hover: '#81dfc3',
	},
};

const config = {
	cssVarPrefix: 'playout',
	initialColorMode: 'dark',
};

const fonts = {
	body: '"Nunito", sans-serif',
	heading: '"Nunito", sans-serif',
	mono: '"Nunito", sans-serif',
};

const styles = {
	global: (props: any) => ({
		'html, body': {
			backgroundColor: 'black',
		},
	}),
};

export const theme = extendTheme({ colors, config, fonts, styles });
