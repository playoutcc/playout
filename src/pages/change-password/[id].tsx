import { Button, Text, useBoolean, useToast, VStack } from '@chakra-ui/react';
import { yupResolver } from '@hookform/resolvers/yup';
import { Footer, InputPassword, Main } from 'components/layout';
import { removeCookies } from 'cookies-next';
import { NextPage } from 'next';
import Error from 'next/error';
import Head from 'next/head';
import { destroyCookie } from 'nookies';
import { Fragment } from 'react';
import { useForm } from 'react-hook-form';
import { RiLockPasswordLine } from 'react-icons/ri';
import { api, encodeBody } from 'shared';
import * as yup from 'yup';

type Props = {
	id?: string;
};

type FieldsProps = {
	password: string;
	confirmPassword?: string;
};

const schema = yup.object().shape({
	password: yup
		.string()
		.required('Você deve digitar uma senha')
		.min(8, 'A senha deve ter no mínimo 8 caracteres')
		.max(32, 'A senha deve ter no máximo 32 caracteres'),
	confirmPassword: yup
		.string()
		.oneOf([yup.ref('password'), null], 'As senhas não conferem'),
});

const ChangePassword: NextPage<Props> = ({ id }) => {
	const {
		register,
		handleSubmit,
		formState: { errors },
		reset,
	} = useForm<FieldsProps>({ resolver: yupResolver(schema) });
	const [loading, { toggle: setLoading }] = useBoolean(false);
	const toast = useToast();
	if (!id) return <Error statusCode={404} />;
	const onSubmit = async ({ password }: FieldsProps) => {
		setLoading();
		try {
			await api(`/users/change-password/${id}`).put(
				'',
				encodeBody({ password })
			);
			window.location.replace('/');
			toast({
				title: 'Senha alterada com sucesso',
				description: 'Em breve você retornará para a página inicial',
				status: 'success',
				duration: 2500,
				isClosable: true,
				position: 'top-right',
			});
		} catch (err) {
			toast({
				title: 'Houve um erro ao tentar alterar sua senha',
				description: 'Tente novamente mais tarde',
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
			<Head>
				<title>Playout | Mudar senha</title>
			</Head>
			<Main css={{ flex: 1, maxHeight: '1000px', justifyContent: 'center' }}>
				<VStack h="fit-content" w="100%" maxW="420px" spacing={5} as="section">
					<Text fontSize="xl">Altere sua senha</Text>
					<VStack
						w="100%"
						as="form"
						spacing={4}
						onSubmit={handleSubmit(onSubmit)}
					>
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
						<Button
							w="100%"
							color="black"
							backgroundColor="primary.main"
							type="submit"
							isDisabled={loading}
							disabled={loading}
							isLoading={loading}
							_hover={{ backgroundColor: 'primary.hover' }}
							_active={{ backgroundColor: 'primary.hover' }}
							_focus={{ backgroundColor: 'primary.hover' }}
						>
							Alterar senha
						</Button>
					</VStack>
				</VStack>
			</Main>
			<Footer />
		</Fragment>
	);
};

ChangePassword.getInitialProps = async (ctx): Promise<Props> => {
	class E {
		constructor(private message: string) {}
	}
	const { req, res } = ctx;
	let id: string | undefined = ctx.query.id as string;
	try {
		if (!id) throw new E('Não foi passado um ID');
		await api(`/users/change-password?id=${encodeURI(id)}`).get('');
	} catch (err) {
		removeCookies('nextauth', { req, res });
		destroyCookie(ctx, 'nextauth');
		id = undefined;
	} finally {
		return {
			id,
		};
	}
};

export default ChangePassword;
