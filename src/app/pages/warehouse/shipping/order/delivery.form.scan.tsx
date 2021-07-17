import React, { useCallback } from 'react';

import { MinusCircleOutlined, PlusOutlined } from '@ant-design/icons';
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
} from 'antd';

const ConfigureCreateForm: React.FC<{
    form?: any;
    name: string;
    serialable: any;
    payload: any;
    meta: any;
    isDisabled?: boolean;
    isLoading?: boolean;
    onFinish?: any;
    onSerialableChange?: any;
}> = ({ payload, meta, form, name, serialable, isDisabled, onFinish, onSerialableChange }) => {
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
        shippingPaperId: {
            dataIndex: 'shippingPaperId',
            label: 'Shipping Reference Id',
            placeholder: 'Shipping#',
        },
    };

    const products = payload?.products || [];

    const onSerialableChanges = useCallback(
        (name: string, value: boolean) => {
            console.log(name);
            onSerialableChange && onSerialableChange({ ...serialable, [name]: value });
        },
        [serialable, onSerialableChange]
    );

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

            <Tabs type='card' tabPosition='top' size='small'>
                {products.map((product: any, i: number) => {
                    return (
                        <Tabs.TabPane key={i} tab={`Order #${i + 1}`}>
                            <ProductFulfillmentField
                                index={i}
                                product={product}
                                name={['products', i]}
                                isSerialable={serialable[['products', i].join('')]}
                                isDisabled={isDisabled}
                                onSerialableChange={onSerialableChanges}
                            />
                            <Divider plain={true} />
                            <ProductExtraField
                                name={['extraProducts', i]}
                                product={product}
                                label='Add complement product'
                                serialable={serialable}
                                isDisabled={isDisabled}
                                onSerialableChange={onSerialableChanges}
                            />
                            <Divider plain={true} />
                            <ProductOtherField
                                name={['otherProducts', i]}
                                product={product}
                                label='Add other product'
                                serialable={serialable}
                                isDisabled={isDisabled}
                                onSerialableChange={onSerialableChanges}
                            />
                        </Tabs.TabPane>
                    );
                })}
            </Tabs>
        </Form>
    );
};

const ProductFulfillmentField: React.FC<{
    name: any[];
    product: any;
    index: number;
    isDisabled?: boolean;
    isSerialable?: boolean;
    onSerialableChange?: (name: string, value: boolean) => void;
}> = ({ name, product, index, isDisabled, isSerialable, onSerialableChange }) => {
    isSerialable = isSerialable !== false;
    const STRUCTURE = {
        deliveryProductSid: {
            dataIndex: 'deliveryProductSid',
            placeholder: 'Product',
        },
        productSerialable: {
            dataIndex: 'productSerialable',
        },
        productQuantity: {
            dataIndex: 'productQuantity',
            placeholder: 'Qty',
        },
        productLot: {
            dataIndex: 'productLot',
            placeholder: 'Lot number',
        },
        productId: {
            dataIndex: 'productId',
            placeholder: 'Lot number',
        },
        productSns: {
            dataIndex: 'productSns',
            placeholder: 'Serial numbers',
        },
    };
    return (
        <div>
            <div style={{ marginBottom: 10 }}>Fulfillment Product #{index + 1}</div>
            <Row gutter={[4, 0]}>
                <Col span={8} sm={{ span: 12 }} lg={{ span: 10 }}>
                    <Form.Item name={[...name, STRUCTURE.deliveryProductSid.dataIndex]}>
                        <Select
                            suffixIcon={() => null}
                            disabled={true}
                            options={[{ value: product._sid, label: product.name }]}
                        />
                    </Form.Item>
                </Col>
                <Col span={8} sm={{ span: 12 }} lg={{ span: 5 }}>
                    <Form.Item
                        name={[...name, STRUCTURE.productId.dataIndex]}
                        initialValue={product.pin || product.type}
                    >
                        <Input disabled={true} />
                    </Form.Item>
                </Col>
                <Col span={8} sm={{ span: 5 }} lg={{ span: 3 }}>
                    <Form.Item name={[...name, STRUCTURE.productQuantity.dataIndex]}>
                        <InputNumber disabled={true} />
                    </Form.Item>
                </Col>
            </Row>
            <Row gutter={[4, 0]}>
                <Col span={12} sm={{ span: 24 }} lg={{ span: 12 }}>
                    <Form.Item
                        hidden={!isSerialable}
                        name={[...name, STRUCTURE.productSns.dataIndex]}
                    >
                        <Input.TextArea
                            hidden={!isSerialable}
                            rows={4}
                            disabled={isDisabled}
                            placeholder={STRUCTURE.productSns.placeholder}
                        />
                    </Form.Item>
                    <Form.Item
                        hidden={isSerialable}
                        name={[...name, STRUCTURE.productLot.dataIndex]}
                    >
                        <Input.TextArea
                            hidden={isSerialable}
                            rows={4}
                            disabled={isDisabled}
                            placeholder={STRUCTURE.productLot.placeholder}
                        />
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
        </div>
    );
};

