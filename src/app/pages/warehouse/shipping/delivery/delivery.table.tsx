import React, { useRef } from 'react';

import { Button, Input, Popconfirm, Space, Table } from 'antd';
import { CheckOutlined, CloseOutlined, SearchOutlined } from '@ant-design/icons';

import dateFormatter, { DATE_FORMAT } from 'src/app/helper/format/date';

import { DeliveryListItem } from './delivery.interface';
import OrderStatus from './delivery.status';

const Product: React.FC<{
    dataSource?: DeliveryListItem[];
    isLoading?: boolean;
    isActionDisabled?: boolean;
    pagination: any;
    onClickDetail?: (data: DeliveryListItem) => void;
    onClickScan?: (data: DeliveryListItem) => void;
    onClickConfirm?: (data: DeliveryListItem) => void;
    onClickCancel?: (data: DeliveryListItem) => void;
    onChange?: (pagination: any, query: { [x: string]: any }) => void;
    onPaginationChange?: (a: any) => void;
}> = ({
    dataSource = [],
    pagination,
    isLoading,
    isActionDisabled,
    onClickDetail,
    onClickScan,
    onClickConfirm,
    onClickCancel,
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
                    render: (text: string, record: DeliveryListItem) => (
                        <Button
                            style={{ padding: 0 }}
                            type='link'
                            disabled={isActionDisabled}
                            onClick={() => onClickDetail && onClickDetail(record)}
                        >
                            {text ? text.split('-').slice(1).join('-') : '-'}
                        </Button>
                    ),
                },
                {
                    title: 'Status',
                    dataIndex: 'status',
                    width: '80px',
                    defaultFilteredValue: ['delivery_initiated'],
                    filters: [
                        { value: 'delivery_initiated', text: 'open' },
                        { value: 'delivery_finished', text: 'done' },
                    ],
                    render: (status: string) => <OrderStatus status={status} />,
                },
                {
                    title: 'Customer',
                    dataIndex: 'customerName',
                    ellipsis: true,
                },
                {
                    title: 'Reference ID',
                    dataIndex: 'customerPurchasePaperId',
                    ellipsis: true,
                    ...getColumnSearchProps('customerPurchasePaperId'),
                    render: (text: string) => text || '-',
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
                    dataIndex: 'orderPriorPaperId',
                    width: '100px',
                    ...getColumnSearchProps('orderPriorPaperId'),
                },
                {
                    title: 'Action',
                    key: 'action',
                    width: '80px',
                    fixed: 'right' as any,
                    render: (_: string, record: DeliveryListItem) => (
                        <Space>
                            <Button
                                type='link'
                                disabled={!!record.receivedAt || !record.packagedAt}
                                onClick={() => onClickConfirm && onClickConfirm(record)}
                                icon={<CheckOutlined />}
                            />
                            <Popconfirm
                                title='Cancel?'
                                onConfirm={() => onClickCancel && onClickCancel(record)}
                            >
                                <Button
                                    type='link'
                                    style={{ color: '#ffa39e' }}
                                    disabled={!!record.receivedAt || !record.packagedAt}
                                    icon={<CloseOutlined />}
                                />
                            </Popconfirm>
                        </Space>
                    ),
                },
            ]}
        />
    );
};

export default Product;
