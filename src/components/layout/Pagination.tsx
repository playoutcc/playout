import { HStack, VStack } from '@chakra-ui/react';
import { FC } from 'react';
import { MdNavigateBefore, MdNavigateNext } from 'react-icons/md';

type Props = {
	maxPage: number;
	active: number;
	nextPage: () => void;
	previousPage: () => void;
	goToPage: (skip: number) => void;
};

const Pagination: FC<Props> = ({
	maxPage,
	active,
	nextPage,
	previousPage,
	goToPage,
}) => {
	const pages = [];
	const max = active + 1 > maxPage ? maxPage : active + 1;
	const middle = active - 2 < 0 ? active - 1 : active - 2;
	for (let index = middle; index < max; index++) {
		pages.push(
			<VStack
				align="center"
				justify="center"
				margin="0 auto"
				borderRadius="50%"
				backgroundColor={active === index + 1 ? 'primary.main' : 'transparent'}
				_hover={{
					backgroundColor: active === index + 1 ? 'teal.400' : 'gray.900',
				}}
				cursor="pointer"
				w="30px"
				h="30px"
				onClick={(e: any) => goToPage(index + 1)}
				color={active === index + 1 ? 'black' : 'white'}
				key={index}
			>
				<span style={{ width: 'fit-content' }}>{index + 2}</span>
			</VStack>
		);
	}
	return (
		<HStack py={4} gap={2}>
			{active !== 0 && (
				<MdNavigateBefore
					onClick={previousPage}
					style={{ cursor: 'pointer' }}
					color="white"
				/>
			)}
			{pages.map((index) => index)}
			{active !== maxPage && (
				<MdNavigateNext
					onClick={nextPage}
					style={{ cursor: 'pointer' }}
					color="white"
				/>
			)}
		</HStack>
	);
};

export default Pagination;
