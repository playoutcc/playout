import {
	Avatar,
	Box,
	Button,
	HStack,
	Menu,
	MenuButton,
	MenuItem,
	MenuList,
	Modal,
	ModalCloseButton,
	ModalContent,
	ModalOverlay,
	PopoverTrigger,
	Text,
	useBoolean,
	useDisclosure,
	useToast,
	VStack,
} from '@chakra-ui/react';
import { ExperienceContainer } from 'components/actions/experiences';
import { TrophiesContainer } from 'components/actions/trophies';
import { ModalDelete, UserEditor } from 'components/actions/user';
import {
	FollowButton,
	Footer,
	Header,
	Main,
	SearchBar,
} from 'components/layout';
import { CardSuggestion } from 'components/pages/feed';
import { useUser } from 'contexts';
import { removeCookies } from 'cookies-next';
import moment from 'moment';
import { NextPage } from 'next';
import Error from 'next/error';
import Head from 'next/head';
import { destroyCookie, parseCookies } from 'nookies';
import { Fragment, useEffect, useRef, useState } from 'react';
import { AiFillCaretDown, AiOutlineQuestion } from 'react-icons/ai';
import { BiLogOut, BiPencil, BiUser } from 'react-icons/bi';
import { FaCrown } from 'react-icons/fa';
import { MdDelete } from 'react-icons/md';
import {
	api,
	decodeBody,
	decodeKeyAuthorization,
	encodeBody,
	Games,
	User,
} from 'shared';

type Props = {
	profile?: string;
	user?: string;
	games?: string;
};

const Trigger: any = PopoverTrigger;

