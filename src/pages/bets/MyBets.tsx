import React, { useState, useEffect, useCallback } from 'react';
import Title from 'antd/es/typography/Title';
import request from '../../api/request';
import { BetType, MyBetsResponseType } from '../../types/Interfaces';
import { ColumnsType } from 'antd/es/table';
import { Layout, message, Table, Typography } from 'antd';
import { RootState } from '../../store/store';
import { useSelector } from 'react-redux';
import { DeleteOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { Content, Header } from 'antd/es/layout/layout';

const MyBets: React.FC = () => {
	const statePlayer = useSelector((state: RootState) => state.player);

	const [dataSource, setDataSource] = useState<MyBetsResponseType>();

	const [transactionId, setTransactionId] = useState<string | undefined>(undefined);

	const [loading, setLoading] = useState<boolean>(false);
	const [page, setPage] = useState<number>(1);
	const [limit, setLimit] = useState<number>(10);
	const [total, setTotal] = useState<number>(0);

	const navegate = useNavigate();

	const fetchBets = useCallback(async () => {
		if (!statePlayer.accessToken) navegate('/');

		setLoading(true);
		const headers: HeadersInit = {
			Authorization: `Bearer ${statePlayer.accessToken}`,
		};

		try {
			const response = await request.get(`/my-bets?page=${page}&limit=${limit}`, headers);

			const res = response as MyBetsResponseType;

			setDataSource(res);
			setTotal(res.total);
		} catch {
			message.error('Não foi possivel carregar as informações');
		} finally {
			setLoading(false);
		}
	}, [page, limit, statePlayer.accessToken, navegate]);

	useEffect(() => {
		fetchBets();
	}, [fetchBets]);

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
		<Layout style={{ minHeight: '100vh', backgroundColor: '#f0f2f5' }}>
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
					Minhas Apostas
				</Title>
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
			</Header>

			<Content
				style={{
					padding: '1.25rem',
					display: 'flex',
					flexDirection: 'column',
					alignItems: 'normal',
					flex: 1,
					maxWidth: '100%',
					height: '100vh',
				}}
			>
				<Table
					columns={columns}
					dataSource={dataSource?.data}
					rowKey="id"
					pagination={{
						current: page,
						pageSize: limit,
						total: total,
						onChange: (page, pageSize) => {
							setPage(page);
							setLimit(pageSize);
						},
					}}
					loading={loading}
					bordered
					scroll={{ x: true }}
					size={'middle'}
					expandable={{ fixed: true }}
				/>
			</Content>
		</Layout>
	);
};

export default MyBets;
