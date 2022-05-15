import {
	Button,
	HStack,
	Modal,
	ModalBody,
	ModalCloseButton,
	ModalContent,
	ModalFooter,
	ModalHeader,
	ModalOverlay,
	Select,
	Tag,
	Text,
	useBoolean,
	useToast,
	VStack,
} from '@chakra-ui/react';
import { yupResolver } from '@hookform/resolvers/yup';
import { Input, TextArea } from 'components/layout';
import moment from 'moment';
import { parseCookies } from 'nookies';
import { FC, useState } from 'react';
import { useForm } from 'react-hook-form';
import { GrUserWorker } from 'react-icons/gr';
import { MdOutlineBusiness } from 'react-icons/md';
import { api, decodeKeyAuthorization, encodeBody, Games } from 'shared';
import * as yup from 'yup';

type FieldsProps = {
	jobTitle: string;
	company: string;
	startDate: string;
	endDate?: string;
	description: string;
};

type Experience = {
	id: string;
	jobTitle: string;
	company: string;
	startDate: string;
	endDate?: string;
	description: string;
	games: string[];
};

type Props = {
	games: Games[];
	isOpen: boolean;
	onClose: () => void;
	edit?: Experience;
};

const schema = yup.object().shape({
	jobTitle: yup
		.string()
		.required('O cargo é necessário')
		.min(3, 'O cargo deve ter no mínimo 3 caracteres'),
	company: yup
		.string()
		.required('A empresa é necessária')
		.min(2, 'A empresa deve ter no mínimo 2 caracteres'),
	startDate: yup.string().required('Necessário'),
	endDate: yup.string().notRequired(),
	description: yup
		.string()
		.required('A descrição é necessária')
		.min(6, 'Digite ao menos 6 caracteres'),
});

export const ModalExperience: FC<Props> = ({
	isOpen,
	onClose,
	games,
	edit,
}) => {
	const {
		register,
		handleSubmit,
		formState: { errors },
		reset,
		setError,
	} = useForm<FieldsProps>({ resolver: yupResolver(schema) });
	const toast = useToast();
	const [loading, { toggle: setLoading }] = useBoolean(false);
	const { nextauth } = parseCookies(null);
	const [gamesSelected, setGamesSelected] = useState<string[]>(
		edit ? edit.games : []
	);
	const onSubmit = async (fields: FieldsProps) => {
		setLoading();
		const startDate = moment(fields.startDate);
		const endDate = moment(fields.endDate);
		if (fields.endDate) {
			if (startDate.diff(endDate, 'day') > 0) {
				setError('startDate', { type: 'custom', message: 'Periodo inválido' });
				setError('endDate', { type: 'custom', message: 'Periodo inválido' });
				setLoading();
				return;
			}
			if (endDate.diff(moment(), 'day') > 0) {
				setError('endDate', {
					type: 'custom',
					message: 'Você está no futuro?',
				});
				setLoading();
				return;
			}
		}
		if (startDate.diff(moment().subtract(120, 'year'), 'day') < 0) {
			setError('startDate', {
				type: 'custom',
				message: 'Você tem quantos anos?',
			});
			setLoading();
			return;
		}
		if (fields.endDate == '') fields.endDate = undefined;
		const bodyUpdated = {
			experiences: {
				update: {
					data: {
						...fields,
						games: gamesSelected,
					},
					where: {
						id: edit?.id,
					},
				},
			},
		};
		const body = {
			experiences: {
				create: {
					...fields,
					games: gamesSelected,
				},
			},
		};
		try {
			await api(
				`/users?token=${encodeURI(decodeKeyAuthorization(nextauth))}`
			).put('', encodeBody(edit ? bodyUpdated : body));
			window.location.reload();
			toast({
				title: `Experiência ${edit ? 'editada' : 'adicionada'} com sucesso`,
				status: 'success',
				duration: 2500,
				isClosable: false,
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
		setLoading();
	};
	return (
		<Modal isCentered isOpen={isOpen} onClose={onClose}>
			<ModalOverlay backgroundColor="blackAlpha.800" />
			<ModalContent borderWidth="1px" borderColor="primary.main">
				<ModalHeader>
					<Text fontSize="3xl">
						{edit ? 'Editar' : 'Adicionar'} experiência
					</Text>
					<Text fontSize="sm">Lembre-se de detalhar tudo</Text>
				</ModalHeader>
				<ModalCloseButton />
				<ModalBody>
					<VStack w="100%" as="form">
						<Input
							leftContent={<GrUserWorker className="svg-label" />}
							name="jobTitle"
							errors={errors}
							register={register}
							placeHolder="Digite seu cargo"
							value={edit ? edit.jobTitle : ''}
						/>
						<Input
							leftContent={<MdOutlineBusiness />}
							name="company"
							errors={errors}
							register={register}
							placeHolder="Digite o nome da empresa"
							value={edit ? edit.company : ''}
						/>
						<HStack
							w="100%"
							wrap="wrap"
							align="flex-start"
							css={{ gap: '0.5rem' }}
						>
							<VStack minW="190px" flex={1} h="fit-content">
								<Text alignSelf="flex-start" as="label" htmlFor="startDate">
									Data de início
								</Text>
								<Input
									name="startDate"
									type="date"
									errors={errors}
									register={register}
									placeHolder=""
									value={edit ? edit.startDate : ''}
								/>
							</VStack>
							<VStack minW="190px" flex={1} h="fit-content">
								<Text alignSelf="flex-start" as="label" htmlFor="endDate">
									Data de fim
								</Text>
								<Input
									name="endDate"
									type="date"
									errors={errors}
									register={register}
									placeHolder=""
									value={edit?.endDate ? edit.endDate : ''}
								/>
							</VStack>
						</HStack>
						<TextArea
							placeHolder="Qual seu papel?"
							name="description"
							register={register}
							errors={errors}
							value={edit ? edit.description : ''}
						/>
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
								padding="1rem 0"
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
					</VStack>
				</ModalBody>
				<ModalFooter>
					<HStack w="100%" justify="space-between">
						<Button w="fit-content" variant="ghost" onClick={onClose}>
							Cancelar
						</Button>
						<Button
							onClick={handleSubmit(onSubmit)}
							w="fit-content"
							color="black"
							type="submit"
							disabled={loading}
							isDisabled={loading}
							isLoading={loading}
							backgroundColor="primary.main"
							_hover={{ backgroundColor: 'primary.hover' }}
							_active={{ backgroundColor: 'primary.hover' }}
							_focus={{ backgroundColor: 'primary.hover' }}
						>
							{edit ? 'Editar' : 'Adicionar'}
						</Button>
					</HStack>
				</ModalFooter>
			</ModalContent>
		</Modal>
	);
};
