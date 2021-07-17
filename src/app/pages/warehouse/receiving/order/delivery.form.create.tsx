import React, { useCallback, useState } from 'react';

import { MinusCircleOutlined, PlusOutlined, UploadOutlined } from '@ant-design/icons';
import {
    Button,
    Col,
    DatePicker,
    Divider,
    Form,
    Input,
    InputNumber,
    Row,
    Select,
    Switch,
    Tabs,
    Upload,
} from 'antd';

import { AutocompleteSupplier } from 'src/app/container/form/autocomplete-supplier.component';
import dateFormatter from 'src/app/helper/format/date';

import { CATEGORY_AUTOCOMPLETE } from './delivery.form.create.constant';

const DeliveryCreateForm: React.FC<{
    form?: any;
    payload: any;
    meta: any;
    name: string;
    uploadComponent: any;
    isDisabled?: boolean;
    isUploadDisabled?: boolean;
    isLoading?: boolean;
    onFinish?: any;
}> = ({ form, payload, meta, uploadComponent, onFinish, name, isDisabled, isUploadDisabled }) => {
    const STRUCTURE = {
        createdAt: {
            dataIndex: 'createdAt',
            label: 'Delivery',
            placeholder: 'Date',
        },
        id: {
            dataIndex: 'id',
            label: '',
            placeholder: 'Date',
        },
        receivingPaperId: {
            dataIndex: 'receivingPaperId',
            label: 'Receiving Reference Id',
            placeholder: 'Internal Receiving #',
        },
        supplierDeliveryPaperId: {
            dataIndex: 'supplierDeliveryPaperId',
            label: 'Delivery Reference Id',
            placeholder: 'Supplier Delivery #',
        },
        supplierSalePaperId: {
            dataIndex: 'supplierSalePaperId',
            label: 'Sale Reference Id',
            placeholder: 'Supplier Sale #',
        },
        supplierSender: {
            dataIndex: 'supplierSender',
            label: 'Sender',
            placeholder: 'Supplier Sale #',
        },
        supplierPaperFile: {
            dataIndex: 'supplierPaperFile',
            label: 'File',
        },
    };

    const products = payload?.products || [];
    const availability = meta?.availability || {};
    const productsValue = (form.getFieldValue('products') || []) as any[];

    const [serialable, setSerialable] = useState<{ [x: string]: boolean }>(
        productsValue.reduce(
            (result, val, i) => ({ ...result, [i]: !!val && val.productSerialable }),
            {}
        )
    );

    const onSerialableChange = useCallback(
        (name: string, value: boolean) => {
            setSerialable({ ...serialable, [name]: value });
        },
        [serialable]
    );

    const normFile = (e?: { fileList: any }) => {
        if (Array.isArray(e)) {
            return e;
        }
        return e && e.fileList;
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
                        initialValue={dateFormatter()}
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
                <Col span={8} sm={{ span: 12 }} lg={{ span: 8 }}>
                    <Form.Item name={STRUCTURE.receivingPaperId.dataIndex}>
                        <Input
                            disabled={isDisabled}
                            placeholder={STRUCTURE.receivingPaperId.placeholder}
                        />
                    </Form.Item>
                </Col>
            </Row>
            <Row gutter={[4, 0]}>
                <Col span={12} sm={{ span: 16 }} lg={{ span: 12 }}>
                    <Form.Item label={STRUCTURE.supplierSender.label}>
                        <AutocompleteSupplier
                            form={form}
                            placeholder={STRUCTURE.supplierSender.placeholder}
                            allowClear={true}
                            disabled={isDisabled}
                        />
                    </Form.Item>
                </Col>
            </Row>
            <Row gutter={[4, 0]}>
                <Col span={8} sm={{ span: 12 }} lg={{ span: 8 }}>
                    <Form.Item name={STRUCTURE.supplierDeliveryPaperId.dataIndex}>
                        <Input
                            disabled={isDisabled}
                            placeholder={STRUCTURE.supplierDeliveryPaperId.placeholder}
                        />
                    </Form.Item>
                </Col>
                <Col span={8} sm={{ span: 12 }} lg={{ span: 8 }}>
                    <Form.Item name={STRUCTURE.supplierSalePaperId.dataIndex}>
                        <Input
                            disabled={isDisabled}
                            placeholder={STRUCTURE.supplierSalePaperId.placeholder}
                        />
                    </Form.Item>
                </Col>
            </Row>
            <Row gutter={[4, 0]}>
                <Col span={8} sm={{ span: 12 }} lg={{ span: 8 }}>
                    <Form.Item
                        name={STRUCTURE.supplierPaperFile.dataIndex}
                        valuePropName='fileList'
                        getValueFromEvent={normFile}
                    >
                        <Upload
                            {...uploadComponent}
                            disabled={isUploadDisabled || isDisabled}
                            accept='.pdf'
                        >
                            <Button icon={<UploadOutlined />}>Upload Sender Document</Button>
                        </Upload>
                    </Form.Item>
                </Col>
            </Row>

            <Tabs type='card' tabPosition='top' size='small'>
                {products.map((product: any, i: number) => {
                    return (
                        <Tabs.TabPane key={product._sid} tab={`Order #${i + 1}`}>
                            <ProductOrderField
                                name={['products', i]}
                                product={product}
                                index={i}
                                isDisabled={isDisabled || !availability[product._sid]}
                                isSerialable={serialable[['products', i].join('')]}
                                onSerialableChange={onSerialableChange}
                            />
                            <Divider plain={true} />
                            <ProductExtraField
                                name={['extraProducts', i]}
                                product={product}
                                serialable={serialable}
                                isDisabled={isDisabled || !availability[product._sid]}
                                onSerialableChange={onSerialableChange}
                            />
                        </Tabs.TabPane>
                    );
                })}
            </Tabs>
        </Form>
    );
};