const ProductExtraField: React.FC<{
    name: any[];
    label: string;
    product: any;
    serialable: { [x: string]: boolean };
    isDisabled?: boolean;
    onSerialableChange?: (name: string, value: boolean) => void;
}> = ({ name, label, product, serialable, isDisabled, onSerialableChange }) => {
    const STRUCTURE = {
        deliveryProductSid: {
            dataIndex: 'deliveryProductSid',
            placeholder: 'Product',
        },
        productSerialable: {
            dataIndex: 'productSerialable',
        },
        productQuantity: {
            dataIndex: 'productQuantity',
            placeholder: 'Qty',
        },
        productLot: {
            dataIndex: 'productLot',
            placeholder: 'Lot number',
        },
        productSns: {
            dataIndex: 'productSns',
            placeholder: 'Serial numbers',
        },
    };
    return (
        <Form.List name={[...name]}>
            {(fields, { add, remove }) => {
                return (
                    <div>
                        {fields.map((field, i) => {
                            const isSerialable =
                                serialable['' + name.join('') + field.name] !== false;
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
                                    <div style={{ marginBottom: 10 }}>
                                        Complement Product #{i + 1}
                                    </div>
                                    <Row gutter={[4, 0]}>
                                        <Col span={12} sm={{ span: 24 }} lg={{ span: 12 }}>
                                            <Form.Item
                                                hidden={!isSerialable}
                                                name={[field.name, STRUCTURE.productSns.dataIndex]}
                                                rules={[
                                                    {
                                                        required: isSerialable,
                                                        message: 'Required',
                                                    },
                                                ]}
                                            >
                                                <Input.TextArea
                                                    hidden={!isSerialable}
                                                    rows={4}
                                                    disabled={isDisabled}
                                                    placeholder={STRUCTURE.productSns.placeholder}
                                                />
                                            </Form.Item>
                                            <Form.Item
                                                hidden={isSerialable}
                                                name={[field.name, STRUCTURE.productLot.dataIndex]}
                                            >
                                                <Input.TextArea
                                                    hidden={isSerialable}
                                                    rows={4}
                                                    disabled={isDisabled}
                                                    placeholder={STRUCTURE.productLot.placeholder}
                                                />
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
                                                        onSerialableChange(
                                                            '' + name.join('') + field.name,
                                                            checked
                                                        )
                                                    }
                                                />
                                            </Form.Item>
                                        </Col>
                                        <Col>
                                            <Form.Item
                                                initialValue={product._sid}
                                                name={[
                                                    field.name,
                                                    STRUCTURE.deliveryProductSid.dataIndex,
                                                ]}
                                                hidden={true}
                                            >
                                                <Input hidden={true} value={product._sid} />
                                            </Form.Item>
                                        </Col>
                                    </Row>
                                </div>
                            );
                        })}
                        <Form.Item>
                            <Button type='dashed' onClick={() => add()} block disabled={isDisabled}>
                                <PlusOutlined /> {label}
                            </Button>
                        </Form.Item>
                    </div>
                );
            }}
        </Form.List>
    );
};

