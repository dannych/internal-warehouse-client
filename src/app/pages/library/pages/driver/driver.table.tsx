import React, { useRef } from 'react';

import { Button, Input, Popconfirm, Space, Table } from 'antd';
import { DeleteOutlined, EditOutlined, SearchOutlined } from '@ant-design/icons';

import { ReadManyOfficers } from './driver.interface';

const Product: React.FC<{
    dataSource?: ReadManyOfficers[];
    isLoading?: boolean;
    isActionDisabled?: boolean;
    onDelete?: (data: ReadManyOfficers) => void;
    onSearch?: (query: { [x: string]: any }) => void;
}> = ({ dataSource = [], isLoading, isActionDisabled, onDelete, onSearch }) => {
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
            record[dataIndex].toString().toLowerCase().includes(value.toLowerCase()),
        onFilterDropdownVisibleChange: (visible: boolean) => {
            if (visible) {
                setTimeout(() => searchInput.current!.select());
            }
        },
    });

    const COLUMNS = [
        {
            title: 'Code',
            dataIndex: 'code',
            width: '120px',
            ...getColumnSearchProps('code'),
        },
        {
            title: 'Name',
            dataIndex: 'name',
        },
        {
            title: 'Action',
            key: 'action',
            width: '72px',
            render: (_: string, record: ReadManyOfficers) => (
                <Space>
                    <Button type='link' icon={<EditOutlined />} disabled={true} />
                    <Popconfirm
                        title='Are you sure delete this entry?'
                        onConfirm={() => onDelete && onDelete(record)}
                        okText='Yes'
                        cancelText='No'
                    >
                        <Button
                            danger={true}
                            type='link'
                            icon={<DeleteOutlined />}
                            disabled={isActionDisabled}
                        />
                    </Popconfirm>
                </Space>
            ),
        },
    ];

    return (
        <Table
            size='small'
            rowKey='code'
            pagination={false}
            loading={isLoading}
            columns={COLUMNS}
            dataSource={dataSource}
        />
    );
};

export default Product;
