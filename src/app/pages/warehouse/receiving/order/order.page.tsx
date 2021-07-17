import React from 'react';
import QRCode from 'qrcode.react';

import { LoadingOutlined } from '@ant-design/icons';
import { Button, Divider, Drawer, PageHeader, Skeleton, Result, Space, Steps } from 'antd';

import PageBreadcrumb from 'src/app/component/page-breadcrumb.component';

import DeliveryFormCreate from './delivery.form.create';
import DeliveryFormReview from './delivery.form.review';
import OrderDetail from './order.detail';
import pageheader from './order.pageheader';
import usePresenter, { DeliveryFormStep } from './order.presenter';
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
        deliveryFormStep,
        deliveryFormIsVisible,
        deliveryFormInputIsLoading,
        deliveryFormInputIsDisabled,
        deliveryFormReviewIsLoading,
        deliveryFormReviewPayload,
        deliveryFormUploadComponent,
        deliveryFormUploadIsDisabled,
        onOrderTableSearch,
        onOrderTableRefresh,
        onOrderTableDetailClick,
        onOrderTableDeliveryClick,
        onOrderDetailHide,
        onOrderDetailIdClick,
        onOrderDetailIdHide,
        onDeliveryFormHide,
        onDeliveryFormInputFinish,
        onDeliveryFormInputSubmit,
        onDeliveryFormReviewEdit,
        onDeliveryFormReviewSubmit,
        onDeliveryFormDoneAgain,
        onDeliveryFormDoneClose,
        onDeliveryFormVisibleChanges,
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
                        onClickDelivery={onOrderTableDeliveryClick}
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
                            detailIsLoading={orderDetailMetaIsLoading}
                            detailMeta={orderDetailMeta}
                            detailPayload={orderDetailPayload}
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
                title='Receive order'
                visible={deliveryFormIsVisible}
                maskClosable={!deliveryFormInputIsLoading}
                headerStyle={{ display: 'none' }}
                onClose={onDeliveryFormHide}
                afterVisibleChange={onDeliveryFormVisibleChanges}
                footer={
                    <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                        {deliveryFormStep === DeliveryFormStep.INPUT && (
                            <Space>
                                <Button
                                    size='small'
                                    onClick={onDeliveryFormInputSubmit}
                                    type='primary'
                                    disabled={deliveryFormInputIsDisabled}
                                    loading={deliveryFormInputIsLoading}
                                >
                                    Review
                                </Button>
                            </Space>
                        )}
                        {deliveryFormStep === DeliveryFormStep.REVIEW && (
                            <Space>
                                <Button
                                    size='small'
                                    onClick={onDeliveryFormReviewEdit}
                                    disabled={deliveryFormInputIsDisabled}
                                    loading={deliveryFormInputIsLoading}
                                >
                                    Edit
                                </Button>
                                <Button
                                    size='small'
                                    onClick={onDeliveryFormReviewSubmit}
                                    type='primary'
                                    disabled={
                                        deliveryFormReviewPayload &&
                                        !deliveryFormReviewPayload.isValid
                                    }
                                    loading={deliveryFormReviewIsLoading}
                                >
                                    Submit
                                </Button>
                            </Space>
                        )}
                        {deliveryFormStep === DeliveryFormStep.DONE && (
                            <Space>
                                <Button size='small' onClick={onDeliveryFormDoneClose}>
                                    Close
                                </Button>
                            </Space>
                        )}
                    </div>
                }
            >
                <Steps current={deliveryFormStep} size='small'>
                    <Steps.Step title='Input' />
                    <Steps.Step
                        title='Preview'
                        icon={deliveryFormReviewIsLoading ? <LoadingOutlined /> : undefined}
                    />
                    <Steps.Step title='Done' />
                </Steps>
                <Divider />
                {deliveryFormStep === DeliveryFormStep.INPUT && (
                    <Skeleton loading={deliveryFormInputIsLoading}>
                        <DeliveryFormCreate
                            form={deliveryForm}
                            payload={deliveryFormPayload}
                            meta={deliveryFormMeta}
                            uploadComponent={deliveryFormUploadComponent}
                            name='deliveryForm'
                            isUploadDisabled={deliveryFormUploadIsDisabled}
                            isDisabled={deliveryFormInputIsLoading}
                            isLoading={deliveryFormInputIsLoading}
                            onFinish={onDeliveryFormInputFinish}
                        />
                    </Skeleton>
                )}
                {deliveryFormStep === DeliveryFormStep.REVIEW && (
                    <Skeleton loading={deliveryFormReviewIsLoading}>
                        <DeliveryFormReview
                            payload={deliveryFormReviewPayload}
                            orderPayload={deliveryFormPayload}
                            orderMeta={deliveryFormMeta}
                        />
                    </Skeleton>
                )}
                {deliveryFormStep === DeliveryFormStep.DONE && (
                    <Result
                        title='Submitted succesfully'
                        extra={[
                            <Button size='small' type='primary' onClick={onDeliveryFormDoneClose}>
                                Finish
                            </Button>,
                            <Button size='small' onClick={onDeliveryFormDoneAgain}>
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
