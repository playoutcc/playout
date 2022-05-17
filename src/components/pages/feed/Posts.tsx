import { Box, Button, HStack, Text, VStack } from '@chakra-ui/react';
import { yupResolver } from '@hookform/resolvers/yup';
import { TextArea } from 'components/layout';
import { FC } from 'react';
import { useForm } from 'react-hook-form';
import { User } from 'shared';
import * as yup from 'yup';
import { CardSuggestion } from './CardSuggestion';

type FieldsProps = {
	post: string;
};

const schema = yup.object().shape({
	post: yup
		.string()
		.required('Você deve digitar algo')
		.max(350, 'Sua publicação deve ter no máximo 350 caracteres'),
});

type Props = {
	data: User;
};

export const Posts: FC<Props> = ({ data }) => {
	console.log(data.interests);
	const posts: any[] = [];
	const {
		register,
		handleSubmit,
		formState: { errors },
		reset,
	} = useForm<FieldsProps>({ resolver: yupResolver(schema) });
	const onSubmit = (fields: FieldsProps) => {};
	return (
		<VStack
			spacing={2}
			gap={2}
			flex={1}
			justify="flex-start"
			align="start"
			w="100%"
			overflowY="auto"
		>
			<VStack
				onSubmit={handleSubmit(onSubmit)}
				justify="center"
				h="min-content"
				as="form"
				w="100%"
			>
				<Box justifySelf="center" w="100%" h="fit-content" maxH="200px">
					<TextArea
						resize="vertical"
						errors={errors}
						register={register}
						inputProps={{ maxRows: 4 }}
						name="post"
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
			<Text fontSize="xl" fontWeight="bold">
				Publicações
			</Text>
			{data.following.length < 3 && (
				<>
					<Text color="gray.500" fontSize="sm">
						Não há publicações para você ainda, siga mais{' '}
						{3 - data.following.length} pessoas para ver o que elas
						compartilham.
					</Text>
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
			{posts.length === 0 && data.following.length > 3 && (
				<Text fontSize="sm" color="gray.500">
					Não há publicações.
				</Text>
			)}
			{posts.map((post, index) => {
				if (index === posts.length / Math.ceil(posts.length / 10)) {
					return (
						<>
							{post}
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
											Não há sugestões para você, adicione um jogo como
											interesse.
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
					);
				}
				return post;
			})}
			{data.following.length >= 3 && (
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
			)}
			{data.suggestions.length === 0 && (
				<Text fontSize="sm" color="gray.500">
					Não há sugestões para você, adicione um jogo como interesse.
				</Text>
			)}
		</VStack>
	);
};
