import React, { useState, useEffect } from 'react';
import { Modal, Table, Button, Input, Select, Space, message } from 'antd';
import { ColumnsType } from 'antd/es/table';
import {
	IPagination,
	ModalTableProps,
	MyTransactionType,
	TransactionType,
} from '../../types/InterfaceType';
import request from '../../api/request';

const { Option } = Select;

const ModalTable: React.FC<ModalTableProps> = ({
	isModalVisible,
	page,
	limit,
	onClose,
	onPageChange,
	accessToken,
}) => {
	const [filteredData, setFilteredData] = useState<TransactionType[]>();
	const [dataSource, setDataSource] = useState<MyTransactionType>();
	const [typeFilter, setTypeFilter] = useState<string | undefined>(undefined);
	const [idFilter, setIdFilter] = useState<string | undefined>(undefined);
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
			.get(`/my-transactions?page=${1}&limit=${10}`, headers)
			.then((response) => {
				if (response) {
					setLoading(false);
					const resp: MyTransactionType = response as MyTransactionType;
					setDataSource(resp);
					setFilteredData(resp.data);
				}
			})
			.catch((er) => {
				message.error('Não foi possivel carregar as informações');
			});
	}, [accessToken]);

	const handleTypeFilterChange = (value: string) => {
		setTypeFilter(value);
	};

	const handleIdFilterChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		setIdFilter(e.target.value);
	};

	const handleApplyFilters = () => {
		let filtered = dataSource?.data;
		if (typeFilter) {
			filtered = filtered?.filter((item) => item.type == typeFilter);
		}
		if (idFilter) {
			filtered = filtered?.filter((item) => item.id.includes(idFilter));
		}
		setFilteredData(filtered);
	};

	const handleTableChange = (pagination: IPagination) => {
		const { current, pageSize } = pagination;
		if (!filteredData) {
			onPageChange(current || 1, pageSize || 10);
		}
	};

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
						total: 9,
						onChange: (page, pageSize) =>
							handleTableChange({ current: page, pageSize }),
					}}
				/>
			</Space>
		</Modal>
	);
};

export default ModalTable;
