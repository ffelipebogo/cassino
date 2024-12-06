import React, { useEffect, useState } from 'react';
import { Button, FloatButton, Layout, Typography } from 'antd';
import { useNavigate } from 'react-router-dom';
import {
	DollarOutlined,
	FormatPainterOutlined,
	GroupOutlined,
	LoginOutlined,
} from '@ant-design/icons';
import ModalTable from '../../componets/walletModal/WalletModal';
import { CookieServices } from './../../services/CookieService';
import { useSelector } from 'react-redux';
import { RootState } from '../../store/store';
import BetCard from '../../componets/cardBet/BetCard';

const { Header, Content } = Layout;
const { Title } = Typography;

const Home: React.FC = () => {
	const [isModalVisible, setIsModalVisible] = useState(false);

	const [accessToken, setAccessToken] = useState<string>('');

	const navigate = useNavigate();
	const statePlayer = useSelector((state: RootState) => state.player);

	useEffect(() => {
		const token = CookieServices.get('accessToken');

		if (token != undefined && !statePlayer.isFirstAccess) {
			setAccessToken(token);
		}
	}, [statePlayer.isFirstAccess]);

	const handleLogin = () => {
		navigate('/login');
	};

	const handleRegister = () => {
		navigate('/register');
	};

	const handleTheme = () => {
		console.log('Trocar tema');
	};

	const handleMyBets = () => {
		navigate('/my-bets');
	};

	const showWalletModal = () => {
		setIsModalVisible(true);
	};

	const handleClose = () => {
		setIsModalVisible(false);
	};

	const onRenderHeader = () => {
		return (
			<Header
				style={{
					display: 'flex',
					justifyContent: 'space-between',
					alignItems: 'center',
					padding: '0 1.5rem',
					backgroundColor: '#001529',
					boxShadow: '0 0.125rem 0.5rem rgba(0, 0, 0, 0.15)',
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
								padding: '0.5rem 0.75rem',
								borderRadius: '0.5rem',
								display: 'inline-flex',
								alignItems: 'center',
							}}
						>
							Saldo {statePlayer.currency} {statePlayer.balance}
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
		);
	};

	return (
		<Layout style={{ minHeight: '100vh', backgroundColor: '#f0f2f5' }}>
			{onRenderHeader()}

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
				{
					<div
						style={{
							display: 'flex',
							width: '100%',
							flexDirection: 'row',
							flexWrap: 'wrap',
						}}
					>
						<BetCard
							key={1}
							title={'Real Madrid x Barcelona'}
							isLogged={!statePlayer.isFirstAccess}
						></BetCard>
						<BetCard
							key={2}
							title={'Liverpol x Man. City'}
							isLogged={!statePlayer.isFirstAccess}
						></BetCard>
						<BetCard
							key={3}
							title={'Brasil x Argentina'}
							isLogged={!statePlayer.isFirstAccess}
						></BetCard>
						<BetCard
							key={4}
							title={'Paraguai x Uruguai'}
							isLogged={!statePlayer.isFirstAccess}
						></BetCard>
					</div>
				}

				<ModalTable isModalVisible={isModalVisible} onClose={handleClose} />
			</Content>
			<FloatButton onClick={handleTheme} shape="square" icon={<FormatPainterOutlined />} />
		</Layout>
	);
};

export default Home;
