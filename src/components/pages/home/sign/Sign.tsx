import {
	Button,
	Modal,
	ModalCloseButton,
	ModalContent,
	ModalOverlay,
	useDisclosure,
	VStack,
} from '@chakra-ui/react';
import { HDivider } from 'components/layout';
import { SignIn } from './SignIn';
import { SignUp } from './SignUp';

export const Sign = () => {
	const { isOpen, onOpen, onClose } = useDisclosure();
	return (
		<VStack h="fit-content" w="100%" maxW="420px" spacing={5} as="section">
			<SignIn />
			<HDivider text="Não possui conta?" />
			<Button
				w="100%"
				variant="outline"
				_hover={{ borderColor: 'primary.main' }}
				_focus={{ borderColor: 'primary.main' }}
				onClick={onOpen}
			>
				Cadastrar
			</Button>
			<Modal isCentered isOpen={isOpen} onClose={onClose}>
				<ModalOverlay backgroundColor="blackAlpha.800" />
				<ModalContent borderWidth="1px" borderColor="primary.main">
					<SignUp onClose={onClose} />
					<ModalCloseButton />
				</ModalContent>
			</Modal>
		</VStack>
	);
};
