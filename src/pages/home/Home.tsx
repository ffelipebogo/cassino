import React, { useEffect, useState } from 'react';
import { Button, Input, Layout, Typography } from 'antd';
import { useLocation, useNavigate } from 'react-router-dom';

const { Header, Content } = Layout;
const { Title } = Typography;

const Home: React.FC = () => {
	const navigate = useNavigate();
	const location = useLocation();
	const [acessToken, setacessToken] = useState<string>('');

	const token = location.state?.acessToken || false;

	useEffect(() => {
		// if (token !== '' && acessToken === '') {
		// 	setacessToken(token);
		// }
	}, []);

	const handleLogin = () => {
		navigate('/login');
	};

	const handleRegister = () => {
		navigate('/register');
	};

	return (
		<Layout style={{ height: '100vh' }}>
			<Header
				style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}
			>
				<Title level={2} style={{ color: '#fff', margin: 0 }}>
					Home
				</Title>
				<div>
					{token && (
						<>
							<Button type="primary" onClick={handleLogin} style={{ marginRight: 8 }}>
								Login
							</Button>
							<Button onClick={handleRegister}>Registrar-se</Button>
						</>
					)}
				</div>
			</Header>
			<Content
				style={{
					padding: '50px',
					display: 'flex',
					flexDirection: 'column',
					alignItems: 'center',
				}}
			>
				{token && (
					<Input
						placeholder="Digite seu texto aqui..."
						style={{ width: '300px', marginTop: '20px' }}
					/>
				)}
			</Content>
		</Layout>
	);
};

export default Home;
