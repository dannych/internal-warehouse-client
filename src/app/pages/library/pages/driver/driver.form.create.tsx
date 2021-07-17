import React from 'react';

import { Form, Input } from 'antd';

const OfficerForm: React.FC<{
    form?: any;
    onFinish?: any;
    name: string;
    isDisabled?: boolean;
}> = ({ form, onFinish, name, isDisabled }) => {
    const STRUCTURE = {
        code: {
            dataIndex: 'officerCode',
            label: 'Code',
            placeholder: 'Input company id',
        },
        name: {
            dataIndex: 'officerName',
            label: 'Name',
            placeholder: 'Input company name',
        },
    };

    return (
        <Form form={form} layout='vertical' onFinish={onFinish} name={name} hideRequiredMark={true}>
            <Form.Item label={STRUCTURE.code.label} name={STRUCTURE.code.dataIndex}>
                <Input
                    placeholder={STRUCTURE.code.placeholder}
                    allowClear={true}
                    disabled={isDisabled}
                />
            </Form.Item>
            <Form.Item label={STRUCTURE.name.label} name={STRUCTURE.name.dataIndex}>
                <Input
                    placeholder={STRUCTURE.name.placeholder}
                    allowClear={true}
                    disabled={isDisabled}
                />
            </Form.Item>
        </Form>
    );
};

export default OfficerForm;
