import { ChakraProps, StackDivider, VStack } from '@chakra-ui/react';
import { FC, PropsWithChildren } from 'react';

type Props = {
	css?: ChakraProps['css'];
	divider?: boolean;
};

const Main: FC<PropsWithChildren<Props>> = ({
	children,
	css,
	divider = false,
}) => {
	return (
		<VStack w="100%" as="main">
			<VStack
				maxW="1380px"
				w="100%"
				divider={divider ? <StackDivider /> : <></>}
				css={css}
				padding="2rem 0.8rem"
				maxH="fit-content"
			>
				{children}
			</VStack>
		</VStack>
	);
};

export default Main;
