import {
	AlertDialog,
	AlertDialogBody,
	AlertDialogContent,
	AlertDialogFooter,
	AlertDialogHeader,
	AlertDialogOverlay,
	Box,
	Button,
	HStack,
	Icon,
	Menu,
	MenuButton,
	MenuItem,
	MenuList,
	Text,
	useBoolean,
	useDisclosure,
	useToast,
	VStack,
} from '@chakra-ui/react';
import { FC, useEffect, useRef, useState } from 'react';
import { BiDotsHorizontal } from 'react-icons/bi';
import { BsFillTrophyFill } from 'react-icons/bs';
import { api, Trophy } from 'shared';
import { ModalTrophy } from './ModalTrophy';

type Props = {
	isSelf: boolean;
	trophy: Trophy;
};

export const TrophiesCard: FC<Props> = ({ isSelf, trophy }) => {
	const [menu, setMenu] = useState(false);
	const [loading, { toggle: setLoading }] = useBoolean(false);
	const cancelRef = useRef<any>();
	const toast = useToast();
	const [isOpenTrophy, { toggle: setOpenTrophy }] = useBoolean(false);
	const { isOpen, onOpen, onClose } = useDisclosure();
	useEffect(() => {
		setMenu(true);
	}, []);
	const deleteTrophy = async () => {
		setLoading();
		try {
			await api(`/users/trophy/${trophy.id}`).delete('');
			window.location.reload();
			toast({
				title: 'Troféu deletado com sucesso',
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
	const positionComponent = () => {
		let position = trophy.position.replace('°', '');
		if (position === '1') {
			return (
				<Icon
					title={trophy.position}
					boxSize={34}
					color="gold"
					as={BsFillTrophyFill}
				/>
			);
		} else if (position === '2') {
			return (
				<Icon
					title={trophy.position}
					boxSize={34}
					color="silver"
					as={BsFillTrophyFill}
				/>
			);
		} else if (position === '3') {
			return (
				<Icon
					title={trophy.position}
					boxSize={34}
					color="#B87333"
					as={BsFillTrophyFill}
				/>
			);
		} else {
			return (
				<Icon title={trophy.position} boxSize={34} as={BsFillTrophyFill} />
			);
		}
	};
	return (
		<HStack
			backgroundColor="gray.800"
			borderRadius="15px"
			p={6}
			w="fit-content"
			h="130px"
			justify="space-between"
			align="center"
			gap={4}
		>
			{trophy?.position && <Box py={4}>{positionComponent()}</Box>}
			<VStack flex={1} spacing={-2} align="flex-start" as="section">
				<Text fontSize="2xl" fontWeight="bold">
					{trophy.championshipName}
				</Text>
				<HStack gap={1} align="center" w="fit-content">
					{trophy.team && (
						<Text mb={1} fontSize="md">
							{trophy.team} -
						</Text>
					)}
					<Text fontSize="small">{trophy.year}</Text>
				</HStack>
			</VStack>
			{menu && isSelf && (
				<Menu>
					<MenuButton cursor="pointer" as="div">
						<Button
							aria-label="Opções da experiência"
							backgroundColor="transparent"
						>
							<BiDotsHorizontal cursor="pointer" color="white" size={20} />
						</Button>
					</MenuButton>
					<MenuList cursor="pointer" as="ul">
						<MenuItem as="li" onClick={setOpenTrophy}>
							Editar
						</MenuItem>
						<MenuItem as="li" onClick={onOpen}>
							Deletar
						</MenuItem>
					</MenuList>
				</Menu>
			)}
			<AlertDialog
				isCentered
				isOpen={isOpen}
				leastDestructiveRef={cancelRef}
				onClose={onClose}
			>
				<AlertDialogOverlay>
					<AlertDialogContent>
						<AlertDialogHeader fontSize="lg" fontWeight="bold">
							Deletar troféu
						</AlertDialogHeader>
						<AlertDialogBody>
							Você tem certeza que deseja excluir seu troféu?
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
								onClick={deleteTrophy}
								ml={3}
							>
								Deletar
							</Button>
						</AlertDialogFooter>
					</AlertDialogContent>
				</AlertDialogOverlay>
			</AlertDialog>
			<ModalTrophy
				edit={trophy}
				isOpen={isOpenTrophy}
				onClose={setOpenTrophy}
			/>
		</HStack>
	);
};
