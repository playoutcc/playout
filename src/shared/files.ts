import { api } from './api';

type Response = {
	data: {
		url: string;
	};
};

export const saveFile = async (file: string): Promise<string> => {
	try {
		if (file.startsWith('http')) return file;
		const {
			data: { url },
		}: Response = await api('').post(
			'/save',
			{ file },
			{
				headers: {
					'Content-Type': 'application/json',
				},
			}
		);
		return url.startsWith('http://') ? url.replace('http', 'https') : url;
	} catch (err) {
		throw err;
	}
};
