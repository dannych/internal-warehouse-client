import React, { useCallback } from 'react';

import { AutoComplete, Form, Input } from 'antd';
import { stringify } from 'qs';

import { useApi } from 'src/core/network/lib/useApi';

import debounce from 'src/app/helper/fn/debounce';

export const Autocomplete: React.FC<
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
        rules?: any;
        onSelect?: (value: any) => void;
        onFocus?: (e: any) => void;
    } & any
> = ({ apiPath, nameList, form, onSelect, filter, rules, style, ...props }) => {
    const valueAttribute = 'code';
    const labelAttribute = 'name';

    const { data, get } = useApi(apiPath);

    const onSearch = useCallback((search: string) => get(`?q=${search}&${stringify(filter)}`), [
        get,
        filter,
    ]);
    const onSelectComponent = useCallback(
        (value: any, { data: { name: label, code } }) => {
            if (nameList) {
                const value = form.getFieldValue(nameList);
                const index = props.name;

                form.setFieldsValue({
                    [nameList]: [
                        ...value.slice(0, index),
                        { ...value[index], [`${props.namePrefix}Code`]: code },
                        ...value.slice(index + 1, value.length),
                    ],
                });
            } else {
                form.setFieldsValue({ [`${props.namePrefix}Code`]: code });
            }
        },
        [form, props.namePrefix, nameList, props.name]
    );

    const debouncedOnSearch = debounce(onSearch);

    return (
        <Input.Group compact={true} style={{ display: 'flex', ...style }}>
            <Form.Item
                {...props}
                name={
                    nameList ? [props.name, `${props.namePrefix}Name`] : `${props.namePrefix}Name`
                }
                fieldKey={[props.fieldKey, `${props.namePrefix}Name`]}
                noStyle={true}
                rules={rules || [{ required: true, message: ' ' }]}
            >
                <AutoComplete
                    style={{ flex: 1 }}
                    disabled={props.disabled}
                    dropdownMatchSelectWidth={false}
                    options={(data?.payload || []).map((option: any) => ({
                        value: option[labelAttribute],
                        key: option.code,
                        label: (
                            <div>
                                <b style={{ marginRight: 4 }}>{option[labelAttribute]}</b>
                                <span>{option[valueAttribute]}</span>
                            </div>
                        ),
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
                        disabled={props.disabled}
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
            >
                <Input
                    style={{ width: '25%' }}
                    disabled={props.disabled}
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
