import React from 'react';

import { Breadcrumb, Button, Tag } from 'antd';
import { MenuFoldOutlined, MenuOutlined } from '@ant-design/icons';

import Link from 'src/core/navigation/lib/link';

import { useLayout } from 'src/app/main/app.layout';

const PageBreadcrumb: React.FC<{
    crumbs: Array<{ path: string; label?: string; icon?: any }>;
}> = ({ crumbs }) => {
    const { isMenuCollapsed, setIsMenuCollapsed } = useLayout();
    return (
        <div
            style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                margin: '12px 16px 0 16px',
                border: '1px solid rgba(208, 216, 243, 0.24)',
                borderRadius: '8px',
                boxShadow:
                    '0 1px 2px -2px rgba(208, 216, 243,.16), 0 3px 6px 0 rgba(208, 216, 243,.12), 0 5px 12px 4px rgba(208, 216, 243,.09)',
            }}
        >
            <div
                style={{
                    display: 'flex',
                    alignItems: 'center',
                }}
            >
                <Button
                    type='text'
                    onClick={() => setIsMenuCollapsed(!isMenuCollapsed)}
                    icon={isMenuCollapsed ? <MenuOutlined /> : <MenuFoldOutlined />}
                />
                <Breadcrumb
                    style={{
                        background: 'rgba(208, 216, 243, 0.2)',
                        padding: '0 8px',
                        borderRadius: '8px',
                    }}
                >
                    {crumbs.map(({ icon, label, path }) => (
                        <Breadcrumb.Item key={path}>
                            <Link href={path}>
                                <a>
                                    {icon}
                                    {label && <span>{label}</span>}
                                </a>
                            </Link>
                        </Breadcrumb.Item>
                    ))}
                </Breadcrumb>
            </div>
            <Tag
                color='#874d00'
                style={{
                    textAlign: 'center',
                    borderRadius: 8,
                    color: '#fff',
                    fontWeight: 'bold',
                }}
            >
                Warehouse
            </Tag>
        </div>
    );
};

export default PageBreadcrumb;
