import React from 'react';

import { Button, Drawer, PageHeader, Space } from 'antd';
import { PlusOutlined } from '@ant-design/icons';

import PageBreadcrumb from 'src/app/component/page-breadcrumb.component';

import EngineerCreateForm from './driver.form.create';
import pageheader from './driver.pageheader';
import usePresenter from './driver.presenter';
import Table from './driver.table';

const Engineer = () => {
    const {
        form,
        tableDataSource,
        isCreateFormVisible,
        isCreateFormLoading,
        isTableLoading,
        isTableActionDisabled,
        onCreate,
        onCreateStart,
        onCreateSubmit,
        onCreateCancel,
        onDelete,
        onSearch,
    } = usePresenter();
    return (
        <div>
            <PageBreadcrumb crumbs={pageheader.breadcrumbs} />
            <PageHeader
                onBack={pageheader.onBack}
                title='Driver'
                extra={[
                    <Button type='primary' icon={<PlusOutlined />} onClick={onCreateStart}>
                        Add Engineer
                    </Button>,
                ]}
            />

            <div style={{ padding: '0 24px' }}>
                <Space direction='vertical' size='large' style={{ width: '100%' }}>
                    <Table
                        dataSource={tableDataSource}
                        isLoading={isTableLoading}
                        onDelete={onDelete}
                        onSearch={onSearch}
                        isActionDisabled={isTableActionDisabled}
                    />
                </Space>
            </div>

            <Drawer
                width='65vw'
                visible={isCreateFormVisible}
                onClose={onCreateCancel}
                title='Add a new engineer'
                footer={
                    <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                        <Space>
                            <Button onClick={onCreateCancel} disabled={isCreateFormLoading}>
                                Cancel
                            </Button>
                            <Button
                                onClick={onCreateSubmit}
                                type='primary'
                                disabled={isCreateFormLoading}
                                loading={isCreateFormLoading}
                            >
                                Submit
                            </Button>
                        </Space>
                    </div>
                }
            >
                <div style={{ width: '70%' }}>
                    <EngineerCreateForm
                        form={form}
                        name='EngineerForm'
                        onFinish={onCreate}
                        isDisabled={isCreateFormLoading}
                    />
                </div>
            </Drawer>
        </div>
    );
};

export default Engineer;
