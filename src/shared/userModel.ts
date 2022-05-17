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
	trophies?: Trophy[];
	following: string[];
	followers: string[];
};

export type Trophy = {
	id: string;
	championshipName: string;
	team?: string;
	year: string;
};

export type Address = {
	id: string;
	city: string;
	province: string;
};

export type Experience = {
	id: string;
	jobTitle: string;
	company: string;
	startDate: string;
	endDate?: string;
	description: string;
	games: string[];
};
