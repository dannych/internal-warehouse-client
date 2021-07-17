import React, { useRef } from 'react';

import { Button, Form, Input, InputNumber, Space, Table } from 'antd';
import { PlusOutlined, SearchOutlined } from '@ant-design/icons';

const InventoryCreateFormSelect: React.FC<{
    selections: any[];
    selectedOptions: any;
    onSearch?: (query: { [x: string]: any }) => void;
    onSelect?: (record: any, quantity: number) => void;
}> = ({ selectedOptions, selections, onSearch, onSelect }) => {
    const searchInput = useRef<any>();

    const handleSearch = (selectedKeys: any, confirm: any, dataIndex: any) => {
        confirm();
        onSearch && onSearch({ [dataIndex]: selectedKeys[0] });
    };

    const handleReset = (clearFilters: any) => {
        clearFilters();
        onSearch && onSearch({});
    };

    const getColumnSearchProps = (dataIndex: string) => ({
        filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters }: any) => (
            <div style={{ padding: 8 }}>
                <Input
                    ref={searchInput}
                    placeholder={`Search ${dataIndex}`}
                    value={selectedKeys[0]}
                    onChange={(e) => setSelectedKeys(e.target.value ? [e.target.value] : [])}
                    onPressEnter={() => handleSearch(selectedKeys, confirm, dataIndex)}
                    style={{ width: 188, marginBottom: 8, display: 'block' }}
                />
                <Space>
                    <Button
                        type='primary'
                        onClick={() => handleSearch(selectedKeys, confirm, dataIndex)}
                        icon={<SearchOutlined />}
                        size='small'
                        style={{ width: 90 }}
                    >
                        Search
                    </Button>
                    <Button
                        onClick={() => handleReset(clearFilters)}
                        size='small'
                        style={{ width: 90 }}
                    >
                        Reset
                    </Button>
                </Space>
            </div>
        ),
        filterIcon: (filtered: any) => (
            <SearchOutlined style={{ color: filtered ? '#1890ff' : undefined }} />
        ),
        onFilter: (value: any, record: any) =>
            record[dataIndex]
                ? record[dataIndex].toString().toLowerCase().includes(value.toLowerCase())
                : '',
        onFilterDropdownVisibleChange: (visible: boolean) => {
            if (visible) {
                setTimeout(() => searchInput.current!.select());
            }
        },
    });

    return (
        <div>
            <Table
                dataSource={selections}
                size='small'
                pagination={{
                    simple: true,
                }}
                columns={[
                    {
                        title: 'SKU',
                        dataIndex: 'sku',
                        sorter: true,
                        ellipsis: true,
                        ...getColumnSearchProps('sku'),
                    },
                    {
                        title: '#',
                        dataIndex: 'productStock',
                        width: '50px',
                    },
                    {
                        title: 'Name',
                        dataIndex: 'productName',
                        ...getColumnSearchProps('productName'),
                        ellipsis: true,
                    },
                    {
                        title: 'QN',
                        dataIndex: 'productQn',
                        ...getColumnSearchProps('productQn'),
                        render: (text) => text || '-',
                    },
                    {
                        dataIndex: 'relatedPaperId',
                        width: '100px',
                        render: (value, record) => (
                            <Form
                                size='small'
                                layout='inline'
                                onFinish={(values) =>
                                    onSelect && onSelect(record, values.productQuantity)
                                }
                            >
                                <Form.Item
                                    noStyle={true}
                                    name='productQuantity'
                                    initialValue={
                                        selectedOptions[record._id]
                                            ? selectedOptions[record._id].productQuantity
                                            : undefined
                                    }
                                >
                                    <InputNumber
                                        defaultValue={0}
                                        min={0}
                                        max={record.productQuantity}
                                        style={{ width: '56px' }}
                                    />
                                </Form.Item>
                                <Form.Item noStyle={true}>
                                    <Button htmlType='submit' icon={<PlusOutlined />} />
                                </Form.Item>
                            </Form>
                        ),
                    },
                ]}
            />
        </div>
    );
};

export default InventoryCreateFormSelect;