const ProductOrderField: React.FC<{
    name: any[];
    product: any;
    index: number;
    isSerialable: boolean;
    isDisabled?: boolean;
    onSerialableChange?: (name: string, value: boolean) => void;
}> = ({ name, product, index, isSerialable, isDisabled, onSerialableChange }) => {
    isSerialable = isSerialable !== false;
    const STRUCTURE = {
        orderProductSid: {
            dataIndex: 'orderProductSid',
            placeholder: 'Product',
        },
        orderProductQuantity: {
            dataIndex: 'orderProductQuantity',
        },
        productSerialable: {
            dataIndex: 'productSerialable',
        },
        productQuantity: {
            dataIndex: 'productQuantity',
            placeholder: 'Qty',
        },
        productSns: {
            dataIndex: 'productSns',
            placeholder: 'Serial numbers',
        },
        productId: {
            dataIndex: 'productId',
            placeholder: 'Product ID',
        },
        productPn: {
            dataIndex: 'productPn',
            placeholder: 'PN',
        },
        productSku: {
            dataIndex: 'productSku',
            placeholder: 'SKU',
        },
    };
    return (
        <div>
            <div style={{ marginBottom: 8 }}>Product #{index + 1}</div>

            <Row gutter={[4, 0]}>
                <Col span={6} sm={{ span: 24 }} lg={{ span: 10 }}>
                    <Form.Item
                        name={[...name, STRUCTURE.orderProductSid.dataIndex]}
                        rules={[{ required: true, message: 'Required' }]}
                    >
                        <Select
                            suffixIcon={() => null}
                            disabled={true}
                            placeholder={STRUCTURE.orderProductSid.placeholder}
                            options={[{ label: product.name, value: product._sid }]}
                        />
                    </Form.Item>
                </Col>
                <Col span={6} sm={{ span: 24 }} lg={{ span: 4 }}>
                    <Form.Item name={[...name, STRUCTURE.productId.dataIndex]} rules={[]}>
                        <Input disabled={true} placeholder={STRUCTURE.productId.placeholder} />
                    </Form.Item>
                </Col>
                <Col span={6} sm={{ span: 12 }} lg={{ span: 3 }}>
                    <Form.Item name={[...name, STRUCTURE.orderProductQuantity.dataIndex]}>
                        <InputNumber disabled={true} />
                    </Form.Item>
                </Col>
                <Col>
                    <Form.Item
                        name={[...name, STRUCTURE.productSerialable.dataIndex]}
                        valuePropName='checked'
                    >
                        <Switch
                            defaultChecked={true}
                            unCheckedChildren='lot'
                            onChange={(checked) =>
                                onSerialableChange && onSerialableChange(name.join(''), checked)
                            }
                        />
                    </Form.Item>
                </Col>
            </Row>
            <Row gutter={[4, 0]}>
                <Col span={12} sm={{ span: 24 }} lg={{ span: 12 }}>
                    <Form.Item
                        hidden={!isSerialable}
                        name={[...name, STRUCTURE.productSns.dataIndex]}
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
                <Col span={12} sm={{ span: 24 }} lg={{ span: 12 }}>
                    <Form.Item hidden={isSerialable} name={[...name, 'none']} initialValue='Lot'>
                        <Input hidden={isSerialable} disabled={true} />
                    </Form.Item>
                </Col>
            </Row>
            <Row gutter={[4, 0]}>
                <Col span={12} sm={{ span: 3 }} lg={{ span: 3 }}>
                    <Form.Item
                        hidden={isSerialable}
                        name={[...name, STRUCTURE.productQuantity.dataIndex]}
                        shouldUpdate={() => true}
                    >
                        <InputNumber
                            style={{ width: '100%' }}
                            hidden={!isSerialable}
                            disabled={isDisabled}
                            placeholder={STRUCTURE.productQuantity.placeholder}
                        />
                    </Form.Item>
                </Col>
                <Col span={12} sm={{ span: 9 }} lg={{ span: 9 }}>
                    <Form.Item hidden={isSerialable} name={[...name, 'productLot']}>
                        <Input
                            hidden={isSerialable}
                            disabled={isDisabled}
                            placeholder='Custom Lot'
                        />
                    </Form.Item>
                </Col>
            </Row>
            <Row gutter={[4, 0]}>
                <Col span={6} sm={{ span: 24 }} lg={{ span: 6 }}>
                    <Form.Item name={[...name, STRUCTURE.productSku.dataIndex]} rules={[]}>
                        <Input
                            disabled={isDisabled}
                            placeholder={STRUCTURE.productSku.placeholder}
                        />
                    </Form.Item>
                </Col>
                <Col span={6} sm={{ span: 24 }} lg={{ span: 5 }}>
                    <Form.Item name={[...name, STRUCTURE.productPn.dataIndex]} rules={[]}>
                        <Input
                            disabled={isDisabled}
                            placeholder={STRUCTURE.productPn.placeholder}
                        />
                    </Form.Item>
                </Col>
            </Row>
        </div>
    );
};

