import { ChakraProps, HStack } from '@chakra-ui/react';
import { FC, PropsWithChildren } from 'react';

type Props = {
	css?: ChakraProps['css'];
	className?: string;
};

export const Header: FC<PropsWithChildren<Props>> = ({
	children,
	css,
	className,
}) => {
	return (
		<HStack
			id="header"
			position="sticky"
			top="0"
			className={`${className}`}
			justify="end"
			padding="2rem 0.3rem"
			backgroundColor="black"
			zIndex={1000}
			css={css}
			gap={5}
			as="header"
		>
			{children}
		</HStack>
	);
};
