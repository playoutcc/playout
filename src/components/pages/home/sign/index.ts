import dynamic from 'next/dynamic';

export const Sign = dynamic(() => import('./Sign'));
export const SignIn = dynamic(() => import('./SignIn'));
export const SignUp = dynamic(() => import('./SignUp'));
