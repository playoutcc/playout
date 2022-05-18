import {
	Box,
	Button,
	HStack,
	Spinner,
	StackDivider,
	Text,
	useToast,
	VStack,
} from '@chakra-ui/react';
import { yupResolver } from '@hookform/resolvers/yup';
import { TextArea } from 'components/layout';
import { takeDefaultPosts } from 'pages/feed';
import { FC, useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { BiRefresh } from 'react-icons/bi';
import { api, decodeBody, encodeBody, PostsPage, User } from 'shared';
import * as yup from 'yup';
import { CardSuggestion } from './CardSuggestion';
import Post from './Post';

type FieldsProps = {
	body: string;
};

const schema = yup.object().shape({
	body: yup
		.string()
		.trim()
		.required('Você deve digitar algo')
		.max(350, 'Sua publicação deve ter no máximo 350 caracteres'),
});

type Props = {
	data: User;
	postsPage: PostsPage;
};

export const Posts: FC<Props> = ({ data, postsPage }) => {
	const [printFirstPage, setPrintFirstPage] = useState(postsPage.posts);
	const [changePosts, setChangePosts] = useState(false);
	const [page, setPage] = useState(0);
	const [{ posts, max }, setPostsPage] = useState(postsPage);
	const [lookingPosts, setLookingPosts] = useState(false);
	const [lastPage, setLastPage] = useState(false);
	const {
		register,
		handleSubmit,
		formState: { errors },
		reset,
	} = useForm<FieldsProps>({ resolver: yupResolver(schema) });
	useEffect(() => {
		const intervalPostRefresh = setInterval(() => {
			if (changePosts) {
				clearInterval(intervalPostRefresh);
				return;
			}
			api(`/posts/${data.id}?take=${takeDefaultPosts * (page + 1)}&skip=0`)
				.get('')
				.then(({ data }) => {
					const newPosts = decodeBody(data);
					if (printFirstPage[0].id !== newPosts.posts[0].id) {
						setChangePosts(true);
						clearInterval(intervalPostRefresh);
					}
				});
		}, 30000);
	});
	useEffect(() => {
		window.onscroll = function (e: any) {
			const { scrollTop, scrollHeight, clientHeight } =
				e.target.scrollingElement;
			if (scrollTop + clientHeight > scrollHeight / 2 - 200) {
				if (lookingPosts) return;
				if (page + 1 > max) {
					setLastPage(true);
					return;
				}
				setLookingPosts(true);
				api(`/posts/${data.id}?take=${takeDefaultPosts}&skip=${page + 1}`)
					.get('')
					.then(({ data }) => {
						const response = decodeBody(data);
						setPostsPage({
							max: response.max,
							posts: [...posts, ...response.posts],
						});
						setLookingPosts(false);
					});
				setPage(page + 1);
				setPrintFirstPage(posts);
			}
		};
	});
	const toast = useToast();
	const postsComponent = posts.map((post, index) => {
		if (index === posts.length / 2 && posts.length > 8) {
			return (
				<VStack w="100%" key={post.body + index + post.createdAt + post.id}>
					<Post isSelf={post.userId === data.id} post={post} />
					<VStack
						as="details"
						py={4}
						justify="flex-start"
						align="start"
						w="100%"
					>
						<Text cursor="pointer" as="summary" fontSize="xl" fontWeight="bold">
							Sugestões
						</Text>
						<HStack
							w="100%"
							css={{ gap: '2rem' }}
							justify="flex-start"
							align="flex-start"
							overflowX="auto"
							overflowY="hidden"
							position="relative"
							py={data.suggestions.length === 0 ? 0 : 4}
							px={data.suggestions.length === 0 ? 0 : 2}
						>
							{data.suggestions.length === 0 && (
								<Text fontSize="sm" color="gray.500">
									Não há sugestões para você, adicione um jogo como interesse.
								</Text>
							)}
							{data.suggestions.map((suggestion) => {
								return (
									<CardSuggestion
										key={suggestion.id}
										data={data}
										prof={suggestion}
									/>
								);
							})}
						</HStack>
					</VStack>
				</VStack>
			);
		}
		return (
			<Post
				key={post.body + index + post.createdAt + post.id}
				isSelf={post.userId === data.id}
				post={post}
			/>
		);
	});
	const onSubmit = async ({ body }: FieldsProps) => {
		try {
			const requestBody = {
				body,
				userId: data.id,
			};
			await api(`/posts/`).post('', encodeBody(requestBody));
			window.location.reload();
			toast({
				title: 'Publicação criada com sucesso',
				status: 'success',
				duration: 2000,
				isClosable: true,
				position: 'top-right',
			});
			reset();
		} catch (err) {
			toast({
				title: 'Não conseguimos criar sua publicação',
				description: 'Tente novamente mais tarde',
				status: 'error',
				duration: 2000,
				isClosable: true,
				position: 'top-right',
			});
		}
	};
	return (
		<VStack
			spacing={2}
			gap={2}
			flex={1}
			justify="flex-start"
			align="start"
			w="100%"
			overflowY="hidden"
		>
			{changePosts && (
				<Box zIndex={1000} position="fixed" right="10px" bottom="20px">
					<Button
						display="flex"
						alignItems="center"
						gap={2}
						size="sm"
						color="black"
						backgroundColor="primary.main"
						_hover={{ backgroundColor: 'primary.hover' }}
						_active={{ backgroundColor: 'primary.hover' }}
						_focus={{ backgroundColor: 'primary.hover' }}
						leftIcon={<BiRefresh size={18} />}
						className="action_button"
					>
						<Text
							as="span"
							onClick={(e: any) => (window.location.href = '/feed#header')}
						>
							Novas publicações
						</Text>
					</Button>
				</Box>
			)}
			<VStack
				onSubmit={handleSubmit(onSubmit)}
				justify="center"
				h="min-content"
				as="form"
				w="100%"
			>
				<Box justifySelf="center" w="100%">
					<TextArea
						resize
						maxH="150px"
						errors={errors}
						register={register}
						inputProps={{ maxRows: 4 }}
						name="body"
						placeHolder="Digite algo... O que está jogando?"
					/>
				</Box>
				<Button
					type="submit"
					alignSelf="flex-end"
					color="black"
					backgroundColor="primary.main"
					_hover={{ backgroundColor: 'primary.hover' }}
					_active={{ backgroundColor: 'primary.hover' }}
					_focus={{ backgroundColor: 'primary.hover' }}
					size="sm"
				>
					Publicar
				</Button>
			</VStack>
			{data.following.length < 3 && (
				<>
					<VStack justify="flex-start" align="start" w="100%">
						<Text fontSize="xl" fontWeight="bold">
							Sugestões
						</Text>
						<HStack
							w="100%"
							css={{ gap: '2rem' }}
							justify="flex-start"
							align="flex-start"
							overflowX="auto"
							overflowY="hidden"
							position="relative"
							py={data.suggestions.length === 0 ? 0 : 4}
							px={data.suggestions.length === 0 ? 0 : 2}
						>
							{data.suggestions.length === 0 && (
								<Text fontSize="sm" color="gray.500">
									Não há sugestões para você, adicione um jogo como interesse.
								</Text>
							)}
							{data.suggestions.map((suggestion) => {
								return (
									<CardSuggestion
										key={suggestion.id}
										data={data}
										prof={suggestion}
									/>
								);
							})}
						</HStack>
					</VStack>
				</>
			)}
			<Text fontSize="xl" fontWeight="bold">
				Publicações
			</Text>
			<>
				<VStack
					pt={6}
					gap={4}
					spacing={4}
					justify="flex-start"
					align="start"
					w="100%"
					divider={<StackDivider />}
				>
					{postsComponent}
				</VStack>
				{lookingPosts && <Spinner size="md" />}
				{lastPage && (
					<Text color="gray.500" fontSize="sm">
						Não há mais publicações para carregar.
					</Text>
				)}
			</>
		</VStack>
	);
};
