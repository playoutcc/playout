import { Avatar, Text, VStack } from '@chakra-ui/react';
import { FollowButton } from 'components/layout';
import { FC, useState } from 'react';

type Props = {
	prof: any;
	data: any;
};

export const CardSuggestion: FC<Props> = ({ prof, data }) => {
	const [isFollowing, setFollowing] = useState<boolean>(
		prof ? prof.followers.includes(data ? data.id : '') : false
	);
	const [follow, setFollow] = useState<boolean>(
		prof && data ? prof.following.includes(data.id) : false
	);
	return (
		<VStack>
			<Avatar
				cursor="pointer"
				src={prof.thumbnail}
				name={prof.username}
				size="xl"
				title="Ir para o perfil"
				onClick={(e: any) => window.location.replace(`/${prof.username}`)}
			/>
			<Text fontSize="small">@{prof.username}</Text>
			<FollowButton
				setFollowing={setFollowing}
				follow={follow}
				isFollowing={isFollowing}
				data={data}
				prof={prof}
			/>
		</VStack>
	);
};
