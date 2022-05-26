import { ChakraProps, HStack } from '@chakra-ui/react';
import { FC, PropsWithChildren } from 'react';

type Props = {
	css?: ChakraProps['css'];
	className?: string;
};

const Header: FC<PropsWithChildren<Props>> = ({ children, css, className }) => {
	return (
		<HStack
			position="sticky"
			top="0"
			justify="center"
			backgroundColor="gray.800"
			as="header"
			w="100%"
			zIndex={1000}
		>
			<HStack
				id="header"
				className={`${className}`}
				justify="end"
				padding="1rem 0.8rem"
				zIndex={1000}
				css={css}
				gap={5}
				w="100%"
				maxW="1380px"
			>
				{children}
			</HStack>
		</HStack>
	);
};

export default Header;
