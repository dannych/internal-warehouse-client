import React from 'react';

import { FileSearchOutlined, MinusCircleOutlined, PlusOutlined } from '@ant-design/icons';
import { Button, Col, DatePicker, Divider, Form, Input, Row, Space } from 'antd';

import { AutocompleteReceiver } from 'src/app/container/form/autocomplete-receiver.component';
import { AutocompleteSupplier } from 'src/app/container/form/autocomplete-supplier.component';

import dateFormatter from 'src/app/helper/format/date';

const DeliveryForm: React.FC<{
    form?: any;
    onFinish?: any;
    name: string;
    isDisabled?: boolean;
    isLoading?: boolean;
    onBrowseProduct?: () => void;
}> = ({ form, onFinish, name, isDisabled, onBrowseProduct }) => {
    const STRUCTURE = {
        createdAt: {
            dataIndex: 'createdAt',
            label: 'Order Date',
            placeholder: 'Date',
        },
        salePaperId: {
            dataIndex: 'paperId',
            label: 'Internal id',
            placeholder: 'Internal identifier',
        },
        representative: {
            dataIndex: 'representative',
            label: 'Receiver',
            placeholder: 'Input receiver',
        },
        supplier: {
            dataIndex: 'supplier',
            label: 'Supplier',
            placeholder: 'Input supplier',
        },
        supplierPaperId: {
            dataIndex: 'supplierPaperId',
            label: 'Reference',
            placeholder: 'ie. purchase order number',
        },
        description: {
            dataIndex: 'description',
            label: 'Notes',
            placeholder: 'Additonal information',
        },
        products: {
            dataIndex: 'products',
            label: 'Products',
            product: {
                sn: {
                    dataIndex: 'sn',
                    placeholder: 'Serial Number',
                },
                pn: {
                    dataIndex: 'pn',
                    placeholder: 'P/N',
                },
            },
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
            <Row gutter={[8, 0]}>
                <Col span={6} sm={{ span: 10 }} lg={{ span: 6 }}>
                    <Form.Item
                        label={STRUCTURE.createdAt.label}
                        name={STRUCTURE.createdAt.dataIndex}
                        initialValue={dateFormatter()}
                        rules={[{ required: true, message: 'Missing date' }]}
                    >
                        <DatePicker style={{ width: '100%' }} disabled={isDisabled} />
                    </Form.Item>
                </Col>
            </Row>
            <Row gutter={[8, 0]}>
                <Col span={8} sm={{ span: 12 }} lg={{ span: 8 }}>
                    <Form.Item
                        label={STRUCTURE.salePaperId.label}
                        name={STRUCTURE.salePaperId.dataIndex}
                        rules={[{ required: true, message: 'Missing id' }]}
                    >
                        <Input
                            disabled={isDisabled}
                            placeholder={STRUCTURE.salePaperId.placeholder}
                        />
                    </Form.Item>
                </Col>
            </Row>
            <Row gutter={[8, 0]}>
                <Col span={8} sm={{ span: 12 }} lg={{ span: 8 }}>
                    <Form.Item label={STRUCTURE.supplier.label}>
                        <AutocompleteSupplier
                            form={form}
                            placeholder={STRUCTURE.supplier.placeholder}
                            allowClear={true}
                            disabled={isDisabled}
                        />
                    </Form.Item>
                </Col>
                <Col span={6} sm={{ span: 8 }} lg={{ span: 6 }}>
                    <Form.Item
                        label={STRUCTURE.supplierPaperId.label}
                        name={STRUCTURE.supplierPaperId.dataIndex}
                    >
                        <Input
                            style={{ marginTop: -8 }}
                            disabled={isDisabled}
                            placeholder={STRUCTURE.supplierPaperId.placeholder}
                        />
                    </Form.Item>
                </Col>
            </Row>
            <Row gutter={[8, 0]}>
                <Col span={8} sm={{ span: 12 }} lg={{ span: 8 }}>
                    <Form.Item label={STRUCTURE.representative.label}>
                        <AutocompleteReceiver
                            form={form}
                            namePrefix='representative'
                            apiPath='/representatives/search'
                            placeholder={STRUCTURE.representative.placeholder}
                            allowClear={true}
                            disabled={isDisabled}
                        />
                    </Form.Item>
                </Col>
            </Row>
            <Row gutter={[8, 0]}>
                <Col span={12} sm={{ span: 16 }} lg={{ span: 12 }}>
                    <Form.Item
                        label={STRUCTURE.description.label}
                        name={STRUCTURE.description.dataIndex}
                    >
                        <Input.TextArea
                            rows={3}
                            placeholder={STRUCTURE.description.placeholder}
                            allowClear={true}
                            disabled={isDisabled}
                        />
                    </Form.Item>
                </Col>
            </Row>

            <Divider orientation='right' plain={true} style={{ margin: 0 }}>
                Products
            </Divider>

            <Form.List name={STRUCTURE.products.dataIndex}>
                {(fields, { add, remove }) => {
                    return (
                        <div>
                            {fields.map((field, i) => (
                                <div key={field.key} style={{ position: 'relative' }}>
                                    {fields.length > 1 && (
                                        <MinusCircleOutlined
                                            style={{
                                                position: 'absolute',
                                                right: 0,
                                                top: 8,
                                                zIndex: 1,
                                            }}
                                            onClick={() => {
                                                remove(field.name);
                                            }}
                                        />
                                    )}
                                    <Row gutter={[8, 0]}>
                                        <Col span={4} sm={{ span: 6 }} lg={{ span: 4 }}>
                                            <Form.Item
                                                name={[
                                                    field.name,
                                                    STRUCTURE.products.product.pn.dataIndex,
                                                ]}
                                            >
                                                <Input
                                                    disabled={isDisabled}
                                                    placeholder={
                                                        STRUCTURE.products.product.pn.placeholder
                                                    }
                                                />
                                            </Form.Item>
                                        </Col>
                                        <Col span={4} sm={{ span: 6 }} lg={{ span: 4 }}>
                                            <Form.Item
                                                name={[
                                                    field.name,
                                                    STRUCTURE.products.product.sn.dataIndex,
                                                ]}
                                            >
                                                <Input
                                                    disabled={isDisabled}
                                                    placeholder={
                                                        STRUCTURE.products.product.sn.placeholder
                                                    }
                                                />
                                            </Form.Item>
                                        </Col>
                                    </Row>
                                </div>
                            ))}

                            <Form.Item>
                                <Space direction='vertical' size='small' style={{ width: '100%' }}>
                                    <Button
                                        type='dashed'
                                        onClick={() => {
                                            add();
                                        }}
                                        block
                                        disabled={isDisabled}
                                    >
                                        <PlusOutlined /> Add product
                                    </Button>
                                    <Button
                                        ghost
                                        type='primary'
                                        block
                                        disabled={isDisabled}
                                        onClick={onBrowseProduct}
                                    >
                                        <FileSearchOutlined /> Browse products
                                    </Button>
                                </Space>
                            </Form.Item>
                        </div>
                    );
                }}
            </Form.List>
        </Form>
    );
};

export default DeliveryForm;
