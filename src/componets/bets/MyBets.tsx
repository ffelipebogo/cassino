import React, { useState, useEffect } from 'react';
import { Table } from 'antd';
import { ColumnsType } from 'antd/es/table';

// Definindo os tipos para os dados
interface ITableData {
	id: number;
	createdAt: string;
	amount: number;
	winAmount: number;
	status: string;
}

const MyBets: React.FC = () => {
	const [data, setData] = useState<ITableData[]>([]);
	const [loading, setLoading] = useState<boolean>(false);

	// Simulando a recuperação dos dados (pode ser substituído por uma chamada API)
	useEffect(() => {
		setLoading(true);
		// Simulação de dados com 100 registros
		setTimeout(() => {
			const mockData: ITableData[] = Array.from({ length: 100 }, (_, index) => ({
				id: index + 1,
				createdAt: new Date().toISOString(),
				amount: Math.floor(Math.random() * 1000) + 1,
				winAmount: Math.floor(Math.random() * 500) + 1,
				status: Math.random() > 0.5 ? 'Vencido' : 'Pendente',
			}));
			setData(mockData);
			setLoading(false);
		}, 1000);
	}, []);

	// Configuração das colunas da tabela
	const columns: ColumnsType<ITableData> = [
		{
			title: 'ID',
			dataIndex: 'id',
			key: 'id',
			sorter: (a, b) => a.id - b.id,
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
			render: (text) => `R$ ${text.toFixed(2)}`,
		},
		{
			title: 'Status',
			dataIndex: 'status',
			key: 'status',
			filters: [
				{ text: 'Vencido', value: 'Vencido' },
				{ text: 'Pendente', value: 'Pendente' },
			],
			onFilter: (value, record) => record.status.includes(value as string),
		},
	];

	return (
		<div style={{ padding: '20px' }}>
			<h2>Dados da Tabela</h2>
			<Table
				columns={columns}
				dataSource={data}
				rowKey="id"
				pagination={{
					pageSize: 10,
				}}
				loading={loading}
				bordered
				onChange={(pagination, filters, sorter) => {
					console.log(pagination, filters, sorter);
				}}
			/>
		</div>
	);
};

export default MyBets;
