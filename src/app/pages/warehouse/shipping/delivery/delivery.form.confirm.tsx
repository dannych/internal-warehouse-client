import React from 'react';

import { Col, DatePicker, Divider, Form, Input, Row, Table } from 'antd';

const DeliveryConfirmForm: React.FC<{
    form?: any;
    name: string;
    payload: any;
    isDisabled?: boolean;
    isLoading?: boolean;
    onFinish?: any;
}> = ({ form, name, payload, isDisabled, onFinish }) => {
    const STRUCTURE = {
        createdAt: {
            dataIndex: 'createdAt',
            label: 'Delivery',
            placeholder: 'Date',
        },
        id: {
            dataIndex: '_id',
            label: '',
            placeholder: 'Date',
        },
        shippingPaperId: {
            dataIndex: 'shippingPaperId',
            label: 'Shipping Reference Id',
            placeholder: 'Shipping#',
        },
    };

    return (
        <Form
            size='small'
            form={form}
            layout='vertical'
            onFinish={onFinish}
            name={name}
            hideRequiredMark={true}
        >
            <Row gutter={[4, 0]}>
                <Col span={6} sm={{ span: 10 }} lg={{ span: 6 }}>
                    <Form.Item
                        name={STRUCTURE.createdAt.dataIndex}
                        rules={[{ required: true, message: 'Missing date' }]}
                    >
                        <DatePicker style={{ width: '100%' }} disabled={isDisabled} />
                    </Form.Item>
                </Col>
                <Col span={8} sm={{ span: 12 }} lg={{ span: 8 }}>
                    <Form.Item hidden={true} name={STRUCTURE.id.dataIndex}>
                        <Input
                            hidden={true}
                            disabled={isDisabled}
                            placeholder={STRUCTURE.id.placeholder}
                        />
                    </Form.Item>
                </Col>
            </Row>
            <Row gutter={[4, 0]}>
                <Col span={8} sm={{ span: 12 }} lg={{ span: 3 }}>
                    <Form.Item name='referencePostId'>
                        <Input disabled={true} />
                    </Form.Item>
                </Col>
                <Col span={8} sm={{ span: 12 }} lg={{ span: 3 }}>
                    <Form.Item name='referencePaperId'>
                        <Input disabled={true} />
                    </Form.Item>
                </Col>
            </Row>
            <Row gutter={[4, 0]}>
                <Col span={8} sm={{ span: 12 }} lg={{ span: 8 }}>
                    <Form.Item name={STRUCTURE.shippingPaperId.dataIndex}>
                        <Input
                            disabled={isDisabled}
                            placeholder={STRUCTURE.shippingPaperId.placeholder}
                        />
                    </Form.Item>
                </Col>
            </Row>

            <Divider />

            <Table
                dataSource={payload?.products || []}
                pagination={false}
                size='small'
                columns={[
                    {
                        title: 'Product',
                        dataIndex: 'name',
                        ellipsis: true,
                    },
                    {
                        title: 'Type',
                        dataIndex: 'type',
                    },
                    {
                        title: 'PIN',
                        dataIndex: 'pin',
                    },
                    {
                        title: 'Qty',
                        dataIndex: 'quantity',
                    },
                ]}
            />
        </Form>
    );
};

export default DeliveryConfirmForm;
