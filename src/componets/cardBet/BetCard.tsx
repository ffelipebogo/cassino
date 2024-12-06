import { Button, Card, Form, Input, message } from 'antd';
import React, { useEffect, useState } from 'react';
import { BetResponseType, IBetCardProps } from '../../types/Interfaces';
import { AppDispatch, RootState } from '../../store/store';
import { useDispatch, useSelector } from 'react-redux';
import request from '../../api/request';
import { updateBalance } from '../../store/slices/playerSlice';

import './BetCard.css';
// import { Container } from './styles';
type BetStatus = 'win' | 'lost' | 'pending' | undefined;

const BetCard = ({ title, isLogged }: IBetCardProps) => {
	const statePlayer = useSelector((state: RootState) => state.player);
	const [form] = Form.useForm();

	const [loading, setLoading] = useState(false);

	const [amount, setAmount] = useState<number | undefined>(undefined);

	const [status, setStatus] = useState<BetStatus>();

	const dispatch = useDispatch<AppDispatch>();

	useEffect(() => {
		setTimeout(() => {
			setStatus(undefined);
		}, 2500);
	}, [status]);

	const resetInput = () => {
		setAmount(undefined);
		form.resetFields();
		setLoading(false);
	};

	const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const val = parseFloat(e.target.value);

		if (!isNaN(val)) {
			setAmount(val);
		} else {
			setAmount(undefined);
		}
	};

	const handleSubmit = () => {
		if (!isLogged) {
			message.warning('Faça o login ou registre-se');
			return;
		}
		if (amount && amount >= 1) {
			setLoading(true);
			setTimeout(() => {
				setStatus('pending');
				if (amount && statePlayer.accessToken && statePlayer.balance >= amount) {
					const body = `{"amount": ${amount}}`;
					const autorization: HeadersInit = {
						Authorization: `Bearer ${statePlayer.accessToken}`,
					};

					request
						.post<string, BetResponseType>('/bet', body, autorization)
						.then((response) => {
							if (response.transactionId) {
								message.success('Aposta realizada com sucesso!');
								dispatch(updateBalance(response.balance));
								if (response.winAmount) {
									setStatus('win');
								} else {
									setStatus('lost');
								}
							} else {
								message.error(response.message);
							}
						})
						.catch(() => {
							message.error('Não foi possivel concluir sua aposta.');
						})
						.finally(() => {
							setLoading(false);
						});
				} else {
					message.error('Verifique seu saldo!');
				}
				resetInput();
			}, 500);
		} else {
			message.error('O valor deve ser maior que 1,00.');
		}
	};

	return (
		<>
			<Card
				className={`bet-card ${status}`}
				title="Aposte agora !"
				styles={{
					header: {
						fontWeight: 'bold',
						color: '#1890ff',
						fontSize: '1.2rem',
						textAlign: 'center',
					},
				}}
				style={{
					maxWidth: 500,
					width: '100%',
					margin: '20px auto',
					borderRadius: '8px',
					boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.1)',
					overflow: 'hidden',
				}}
			>
				<p
					style={{
						fontWeight: 'normal',
						color: '#888',
						fontSize: '1rem',
						marginBottom: 20,
						textAlign: 'center',
					}}
				>
					{title}
				</p>
				<Form form={form} onFinish={handleSubmit} layout="vertical">
					<>
						{isLogged && (
							<Form.Item
								label={
									<p style={{ fontWeight: 'normal', color: '#888' }}>
										Valor da aposta
									</p>
								}
								name="value"
								rules={[
									{ required: true, message: 'Este campo é obrigatório!' },
									{ min: 0.99, message: 'O valor deve ser maior que 1,00.' },
								]}
							>
								<Input
									inputMode="numeric"
									value={amount}
									onChange={handleChange}
									placeholder="Digite um valor maior que 1,00"
									style={{
										borderRadius: '8px',
										padding: '10px',
										fontSize: '0.9rem',
										border: '1px solid #d9d9d9',
									}}
								/>
							</Form.Item>
						)}
					</>
					<Button
						type="primary"
						htmlType="submit"
						block
						style={{
							fontSize: '0.9rem',
							padding: '10px',
							marginTop: '10px',
							borderRadius: '8px',
							backgroundColor: '#1890ff',
							borderColor: '#1890ff',
						}}
						loading={loading}
					>
						Apostar
					</Button>
				</Form>
			</Card>
		</>
	);
};

export default BetCard;
