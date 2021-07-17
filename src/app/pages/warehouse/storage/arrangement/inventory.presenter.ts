import { useCallback, useState, useEffect, useRef } from 'react';

import { Form } from 'antd';
import { stringify } from 'qs';

import { useApi } from 'src/core/network/lib/useApi';

import paginate from 'src/app/helper/pagination/paginate';

import { ReadManyItems } from './inventory.interface';

export default () => {
    const { data: readSelectionData, get: readSelection } = useApi('/arrangement-selections');
    const { get: findSelection } = useApi('/arrangement-templates');

    const { loading: isReadLoading, data, cache, get } = useApi('/arrangements');
    const { loading: readOnedIsLoading, data: readOneData, get: readOne } = useApi('/arrangements');
    const { loading: isCreateLoading, post: createOne } = useApi('/arrangements');

    const isSubmitted = useRef<boolean>();
    const [orderTableQuery, orderTableSetQuery] = useState<any>({});

    const [detailPayload, detailSetPayload] = useState<ReadManyItems>();
    const [detailIsVisible, detailSetIsVisible] = useState(false);

    const [createForm] = Form.useForm();
    const [createFormIsVisible, createFormSetIsVisible] = useState<boolean>(false);

    const [createFormInList, createFormInSetList] = useState<{ [x: string]: any }>({});
    const [createFormInIsVisible, createFormInSetIsVisible] = useState<boolean>(false);

    const [createFormOut] = Form.useForm();
    const [createFormOutList, createFormOutSetList] = useState<any[]>([]);
    const [createFormOutIsVisible, createFormOutSetIsVisible] = useState<boolean>(false);
    const [createFormPayload] = useState<ReadManyItems>();

    const readWithLatestQuery = useCallback(() => {
        get(stringify(orderTableQuery, { skipNulls: true, addQueryPrefix: true }));
    }, [get, orderTableQuery]);

    const onMenuCreate = useCallback(() => {
        createFormSetIsVisible(true);
        readSelection();
    }, [readSelection]);

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

    const onDetailHide = useCallback(() => {
        detailSetIsVisible(false);
    }, []);

    const onCreateFormCancel = useCallback(() => {
        createFormSetIsVisible(false);
    }, []);
    const onCreateFormFinish = useCallback((values: any) => {}, []);

    const onCreateFormVisibilityChanges = useCallback(
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

    const onCreateFormSubmit = useCallback(() => {
        const ins = Object.keys(createFormInList)
            .map((key) => createFormInList[key])
            .filter((x) => x)
            .map((x) => ({ qn: x.productQn, quantity: x.productQuantity }));

        // const outSns =
        const outs = createFormOutList.map((x) => {
            const sns = x.productSns.trim()
                ? x.productSns
                      .split('\n')
                      .map((sn: string) => sn.trim())
                      .filter((x: string) => !!x)
                      .filter((v: string, i: number, a: string[]) => a.indexOf(v) === i)
                : undefined;
            const serialable = x.serialable !== false;
            return {
                sku: x.productSku,
                productName: x.productName,
                productBrand: x.productBrand,
                productPn: x.productPn,
                productCategories: x.productCategories,
                ...(serialable
                    ? {
                          productSns: sns,
                          quantity: sns.length,
                      }
                    : {
                          productLot: x.productLot,
                          quantity: x.quantity,
                      }),
            };
        });

        createOne({ ins, outs }).then(({ error, payload }) => {
            if (error) return;

            createFormInSetList({});
            createFormOutSetList([]);

            isSubmitted.current = true;
            createFormSetIsVisible(false);
        });
    }, [createFormInList, createFormOutList, createOne]);

    const onCreateFormInRemoveClick = useCallback(
        (id: string) => {
            createFormInSetList({
                ...createFormInList,
                [id]: undefined,
            });
        },
        [createFormInSetList, createFormInList]
    );

    const onCreateFormOutRemoveClick = useCallback(
        (sku: string) => {
            createFormOutSetList([...createFormOutList.filter((x) => x.productSku !== sku)]);
        },
        [createFormOutSetList, createFormOutList]
    );

    // Ins

    const onCreateFormInClick = useCallback(() => {
        createFormInSetIsVisible(true);
    }, []);

    const onCreateFormInSelect = useCallback(
        (record: any, quantity: number) => {
            createFormInSetList({
                ...createFormInList,
                [record._id]: {
                    ...record,
                    productQuantity: quantity,
                },
            });
        },
        [createFormInList, createFormInSetList]
    );

    const onCreateFormInCancel = useCallback(() => {
        createFormInSetIsVisible(false);
    }, []);

    // Outs

    const onCreateFormOutClick = useCallback(() => {
        createFormOutSetIsVisible(true);
    }, []);

    const onCreateFormOutSearch = useCallback(
        (value: string) => {
            findSelection(stringify({ productQn: value }, { addQueryPrefix: true })).then(
                ({ payload, error }: { payload: any; error: any }) => {
                    if (error) return;

                    const item = payload[0] || {};

                    createFormOut.setFieldsValue({
                        productName: item.productName,
                        productPn: item.productPn,
                        productBrand: item.productBrand,
                        productCategories: item.productCategories,
                    });
                }
            );
        },
        [createFormOut, findSelection]
    );

    const onCreateFormOutFinish = useCallback(
        (value) => {
            createFormOutSetList([...createFormOutList, value]);
        },
        [createFormOutSetList, createFormOutList]
    );

    const onCreateFormOutCancel = useCallback(() => {
        createFormOutSetIsVisible(false);
    }, []);

    useEffect(() => {
        get();
    }, [get]);

    const inList = Object.keys(createFormInList)
        .map((key) => createFormInList[key])
        .filter((x) => x);

    return {
        tableDataSource: data?.payload || [],
        tablePagination: paginate(data?.meta.pagination),
        detailPayload: detailPayload!,
        detailMeta: readOneData?.meta,
        detailIsLoading: readOnedIsLoading,
        detailIsVisible,
        createForm,
        createFormIsSubmitable: createFormOutList.length && inList.length,
        createFormPayload,
        createFormSelections: readSelectionData?.payload || [],
        createFormInList: inList,
        createFormInDict: createFormInList,
        createFormIsVisible,
        createFormIsLoading: isCreateLoading,
        createFormInIsVisible,
        createFormOut,
        createFormOutList,
        createFormOutIsVisible,
        isTableActionDisabled: isReadLoading,
        isTableLoading: isReadLoading,
        onTableChange,
        onMenuCreate,
        onTableItemDetailClick,
        onTableRefresh,
        onDetailHide,
        onCreateFormCancel,
        onCreateFormInRemoveClick,
        onCreateFormOutRemoveClick,
        onCreateFormSubmit,
        onCreateFormFinish,
        onCreateFormVisibilityChanges,
        onCreateFormInClick,
        onCreateFormInCancel,
        onCreateFormInSelect,
        onCreateFormOutClick,
        onCreateFormOutCancel,
        onCreateFormOutFinish,
        onCreateFormOutSearch,
    };
};
