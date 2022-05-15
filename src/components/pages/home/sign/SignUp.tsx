import {
	Alert,
	AlertIcon,
	Button,
	HStack,
	ModalBody,
	ModalFooter,
	ModalHeader,
	PinInput,
	PinInputField,
	Spinner,
	Text,
	useBoolean,
	useToast,
	VStack,
} from '@chakra-ui/react';
import { yupResolver } from '@hookform/resolvers/yup';
import { Input, InputPassword } from 'components/layout';
import { FC, Fragment, useState } from 'react';
import { useForm } from 'react-hook-form';
import { MdOutlineAlternateEmail } from 'react-icons/md';
import { RiLockPasswordLine, RiUser2Fill } from 'react-icons/ri';
import { api, encodeBody } from 'shared';
import * as yup from 'yup';

type Props = {
	onClose: () => void;
};

type FieldsProps = {
	fullName: string;
	email: string;
	password: string;
	confirmPassword?: string;
};

const passwordRegex = new RegExp(
	'^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*])(?=.{8,32})'
);

const schema = yup.object().shape({
	fullName: yup
		.string()
		.required('Você deve digitar seu nome completo')
		.min(3, 'O nome deve ter no mínimo 3 caracteres'),
	email: yup
		.string()
		.required('Você deve digitar um email')
		.email('O email deve ser válido'),
	password: yup
		.string()
		.required('Você deve digitar uma senha')
		.min(8, 'A senha deve ter no mínimo 8 caracteres')
		.max(32, 'A senha deve ter no máximo 32 caracteres')
		.matches(
			passwordRegex,
			'Sua senha deve ter ao menos 1 caracterer especial, 1 letra maiúscula, 1 letra minúscula e 1 digito'
		),
	confirmPassword: yup
		.string()
		.oneOf([yup.ref('password'), null], 'As senhas não conferem'),
});

export const SignUp: FC<Props> = ({ onClose }) => {
	const [loading, { toggle: setLoading }] = useBoolean(false);
	const [step, setStep] = useState<number>(0);
	const [error, setError] = useState(false);
	const stepPhrases = [
		{ title: 'Cadastre-se', description: 'Você está a um passo da evolução' },
		{
			title: 'Digite o PIN',
			description:
				'Você recebeu um PIN por email, você não deve sair dessa página',
		},
	];
	const toast = useToast();
	const {
		register,
		handleSubmit,
		formState: { errors },
		reset,
	} = useForm<FieldsProps>({ resolver: yupResolver(schema) });
	const onSubmit = async (fields: FieldsProps) => {
		setLoading();
		try {
			await api('/users/verify-email')
				.post('', encodeBody({ email: fields.email }))
				.then(() => {
					toast({
						title: 'Email já cadastrado',
						status: 'error',
						duration: 2500,
						isClosable: true,
						position: 'top-right',
					});
				})
				.catch(async () => {
					delete fields.confirmPassword;
					await api('/users').post('', encodeBody(fields));
					toast({
						title: 'Verifique sua caixa de entrada',
						status: 'success',
						duration: 2500,
						isClosable: true,
						position: 'top-right',
					});
					setStep(1);
				});
		} catch (err) {
			toast({
				title: 'Houve um erro ao tentar criar sua conta',
				status: 'error',
				duration: 2500,
				isClosable: true,
				position: 'top-right',
			});
		}
		setLoading();
	};
	const validatePin = async (token: string) => {
		setLoading();
		try {
			await api(`/users/confirm/${token}`).get('');
			toast({
				title: 'Sua conta foi confirmada com sucesso',
				status: 'success',
				duration: 2500,
				isClosable: true,
				position: 'top-right',
			});
			onClose();
		} catch (err) {
			toast({
				title: 'Token inválido',
				status: 'error',
				duration: 2500,
				isClosable: true,
				position: 'top-right',
			});
		}
		setLoading();
	};
	return (
		<Fragment>
			<ModalHeader>
				<Text fontSize="3xl">{stepPhrases[step].title}</Text>
				<Text fontSize="sm">{stepPhrases[step].description}</Text>
			</ModalHeader>
			<ModalBody>
				{step === 0 && (
					<VStack w="100%" as="form" spacing={4}>
						<Input
							placeHolder="Digite seu nome completo"
							name="fullName"
							type="text"
							inputMode="text"
							register={register}
							errors={errors}
							leftContent={<RiUser2Fill />}
						/>
						<Input
							placeHolder="Digite seu email"
							name="email"
							type="email"
							inputMode="email"
							register={register}
							errors={errors}
							leftContent={<MdOutlineAlternateEmail />}
						/>
						<InputPassword
							placeHolder="Digite sua senha"
							name="password"
							register={register}
							errors={errors}
							leftContent={<RiLockPasswordLine />}
						/>
						<InputPassword
							placeHolder="Confirme sua senha"
							name="confirmPassword"
							register={register}
							errors={errors}
							leftContent={<RiLockPasswordLine />}
						/>
					</VStack>
				)}
				{step === 1 && loading && (
					<VStack spacing={10}>
						<Spinner colorScheme="teal" />
						<Alert flex={1} status="warning">
							<AlertIcon />
							Aguarde enquanto validamos seu token.
						</Alert>
					</VStack>
				)}
				{step === 1 && !loading && (
					<VStack spacing={10}>
						<HStack justify="center">
							<PinInput
								isDisabled={loading}
								isInvalid={error}
								errorBorderColor="error"
								focusBorderColor="primary.main"
								onChange={() => setError(false)}
								onComplete={validatePin}
							>
								<PinInputField />
								<PinInputField />
								<PinInputField />
								<PinInputField />
								<PinInputField />
								<PinInputField />
							</PinInput>
						</HStack>
						<Alert flex={1} status="warning">
							<AlertIcon />
							Verifique seu lixo eletrônico.
						</Alert>
					</VStack>
				)}
			</ModalBody>
			<ModalFooter>
				{step === 0 && (
					<HStack w="100%" justify="space-between">
						<Button w="fit-content" variant="ghost" onClick={onClose}>
							Cancelar
						</Button>
						<Button
							type="submit"
							onClick={handleSubmit(onSubmit)}
							w="fit-content"
							color="black"
							backgroundColor="primary.main"
							_hover={{ backgroundColor: 'primary.hover' }}
							isLoading={loading}
							isDisabled={loading}
						>
							Cadastrar
						</Button>
					</HStack>
				)}
			</ModalFooter>
		</Fragment>
	);
};
