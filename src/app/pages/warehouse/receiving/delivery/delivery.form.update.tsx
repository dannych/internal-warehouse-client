import React from 'react';

import { UploadOutlined } from '@ant-design/icons';
import { Button, Col, Form, Input, Row, Upload } from 'antd';

const DeliveryForm: React.FC<{
    form?: any;
    onFinish?: any;
    name: string;
    uploadComponent: any;
    isDisabled?: boolean;
    isUploadDisabled?: boolean;
    isLoading?: boolean;
}> = ({ form, onFinish, name, isDisabled, uploadComponent, isUploadDisabled }) => {
    const STRUCTURE = {
        _id: {
            dataIndex: '_id',
            label: 'Order Date',
            placeholder: 'Date',
        },
        postId: {
            dataIndex: 'postId',
            label: 'Internal id',
            placeholder: 'Internal identifier',
        },
        paperId: {
            dataIndex: 'paperId',
            label: 'Reference',
            placeholder: 'Input reference number',
        },
        supplierPaperFile: {
            dataIndex: 'supplierPaperFile',
            label: 'File',
        },
    };

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
                    <Form.Item name={STRUCTURE.postId.dataIndex}>
                        <Input disabled={true} placeholder={STRUCTURE.postId.placeholder} />
                    </Form.Item>
                </Col>
                <Col span={8} sm={{ span: 12 }} lg={{ span: 8 }}>
                    <Form.Item hidden={true} name={STRUCTURE._id.dataIndex}>
                        <Input hidden={true} disabled={isDisabled} />
                    </Form.Item>
                </Col>
            </Row>
            <Row gutter={[8, 0]}>
                <Col span={12} sm={{ span: 16 }} lg={{ span: 12 }}>
                    <Form.Item label={STRUCTURE.paperId.label} name={STRUCTURE.paperId.dataIndex}>
                        <Input
                            placeholder={STRUCTURE.paperId.placeholder}
                            allowClear={true}
                            disabled={isDisabled}
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
        </Form>
    );
};

export default DeliveryForm;
