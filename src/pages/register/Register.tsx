import React, { useState } from 'react';
import { Input, message } from 'antd';
import { UserOutlined, MailOutlined, LockOutlined } from '@ant-design/icons';
import FormCard from './../../componets/form/FormCard';
import { Rule } from 'antd/es/form';
import { Field, RegisterForm, RegisterResponseType } from '../../types/InterfaceType';
import { useNavigate } from 'react-router-dom';
import request from '../../api/request';

const Register: React.FC = () => {
	const navigate = useNavigate();
	const [loading, setLoading] = useState(false);
	const [name, setName] = useState<string>('');
	const [email, setEmail] = useState<string>('');
	const [password, setPassword] = useState<string>('');
	const [confirmPassword, setConfirmPassword] = useState<string>('');

	const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		setName(e.target.value);
	};

	const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		setEmail(e.target.value);
	};

	const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		setPassword(e.target.value);
	};

	const handleConfirmPasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		setConfirmPassword(e.target.value);
	};
	const fields: Field[] = [
		{
			name: 'name',
			values: name,
			label: <div style={{ fontWeight: 'normal', color: '#888' }}>Nome</div>,
			rules: [{ required: true, message: 'Por favor, insira seu nome!' }],
			input: (
				<Input prefix={<UserOutlined />} placeholder="Nome" onChange={handleNameChange} />
			),
		},
		{
			name: 'email',
			values: email,
			label: <div style={{ fontWeight: 'normal', color: '#888' }}>E-mail</div>,
			rules: [
				{ required: true, message: 'Por favor, insira seu e-mail!' },
				{ type: 'email', message: 'Por favor, insira um e-mail válido!' },
			],
			input: (
				<Input
					prefix={<MailOutlined />}
					placeholder="E-mail"
					onChange={handleEmailChange}
				/>
			),
		},
		{
			name: 'password',
			values: password,
			label: <div style={{ fontWeight: 'normal', color: '#888' }}>Senha</div>,
			rules: [{ required: true, message: 'Por favor, insira sua senha!' }],
			input: (
				<Input.Password
					prefix={<LockOutlined />}
					placeholder="Senha"
					onChange={handlePasswordChange}
				/>
			),
		},
		{
			name: 'confirmPassword',
			values: confirmPassword,
			label: <div style={{ fontWeight: 'normal', color: '#888' }}>Confirmar Senha</div>,
			rules: [
				{ required: true, message: 'Por favor, confirme sua senha!' },
				({ getFieldValue }: { getFieldValue: (name: string) => string }) => ({
					validator(_: Rule, value: string) {
						if (!value || getFieldValue('password') === value) {
							return Promise.resolve();
						}
						return Promise.reject(new Error('As senhas não coincidem!'));
					},
				}),
			],
			input: (
				<Input.Password
					prefix={<LockOutlined />}
					placeholder="Confirmar Senha"
					onChange={handleConfirmPasswordChange}
				/>
			),
		},
	];

	const onFinish = (values: RegisterForm) => {
		setLoading(true);
		setTimeout(() => {
			if (values.password === values.confirmPassword) {
				const body = JSON.stringify(values);

				request
					.post<string, RegisterResponseType>('/register', body)
					.then((response) => {
						if (response.id) {
							message.success('Cadastro realizado com sucesso!');

							navigate('/login');
						} else {
							message.error(response.message);
						}
					})
					.catch((res) => {
						message.error('Não foi possivel realizar seu cadastro!');
						console.error(res);
					});
			} else {
				message.error('As senhas não coincidem!');
			}
			setLoading(false);
		}, 1000);
	};

	return (
		<FormCard
			title="Bem-vindo ao Cassino"
			subtitle="Registre-se usando seu e-mail"
			fields={fields}
			onFinish={onFinish}
			loading={loading}
			buttonText="Criar Conta"
		/>
	);
};

export default Register;
