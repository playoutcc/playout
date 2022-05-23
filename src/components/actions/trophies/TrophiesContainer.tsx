import { Button, HStack, Text, useBoolean, VStack } from '@chakra-ui/react';
import { FC } from 'react';
import { AiFillPlusCircle } from 'react-icons/ai';
import { User } from 'shared';
import { ModalTrophy, TrophiesCard } from './';

type Props = {
	isSelf: boolean;
	prof: User;
};

const TrophiesContainer: FC<Props> = ({ isSelf, prof }) => {
	const [isOpenTrophy, { toggle: setOpenTrophy }] = useBoolean(false);
	return (
		<>
			<VStack padding="0.5rem 0" spacing={1} align="flex-start" w="100%">
				<HStack
					align="center"
					justify="flex-start"
					w="100%"
					wrap="wrap"
					gap={4}
					spacing={6}
				>
					<Text py={4} fontSize="2xl">
						Troféus
					</Text>
					{isSelf && (
						<Button
							display="flex"
							alignItems="center"
							justifyContent="center"
							size="sm"
							gap={2}
							className="action_button"
							css={{ gap: '0.5rem' }}
							w="fit-content"
							color="black"
							onClick={setOpenTrophy}
							backgroundColor="primary.main"
							leftIcon={<AiFillPlusCircle />}
							_hover={{ backgroundColor: 'primary.hover' }}
							_active={{ backgroundColor: 'primary.hover' }}
							_focus={{ backgroundColor: 'primary.hover' }}
						>
							<Text mt={1} as="span">
								Adicionar
							</Text>
						</Button>
					)}
				</HStack>
				{(!prof?.trophies || prof?.trophies.length == 0) && (
					<Text fontSize="sm" color="gray.500">
						Não possui troféus
					</Text>
				)}
				{prof?.trophies && (
					<HStack
						align="center"
						justify="flex-start"
						w="100%"
						wrap="wrap"
						gap={4}
						spacing={6}
					>
						{prof?.trophies.map((trophy) => {
							return (
								<TrophiesCard
									isSelf={isSelf}
									key={trophy.championshipName + trophy.year + trophy.id}
									trophy={trophy}
								/>
							);
						})}
					</HStack>
				)}
			</VStack>
			<ModalTrophy isOpen={isOpenTrophy} onClose={setOpenTrophy} />
		</>
	);
};

export default TrophiesContainer;
