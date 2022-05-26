import dynamic from 'next/dynamic';

export * from './Input';
export const FollowButton = dynamic(() => import('./FollowButton'));
export const Footer = dynamic(() => import('./Footer'));
export const HDivider = dynamic(() => import('./HDivider'));
export const Header = dynamic(() => import('./Header'));
export const Main = dynamic(() => import('./Main'));
export const PageLoading = dynamic(() => import('./PageLoading'));
export const Pagination = dynamic(() => import('./Pagination'));
export const SearchBar = dynamic(() => import('./SearchBar'));
