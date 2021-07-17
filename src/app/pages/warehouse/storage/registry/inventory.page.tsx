import React from 'react';

import { Button, Drawer, PageHeader, Space } from 'antd';

import PageBreadcrumb from 'src/app/component/page-breadcrumb.component';

import ContactUpdateForm from './inventory.form.update';
import pageheader from './inventory.pageheader';
import usePresenter from './inventory.presenter';
import Table from './inventory.table';
import Detail from './inventory.detail';

const ContactPage = () => {
    const {
        tableDataSource,
        tablePagination,
        updateForm,
        updateFormIsLoading,
        updateFormIsVisible,
        isTableLoading,
        isTableActionDisabled,
        detailIsVisible,
        detailMeta,
        detailPayload,
        detailIsLoading,
        onTableItemDetailClick,
        onTableChange,
        onTableRefresh,
        onTableItemEdit,
        onDetailHide,
        onUpdateFormCancel,
        onUpdateFormSubmit,
        onUpdateFormFinish,
        onUpdateFormVisibilityChanges,
    } = usePresenter();
    return (
        <div>
            <PageBreadcrumb crumbs={pageheader.breadcrumbs} />
            <PageHeader onBack={pageheader.onBack} title='Registry' />

            <div style={{ padding: '0 24px' }}>
                <Space direction='vertical' size='large' style={{ width: '100%' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                        <div />
                        <Button size='small' onClick={onTableRefresh}>
                            Refresh
                        </Button>
                    </div>
                    <Table
                        dataSource={tableDataSource}
                        pagination={tablePagination}
                        isLoading={isTableLoading}
                        onEdit={onTableItemEdit}
                        onChange={onTableChange}
                        onClickDetail={onTableItemDetailClick}
                        isActionDisabled={isTableActionDisabled}
                    />
                </Space>
            </div>

            <Drawer
                width='65vw'
                visible={updateFormIsVisible}
                afterVisibleChange={onUpdateFormVisibilityChanges}
                onClose={onUpdateFormCancel}
                title='Edit item'
                footer={
                    <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                        <Space>
                            <Button onClick={onUpdateFormCancel} disabled={updateFormIsLoading}>
                                Cancel
                            </Button>
                            <Button
                                onClick={onUpdateFormSubmit}
                                type='primary'
                                disabled={updateFormIsLoading}
                                loading={updateFormIsLoading}
                            >
                                Submit
                            </Button>
                        </Space>
                    </div>
                }
            >
                <ContactUpdateForm
                    form={updateForm}
                    name='ContactFormUpdate'
                    onFinish={onUpdateFormFinish}
                    isDisabled={updateFormIsLoading}
                />
            </Drawer>

            <Drawer
                width='65vw'
                visible={detailIsVisible}
                title='Order detail'
                onClose={onDetailHide}
            >
                <Detail payload={detailPayload} meta={detailMeta} metaIsLoading={detailIsLoading} />
            </Drawer>
        </div>
    );
};

export default ContactPage;
