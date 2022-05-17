import {
	AlertDialog,
	AlertDialogBody,
	AlertDialogContent,
	AlertDialogFooter,
	AlertDialogHeader,
	AlertDialogOverlay,
	Button,
	HStack,
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
	return (
		<HStack w="100%" justify="space-between" align="flex-start">
			<VStack flex={1} spacing={-2} align="flex-start" as="section">
				<Text fontSize="2xl" fontWeight="bold">
					{trophy.championshipName}
				</Text>
				{trophy.team && <Text fontSize="md">{trophy.team}</Text>}
				<Text fontSize="small">{trophy.year}</Text>
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
