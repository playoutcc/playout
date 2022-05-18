import moment from 'moment';
import { NextApiRequest, NextApiResponse } from 'next';
import { decodeKeyAuthorization } from './keyAuthorization';

const TIMEOUT_SEC = 25;

export const middleware = (req: NextApiRequest, res: NextApiResponse) => {
	const now = moment();
	const authorization = req.headers.authorization as string;
	if (!authorization) throw Error('Chave inválida');
	const isValidKey = decodeKeyAuthorization(authorization);
	const diff = now.diff(moment(isValidKey), 'seconds');
	if (!(diff < TIMEOUT_SEC)) throw Error('Chave inválida');
};
