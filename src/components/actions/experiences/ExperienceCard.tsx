import {
	AlertDialog,
	AlertDialogBody,
	AlertDialogContent,
	AlertDialogFooter,
	AlertDialogHeader,
	AlertDialogOverlay,
	Avatar,
	Button,
	HStack,
	Menu,
	MenuButton,
	MenuItem,
	MenuList,
	Popover,
	PopoverBody,
	PopoverCloseButton,
	PopoverContent,
	PopoverHeader,
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
import { ModalExperience } from './ModalExperience';

const Trigger: any = PopoverTrigger;

type Props = {
	experience: Experience;
	games: Games[];
	isSelf: boolean;
};

export const ExperienceCard: FC<Props> = ({ experience, games, isSelf }) => {
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
		<HStack w="100%" justify="space-between" align="flex-start">
			<VStack flex={1} spacing={-2} align="flex-start" as="section">
				<HStack w="100%" justify="space-between">
					<VStack spacing={-2} align="flex-start">
						<Text fontSize="2xl" fontWeight="bold">
							{experience.company}
						</Text>
						<Text fontSize="md">{experience.jobTitle}</Text>
					</VStack>
					{menu && isSelf && (
						<Menu>
							<MenuButton style={{ cursor: 'pointer' }} as="div">
								<Button
									aria-label="Opções da experiência"
									backgroundColor="gray.900"
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
				<Text w="100%" padding="1rem 0" fontSize="sm">
					{experience.startDate.split('-').reverse().join('/').substring(3)} -{' '}
					{experience?.endDate
						? experience.endDate.split('-').reverse().join('/').substring(3)
						: 'até o momento'}
				</Text>
				<Text w="100%" padding="1rem 0" fontSize="sm">
					{experience.description}
				</Text>
				<HStack
					w="100%"
					css={{ gap: '0.8rem' }}
					justify="flex-start"
					align="flex-start"
					overflowX="auto"
					overflowY="hidden"
					position="relative"
					py={gamesExperiences.length === 0 ? 0 : 4}
					px={gamesExperiences.length === 0 ? 0 : 2}
				>
					{gamesExperiences.map((game) => {
						return (
							<Popover key={game.name}>
								<Trigger title={game.name}>
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
								</Trigger>
								<PopoverContent>
									<PopoverCloseButton />
									<PopoverHeader>
										<Text fontSize="md">{game.name}</Text>
										<Text fontSize="smaller">{game.publisher}</Text>
									</PopoverHeader>
									<PopoverBody>
										<Text fontSize="smaller">{game.genre}</Text>
										<Text fontSize="smaller">{game.releaseDate}</Text>
									</PopoverBody>
								</PopoverContent>
							</Popover>
						);
					})}
				</HStack>
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
