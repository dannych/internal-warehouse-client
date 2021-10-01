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
    onClickDeliver?: (data: OrderListItem) => void;
    onClickPackage?: (data: OrderListItem) => void;
}> = ({
    dataSource = [],
    pagination,
    isLoading,
    isActionDisabled,
    onClickDetail,
    onClickPackage,
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
                    width: '80px',
                    defaultFilteredValue: ['order_initiated'],
                    filters: [
                        { value: 'order_initiated', text: 'open' },
                        { value: 'order_finished', text: 'done' },
                    ],
                    render: (status: string) => <OrderStatus status={status} />,
                },
                {
                    title: 'Customer',
                    dataIndex: 'customerName',
                    ellipsis: true,
                },
                {
                    title: 'Ref',
                    dataIndex: 'customerPurchasePaperId',
                    ellipsis: true,
                },
                {
                    title: 'Created At',
                    dataIndex: 'createdAt',
                    width: '150px',
                    ...getColumnSearchProps('createdAt'),
                    render: (date: string) =>
                        dateFormatter(date).format(DATE_FORMAT['DD MMM YYYY']),
                },
                {
                    title: 'Dist. ID',
                    dataIndex: 'priorPaperId',
                    ...getColumnSearchProps('priorPaperId'),
                    ellipsis: true,
                    width: '100px',
                },
                {
                    title: '',
                    key: 'action',
                    width: '40px',
                    fixed: 'right' as any,
                    render: (_: string, record: OrderListItem) => (
                        <Space>
                            <Button
                                type='link'
                                disabled={!!record.fullyScheduledAt}
                                onClick={() => onClickPackage && onClickPackage(record)}
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
