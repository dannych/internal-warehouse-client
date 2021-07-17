import * as React from 'react';

import { QrcodeOutlined } from '@ant-design/icons';
import { Button, Collapse, Descriptions, Space, Spin, Table, Tag } from 'antd';

import dateFormatter, { DATE_FORMAT } from 'src/app/helper/format/date';

import OrderStatus from './order.status';

const OrderDetail: React.FC<{
    detailIsLoading: boolean;
    detailMeta: any;
    detailPayload: any;
    onIdClick?: (payload: any) => void;
}> = ({ detailMeta, detailPayload, detailIsLoading, onIdClick }) => {
    const productQuantityDispatchIndex = (detailMeta?.deliveries || []).reduce(
        (index: any, dispatch: any) => ({
            ...index,
            ...dispatch.products.reduce(
                (dispatchIndex: any, product: any) => ({
                    ...dispatchIndex,
                    [product._sid]: (dispatchIndex[product._sid] || 0) + product.quantity,
                }),
                index
            ),
        }),
        {}
    );
    return (
        <Space direction='vertical' size='small' style={{ width: '100%' }}>
            <Descriptions size='small' bordered={true}>
                <Descriptions.Item label='Order Id' span={2}>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                        <span>{detailPayload.postId}</span>
                        <Button
                            type='link'
                            icon={<QrcodeOutlined />}
                            onClick={() => onIdClick && onIdClick(detailPayload)}
                        />
                    </div>
                </Descriptions.Item>
                <Descriptions.Item label='Created At' span={1}>
                    {dateFormatter(detailPayload.createdAt).format(DATE_FORMAT['YYYY-MM-DD'])}
                </Descriptions.Item>
                <Descriptions.Item label='Status' span={3}>
                    <OrderStatus status={detailPayload.status} />
                </Descriptions.Item>
                <Descriptions.Item label='Purchaser' span={3}>
                    {detailPayload.supplierPurchaseRepresentativeName}
                </Descriptions.Item>
                <Descriptions.Item label='Supplier Name' span={3}>
                    {detailPayload.supplierName}
                </Descriptions.Item>
                <Descriptions.Item label='Supplier Reference Id' span={3}>
                    {detailPayload.supplierPaperId || '-'}
                </Descriptions.Item>
                <Descriptions.Item label='Notes' span={3}>
                    {detailPayload.description || '-'}
                </Descriptions.Item>
            </Descriptions>
            <Collapse bordered={false} defaultActiveKey={1}>
                <Collapse.Panel header={<Space>Products</Space>} key='1'>
                    <Table
                        size='small'
                        bordered={true}
                        pagination={false}
                        scroll={{ x: '75vw' }}
                        dataSource={detailPayload.products}
                        columns={[
                            {
                                title: 'Name',
                                dataIndex: 'name',
                                ellipsis: true,
                            },
                            { title: 'Qty.', dataIndex: 'quantity', width: '60px', align: 'right' },
                            {
                                align: 'right',
                                width: '60px',
                                title: 'Rest',
                                dataIndex: 'quantity',
                                render: (quantity: number, record: any) =>
                                    detailIsLoading ? (
                                        <Spin size='small' />
                                    ) : (
                                        quantity - (productQuantityDispatchIndex[record._sid] || 0)
                                    ),
                            },
                            {
                                title: 'PIN',
                                dataIndex: 'pin',
                            },
                            {
                                title: 'Type',
                                dataIndex: 'type',
                            },
                            {
                                title: 'Tags',
                                dataIndex: 'tags',
                                ellipsis: true,
                                render: (_, record) => (
                                    <div>
                                        {(record.tags || []).map((x: string) => (
                                            <Tag>{x}</Tag>
                                        ))}
                                        {(record.categories || []).map((x: string) => (
                                            <Tag>{x}</Tag>
                                        ))}
                                    </div>
                                ),
                            },
                        ]}
                    />
                </Collapse.Panel>
                <Collapse.Panel
                    header={<Space>Deliveries {detailIsLoading && <Spin size='small' />}</Space>}
                    key='2'
                >
                    <Table
                        size='small'
                        rowKey='postId'
                        bordered={true}
                        pagination={false}
                        loading={detailIsLoading}
                        dataSource={detailMeta?.deliveries || []}
                        columns={[
                            {
                                title: 'Delivered At',
                                dataIndex: 'createdAt',
                                render: (value) =>
                                    dateFormatter(value).format(DATE_FORMAT['DD MMMM YYYY']),
                            },
                        ]}
                        expandable={{
                            expandRowByClick: true,
                            expandedRowRender: (data) => (
                                <Table
                                    size='small'
                                    rowKey='id'
                                    bordered={true}
                                    pagination={false}
                                    loading={detailIsLoading}
                                    dataSource={data.products}
                                    columns={[
                                        { title: 'PIN', dataIndex: 'pin' },
                                        { title: 'Qty.', dataIndex: 'quantity' },
                                        { title: 'Lot', dataIndex: 'lot' },
                                    ]}
                                />
                            ),
                        }}
                    />
                </Collapse.Panel>
                <Collapse.Panel header={<Space>Process</Space>} key='3'>
                    <Table
                        size='small'
                        bordered={true}
                        pagination={false}
                        scroll={{ x: '75vw' }}
                        dataSource={detailMeta?.process || []}
                        columns={[
                            {
                                title: 'Name',
                                dataIndex: 'orderSourcingOriginPaperId',
                            },
                        ]}
                    />
                </Collapse.Panel>
            </Collapse>
        </Space>
    );
};

export default OrderDetail;
