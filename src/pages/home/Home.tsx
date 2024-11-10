import React, { useEffect, useState } from 'react';
import { Button, Card, Form, Input, Layout, message, Typography } from 'antd';
import { useLocation, useNavigate } from 'react-router-dom';
import { BetResponseType, LoginResponseType } from '../../types/InterfaceType';
import { DollarOutlined, GroupOutlined, LoginOutlined } from '@ant-design/icons';
import ModalTable from '../../componets/walletModal/WalletModal';
import request from '../../api/request';

const { Header, Content } = Layout;
const { Title } = Typography;

const Home: React.FC = () => {
	const [isFirstAccess, setIsFirstAccess] = useState(true);

	const [win, setWin] = useState<boolean>(false);
	const [balance, setBalance] = useState<number>(0);
	const [amount, setAmount] = useState<number | undefined>(undefined);

	const [page, setPage] = useState(1);
	const [limit, setLimit] = useState(10);

	const [accessToken, setAccessToken] = useState<string>('');
	const [loading, setLoading] = useState(false);

	const navigate = useNavigate();
	const location = useLocation();

	const [isModalVisible, setIsModalVisible] = useState(false);

	// useEffect(() => {
	// 	localStorage.removeItem('token');
	// }, []);

	useEffect(() => {
		// if (isFirstAccess) {
		// 	setIsFirstAccess(false);
		// 	return;
		// }

		const token = localStorage.getItem('token') || '';

		if (location.state?.player && location.state.player.accessToken !== token && token != '') {
			setBalance(location.state.player.balance);
			localStorage.setItem('token', location.state.player.accessToken);
			setAccessToken(location.state.player.accessToken);
		}
	}, []);

	const handleLogin = () => {
		navigate('/login');
	};

	const handleRegister = () => {
		navigate('/register');
	};

	const handleMyBets = () => {
		navigate('/my-bets', { state: { accessToken: accessToken } });
	};

	const showWalletModal = () => {
		setIsModalVisible(true);
	};

	const handleClose = () => {
		setIsModalVisible(false);
	};

	const handlePageChange = (newPage: number, newLimit: number) => {
		setPage(newPage);
		setLimit(newLimit);
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
		if (amount && amount >= 1) {
			setLoading(true);
			setTimeout(() => {
				if (amount && accessToken && balance > amount) {
					const body = `{"amount": ${amount}}`;
					const autorization: HeadersInit = { Authorization: `Bearer ${accessToken}` };

					request
						.post<string, BetResponseType>('/bet', body, autorization)
						.then((response) => {
							if (response.transactionId) {
								message.success('Aposta realizada com sucesso!');
								setBalance(response.balance);
								setAmount(undefined);
								if (response.winAmount) {
									setWin(true);
								}
							} else {
								message.error(response.message);
							}
						})
						.catch(() => {
							message.error('Não foi possivel concluir sua aposta.');
						});
				} else {
					message.error('Verifique seu saldo!');
				}
				setLoading(false);
			}, 1000);
		} else {
			message.error('O valor deve ser maior que 1,00.');
		}
	};

	return (
		<Layout style={{ minHeight: '100vh', backgroundColor: '#f0f2f5' }}>
			<Header
				style={{
					display: 'flex',
					justifyContent: 'space-between',
					alignItems: 'center',
					padding: '0 24px',
					backgroundColor: '#001529',
					boxShadow: '0 2px 8px rgba(0, 0, 0, 0.15)',
				}}
			>
				<Title level={2} style={{ color: '#fff', margin: 0, fontSize: '1.5rem' }}>
					Cassino
				</Title>
				{accessToken && (
					<div style={{ marginLeft: 100 }}>
						<Typography.Text
							strong
							style={{
								color: '#1890ff',
								fontSize: '1rem',
								backgroundColor: '#e6f7ff',
								padding: '8px 12px',
								borderRadius: '8px',
								display: 'inline-flex',
								alignItems: 'center',
							}}
						>
							Saldo R$ {balance}
						</Typography.Text>
					</div>
				)}

				<div style={{ display: 'flex', flexWrap: 'wrap' }}>
					{!accessToken && (
						<>
							<div style={{ display: 'flex' }}>
								<Button
									onClick={handleLogin}
									style={{ fontSize: '0.9rem', marginRight: 10 }}
								>
									<LoginOutlined />
									Login
								</Button>
								<Button
									type="primary"
									onClick={handleRegister}
									style={{ fontSize: '0.9rem' }}
								>
									Registrar-se
								</Button>
							</div>
						</>
					)}
					{accessToken && (
						<>
							<div style={{ display: 'flex' }}>
								<Button
									onClick={showWalletModal}
									style={{ fontSize: '0.9rem', marginRight: 10 }}
								>
									<DollarOutlined />
									Carteira
								</Button>
								<Button onClick={handleMyBets} style={{ fontSize: '0.9rem' }}>
									<GroupOutlined />
									Minhas Apostas
								</Button>
							</div>
						</>
					)}
				</div>
			</Header>

			<Content
				style={{
					padding: '20px',
					display: 'flex',
					flexDirection: 'column',
					alignItems: 'center',
					flex: 1,
					maxWidth: '100%',
				}}
			>
				{accessToken && (
					<Card
						title="Aposte agora !!!"
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
							Corintians X Flamengo
						</p>
						<Form onFinish={handleSubmit} layout="vertical">
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
				)}

				<ModalTable
					isModalVisible={isModalVisible}
					page={page}
					limit={limit}
					onClose={handleClose}
					onPageChange={handlePageChange}
					accessToken={accessToken}
				/>
			</Content>
		</Layout>
	);
};

export default Home;
