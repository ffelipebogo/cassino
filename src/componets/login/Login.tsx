import React, { useState } from 'react';
import { Input, message } from 'antd';
import { LockOutlined, MailOutlined } from '@ant-design/icons';
import FormCard from './../form/FormCard';
import { Field, LoginResponseType, UserLogin } from '../../types/InterfaceType';
import { useNavigate } from 'react-router-dom';
import request from '../../api/request';

const Login: React.FC = () => {
	const navigate = useNavigate();
	const [loading, setLoading] = useState(false);
	const [email, setEmail] = useState<string>('');
	const [password, setPassword] = useState<string>('');

	const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		setEmail(e.target.value);
	};

	const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		setPassword(e.target.value);
	};

	const fields: Field[] = [
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
	];

	const onFinish = (values: UserLogin) => {
		setLoading(true);
		setTimeout(() => {
			const body = JSON.stringify(values);

			request
				.post<string, LoginResponseType>('/login', body)
				.then((response) => {
					if (response.id) {
						message.success('Login feito! Boa sorte!!!');

						navigate('/', { state: { player: response } });
					} else {
						message.error(response.message);
					}
				})
				.catch(() => {
					message.error('Credenciais inválidas!');
				});

			setLoading(false);
		}, 1000);
	};

	return (
		<FormCard
			title="Bem-vindo de volta"
			subtitle="Faça seu login"
			fields={fields}
			onFinish={onFinish}
			loading={loading}
			buttonText="Entrar"
		/>
	);
};

export default Login;
