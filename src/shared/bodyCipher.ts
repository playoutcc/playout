import CryptoJS from 'crypto-js';

const KEY_AUTHORIZATION = process.env.KEY_AUTHORIZATION!;

export const encodeBody = (message: any) => {
	const key = CryptoJS.AES.encrypt(
		JSON.stringify(message),
		KEY_AUTHORIZATION
	).toString();
	return key;
};

export const decodeBody = (key: string) => {
	const bytes = CryptoJS.AES.decrypt(key, KEY_AUTHORIZATION);
	const decryptedData = JSON.parse(bytes.toString(CryptoJS.enc.Utf8));
	return decryptedData;
};
