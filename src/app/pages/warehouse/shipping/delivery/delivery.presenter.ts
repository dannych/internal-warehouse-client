import { useCallback, useRef, useState, useEffect } from 'react';

import { Form } from 'antd';
import { stringify } from 'qs';

import { useApi } from 'src/core/network/lib/useApi';

import paginate from 'src/app/helper/pagination/paginate';
import date from 'src/app/helper/format/date';

import { DeliveryListItem } from './delivery.interface';

export enum DeliveryScanFormStep {
    INPUT = 0,
    REVIEW = 1,
    DONE = 2,
}

export default () => {
    const {
        loading: deliveryReadManyIsLoading,
        data: deliveryReadManyData,
        cache: deliveryReadManyCache,
        get: deliveryReadMany,
    } = useApi('/shipping-deliveries');
    const {
        loading: deliveryReadOneIsLoading,
        data: deliveryReadOneData,
        get: deliveryReadOne,
        abort: deliveryReadOneAbort,
    } = useApi('/shipping-deliveries');
    const { loading: deliveryCreateOneScanIsLoading, post: deliveryCreateOneScan } = useApi(
        '/shipping-deliveries'
    );
    const { loading: deliveryCreateOneConfirmIsLoading, post: deliveryCreateOneConfirm } = useApi(
        '/shipping-deliveries'
    );

    const [deliveryDetailData, deliveryDetailSetData] = useState<DeliveryListItem | void>(
        undefined
    );
    const [orderTableQuery, orderTableSetQuery] = useState<any>({ status: ['delivery_initiated'] });

    const [deliveryScanForm] = Form.useForm();
    const [deliveryScanFormStep, deliveryScanFormSetStep] = useState(DeliveryScanFormStep.INPUT);
    const [deliveryScanFormPayload, deliveryScanFormSetPayload] = useState<any>();
    const [deliveryScanFormMeta, deliveryScanFormSetMeta] = useState<any>();
    const [deliveryScanFormIsVisible, deliveryScanFormSetIsVisible] = useState<boolean>();
    const deliveryScanFormHasSubmmited = useRef<boolean>();
    const [deliveryScanFormReviewPayload, deliveryScanFormReviewSetPayload] = useState<any>();

    const [deliveryConfirmForm] = Form.useForm();
    const [deliveryConfirmFormPayload, deliveryConfirmFormSetPayload] = useState<any>();
    const [deliveryConfirmFormIsVisible, deliveryConfirmFormSetIsVisible] = useState<boolean>();

    const productsValue = (deliveryScanForm.getFieldValue('products') || []) as any[];
    const [serialable, setSerialable] = useState<{ [x: string]: boolean }>(
        productsValue.reduce(
            (result, val, i) => ({ ...result, [i]: !!val && val.productSerialable }),
            {}
        )
    );

    const deliveryReadManyFilter = useCallback(
        (query?: object) => {
            deliveryReadMany(
                stringify(
                    { sort: 'postId_desc', ...query },
                    { skipNulls: true, addQueryPrefix: true }
                )
            );
        },
        [deliveryReadMany]
    );

    const orderReadManyWithCurrentQuery = useCallback(() => {
        deliveryReadManyFilter(orderTableQuery);
    }, [deliveryReadManyFilter, orderTableQuery]);

    const onDeliveryTableSearch = useCallback(
        (pagination, query: { [x: string]: any }) => {
            deliveryReadManyFilter({ page: pagination.current, ...query });
            orderTableSetQuery({ ...query, page: pagination.current });
        },
        [deliveryReadManyFilter, orderTableSetQuery]
    );

    const onDeliveryTableDetailClick = useCallback(
        (listItem: DeliveryListItem) => {
            deliveryDetailSetData(listItem);
            deliveryReadOneAbort();
            deliveryReadOne(`/${listItem._id}`);
        },
        [deliveryReadOneAbort, deliveryReadOne]
    );

    const onDeliveryDetailHide = useCallback(() => {
        deliveryDetailSetData(undefined);
    }, []);

    const onDeliveryTableRefresh = useCallback(() => {
        deliveryReadManyCache.clear();
        orderReadManyWithCurrentQuery();
    }, [deliveryReadManyCache, orderReadManyWithCurrentQuery]);

    const onDeliveryTableScanClick = useCallback(
        (listItem: DeliveryListItem) => {
            deliveryScanFormSetIsVisible(true);
            deliveryScanFormSetPayload(listItem);
            deliveryScanForm.setFieldsValue({
                id: listItem._id,
                products: listItem.products.map((product) => ({
                    deliveryProductSid: product._sid,
                    productId: product.pin || product.type,
                })),
                createdAt: date(listItem.createdAt),
            });
            deliveryReadOne(`/${listItem._id}`).then(({ error, meta }) => {
                if (error) return;
                deliveryScanFormSetMeta(meta);
            });
        },
        [deliveryScanForm, deliveryReadOne]
    );

    const onDeliveryTableConfirmClick = useCallback(
        (listItem: DeliveryListItem) => {
            deliveryConfirmFormSetPayload(listItem);
            deliveryConfirmForm.setFieldsValue({
                _id: listItem._id,
                referencePostId: listItem.orderPriorPostId,
                referencePaperId: listItem.orderPriorPaperId,
                createdAt: date(listItem.createdAt),
            });
            deliveryConfirmFormSetIsVisible(true);
        },
        [deliveryConfirmForm]
    );

    // delivery scan

    const onDeliveryScanFormInputSubmit = useCallback(() => {
        deliveryScanForm.submit();
    }, [deliveryScanForm]);

    const onDeliveryScanFormInputFinish = useCallback(
        (values: any) => {
            const orderProductCounts = deliveryScanFormPayload.products.reduce(
                (result: { [x: string]: number }, product: any) => ({
                    ...result,
                    [product._sid]: (result[product._sid] || 0) + product.quantity,
                }),
                {}
            );
            const sourcingProductCounts = deliveryScanFormMeta.sourcing
                ? deliveryScanFormMeta.sourcing.products.reduce(
                      (result: { [x: string]: number }, product: any) => ({
                          ...result,
                          [product._sid]: (result[product._sid] || 0) + product.quantity,
                      }),
                      {}
                  )
                : {};

            const products = values.products
                .filter(
                    (product: any) => !!product && (!!product.productSns || !!product.productLot)
                )
                .map((product: any) => {
                    const sns = (product.productSns || '').trim().split('\n');
                    const lots = (product.productLot || '')
                        .trim()
                        .split('\n')
                        .map((x: string) => x.trim());
                    const lotCount = lots.reduce(
                        (result: any, lot: string) => ({
                            ...result,
                            [lot]: (result[lot] || 0) + 1,
                        }),
                        {}
                    );
                    const lotFinal = Object.keys(lotCount).map((key) => ({
                        lot: key,
                        quantity: lotCount[key],
                    }));
                    const quantityRemaining = orderProductCounts[product.deliveryProductSid];

                    const hasId = !!orderProductCounts[product.deliveryProductSid];
                    const serialable = product.productSerialable !== false;
                    const length = serialable ? sns.length : lots.length;
                    const hasLimit = length <= quantityRemaining;
                    return {
                        deliveryProductSid: product.deliveryProductSid,
                        sku: product.productSku,
                        serialable,
                        lots: lotFinal,
                        quantity: length,
                        quantityRemaining,
                        sns,
                        isValid: hasLimit && hasId,
                        hasId,
                        hasLimit,
                    };
                })
                .filter((product: any) => product.quantity);

            const sourcedProducts = values.sourcingProducts
                .reduce((result: any, sProducts: any) => {
                    return (sProducts || [])
                        .filter(
                            (product: any) =>
                                !!product && (!!product.productSns || !!product.productLot)
                        )
                        .reduce((subResult: any, product: any) => {
                            const sns = (product.productSns || '').trim().split('\n');
                            const lots = (product.productLot || '')
                                .trim()
                                .split('\n')
                                .map((x: string) => x.trim());
                            const lotCount = lots.reduce(
                                (result: any, lot: string) => ({
                                    ...result,
                                    [lot]: (result[lot] || 0) + 1,
                                }),
                                {}
                            );
                            const lotFinal = Object.keys(lotCount).map((key) => ({
                                lot: key,
                                quantity: lotCount[key],
                            }));
                            const quantityRemaining =
                                sourcingProductCounts[product.sourcingProductSid];

                            const hasId = !!sourcingProductCounts[product.sourcingProductSid];
                            const serialable = product.productSerialable !== false;
                            const length = serialable ? sns.length : lots.length;
                            const hasLimit = length <= quantityRemaining;
                            return [
                                ...subResult,
                                {
                                    sourcingProductSid: product.sourcingProductSid,
                                    deliveryProductSid: product.deliveryProductSid,
                                    sku: product.productSku,
                                    serialable,
                                    lots: lotFinal,
                                    quantity: length,
                                    quantityRemaining,
                                    sns,
                                    isValid: hasLimit && hasId,
                                    hasId,
                                    hasLimit,
                                },
                            ];
                        }, result);
                }, [])
                .filter((product: any) => product.quantity);

            const extraProducts = values.extraProducts
                .reduce((result: any, sProducts: any) => {
                    return (sProducts || [])
                        .filter(
                            (product: any) =>
                                !!product && (!!product.productSns || !!product.productLot)
                        )
                        .reduce((subResult: any, product: any) => {
                            const sns = (product.productSns || '')
                                .trim()
                                .split('\n')
                                .filter((x: string) => !!x);

                            const lots = (product.productLot || '')
                                .trim()
                                .split('\n')
                                .map((x: string) => x.trim());
                            const lotCount = lots.reduce(
                                (result: any, lot: string) => ({
                                    ...result,
                                    [lot]: (result[lot] || 0) + 1,
                                }),
                                {}
                            );
                            const lotFinal = Object.keys(lotCount).map((key) => ({
                                lot: key,
                                quantity: lotCount[key],
                            }));

                            const hasId = true;
                            const serialable = product.productSerialable !== false;
                            const length = serialable ? sns.length : lots.length;
                            const hasLimit = true;
                            return [
                                ...subResult,
                                {
                                    deliveryProductSid: product.deliveryProductSid,
                                    sku: product.productSku,
                                    serialable,
                                    lots: lotFinal,
                                    quantity: length,
                                    quantityRemaining: 0,
                                    sns,
                                    isValid: hasLimit && hasId && length > 0,
                                    hasId,
                                    hasLimit,
                                },
                            ];
                        }, result);
                }, [])
                .filter((product: any) => product.quantity);

            const otherProducts = values.otherProducts
                .reduce((result: any, sProducts: any) => {
                    return (sProducts || [])
                        .filter(
                            (product: any) =>
                                !!product && (!!product.productSns || !!product.productLot)
                        )
                        .reduce((subResult: any, product: any) => {
                            const sns = (product.productSns || '')
                                .trim()
                                .split('\n')
                                .filter((x: string) => !!x);
                            const lots = (product.productLot || '')
                                .trim()
                                .split('\n')
                                .map((x: string) => x.trim());
                            const lotCount = lots.reduce(
                                (result: any, lot: string) => ({
                                    ...result,
                                    [lot]: (result[lot] || 0) + 1,
                                }),
                                {}
                            );
                            const lotFinal = Object.keys(lotCount).map((key) => ({
                                lot: key,
                                quantity: lotCount[key],
                            }));

                            const hasId = true;
                            const serialable = product.productSerialable !== false;
                            const length = serialable ? sns.length : lots.length;
                            const hasLimit = true;
                            return [
                                ...subResult,
                                {
                                    deliveryProductSid: product.deliveryProductSid,
                                    sku: product.productSku,
                                    serialable,
                                    name: product.productName,
                                    lots: lotFinal,
                                    quantity: length,
                                    quantityRemaining: 0,
                                    sns,
                                    isValid: hasLimit && hasId && length > 0,
                                    hasId,
                                    hasLimit,
                                },
                            ];
                        }, result);
                }, [])
                .filter((product: any) => product.quantity);

            const isValid = products.reduce(
                (result: boolean, product: { isValid: boolean }) => result && product.isValid,
                true
            );

            deliveryScanFormReviewSetPayload({
                id: values.id,
                isValid,
                customerShippingPaperId: values.shippingPaperId,
                products,
                sourcedProducts,
                extraProducts,
                otherProducts,
                createdAt: values.createdAt,
            });

            deliveryScanFormSetStep(DeliveryScanFormStep.REVIEW);
        },
        [deliveryScanFormPayload, deliveryScanFormMeta]
    );

    const onDeliveryScanFormVisibleChanges = useCallback(
        (visible: boolean) => {
            if (!visible) {
                deliveryScanFormSetStep(DeliveryScanFormStep.INPUT);
                if (deliveryScanFormHasSubmmited.current) {
                    deliveryReadManyCache.clear();
                    orderReadManyWithCurrentQuery();
                    deliveryScanFormHasSubmmited.current = false;
                }
            }
        },
        [orderReadManyWithCurrentQuery, deliveryReadManyCache]
    );

    const onDeliveryScanFormReviewEdit = useCallback(() => {
        deliveryScanFormSetStep(DeliveryScanFormStep.INPUT);
    }, []);

    const onDeliveryScanFormReviewSubmit = useCallback(() => {
        deliveryCreateOneScan(`${deliveryScanFormReviewPayload.id}/scan`, {
            createdAt: deliveryScanFormReviewPayload.createdAt,
            customerShippingPaperId: deliveryScanFormReviewPayload.customerShippingPaperId,
            representativeCode: 'sudar',
            representativeName: 'Sudar',
            products: deliveryScanFormReviewPayload.products.map((product: any) => ({
                deliveryProductSid: product.deliveryProductSid,
                ...(product.serialable
                    ? {
                          sns: product.sns,
                          quantity: product.quantity,
                      }
                    : {
                          lots: product.lots,
                          quantity: product.quantity,
                      }),
            })),
            sourcingProducts: deliveryScanFormReviewPayload.sourcedProducts.map((product: any) => ({
                deliveryProductSid: product.deliveryProductSid,
                sourcingProductSid: product.sourcingProductSid,
                ...(product.serialable
                    ? {
                          sns: product.sns,
                          quantity: product.quantity,
                      }
                    : {
                          lot: product.lots,
                          quantity: product.quantity,
                      }),
            })),
            extraProducts: deliveryScanFormReviewPayload.extraProducts.map((product: any) => ({
                deliveryProductSid: product.deliveryProductSid,
                ...(product.serialable
                    ? {
                          sns: product.sns,
                          quantity: product.quantity,
                      }
                    : {
                          lot: product.lots,
                          quantity: product.quantity,
                      }),
            })),
            otherProducts: deliveryScanFormReviewPayload.otherProducts.map((product: any) => ({
                deliveryProductSid: product.deliveryProductSid,
                name: product.name,
                ...(product.serialable
                    ? {
                          sns: product.sns,
                          quantity: product.quantity,
                      }
                    : {
                          lot: product.lots,
                          quantity: product.quantity,
                      }),
            })),
        }).then(({ error }) => {
            if (error) return;
            setSerialable({});
            deliveryScanFormHasSubmmited.current = true;
            deliveryScanForm.resetFields();
            deliveryScanFormSetStep(DeliveryScanFormStep.DONE);
        });
    }, [deliveryScanForm, deliveryCreateOneScan, deliveryScanFormReviewPayload]);

    const onDeliveryScanFormDoneClose = useCallback(() => {
        deliveryScanFormSetIsVisible(false);
    }, []);

    const onDeliveryScanFormDoneAgain = useCallback(() => {
        deliveryScanFormSetStep(DeliveryScanFormStep.INPUT);
    }, []);

    const onDeliveryScanFormHide = useCallback(() => {
        deliveryScanFormSetIsVisible(false);
    }, []);

    // Confirm

    const onDeliveryConfirmFormHide = useCallback(() => {
        deliveryConfirmFormSetIsVisible(false);
    }, []);

    const onDeliveryConfirmFormInputSubmit = useCallback(() => {
        deliveryConfirmForm.submit();
    }, [deliveryConfirmForm]);

    const onDeliveryConfirmFormInputFinish = useCallback(
        (values: any) => {
            deliveryCreateOneConfirm(`${values._id}/confirm`, {
                createdAt: values.createdAt,
            }).then((payload) => {
                if (!payload || payload.error) return;
                deliveryConfirmFormSetIsVisible(false);
                deliveryReadManyCache.clear();
                orderReadManyWithCurrentQuery();
            });
        },
        [deliveryCreateOneConfirm, orderReadManyWithCurrentQuery, deliveryReadManyCache]
    );

    useEffect(() => {
        orderReadManyWithCurrentQuery();
    }, [orderReadManyWithCurrentQuery]);

    return {
        deliveryTablePayload: deliveryReadManyData?.payload || [],
        deliveryTableIsLoading: deliveryReadManyIsLoading,
        deliveryTableActionIsDisabled: deliveryCreateOneScanIsLoading || deliveryReadManyIsLoading,
        deliveryTablePagination: paginate(deliveryReadManyData?.meta.pagination),
        deliveryDetailPayload: deliveryDetailData,
        deliveryDetailMeta: deliveryReadOneData?.meta,
        deliveryDetailMetaIsLoading: deliveryReadOneIsLoading,
        deliveryDetailIsVisible: !!deliveryDetailData,
        deliveryScanForm,
        deliveryScanFormSerialable: serialable,
        deliveryScanFormPayload,
        deliveryScanFormMeta,
        deliveryScanFormStep,
        deliveryScanFormIsVisible,
        deliveryScanFormInputIsLoading: false,
        deliveryScanFormInputIsDisabled: deliveryReadOneIsLoading,
        deliveryScanFormReviewIsLoading: deliveryCreateOneScanIsLoading,
        deliveryConfirmForm,
        deliveryConfirmFormPayload,
        deliveryConfirmFormIsVisible,
        deliveryConfirmFormIsLoading: deliveryCreateOneConfirmIsLoading,
        deliveryScanFormReviewPayload,
        onDeliveryTableRefresh,
        onDeliveryTableSearch,
        onDeliveryTableDetailClick,
        onDeliveryTableConfirmClick,
        onDeliveryTableScanClick,
        onDeliveryDetailHide,
        onDeliveryScanFormHide,
        onDeliveryScanFormSerialableChange: setSerialable,
        onDeliveryScanFormInputSubmit,
        onDeliveryScanFormInputFinish,
        onDeliveryScanFormReviewEdit,
        onDeliveryScanFormReviewSubmit,
        onDeliveryScanFormDoneClose,
        onDeliveryScanFormDoneAgain,
        onDeliveryScanFormVisibleChanges,
        onDeliveryConfirmFormHide,
        onDeliveryConfirmFormInputSubmit,
        onDeliveryConfirmFormInputFinish,
    };
};
