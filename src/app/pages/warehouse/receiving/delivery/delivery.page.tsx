import React from 'react';

import { Button, Divider, Drawer, PageHeader, Result, Space, Steps } from 'antd';
import { LoadingOutlined } from '@ant-design/icons';

import PageBreadcrumb from 'src/app/component/page-breadcrumb.component';

import DeliveryDetail from './delivery.detail';
import FormCreate from './delivery.form.create';
import UpdateForm from './delivery.form.update';
import pageheader from './delivery.pageheader';
import usePresenter, { DeliveryCreateStep } from './delivery.presenter';
import SaledeliveryTable from './delivery.table';

const DeliveryPage = () => {
    const {
        deliveryTablePayload,
        deliveryTableIsLoading,
        deliveryTableActionIsDisabled,
        deliveryTablePagination,
        deliveryDetailPayload,
        deliveryDetailIsVisible,
        deliveryDetailMeta,
        deliveryDetailMetaIsLoading,
        deliveryCreateForm,
        deliveryCreateFormStep,
        deliveryCreateFormIsVisible,
        deliveryCreateFormPreviewIsLoading,
        deliveryCreateFormEndPayload,
        deliveryUpdateForm,
        deliveryUpdateFormIsLoading,
        deliveryUpdateFormIsVisible,
        deliveryUpdateFormUploadComponent,
        deliveryUpdateFormUploadIsDisabled,
        onDeliveryTableSearch,
        onDeliveryTableRefresh,
        onDeliveryTableDetailClick,
        onDeliveryTableDetailUpdate,
        onDeliveryDetailHide,
        onDeliveryCreateFormHide,
        onDeliveryCreateFormFullyClosed,
        onDeliveryCreateFormInputSubmit,
        onDeliveryCreateFormInputFinish,
        onDeliveryCreateFormPreviewCancel,
        onDeliveryCreateFormPreviewFinish,
        onDeliveryCreateFormEndAnother,
        onDeliveryCreateFormEndFinish,
        onDeliveryUpdateFormFullyClosed,
        onDeliveryUpdateFormHide,
        onDeliveryUpdateFormSubmit,
        onDeliveryUpdateFormFinish,
    } = usePresenter();

    return (
        <div>
            <PageBreadcrumb crumbs={pageheader.breadcrumbs} />
            <PageHeader onBack={pageheader.onBack} title='Delivery' />

            <div style={{ padding: '0 24px 16px 24px' }}>
                <Space direction='vertical' size='small' style={{ width: '100%' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                        <div />
                        <Button size='small' onClick={onDeliveryTableRefresh}>
                            Refresh
                        </Button>
                    </div>
                    <SaledeliveryTable
                        dataSource={deliveryTablePayload}
                        isLoading={deliveryTableIsLoading}
                        isActionDisabled={deliveryTableActionIsDisabled}
                        pagination={deliveryTablePagination}
                        onChange={onDeliveryTableSearch}
                        onClickDetail={onDeliveryTableDetailClick}
                        onClickEdit={onDeliveryTableDetailUpdate}
                    />
                </Space>
            </div>

            <Drawer
                width='75vw'
                visible={deliveryCreateFormIsVisible}
                maskClosable={!deliveryCreateFormPreviewIsLoading}
                afterVisibleChange={onDeliveryCreateFormFullyClosed}
                onClose={onDeliveryCreateFormHide}
                title='New delivery'
                headerStyle={{ display: 'none' }}
                footer={
                    <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                        <Space>
                            {deliveryCreateFormStep === DeliveryCreateStep.INPUT && (
                                <Button
                                    size='small'
                                    onClick={onDeliveryCreateFormInputSubmit}
                                    type='primary'
                                    disabled={deliveryCreateFormPreviewIsLoading}
                                >
                                    Preview
                                </Button>
                            )}
                            {deliveryCreateFormStep === DeliveryCreateStep.PREVIEW && (
                                <Button
                                    size='small'
                                    onClick={onDeliveryCreateFormPreviewCancel}
                                    disabled={deliveryCreateFormPreviewIsLoading}
                                >
                                    Edit
                                </Button>
                            )}
                            {deliveryCreateFormStep === DeliveryCreateStep.PREVIEW && (
                                <Button
                                    size='small'
                                    onClick={onDeliveryCreateFormPreviewFinish}
                                    type='primary'
                                    disabled={deliveryCreateFormPreviewIsLoading}
                                    loading={deliveryCreateFormPreviewIsLoading}
                                >
                                    Create
                                </Button>
                            )}
                        </Space>
                    </div>
                }
            >
                <Steps current={deliveryCreateFormStep} size='small'>
                    <Steps.Step title='Input' />
                    <Steps.Step
                        title='Preview'
                        icon={deliveryCreateFormPreviewIsLoading ? <LoadingOutlined /> : undefined}
                    />
                    <Steps.Step title='Done' />
                </Steps>
                <Divider />
                {deliveryCreateFormStep === DeliveryCreateStep.INPUT && (
                    <div style={{ width: '100%' }}>
                        <FormCreate
                            form={deliveryCreateForm}
                            name='deliveryEntryForm'
                            onFinish={onDeliveryCreateFormInputFinish}
                            // isLoading={deliveryCreateFormInputIsLoading}
                            // isDisabled={deliveryCreateFormInputIsLoading}
                            // onBrowseProduct={onDeliveryCreateFormBrowseProduct}
                        />
                    </div>
                )}
                {deliveryCreateFormStep === DeliveryCreateStep.END && (
                    <div style={{ width: '100%' }}>
                        <Result
                            status='success'
                            title='delivery succesfully submitted'
                            subTitle={`delivery number: ${deliveryCreateFormEndPayload.postId} please check for delivery or purchasing`}
                            extra={[
                                <Button
                                    type='primary'
                                    key='done'
                                    onClick={onDeliveryCreateFormEndFinish}
                                >
                                    Done
                                </Button>,
                                <Button key='again' onClick={onDeliveryCreateFormEndAnother}>
                                    Create Another
                                </Button>,
                            ]}
                        />
                        ,
                    </div>
                )}
            </Drawer>

            <Drawer
                width='75vw'
                visible={deliveryUpdateFormIsVisible}
                maskClosable={!deliveryUpdateFormIsLoading}
                afterVisibleChange={onDeliveryUpdateFormFullyClosed}
                onClose={onDeliveryUpdateFormHide}
                title='Update Delivery'
                footer={
                    <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                        <Space>
                            <Button
                                size='small'
                                onClick={onDeliveryUpdateFormSubmit}
                                type='primary'
                                disabled={deliveryUpdateFormIsLoading}
                                loading={deliveryUpdateFormIsLoading}
                            >
                                Update
                            </Button>
                        </Space>
                    </div>
                }
            >
                <div style={{ width: '100%' }}>
                    <UpdateForm
                        form={deliveryUpdateForm}
                        name='deliveryUpdateForm'
                        uploadComponent={deliveryUpdateFormUploadComponent}
                        onFinish={onDeliveryUpdateFormFinish}
                        isLoading={deliveryUpdateFormIsLoading}
                        isDisabled={deliveryUpdateFormIsLoading}
                        isUploadDisabled={deliveryUpdateFormUploadIsDisabled}
                    />
                </div>
            </Drawer>

            <Drawer
                width='65vw'
                visible={deliveryDetailIsVisible}
                title='Delivery Detail'
                onClose={onDeliveryDetailHide}
            >
                {!!deliveryDetailPayload && (
                    <DeliveryDetail
                        deliveryIsLoading={deliveryDetailMetaIsLoading}
                        deliveryMeta={deliveryDetailMeta}
                        deliveryPayload={deliveryDetailPayload}
                    />
                )}
            </Drawer>
        </div>
    );
};

export default DeliveryPage;
