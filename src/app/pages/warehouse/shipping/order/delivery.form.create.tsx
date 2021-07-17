import React from 'react';

import { Col, DatePicker, Descriptions, Divider, Form, Input, InputNumber, Row, Spin } from 'antd';

const DispatchForm: React.FC<{
    form?: any;
    name: string;
    order: any;
    extra: any;
    isDisabled?: boolean;
    isLoading?: boolean;
    isLoadingExtra?: boolean;
    onFinish?: any;
}> = ({ form, order, extra, onFinish, name, isDisabled, isLoadingExtra }) => {
    const totalDispatchQuantityMapper = (extra?.shippings || [])
        .filter((x: any) => !!x)
        .reduce((index: any, dispatch: any) => {
            const result = dispatch.products.reduce(
                (indexProduct: any, product: any) => ({
                    ...indexProduct,
                    [product._sid]: (indexProduct[product._sid] || 0) + product.quantity,
                }),
                index
            );
            return {
                ...index,
                ...result,
            };
        }, {});

    const STRUCTURE = {
        id: {
            dataIndex: 'id',
            label: 'Delivery Id',
            placeholder: 'i.e 2020-0001',
        },
        paperId: {
            dataIndex: 'paperId',
            label: 'Paper ID',
            placeholder: 'Internal reference',
        },
        createdAt: {
            dataIndex: 'createdAt',
            label: 'Delivery Date',
            placeholder: 'Date',
        },
        products: {
            dataIndex: 'products',
            label: 'Products',
            product: {
                productSid: {
                    label: 'Product',
                    dataIndex: 'productSid',
                    placeholder: 'Input item name',
                },
                quantity: {
                    label: 'Delivery Qty',
                    dataIndex: 'quantity',
                    placeholder: 'Qty',
                },
            },
        },
    };

    return (
        <Form
            form={form}
            size='small'
            layout='vertical'
            onFinish={onFinish}
            name={name}
            hideRequiredMark={true}
        >
            <Row gutter={[8, 0]}>
                <Col span={6} sm={{ span: 10 }} lg={{ span: 6 }}>
                    <Form.Item
                        name={STRUCTURE.createdAt.dataIndex}
                        rules={[{ required: true, message: 'Missing date' }]}
                    >
                        <DatePicker style={{ width: '100%' }} disabled={isDisabled} />
                    </Form.Item>
                </Col>
                <Col>
                    <Form.Item
                        hidden={true}
                        name={STRUCTURE.id.dataIndex}
                        initialValue={order.id}
                        rules={[{ required: true, message: 'Missing id' }]}
                    >
                        <Input
                            disabled={true}
                            placeholder={STRUCTURE.id.placeholder}
                            hidden={true}
                        />
                    </Form.Item>
                </Col>
            </Row>
            <Row gutter={[8, 0]}>
                <Col span={8} sm={{ span: 12 }} lg={{ span: 8 }}>
                    <Form.Item name={STRUCTURE.paperId.dataIndex} noStyle={true}>
                        <Input disabled={isDisabled} placeholder={STRUCTURE.paperId.placeholder} />
                    </Form.Item>
                </Col>
            </Row>

            <Divider />

            <Form.List name={STRUCTURE.products.dataIndex}>
                {(fields) => (
                    <div>
                        {fields.map((product: any, i: number) => {
                            const productDetail = order.products[i];
                            const remainingQuantity =
                                productDetail.quantity -
                                (totalDispatchQuantityMapper[productDetail._sid] || 0);
                            return (
                                <div key={product.productCode} style={{ position: 'relative' }}>
                                    <Row gutter={[8, 0]}>
                                        <Col span={8} sm={{ span: 12 }} lg={{ span: 8 }}>
                                            <Form.Item
                                                label={STRUCTURE.products.product.productSid.label}
                                                name={[
                                                    i,
                                                    STRUCTURE.products.product.productSid.dataIndex,
                                                ]}
                                                fieldKey={[
                                                    i,
                                                    STRUCTURE.products.product.productSid.dataIndex,
                                                ]}
                                                rules={[{ required: true, message: 'Required' }]}
                                            >
                                                <Input
                                                    disabled={true}
                                                    placeholder={
                                                        STRUCTURE.products.product.quantity
                                                            .placeholder
                                                    }
                                                    style={{ width: '100%' }}
                                                />
                                            </Form.Item>
                                        </Col>
                                        <Col span={3} lg={{ span: 3 }}>
                                            <Form.Item
                                                label={STRUCTURE.products.product.quantity.label}
                                                name={[
                                                    i,
                                                    STRUCTURE.products.product.quantity.dataIndex,
                                                ]}
                                                fieldKey={[
                                                    i,
                                                    STRUCTURE.products.product.quantity.dataIndex,
                                                ]}
                                                rules={[
                                                    {
                                                        required: true,
                                                        message: 'Required',
                                                    },
                                                ]}
                                                initialValue={0}
                                            >
                                                <InputNumber
                                                    disabled={isDisabled}
                                                    placeholder={
                                                        STRUCTURE.products.product.quantity
                                                            .placeholder
                                                    }
                                                    style={{ width: '100%' }}
                                                    min={0}
                                                    max={remainingQuantity}
                                                />
                                            </Form.Item>
                                        </Col>
                                        <Col span={10}>
                                            <Descriptions
                                                layout='vertical'
                                                size='small'
                                                colon={false}
                                            >
                                                <Descriptions.Item label='Remaining'>
                                                    {isLoadingExtra ? (
                                                        <Spin size='small' />
                                                    ) : (
                                                        remainingQuantity
                                                    )}
                                                </Descriptions.Item>
                                                <Descriptions.Item label='Total order'>
                                                    {productDetail.quantity}
                                                </Descriptions.Item>
                                            </Descriptions>
                                        </Col>
                                    </Row>
                                </div>
                            );
                        })}
                    </div>
                )}
            </Form.List>
        </Form>
    );
};

export default DispatchForm;
