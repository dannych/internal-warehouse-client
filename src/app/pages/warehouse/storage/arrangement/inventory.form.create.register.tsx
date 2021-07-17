import React, { useState } from 'react';

import {
    AutoComplete,
    Button,
    Col,
    Divider,
    Form,
    Input,
    InputNumber,
    Row,
    Select,
    Switch,
} from 'antd';

import { BRAND_LIST, CATEGORY_AUTOCOMPLETE } from './inventory.form.constant';

const InventoryCreateFormRegister: React.FC<{
    form: any;
    isDisabled?: boolean;
    onSubmit?: (value: any) => void;
    onSearch?: (value: string) => void;
}> = ({ form, isDisabled, onSearch, onSubmit }) => {
    const STRUCTURE = {
        productName: {
            dataIndex: 'productName',
            placeholder: 'Name',
        },
        productBrand: {
            dataIndex: 'productBrand',
            placeholder: 'Brand',
        },
        productPn: {
            dataIndex: 'productPn',
            placeholder: 'PN',
        },
        productSku: {
            dataIndex: 'productSku',
            placeholder: 'SKU',
        },
        productCategories: {
            dataIndex: 'productCategories',
            placeholder: 'Categories',
        },
        quantity: {
            label: 'Quantity',
            dataIndex: 'quantity',
            placeholder: 'Qty',
        },
        productSns: {
            label: 'SNs',
            dataIndex: 'productSns',
            placeholder: 'Serial Numbers',
        },
        serialable: {
            dataIndex: 'serialable',
        },
    };

    const [isSerialable, setIsSerialable] = useState(true);
    return (
        <div>
            <Form size='small'>
                <Input.Search placeholder='Prefill' onSearch={onSearch} />
            </Form>
            <Divider />
            <Form form={form} size='small' onFinish={onSubmit}>
                <Row gutter={[8, 0]}>
                    <Col span={8} sm={{ span: 12 }} lg={{ span: 8 }}>
                        <Form.Item
                            name={STRUCTURE.productSku.dataIndex}
                            rules={[{ required: true, message: 'Required' }]}
                        >
                            <Input
                                disabled={isDisabled}
                                placeholder={STRUCTURE.productSku.placeholder}
                            />
                        </Form.Item>
                    </Col>
                    {/* <Col span={3} lg={{ span: 3 }}>
                        <Form.Item
                            name={STRUCTURE.quantity.dataIndex}
                            rules={[{ required: true, message: 'Required' }]}
                        >
                            <InputNumber
                                disabled={isDisabled}
                                placeholder={STRUCTURE.quantity.placeholder}
                                min={1}
                                style={{ width: '100%' }}
                            />
                        </Form.Item>
                    </Col> */}
                    <Col>
                        <Form.Item name={STRUCTURE.serialable.dataIndex} valuePropName='checked'>
                            <Switch
                                defaultChecked={true}
                                unCheckedChildren='lot'
                                onChange={(checked) => setIsSerialable && setIsSerialable(checked)}
                            />
                        </Form.Item>
                    </Col>
                </Row>
                <Row gutter={[8, 0]}>
                    <Col span={8} sm={{ span: 16 }} lg={{ span: 10 }}>
                        <Form.Item
                            name={STRUCTURE.productName.dataIndex}
                            rules={[{ required: true, message: 'Required' }]}
                        >
                            <Input
                                disabled={isDisabled}
                                placeholder={STRUCTURE.productName.placeholder}
                            />
                        </Form.Item>
                    </Col>
                    <Col span={4} sm={{ span: 6 }} lg={{ span: 4 }}>
                        <Form.Item name={STRUCTURE.productPn.dataIndex}>
                            <Input
                                disabled={isDisabled}
                                placeholder={STRUCTURE.productPn.placeholder}
                            />
                        </Form.Item>
                    </Col>
                </Row>
                <Row gutter={[8, 0]}>
                    <Col span={4} sm={{ span: 6 }} lg={{ span: 4 }}>
                        <Form.Item name={STRUCTURE.productBrand.dataIndex}>
                            <AutoComplete
                                disabled={isDisabled}
                                allowClear={true}
                                filterOption={(inputValue, option) =>
                                    option?.value
                                        .toUpperCase()
                                        .indexOf(inputValue.toUpperCase()) !== -1
                                }
                                dataSource={BRAND_LIST.map((text) => ({
                                    text,
                                    value: text,
                                }))}
                            >
                                <Input
                                    disabled={isDisabled}
                                    placeholder={STRUCTURE.productBrand.placeholder}
                                />
                            </AutoComplete>
                        </Form.Item>
                    </Col>
                    <Col span={10} sm={{ span: 12 }} lg={{ span: 10 }}>
                        <Form.Item name={STRUCTURE.productCategories.dataIndex}>
                            <Select
                                mode='tags'
                                options={CATEGORY_AUTOCOMPLETE}
                                disabled={isDisabled}
                                placeholder={STRUCTURE.productCategories.placeholder}
                            />
                        </Form.Item>
                    </Col>
                </Row>
                {/* <Row gutter={[8, 0]}>
                    <Col span={8} sm={{ span: 16 }} lg={{ span: 10 }}>
                        <Form.Item
                            name={STRUCTURE.productSns.dataIndex}
                            rules={[{ required: true, message: 'Required' }]}
                        >
                            <Input.TextArea
                                rows={5}
                                disabled={isDisabled}
                                placeholder={STRUCTURE.productSns.placeholder}
                            />
                        </Form.Item>
                    </Col>
                </Row> */}
                <Row gutter={[4, 0]}>
                    <Col span={12} sm={{ span: 24 }} lg={{ span: 12 }}>
                        <Form.Item
                            hidden={!isSerialable}
                            name={STRUCTURE.productSns.dataIndex}
                            shouldUpdate={() => true}
                        >
                            <Input.TextArea
                                hidden={!isSerialable}
                                rows={4}
                                disabled={isDisabled}
                                placeholder={STRUCTURE.productSns.placeholder}
                            />
                        </Form.Item>
                    </Col>
                </Row>
                <Row gutter={[4, 0]}>
                    <Col span={12} sm={{ span: 3 }} lg={{ span: 3 }}>
                        <Form.Item
                            hidden={isSerialable}
                            name={STRUCTURE.quantity.dataIndex}
                            shouldUpdate={() => true}
                        >
                            <InputNumber
                                style={{ width: '100%' }}
                                hidden={!isSerialable}
                                disabled={isDisabled}
                                placeholder={STRUCTURE.quantity.placeholder}
                            />
                        </Form.Item>
                    </Col>
                    <Col span={12} sm={{ span: 9 }} lg={{ span: 9 }}>
                        <Form.Item hidden={isSerialable} name={['productLot']}>
                            <Input
                                hidden={isSerialable}
                                disabled={isDisabled}
                                placeholder='Custom Lot'
                            />
                        </Form.Item>
                    </Col>
                </Row>
                <Row gutter={[8, 0]}>
                    <Col span={10} sm={{ span: 12 }} lg={{ span: 10 }}>
                        <Form.Item>
                            <Button htmlType='submit'>Submit</Button>
                        </Form.Item>
                    </Col>
                </Row>
            </Form>
        </div>
    );
};

export default InventoryCreateFormRegister;
