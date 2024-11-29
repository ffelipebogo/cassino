import React, { useState, useEffect } from 'react';
import Title from 'antd/es/typography/Title';
import request from '../../api/request';
import { BetType, MyBetsResponseType } from '../../types/Interfaces';
import { ColumnsType } from 'antd/es/table';
import { message, Table } from 'antd';
import { RootState } from '../../store/store';
import { useSelector } from 'react-redux';
import { DeleteOutlined } from '@ant-design/icons';

const MyBets: React.FC = () => {
	const statePlayer = useSelector((state: RootState) => state.player);

	const [dataSource, setDataSource] = useState<MyBetsResponseType>();
	const [loading, setLoading] = useState<boolean>(false);
	const [transactionId, setTransactionId] = useState<string | undefined>(undefined);

	useEffect(() => {
		const headers: HeadersInit = {
			Authorization: `Bearer ${statePlayer.accessToken}`,
		};
		setLoading(true);

		request
			.get(`/my-bets?page=${1}&limit=${10}`, headers)
			.then((response) => {
				if (response) {
					setDataSource(response as MyBetsResponseType);
				}
			})
			.catch(() => {
				message.error('Não foi possivel carregar as informações');
			})
			.finally(() => {
				setLoading(false);
			});
	}, []);

	const handleDelete = () => {
		if (transactionId != undefined) {
			setLoading(true);
			const headers: HeadersInit = {
				Authorization: `Bearer ${statePlayer.accessToken}`,
			};

			request
				.delete(`/my-bet/${transactionId}`, headers)
				.then((response) => {
					console.log(response);
				})
				.catch(() => {
					message.error('Não foi possivel cancelar aposta');
				})
				.finally(() => {
					setLoading(false);
					setTransactionId(undefined);
				});
		}
	};

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
			render: (text) => `R$ ${text ? text.toFixed(2) : 0}`,
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
			key: 'action',
			render: (_, record) => {
				setTransactionId(record.id);
				return (
					<DeleteOutlined
						onClick={handleDelete}
						style={{ fontSize: '22px', color: 'red' }}
					/>
				);
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
