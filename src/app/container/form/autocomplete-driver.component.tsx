import React, { useCallback } from 'react';

import { AutoComplete, Form, Input } from 'antd';
import { stringify } from 'qs';

import { useApi } from 'src/core/network/lib/useApi';

import debounce from 'src/app/helper/fn/debounce';

export const AutocompleteDriver: React.FC<
    { apiPath: string } & {
        filter?: any;
        autoFocus?: boolean;
        nameList?: string;
        namePrefix?: string;
        form: any;
        style?: any;
        placeholder?: string;
        allowClear?: boolean;
        disabled?: boolean;
        onSelect?: (value: any) => void;
        onFocus?: (e: any) => void;
    } & any
> = ({ apiPath, nameList, form, onSelect, filter, ...props }) => {
    const valueAttribute = 'name';
    const labelAttribute = 'code';

    const { data, get } = useApi(apiPath);

    const onSearch = useCallback((search: string) => get(`?q=${search}&${stringify(filter)}`), [
        get,
        filter,
    ]);
    const onSelectComponent = useCallback(
        (value: any, { data: { [labelAttribute]: label } }) => {
            if (nameList) {
                const value = form.getFieldValue(nameList);
                const index = props.name;

                form.setFieldsValue({
                    [nameList]: [
                        ...value.slice(0, index),
                        { ...value[index], [`${props.namePrefix}Code`]: label },
                        ...value.slice(index + 1, value.length),
                    ],
                });
            } else {
                form.setFieldsValue({ [`${props.namePrefix}Code`]: label });
            }
        },
        [form, props.namePrefix, nameList, props.name]
    );

    const debouncedOnSearch = debounce(onSearch);

    return (
        <Input.Group compact={true} style={{ display: 'flex' }}>
            <Form.Item
                {...props}
                name={
                    nameList ? [props.name, `${props.namePrefix}Name`] : `${props.namePrefix}Name`
                }
                fieldKey={[props.fieldKey, `${props.namePrefix}Name`]}
                noStyle={true}
                rules={[{ required: true, message: 'Required' }]}
            >
                <AutoComplete
                    disabled={props.disabled}
                    style={{ width: '100%' }}
                    dropdownMatchSelectWidth={false}
                    options={(data?.payload || []).map((option: any) => ({
                        value: option[valueAttribute],
                        key: option.code,
                        label: <div>{option[valueAttribute]}</div>,
                        data: option,
                    }))}
                    onSearch={debouncedOnSearch}
                    onSelect={onSelectComponent}
                    defaultActiveFirstOption={false}
                    showArrow={false}
                    filterOption={false}
                    showSearch={true}
                >
                    <Input
                        onFocus={(e) => {
                            props.onFocus && props.onFocus(e);
                            onSearch && onSearch('');
                        }}
                        placeholder='Name'
                    />
                </AutoComplete>
            </Form.Item>
            <Form.Item
                {...props}
                name={
                    nameList ? [props.name, `${props.namePrefix}Code`] : `${props.namePrefix}Code`
                }
                fieldKey={[props.fieldKey, `${props.namePrefix}Code`]}
                noStyle={true}
                rules={[{ required: true, message: ' ' }]}
            >
                <Input
                    type='hidden'
                    onFocus={(e) => {
                        props.onFocus && props.onFocus(e);
                        onSearch && onSearch('');
                    }}
                    placeholder='Code'
                />
            </Form.Item>
        </Input.Group>
    );
};
