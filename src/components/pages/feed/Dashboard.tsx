import { Avatar, Button, HStack } from '@chakra-ui/react';
import { Header, Main, SearchBar } from 'components/layout';
import { useUser } from 'contexts';
import { FC, Fragment, useEffect, useState } from 'react';
import { BiLogOut } from 'react-icons/bi';
import { apiNews, News, shuffle, User } from 'shared';
import { NewsCard } from './NewsCard';
import { Posts } from './Posts';
import { ProfileCard } from './ProfileCard';

type Props = {
	data: User;
};

export const Dashboard: FC<Props> = ({ data }) => {
	const { logout } = useUser();
	const [menu, setMenu] = useState(false);
	const [news, setNews] = useState<News[]>(new Array());
	useEffect(() => {
		apiNews(data.interests)
			.get('')
			.then(({ data }) => {
				setNews(shuffle(data));
			})
			.catch();
	}, [data, menu]);
	useEffect(() => {
		setMenu(true);
	}, [menu]);
	if (!menu) return <></>;
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
			<Main
				css={{
					flex: 1,
				}}
			>
				<HStack
					gap={8}
					as="div"
					w="100%"
					justify="flex-start"
					align="flex-start"
				>
					<ProfileCard data={data} />
					<Posts data={data} />
					<NewsCard news={news} />
				</HStack>
			</Main>
		</Fragment>
	);
};
