import { Avatar, HStack, Text, VStack } from '@chakra-ui/react';
import { FC } from 'react';
import { User } from 'shared';

type Props = {
	user: User;
};

const CardUser: FC<Props> = ({ user }) => {
	return (
		<HStack
			cursor="pointer"
			_hover={{ backgroundColor: 'gray.900' }}
			justify="flex-start"
			align="center"
			backgroundColor="gray.800"
			borderRadius="15px"
			p={6}
			w="100%"
			gap={10}
			onClick={(e: any) => (window.location.href = `/${user.username}`)}
		>
			<Avatar src={user.thumbnail} name={user.fullName} size="xl" />
			<VStack spacing={-2} align="flex-start">
				<Text fontSize="xl">{user.fullName}</Text>
				<Text>@{user.username}</Text>
				<Text fontSize="sm" py={5}>
					{user.description!.length <= 60
						? user.description
						: `${user.description?.substring(0, 59)}...`}
				</Text>
			</VStack>
		</HStack>
	);
};

export default CardUser;
