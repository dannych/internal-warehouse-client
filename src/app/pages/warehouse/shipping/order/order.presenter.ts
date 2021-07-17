import { useCallback, useEffect, useRef, useState } from 'react';

import { Form } from 'antd';
import { stringify } from 'qs';

import { useApi } from 'src/core/network/lib/useApi';

import paginate from 'src/app/helper/pagination/paginate';
import date from 'src/app/helper/format/date';

import { OrderListItem } from './order.interface';

export enum DeliveryStageFormStep {
    INPUT = 0,
    REVIEW = 1,
    DONE = 2,
}

export default () => {
    const {
        loading: orderReadManyIsLoading,
        data: orderReadManyData,
        cache: orderReadManyCache,
        get: orderReadMany,
    } = useApi('/shipping-orders');
    const {
        loading: orderReadOneIsLoading,
        data: orderReadOneData,
        get: orderReadOne,
        abort: orderReadOneAbort,
    } = useApi('/shipping-orders');
    const { loading: orderCreateOneDeliveryIsLoading, post: orderCreateOneDelivery } =
        useApi('/shipping-orders');
    const { loading: orderCreateOnePackageIsLoading, post: orderCreateOnePackage } =
        useApi('/shipping-orders');

    const [orderDetailShowCode, orderDetailSetShowCode] = useState<boolean>(false);
    const [orderTableQuery, orderTableSetQuery] = useState<any>({ status: ['order_initiated'] });

    const [orderDetailData, orderDetailSetData] = useState<OrderListItem | void>(undefined);
    const orderReadManyFilter = useCallback(
        (query?: object) => {
            orderReadMany(
                stringify(
                    { sort: 'postId_desc', ...query },
                    { skipNulls: true, addQueryPrefix: true }
                )
            );
        },
        [orderReadMany]
    );
    const orderReadManyWithCurrentQuery = useCallback(() => {
        orderReadManyFilter(orderTableQuery);
    }, [orderReadManyFilter, orderTableQuery]);

    const [deliveryForm] = Form.useForm();
    const [deliveryFormPayload, deliveryFormSetPayload] = useState<any>();
    const [deliveryFormMeta, deliveryFormSetMeta] = useState<any>();
    const [deliveryFormIsVisible, deliveryFormSetIsVisible] = useState<boolean>();
    const deliveryFormHasSubmmited = useRef<boolean>();

    const [deliveryStageForm] = Form.useForm();
    const [deliveryStageFormStep, deliveryStageFormSetStep] = useState(DeliveryStageFormStep.INPUT);
    const [deliveryStageFormPayload, deliveryStageFormSetPayload] = useState<any>();
    const [deliveryStageFormMeta, deliveryStageFormSetMeta] = useState<any>();
    const [deliveryStageFormIsVisible, deliveryStageFormSetIsVisible] = useState<boolean>();
    const deliveryStageFormHasSubmmited = useRef<boolean>();
    const [deliveryStageFormReviewPayload, deliveryStageFormReviewSetPayload] = useState<any>();

    const productsValue = (deliveryStageForm.getFieldValue('products') || []) as any[];
    const [serialable, setSerialable] = useState<{ [x: string]: boolean }>(
        productsValue.reduce(
            (result, val, i) => ({ ...result, [i]: !!val && val.productSerialable }),
            {}
        )
    );

    const onOrderTableStageClick = useCallback(
        (listItem: OrderListItem) => {
            deliveryStageFormSetIsVisible(true);
            deliveryStageFormSetPayload(listItem);
            deliveryStageForm.setFieldsValue({
                id: listItem._id,
                referencePostId: listItem.priorPostId,
                referencePaperId: listItem.priorPaperId,
                products: listItem.products.map((product) => ({
                    deliveryProductSid: product._sid,
                    productId: product.pin || product.type,
                    productQuantity: product.quantity,
                })),
                createdAt: date(listItem.createdAt),
            });
            orderReadOne(`/${listItem._id}`).then(({ error, meta }) => {
                if (error) return;
                deliveryStageFormSetMeta(meta);
                const totalDispatchQuantityMapper = (meta?.shippings || [])
                    .filter((x: any) => !!x)
                    .reduce((index: any, dispatch: any) => {
                        const result = dispatch.products.reduce(
                            (indexProduct: any, product: any) => ({
                                ...indexProduct,
                                [product._sid]:
                                    (indexProduct[product._sid] || 0) + product.quantity,
                            }),
                            index
                        );
                        return {
                            ...index,
                            ...result,
                        };
                    }, {});

                deliveryStageForm.setFieldsValue({
                    products: listItem.products.map((product) => ({
                        deliveryProductSid: product._sid,
                        productId: product.pin || product.type,
                        productQuantity:
                            product.quantity - (totalDispatchQuantityMapper[product._sid] || 0),
                    })),
                });
            });
        },
        [deliveryStageForm, orderReadOne]
    );

    const onOrderTableSearch = useCallback(
        (pagination, query: { [x: string]: any }) => {
            orderReadManyFilter({ page: pagination.current, ...query });
            orderTableSetQuery({ ...query, page: pagination.current });
        },
        [orderReadManyFilter]
    );

    const onOrderTableDetailClick = useCallback(
        (listItem: OrderListItem) => {
            orderDetailSetData(listItem);
            orderReadOneAbort();
            orderReadOne(`/${listItem._id}`);
        },
        [orderReadOneAbort, orderReadOne]
    );

    const onOrderTableDeliveryClick = useCallback(
        (listItem: OrderListItem) => {
            orderReadOneAbort();
            deliveryForm.setFieldsValue({
                id: listItem._id,
                products: listItem.products.map((product) => ({
                    productSid: product._sid,
                    quantity: 0,
                })),
                createdAt: date(listItem.createdAt),
            });
            deliveryFormSetPayload(listItem);
            deliveryFormSetIsVisible(true);
            orderReadOne(`/${listItem._id}`).then(({ error, meta }) => {
                if (error) return;
                deliveryFormSetMeta(meta);
            });
        },
        [deliveryForm, orderReadOne, orderReadOneAbort]
    );

    const onOrderTableRefresh = useCallback(() => {
        orderReadManyCache.clear();
        orderReadManyWithCurrentQuery();
    }, [orderReadManyCache, orderReadManyWithCurrentQuery]);

    const onOrderDetailIdClick = useCallback(() => {
        orderDetailSetShowCode(true);
    }, []);

    const onOrderDetailIdHide = useCallback(() => {
        orderDetailSetShowCode(false);
    }, []);

    const onOrderDetailHide = useCallback(() => {
        orderDetailSetData(undefined);
    }, []);

    // delivery

    const onDeliveryFormInputSubmit = useCallback(() => {
        deliveryForm.submit();
    }, [deliveryForm]);

    const onDeliveryFormInputFinish = useCallback(
        (values: any) => {
            orderCreateOneDelivery(`${values.id}/deliver`, {
                deliveryPaperId: values.paperId,
                products: values.products
                    .filter((x: any) => !!x && x.quantity)
                    .map((product: any) => ({
                        orderProductSid: product.productSid,
                        quantity: product.quantity,
                    })),
                createdAt: values.createdAt,
            }).then(({ error }) => {
                if (error) return;
                deliveryFormHasSubmmited.current = true;
                deliveryForm.resetFields();
                deliveryFormSetIsVisible(false);
            });
        },
        [orderCreateOneDelivery, deliveryForm]
    );

    const onDeliveryFormVisibleChanges = useCallback(
        (visible: boolean) => {
            if (!visible) {
                if (deliveryFormHasSubmmited.current) {
                    orderReadManyCache.clear();
                    orderReadManyWithCurrentQuery();
                    deliveryFormHasSubmmited.current = false;
                }
            }
        },
        [orderReadManyWithCurrentQuery, orderReadManyCache]
    );

    const onDeliveryFormHide = useCallback(() => {
        deliveryFormSetIsVisible(false);
    }, []);

    // Stage

    const onDeliveryStageFormInputSubmit = useCallback(() => {
        deliveryStageForm.submit();
    }, [deliveryStageForm]);

    const onDeliveryStageFormInputFinish = useCallback(
        (values: any) => {
            const orderProductCounts = deliveryStageFormPayload.products.reduce(
                (result: { [x: string]: number }, product: any) => ({
                    ...result,
                    [product._sid]: (result[product._sid] || 0) + product.quantity,
                }),
                {}
            );

            const products = values.products
                .filter(
                    (product: any) => !!product && (!!product.productSns || !!product.productLot)
                )
                .map((product: any) => {
                    const sns = (product.productSns || '')
                        .trim()
                        .split('\n')
                        .map((x: string) => x.trim())
                        .filter((x: string) => !!x)
                        .filter((v: string, i: number, a: string[]) => a.indexOf(v) === i);
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
                                .map((x: string) => x.trim())
                                .filter((x: string) => !!x)
                                .filter((v: string, i: number, a: string[]) => a.indexOf(v) === i);

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
                                .map((x: string) => x.trim())
                                .filter((x: string) => !!x)
                                .filter((v: string, i: number, a: string[]) => a.indexOf(v) === i);
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

            deliveryStageFormReviewSetPayload({
                id: values.id,
                isValid,
                customerShippingPaperId: values.shippingPaperId,
                products,
                extraProducts,
                otherProducts,
                createdAt: values.createdAt,
            });

            deliveryStageFormSetStep(DeliveryStageFormStep.REVIEW);
        },
        [deliveryStageFormPayload]
    );

    const onDeliveryStageFormVisibleChanges = useCallback(
        (visible: boolean) => {
            if (!visible) {
                deliveryStageFormSetStep(DeliveryStageFormStep.INPUT);
                if (deliveryStageFormHasSubmmited.current) {
                    orderReadManyCache.clear();
                    orderReadManyWithCurrentQuery();
                    deliveryStageFormHasSubmmited.current = false;
                }
            }
        },
        [orderReadManyWithCurrentQuery, orderReadManyCache]
    );

    const onDeliveryStageFormReviewEdit = useCallback(() => {
        deliveryStageFormSetStep(DeliveryStageFormStep.INPUT);
    }, []);

    const onDeliveryStageFormReviewSubmit = useCallback(() => {
        orderCreateOnePackage(`${deliveryStageFormReviewPayload.id}/package`, {
            createdAt: deliveryStageFormReviewPayload.createdAt,
            customerShippingPaperId: deliveryStageFormReviewPayload.customerShippingPaperId,
            representativeCode: 'sudar',
            representativeName: 'Sudar',
            products: deliveryStageFormReviewPayload.products.map((product: any) => ({
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
            sourcingProducts: [],
            extraProducts: deliveryStageFormReviewPayload.extraProducts.map((product: any) => ({
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
            otherProducts: deliveryStageFormReviewPayload.otherProducts.map((product: any) => ({
                deliveryProductSid: product.deliveryProductSid,
                name: product.name,
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
        }).then(({ error }) => {
            if (error) return;
            setSerialable({});
            deliveryStageFormHasSubmmited.current = true;
            deliveryStageForm.resetFields();
            deliveryStageFormSetStep(DeliveryStageFormStep.DONE);
        });
    }, [deliveryStageForm, orderCreateOnePackage, deliveryStageFormReviewPayload]);

    const onDeliveryStageFormDoneClose = useCallback(() => {
        deliveryStageFormSetIsVisible(false);
    }, []);

    const onDeliveryStageFormDoneAgain = useCallback(() => {
        deliveryStageFormSetStep(DeliveryStageFormStep.INPUT);
    }, []);

    const onDeliveryStageFormHide = useCallback(() => {
        deliveryStageFormSetIsVisible(false);
    }, []);

    useEffect(() => {
        orderReadManyWithCurrentQuery();
    }, [orderReadManyWithCurrentQuery]);

    return {
        orderTablePayload: orderReadManyData?.payload || [],
        orderTableIsLoading: orderReadManyIsLoading,
        orderTableActionIsDisabled: orderReadManyIsLoading,
        orderTablePagination: paginate(orderReadManyData?.meta.pagination),
        orderDetailPayload: orderDetailData,
        orderDetailMeta: orderReadOneData?.meta,
        orderDetailMetaIsLoading: orderReadOneIsLoading,
        orderDetailIsVisible: !!orderDetailData,
        orderDetailShowCode,
        deliveryForm,
        deliveryFormPayload,
        deliveryFormMeta,
        deliveryFormMetaIsLoading: orderReadOneIsLoading,
        deliveryFormIsVisible,
        deliveryFormInputIsLoading: false,
        deliveryFormInputIsDisabled: orderReadOneIsLoading || orderCreateOneDeliveryIsLoading,
        deliveryStageForm,
        deliveryStageFormSerialable: serialable,
        deliveryStageFormPayload,
        deliveryStageFormMeta,
        deliveryStageFormStep,
        deliveryStageFormIsVisible,
        deliveryStageFormInputIsLoading: false,
        deliveryStageFormInputIsDisabled: orderReadOneIsLoading,
        deliveryStageFormReviewIsLoading: orderCreateOnePackageIsLoading,
        deliveryStageFormReviewPayload,
        onOrderTableRefresh,
        onOrderTableSearch,
        onOrderTableDetailClick,
        onOrderTableDeliveryClick,
        onOrderTableStageClick,
        onOrderDetailHide,
        onOrderDetailIdClick,
        onOrderDetailIdHide,
        onDeliveryFormHide,
        onDeliveryFormInputSubmit,
        onDeliveryFormInputFinish,
        onDeliveryFormVisibleChanges,
        onDeliveryStageFormHide,
        onDeliveryStageFormSerialableChange: setSerialable,
        onDeliveryStageFormInputSubmit,
        onDeliveryStageFormInputFinish,
        onDeliveryStageFormReviewEdit,
        onDeliveryStageFormReviewSubmit,
        onDeliveryStageFormDoneClose,
        onDeliveryStageFormDoneAgain,
        onDeliveryStageFormVisibleChanges,
    };
};
