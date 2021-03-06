import axios from 'axios';
import moment from 'moment';
import { encodeKeyAuthorization } from './keyAuthorization';

export const api = (path: string) => {
	const key = encodeKeyAuthorization(moment().toISOString());
	return axios.create({
		baseURL: `${process.env.BASE_URL}/api`,
		headers: {
			path,
			authorization: key,
			'Content-Type': 'application/text',
			Accept: 'application/txt',
		},
	});
};

export const apiNews = (games: string[]) => {
	const key = encodeKeyAuthorization(moment().toISOString());
	return axios.create({
		baseURL: `${process.env.BASE_URL}/api/news?games=${games}`,
		headers: {
			authorization: key,
			'Content-Type': 'application/json',
		},
	});
};
