import * as React from 'react';

import { QrcodeOutlined } from '@ant-design/icons';
import { Button, Collapse, Descriptions, Space, Spin, Table, Tag } from 'antd';

import PriceText from 'src/app/component/price.component';
import dateFormatter, { DATE_FORMAT } from 'src/app/helper/format/date';

import OrderStatus from './order.status';

const OrderDetail: React.FC<{
    deliveryIsLoading: boolean;
    deliveryMeta: any;
    deliveryPayload: any;
    onIdClick?: (payload: any) => void;
}> = ({ deliveryMeta, deliveryPayload, deliveryIsLoading, onIdClick }) => (
    <Space direction='vertical' size='small' style={{ width: '100%' }}>
        <Descriptions size='small' bordered={true}>
            <Descriptions.Item label='Order Id' span={2}>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span>{deliveryPayload.postId}</span>
                    <Button
                        type='link'
                        icon={<QrcodeOutlined />}
                        onClick={() => onIdClick && onIdClick(deliveryPayload)}
                    />
                </div>
            </Descriptions.Item>
            <Descriptions.Item label='Created At' span={1}>
                {dateFormatter(deliveryPayload.createdAt).format(DATE_FORMAT['YYYY-MM-DD'])}
            </Descriptions.Item>
            <Descriptions.Item label='Status' span={3}>
                <OrderStatus status={deliveryPayload.status} />
            </Descriptions.Item>
            <Descriptions.Item label='Sales' span={3}>
                {deliveryPayload.representativeName}
            </Descriptions.Item>
            <Descriptions.Item label='Customer Name' span={3}>
                {deliveryPayload.customerName}
            </Descriptions.Item>
            <Descriptions.Item label='Customer Reference Id' span={3}>
                {deliveryPayload.customerPaperId}
            </Descriptions.Item>
            <Descriptions.Item label='Notes' span={3}>
                {deliveryPayload.description}
            </Descriptions.Item>
        </Descriptions>
        <Collapse bordered={false} defaultActiveKey={['1', '2']}>
            <Collapse.Panel header={<Space>Products</Space>} key='1'>
                <Table
                    size='small'
                    bordered={true}
                    pagination={false}
                    scroll={{ x: '75vw' }}
                    columns={[
                        {
                            title: 'Name',
                            dataIndex: 'name',
                            ellipsis: true,
                        },
                        {
                            title: 'Price',
                            dataIndex: 'price',
                            render: (value, record) => (
                                <PriceText tax={record.priceIncludeTax} value={value} />
                            ),
                        },
                        { title: 'Qty.', dataIndex: 'quantity', width: '60px', align: 'right' },
                        {
                            title: 'Total',
                            dataIndex: 'price',
                            align: 'right',
                            render: (value, record) => (
                                <PriceText
                                    tax={record.priceIncludeTax}
                                    value={value * record.quantity}
                                />
                            ),
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
                    dataSource={deliveryPayload.products}
                    summary={() => (
                        <Table.Summary.Row>
                            <Table.Summary.Cell index={0} colSpan={3}>
                                Total Price
                            </Table.Summary.Cell>
                            <Table.Summary.Cell index={1}>
                                <PriceText
                                    value={deliveryPayload.products.reduce(
                                        (
                                            sum: number,
                                            product: { price: number; quantity: number }
                                        ) => sum + product.price * product.quantity,
                                        0
                                    )}
                                />
                            </Table.Summary.Cell>
                        </Table.Summary.Row>
                    )}
                />
            </Collapse.Panel>
            <Collapse.Panel
                header={<Space>Invoice {deliveryIsLoading && <Spin size='small' />}</Space>}
                key='2'
            >
                {deliveryMeta?.invoice?.paperId || '-'}
            </Collapse.Panel>
            <Collapse.Panel
                header={<Space>Deliveries {deliveryIsLoading && <Spin size='small' />}</Space>}
                key='3'
            >
                <Table
                    size='small'
                    rowKey='postId'
                    bordered={true}
                    pagination={false}
                    loading={deliveryIsLoading}
                    dataSource={deliveryMeta?.deliveries || []}
                    columns={[
                        {
                            title: 'Created At',
                            dataIndex: 'createdAt',
                            render: (value) =>
                                dateFormatter(value).format(DATE_FORMAT['DD MMMM YYYY']),
                        },
                        {
                            title: 'Invoice Id',
                            dataIndex: 'invoicePaperId',
                        },
                    ]}
                    expandable={{
                        expandedRowRender: (data) => (
                            <Table
                                size='small'
                                rowKey='id'
                                bordered={true}
                                pagination={false}
                                loading={deliveryIsLoading}
                                dataSource={data.products}
                                columns={[
                                    {
                                        title: 'Code',
                                        dataIndex: 'code',
                                    },
                                    { title: 'Qty.', dataIndex: 'quantity' },
                                ]}
                            />
                        ),
                    }}
                />
            </Collapse.Panel>
        </Collapse>
    </Space>
);

export default OrderDetail;
