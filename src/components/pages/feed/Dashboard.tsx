import { Avatar, Button, HStack } from '@chakra-ui/react';
import { Header, SearchBar } from 'components/layout';
import { useUser } from 'contexts';
import { FC, Fragment } from 'react';
import { BiLogOut } from 'react-icons/bi';
import { User } from 'shared';

type Props = {
	data: User;
};

export const Dashboard: FC<Props> = ({ data }) => {
	const { logout } = useUser();
	return (
		<Fragment>
			<Header className="header_profile" css={{ flexWrap: 'wrap-reverse' }}>
				<Fragment>
					<SearchBar />
				</Fragment>
				<HStack className="user_menu" as="section" flex={1} w="100%" gap={3}>
					<Avatar
						cursor="pointer"
						onClick={(e: any) => window.location.replace(`/${data.username}`)}
						title={data.username}
						size="sm"
						name={data.fullName}
						src={data.thumbnail}
					/>
					<Button
						size="sm"
						w="fit-content"
						color="white"
						backgroundColor="transparent"
						onClick={logout}
						_hover={{ backgroundColor: 'transparent' }}
						_active={{ backgroundColor: 'transparent' }}
						_focus={{ backgroundColor: 'transparent' }}
					>
						<BiLogOut title="Sair da conta" size={20} />
					</Button>
				</HStack>
			</Header>
		</Fragment>
	);
};
