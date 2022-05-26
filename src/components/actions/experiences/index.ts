import dynamic from 'next/dynamic';

export const ExperienceCard = dynamic(() => import('./ExperienceCard'));
export const ModalExperience = dynamic(() => import('./ModalExperience'));
export const ExperienceContainer = dynamic(
	() => import('./ExperienceContainer')
);