const Profile: NextPage<Props> = ({ profile, user, games }) => {
	const ref = useRef<HTMLDivElement>({} as HTMLDivElement);
	const [isOpen, { toggle: setOpen }] = useBoolean(false);
	const [isOpenEditProfile, { toggle: setOpenEditProfile }] = useBoolean(false);
	const {
		isOpen: isOpenPhoto,
		onOpen: onOpenPhoto,
		onClose: onClosePhoto,
	} = useDisclosure();
	const toast = useToast();
	const [menu, setMenu] = useState(false);
	const [prof, setProf] = useState<User | null>(
		profile ? decodeBody(profile) : null
	);
	const [data, setData] = useState<User | null>(user ? decodeBody(user) : null);
	const [isBeta, setBeta] = useState(
		moment(data?.createdAt).isBefore(moment('2022/05/19'))
	);
	const [isFollowing, setFollowing] = useState<boolean>(
		prof ? prof.followers.includes(data ? data.id : '') : false
	);
	const [follow, setFollow] = useState<boolean>(
		prof && data ? prof.following.includes(data.id) : false
	);
	useEffect(() => {
		setMenu(true);
	}, []);
	const { logout } = useUser();
	if (!prof) return <Error statusCode={404} />;
	const gamesData: Games[] = decodeBody(games!);
	const interestsGames: Games[] = gamesData.filter((game) =>
		prof?.interests.includes(game.name)
	);
	prof.experiences = prof?.experiences?.sort((a, b) => {
		const aStartDate = new Date(a.startDate).getTime();
		const bStartDate = new Date(b.startDate).getTime();
		const aEndDate = (a.endDate ? new Date(a.endDate) : new Date()).getTime();
		const bEndDate = (b.endDate ? new Date(b.endDate) : new Date()).getTime();
		if (!a.endDate && !b.endDate) {
			return bStartDate - aStartDate;
		}
		return bEndDate - aEndDate;
	});
	prof.trophies = prof?.trophies?.sort(
		(a, b) => Number(b.year) - Number(a.year)
	);
	const changePassword = async () => {
		try {
			await api(`/users/change-password?email=${data?.email}`).get('');
			toast({
				title: 'Pedido de altera????o feito',
				description: 'Voc?? receber?? um email com o passo a passo',
				status: 'success',
				duration: 2500,
				isClosable: true,
				position: 'top-right',
			});
		} catch (err) {
			toast({
				title: 'Houve um erro ao tentar mudar a senha',
				description: 'Tente novamente mais tarde',
				status: 'error',
				duration: 2000,
				isClosable: true,
				position: 'top-right',
			});
		}
	};
	const isSelf = data?.email == prof?.email;
	if (!menu) return <></>;
	return (
		<Fragment>
			<Head>
				<title>Playout{prof?.username ? ` | ${prof.username}` : ''}</title>
				{prof && (
					<Fragment>
						<meta
							property="og:title"
							content={`Playout${prof?.username ? ` | ${prof.username}` : ''}`}
						/>
						<meta
							property="twitter:title"
							content={`Playout${prof?.username ? ` | ${prof.username}` : ''}`}
						/>
						<meta name="description" content={prof.description} />
						<meta property="og:image:width" content="480" />
						<meta property="og:image:height" content="360" />
						<meta property="og:description" content={prof.description} />
						<meta property="twitter:image" content={prof.thumbnail} />
						<meta property="twitter:description" content={prof.description} />
						<meta property="og:site_name" content="Playout" />
						<meta property="og:image" content={prof.thumbnail} />
						<meta property="og:description" content="" />
						<meta
							property="og:url"
							content={`https://playout.network/${prof.thumbnail}`}
						/>
						<meta property="og:type" content="website" />
					</Fragment>
				)}
			</Head>
			<Header className="header_profile" css={{ flexWrap: 'wrap-reverse' }}>
				{data && (
					<Fragment>
						<SearchBar />
					</Fragment>
				)}
				<HStack className="user_menu" as="section" flex={1} w="100%" gap={3}>
					{!data && (
						<Text
							cursor="pointer"
							onClick={(e: any) => (window.location.href = '/')}
						>
							Entre ou crie sua conta
						</Text>
					)}
					{isSelf && data && menu && (
						<Menu>
							<MenuButton
								fontSize="sm"
								w="fit-content"
								backgroundColor="transparent"
							>
								<HStack as="section" wrap="nowrap" align="center" gap={2}>
									<BiUser title="Editar perfil" size={20} />
									<AiFillCaretDown />
								</HStack>
							</MenuButton>
							<MenuList as="ul">
								<MenuItem as="li" padding={0} margin={0}>
									<Button
										leftIcon={<AiOutlineQuestion />}
										css={{ gap: '0.5rem' }}
										backgroundColor="transparent"
										w="100%"
										onClick={changePassword}
										size="sm"
									>
										Trocar senha
									</Button>
								</MenuItem>
								<MenuItem as="li" padding={0} margin={0}>
									<Button
										leftIcon={<BiPencil />}
										css={{ gap: '0.5rem' }}
										backgroundColor="transparent"
										w="100%"
										onClick={setOpenEditProfile}
										size="sm"
									>
										Editar perfil
									</Button>
								</MenuItem>
								<MenuItem as="li" padding={0} margin={0}>
									<Button
										leftIcon={<MdDelete />}
										css={{ gap: '0.5rem' }}
										backgroundColor="transparent"
										w="100%"
										onClick={setOpen}
										size="sm"
									>
										Deletar perfil
									</Button>
								</MenuItem>
							</MenuList>
							<ModalDelete
								email={data?.email}
								password={data?.password}
								isOpen={isOpen}
								onClose={setOpen}
							/>
						</Menu>
					)}
					{!isSelf && data && (
						<Avatar
							cursor="pointer"
							onClick={(e: any) => (window.location.href = `/${data.username}`)}
							title={data.username}
							size="sm"
							name={data.fullName}
							src={data.thumbnail}
						/>
					)}
					{data && (
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
					)}
				</HStack>
			</Header>
			<Main>
				<HStack
					w="100%"
					wrap="wrap"
					css={{ gap: '1.8rem' }}
					justify="space-between"
				>
					<VStack
						w="100%"
						h="fit-content"
						justify="flex-start"
						align="flex-start"
					>
						<HStack w="100%" css={{ gap: '1.8rem' }}>
							<Avatar
								_hover={{ cursor: 'zoom-in', transform: 'scale(1.1)' }}
								transform={isOpenPhoto ? 'scale(1.1)' : 'scale(1)'}
								transition="all 300ms ease-in-out"
								onClick={onOpenPhoto}
								size="xl"
								src={prof?.thumbnail}
								title={prof?.username}
								name={prof?.fullName}
							/>
							<Modal isCentered isOpen={isOpenPhoto} onClose={onClosePhoto}>
								<ModalOverlay backgroundColor="blackAlpha.800" />
								<ModalContent w="fit-content" backgroundColor="transparent">
									<Avatar
										w="20rem"
										h="20rem"
										src={prof?.thumbnail}
										title={prof?.username}
										name={prof?.fullName}
									/>
								</ModalContent>
							</Modal>
							<VStack w="100%" spacing={2} align="flex-start">
								<HStack
									align="center"
									wrap="wrap"
									gap={4}
									w="100%"
									justify="space-between"
								>
									<Text
										display="inline-flex"
										alignItems="center"
										gap={2}
										fontSize="2xl"
									>
										{prof?.fullName.split(' ')[0]}{' '}
										{isBeta && (
											<Box
												className="icon-crown-beta"
												_hover={{ transform: 'scale(1.2)' }}
												transition="all 300ms ease-in-out"
												margin="0 0.5rem"
												as="span"
											>
												<FaCrown
													title="Este usu??rio participou da vers??o pr??-beta"
													size={18}
												/>
											</Box>
										)}
									</Text>
									{!isSelf && data && (
										<HStack gap={4} align="center" justify="flex-end">
											{follow && (
												<Text mt={1} color="gray.500" fontSize="small">
													Segue voc??
												</Text>
											)}
											<FollowButton
												data={data}
												prof={prof}
												isFollowing={isFollowing}
												setFollowing={setFollowing}
												follow={follow}
											/>
										</HStack>
									)}
								</HStack>
								<Text fontSize="sm">
									@{prof?.username} - {prof?.address?.city} -{' '}
									{prof?.address?.province}
								</Text>
							</VStack>
						</HStack>
						<Text css={{ padding: '0.5rem 0' }}>{prof?.description}</Text>
						<HStack gap={5}>
							<Text fontSize="small">
								<b>Seguindo: </b>
								{prof.following.length}
							</Text>
							<Text fontSize="small">
								<b>Seguidores: </b>
								{prof.followers.length}
							</Text>
						</HStack>
					</VStack>
				</HStack>
				{data && isSelf && (
					<>
						<VStack
							as="details"
							py={4}
							justify="flex-start"
							align="start"
							w="100%"
						>
							<Text
								cursor="pointer"
								as="summary"
								fontSize="xl"
								fontWeight="bold"
							>
								Sugest??es
							</Text>
							<HStack
								w="100%"
								css={{ gap: '2rem' }}
								justify="flex-start"
								align="flex-start"
								position="relative"
								py={data.suggestions.length === 0 ? 0 : 4}
								px={data.suggestions.length === 0 ? 0 : 2}
							>
								{data.suggestions.length === 0 && (
									<Text fontSize="sm" color="gray.500">
										N??o h?? sugest??es para voc??, adicione um jogo como interesse.
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
				<ExperienceContainer
					gamesData={gamesData}
					isSelf={isSelf}
					prof={prof}
				/>
				<TrophiesContainer isSelf={isSelf} prof={prof} />
				<VStack
					ref={ref}
					padding="2rem 0"
					spacing={2}
					align="flex-start"
					w="100%"
				>
					<Text fontSize="2xl">Interesses</Text>
					{(!prof?.interests || prof?.interests.length == 0) && (
						<Text fontSize="sm" color="gray.500">
							N??o possui interesses
						</Text>
					)}
					<HStack
						css={{ gap: '0.8rem' }}
						justify="flex-start"
						align="flex-start"
						w="100%"
						maxW={`${ref.current.offsetWidth - 50}px`}
						whiteSpace="nowrap"
						overflowX="auto"
						position="relative"
						overflowY="hidden"
						margin="0 auto"
						py={interestsGames.length === 0 ? 0 : 4}
						px={interestsGames.length === 0 ? 0 : 2}
					>
						{interestsGames.map((game) => {
							return (
								<Box key={game.name}>
									<Avatar
										_hover={{
											transform: 'scale(1.2)',
											borderColor: 'primary.main',
											borderWidth: '1px',
											borderStroke: 'solid',
										}}
										_active={{ transform: 'scale(1.2)' }}
										title={game.name}
										cursor="pointer"
										src={game.thumbnail}
										name={game.name}
									/>
								</Box>
							);
						})}
					</HStack>
				</VStack>
				{data && menu && (
					<Fragment>
						<Modal
							isCentered
							isOpen={isOpenEditProfile}
							onClose={setOpenEditProfile}
						>
							<ModalOverlay backgroundColor="blackAlpha.800" />
							<ModalCloseButton />
							<ModalContent
								h="600px"
								overflowY="auto"
								borderWidth="1px"
								borderColor="primary.main"
								p={4}
							>
								<UserEditor
									games={gamesData}
									fullName={data?.fullName!}
									edit={data!}
								/>
							</ModalContent>
						</Modal>
					</Fragment>
				)}
			</Main>
			<Footer />
		</Fragment>
	);
};

Profile.getInitialProps = async (ctx): Promise<Props> => {
	class E {
		constructor(private message: string) {}
	}
	const { req, res } = ctx;
	const { nextauth } = parseCookies(ctx);
	const username = ctx.query.username as string;
	let profile = undefined;
	let user = undefined;
	let games = undefined;
	try {
		if (username) {
			const { data } = await api(
				`/users/by-username/${encodeURI(username)}`
			).get('');
			profile = data;
		}
		if (nextauth) {
			const response = await api(
				`/users?token=${encodeURI(
					decodeKeyAuthorization(nextauth)
				)}&need_suggest=1`
			).get('');
			user = response.data;
		}
		const responseGames = await api('/games').get('');
		games = encodeBody(Object.values(decodeBody(responseGames.data)));
	} catch (err) {
		if (!username) {
			removeCookies('nextauth', { req, res });
			destroyCookie(ctx, 'nextauth');
		}
	} finally {
		return {
			profile,
			user,
			games,
		};
	}
};

export default Profile;
