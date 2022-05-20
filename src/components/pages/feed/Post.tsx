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
	Link,
	Menu,
	MenuButton,
	MenuItem,
	MenuList,
	Text,
	useBoolean,
	useDisclosure,
	useToast,
	VStack
} from '@chakra-ui/react';
import { FC, memo, useRef } from 'react';
import { BiDotsHorizontal } from 'react-icons/bi';
import { api, formatDateString, Post as P } from 'shared';

type Props = {
	post: P;
	isSelf: boolean;
};

const URL_REGEX = /(http|https)\:\/\/[a-zA-Z0-9\-\.]+\.[a-zA-Z]{2,3}(\/\S*)?/g;

const Post: FC<Props> = ({ post, isSelf }) => {
	const [loading, { toggle: setLoading }] = useBoolean(false);
	const { isOpen, onOpen, onClose } = useDisclosure();
	const toast = useToast();
	const cancelRef = useRef<any>();
	const likePosts = async () => {
		await api(`/posts/${post.id}?like=1`).put('', {
			likes: post.likes.push,
		});
	};
	const urls = post.body.match(URL_REGEX);
	const deletePost = async () => {
		setLoading();
		try {
			await api(`/posts/${post.id}`).delete('');
			window.location.reload();
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
	if (!post.user)
		return (
			<Text fontSize="sm" color="gray.500">
				Não conseguimos carregar a publicação
			</Text>
		);
	return (
		<VStack
			overflowX="hidden"
			align="flex-start"
			justify="flex-start"
			w="100%"
			backgroundColor="gray.800"
			borderRadius="15px"
			p={6}
			maxW="100%"
		>
			<HStack gap={6} w="100%" align="center" justify="space-between">
				<Avatar
					mb={4}
					cursor="pointer"
					onClick={(e: any) =>
						(window.location.href = `/${post.user?.username}`)
					}
					size="lg"
					src={post.user?.thumbnail}
					name={post.user?.fullName}
				/>
				<VStack
					spacing={-1}
					w="100%"
					h="fit-content"
					align="flex-start"
					justify="center"
				>
					<Text fontWeight="bold">{post.user?.username}</Text>
					<Text fontSize="sm" color="gray.500">
						{post.user!.description!.length > 60
							? post.user?.description?.substring(0, 59) + '...'
							: post.user?.description}
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
								backgroundColor="transparent"
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
				{post.body.trim()
					.replace(/([\s\r]{2,2})/g, '\n')
					.replace(/([\s\r]{3,})/g, '\n\n')
					.split(/([\s\r])/g)
					.map((word) => {
						if (urls?.includes(word)) {
							return (
								<Link
									target="_blank"
									color="primary.main"
									href={word}
									rel="noreferrer nofololw"
								>
									{word}
								</Link>
							);
						}
						return word;
					})}
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
