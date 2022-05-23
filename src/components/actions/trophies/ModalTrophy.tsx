import {
	Button,
	HStack,
	Modal,
	ModalBody,
	ModalContent,
	ModalFooter,
	ModalHeader,
	ModalOverlay,
	Text,
	useBoolean,
	useToast,
	VStack,
} from '@chakra-ui/react';
import { yupResolver } from '@hookform/resolvers/yup';
import { Input } from 'components/layout';
import { parseCookies } from 'nookies';
import { FC } from 'react';
import { useForm } from 'react-hook-form';
import { AiFillTrophy } from 'react-icons/ai';
import { BiCalendar } from 'react-icons/bi';
import { GiChampions, GiPodium } from 'react-icons/gi';
import { api, decodeKeyAuthorization, encodeBody, Trophy } from 'shared';
import * as yup from 'yup';

type FieldsProps = {
	championshipName: string;
	team?: string;
	year: string;
	position: string;
};

const schema = yup.object().shape(
	{
		championshipName: yup
			.string()
			.required('Você deve digitar o nome do campeonato')
			.min(4, 'O nome do campeonato deve ter no mínimo 4 caracteres'),
		team: yup
			.string()
			.notRequired()
			.when('team', {
				is: (value: any) => value?.length,
				then: (rule) =>
					rule.min(2, 'O nome do time deve ter no mínimo 2 caracteres'),
			}),
		year: yup
			.string()
			.min(4, 'Data inválida')
			.max(4, 'Data inválida')
			.required('Você deve digitar o ano do campeonato'),
		position: yup
			.string()
			.notRequired()
			.when('team', {
				is: (value: any) => value?.length,
				then: (rule) => rule.min(1, 'Data inválida'),
			}),
	},
	[
		['team', 'team'],
		['position', 'position'],
	]
);

type Props = {
	isOpen: boolean;
	onClose: () => void;
	edit?: Trophy;
};

const ModalTrophy: FC<Props> = ({ isOpen, onClose, edit }) => {
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
	const onSubmit = async (fields: FieldsProps) => {
		setLoading();
		if (!fields.team) delete fields.team;
		const bodyUpdated = {
			trophies: {
				update: {
					data: {
						...fields,
					},
					where: {
						id: edit?.id,
					},
				},
			},
		};
		const body = {
			trophies: {
				create: {
					...fields,
				},
			},
		};
		try {
			await api(
				`/users?token=${encodeURI(decodeKeyAuthorization(nextauth))}`
			).put('', encodeBody(edit ? bodyUpdated : body));
			window.location.reload();
			toast({
				title: `Troféu ${edit ? 'editado' : 'adicionado'} com sucesso`,
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
					<Text fontSize="3xl">{edit ? 'Editar' : 'Adicionar'} troféu</Text>
				</ModalHeader>
				<ModalBody>
					<VStack w="100%" as="form">
						<Input
							leftContent={<AiFillTrophy />}
							name="championshipName"
							errors={errors}
							register={register}
							placeHolder="Digite o nome do campeonato"
							value={edit ? edit.championshipName : ''}
						/>
						<Input
							leftContent={<BiCalendar />}
							name="year"
							errors={errors}
							register={register}
							placeHolder="Digite o ano"
							handleChange={(e: any) => {
								e.target.value = e.target.value.replace(/[^0-9]/gm, '');
								let value = e.target.value;
								if (value.length === 4) {
									if (Number(value) > new Date().getFullYear()) {
										e.target.value = '2022';
									}
									if (Number(value) < 1972) {
										e.target.value = '1972';
									}
								}
							}}
							inputProps={{ maxLength: 4, minLength: 4 }}
							value={edit ? edit.year : '2022'}
						/>
						<Input
							required={false}
							leftContent={<GiChampions />}
							name="team"
							errors={errors}
							register={register}
							placeHolder="Digite o nome do time"
							value={edit?.team ? edit?.team : ''}
						/>
						<Input
							required={false}
							leftContent={<GiPodium />}
							name="position"
							errors={errors}
							register={register}
							handleChange={(e: any) => {
								e.target.value = e.target.value.replace(/[^0-9]/g, '');
							}}
							placeHolder="Digite a colocação"
							value={edit?.position ? edit?.position + '°' : ''}
						/>
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

export default ModalTrophy;