const ProductExtraField: React.FC<{
    name: Array<string | number>;
    product: any;
    serialable: { [x: string]: boolean };
    isDisabled?: boolean;
    onSerialableChange?: (name: string, value: boolean) => void;
}> = ({ name, product, serialable, isDisabled, onSerialableChange }) => {
    const STRUCTURE = {
        orderProductSid: {
            dataIndex: 'orderProductSid',
            placeholder: 'Product',
        },
        orderProductQuantity: {
            dataIndex: 'orderProductQuantity',
        },
        productName: {
            dataIndex: 'productName',
            placeholder: 'Product',
        },
        productSerialable: {
            dataIndex: 'productSerialable',
        },
        productQuantity: {
            dataIndex: 'productQuantity',
            placeholder: 'Qty',
        },
        productSns: {
            dataIndex: 'productSns',
            placeholder: 'Serial numbers',
        },
        productId: {
            dataIndex: 'productId',
            placeholder: 'SKU',
        },
        productPn: {
            dataIndex: 'productPn',
            placeholder: 'PN',
        },
        productBrand: {
            dataIndex: 'productBrand',
            placeholder: 'Brand',
        },
        productCategories: {
            dataIndex: 'productCategories',
            placeholder: 'Categories',
        },
    };
    return (
        <Form.List name={[...name]}>
            {(fields, { add, remove }) => {
                return (
                    <div>
                        {fields.map((field, i) => {
                            const isSerialable = serialable[field.name] !== false;
                            return (
                                <div key={field.key} style={{ position: 'relative' }}>
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
                                    <div style={{ marginBottom: 10 }}>Complement #{i + 1}</div>
                                    <Row gutter={[4, 0]}>
                                        <Col span={6} sm={{ span: 24 }} lg={{ span: 10 }}>
                                            <Form.Item
                                                name={[field.name, STRUCTURE.productName.dataIndex]}
                                            >
                                                <Input
                                                    placeholder={STRUCTURE.productName.placeholder}
                                                />
                                            </Form.Item>
                                        </Col>
                                        <Col span={6} sm={{ span: 12 }} lg={{ span: 3 }}>
                                            <Form.Item
                                                name={[
                                                    ...name,
                                                    STRUCTURE.orderProductQuantity.dataIndex,
                                                ]}
                                            >
                                                <InputNumber disabled={true} />
                                            </Form.Item>
                                        </Col>
                                        <Col>
                                            <Form.Item
                                                name={[
                                                    field.name,
                                                    STRUCTURE.productSerialable.dataIndex,
                                                ]}
                                                valuePropName='checked'
                                            >
                                                <Switch
                                                    defaultChecked={true}
                                                    unCheckedChildren='lot'
                                                    onChange={(checked) =>
                                                        onSerialableChange &&
                                                        onSerialableChange('' + field.name, checked)
                                                    }
                                                />
                                            </Form.Item>
                                        </Col>
                                        <Col span={8} sm={{ span: 12 }} lg={{ span: 1 }}>
                                            <Form.Item
                                                initialValue={product._sid}
                                                name={[
                                                    field.name,
                                                    STRUCTURE.orderProductSid.dataIndex,
                                                ]}
                                            >
                                                <Input
                                                    hidden={true}
                                                    placeholder={
                                                        STRUCTURE.orderProductSid.placeholder
                                                    }
                                                />
                                            </Form.Item>
                                        </Col>
                                    </Row>
                                    <Row gutter={[4, 0]}>
                                        <Col span={12} sm={{ span: 24 }} lg={{ span: 12 }}>
                                            <Form.Item
                                                hidden={!isSerialable}
                                                name={[field.name, STRUCTURE.productSns.dataIndex]}
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
                                        <Col span={12} sm={{ span: 24 }} lg={{ span: 12 }}>
                                            <Form.Item
                                                hidden={isSerialable}
                                                name={[field.name, 'none']}
                                                initialValue='Lot'
                                            >
                                                <Input hidden={isSerialable} disabled={true} />
                                            </Form.Item>
                                        </Col>
                                    </Row>
                                    <Row gutter={[4, 0]}>
                                        <Col span={12} sm={{ span: 3 }} lg={{ span: 3 }}>
                                            <Form.Item
                                                hidden={isSerialable}
                                                name={[
                                                    field.name,
                                                    STRUCTURE.productQuantity.dataIndex,
                                                ]}
                                                shouldUpdate={() => true}
                                            >
                                                <InputNumber
                                                    style={{ width: '100%' }}
                                                    hidden={!isSerialable}
                                                    disabled={isDisabled}
                                                    placeholder={
                                                        STRUCTURE.productQuantity.placeholder
                                                    }
                                                />
                                            </Form.Item>
                                        </Col>
                                        <Col span={12} sm={{ span: 9 }} lg={{ span: 9 }}>
                                            <Form.Item
                                                hidden={isSerialable}
                                                name={[field.name, 'productLot']}
                                            >
                                                <Input
                                                    hidden={isSerialable}
                                                    disabled={isDisabled}
                                                    placeholder='Custom Lot'
                                                />
                                            </Form.Item>
                                        </Col>
                                    </Row>
                                    <Row gutter={[4, 0]}>
                                        <Col span={6} sm={{ span: 24 }} lg={{ span: 6 }}>
                                            <Form.Item
                                                name={[field.name, STRUCTURE.productId.dataIndex]}
                                                rules={[{ required: true, message: 'Required' }]}
                                            >
                                                <Input
                                                    disabled={isDisabled}
                                                    placeholder={STRUCTURE.productId.placeholder}
                                                />
                                            </Form.Item>
                                        </Col>
                                        <Col span={6} sm={{ span: 24 }} lg={{ span: 5 }}>
                                            <Form.Item
                                                name={[field.name, STRUCTURE.productPn.dataIndex]}
                                                rules={[]}
                                            >
                                                <Input
                                                    disabled={isDisabled}
                                                    placeholder={STRUCTURE.productPn.placeholder}
                                                />
                                            </Form.Item>
                                        </Col>
                                    </Row>
                                    <Row gutter={[4, 0]}>
                                        <Col span={6} sm={{ span: 24 }} lg={{ span: 3 }}>
                                            <Form.Item
                                                name={[
                                                    field.name,
                                                    STRUCTURE.productBrand.dataIndex,
                                                ]}
                                                rules={[{ required: true, message: 'Required' }]}
                                            >
                                                <Input
                                                    disabled={isDisabled}
                                                    placeholder={STRUCTURE.productBrand.placeholder}
                                                />
                                            </Form.Item>
                                        </Col>
                                        <Col span={8} sm={{ span: 12 }} lg={{ span: 6 }}>
                                            <Form.Item
                                                name={[
                                                    field.name,
                                                    STRUCTURE.productCategories.dataIndex,
                                                ]}
                                            >
                                                <Select
                                                    mode='tags'
                                                    options={CATEGORY_AUTOCOMPLETE}
                                                    disabled={isDisabled}
                                                    placeholder={
                                                        STRUCTURE.productCategories.placeholder
                                                    }
                                                />
                                            </Form.Item>
                                        </Col>
                                    </Row>
                                </div>
                            );
                        })}
                        <Form.Item>
                            <Button type='dashed' onClick={() => add()} block disabled={isDisabled}>
                                <PlusOutlined /> Add complement product
                            </Button>
                        </Form.Item>
                    </div>
                );
            }}
        </Form.List>
    );
};

export default DeliveryCreateForm;
