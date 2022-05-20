import { Link, Text, useConst, VStack } from '@chakra-ui/react';
import { FC, Fragment, useState } from 'react';
import { News } from 'shared';

type Props = {
	news: News[];
};

export const NewsCard: FC<Props> = ({ news }) => {
	const nowDate = useConst(new Date().getFullYear());
	const [size, setSize] = useState(5);
	return (
		<VStack
			className="news_card"
			justify="flex-start"
			align="flex-start"
			flex={1}
			maxW="280px"
			p={6}
			backgroundColor="gray.800"
			borderRadius="20px"
		>
			<Text fontSize="xl" fontWeight="bold">
				Notícias
			</Text>
			{news.filter(({ title }) => title !== null && title !== undefined)
				.length === 0 && (
				<Text fontSize="small" color="gray.500">
					Não há notícias, talvez você não tenha colocado interesse em nenhum
					jogo ou não conseguimos atualizar suas notícias.
				</Text>
			)}
			<Fragment>
				{news
					.filter(({ title }) => title !== null && title !== undefined)
					.map(({ url, title, description }, index) => {
						if (index + 1 > size)
							return (
								<Fragment
									key={url + title + index + '-' + description}
								></Fragment>
							);
						return (
							<Link
								rel="noreferrer nofollow"
								title={title}
								fontSize="small"
								key={url + title + index + '-' + description}
								href={url}
								target="_blank"
							>
								{title.length > 60 ? title.substring(0, 59) + '...' : title}
							</Link>
						);
					})}
				{news.filter(({ title }) => title !== null && title !== undefined)
					.length > 5 && (
					<Text
						color="primary.main"
						_hover={{ cursor: 'pointer' }}
						textDecoration="underline"
						fontSize="small"
						onClick={(e: any) => setSize(size === 5 ? 10 : 5)}
					>
						Mostrar {size === 5 ? 'mais' : 'menos'}
					</Text>
				)}
			</Fragment>
			<Text pt={8} pb={2} fontSize="sm" color="primary.main">
				PlayOut © {nowDate}
			</Text>
		</VStack>
	);
};
