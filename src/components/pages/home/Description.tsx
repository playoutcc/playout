import { Heading, VStack } from '@chakra-ui/react';
import { FC } from 'react';

const Description: FC = () => {
	return (
		<VStack
			align="flex-start"
			minW="200px"
			h="fit-content"
			spacing={2}
			as="section"
		>
			<Heading
				as="h1"
				maxW="240px"
				fontWeight="normal"
				textAlign="left"
				fontSize="xl"
				color="white"
			>
				Venha fazer parte do futuro com a Playout
			</Heading>
			<Heading
				as="h2"
				fontWeight="normal"
				maxW="540px"
				fontSize="md"
				color="white"
			>
				A rede social mais gamer do mundo com as melhores equipes e os melhores
				jogadores
			</Heading>
		</VStack>
	);
};

export default Description;
