import React from 'react';

import { Descriptions, Space, Table } from 'antd';

import { ReadManyItems } from './inventory.interface';

const OrderDetail: React.FC<{ payload: ReadManyItems; meta: any; metaIsLoading?: boolean }> = ({
    payload,
    meta,
    metaIsLoading,
}) => {
    return (
        <Space direction='vertical' size='small' style={{ width: '100%' }}>
            <Descriptions size='small' bordered={true}>
                <Descriptions.Item label='SKU' span={2}>
                    {payload.sku}
                </Descriptions.Item>
                <Descriptions.Item label='Stock' span={1}>
                    {payload.count}
                </Descriptions.Item>
            </Descriptions>
            <Table
                rowKey='productLot'
                dataSource={meta?.registries || []}
                size='small'
                bordered={true}
                pagination={false}
                loading={metaIsLoading}
                columns={[
                    {
                        title: 'Lot',
                        dataIndex: 'productLot',
                    },
                    {
                        title: 'Serializable',
                        dataIndex: 'isSerializable',
                        render: (value) => (value ? 'Y' : 'N'),
                    },
                    {
                        title: 'Stock',
                        dataIndex: 'productStock',
                    },
                ]}
                expandable={{
                    rowExpandable: () => true,
                    expandedRowRender: (data) => (
                        <Table
                            rowKey='orderSourcingOriginPaperId'
                            size='small'
                            dataSource={data.process}
                            pagination={false}
                            columns={[
                                {
                                    title: 'Stock',
                                    dataIndex: 'orderStockPost',
                                    render: (text) => (text ? 'Y' : 'N'),
                                },
                                {
                                    title: 'PO',
                                    dataIndex: 'orderSourcingOriginPaperId',
                                    render: (text) => text || '-',
                                },
                            ]}
                        />
                    ),
                }}
            />
        </Space>
    );
};

export default OrderDetail;
