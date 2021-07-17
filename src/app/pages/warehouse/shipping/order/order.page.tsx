import React from 'react';
import QRCode from 'qrcode.react';

import { Button, Divider, Drawer, PageHeader, Result, Skeleton, Space, Steps } from 'antd';
import { LoadingOutlined } from '@ant-design/icons';

import PageBreadcrumb from 'src/app/component/page-breadcrumb.component';

import DeliveryFormCreate from './delivery.form.create';
import DeliveryStageFormCreate from './delivery.form.scan';
import DeliveryStageFormReview from './delivery.form.review';
import OrderDetail from './order.detail';
import pageheader from './order.pageheader';
import usePresenter, { DeliveryStageFormStep } from './order.presenter';
import OrderTable from './order.table';

const OrderPage = () => {
    const {
        orderTablePayload,
        orderTableIsLoading,
        orderTableActionIsDisabled,
        orderTablePagination,
        orderDetailPayload,
        orderDetailIsVisible,
        orderDetailMeta,
        orderDetailMetaIsLoading,
        orderDetailShowCode,
        deliveryForm,
        deliveryFormPayload,
        deliveryFormMeta,
        deliveryFormMetaIsLoading,
        deliveryFormIsVisible,
        deliveryFormInputIsLoading,
        deliveryFormInputIsDisabled,
        deliveryStageForm,
        deliveryStageFormSerialable,
        deliveryStageFormPayload,
        deliveryStageFormMeta,
        deliveryStageFormStep,
        deliveryStageFormIsVisible,
        deliveryStageFormInputIsLoading,
        deliveryStageFormInputIsDisabled,
        deliveryStageFormReviewIsLoading,
        deliveryStageFormReviewPayload,
        onOrderTableSearch,
        onOrderTableRefresh,
        onOrderTableDetailClick,
        onOrderTableStageClick,
        onOrderTableDeliveryClick,
        onOrderDetailHide,
        onOrderDetailIdClick,
        onOrderDetailIdHide,
        onDeliveryFormHide,
        onDeliveryFormInputFinish,
        onDeliveryFormInputSubmit,
        onDeliveryFormVisibleChanges,
        onDeliveryStageFormHide,
        onDeliveryStageFormSerialableChange,
        onDeliveryStageFormInputSubmit,
        onDeliveryStageFormInputFinish,
        onDeliveryStageFormReviewEdit,
        onDeliveryStageFormReviewSubmit,
        onDeliveryStageFormDoneClose,
        onDeliveryStageFormDoneAgain,
        onDeliveryStageFormVisibleChanges,
    } = usePresenter();

    return (
        <div>
            <PageBreadcrumb crumbs={pageheader.breadcrumbs} />
            <PageHeader onBack={pageheader.onBack} title='Order' />

            <div style={{ padding: '0 24px 16px 24px' }}>
                <Space direction='vertical' size='small' style={{ width: '100%' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                        <div />
                        <Button size='small' onClick={onOrderTableRefresh}>
                            Refresh
                        </Button>
                    </div>
                    <OrderTable
                        dataSource={orderTablePayload}
                        isLoading={orderTableIsLoading}
                        isActionDisabled={orderTableActionIsDisabled}
                        pagination={orderTablePagination}
                        onChange={onOrderTableSearch}
                        onClickDetail={onOrderTableDetailClick}
                        onClickDeliver={onOrderTableDeliveryClick}
                        onClickPackage={onOrderTableStageClick}
                    />
                </Space>
            </div>

            <Drawer
                width='65vw'
                visible={orderDetailIsVisible}
                title='Order detail'
                onClose={onOrderDetailHide}
            >
                {!!orderDetailPayload && (
                    <>
                        <OrderDetail
                            deliveryIsLoading={orderDetailMetaIsLoading}
                            deliveryMeta={orderDetailMeta}
                            deliveryPayload={orderDetailPayload}
                            onIdClick={onOrderDetailIdClick}
                        />
                        <Drawer onClose={onOrderDetailIdHide} visible={orderDetailShowCode}>
                            <QRCode value={orderDetailPayload._id} />
                            <div>{orderDetailPayload._id}</div>
                        </Drawer>
                    </>
                )}
            </Drawer>

            <Drawer
                width='75vw'
                title='Deliver order'
                visible={deliveryFormIsVisible}
                maskClosable={!deliveryFormInputIsLoading}
                onClose={onDeliveryFormHide}
                afterVisibleChange={onDeliveryFormVisibleChanges}
                footer={
                    <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                        <Space>
                            <Button
                                size='small'
                                onClick={onDeliveryFormInputSubmit}
                                type='primary'
                                disabled={deliveryFormInputIsDisabled}
                                loading={deliveryFormInputIsLoading}
                            >
                                Submit
                            </Button>
                        </Space>
                    </div>
                }
            >
                <Skeleton loading={deliveryFormInputIsLoading}>
                    <DeliveryFormCreate
                        form={deliveryForm}
                        name='deliveryForm'
                        order={deliveryFormPayload}
                        extra={deliveryFormMeta}
                        isLoadingExtra={deliveryFormMetaIsLoading}
                        isDisabled={deliveryFormInputIsLoading}
                        isLoading={deliveryFormInputIsLoading}
                        onFinish={onDeliveryFormInputFinish}
                    />
                </Skeleton>
            </Drawer>

            <Drawer
                width='75vw'
                title='Stage order'
                visible={deliveryStageFormIsVisible}
                maskClosable={!deliveryStageFormInputIsLoading}
                headerStyle={{ display: 'none' }}
                onClose={onDeliveryStageFormHide}
                afterVisibleChange={onDeliveryStageFormVisibleChanges}
                footer={
                    <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                        {deliveryStageFormStep === DeliveryStageFormStep.INPUT && (
                            <Space>
                                <Button
                                    size='small'
                                    onClick={onDeliveryStageFormInputSubmit}
                                    type='primary'
                                    disabled={deliveryStageFormInputIsDisabled}
                                    loading={deliveryStageFormInputIsLoading}
                                >
                                    Submit
                                </Button>
                            </Space>
                        )}
                        {deliveryStageFormStep === DeliveryStageFormStep.REVIEW && (
                            <Space>
                                <Button
                                    size='small'
                                    onClick={onDeliveryStageFormReviewEdit}
                                    disabled={deliveryStageFormInputIsDisabled}
                                    loading={deliveryStageFormInputIsLoading}
                                >
                                    Edit
                                </Button>
                                <Button
                                    size='small'
                                    onClick={onDeliveryStageFormReviewSubmit}
                                    type='primary'
                                    disabled={
                                        deliveryStageFormReviewPayload &&
                                        !deliveryStageFormReviewPayload.isValid
                                    }
                                    loading={deliveryStageFormReviewIsLoading}
                                >
                                    Submit
                                </Button>
                            </Space>
                        )}
                        {deliveryStageFormStep === DeliveryStageFormStep.DONE && (
                            <Space>
                                <Button size='small' onClick={onDeliveryStageFormDoneClose}>
                                    Close
                                </Button>
                            </Space>
                        )}
                    </div>
                }
            >
                <Steps current={deliveryStageFormStep} size='small'>
                    <Steps.Step title='Input' />
                    <Steps.Step
                        title='Preview'
                        icon={deliveryStageFormReviewIsLoading ? <LoadingOutlined /> : undefined}
                    />
                    <Steps.Step title='Done' />
                </Steps>
                <Divider />
                {deliveryStageFormStep === DeliveryStageFormStep.INPUT && (
                    <Skeleton loading={deliveryStageFormInputIsLoading}>
                        <DeliveryStageFormCreate
                            form={deliveryStageForm}
                            name='deliveryStageForm'
                            payload={deliveryStageFormPayload}
                            serialable={deliveryStageFormSerialable}
                            meta={deliveryStageFormMeta}
                            isDisabled={deliveryStageFormInputIsLoading}
                            isLoading={deliveryStageFormInputIsLoading}
                            onFinish={onDeliveryStageFormInputFinish}
                            onSerialableChange={onDeliveryStageFormSerialableChange}
                        />
                    </Skeleton>
                )}
                {deliveryStageFormStep === DeliveryStageFormStep.REVIEW && (
                    <Skeleton loading={deliveryStageFormReviewIsLoading}>
                        <DeliveryStageFormReview
                            payload={deliveryStageFormReviewPayload}
                            orderPayload={deliveryStageFormPayload}
                            orderMeta={deliveryStageFormMeta}
                        />
                    </Skeleton>
                )}
                {deliveryStageFormStep === DeliveryStageFormStep.DONE && (
                    <Result
                        title='Submitted succesfully'
                        extra={[
                            <Button
                                size='small'
                                type='primary'
                                onClick={onDeliveryStageFormDoneClose}
                            >
                                Finish
                            </Button>,
                            <Button size='small' onClick={onDeliveryStageFormDoneAgain}>
                                Input Another
                            </Button>,
                        ]}
                    />
                )}
            </Drawer>
        </div>
    );
};

export default OrderPage;
