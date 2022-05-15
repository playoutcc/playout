import {
	Avatar,
	FormControl,
	HStack,
	Input,
	StackDivider,
	Text,
	useToast,
	VStack,
} from '@chakra-ui/react';
import { FC, useState } from 'react';
import { AiOutlineSearch } from 'react-icons/ai';
import { BiHome } from 'react-icons/bi';
import { api, decodeBody } from 'shared';

type User = {
	username: string;
	thumbnail: string;
};

export const SearchBar: FC = () => {
	const [users, setUsers] = useState<User[]>([]);
	const [show, setShow] = useState<boolean>(false);
	const [user, setUser] = useState<string>('');
	const toast = useToast();
	let timeout: any = null;
	const handleChange = async (username: string) => {
		const { data } = await api(`/users/search-bar/${username}`).get('');
		setUsers(Object.values(decodeBody(data)));
		if (!show) setShow(true);
		setUser(username);
	};
	return (
		<HStack gap={2} flex={1} divider={<StackDivider />}>
			<BiHome
				title="Ir para a página principal"
				cursor="pointer"
				onClick={(e) => window.location.replace('/')}
				size={20}
			/>
			<FormControl
				as="section"
				flex={1}
				zIndex={5}
				position="relative"
				w="fit-content"
				h="fit-content"
			>
				<label
					className="label-icon"
					style={{
						position: 'absolute',
						left: '12px',
						top: '30%',
						width: 'min-content',
						height: '100%',
						zIndex: 2,
						cursor: 'default',
						color: 'white',
					}}
					htmlFor="searchBar"
				>
					<AiOutlineSearch />
				</label>
				<Input
					w="100%"
					id="searchBar"
					maxW="240px"
					paddingLeft={10}
					_focus={{
						maxW: '350px',
						borderColor: 'primary.main',
						borderWidth: '1px',
						borderStroke: 'solid',
					}}
					autoComplete="off"
					defaultValue=""
					transition="all 600ms ease-in-out"
					colorScheme="teal"
					placeholder="Digite o nome de usuário"
					onFocus={(e: any) => {
						setTimeout(() => {
							setShow(true);
						}, 600);
					}}
					onBlur={(e: any) => {
						setTimeout(() => {
							setShow(false);
							if (e.target.value === '') {
								setUsers([]);
							}
						}, 600);
					}}
					onChange={(e: any) => {
						e.target.value = e.target.value.replace(/[^a-z1-9]/gm, '');
						clearTimeout(timeout);
						timeout = setTimeout(() => {
							if (e.target.value == '') return;
							handleChange(e.target.value);
						}, 750);
					}}
				/>
				{users.length != 0 && show && users && (
					<VStack
						position="absolute"
						height="fit-content"
						justify="flex-start"
						align="flex-start"
						w="100%"
						maxW="350px"
						backgroundColor="black"
						borderColor="primary.main"
						borderWidth="1px"
						borderStyle="solid"
						borderRadius="10px"
						padding="0.5rem 0"
						divider={<StackDivider />}
						css={{ left: '0', top: '40px' }}
						zIndex={3}
					>
						{users.map((user) => {
							return (
								<HStack
									key={user.username}
									onClick={() => {
										window.location.replace(`/${user.username}`);
										toast({
											title: 'Redirecionando para o perfil',
											status: 'warning',
											duration: 2500,
											isClosable: true,
											position: 'top-right',
										});
									}}
									borderRadius="10px"
									w="100%"
									h="fit-content"
									justify="flex-start"
									align="center"
									css={{ gap: '1rem' }}
									paddingLeft={10}
									paddingRight={2}
									paddingTop={2}
									paddingBottom={2}
									zIndex={4}
									cursor="pointer"
									_hover={{ backgroundColor: 'gray.900', color: 'white' }}
									_active={{ backgroundColor: 'gray.900', color: 'white' }}
									_focus={{ backgroundColor: 'gray.900', color: 'white' }}
								>
									<Avatar size="sm" src={user.thumbnail} name={user.username} />
									<Text fontSize="sm">{user.username}</Text>
								</HStack>
							);
						})}
						<HStack
							onClick={() => {
								window.location.replace(`/users?username=${user}`);
								toast({
									title: 'Buscando usuários',
									status: 'warning',
									duration: 2500,
									isClosable: true,
									position: 'top-right',
								});
							}}
							borderRadius="10px"
							w="100%"
							h="fit-content"
							justify="flex-start"
							align="center"
							css={{ gap: '1rem' }}
							paddingLeft={10}
							paddingRight={2}
							paddingTop={2}
							paddingBottom={2}
							zIndex={4}
							cursor="pointer"
							_hover={{ backgroundColor: 'gray.900', color: 'white' }}
							_active={{ backgroundColor: 'gray.900', color: 'white' }}
							_focus={{ backgroundColor: 'gray.900', color: 'white' }}
						>
							<Text fontSize="sm">Mostra mais</Text>
						</HStack>
					</VStack>
				)}
			</FormControl>
		</HStack>
	);
};
