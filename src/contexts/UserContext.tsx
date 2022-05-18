import { useBoolean, useToast } from '@chakra-ui/react';
import { AxiosError } from 'axios';
import { removeCookies } from 'cookies-next';
import { setCookie } from 'nookies';
import { createContext, FC, PropsWithChildren, useContext } from 'react';
import { api, decodeBody, encodeBody, encodeKeyAuthorization } from 'shared';

type Props = {
	login: (fields: any) => Promise<void>;
	logout: () => Promise<void>;
	isPending: boolean;
};

const userContext = createContext({} as Props);

export const UserProvider: FC<PropsWithChildren<{}>> = ({ children }) => {
	const [isPending, { toggle: setPending }] = useBoolean(false);
	const toast = useToast();
	const logout = async () => {
		new Promise<void>((res, rej) => {
			setTimeout(() => {
				removeCookies('nextauth');
				res();
			}, 1000);
		}).then(() => {
			setTimeout(() => {
				window.location.replace('/');
			}, 2000);
			toast({
				title: 'Saindo da conta...',
				status: 'warning',
				duration: 2500,
				isClosable: false,
				position: 'top-right',
			});
		});
	};
	const login = async (fields: any) => {
		setPending();
		const { connected } = fields;
		try {
			const { data } = await api('/auth').post('', encodeBody(fields));
			const { token } = decodeBody(data);
			setCookie(null, 'nextauth', encodeKeyAuthorization(token), {
				maxAge: connected ? 2147483647 : undefined,
			});
			setTimeout(() => {
				window.location.replace('/feed');
			}, 1500);
			toast({
				title: 'Você será redirecionado em breve',
				status: 'success',
				duration: 2500,
				isClosable: false,
				position: 'top-right',
			});
		} catch (err) {
			if (err instanceof AxiosError) {
				if (err.response?.status === 403) {
					toast({
						title: 'Usuário não existe ou senha incorreta',
						status: 'error',
						duration: 2500,
						isClosable: true,
						position: 'top-right',
					});
					setPending();
					return;
				}
			}
			toast({
				title: 'Houve um erro de servidor',
				description: 'Tente novamente mais tarde',
				status: 'error',
				duration: 2500,
				isClosable: true,
				position: 'top-right',
			});
		}
		setPending();
	};
	return (
		<userContext.Provider value={{ isPending, login, logout }}>
			{children}
		</userContext.Provider>
	);
};

export const useUser = () => {
	return useContext(userContext);
};
