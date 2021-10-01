import React from 'react';

import { Button, Divider, Drawer, PageHeader, Result, Skeleton, Space, Steps } from 'antd';
import { LoadingOutlined } from '@ant-design/icons';

import PageBreadcrumb from 'src/app/component/page-breadcrumb.component';

import DeliveryDetail from './delivery.detail';
import DeliveryConfirmForm from './delivery.form.confirm';
import DeliveryCancelForm from './delivery.form.cancel';
import DeliveryScanFormCreate from './delivery.form.scan';
import DeliveryScanFormReview from './delivery.form.review';
import pageheader from './delivery.pageheader';
import usePresenter, { DeliveryScanFormStep } from './delivery.presenter';
import DeliveryTable from './delivery.table';

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
        deliveryScanForm,
        deliveryScanFormSerialable,
        deliveryScanFormPayload,
        deliveryScanFormMeta,
        deliveryScanFormStep,
        deliveryScanFormIsVisible,
        deliveryScanFormInputIsLoading,
        deliveryScanFormInputIsDisabled,
        deliveryScanFormReviewIsLoading,
        deliveryScanFormReviewPayload,
        deliveryConfirmForm,
        deliveryConfirmFormPayload,
        deliveryConfirmFormIsVisible,
        deliveryConfirmFormIsLoading,
        deliveryCancelForm,
        deliveryCancelFormPayload,
        deliveryCancelFormIsVisible,
        deliveryCancelFormIsLoading,
        onDeliveryTableSearch,
        onDeliveryTableRefresh,
        onDeliveryTableDetailClick,
        onDeliveryTableScanClick,
        onDeliveryTableConfirmClick,
        onDeliveryTableCancelClick,
        onDeliveryDetailHide,
        onDeliveryScanFormHide,
        onDeliveryScanFormSerialableChange,
        onDeliveryScanFormInputSubmit,
        onDeliveryScanFormInputFinish,
        onDeliveryScanFormReviewEdit,
        onDeliveryScanFormReviewSubmit,
        onDeliveryScanFormDoneClose,
        onDeliveryScanFormDoneAgain,
        onDeliveryScanFormVisibleChanges,
        onDeliveryConfirmFormHide,
        onDeliveryConfirmFormInputFinish,
        onDeliveryConfirmFormInputSubmit,
        onDeliveryCancelFormHide,
        onDeliveryCancelFormInputFinish,
        onDeliveryCancelFormInputSubmit,
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
                    <DeliveryTable
                        dataSource={deliveryTablePayload}
                        isLoading={deliveryTableIsLoading}
                        isActionDisabled={deliveryTableActionIsDisabled}
                        pagination={deliveryTablePagination}
                        onChange={onDeliveryTableSearch}
                        onClickDetail={onDeliveryTableDetailClick}
                        onClickScan={onDeliveryTableScanClick}
                        onClickConfirm={onDeliveryTableConfirmClick}
                        onClickCancel={onDeliveryTableCancelClick}
                    />
                </Space>
            </div>

            <Drawer
                width='75vw'
                title='Delivery Order'
                visible={deliveryScanFormIsVisible}
                maskClosable={!deliveryScanFormInputIsLoading}
                headerStyle={{ display: 'none' }}
                onClose={onDeliveryScanFormHide}
                afterVisibleChange={onDeliveryScanFormVisibleChanges}
                footer={
                    <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                        {deliveryScanFormStep === DeliveryScanFormStep.INPUT && (
                            <Space>
                                <Button
                                    size='small'
                                    onClick={onDeliveryScanFormInputSubmit}
                                    type='primary'
                                    disabled={deliveryScanFormInputIsDisabled}
                                    loading={deliveryScanFormInputIsLoading}
                                >
                                    Submit
                                </Button>
                            </Space>
                        )}
                        {deliveryScanFormStep === DeliveryScanFormStep.REVIEW && (
                            <Space>
                                <Button
                                    size='small'
                                    onClick={onDeliveryScanFormReviewEdit}
                                    disabled={deliveryScanFormInputIsDisabled}
                                    loading={deliveryScanFormInputIsLoading}
                                >
                                    Edit
                                </Button>
                                <Button
                                    size='small'
                                    onClick={onDeliveryScanFormReviewSubmit}
                                    type='primary'
                                    disabled={
                                        deliveryScanFormReviewPayload &&
                                        !deliveryScanFormReviewPayload.isValid
                                    }
                                    loading={deliveryScanFormReviewIsLoading}
                                >
                                    Submit
                                </Button>
                            </Space>
                        )}
                        {deliveryScanFormStep === DeliveryScanFormStep.DONE && (
                            <Space>
                                <Button size='small' onClick={onDeliveryScanFormDoneClose}>
                                    Close
                                </Button>
                            </Space>
                        )}
                    </div>
                }
            >
                <Steps current={deliveryScanFormStep} size='small'>
                    <Steps.Step title='Input' />
                    <Steps.Step
                        title='Preview'
                        icon={deliveryScanFormReviewIsLoading ? <LoadingOutlined /> : undefined}
                    />
                    <Steps.Step title='Done' />
                </Steps>
                <Divider />
                {deliveryScanFormStep === DeliveryScanFormStep.INPUT && (
                    <Skeleton loading={deliveryScanFormInputIsLoading}>
                        <DeliveryScanFormCreate
                            form={deliveryScanForm}
                            name='deliveryScanForm'
                            payload={deliveryScanFormPayload}
                            serialable={deliveryScanFormSerialable}
                            meta={deliveryScanFormMeta}
                            isDisabled={deliveryScanFormInputIsLoading}
                            isLoading={deliveryScanFormInputIsLoading}
                            onFinish={onDeliveryScanFormInputFinish}
                            onSerialableChange={onDeliveryScanFormSerialableChange}
                        />
                    </Skeleton>
                )}
                {deliveryScanFormStep === DeliveryScanFormStep.REVIEW && (
                    <Skeleton loading={deliveryScanFormReviewIsLoading}>
                        <DeliveryScanFormReview
                            payload={deliveryScanFormReviewPayload}
                            orderPayload={deliveryScanFormPayload}
                            orderMeta={deliveryScanFormMeta}
                        />
                    </Skeleton>
                )}
                {deliveryScanFormStep === DeliveryScanFormStep.DONE && (
                    <Result
                        title='Submitted succesfully'
                        extra={[
                            <Button
                                size='small'
                                type='primary'
                                onClick={onDeliveryScanFormDoneClose}
                            >
                                Finish
                            </Button>,
                            <Button size='small' onClick={onDeliveryScanFormDoneAgain}>
                                Input Another
                            </Button>,
                        ]}
                    />
                )}
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

            <Drawer
                width='65vw'
                visible={deliveryConfirmFormIsVisible}
                title='Delivery Confirmation'
                onClose={onDeliveryConfirmFormHide}
                footer={
                    <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                        <Space>
                            <Button
                                size='small'
                                onClick={onDeliveryConfirmFormInputSubmit}
                                type='primary'
                                disabled={deliveryConfirmFormIsLoading}
                                loading={deliveryConfirmFormIsLoading}
                            >
                                Confirm
                            </Button>
                        </Space>
                    </div>
                }
            >
                <DeliveryConfirmForm
                    name='deliveryConfirm'
                    form={deliveryConfirmForm}
                    payload={deliveryConfirmFormPayload}
                    isLoading={deliveryConfirmFormIsLoading}
                    onFinish={onDeliveryConfirmFormInputFinish}
                />
            </Drawer>

            <Drawer
                width='65vw'
                visible={deliveryCancelFormIsVisible}
                title='Delivery Confirmation'
                onClose={onDeliveryCancelFormHide}
                footer={
                    <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                        <Space>
                            <Button
                                size='small'
                                onClick={onDeliveryCancelFormInputSubmit}
                                type='primary'
                                disabled={deliveryCancelFormIsLoading}
                                loading={deliveryCancelFormIsLoading}
                            >
                                Confirm
                            </Button>
                        </Space>
                    </div>
                }
            >
                <DeliveryCancelForm
                    name='deliveryCancel'
                    form={deliveryCancelForm}
                    payload={deliveryCancelFormPayload}
                    isLoading={deliveryCancelFormIsLoading}
                    onFinish={onDeliveryCancelFormInputFinish}
                />
            </Drawer>
        </div>
    );
};

export default DeliveryPage;
