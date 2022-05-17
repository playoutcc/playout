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
	Popover,
	PopoverBody,
	PopoverCloseButton,
	PopoverContent,
	PopoverHeader,
	PopoverTrigger,
	Spinner,
	StackDivider,
	Text,
	useBoolean,
	useDisclosure,
	useToast,
	VStack,
} from '@chakra-ui/react';
import {
	ExperienceCard,
	ModalExperience,
} from 'components/actions/experiences';
import { ModalTrophy, TrophiesCard } from 'components/actions/trophies';
import { ModalDelete, UserEditor } from 'components/actions/user';
import { Footer, Header, Main, SearchBar } from 'components/layout';
import { useUser } from 'contexts';
import { removeCookies } from 'cookies-next';
import moment from 'moment';
import { NextPage } from 'next';
import Error from 'next/error';
import Head from 'next/head';
import { destroyCookie, parseCookies } from 'nookies';
import { Fragment, useEffect, useState } from 'react';
import {
	AiFillCaretDown,
	AiFillPlusCircle,
	AiOutlineQuestion,
} from 'react-icons/ai';
import { BiLogOut, BiPencil, BiUser } from 'react-icons/bi';
import { FaCrown, FaHeart, FaHeartBroken } from 'react-icons/fa';
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
	const [isOpen, { toggle: setOpen }] = useBoolean(false);
	const [loading, { toggle: setLoading }] = useBoolean(false);
	const [isOpenExperience, { toggle: setOpenExperience }] = useBoolean(false);
	const [isOpenEditProfile, { toggle: setOpenEditProfile }] = useBoolean(false);
	const [isOpenTrophy, { toggle: setOpenTrophy }] = useBoolean(false);
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
				title: 'Pedido de alteração feito',
				description: 'Você receberá um email com o passo a passo',
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
							onClick={(e: any) => window.location.replace('/')}
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
							onClick={(e: any) => window.location.replace(`/${data.username}`)}
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
											>
												<FaCrown
													title="Este usuário participou da versão pré-beta"
													size={18}
												/>
											</Box>
										)}
									</Text>
									{!isSelf && data && (
										<HStack gap={4} align="center" justify="flex-end">
											{follow && (
												<Text mt={1} color="gray.500" fontSize="small">
													Segue você
												</Text>
											)}
											<Button
												title={
													isFollowing
														? 'Deixar de seguir'
														: follow
														? 'Seguir de volta'
														: 'Seguir'
												}
												display="flex"
												alignItems="center"
												justifyContent="center"
												size="sm"
												gap={2}
												color="black"
												backgroundColor={
													isFollowing ? 'red.400' : 'primary.main'
												}
												onClick={isFollowing ? unfollowUser : followUser}
												_hover={{
													backgroundColor: isFollowing
														? 'red.500'
														: 'primary.hover',
												}}
												_active={{
													backgroundColor: isFollowing
														? 'red.500'
														: 'primary.hover',
												}}
												_focus={{
													backgroundColor: isFollowing
														? 'red.500'
														: 'primary.hover',
												}}
												leftIcon={
													loading ? (
														<></>
													) : isFollowing ? (
														<FaHeartBroken />
													) : (
														<FaHeart />
													)
												}
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
				<VStack padding="0.5rem 0" spacing={1} align="flex-start" w="100%">
					<HStack
						w="100%"
						justify="space-between"
						padding="2rem 0 0.5rem"
						align="center"
					>
						<Text fontSize="2xl">Experiências profissionais</Text>
						{isSelf && (
							<Button
								display="flex"
								alignItems="center"
								justifyContent="center"
								size="sm"
								gap={2}
								css={{ gap: '0.5rem' }}
								w="fit-content"
								color="black"
								onClick={setOpenExperience}
								backgroundColor="primary.main"
								className="action_button"
								leftIcon={<AiFillPlusCircle />}
								_hover={{ backgroundColor: 'primary.hover' }}
								_active={{ backgroundColor: 'primary.hover' }}
								_focus={{ backgroundColor: 'primary.hover' }}
							>
								<Text mt={1} as="span">
									Adicionar
								</Text>
							</Button>
						)}
					</HStack>
					{(!prof?.experiences || prof?.experiences.length == 0) && (
						<Text fontSize="sm" color="gray.500">
							Não possui experiências profissionais
						</Text>
					)}
					{prof?.experiences && (
						<VStack
							align="flex-start"
							w="100%"
							spacing={6}
							divider={<StackDivider borderColor="gray.200" />}
						>
							{prof?.experiences.map((experience) => {
								return (
									<ExperienceCard
										isSelf={isSelf}
										games={gamesData}
										key={
											experience.jobTitle + experience.company + experience.id
										}
										experience={experience}
									/>
								);
							})}
						</VStack>
					)}
				</VStack>
				<VStack padding="0.5rem 0" spacing={1} align="flex-start" w="100%">
					<HStack
						w="100%"
						justify="space-between"
						padding="2rem 0 0.5rem"
						align="center"
					>
						<Text fontSize="2xl">Troféus</Text>
						{isSelf && (
							<Button
								display="flex"
								alignItems="center"
								justifyContent="center"
								size="sm"
								gap={2}
								className="action_button"
								css={{ gap: '0.5rem' }}
								w="fit-content"
								color="black"
								onClick={setOpenTrophy}
								backgroundColor="primary.main"
								leftIcon={<AiFillPlusCircle />}
								_hover={{ backgroundColor: 'primary.hover' }}
								_active={{ backgroundColor: 'primary.hover' }}
								_focus={{ backgroundColor: 'primary.hover' }}
							>
								<Text mt={1} as="span">
									Adicionar
								</Text>
							</Button>
						)}
					</HStack>
					{(!prof?.trophies || prof?.trophies.length == 0) && (
						<Text fontSize="sm" color="gray.500">
							Não possui troféus
						</Text>
					)}
					{prof?.trophies && (
						<VStack
							align="flex-start"
							w="100%"
							spacing={6}
							divider={<StackDivider borderColor="gray.200" />}
						>
							{prof?.trophies.map((trophy) => {
								return (
									<TrophiesCard
										isSelf={isSelf}
										key={trophy.championshipName + trophy.year + trophy.id}
										trophy={trophy}
									/>
								);
							})}
						</VStack>
					)}
				</VStack>
				<VStack padding="2rem 0" spacing={2} align="flex-start" w="100%">
					<Text fontSize="2xl">Interesses</Text>
					{(!prof?.interests || prof?.interests.length == 0) && (
						<Text fontSize="sm" color="gray.500">
							Não possui interesses
						</Text>
					)}
					<HStack
						w="100%"
						css={{ gap: '0.8rem' }}
						justify="flex-start"
						align="flex-start"
						wrap="wrap"
					>
						{interestsGames.map((game) => {
							return (
								<Popover key={game.name}>
									<Trigger>
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
									</Trigger>
									<PopoverContent>
										<PopoverCloseButton />
										<PopoverHeader>
											<Text fontSize="md">{game.name}</Text>
											<Text fontSize="smaller">{game.publisher}</Text>
										</PopoverHeader>
										<PopoverBody>
											<Text fontSize="smaller">{game.genre}</Text>
											<Text fontSize="smaller">{game.releaseDate}</Text>
										</PopoverBody>
									</PopoverContent>
								</Popover>
							);
						})}
					</HStack>
				</VStack>
				{data && menu && (
					<Fragment>
						<ModalExperience
							games={gamesData}
							isOpen={isOpenExperience}
							onClose={setOpenExperience}
						/>
						<ModalTrophy isOpen={isOpenTrophy} onClose={setOpenTrophy} />
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
				`/users?token=${encodeURI(decodeKeyAuthorization(nextauth))}`
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
