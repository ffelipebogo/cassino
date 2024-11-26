import { Rule } from 'antd/es/form';
import { ReactNode } from 'react';

interface Common {
	id: string;
	message?: string;
}

export interface IPlayerState extends Common {
	name: string;
	balance: number;
	currency: string;
	accessToken: string;
}

export interface IFormCardProps<T> {
	title: string;
	subtitle?: string;
	fields: Field[];
	onFinish: (values: T) => void;
	loading: boolean;
	buttonText: string;
}

export type RegisterForm = {
	name: string;
	email: string;
	password: string;
	confirmPassword: string;
};

export type Field = {
	name: string;
	values: string | number;
	label: ReactNode;
	rules: Rule[];
	input: ReactNode;
	dependencies?: string[] | undefined;
};

export type UserLogin = {
	username: string;
	password: string;
};

export type RegisterResponseType = {
	id?: string;
	name?: string;
	message?: string;
};

export type BetType = {
	id: string;
	createdAt: string;
	amount: number;
	winAmount: number;
	status: number;
};

export type BetResponseType = {
	transactionId: string;
	currency: string;
	balance: number;
	winAmount: number;
	message?: string;
};

export type MyBetsResponseType = {
	data: BetType[];
	total: number;
	page: number;
	limit: number;
	message?: string;
};

export type DeleteBetResponseType = {
	transcation: string;
	balance: number;
	currency: string;
	message?: string;
};

export type TransactionType = {
	id: string;
	createdAt: string;
	amount: number;
	type: string;
};

export type MyTransactionType = {
	data: TransactionType[];
	total: number;
	page: number;
	limit: number;
};

export type DataType = {
	id: string;
	dateTime: string;
	type: string;
	value: number;
};

export interface ModalTableProps {
	isModalVisible: boolean;
	page: number;
	limit: number;
	onClose: () => void;
	onPageChange: (page: number, limit: number) => void;
	accessToken: string;
}

export interface IPagination {
	current: number;
	pageSize: number;
}
