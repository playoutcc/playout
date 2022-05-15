import { Text, useConst, VStack } from '@chakra-ui/react';
import { FC, PropsWithChildren } from 'react';

export const Footer: FC<PropsWithChildren<{}>> = ({ children }) => {
	const nowDate = useConst(new Date().getFullYear());
	return (
		<VStack padding="2rem 0.3rem" as="footer">
			{children}
			<Text fontSize="sm" color="primary.main">
				PlayOut © {nowDate}
			</Text>
		</VStack>
	);
};
