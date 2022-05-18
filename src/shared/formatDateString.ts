import moment from 'moment';

export const formatDateString = (date: string) => {
	const now = moment();
	const created = moment(date);
	const diff = now.diff(created, 'minutes');
	console.log(diff);
	console.log(date);
	if (diff <= 1) {
		return 'Postado há alguns segundos';
	} else if (diff < 60) {
		return `Postado há ${diff} minutos atrás`;
	} else if (diff < 1444) {
		let newDiff = now.diff(created, 'hours');
		return `Postado há ${newDiff} horas atrás`;
	} else if (diff < 4500) {
		let newDiff = now.diff(created, 'days');
		return `Postado há ${newDiff} dias atrás`;
	} else if (diff < 526800) {
		let newDiff = now.diff(created, 'months');
		return `Postado há ${newDiff} meses atrás`;
	} else {
		let newDiff = now.diff(created, 'years');
		return `Postado há ${newDiff} anos atrás`;
	}
};
