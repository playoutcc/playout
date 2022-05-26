type Source = {
	id: string;
	name: string;
};

export type News = {
	author: string;
	content: string;
	description: string;
	title: string;
	url: string;
	urlToImage: string;
	source: Source;
};
