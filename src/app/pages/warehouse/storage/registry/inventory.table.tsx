import React, { useRef } from 'react';

import { Button, Input, Space, Table } from 'antd';
import { SearchOutlined } from '@ant-design/icons';

import dateFormatter, { DATE_FORMAT } from 'src/app/helper/format/date';

import { ReadManyItems } from './inventory.interface';

const CustomerTable: React.FC<{
    dataSource?: ReadManyItems[];
    pagination: any;
    isLoading?: boolean;
    isActionDisabled?: boolean;
    onEdit?: (data: ReadManyItems) => void;
    onClickDetail?: (data: ReadManyItems) => void;
    onSearch?: (query: { [x: string]: any }) => void;
    onChange?: (pagination: any, query: { [x: string]: any }, sorter: any) => void;
}> = ({
    dataSource = [],
    pagination,
    isLoading,
    isActionDisabled,
    onClickDetail,
    onEdit,
    onChange,
    onSearch,
}) => {
    const searchInput = useRef<any>();

    const handleSearch = (selectedKeys: any, confirm: any, dataIndex: any) => {
        confirm();
        onSearch && onSearch({ [dataIndex]: selectedKeys[0] });
    };

    const handleReset = (clearFilters: any) => {
        clearFilters();
        onSearch && onSearch({});
    };

    const getColumnSearchProps = (dataIndex: string) => ({
        filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters }: any) => (
            <div style={{ padding: 8 }}>
                <Input
                    ref={searchInput}
                    placeholder={`Search ${dataIndex}`}
                    value={selectedKeys[0]}
                    onChange={(e) => setSelectedKeys(e.target.value ? [e.target.value] : [])}
                    onPressEnter={() => handleSearch(selectedKeys, confirm, dataIndex)}
                    style={{ width: 188, marginBottom: 8, display: 'block' }}
                />
                <Space>
                    <Button
                        type='primary'
                        onClick={() => handleSearch(selectedKeys, confirm, dataIndex)}
                        icon={<SearchOutlined />}
                        size='small'
                        style={{ width: 90 }}
                    >
                        Search
                    </Button>
                    <Button
                        onClick={() => handleReset(clearFilters)}
                        size='small'
                        style={{ width: 90 }}
                    >
                        Reset
                    </Button>
                </Space>
            </div>
        ),
        filterIcon: (filtered: any) => (
            <SearchOutlined style={{ color: filtered ? '#1890ff' : undefined }} />
        ),
        onFilter: (value: any, record: any) =>
            record[dataIndex]
                ? record[dataIndex].toString().toLowerCase().includes(value.toLowerCase())
                : '',
        onFilterDropdownVisibleChange: (visible: boolean) => {
            if (visible) {
                setTimeout(() => searchInput.current!.select());
            }
        },
    });

    return (
        <Table
            size='small'
            rowKey='code'
            onChange={onChange}
            pagination={{
                simple: true,
                size: 'small',
                position: ['topRight', 'bottomRight'],
                ...pagination,
            }}
            loading={isLoading}
            dataSource={dataSource}
            columns={[
                {
                    title: 'SKU',
                    dataIndex: 'sku',
                    sorter: true,
                    ellipsis: true,
                    ...getColumnSearchProps('sku'),
                    render: (text: string, record: ReadManyItems) => (
                        <Button
                            style={{ padding: 0 }}
                            type='link'
                            disabled={isActionDisabled}
                            onClick={() => onClickDetail && onClickDetail(record)}
                        >
                            {text}
                        </Button>
                    ),
                },
                {
                    title: 'Type',
                    dataIndex: 'type',
                    width: '100px',
                    filters: [
                        { value: 'in', text: 'in' },
                        { value: 'out', text: 'out' },
                    ],
                },
                {
                    title: '#',
                    dataIndex: 'productQuantity',
                    width: '50px',
                },
                {
                    title: 'Name',
                    dataIndex: 'productName',
                    ...getColumnSearchProps('productName'),
                    ellipsis: true,
                },
                {
                    title: 'QN',
                    dataIndex: 'productQn',
                    ...getColumnSearchProps('productQn'),
                    render: (text) => text || '-',
                },
                {
                    title: 'Ref',
                    dataIndex: 'relatedPaperId',
                    width: '80px',
                    render: (text) => text || '-',
                },
                {
                    title: 'Created At',
                    dataIndex: 'createdAt',
                    ellipsis: true,
                    width: '120px',
                    render: (date: string) =>
                        dateFormatter(date).format(DATE_FORMAT['DD MMM YYYY']),
                },
            ]}
        />
    );
};

export default CustomerTable;
