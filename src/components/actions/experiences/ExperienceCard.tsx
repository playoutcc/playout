import {
	AlertDialog,
	AlertDialogBody,
	AlertDialogContent,
	AlertDialogFooter,
	AlertDialogHeader,
	AlertDialogOverlay,
	Avatar,
	Box,
	Button,
	HStack,
	Menu,
	MenuButton,
	MenuItem,
	MenuList,
	PopoverTrigger,
	Text,
	useBoolean,
	useDisclosure,
	useToast,
	VStack,
} from '@chakra-ui/react';
import { FC, useEffect, useRef, useState } from 'react';
import { BiDotsHorizontal } from 'react-icons/bi';
import { api, Experience, Games } from 'shared';
import { ModalExperience } from './';

const Trigger: any = PopoverTrigger;

type Props = {
	experience: Experience;
	games: Games[];
	isSelf: boolean;
};

const ExperienceCard: FC<Props> = ({ experience, games, isSelf }) => {
	const ref = useRef<HTMLDivElement>({} as HTMLDivElement);
	const [showMore, setShowMore] = useState(false);
	const [loading, { toggle: setLoading }] = useBoolean(false);
	const { isOpen, onOpen, onClose } = useDisclosure();
	const toast = useToast();
	const [menu, setMenu] = useState(false);
	const [isOpenExperience, { toggle: setOpenExperience }] = useBoolean(false);
	const cancelRef = useRef<any>();
	const gamesExperiences = games.filter((game) =>
		experience.games.includes(game.name)
	);
	useEffect(() => {
		setMenu(true);
	}, []);
	const deleteExperience = async () => {
		setLoading();
		try {
			await api(`/users/experience/${experience.id}`).delete('');
			window.location.reload();
			toast({
				title: 'Experiência deletada com sucesso',
				status: 'success',
				duration: 2500,
				isClosable: true,
				position: 'top-right',
			});
		} catch (err) {
			toast({
				title: 'Houve um erro',
				description: 'Tente novamente mais tarde',
				status: 'error',
				duration: 2500,
				isClosable: true,
				position: 'top-right',
			});
		}
		setLoading();
	};
	return (
		<HStack
			backgroundColor="gray.800"
			borderRadius="15px"
			p={6}
			w="100%"
			maxW="420px"
			h={showMore ? 'fit-content' : '320px'}
			justify="space-between"
			align="flex-start"
			position="relative"
			ref={ref}
		>
			<VStack
				position="relative"
				flex={1}
				spacing={-2}
				align="flex-start"
				justify="space-between"
				as="section"
				h="100%"
			>
				<HStack w="100%" justify="space-between">
					<VStack spacing={-2} align="flex-start">
						<Text fontSize="2xl" fontWeight="bold">
							{experience.company}
						</Text>
						<Text fontSize="md">{experience.jobTitle}</Text>
						<Text
							alignSelf="flex-start"
							justifySelf="flex-start"
							w="100%"
							py={4}
							fontSize="sm"
						>
							{experience.startDate.split('-').reverse().join('/').substring(3)}{' '}
							-{' '}
							{experience?.endDate
								? experience.endDate.split('-').reverse().join('/').substring(3)
								: 'até o momento'}
						</Text>
					</VStack>
					{menu && isSelf && (
						<Menu>
							<MenuButton style={{ cursor: 'pointer' }} as="div">
								<Button
									aria-label="Opções da experiência"
									backgroundColor="transparent"
								>
									<BiDotsHorizontal cursor="pointer" color="white" size={20} />
								</Button>
							</MenuButton>
							<MenuList cursor="pointer" as="ul">
								<MenuItem as="li" onClick={setOpenExperience}>
									Editar
								</MenuItem>
								<MenuItem as="li" onClick={onOpen}>
									Deletar
								</MenuItem>
							</MenuList>
						</Menu>
					)}
				</HStack>
				<Box flex={1} w="100%">
					<Text padding="0.5rem 0" fontSize="sm">
						{experience.description.length > 119 ? (
							<>
								<span>
									{experience.description.substring(0, showMore ? 1000 : 120)}
								</span>
								{!showMore && '...'}
								<br />
								<span
									style={{
										cursor: 'pointer',
										textDecoration: 'underline',
										color: '#23f0c7',
									}}
									onClick={(e) => setShowMore(!showMore)}
								>
									mostrar {showMore ? 'menos' : 'mais'}
								</span>
							</>
						) : (
							experience.description
						)}
					</Text>
				</Box>
				<VStack
					w="100%"
					justify="flex-start"
					align="flex-start"
					position="relative"
					overflow="hidden"
				>
					{gamesExperiences.length !== 0 && (
						<Text fontSize="xl" fontWeight="bold">
							Jogos que fizeram parte
						</Text>
					)}
					<HStack
						css={{ gap: '0.3rem' }}
						justify="flex-start"
						align="flex-start"
						w="100%"
						maxW={`${ref.current.offsetWidth - 50}px`}
						whiteSpace="nowrap"
						overflowX="auto"
						position="relative"
						overflowY="hidden"
						margin="0 auto"
						py={gamesExperiences.length === 0 ? 0 : 4}
						px={gamesExperiences.length === 0 ? 0 : 2}
					>
						{gamesExperiences.map((game) => {
							return (
								<Box px={2} key={game.name}>
									<Avatar
										_hover={{
											transform: 'scale(1.2)',
											borderColor: 'primary.main',
											borderWidth: '1px',
											borderStroke: 'solid',
										}}
										_active={{ transform: 'scale(1.2)' }}
										title={game.name}
										cursor="pointer"
										src={game.thumbnail}
										name={game.name}
									/>
								</Box>
							);
						})}
					</HStack>
				</VStack>
			</VStack>
			<AlertDialog
				isCentered
				isOpen={isOpen}
				leastDestructiveRef={cancelRef}
				onClose={onClose}
			>
				<AlertDialogOverlay>
					<AlertDialogContent>
						<AlertDialogHeader fontSize="lg" fontWeight="bold">
							Deletar experiência
						</AlertDialogHeader>
						<AlertDialogBody>
							Você tem certeza que deseja excluir sua experiência?
						</AlertDialogBody>
						<AlertDialogFooter>
							<Button ref={cancelRef} onClick={onClose}>
								Cancelar
							</Button>
							<Button
								disabled={loading}
								isDisabled={loading}
								isLoading={loading}
								colorScheme="red"
								onClick={deleteExperience}
								ml={3}
							>
								Deletar
							</Button>
						</AlertDialogFooter>
					</AlertDialogContent>
				</AlertDialogOverlay>
			</AlertDialog>
			<ModalExperience
				isOpen={isOpenExperience}
				onClose={setOpenExperience}
				games={games}
				edit={experience}
			/>
		</HStack>
	);
};

export default ExperienceCard;
