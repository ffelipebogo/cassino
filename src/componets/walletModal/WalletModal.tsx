import React, { useState, useEffect, useCallback } from 'react';
import { Modal, Table, Button, Input, Select, Space, message } from 'antd';
import { ColumnsType } from 'antd/es/table';
import { ModalTableProps, MyTransactionType, TransactionType } from '../../types/Interfaces';
import request from '../../api/request';
import { useSelector } from 'react-redux';
import { RootState } from '../../store/store';

const { Option } = Select;

const ModalTable: React.FC<ModalTableProps> = ({ isModalVisible, onClose }) => {
	const statePlayer = useSelector((state: RootState) => state.player);

	const [filteredData, setFilteredData] = useState<TransactionType[]>();
	const [dataSource, setDataSource] = useState<MyTransactionType>();
	const [typeFilter, setTypeFilter] = useState<string | undefined>(undefined);
	const [idFilter, setIdFilter] = useState<string | undefined>(undefined);
	const [loading, setLoading] = useState<boolean>(false);
	const [page, setPage] = useState<number>(1);
	const [limit, setLimit] = useState<number>(10);
	const [total, setTotal] = useState<number>(0);

	const fetchTransactions = useCallback(async () => {
		if (!statePlayer.accessToken) return;

		setLoading(true);
		const headers: HeadersInit = {
			Authorization: `Bearer ${statePlayer.accessToken}`,
		};
		try {
			const response = await request.get(
				`/my-transactions?page=${page}&limit=${limit}`,
				headers,
			);

			const resp: MyTransactionType = response as MyTransactionType;
			setDataSource(resp);
			setFilteredData(resp.data);
			setTotal(resp.total);
		} catch {
			message.error('Não foi possivel carregar as informações');
		} finally {
			setLoading(false);
		}
	}, [page, limit, statePlayer.accessToken]);

	useEffect(() => {
		fetchTransactions();
	}, [fetchTransactions]);

	const handleTypeFilterChange = (value: string) => {
		setTypeFilter(value);
	};

	const handleIdFilterChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		setIdFilter(e.target.value);
	};

	const handleApplyFilters = useCallback(() => {
		if (!dataSource?.data) return;

		let filtered = [...dataSource.data];
		if (typeFilter) filtered = filtered.filter((item) => item.type === typeFilter);
		if (idFilter) filtered = filtered.filter((item) => item.id.includes(idFilter));

		setFilteredData(filtered);
	}, [typeFilter, idFilter, dataSource]);

	const columns: ColumnsType<TransactionType> = [
		{
			title: 'ID',
			dataIndex: 'id',
			key: 'id',
		},
		{
			title: 'Data/Hora',
			dataIndex: 'createdAt',
			key: 'createdAt',
		},
		{
			title: 'Tipo',
			dataIndex: 'type',
			key: 'type',
		},
		{
			title: 'Valor',
			dataIndex: 'amount',
			key: 'amount',
		},
	];

	return (
		<Modal
			title="Minhas operações"
			open={isModalVisible}
			onCancel={onClose}
			footer={null}
			width={800}
		>
			<Space direction="vertical" style={{ width: '100%' }}>
				<Space>
					<Input
						placeholder="Filtrar por ID"
						value={idFilter}
						onChange={handleIdFilterChange}
						style={{ width: 200 }}
					/>
					<Select
						placeholder="Filtrar por Tipo"
						value={typeFilter}
						onChange={handleTypeFilterChange}
						style={{ width: 200 }}
					>
						<Option value="win">Win</Option>
						<Option value="bet">Bet</Option>
					</Select>
					<Button type="primary" onClick={handleApplyFilters}>
						Aplicar Filtros
					</Button>
				</Space>
				<Table
					columns={columns}
					dataSource={filteredData}
					rowKey="id"
					loading={loading}
					bordered
					pagination={{
						current: page,
						pageSize: limit,
						total: total,
						onChange: (page, pageSize) => {
							setPage(page);
							setLimit(pageSize);
						},
					}}
				/>
			</Space>
		</Modal>
	);
};

export default ModalTable;
