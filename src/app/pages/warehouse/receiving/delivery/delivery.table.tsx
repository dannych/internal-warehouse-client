import React, { useRef } from 'react';

import { Button, Input, Space, Table } from 'antd';
import { CheckOutlined, EditOutlined, SearchOutlined } from '@ant-design/icons';

import { DeliveryListItem } from './delivery.interface';

const Product: React.FC<{
    dataSource?: DeliveryListItem[];
    isLoading?: boolean;
    isActionDisabled?: boolean;
    pagination: any;
    onClickDetail?: (data: DeliveryListItem) => void;
    onClickEdit?: (data: DeliveryListItem) => void;
    onChange?: (pagination: any, query: { [x: string]: any }) => void;
    onPaginationChange?: (a: any) => void;
}> = ({
    dataSource = [],
    pagination,
    isLoading,
    isActionDisabled,
    onClickDetail,
    onClickEdit,
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
                            {text.split('-').slice(1).join('-')}
                        </Button>
                    ),
                },
                {
                    title: 'Ref.',
                    dataIndex: 'paperId',
                    ellipsis: true,
                    ...getColumnSearchProps('paperId'),
                    // width: '100px',
                    render: (text: string) => text || '-',
                },
                {
                    title: 'Sender',
                    dataIndex: 'supplierName',
                    ...getColumnSearchProps('supplierShippingPaperId'),
                    ellipsis: true,
                },
                {
                    title: 'Ref. ID',
                    dataIndex: 'supplierShippingPaperId',
                    ellipsis: true,
                    ...getColumnSearchProps('supplierShippingPaperId'),
                    render: (text: string) => text || '-',
                },
                {
                    title: 'Doc',
                    dataIndex: 'supplierShippingPaperFileUrl',
                    width: '60px',
                    render: (text: string) => (text ? <CheckOutlined /> : '-'),
                },
                {
                    title: 'Purc. ID',
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
                    render: (_: string, record: DeliveryListItem) => (
                        <Space>
                            <Button
                                type='link'
                                icon={<EditOutlined />}
                                onClick={() => onClickEdit && onClickEdit(record)}
                            />
                            {/* <Button
                                type='link'
                                href={`/print?id=${record._id}`}
                                target='_blank'
                                icon={<PrinterOutlined />}
                            /> */}
                        </Space>
                    ),
                },
            ]}
        />
    );
};

export default Product;
