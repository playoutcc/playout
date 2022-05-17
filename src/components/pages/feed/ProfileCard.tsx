import { Avatar, Text, VStack } from '@chakra-ui/react';
import { FC } from 'react';
import { User } from 'shared';

type Props = {
	data: User;
};

export const ProfileCard: FC<Props> = ({ data }) => {
	return (
		<VStack className="card_feed_pc" align="flex-start" p={4}>
			<Avatar
				cursor="pointer"
				onClick={(e: any) => window.location.replace(`/${data.username}`)}
				title="Ir para o perfil"
				src={data.thumbnail}
				name={data.fullName}
				size="xl"
			/>
			<Text alignSelf="center" fontSize="small">
				@{data.username}
			</Text>
			<Text fontSize="small">
				<b>Seguindo: </b>
				{data.following.length}
			</Text>
			<Text fontSize="small">
				<b>Seguidores: </b>
				{data.followers.length}
			</Text>
		</VStack>
	);
};
