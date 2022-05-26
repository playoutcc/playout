import dynamic from 'next/dynamic';

export const Description = dynamic(() => import('./Description'));
export * from './sign';
