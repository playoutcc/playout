import { Avatar, HStack, Skeleton, Text, VStack } from '@chakra-ui/react';
import { FC, useEffect, useState } from 'react';
import { api, decodeBody, formatDateString, Post as P, User } from 'shared';

type Props = {
	post: P;
};

export const Post: FC<Props> = ({ post }) => {
	const [prof, setProf] = useState<User | undefined>(undefined);
	const [error, setError] = useState<boolean>(false);
	useEffect(() => {
		api(`/users?id=${post.userId}`)
			.get('')
			.then(({ data }) => {
				setProf(decodeBody(data));
			})
			.catch((err) => setError(true));
	}, [post]);
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
		<VStack align="flex-start" justify="flex-start" w="100%">
			<HStack gap={6} w="100%" align="flex-start" justify="flex-start">
				<Avatar
					onClick={(e: any) => window.location.replace(`/${prof?.username}`)}
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
			</HStack>
			<Text>{post.body}</Text>
		</VStack>
	);
};
