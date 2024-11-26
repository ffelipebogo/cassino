import React, { useState, useEffect } from 'react';
import Title from 'antd/es/typography/Title';
import request from '../../api/request';
import { BetType, MyBetsResponseType } from '../../types/InterfaceType';
import { ColumnsType } from 'antd/es/table';
import { message, Table } from 'antd';
import { useLocation } from 'react-router-dom';

const MyBets: React.FC = () => {
	const location = useLocation();
	const accessToken = location.state.accessToken;

	const [dataSource, setDataSource] = useState<MyBetsResponseType>();
	const [loading, setLoading] = useState<boolean>(false);

	useEffect(() => {
		if (!accessToken) {
			return;
		}
		setLoading(true);
		const headers: HeadersInit = {
			Authorization: `Bearer ${accessToken}`,
		};

		request
			.get(`/my-bets?page=${1}&limit=${10}`, headers)
			.then((response) => {
				if (response) {
					setLoading(false);
					const resp: MyBetsResponseType = response as MyBetsResponseType;
					setDataSource(resp);
				}
			})
			.catch(() => {
				message.error('Não foi possivel carregar as informações');
			});
	}, []);

	const columns: ColumnsType<BetType> = [
		{
			title: 'ID',
			dataIndex: 'id',
			key: 'id',
		},
		{
			title: 'Data de Criação',
			dataIndex: 'createdAt',
			key: 'createdAt',
			render: (text) => new Date(text).toLocaleString(),
			sorter: (a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime(),
		},
		{
			title: 'Valor',
			dataIndex: 'amount',
			key: 'amount',
			sorter: (a, b) => a.amount - b.amount,
			render: (text) => `R$ ${text.toFixed(2)}`,
		},
		{
			title: 'Valor Vencido',
			dataIndex: 'winAmount',
			key: 'winAmount',
			sorter: (a, b) => a.winAmount - b.winAmount,
		},
		{
			title: 'Status',
			dataIndex: 'status',
			key: 'status',
			filters: [
				{ text: 'Win', value: 'Win' },
				{ text: 'Bet', value: 'Bet' },
			],
		},
		{
			title: 'Action',
			dataIndex: 'id',
			key: 'x',
			render: () => {
				return <a>Delete</a>;
			},
		},
	];

	return (
		<div
			style={{
				padding: '20px',
				backgroundColor: '#fff',
				borderRadius: '8px',
				boxShadow: '0px 4px 12px rgba(0, 0, 0, 0.1)',
			}}
		>
			<Title level={2} style={{ textAlign: 'center', marginBottom: '20px' }}>
				Minhas Apostas
			</Title>
			<Table
				columns={columns}
				dataSource={dataSource?.data}
				rowKey="id"
				pagination={{ pageSize: 10 }}
				loading={loading}
				bordered
				scroll={{ x: true }} // Permite rolagem horizontal em telas menores
				onChange={(pagination, filters, sorter) => {
					console.log(pagination, filters, sorter);
				}}
			/>
		</div>
	);
};

export default MyBets;
