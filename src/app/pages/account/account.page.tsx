import React from 'react';

import { Avatar, List, PageHeader, Space, Tag, Typography } from 'antd';
import { LogoutOutlined } from '@ant-design/icons';

import { useAuthN } from 'src/core/auth/auth-n';

import PageBreadcrumb from 'src/app/component/page-breadcrumb.component';

import pageheader from './account.pageheader';

const AccountPage: React.FC = () => {
    const { user, logout } = useAuthN();
    const data = [
        {
            title: 'Logout',
        },
    ];
    return (
        <div>
            <PageBreadcrumb crumbs={pageheader.breadcrumbs} />
            <PageHeader onBack={pageheader.onBack} title='Account'>
                <Space>
                    {user?.email}
                    <Tag color='warning'>Not Verified</Tag>
                </Space>
            </PageHeader>

            <div style={{ padding: '0 24px' }}>
                <List
                    itemLayout='horizontal'
                    dataSource={data}
                    renderItem={(item) => (
                        <List.Item style={{ cursor: 'pointer' }} onClick={() => logout()}>
                            <List.Item.Meta
                                avatar={
                                    <Avatar
                                        style={{ background: '#fff', color: '#ff4d4f' }}
                                        icon={<LogoutOutlined />}
                                    />
                                }
                                title={
                                    <Typography.Text type='danger'>{item.title}</Typography.Text>
                                }
                                description='End your session'
                            />
                        </List.Item>
                    )}
                />
            </div>
        </div>
    );
};

export default AccountPage;
