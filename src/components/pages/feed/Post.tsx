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
	Skeleton,
	Text,
	useBoolean,
	useDisclosure,
	useToast,
	VStack,
} from '@chakra-ui/react';
import { FC, memo, useEffect, useRef, useState } from 'react';
import { BiDotsHorizontal } from 'react-icons/bi';
import { api, decodeBody, formatDateString, Post as P, User } from 'shared';

type Props = {
	post: P;
	isSelf: boolean;
};

const Post: FC<Props> = ({ post, isSelf }) => {
	const [prof, setProf] = useState<User | undefined>(undefined);
	const [error, setError] = useState<boolean>(false);
	const [loading, { toggle: setLoading }] = useBoolean(false);
	const { isOpen, onOpen, onClose } = useDisclosure();
	const toast = useToast();
	const cancelRef = useRef<any>();
	useEffect(() => {
		api(`/users?id=${post.userId}`)
			.get('')
			.then(({ data }) => {
				setProf(decodeBody(data));
			})
			.catch((err) => setError(true));
	}, [post]);
	const deletePost = async () => {
		setLoading();
		try {
			await api(`/posts/${post.id}`).delete('');
			// window.location.reload();
			toast({
				title: 'Publicação deletada com sucesso',
				status: 'success',
				duration: 2000,
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
	if (!prof && error)
		return (
			<Text fontSize="sm" color="gray.500">
				Houve um erro ao tentar buscar essa publicação.
			</Text>
		);
	if (!prof && !error)
		return (
			<VStack w="100%">
				<Skeleton w="100%" height="20px" />
				<Skeleton w="100%" height="50px" />
				<Skeleton w="100%" height="10px" />
			</VStack>
		);
	return (
		<VStack
			overflowX="hidden"
			align="flex-start"
			justify="flex-start"
			w="100%"
			maxW="100%"
		>
			<HStack gap={6} w="100%" align="center" justify="space-between">
				<Avatar
					cursor="pointer"
					onClick={(e: any) => (window.location.href = `/${prof?.username}`)}
					size="lg"
					src={prof?.thumbnail}
					name={prof?.fullName}
				/>
				<VStack spacing={-1} w="100%" align="flex-start" justify="flex-start">
					<Text fontWeight="bold">{prof?.username}</Text>
					<Text fontSize="sm" color="gray.500">
						{prof!.description!.length > 60
							? prof?.description?.substring(0, 59) + '...'
							: prof?.description}
					</Text>
					<Text py={2} fontSize="sm" color="gray.500">
						{formatDateString(post.createdAt)}
					</Text>
				</VStack>
				{isSelf && (
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
							{/* <MenuItem as="li" onClick=>
								Editar
							</MenuItem> */}
							<MenuItem as="li" onClick={onOpen}>
								Deletar
							</MenuItem>
						</MenuList>
					</Menu>
				)}
			</HStack>
			<Text wordBreak="break-all" whiteSpace="pre-line">
				{post.body}
			</Text>
			<AlertDialog
				isCentered
				isOpen={isOpen}
				leastDestructiveRef={cancelRef}
				onClose={onClose}
			>
				<AlertDialogOverlay>
					<AlertDialogContent>
						<AlertDialogHeader fontSize="lg" fontWeight="bold">
							Deletar publicação
						</AlertDialogHeader>
						<AlertDialogBody>
							Você tem certeza que deseja excluir sua publicação?
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
								onClick={deletePost}
								ml={3}
							>
								Deletar
							</Button>
						</AlertDialogFooter>
					</AlertDialogContent>
				</AlertDialogOverlay>
			</AlertDialog>
		</VStack>
	);
};

export default memo(Post);
