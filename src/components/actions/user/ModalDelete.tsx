import {
	Alert,
	AlertIcon,
	Button,
	Modal,
	ModalBody,
	ModalCloseButton,
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
import { InputPassword } from 'components/layout';
import { destroyCookie } from 'nookies';
import { FC } from 'react';
import { useForm } from 'react-hook-form';
import { RiLockPasswordLine } from 'react-icons/ri';
import { api, encodeBody } from 'shared';
import * as yup from 'yup';

type Props = {
	isOpen: boolean;
	onClose: () => void;
	email: string;
	password: string;
};

type FieldsProps = {
	password: string;
};

const schema = yup.object().shape({
	password: yup
		.string()
		.required('Você deve digitar uma senha')
		.min(8, 'A senha deve ter no mínimo 8 caracteres')
		.max(32, 'A senha deve ter no máximo 32 caracteres'),
});

export const ModalDelete: FC<Props> = ({
	email,
	password,
	isOpen,
	onClose,
}) => {
	const [loading, { toggle: setLoading }] = useBoolean(false);
	const toast = useToast();
	const {
		register,
		handleSubmit,
		formState: { errors },
		reset,
	} = useForm<FieldsProps>({ resolver: yupResolver(schema) });
	const onSubmit = async ({ password }: FieldsProps) => {
		setLoading();
		try {
			await api('/auth').post('', encodeBody({ email, password }));
			await api(`/users?email=${email}`).delete('');
			setTimeout(() => {
				window.location.replace('/');
			}, 1500);
			destroyCookie(null, 'nextauth');
			toast({
				title: 'Sua conta foi deletada com sucesso',
				description: 'Em breve, você retornará para a tela de login',
				status: 'success',
				duration: 2500,
				isClosable: false,
				position: 'top-right',
			});
		} catch (err) {
			toast({
				title: 'Senha incorreta',
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
						Você tem certeza que deseja excluir sua conta?
					</Text>
					<Text fontSize="sm">Para excluir sua conta, digite sua senha</Text>
				</ModalHeader>
				<ModalCloseButton />
				<ModalBody>
					<VStack w="100%" as="form" spacing={8}>
						<InputPassword
							placeHolder="Digite sua senha"
							name="password"
							register={register}
							errors={errors}
							leftContent={<RiLockPasswordLine />}
						/>
						<Alert flex={1} status="warning">
							<AlertIcon />
							Após digitar sua senha, sua conta será deletada permanentemente.
						</Alert>
						<Button
							isDisabled={loading}
							isLoading={loading}
							type="submit"
							onClick={handleSubmit(onSubmit)}
							w="fit-content"
							color="black"
							colorScheme="red"
						>
							Deletar
						</Button>
					</VStack>
				</ModalBody>
				<ModalFooter></ModalFooter>
			</ModalContent>
		</Modal>
	);
};
