import { User } from './userModel';

export type PostsPage = {
	posts: Post[];
	max: number;
};

export type Comment = {
	id: string;
	userId: string;
	body: string;
	createdAt: string;
};

export type Post = {
	id: string;
	userId: string;
	body: string;
	user: User;
	createdAt: string;
	likes: string[];
	comments: Comment[];
};
