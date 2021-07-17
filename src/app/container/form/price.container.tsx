import React from 'react';

import { Checkbox, Form, Input, InputNumber } from 'antd';

export const Price: React.FC<{
    name: string | any[];
    fieldKey: string | any[];
    rules: any[];
    disabled?: boolean;
    placeholder?: string;
    noStyle?: boolean;
}> = ({ disabled, placeholder, ...props }) => {
    return (
        <Input.Group compact={true} style={{ display: 'flex', width: '100%' }}>
            <Form.Item noStyle={true}>
                <Input value='IDR' disabled={true} style={{ width: '48px' }} />
            </Form.Item>
            <Form.Item {...props} noStyle={true}>
                <InputNumber
                    autoFocus={true}
                    style={{ minWidth: '180px', flex: 1 }}
                    formatter={(value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                    parser={(value = '') => value.replace(/Rp\s?|(,*)/g, '')}
                    disabled={disabled}
                    placeholder={placeholder}
                    step={1000}
                    min={1000}
                />
            </Form.Item>
            <Form.Item
                name={Array.isArray(props.name) ? [props.name[0], 'priceTax'] : 'priceTax'}
                noStyle={true}
                valuePropName='checked'
            >
                <Checkbox disabled={disabled} style={{ marginLeft: '4px' }}>
                    tax
                </Checkbox>
            </Form.Item>
        </Input.Group>
    );
};
