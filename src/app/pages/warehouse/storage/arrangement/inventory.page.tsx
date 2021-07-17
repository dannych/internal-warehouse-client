import React from 'react';

import { Button, Drawer, PageHeader, Space } from 'antd';
import { PlusOutlined } from '@ant-design/icons';

import PageBreadcrumb from 'src/app/component/page-breadcrumb.component';

import InventoryCreateAssemblyForm from './inventory.form.create.assembly';
import InventoryCreateSelectForm from './inventory.form.create.select';
import InventoryCreateRegisterForm from './inventory.form.create.register';
import pageheader from './inventory.pageheader';
import usePresenter from './inventory.presenter';
import Table from './inventory.table';
import Detail from './inventory.detail';

const ContactPage = () => {
    const {
        tableDataSource,
        tablePagination,
        createFormIsSubmitable,
        createFormSelections,
        createFormInList,
        createFormInDict,
        createFormIsLoading,
        createFormIsVisible,
        createFormInIsVisible,
        createFormOut,
        createFormOutList,
        createFormOutIsVisible,
        isTableLoading,
        isTableActionDisabled,
        detailIsVisible,
        detailMeta,
        detailPayload,
        detailIsLoading,
        onTableItemDetailClick,
        onTableChange,
        onTableRefresh,
        onMenuCreate,
        onDetailHide,
        onCreateFormInRemoveClick,
        onCreateFormOutRemoveClick,
        onCreateFormCancel,
        onCreateFormSubmit,
        onCreateFormVisibilityChanges,
        onCreateFormInClick,
        onCreateFormOutClick,
        onCreateFormInCancel,
        onCreateFormInSelect,
        onCreateFormOutCancel,
        onCreateFormOutSearch,
        onCreateFormOutFinish,
    } = usePresenter();
    return (
        <div>
            <PageBreadcrumb crumbs={pageheader.breadcrumbs} />
            <PageHeader
                onBack={pageheader.onBack}
                title='Arrangement'
                extra={[
                    <Button
                        key='create'
                        type='primary'
                        icon={<PlusOutlined />}
                        onClick={onMenuCreate}
                    >
                        Create arrangement
                    </Button>,
                ]}
            />

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
                        onChange={onTableChange}
                        onClickDetail={onTableItemDetailClick}
                        isActionDisabled={isTableActionDisabled}
                    />
                </Space>
            </div>

            <Drawer
                width='65vw'
                visible={createFormIsVisible}
                afterVisibleChange={onCreateFormVisibilityChanges}
                onClose={onCreateFormCancel}
                title='Edit item'
                headerStyle={{ display: 'none' }}
                footer={
                    <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                        <Space>
                            <Button
                                size='small'
                                onClick={onCreateFormCancel}
                                disabled={createFormIsLoading}
                            >
                                Cancel
                            </Button>
                            <Button
                                size='small'
                                onClick={onCreateFormSubmit}
                                type='primary'
                                disabled={createFormIsLoading || !createFormIsSubmitable}
                                loading={createFormIsLoading}
                            >
                                Submit
                            </Button>
                        </Space>
                    </div>
                }
            >
                <InventoryCreateAssemblyForm
                    ins={createFormInList}
                    outs={createFormOutList}
                    onAddInClick={onCreateFormInClick}
                    onAddOutClick={onCreateFormOutClick}
                    onItemInDeleteClick={onCreateFormInRemoveClick}
                    onItemOutDeleteClick={onCreateFormOutRemoveClick}
                />
                <Drawer
                    width='65vw'
                    visible={createFormInIsVisible}
                    // afterVisibleChange={onCreateFormVisibilityChanges}
                    onClose={onCreateFormInCancel}
                    title='Edit item'
                    headerStyle={{ display: 'none' }}
                >
                    <InventoryCreateSelectForm
                        selections={createFormSelections}
                        selectedOptions={createFormInDict}
                        onSelect={onCreateFormInSelect}
                    />
                </Drawer>
                <Drawer
                    width='65vw'
                    visible={createFormOutIsVisible}
                    // afterVisibleChange={onCreateFormVisibilityChanges}
                    onClose={onCreateFormOutCancel}
                    title='Edit item'
                    headerStyle={{ display: 'none' }}
                >
                    <InventoryCreateRegisterForm
                        form={createFormOut}
                        onSearch={onCreateFormOutSearch}
                        onSubmit={onCreateFormOutFinish}
                    />
                </Drawer>
            </Drawer>

            <Drawer
                width='75vw'
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
