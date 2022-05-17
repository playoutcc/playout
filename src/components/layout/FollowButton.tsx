import { Button, Spinner, Text, useBoolean } from '@chakra-ui/react';
import { FC } from 'react';
import { FaHeart, FaHeartBroken } from 'react-icons/fa';
import { api } from 'shared';

type Props = {
	prof: any;
	data: any;
	isFollowing: any;
	follow: any;
	setFollowing: any;
};

export const FollowButton: FC<Props> = ({
	prof,
	data,
	isFollowing,
	follow,
	setFollowing,
}) => {
	const [loading, { toggle: setLoading }] = useBoolean(false);
	const unfollowUser = async () => {
		setLoading();
		try {
			await api(
				`/users/unfollow/${prof.id}?email=${encodeURI(data?.email!)}`
			).put('');
			window.location.reload();
			setFollowing(false);
		} catch (err) {}
		setLoading();
	};
	const followUser = async () => {
		setLoading();
		try {
			await api(
				`/users/follow/${prof.id}?email=${encodeURI(data?.email!)}`
			).put('');
			setFollowing(true);
			window.location.reload();
		} catch (err) {}
		setLoading();
	};
	return (
		<Button
			title={
				isFollowing ? 'Deixar de seguir' : follow ? 'Seguir de volta' : 'Seguir'
			}
			display="flex"
			alignItems="center"
			justifyContent="center"
			size="sm"
			gap={2}
			color="black"
			backgroundColor={isFollowing ? 'red.400' : 'primary.main'}
			onClick={isFollowing ? unfollowUser : followUser}
			_hover={{
				backgroundColor: isFollowing ? 'red.500' : 'primary.hover',
			}}
			_active={{
				backgroundColor: isFollowing ? 'red.500' : 'primary.hover',
			}}
			_focus={{
				backgroundColor: isFollowing ? 'red.500' : 'primary.hover',
			}}
			leftIcon={loading ? <></> : isFollowing ? <FaHeartBroken /> : <FaHeart />}
			className="action_button"
		>
			{!loading && (
				<Text as="span" mt={1}>
					{isFollowing
						? 'Deixar de seguir'
						: follow
						? 'Seguir de volta'
						: 'Seguir'}
				</Text>
			)}
			{loading && <Spinner size="sm" />}
		</Button>
	);
};
