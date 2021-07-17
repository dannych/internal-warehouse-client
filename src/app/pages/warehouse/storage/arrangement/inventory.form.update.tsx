import React from 'react';

import { AutoComplete, Form, Input, Select } from 'antd';

import STRUCTURE, { BRAND_LIST, CATEGORY_AUTOCOMPLETE } from './inventory.form.constant';

const ContactFormUpdate: React.FC<{
    form?: any;
    onFinish?: any;
    name: string;
    isDisabled?: boolean;
}> = ({ form, onFinish, name, isDisabled }) => {
    return (
        <Form
            size='small'
            form={form}
            layout='vertical'
            onFinish={onFinish}
            name={name}
            hideRequiredMark={true}
        >
            <Form.Item label={STRUCTURE.pin.label} name={STRUCTURE.pin.dataIndex}>
                <Input placeholder={STRUCTURE.pin.placeholder} allowClear={true} disabled={true} />
            </Form.Item>
            <Form.Item label={STRUCTURE.name.label} name={STRUCTURE.name.dataIndex}>
                <Input
                    placeholder={STRUCTURE.name.placeholder}
                    allowClear={true}
                    disabled={isDisabled}
                />
            </Form.Item>
            <Form.Item label={STRUCTURE.brand.label} name={STRUCTURE.brand.dataIndex}>
                <AutoComplete
                    placeholder={STRUCTURE.brand.placeholder}
                    allowClear={true}
                    disabled={isDisabled}
                    filterOption={(inputValue: string, option: any) =>
                        option?.value.toUpperCase().indexOf(inputValue.toUpperCase()) !== -1
                    }
                    dataSource={BRAND_LIST.map((text) => ({
                        text,
                        value: text,
                    }))}
                />
            </Form.Item>
            <Form.Item label={STRUCTURE.categories.label} name={STRUCTURE.categories.dataIndex}>
                <Select
                    mode='tags'
                    options={CATEGORY_AUTOCOMPLETE}
                    disabled={isDisabled}
                    placeholder={STRUCTURE.categories.placeholder}
                />
            </Form.Item>
        </Form>
    );
};

export default ContactFormUpdate;
