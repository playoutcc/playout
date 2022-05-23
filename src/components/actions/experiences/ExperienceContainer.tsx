import { Button, HStack, Text, useBoolean, VStack } from '@chakra-ui/react';
import { FC } from 'react';
import { AiFillPlusCircle } from 'react-icons/ai';
import { Games, User } from 'shared';
import { ExperienceCard, ModalExperience } from './';

type Props = {
	gamesData: Games[];
	isSelf: boolean;
	prof: User;
};

const ExperienceContainer: FC<Props> = ({ gamesData, isSelf, prof }) => {
	const [isOpenExperience, { toggle: setOpenExperience }] = useBoolean(false);
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
						Experiências profissionais
					</Text>
					{isSelf && (
						<Button
							display="flex"
							alignItems="center"
							justifyContent="center"
							size="sm"
							gap={2}
							css={{ gap: '0.5rem' }}
							w="fit-content"
							color="black"
							onClick={setOpenExperience}
							backgroundColor="primary.main"
							className="action_button"
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
				{(!prof?.experiences || prof?.experiences.length == 0) && (
					<Text fontSize="sm" color="gray.500">
						Não possui experiências profissionais
					</Text>
				)}
				{prof?.experiences && (
					<HStack
						align="flex-start"
						justify="flex-start"
						w="100%"
						wrap="wrap"
						gap={4}
						spacing={6}
					>
						{prof?.experiences.map((experience) => {
							return (
								<ExperienceCard
									isSelf={isSelf}
									games={gamesData}
									key={experience.jobTitle + experience.company + experience.id}
									experience={experience}
								/>
							);
						})}
					</HStack>
				)}
			</VStack>
			<ModalExperience
				games={gamesData}
				isOpen={isOpenExperience}
				onClose={setOpenExperience}
			/>
		</>
	);
};

export default ExperienceContainer;
