/* eslint-disable react/no-children-prop */
import {
	Avatar,
	FormControl,
	FormErrorMessage,
	Input as I,
	InputGroup,
	Text,
	Textarea as TA,
	useBoolean,
} from '@chakra-ui/react';
import { FC, HTMLInputTypeAttribute, ReactNode, useState } from 'react';
import { FileUploader } from 'react-drag-drop-files';
import { UseFormRegister } from 'react-hook-form';
import { BiHide, BiShowAlt } from 'react-icons/bi';

type Props = {
	name: string;
	register: UseFormRegister<any>;
	showErrorMessage?: boolean;
	errors: {
		[x: string]: any;
	};
	type?: HTMLInputTypeAttribute;
	inputMode?:
		| 'email'
		| 'search'
		| 'tel'
		| 'text'
		| 'url'
		| 'none'
		| 'numeric'
		| 'decimal';
	leftContent?: ReactNode;
	placeHolder: string;
	css?: {};
	disabled?: boolean;
	inputProps?: {};
	handleChange?: (value: any) => void;
	value?: string;
	required?: boolean;
};

type PropsFile = {
	name: string;
	label: string;
	types: string[];
	multiple: boolean;
	maxSize: number;
	title: string;
	handleChange: (files: any) => void;
	file: string | null;
	fullName: string;
	required?: boolean;
};

type PropsTextArea = {
	placeHolder: string;
	name: string;
	register: UseFormRegister<any>;
	errors: {
		[x: string]: any;
	};
	value?: string;
	required?: boolean;
};

export const TextArea: FC<PropsTextArea> = ({
	placeHolder,
	name,
	register,
	errors,
	value = '',
	required = true,
}) => {
	return (
		<FormControl isRequired={required} as="fieldset" isInvalid={errors[name]}>
			<TA
				focusBorderColor="primary.main"
				_hover={{ borderColor: 'primary.main' }}
				id={name}
				placeholder={placeHolder}
				{...register(name)}
				rows={6}
				resize="none"
				defaultValue={value}
			/>
			{errors[name] && (
				<FormErrorMessage>{errors[name].message}</FormErrorMessage>
			)}
		</FormControl>
	);
};

export const InputFile: FC<PropsFile> = ({
	label,
	name,
	types,
	multiple,
	maxSize,
	title,
	handleChange,
	fullName,
	file,
	required = true,
}) => {
	const [error, setError] = useState<string | null>(null);
	return (
		<FormControl
			isRequired={required}
			isInvalid={!!error}
			className="upload-file"
			as="fieldset"
			display="flex"
			css={{ flexDirection: 'column', gap: '1rem' }}
			padding="0.5rem 0"
		>
			{file && (
				<Avatar alignSelf="center" src={file} size="xl" name={fullName} />
			)}
			<Text color="primary.main">{title}</Text>
			<FileUploader
				id={name}
				multiple={multiple}
				types={types}
				name={name}
				label={label}
				maxSize={maxSize}
				handleChange={(files: any) => {
					setError(null);
					handleChange(files);
				}}
				w="100%"
				onTypeError={() => setError('Tipo de arquivo inválido')}
				onSizeError={() => setError('Tamanho do arquivo muito grande')}
			/>
		</FormControl>
	);
};

export const Input: FC<Props> = ({
	name,
	register,
	errors,
	type = 'text',
	inputMode = 'text',
	leftContent = undefined,
	placeHolder,
	css,
	disabled = false,
	inputProps = {},
	handleChange = null,
	showErrorMessage = true,
	value = '',
	required = true,
}) => {
	return (
		<FormControl
			isDisabled={disabled}
			css={css}
			as="fieldset"
			isInvalid={errors[name]}
			isRequired={required}
		>
			<InputGroup>
				{leftContent && (
					<label
						className="label-icon"
						style={{
							position: 'absolute',
							left: '12px',
							top: '30%',
							width: 'min-content',
							height: '100%',
							zIndex: 2,
							cursor: 'default',
							color: 'white',
						}}
						htmlFor={name}
					>
						{leftContent}
					</label>
				)}
				{value != '' && (
					<I
						id={name}
						{...inputProps}
						focusBorderColor="primary.main"
						_hover={{ borderColor: 'primary.main' }}
						isInvalid={errors[name]}
						type={type}
						isDisabled={disabled}
						disabled={disabled}
						inputMode={inputMode}
						{...register(name, {
							onChange: (e) => {
								if (!!handleChange) handleChange(e);
							},
						})}
						defaultValue={value}
						paddingLeft={leftContent ? 10 : 2}
						placeholder={placeHolder}
					/>
				)}
				{value == '' && (
					<I
						id={name}
						{...inputProps}
						focusBorderColor="primary.main"
						_hover={{ borderColor: 'primary.main' }}
						isInvalid={errors[name]}
						type={type}
						isDisabled={disabled}
						disabled={disabled}
						inputMode={inputMode}
						{...register(name, {
							onChange: (e) => {
								if (!!handleChange) handleChange(e);
							},
						})}
						paddingLeft={leftContent ? 10 : 2}
						placeholder={placeHolder}
					/>
				)}
			</InputGroup>
			{!required && (
				<Text as="label" htmlFor={name} fontSize={11}>
					Opcional
				</Text>
			)}
			{errors[name] && showErrorMessage && (
				<FormErrorMessage>{errors[name].message}</FormErrorMessage>
			)}
		</FormControl>
	);
};

export const InputPassword: FC<Props> = ({
	name,
	register,
	errors,
	type = 'password',
	inputMode = 'text',
	leftContent = undefined,
	placeHolder,
	required = true,
}) => {
	const [show, { toggle: setShow }] = useBoolean(false);
	return (
		<FormControl isRequired={required} as="fieldset" isInvalid={errors[name]}>
			<InputGroup>
				{leftContent && (
					<label
						style={{
							position: 'absolute',
							left: '12px',
							top: '30%',
							width: 'min-content',
							height: '100%',
							zIndex: 2,
							cursor: 'default',
						}}
						htmlFor={name}
					>
						{leftContent}
					</label>
				)}
				<I
					focusBorderColor="primary.main"
					_hover={{ borderColor: 'primary.main' }}
					isInvalid={errors[name]}
					type={show ? 'text' : type}
					inputMode={inputMode}
					{...register(name)}
					paddingLeft={10}
					paddingRight={10}
					id={name}
					placeholder={placeHolder}
				/>
				<span
					style={{
						position: 'absolute',
						right: '12px',
						top: '30%',
						width: 'min-content',
						height: '100%',
						cursor: 'pointer',
						zIndex: 2,
					}}
					onClick={setShow}
				>
					{show ? <BiHide /> : <BiShowAlt />}
				</span>
			</InputGroup>
			{errors[name] && (
				<FormErrorMessage>{errors[name].message}</FormErrorMessage>
			)}
		</FormControl>
	);
};
