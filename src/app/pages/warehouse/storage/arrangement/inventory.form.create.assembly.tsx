import React from 'react';

import { Button, PageHeader, Table } from 'antd';
import { DeleteOutlined } from '@ant-design/icons';

const InventoryCreateFormRegister: React.FC<{
    ins: any[];
    outs: any[];
    onAddInClick?: () => void;
    onAddOutClick?: () => void;
    onItemInDeleteClick?: (id: string) => void;
    onItemOutDeleteClick?: (sku: string) => void;
}> = ({ ins, outs, onAddInClick, onAddOutClick, onItemInDeleteClick, onItemOutDeleteClick }) => {
    return (
        <div>
            <PageHeader
                style={{ padding: 0, marginBottom: '32px' }}
                title='Ins'
                extra={<Button onClick={onAddInClick}>Add in</Button>}
            >
                <Table
                    dataSource={ins}
                    pagination={{ simple: true, pageSize: 5 }}
                    columns={[
                        {
                            title: 'SKU',
                            dataIndex: 'sku',
                        },
                        {
                            title: 'QN',
                            dataIndex: 'productQn',
                        },
                        {
                            title: 'Qty',
                            dataIndex: 'productQuantity',
                        },
                        {
                            dataIndex: 'productQuantity',
                            render: (value, record) => (
                                <Button
                                    htmlType='submit'
                                    icon={<DeleteOutlined />}
                                    onClick={() =>
                                        onItemInDeleteClick && onItemInDeleteClick(record._id)
                                    }
                                />
                            ),
                        },
                    ]}
                />
            </PageHeader>

            <PageHeader
                style={{ padding: 0 }}
                title='Out'
                extra={<Button onClick={onAddOutClick}>Add out</Button>}
            >
                <Table
                    dataSource={outs}
                    pagination={{ simple: true, pageSize: 5 }}
                    columns={[
                        {
                            title: 'SKU',
                            dataIndex: 'productSku',
                        },
                        {
                            title: 'Qty',
                            dataIndex: 'productQuantity',
                            render: (value, record) =>
                                value || record.productSns.split('\n').length,
                        },
                        {
                            dataIndex: 'productQuantity',
                            render: (value, record) => (
                                <Button
                                    htmlType='submit'
                                    icon={<DeleteOutlined />}
                                    onClick={() =>
                                        onItemOutDeleteClick &&
                                        onItemOutDeleteClick(record.productSku)
                                    }
                                />
                            ),
                        },
                    ]}
                />
            </PageHeader>
        </div>
    );
};

export default InventoryCreateFormRegister;
