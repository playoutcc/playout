export type User = {
	id: string;
	fullName: string;
	email: string;
	password: string;
	username?: string;
	description?: string;
	thumbnail?: string;
	createdAt: string;
	addressId: string;
	address?: Address;
	experiences?: Experience[];
	interests: string[];
};

type Address = {
	id: string;
	city: string;
	province: string;
};

type Experience = {
	id: string;
	jobTitle: string;
	company: string;
	startDate: string;
	endDate?: string;
	description: string;
	games: string[];
};
