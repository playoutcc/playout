import dynamic from 'next/dynamic';

export const CardUser = dynamic(() => import('./CardUser'));
export const ModalDelete = dynamic(() => import('./ModalDelete'));
export const UserEditor = dynamic(() => import('./UserEditor'));
