import { ChakraProps, StackDivider, VStack } from '@chakra-ui/react';
import { FC, PropsWithChildren } from 'react';

type Props = {
	css?: ChakraProps['css'];
	divider?: boolean;
};

export const Main: FC<PropsWithChildren<Props>> = ({
	children,
	css,
	divider = false,
}) => {
	return (
		<VStack
			divider={divider ? <StackDivider /> : <></>}
			css={css}
			padding="2rem 0.3rem"
			maxH="fit-content"
			as="main"
		>
			{children}
		</VStack>
	);
};
