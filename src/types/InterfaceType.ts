import { Rule } from 'antd/es/form';
import { ReactNode } from 'react';

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

export type LoginResponseType = {
	id?: string;
	name?: string;
	balance?: number;
	currency?: string;
	accessToken?: string;
	message?: string;
};

export type BetResponseType = {
	transcation: string;
	currency: string;
	balance: number;
	winAmount: number;
};

export type DeleteBetResponseType = {
	transcation: string;
	balance: number;
	currency: string;
};

export type BetType = {
	id: string;
	createdAt: string;
	amount: number;
	winAmount: number;
	status: number;
};

export type MyBetsResponseType = {
	data: BetType;
	total: number;
	page: number;
	limit: number;
};

export type TransactionType = {
	id: string;
	createdAt: string;
	amount: number;
	type: number;
};

export type MyTransactionType = {
	data: TransactionType;
	total: number;
	page: number;
	limit: number;
};
