import { useCallback, useEffect, useRef, useState } from 'react';

import { Form } from 'antd';
import { stringify } from 'qs';

import { useApi } from 'src/core/network/lib/useApi';

import paginate from 'src/app/helper/pagination/paginate';
import date from 'src/app/helper/format/date';

import { useAntdUpload } from 'src/app/container/upload/useUpload';

import { OrderListItem } from './order.interface';

export enum DeliveryFormStep {
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
    } = useApi('/receiving-orders');
    const {
        loading: orderReadOneIsLoading,
        data: orderReadOneData,
        get: orderReadOne,
        abort: orderReadOneAbort,
    } = useApi('/receiving-orders');
    const { loading: orderCreateOneDeliveryIsLoading, post: orderCreateOneDelivery } = useApi(
        '/receiving-orders'
    );

    const [orderTableQuery, orderTableSetQuery] = useState<any>({ status: ['order_created'] });

    const [orderDetailShowCode, orderDetailSetShowCode] = useState<boolean>(false);
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
    const [deliveryFormStep, deliveryFormSetStep] = useState(DeliveryFormStep.INPUT);
    const [deliveryFormPayload, deliveryFormSetPayload] = useState<any>();
    const [deliveryFormMeta, deliveryFormSetMeta] = useState<any>();
    const [deliveryFormIsVisible, deliveryFormSetIsVisible] = useState<boolean>();
    const deliveryFormHasSubmmited = useRef<boolean>();
    const [deliveryFormReviewPayload, deliveryFormReviewSetPayload] = useState<any>();

    const {
        component: deliveryUploadComponent,
        isLoading: deliveryUploadIsDisabled,
        resetFileList: deliveryUploadReset,
    } = useAntdUpload({
        onFileListChange: (files) => {
            deliveryForm.setFieldsValue({ supplierPaperFile: files });
            console.log(files);
        },
    });

    const onOrderTableSearch = useCallback(
        (pagination, query: { [x: string]: any }) => {
            orderReadManyFilter({ page: pagination.current, ...query });
            orderTableSetQuery({ ...query, page: pagination.current });
        },
        [orderReadManyFilter, orderTableSetQuery]
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
            deliveryFormSetPayload(listItem);
            deliveryForm.setFieldsValue({
                id: listItem._id,
                products: listItem.products
                    .filter((x) => !!x)
                    .map((product) => ({
                        orderProductSid: product._sid,
                        productId: product.pin,
                    })),
                supplierSenderCode: listItem.supplierCode,
                supplierSenderName: listItem.supplierName,
                createdAt: date(listItem.createdAt),
            });
            deliveryFormSetIsVisible(true);
            orderReadOne(`/${listItem._id}`).then(({ error, meta }) => {
                if (error) return;
                const totalDispatchQuantityMapper = (meta?.deliveries || [])
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
                const products = listItem.products
                    .filter((x) => !!x)
                    .map((product) => ({
                        orderProductSid: product._sid,
                        orderProductQuantity:
                            product.quantity - (totalDispatchQuantityMapper[product._sid] || 0),
                        productId: product.pin,
                    }));
                deliveryFormSetMeta({
                    ...meta,
                    availability: products.reduce(
                        (index, product) => ({
                            ...index,
                            [product.orderProductSid]: product.orderProductQuantity,
                        }),
                        {}
                    ),
                    // firstAvailableSid: products.reduce(
                    //     (result, product) =>
                    //         result === '' && product.orderProductQuantity
                    //             ? product.orderProductSid
                    //             : '',
                    //     ''
                    // ),
                });
                deliveryForm.setFieldsValue({ products });
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
            const supplierPaperFileUrl =
                values.supplierPaperFile && values.supplierPaperFile[0]
                    ? values.supplierPaperFile[0].response.url
                    : undefined;

            console.log(values.supplierPaperFile);

            const orderProducts = deliveryFormPayload.products.reduce(
                (result: { [x: string]: number }, product: any) => ({
                    ...result,
                    [product._sid]: (result[product._sid] || 0) + product.quantity,
                }),
                {}
            );
            const orderProductInfo = deliveryFormPayload.products.reduce(
                (result: { [x: string]: number }, product: any) => ({
                    ...result,
                    [product._sid]: product,
                }),
                {}
            );
            const deliveredProducts = deliveryFormMeta.deliveries.reduce(
                (result: { [x: string]: number }, delivery: any) => {
                    return {
                        ...result,
                        ...delivery.products.reduce(
                            (partialResult: { [x: string]: number }, product: any) => {
                                return {
                                    ...partialResult,
                                    [product._sid]:
                                        (partialResult[product._sid] || 0) + product.quantity,
                                };
                            },
                            result
                        ),
                    };
                },
                {}
            );

            const products = values.products
                .filter(
                    (product: any) =>
                        !!product && (!!product.productQuantity || !!product.productSns)
                )
                .map((product: any) => {
                    const sns = (product.productSns || '')
                        .trim()
                        .split('\n')
                        .map((x: string) => x.trim())
                        .filter((x: string) => !!x)
                        .filter((v: string, i: number, a: string[]) => a.indexOf(v) === i);
                    const quantityRemaining =
                        orderProducts[product.orderProductSid] -
                        (deliveredProducts[product.orderProductSid] || 0);

                    const hasId = !!orderProducts[product.orderProductSid];
                    const serialable = product.productSerialable !== false;
                    const length = serialable ? sns.length : product.productQuantity;
                    const hasLimit = length <= quantityRemaining;
                    return {
                        orderProductSid: product.orderProductSid,
                        sku: product.productSku,
                        id: product.productId || orderProductInfo[product.orderProductSid].pin,
                        serialable,
                        quantity: length,
                        quantityRemaining,
                        sns,
                        isValid: hasLimit && hasId && length > 0,
                        hasId,
                        hasLimit,
                        lot: product.productLot,
                        pn: product.productPn,
                    };
                })
                .filter((product: any) => product.quantity);

            const extraProducts = (values.extraProducts || []).reduce(
                (result: any[], extra: any[]) => [
                    ...result,
                    ...(extra || [])
                        .filter((product: any) => !!product && !!product.productId)
                        .map((product: any) => {
                            const sns = (product.productSns || '')
                                .trim()
                                .split('\n')
                                .map((x: string) => x.trim())
                                .filter((x: string) => !!x)
                                .filter((v: string, i: number, a: string[]) => a.indexOf(v) === i);

                            const hasId = true;
                            const serialable = product.productSerialable !== false;
                            const length = serialable ? sns.length : product.productQuantity;
                            const hasLimit = true;
                            return {
                                orderProductSid: product.orderProductSid,
                                name: product.productName,
                                sku: product.productId,
                                id: product.productId,
                                categories: product.productCategories,
                                brand: product.productBrand,
                                serialable,
                                quantity: length,
                                sns,
                                isValid: hasLimit && hasId,
                                hasId,
                                hasLimit,
                                lot: product.productLot,
                                pn: product.productPn,
                            };
                        })
                        .filter((product: any) => product.quantity),
                ],
                []
            );

            const isValid = products.reduce(
                (result: boolean, product: { isValid: boolean }) => result && product.isValid,
                true
            );

            deliveryFormReviewSetPayload({
                id: values.id,
                isValid,
                receivingPaperId: values.receivingPaperId,
                supplierShippingPaperFileUrl: supplierPaperFileUrl,
                supplierSalePaperId: values.supplierSalePaperId,
                supplierDeliveryPaperId: values.supplierDeliveryPaperId,
                products,
                extraProducts,
                createdAt: values.createdAt,
                supplierSenderCode: values.supplierSenderCode,
                supplierSenderName: values.supplierSenderName,
            });

            deliveryFormSetStep(DeliveryFormStep.REVIEW);
        },
        [deliveryFormMeta, deliveryFormPayload]
    );

    const onDeliveryFormVisibleChanges = useCallback(
        (visible: boolean) => {
            if (!visible) {
                deliveryFormSetStep(DeliveryFormStep.INPUT);
                if (deliveryFormHasSubmmited.current) {
                    orderReadManyCache.clear();
                    orderReadManyWithCurrentQuery();
                    deliveryFormHasSubmmited.current = false;
                }
            }
        },
        [orderReadManyWithCurrentQuery, orderReadManyCache]
    );

    const onDeliveryFormReviewEdit = useCallback(() => {
        deliveryFormSetStep(DeliveryFormStep.INPUT);
    }, []);

    const onDeliveryFormReviewSubmit = useCallback(() => {
        orderCreateOneDelivery(`${deliveryFormReviewPayload.id}/deliver`, {
            createdAt: deliveryFormReviewPayload.createdAt,
            receivingPaperId: deliveryFormReviewPayload.receivingPaperId,
            supplierDeliveryPaperId: deliveryFormReviewPayload.supplierDeliveryPaperId,
            supplierShippingPaperFileUrl: deliveryFormReviewPayload.supplierShippingPaperFileUrl,
            supplierSalePaperId: deliveryFormReviewPayload.supplierSalePaperId,
            supplierSenderCode: deliveryFormReviewPayload.supplierSenderCode,
            supplierSenderName: deliveryFormReviewPayload.supplierSenderName,
            products: deliveryFormReviewPayload.products.map((product: any) => ({
                orderProductSid: product.orderProductSid,
                pin: product.id,
                sku: product.sku,
                pn: product.pn,
                lot: product.lot,
                ...(product.serialable
                    ? {
                          sns: product.sns,
                          quantity: product.sns.length,
                      }
                    : {
                          sns: [],
                          quantity: product.quantity,
                      }),
            })),
            extraProducts: deliveryFormReviewPayload.extraProducts.map((product: any) => ({
                orderProductSid: product.orderProductSid,
                name: product.name,
                pin: product.id,
                sku: product.sku,
                pn: product.pn,
                brand: product.brand,
                categories: product.categories,
                ...(product.serialable
                    ? {
                          sns: product.sns,
                          quantity: product.sns.length,
                      }
                    : {
                          sns: [],
                          quantity: product.quantity,
                      }),
            })),
        }).then(({ error }) => {
            if (error) return;
            deliveryFormHasSubmmited.current = true;
            deliveryForm.resetFields();
            deliveryUploadReset();
            deliveryFormSetStep(DeliveryFormStep.DONE);
        });
    }, [deliveryForm, deliveryUploadReset, orderCreateOneDelivery, deliveryFormReviewPayload]);

    const onDeliveryFormDoneClose = useCallback(() => {
        deliveryFormSetIsVisible(false);
    }, []);

    const onDeliveryFormDoneAgain = useCallback(() => {
        deliveryFormSetStep(DeliveryFormStep.INPUT);
    }, []);

    const onDeliveryFormHide = useCallback(() => {
        deliveryFormSetIsVisible(false);
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
        deliveryFormStep,
        deliveryFormIsVisible,
        deliveryFormInputIsLoading: false,
        deliveryFormInputIsDisabled: orderReadOneIsLoading,
        deliveryFormReviewIsLoading: orderCreateOneDeliveryIsLoading,
        deliveryFormReviewPayload,
        deliveryFormUploadComponent: deliveryUploadComponent,
        deliveryFormUploadIsDisabled: deliveryUploadIsDisabled,
        onOrderTableRefresh,
        onOrderTableSearch,
        onOrderTableDetailClick,
        onOrderTableDeliveryClick,
        onOrderDetailHide,
        onOrderDetailIdClick,
        onOrderDetailIdHide,
        onDeliveryFormHide,
        onDeliveryFormInputSubmit,
        onDeliveryFormInputFinish,
        onDeliveryFormReviewEdit,
        onDeliveryFormReviewSubmit,
        onDeliveryFormDoneClose,
        onDeliveryFormDoneAgain,
        onDeliveryFormVisibleChanges,
    };
};
