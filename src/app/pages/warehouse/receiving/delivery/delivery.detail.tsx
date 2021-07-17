import * as React from 'react';

import { Collapse, Descriptions, Space, Spin, Table, Tag } from 'antd';

import dateFormatter, { DATE_FORMAT } from 'src/app/helper/format/date';

const OrderDetail: React.FC<{
    deliveryIsLoading: boolean;
    deliveryMeta: any;
    deliveryPayload: any;
}> = ({ deliveryMeta, deliveryPayload, deliveryIsLoading }) => (
    <Space direction='vertical' size='small' style={{ width: '100%' }}>
        <Descriptions size='small' bordered={true}>
            <Descriptions.Item label='Delivery ID'>{deliveryPayload.postId}</Descriptions.Item>
            <Descriptions.Item label='Created At' span={2}>
                {dateFormatter(deliveryPayload.createdAt).format(DATE_FORMAT['YYYY-MM-DD'])}
            </Descriptions.Item>
            <Descriptions.Item label='Receiver' span={3}>
                {deliveryPayload.representativeName}
            </Descriptions.Item>
        </Descriptions>
        <Descriptions size='small' bordered={true} layout='vertical'>
            <Descriptions.Item label='Supplier' span={3}>
                {deliveryPayload.supplierName}
            </Descriptions.Item>
            <Descriptions.Item label='Ref Id' span={3}>
                {deliveryPayload.supplierShippingPaperId || '-'}
            </Descriptions.Item>
            <Descriptions.Item label='Doc' span={3}>
                {deliveryMeta?.supplierShippingPaperFilePreviewUrl ? (
                    <a
                        target='_blank'
                        rel='noopener noreferrer'
                        href={deliveryMeta.supplierShippingPaperFilePreviewUrl}
                    >
                        Document
                    </a>
                ) : (
                    '-'
                )}
            </Descriptions.Item>
        </Descriptions>
        <Collapse bordered={false} defaultActiveKey={1}>
            <Collapse.Panel header={<Space>Products</Space>} key='1'>
                <Table
                    size='small'
                    bordered={true}
                    pagination={false}
                    scroll={{ x: '75vw' }}
                    dataSource={deliveryPayload.products}
                    columns={[
                        {
                            title: 'Name',
                            dataIndex: 'name',
                            ellipsis: true,
                        },
                        { title: 'Qty.', dataIndex: 'quantity', width: '60px', align: 'right' },
                        {
                            title: 'PN',
                            dataIndex: 'pn',
                        },
                        {
                            title: 'PIN',
                            dataIndex: 'pin',
                        },
                        {
                            title: 'LOT',
                            dataIndex: 'lot',
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
                header={<Space>Receipts {deliveryIsLoading && <Spin size='small' />}</Space>}
                key='2'
            >
                <Table
                    size='small'
                    rowKey='postId'
                    bordered={true}
                    pagination={false}
                    loading={deliveryIsLoading}
                    dataSource={deliveryMeta?.receipts || []}
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
