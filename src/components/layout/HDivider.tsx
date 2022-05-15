import { Divider, HStack, Text } from '@chakra-ui/react';
import { FC } from 'react';

type Props = {
	text: string;
};

export const HDivider: FC<Props> = ({ text }) => {
	return (
		<HStack w="100%" spacing={6}>
			<Divider />
			<Text as="small" w="21rem" padding="0 8px">
				{text}
			</Text>
			<Divider />
		</HStack>
	);
};
