import { ChakraProps, VStack } from '@chakra-ui/react';
import { FC, PropsWithChildren } from 'react';

type Props = {
	css?: ChakraProps['css'];
};

export const Main: FC<PropsWithChildren<Props>> = ({ children, css }) => {
	return (
		<VStack css={css} padding="2rem 0.3rem" maxH="fit-content" as="main">
			{children}
		</VStack>
	);
};
