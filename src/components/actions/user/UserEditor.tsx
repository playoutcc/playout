import {
	Button,
	Checkbox,
	HStack,
	Select,
	Tag,
	Text,
	useBoolean,
	useToast,
	VStack,
} from '@chakra-ui/react';
import { yupResolver } from '@hookform/resolvers/yup';
import {
	Footer,
	Header,
	Input,
	InputFile,
	Main,
	TextArea,
} from 'components/layout';
import { useUser } from 'contexts';
import Head from 'next/head';
import { parseCookies } from 'nookies';
import { FC, Fragment, useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { BiStreetView } from 'react-icons/bi';
import { RiUser2Fill } from 'react-icons/ri';
import {
	api,
	decodeKeyAuthorization,
	encodeBody,
	Games,
	saveFile,
	User,
} from 'shared';
import * as yup from 'yup';

type Props = {
	fullName: string;
	games: Games[];
	edit?: User;
};

type FieldsProps = {
	username: string;
	description: string;
	city: string;
	province: string;
	cep: string;
};

type Address = {
	city?: string;
	province?: string;
};

const schema = yup.object().shape({
	username: yup
		.string()
		.required('O nome de usuário é necessário')
		.min(3, 'O nome de usuário deve ter no mínimo 3 caracteres')
		.max(25, 'O nome de usuário deve ter no máximo 25 caracteres'),
	description: yup
		.string()
		.required('Você deve escrever uma descrição')
		.min(5, 'Sua descrição deve ter no mínimo 5 caracteres')
		.max(250, 'Sua descrição deve ter no máximo 250 caracteres'),
	city: yup
		.string()
		.min(2, 'A cidade deve ter no mínimo 2 caracteres')
		.max(25, 'A cidade deve ter no máximo 25 caracteres'),
	province: yup
		.string()
		.min(2, 'O estado deve ter no mínimo 2 caracteres')
		.max(2, 'O estado deve ter no máximo 2 caracteres'),
	cep: yup
		.string()
		.min(8, 'O CEP deve ter 8 digitos')
		.max(8, 'O CEP deve ter 8 digitos')
		.required('Você deve digitar o CEP'),
});

export const UserEditor: FC<Props> = ({ fullName, games, edit }) => {
	const { logout } = useUser();
	const [showCep, setShowCep] = useState<boolean>(!edit);
	const { nextauth } = parseCookies(null);
	const toast = useToast();
	const [file, setFile] = useState<string | null>(
		edit ? edit.thumbnail! : null
	);
	const [user, setUser] = useState(edit ? edit.username : fullName);
	const [loading, { toggle: setLoading }] = useBoolean(false);
	const [gamesSelected, setGamesSelected] = useState<string[]>(
		edit ? edit.interests : []
	);
	const [{ city, province }, setAddress] = useState<Address>({
		city: edit ? edit.address?.city : undefined,
		province: edit ? edit.address?.province : undefined,
	});
	const {
		register,
		handleSubmit,
		setValue,
		formState: { errors },
		reset,
	} = useForm<FieldsProps>({ resolver: yupResolver(schema) });
	useEffect(() => {
		if (showCep) {
			setValue('cep', '');
		}
		if (!showCep && edit) {
			setValue('cep', '11111111');
		}
	}, [showCep, edit, setValue]);
	const searchCep = (cep: string) => {
		if (!showCep) return;
		if (cep.replace(/[^-0-9]/gm, '').length != 8) return;
		setLoading();
		fetch(`https://viacep.com.br/ws/${cep}/json/`).then((response) => {
			response
				.json()
				.then((address) => {
					setAddress({ city: address.localidade, province: address.uf });
				})
				.catch((err) => {
					setAddress({ city: undefined, province: undefined });
					toast({
						title: 'CEP não encontrado',
						status: 'error',
						duration: 2500,
						isClosable: true,
						position: 'top-right',
					});
				});
		});
		setLoading();
	};
	const handleChange = (file: File) => {
		setLoading();
		const reader = new FileReader();
		reader.onload = async (ev) => {
			let result = ev.target?.result as string;
			setFile(result);
		};
		reader.readAsDataURL(file);
		setLoading();
	};
	const onSubmit = async (fields: FieldsProps) => {
		if (!file) return;
		setLoading();
		await api('/users/verify-username')
			.post(
				'',
				encodeBody({
					username:
						edit?.username === fields.username
							? 'DAIWIDWADWA'
							: fields.username,
				})
			)
			.then(() => {
				toast({
					title: 'Usuário já está em uso',
					status: 'error',
					duration: 2500,
					isClosable: true,
					position: 'top-right',
				});
			})
			.catch(async () => {
				await saveFile(file)
					.then(async (thumbnail) => {
						let body: any = {
							username: fields.username,
							description: fields.description,
							thumbnail,
							interests: gamesSelected,
						};
						body.address = edit
							? { update: { id: edit.address?.id, province, city } }
							: { create: { province, city } };
						try {
							await api(
								`/users?token=${encodeURI(decodeKeyAuthorization(nextauth))}`
							).put('', encodeBody(body));
							window.location.reload();
							toast({
								title: 'Atualizado com sucesso',
								description: 'Estamos redirecionando você',
								status: 'success',
								duration: 3500,
								isClosable: true,
								position: 'top-right',
							});
						} catch (err) {
							toast({
								title: 'Tente novamente mais tarde',
								description: 'Não conseguimos atualizar seus dados',
								status: 'error',
								duration: 2500,
								isClosable: true,
								position: 'top-right',
							});
						}
					})
					.catch(() => {
						toast({
							title: 'Tente novamente mais tarde',
							description: 'Houve um erro ao tentar salvar seu arquivo',
							status: 'error',
							duration: 2500,
							isClosable: true,
							position: 'top-right',
						});
					});
			});
		setLoading();
	};
	return (
		<Fragment>
			{!edit && (
				<Fragment>
					<Head>
						<title>Playout | Primeiro acesso</title>
					</Head>
					<Header>
						<Button
							size="sm"
							w="fit-content"
							color="black"
							backgroundColor="primary.main"
							onClick={logout}
							_hover={{ backgroundColor: 'primary.hover' }}
							_active={{ backgroundColor: 'primary.hover' }}
							_focus={{ backgroundColor: 'primary.hover' }}
						>
							Sair
						</Button>
					</Header>
				</Fragment>
			)}
			<Main>
				<Text padding="0 0 1.5rem">
					Olá{' '}
					<Text as="span" color="primary.main">
						{user}
					</Text>
					{!edit && ', seja bem vindo'}
				</Text>
				<VStack
					justify="center"
					flex={1}
					w="100%"
					maxW="420px"
					spacing={5}
					as="form"
					onSubmit={handleSubmit(onSubmit)}
				>
					<VStack spacing={2} as="section" w="100%">
						<Text fontSize="xl" alignSelf="flex-start">
							Informações pessoais
						</Text>
						<InputFile
							handleChange={handleChange}
							title="Selecione uma foto de perfil"
							multiple={false}
							name="avatar"
							label="Arraste sua foto de perfil aqui, ou clique para escolher"
							types={['JPEG', 'PNG', 'JPG']}
							maxSize={10}
							file={file}
							fullName={fullName}
						/>
						<Input
							placeHolder="Digite seu nome de usuário"
							name="username"
							type="username"
							inputMode="text"
							register={register}
							value={edit ? edit.username : undefined}
							handleChange={(e) => {
								e.target.value = e.target.value.replace(/[^a-z1-9]/gm, '');
								setUser(e.target.value);
							}}
							errors={errors}
							leftContent={<RiUser2Fill />}
						/>
						<TextArea
							placeHolder="Descreva você"
							errors={errors}
							name="description"
							value={edit ? edit.description : undefined}
							register={register}
						/>
					</VStack>
					<VStack spacing={2} as="section" w="100%">
						<Text fontSize="xl" alignSelf="flex-start">
							Endereço
						</Text>
						{showCep && (
							<Input
								placeHolder="CEP"
								name="cep"
								type="text"
								inputMode="text"
								register={register}
								errors={errors}
								handleChange={(e) => {
									e.target.value = e.target.value.replace(/[^-0-9]/gm, '');
									if (city && province) {
										setAddress({ city: undefined, province: undefined });
									}
									if (e.target.value.length === 8) {
										searchCep(e.target.value);
									}
								}}
								inputProps={{ maxLength: 8, autoComplete: 'off' }}
								css={{ flex: 1 }}
								leftContent={<BiStreetView />}
							/>
						)}
						<HStack css={{ gap: '0.5rem' }} w="100%" justify="space-between">
							{city && province && (
								<Fragment>
									<Input
										placeHolder="Cidade"
										name="city"
										type="text"
										inputMode="text"
										register={register}
										errors={errors}
										css={{ flex: 6 }}
										value={city}
										disabled
										showErrorMessage={false}
										leftContent={<BiStreetView />}
										handleChange={(e) => {
											e.target.value = e.target.value.replace(
												/[^-a-zA-Z\s]/gm,
												''
											);
										}}
									/>
									<Input
										placeHolder="UF"
										name="province"
										type="text"
										inputMode="text"
										register={register}
										errors={errors}
										disabled
										handleChange={(e) => {
											e.target.value = e.target.value
												.replace(/[^-a-zA-Z\s]/gm, '')
												.toUpperCase();
										}}
										value={province}
										inputProps={{ maxLength: 2 }}
										css={{ flex: 2 }}
										showErrorMessage={false}
										leftContent={<BiStreetView />}
									/>
								</Fragment>
							)}
						</HStack>
						{edit && (
							<HStack py={2} align="center" justify="flex-start" w="100%">
								<Checkbox
									defaultValue="false"
									colorScheme="teal"
									onChange={(e: any) => setShowCep(e.target.checked)}
									id="show-cep"
								/>
								<Text fontSize="sm" as="label" htmlFor="show-cep">
									Editar endereço
								</Text>
							</HStack>
						)}
						<VStack alignSelf="flex-start" alignItems="flex-start">
							{errors.city && (
								<Text fontSize="sm" color="#fc8181">
									{errors.city.message}
								</Text>
							)}
							{errors.province && (
								<Text align="start" fontSize="sm" color="#fc8181">
									{errors.province.message}
								</Text>
							)}
						</VStack>
					</VStack>
					<VStack spacing={-2} w="100%" align="flex-start">
						<Text fontSize="xl" alignSelf="flex-start">
							Interesses
						</Text>
						<Text fontSize="sm" color="gray.400" alignSelf="flex-start">
							Isso nos ajudará a filtrar nosso conteúdo
						</Text>
					</VStack>
					<Select
						onChange={(e: any) => {
							setGamesSelected([...gamesSelected, e.target.value]);
						}}
						value="disabled"
					>
						<option style={{ display: 'none' }} disabled value="disabled">
							Escolha um jogo
						</option>
						{games.map((game) => {
							if (gamesSelected.includes(game.name)) return;
							return (
								<option value={game.name} key={game.name}>
									{game.name}
								</option>
							);
						})}
					</Select>
					{gamesSelected.length != 0 && (
						<HStack
							w="100%"
							wrap="wrap"
							align="flex-start"
							justify="flex-start"
							css={{ gap: '0.4rem' }}
						>
							{gamesSelected.map((game) => {
								return (
									<Tag
										cursor="pointer"
										onClick={() => {
											const games = gamesSelected.filter((g) => g != game);
											setGamesSelected(games);
										}}
										key={game}
										_hover={{
											backgroundColor: 'primary.main',
											color: 'black',
										}}
									>
										{game}
									</Tag>
								);
							})}
						</HStack>
					)}
					<Button
						w="100%"
						color="black"
						backgroundColor="primary.main"
						type="submit"
						_hover={{ backgroundColor: 'primary.hover' }}
						_active={{ backgroundColor: 'primary.hover' }}
						_focus={{ backgroundColor: 'primary.hover' }}
						isLoading={loading}
						isDisabled={loading}
					>
						{edit ? 'Editar perfil' : 'Finalizar cadastro'}
					</Button>
				</VStack>
			</Main>
			{!edit && <Footer />}
		</Fragment>
	);
};