const ProductOtherField: React.FC<{
    name: any[];
    label: string;
    product: any;
    serialable: { [x: string]: boolean };
    isDisabled?: boolean;
    onSerialableChange?: (name: string, value: boolean) => void;
}> = ({ name, label, product, serialable, isDisabled, onSerialableChange }) => {
    const STRUCTURE = {
        deliveryProductSid: {
            dataIndex: 'deliveryProductSid',
            placeholder: 'Product',
        },
        productName: {
            dataIndex: 'productName',
            placeholder: 'Name',
        },
        productSerialable: {
            dataIndex: 'productSerialable',
        },
        productQuantity: {
            dataIndex: 'productQuantity',
            placeholder: 'Qty',
        },
        productLot: {
            dataIndex: 'productLot',
            placeholder: 'Lot number',
        },
        productSns: {
            dataIndex: 'productSns',
            placeholder: 'Serial numbers',
        },
    };
    return (
        <Form.List name={[...name]}>
            {(fields, { add, remove }) => {
                return (
                    <div>
                        {fields.map((field, i) => {
                            const isSerialable =
                                serialable['' + name.join('') + field.name] !== false;
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
                                    <div style={{ marginBottom: 10 }}>Other Product #{i + 1}</div>
                                    <Row gutter={[4, 0]}>
                                        <Col span={8} sm={{ span: 12 }} lg={{ span: 5 }}>
                                            <Form.Item
                                                name={[field.name, STRUCTURE.productName.dataIndex]}
                                                rules={[{ required: true, message: 'Required' }]}
                                            >
                                                <Input
                                                    placeholder={STRUCTURE.productName.placeholder}
                                                />
                                            </Form.Item>
                                        </Col>
                                    </Row>
                                    <Row gutter={[4, 0]}>
                                        <Col span={12} sm={{ span: 24 }} lg={{ span: 12 }}>
                                            <Form.Item
                                                hidden={!isSerialable}
                                                name={[field.name, STRUCTURE.productSns.dataIndex]}
                                                rules={[
                                                    {
                                                        required: isSerialable,
                                                        message: 'Required',
                                                    },
                                                ]}
                                            >
                                                <Input.TextArea
                                                    hidden={!isSerialable}
                                                    rows={4}
                                                    disabled={isDisabled}
                                                    placeholder={STRUCTURE.productSns.placeholder}
                                                />
                                            </Form.Item>
                                            <Form.Item
                                                hidden={isSerialable}
                                                name={[field.name, STRUCTURE.productLot.dataIndex]}
                                            >
                                                <Input.TextArea
                                                    hidden={isSerialable}
                                                    rows={4}
                                                    disabled={isDisabled}
                                                    placeholder={STRUCTURE.productLot.placeholder}
                                                />
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
                                                        onSerialableChange(
                                                            '' + name.join('') + field.name,
                                                            checked
                                                        )
                                                    }
                                                />
                                            </Form.Item>
                                        </Col>
                                        <Col>
                                            <Form.Item
                                                initialValue={product._sid}
                                                name={[
                                                    field.name,
                                                    STRUCTURE.deliveryProductSid.dataIndex,
                                                ]}
                                                hidden={true}
                                            >
                                                <Input hidden={true} />
                                            </Form.Item>
                                        </Col>
                                    </Row>
                                </div>
                            );
                        })}
                        <Form.Item>
                            <Button type='dashed' onClick={() => add()} block disabled={isDisabled}>
                                <PlusOutlined /> {label}
                            </Button>
                        </Form.Item>
                    </div>
                );
            }}
        </Form.List>
    );
};

export default ConfigureCreateForm;
