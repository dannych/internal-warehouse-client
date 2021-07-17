import { useCallback, useState, useEffect, useRef } from 'react';

import { Form } from 'antd';
import { stringify } from 'qs';

import { useApi } from 'src/core/network/lib/useApi';

import paginate from 'src/app/helper/pagination/paginate';

import { ReadManyItems } from './inventory.interface';

export default () => {
    const { loading: isReadLoading, data, cache, get } = useApi('/entries');
    const { loading: readOnedIsLoading, data: readOneData, get: readOne } = useApi('/entries');
    const { loading: isUpdateLoading, put } = useApi('/entries');

    const isSubmitted = useRef<boolean>();
    const [orderTableQuery, orderTableSetQuery] = useState<any>({});

    const [detailPayload, detailSetPayload] = useState<ReadManyItems>();
    const [detailIsVisible, detailSetIsVisible] = useState(false);

    const [updateForm] = Form.useForm();
    const [updateFormIsVisible, updateFormSetIsVisible] = useState<boolean>(false);
    const [updateFormPayload, updateFormSetPayload] = useState<ReadManyItems>();

    const readWithLatestQuery = useCallback(() => {
        get(stringify(orderTableQuery, { skipNulls: true, addQueryPrefix: true }));
    }, [get, orderTableQuery]);

    const onTableRefresh = useCallback(() => {
        cache.clear();
        readWithLatestQuery();
    }, [readWithLatestQuery, cache]);

    const onTableChange = useCallback(
        (pagination, query: { [x: string]: any }, sorter: any) => {
            const param = {
                page: pagination.current,
                ...query,
                sort: sorter.order
                    ? `${sorter.field}_${sorter.order === 'ascend' ? 'asc' : 'desc'}`
                    : undefined,
            };
            orderTableSetQuery(param);
            get(stringify(param, { skipNulls: true, addQueryPrefix: true }));
        },
        [get]
    );

    const onTableItemDetailClick = useCallback(
        (item: ReadManyItems) => {
            detailSetIsVisible(true);
            detailSetPayload(item);
            readOne(`${item._id}`);
        },
        [readOne]
    );

    const onTableItemEdit = useCallback(
        (data: ReadManyItems) => {
            updateFormSetPayload(data);
            updateForm.setFieldsValue({
                _id: data._id,
                productName: data.productName,
                productBrand: data.productBrand,
                productCategories: data.productCategories,
            });
            updateFormSetIsVisible(true);
        },
        [updateForm]
    );

    const onDetailHide = useCallback(() => {
        detailSetIsVisible(false);
    }, []);

    const onUpdateFormCancel = useCallback(() => {
        updateFormSetIsVisible(false);
    }, []);
    const onUpdateFormFinish = useCallback(
        (values: any) => {
            put(updateFormPayload?._id, {
                pin: values.pin,
                productName: values.productName,
                productBrand: values.productBrand,
                productCategories: values.productCategories,
            }).then(({ error }) => {
                if (error) return;
                updateFormSetIsVisible(false);
                updateForm.resetFields();
                isSubmitted.current = true;
            });
        },
        [updateFormPayload, put, updateForm]
    );

    const onUpdateFormVisibilityChanges = useCallback(
        (isVisible) => {
            if (isVisible) {
            } else {
                if (isSubmitted.current) {
                    cache.clear();
                    readWithLatestQuery();
                    isSubmitted.current = false;
                }
            }
        },
        [cache, readWithLatestQuery]
    );

    const onUpdateFormSubmit = useCallback(
        (values: any) => {
            updateForm.submit();
        },
        [updateForm]
    );

    useEffect(() => {
        get();
    }, [get]);

    return {
        tableDataSource: data?.payload || [],
        tablePagination: paginate(data?.meta.pagination),
        detailPayload: detailPayload!,
        detailMeta: readOneData?.meta,
        detailIsLoading: readOnedIsLoading,
        detailIsVisible,
        updateForm,
        updateFormPayload,
        updateFormIsVisible,
        updateFormIsLoading: isUpdateLoading,
        isTableActionDisabled: isReadLoading,
        isTableLoading: isReadLoading,
        onTableChange,
        onTableItemEdit,
        onTableItemDetailClick,
        onTableRefresh,
        onDetailHide,
        onUpdateFormCancel,
        onUpdateFormSubmit,
        onUpdateFormFinish,
        onUpdateFormVisibilityChanges,
    };
};
