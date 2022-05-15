import CryptoJS from 'crypto-js';

const KEY_AUTHORIZATION = process.env.KEY_AUTHORIZATION!;

export const encodeKeyAuthorization = (message: string) => {
	const key = CryptoJS.AES.encrypt(message, KEY_AUTHORIZATION).toString();
	return key;
};

export const decodeKeyAuthorization = (key: string) => {
	const cipher = CryptoJS.AES.decrypt(key, KEY_AUTHORIZATION).toString(
		CryptoJS.enc.Utf8
	);
	return cipher;
};
