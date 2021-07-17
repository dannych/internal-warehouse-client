import React, { useRef } from 'react';

import { Button, Input, Space, Table } from 'antd';
import { SearchOutlined, SendOutlined } from '@ant-design/icons';

import dateFormatter, { DATE_FORMAT } from 'src/app/helper/format/date';

import { OrderListItem } from './order.interface';
import OrderStatus from './order.status';

const Product: React.FC<{
    dataSource?: OrderListItem[];
    isLoading?: boolean;
    isActionDisabled?: boolean;
    pagination: any;
    onClickDetail?: (data: OrderListItem) => void;
    onChange?: (pagination: any, query: { [x: string]: any }) => void;
    onPaginationChange?: (a: any) => void;
    onClickDelivery?: (data: OrderListItem) => void;
}> = ({
    dataSource = [],
    pagination,
    isLoading,
    isActionDisabled,
    onClickDetail,
    onClickDelivery,
    onChange,
}) => {
    const searchInput = useRef<any>();

    const handleSearch = (_: any, confirm: any, __: any) => {
        confirm();
    };

    const handleReset = (clearFilters: any) => {
        clearFilters();
    };

    const getColumnSearchProps = (dataIndex: string) => ({
        filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters }: any) => (
            <div style={{ padding: 8 }}>
                <Input
                    ref={searchInput}
                    placeholder={`Search ${dataIndex}`}
                    value={selectedKeys}
                    onChange={(e) => setSelectedKeys(e.target.value ? e.target.value.trim() : null)}
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
        onFilterDropdownVisibleChange: (visible: boolean) => {
            if (visible) {
                setTimeout(() => searchInput.current!.select());
            }
        },
    });

    return (
        <Table
            size='small'
            rowKey='postId'
            pagination={{
                simple: true,
                size: 'small',
                position: ['topRight', 'bottomRight'],
                ...pagination,
            }}
            onChange={onChange}
            loading={isLoading}
            dataSource={dataSource}
            expandable={{
                rowExpandable: (record) => !!record.description,
                expandedRowRender: (record) => record.description,
            }}
            columns={[
                {
                    title: 'ID',
                    dataIndex: 'postId',
                    ...getColumnSearchProps('postId'),
                    fixed: 'left' as any,
                    width: '80px',
                    render: (text: string, record: OrderListItem) => (
                        <Button
                            style={{ padding: 0 }}
                            type='link'
                            disabled={isActionDisabled}
                            onClick={() => onClickDetail && onClickDetail(record)}
                        >
                            {text.split('-').slice(1).join('-')}
                        </Button>
                    ),
                },
                {
                    title: 'Status',
                    dataIndex: 'status',
                    width: '120px',
                    defaultFilteredValue: ['order_created'],
                    filters: [
                        { value: 'order_created', text: 'open' },
                        { value: 'order_fulfilled', text: 'done' },
                    ],
                    render: (status: string) => <OrderStatus status={status} />,
                },
                {
                    title: 'Supplier',
                    dataIndex: 'supplierName',
                    ...getColumnSearchProps('supplierName'),
                    ellipsis: true,
                },
                {
                    title: 'Created At',
                    dataIndex: 'createdAt',
                    ellipsis: true,
                    width: '160px',
                    render: (date: string) =>
                        dateFormatter(date).format(DATE_FORMAT['DD MMM YYYY']),
                },
                {
                    title: 'Days',
                    dataIndex: 'createdAt',
                    ellipsis: true,
                    width: '60px',
                    render: (date: string, entity) =>
                        entity.status === 'order_fulfilled'
                            ? '-'
                            : dateFormatter().diff(dateFormatter(date), 'd'),
                },
                {
                    title: 'Ppr. ID',
                    dataIndex: 'supplierPurchasePaperId',
                    ...getColumnSearchProps('supplierPurchasePaperId'),
                    ellipsis: true,
                    width: '100px',
                    render: (text: string) => text || '-',
                },
                {
                    title: 'Action',
                    key: 'action',
                    width: '80px',
                    fixed: 'right' as any,
                    render: (_: string, record: OrderListItem) => (
                        <Space>
                            <Button
                                disabled={record.status === 'order_fulfilled'}
                                type='link'
                                target='_blank'
                                onClick={() => onClickDelivery && onClickDelivery(record)}
                                icon={<SendOutlined />}
                            />
                        </Space>
                    ),
                },
            ]}
        />
    );
};

export default Product;
