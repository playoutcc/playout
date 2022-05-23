import dynamic from 'next/dynamic';

export const CardSuggestion = dynamic(() => import('./CardSuggestion'));
export const Dashboard = dynamic(() => import('./Dashboard'));
export const NewsCard = dynamic(() => import('./NewsCard'));
export const Post = dynamic(() => import('./Post'));
export const Posts = dynamic(() => import('./Posts'));
export const ProfileCard = dynamic(() => import('./ProfileCard'));
