import { useCallback, useState, useEffect } from 'react';

import { Form, notification } from 'antd';
import { stringify } from 'qs';

import { useApi } from 'src/core/network/lib/useApi';

import { CreateOfficer, ReadManyOfficers } from './driver.interface';

export default () => {
    const { loading: isReadLoading, data, cache, get } = useApi('/representatives');
    const { loading: isCreateLoading, post } = useApi('/representatives');
    const { loading: isDeleteLoading, del } = useApi('/representatives');
    const [form] = Form.useForm();

    const [isCreateFormVisible, setIsCreateFormVisible] = useState(false);

    const onCreateStart = useCallback(() => setIsCreateFormVisible(true), []);
    const onCreateCancel = useCallback(() => setIsCreateFormVisible(false), []);
    const onCreateSubmit = useCallback(() => form.submit(), [form]);
    const onCreate = useCallback(
        (values: CreateOfficer) =>
            post({
                code: values.officerCode,
                name: values.officerName,
            }).then(({ error }) => {
                if (error) {
                    return notification.error({
                        message: 'Failed to create entry',
                    });
                }
                form.resetFields();
                cache.clear();
                get();
                setIsCreateFormVisible(false);
            }),
        [post, get, cache, form]
    );

    const onSearch = useCallback(
        (query: { [x: string]: any }) => {
            get(stringify(query, { addQueryPrefix: true }));
        },
        [get]
    );

    const onDelete = useCallback(
        (data: ReadManyOfficers) => {
            del(`/${data._id}`).then(() => {
                cache.clear();
                get();
            });
        },
        [del, cache, get]
    );

    useEffect(() => {
        get();
    }, [get]);

    return {
        form,
        tableDataSource: data?.payload || [],
        isTableActionDisabled: isDeleteLoading || isCreateLoading || isReadLoading,
        isTableLoading: isReadLoading,
        isCreateFormVisible,
        isCreateFormLoading: isCreateLoading,
        onCreate,
        onCreateSubmit,
        onCreateStart,
        onCreateCancel,
        onDelete,
        onSearch,
    };
};
