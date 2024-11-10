import { Form, Button } from 'antd';
import { IFormCardProps } from '../../types/InterfaceType';
import Title from 'antd/es/typography/Title';

const FormCard = <T extends object>({
	title,
	subtitle,
	fields,
	onFinish,
	loading,
	buttonText,
}: IFormCardProps<T>) => {
	return (
		<div
			style={{
				display: 'flex',
				justifyContent: 'center',
				alignItems: 'center',
				height: '100vh',
				boxShadow: '0 4px 8px rgba(0, 0, 0, 0.4)',
				borderRadius: '8px',
				backgroundColor: 'rgb(183 183 183)',
			}}
		>
			<div
				style={{
					maxWidth: '400px',
					margin: '0 auto',
					padding: '50px',
					boxShadow: '0 4px 8px rgba(0, 0, 0, 0.4)', // Adicionando box-shadow
					borderRadius: '8px', // Bordas arredondadas
					backgroundColor: '#fff', // Fundo branco
				}}
			>
				<div style={{ textAlign: 'center', padding: '20px' }}>
					<Title level={2} style={{ fontWeight: 'bold', color: '#1890ff' }}>
						{title}
					</Title>
					<Title level={3} style={{ fontWeight: 'normal', color: '#888' }}>
						{subtitle}
					</Title>
				</div>
				<Form
					name={title}
					initialValues={{ remember: true }}
					onFinish={onFinish}
					layout="vertical"
				>
					{fields.map((field, index) => (
						<Form.Item
							key={index}
							name={field.name}
							label={field.label}
							rules={field.rules}
							dependencies={field.dependencies}
						>
							{field.input}
						</Form.Item>
					))}

					<Form.Item>
						<Button type="primary" htmlType="submit" block loading={loading}>
							{buttonText}
						</Button>
					</Form.Item>
				</Form>
			</div>
		</div>
	);
};

export default FormCard;
