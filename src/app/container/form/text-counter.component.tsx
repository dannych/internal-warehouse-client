import React from 'react';

import { MinusCircleOutlined, PlusOutlined } from '@ant-design/icons';
import { Button, Col, Form, Input, InputNumber, Row } from 'antd';

export const TextCounter: React.FC<{
    name: string[];
    rules: any[];
    hidden?: boolean;
    isDisabled?: boolean;
    placeholder?: string;
    noStyle?: boolean;
}> = ({ isDisabled, placeholder, name, hidden, rules, ...props }) => {
    return (
        <Form.Item noStyle={true} hidden={hidden} rules={rules}>
            <Input.Group style={{ display: 'flex', width: '100%' }}>
                <Form.List name={name}>
                    {(fields, { add, remove }) => (
                        <div style={{ width: '100%' }}>
                            {fields.map(({ name, ...field }) => (
                                <Row gutter={4} key={name}>
                                    <Col span={19}>
                                        <Form.Item name={[name, 'lot']} noStyle={true}>
                                            <Input placeholder='Lot' />
                                        </Form.Item>
                                    </Col>
                                    <Col span={4}>
                                        <Form.Item name={[name, 'quantity']} noStyle={true}>
                                            <InputNumber placeholder='Qty.' />
                                        </Form.Item>
                                    </Col>
                                    <Col span={1}>
                                        <Form.Item>
                                            <MinusCircleOutlined onClick={() => remove(name)} />
                                        </Form.Item>
                                    </Col>
                                </Row>
                            ))}
                            <Form.Item>
                                <Button
                                    type='dashed'
                                    onClick={() => add()}
                                    block
                                    disabled={isDisabled}
                                >
                                    <PlusOutlined /> Add Lot
                                </Button>
                            </Form.Item>
                        </div>
                    )}
                </Form.List>
            </Input.Group>
        </Form.Item>
    );
};
