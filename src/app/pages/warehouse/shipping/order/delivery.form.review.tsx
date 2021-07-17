import React from 'react';

import { Badge, Descriptions, Space, Table } from 'antd';

import dateFormatter, { DATE_FORMAT } from 'src/app/helper/format/date';

const DeliveryFormReview: React.FC<{ orderPayload: any; orderMeta: any; payload: any }> = ({
    payload,
    orderPayload,
    orderMeta,
}) => {
    const products = orderPayload.products.reduce(
        (result: object, product: any) => ({
            ...result,
            [product._sid]: product,
        }),
        {}
    );
    const sourcingProducts = orderMeta.sourcing
        ? orderMeta.sourcing.products.reduce(
              (result: object, product: any) => ({
                  ...result,
                  [product._sid]: product,
              }),
              {}
          )
        : {};
    return (
        <div style={{ width: '100%' }}>
            <Space direction='vertical' size='small' style={{ width: '100%' }}>
                <Descriptions size='small' colon={false} layout='vertical'>
                    <Descriptions.Item label='Order ID' span={1}>
                        {orderPayload.postId}
                    </Descriptions.Item>
                    <Descriptions.Item label='Reference' span={1}>
                        {orderPayload.customerPurchaseRepresentativeName}
                    </Descriptions.Item>
                    <Descriptions.Item label='Order Date' span={1}>
                        {dateFormatter(orderPayload.createdAt).format(DATE_FORMAT['DD MMMM YYYY'])}
                    </Descriptions.Item>
                    <Descriptions.Item label='Customer Name' span={1}>
                        {orderPayload.customerName}
                    </Descriptions.Item>
                    <Descriptions.Item label='Customer Code' span={1}>
                        {orderPayload.customerCode}
                    </Descriptions.Item>
                </Descriptions>
                <Table
                    id='id'
                    rowKey='id'
                    size='small'
                    dataSource={payload.products}
                    pagination={false}
                    expandable={{
                        rowExpandable: (product) => !product.isValid,
                        expandedRowRender: (product) => (
                            <Descriptions size='small'>
                                <Descriptions.Item label='ID Exist'>
                                    {'' + product.hasId}
                                </Descriptions.Item>
                                <Descriptions.Item label='Quantity Valid'>
                                    {'' + product.hasLimit}
                                </Descriptions.Item>
                            </Descriptions>
                        ),
                    }}
                    columns={[
                        {
                            title: 'Product',
                            dataIndex: 'deliveryProductSid',
                            render: (sid: string) => products[sid].name,
                        },
                        {
                            title: 'Validation',
                            dataIndex: 'isValid',
                            render: (value: boolean) => (
                                <Badge
                                    status={value ? 'success' : 'error'}
                                    text={value ? 'Valid' : 'Invalid'}
                                />
                            ),
                        },
                        {
                            title: 'Qty.',
                            dataIndex: 'quantity',
                        },
                        {
                            title: 'Serialable',
                            dataIndex: 'serialable',
                            render: (value: boolean) => (value ? 'Y' : 'N'),
                        },
                    ]}
                />
                <Table
                    id='id'
                    rowKey='id'
                    size='small'
                    dataSource={payload.sourcedProducts}
                    pagination={false}
                    expandable={{
                        rowExpandable: (product) => !product.isValid,
                        expandedRowRender: (product) => (
                            <Descriptions size='small'>
                                <Descriptions.Item label='ID Exist'>
                                    {'' + product.hasId}
                                </Descriptions.Item>
                                <Descriptions.Item label='Quantity Valid'>
                                    {'' + product.hasLimit}
                                </Descriptions.Item>
                            </Descriptions>
                        ),
                    }}
                    columns={[
                        {
                            title: 'Sourcing Product',
                            dataIndex: 'sourcingProductSid',
                            render: (sid: string) => sourcingProducts[sid].name,
                        },
                        {
                            title: 'Validation',
                            dataIndex: 'isValid',
                            render: (value: boolean) => (
                                <Badge
                                    status={value ? 'success' : 'error'}
                                    text={value ? 'Valid' : 'Invalid'}
                                />
                            ),
                        },
                        {
                            title: 'Qty.',
                            dataIndex: 'quantity',
                        },
                        {
                            title: 'Serialable',
                            dataIndex: 'serialable',
                            render: (value: boolean) => (value ? 'Y' : 'N'),
                        },
                    ]}
                />
                <Table
                    id='id'
                    rowKey='id'
                    size='small'
                    dataSource={payload.extraProducts}
                    pagination={false}
                    expandable={{
                        rowExpandable: (product) => !product.isValid,
                        expandedRowRender: (product) => (
                            <Descriptions size='small'>
                                <Descriptions.Item label='ID Exist'>
                                    {'' + product.hasId}
                                </Descriptions.Item>
                                <Descriptions.Item label='Quantity Valid'>
                                    {'' + product.hasLimit}
                                </Descriptions.Item>
                            </Descriptions>
                        ),
                    }}
                    columns={[
                        {
                            title: 'Extra Product',
                            dataIndex: 'lot',
                        },
                        {
                            title: 'Validation',
                            dataIndex: 'isValid',
                            render: (value: boolean) => (
                                <Badge
                                    status={value ? 'success' : 'error'}
                                    text={value ? 'Valid' : 'Invalid'}
                                />
                            ),
                        },
                        {
                            title: 'Qty.',
                            dataIndex: 'quantity',
                        },
                        {
                            title: 'Serialable',
                            dataIndex: 'serialable',
                            render: (value: boolean) => (value ? 'Y' : 'N'),
                        },
                    ]}
                />
            </Space>
        </div>
    );
};

export default DeliveryFormReview;
