import React, { useState } from 'react';
import { Input, message } from 'antd';
import { useNavigate } from 'react-router-dom';
import { LockOutlined, MailOutlined } from '@ant-design/icons';

import request from '../../api/request';
import { CookieServices } from './../../services/CookieService';
import AuthForm from '../../componets/form/AuthForm';
import { Field, IPlayerState, UserLogin } from '../../types/Interfaces';
import { setPlayer } from '../../store/slices/playerSlice';
import { useDispatch } from 'react-redux';
import { AppDispatch } from '../../store/store';

const Login: React.FC = () => {
	const navigate = useNavigate();
	const [loading, setLoading] = useState(false);
	const [email, setEmail] = useState<string>('');
	const [password, setPassword] = useState<string>('');

	const dispatch = useDispatch<AppDispatch>();

	const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		setEmail(e.target.value);
	};

	const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		setPassword(e.target.value);
	};

	const onFinish = (values: UserLogin) => {
		setLoading(true);
		setTimeout(() => {
			const body = JSON.stringify(values);

			request
				.post<string, IPlayerState>('/login', body)
				.then((response) => {
					if (response.id) {
						message.success('Login feito, boa sorte!!!');

						CookieServices.save('accessToken', response.accessToken, 1);

						response.isFirstAccess = false;
						dispatch(setPlayer(response));

						navigate('/');
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

	return (
		<AuthForm
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
