import { useCallback, useRef, useState, useEffect } from 'react';

import { Form, notification } from 'antd';
import { stringify } from 'qs';

import { useApi } from 'src/core/network/lib/useApi';

import paginate from 'src/app/helper/pagination/paginate';

import { useAntdUpload } from 'src/app/container/upload/useUpload';

import { CreateSale, DeliveryListItem } from './delivery.interface';

export enum DeliveryCreateStep {
    INPUT = 0,
    PREVIEW = 1,
    END = 2,
}

export default () => {
    const {
        loading: deliveryReadManyIsLoading,
        data: deliveryReadManyData,
        cache: deliveryReadManyCache,
        get: deliveryReadMany,
    } = useApi('/receiving-deliveries');
    const {
        loading: deliveryReadOneIsLoading,
        data: deliveryReadOneData,
        get: deliveryReadOne,
        abort: deliveryReadOneAbort,
    } = useApi('/receiving-deliveries');
    const {
        loading: deliveryCreateOneIsLoading,
        data: deliveryCreateOneData,
        post: deliveryCreateOne,
    } = useApi('/receiving-deliveries');
    const { loading: deliveryUpdateOneIsLoading, put: deliveryUpdateOne } = useApi(
        '/receiving-deliveries'
    );

    const [deliveryDetailData, deliveryDetailSetData] = useState<DeliveryListItem | void>(
        undefined
    );

    const [deliveryCreateForm] = Form.useForm();
    const [deliveryCreateFormIsVisible, deliveryCreateFormSetIsVisible] = useState(false);
    const [deliveryCreateFormStep, deliveryCreateFormSetStep] = useState(DeliveryCreateStep.INPUT);
    const deliveryCreateFormPreviewValues = useRef<CreateSale>();
    const deliveryCreateFormHasCreatedOneSinceLastOpen = useRef<boolean>();

    const [deliveryUpdateForm] = Form.useForm();
    const [deliveryUpdateFormIsVisible, deliveryUpdateFormSetIsVisible] = useState(false);
    const deliveryUpdateFormHasUpdatedOneSinceLastOpen = useRef<boolean>();

    const {
        component: deliveryUploadComponent,
        isLoading: deliveryUploadIsDisabled,
        resetFileList: deliveryUploadReset,
    } = useAntdUpload({
        onFileListChange: (files) => {
            deliveryUpdateForm.setFieldsValue({ supplierPaperFile: files });
        },
    });

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

    const onDeliveryCreateFormFullyClosed = useCallback(
        (visible: boolean) => {
            if (!visible) {
                if (deliveryCreateFormHasCreatedOneSinceLastOpen.current) {
                    deliveryReadManyCache.clear();
                    deliveryReadManyFilter();
                }
                deliveryCreateFormHasCreatedOneSinceLastOpen.current = false;
                deliveryCreateFormSetStep(DeliveryCreateStep.INPUT);
            }
        },
        [deliveryReadManyCache, deliveryReadManyFilter]
    );

    const onDeliveryCreateFormHide = useCallback(() => {
        deliveryCreateFormSetIsVisible(false);
    }, []);
    const onDeliveryCreateFormInputSubmit = useCallback(() => deliveryCreateForm.submit(), [
        deliveryCreateForm,
    ]);
    const onDeliveryCreateFormInputFinish = useCallback(() => {
        deliveryCreateForm.validateFields().then((store) => {
            const values = store as CreateSale;
            deliveryCreateFormPreviewValues.current = values;
            //
        });
    }, [deliveryCreateForm]);

    const onDeliveryCreateFormPreviewCancel = useCallback(() => {
        deliveryCreateFormSetStep(DeliveryCreateStep.INPUT);
    }, [deliveryCreateFormSetStep]);
    const onDeliveryCreateFormPreviewFinish = useCallback(() => {
        const values = {};
        return deliveryCreateOne(values).then(({ error }) => {
            if (error) {
                return notification.error({
                    message: 'Failed to create entry',
                });
            }
            deliveryCreateFormHasCreatedOneSinceLastOpen.current = true;
            deliveryCreateForm.resetFields();
            deliveryCreateFormSetStep(DeliveryCreateStep.END);
        });
    }, [deliveryCreateOne, deliveryCreateFormSetStep, deliveryCreateForm]);

    const onDeliveryCreateFormEndAnother = useCallback(() => {
        deliveryCreateFormSetStep(DeliveryCreateStep.INPUT);
    }, []);
    const onDeliveryCreateFormEndFinish = useCallback(() => {
        deliveryCreateFormSetIsVisible(false);
    }, []);

    // Update

    const onDeliveryUpdateFormHide = useCallback(() => {
        deliveryUpdateFormSetIsVisible(false);
    }, []);

    const onDeliveryUpdateFormFinish = useCallback(
        (values: any) => {
            const supplierPaperFileUrl =
                values.supplierPaperFile && values.supplierPaperFile[0]
                    ? values.supplierPaperFile[0].response.url
                    : undefined;
            deliveryUpdateOne(`${values._id}`, {
                paperId: values.paperId,
                supplierShippingPaperFileUrl: supplierPaperFileUrl,
            }).then(() => {
                deliveryUpdateFormHasUpdatedOneSinceLastOpen.current = true;
                // deliveryReadManyCache.clear();
                // deliveryReadManyFilter();

                deliveryUpdateForm.resetFields();
                deliveryUpdateFormSetIsVisible(false);
                deliveryUploadReset();
            });
        },
        [deliveryUpdateOne, deliveryUploadReset, deliveryUpdateForm]
    );

    const onDeliveryUpdateFormSubmit = useCallback(() => {
        deliveryUpdateForm.submit();
    }, [deliveryUpdateForm]);

    const onDeliveryUpdateFormFullyClosed = useCallback(
        (visible: boolean) => {
            if (!visible) {
                if (deliveryUpdateFormHasUpdatedOneSinceLastOpen.current) {
                    deliveryReadManyCache.clear();
                    deliveryReadManyFilter();
                }
                deliveryUpdateFormHasUpdatedOneSinceLastOpen.current = false;
            }
        },
        [deliveryReadManyCache, deliveryReadManyFilter]
    );

    // Detail

    const onDeliveryDetailHide = useCallback(() => {
        deliveryDetailSetData(undefined);
    }, []);

    // Table

    const onDeliveryTableSearch = useCallback(
        (pagination, query: { [x: string]: any }) => {
            deliveryReadManyFilter({ page: pagination.current, ...query });
        },
        [deliveryReadManyFilter]
    );

    const onDeliveryTableDetailClick = useCallback(
        (listItem: DeliveryListItem) => {
            deliveryDetailSetData(listItem);
            deliveryReadOneAbort();
            deliveryReadOne(`/${listItem._id}`);
        },
        [deliveryReadOneAbort, deliveryReadOne]
    );

    const onDeliveryTableDetailUpdate = useCallback(
        (listItem: DeliveryListItem) => {
            deliveryUpdateFormSetIsVisible(true);
            deliveryUpdateForm.setFieldsValue({
                _id: listItem._id,
                postId: listItem.postId,
                paperId: listItem.paperId,
            });
        },
        [deliveryUpdateForm]
    );

    const onDeliveryTableRefresh = useCallback(() => {
        deliveryReadManyCache.clear();
        deliveryReadManyFilter();
    }, [deliveryReadManyCache, deliveryReadManyFilter]);

    useEffect(() => {
        deliveryReadManyFilter();
    }, [deliveryReadManyFilter]);

    return {
        deliveryTablePayload: deliveryReadManyData?.payload || [],
        deliveryTableIsLoading: deliveryReadManyIsLoading,
        deliveryTableActionIsDisabled: deliveryCreateOneIsLoading || deliveryReadManyIsLoading,
        deliveryTablePagination: paginate(deliveryReadManyData?.meta.pagination),
        deliveryDetailPayload: deliveryDetailData,
        deliveryDetailMeta: deliveryReadOneData?.meta,
        deliveryDetailMetaIsLoading: deliveryReadOneIsLoading,
        deliveryDetailIsVisible: !!deliveryDetailData,
        deliveryCreateForm,
        deliveryCreateFormStep,
        deliveryCreateFormInputIsLoading: false,
        deliveryCreateFormPreviewPayload: {},
        deliveryCreateFormPreviewMeta: {},
        deliveryCreateFormEndPayload: deliveryCreateOneData?.payload || {},
        deliveryCreateFormIsVisible,
        deliveryCreateFormPreviewIsLoading: deliveryCreateOneIsLoading,
        deliveryUpdateForm,
        deliveryUpdateFormIsLoading: deliveryUpdateOneIsLoading,
        deliveryUpdateFormIsVisible,
        deliveryUpdateFormUploadComponent: deliveryUploadComponent,
        deliveryUpdateFormUploadIsDisabled: deliveryUploadIsDisabled,
        onDeliveryTableRefresh,
        onDeliveryTableSearch,
        onDeliveryTableDetailClick,
        onDeliveryTableDetailUpdate,
        onDeliveryDetailHide,
        onDeliveryCreateFormHide,
        onDeliveryCreateFormFullyClosed,
        onDeliveryCreateFormInputFinish,
        onDeliveryCreateFormInputSubmit,
        onDeliveryCreateFormPreviewCancel,
        onDeliveryCreateFormPreviewFinish,
        onDeliveryCreateFormEndAnother,
        onDeliveryCreateFormEndFinish,
        onDeliveryUpdateFormHide,
        onDeliveryUpdateFormSubmit,
        onDeliveryUpdateFormFinish,
        onDeliveryUpdateFormFullyClosed,
    };
};
