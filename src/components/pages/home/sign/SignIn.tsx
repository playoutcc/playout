import {
	Button,
	Checkbox,
	HStack,
	Text,
	useBoolean,
	useToast,
	VStack,
} from '@chakra-ui/react';
import { yupResolver } from '@hookform/resolvers/yup';
import { Input, InputPassword } from 'components/layout';
import { useUser } from 'contexts';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { MdOutlineAlternateEmail } from 'react-icons/md';
import { RiLockPasswordLine } from 'react-icons/ri';
import { api } from 'shared';
import * as yup from 'yup';

type FieldsProps = {
	email: string;
	password: string;
};

const EMAIL_REGEX =
	/^([a-zA-Z0-9!#$%&'*+\/=?^_`{|}~-]+(?:\.[a-zA-Z0-9!#$%&'*+\/=?^_`{|}~-]+)*@(?:[a-zA-Z0-9](?:[a-zA-Z0-9-]*[a-zA-Z0-9])?\.)+[a-zA-Z0-9](?:[a-zA-Z0-9-]*[a-zA-Z0-9])?)$/;

const schema = yup.object().shape({
	email: yup
		.string()
		.required('Você deve digitar um email')
		.email('O email deve ser válido'),
	password: yup
		.string()
		.required('Você deve digitar uma senha')
		.min(8, 'A senha deve ter no mínimo 8 caracteres')
		.max(32, 'A senha deve ter no máximo 32 caracteres'),
});

export const SignIn = () => {
	const { isPending, login } = useUser();
	const [loading, { toggle: setLoading }] = useBoolean(false);
	const toast = useToast();
	const [email, setEmail] = useState<string>('');
	const [connected, { toggle: setConnected }] = useBoolean(false);
	const {
		register,
		handleSubmit,
		formState: { errors },
		reset,
	} = useForm<FieldsProps>({ resolver: yupResolver(schema) });
	const onSubmit = async (fields: FieldsProps) => {
		await login({ ...fields, connected });
	};
	const changePassword = async () => {
		if (email == '') {
			toast({
				title: 'Digite um email',
				description: 'Precisamos dele para mudar sua senha',
				status: 'error',
				duration: 2000,
				isClosable: true,
				position: 'top-right',
			});
			return;
		}
		if (!EMAIL_REGEX.test(email)) {
			toast({
				title: 'Digite um email válido',
				status: 'error',
				duration: 2000,
				isClosable: true,
				position: 'top-right',
			});
			return;
		}
		setLoading();
		try {
			await api(`/users/change-password?email=${email}`).get('');
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
		setLoading();
	};
	return (
		<VStack w="100%" as="form" spacing={4} onSubmit={handleSubmit(onSubmit)}>
			<Input
				placeHolder="Digite seu email"
				name="email"
				type="email"
				inputMode="email"
				register={register}
				errors={errors}
				leftContent={<MdOutlineAlternateEmail />}
				handleChange={(e) => {
					setEmail(e.target.value);
				}}
			/>
			<InputPassword
				placeHolder="Digite sua senha"
				name="password"
				register={register}
				errors={errors}
				leftContent={<RiLockPasswordLine />}
			/>
			<HStack justify="flex-start" w="100%">
				<Checkbox
					onChange={setConnected}
					value={`${connected}`}
					defaultChecked={connected}
					colorScheme="teal"
					css={{ gap: '0.5rem' }}
				>
					Mantenha-me conectado.
				</Checkbox>
			</HStack>
			<Button
				w="100%"
				type="submit"
				isLoading={isPending || loading}
				isDisabled={isPending || loading}
				color="black"
				backgroundColor="primary.main"
				_hover={{ backgroundColor: 'primary.hover' }}
				_active={{ backgroundColor: 'primary.hover' }}
				_focus={{ backgroundColor: 'primary.hover' }}
			>
				Entrar
			</Button>
			<Text
				onClick={changePassword}
				_hover={{ textDecoration: 'underline', cursor: 'pointer' }}
				fontSize="sm"
				alignSelf="flex-start"
			>
				Esqueci minha senha
			</Text>
		</VStack>
	);
};
