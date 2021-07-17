import React, { createContext, useContext, useState } from 'react';

import { Avatar, Button, Divider, Layout, Menu, Space } from 'antd';
import {
    DatabaseOutlined,
    ExportOutlined,
    ImportOutlined,
    GoldOutlined,
    SettingOutlined,
} from '@ant-design/icons';

import { useAuthN } from 'src/core/auth/auth-n';
import Link from 'src/core/navigation/lib/link';

import { ReactComponent as Logo } from './assets/app.logo.color.svg';

const LOGISTIC_MENU = [
    {
        sub: true,
        key: 'sub-receiving',
        label: 'Receiving',
        href: undefined,
        icon: ImportOutlined,
        children: [
            {
                key: 'receiving-order',
                label: 'Order',
                href: '/receiving/order',
            },
            {
                key: 'receiving-delivery',
                label: 'Delivery',
                href: '/receiving/delivery',
            },
        ],
    },
    {
        sub: true,
        key: 'sub-shipping',
        label: 'Shipping',
        href: undefined,
        icon: ExportOutlined,
        children: [
            {
                key: 'shipping-order',
                label: 'Order',
                href: '/shipping/order',
            },
            {
                key: 'shipping-delivery',
                label: 'Delivery',
                href: '/shipping/delivery',
            },
        ],
    },
    {
        sub: true,
        key: 'sub-storage',
        label: 'Storage',
        href: undefined,
        icon: GoldOutlined,
        children: [
            {
                key: 'storage-inventory',
                label: 'Inventory',
                href: '/storage/inventory',
            },
            {
                key: 'storage-registry',
                label: 'Registry',
                href: '/storage/registry',
            },
            {
                key: 'storage-arrangement',
                label: 'Arrangement',
                href: '/storage/arrangement',
            },
        ],
    },
];

const OTHER_MENU = [
    {
        sub: true,
        key: 'sub-library',
        label: 'Library',
        href: undefined,
        icon: DatabaseOutlined,
        children: [
            {
                key: 'driver',
                label: 'Driver',
                href: '/library/driver',
            },
        ],
    },
];

const LayoutContext = createContext({
    isMenuCollapsed: false,
    setIsMenuCollapsed: (x: boolean) => null,
});

export const useLayout = () => useContext(LayoutContext);

export const LayoutProvider: React.FC = ({ children }) => {
    const [isMenuCollapsed, setIsMenuCollapsed] = useState(false);
    return (
        <LayoutContext.Provider
            value={{ isMenuCollapsed, setIsMenuCollapsed: setIsMenuCollapsed as any }}
        >
            {children}
        </LayoutContext.Provider>
    );
};

const AppLayout: React.FC<{ content: any }> = ({ content }) => {
    const { isMenuCollapsed } = useLayout();
    const { user } = useAuthN();
    return (
        <Layout style={{ minHeight: '100vh' }}>
            <Layout.Sider
                collapsedWidth={0}
                collapsed={isMenuCollapsed}
                theme='light'
                style={{ background: '#fff', minHeight: '100vh', borderRight: '1px solid #f0f0f0' }}
            >
                <Menu
                    mode='inline'
                    style={{ borderRight: 0 }}
                    defaultOpenKeys={['sub-receiving', 'sub-shipping', 'sub-storage']}
                >
                    <div
                        style={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'left',
                            padding: '8px 24px',
                            height: '55px',
                            boxShadow: '#f0f0f0 0px -1px 0px 0px inset',
                        }}
                    >
                        <Logo width={undefined} style={{ marginTop: '-8px', height: '100%' }} />
                    </div>
                    <div
                        style={{
                            display: 'flex',
                            alignItems: 'center',
                            padding: '12px',
                            justifyContent: 'space-between',
                            boxShadow: '#f0f0f0 0px -1px 0px 0px inset',
                        }}
                    >
                        <div>
                            <Avatar style={{ margin: '0 8px' }} size='small' src={user?.picture} />
                            {user?.nickname}
                        </div>
                        <Space size='small'>
                            <Divider type='vertical' />
                            <Link href='/account'>
                                <Button type='link' size='small' icon={<SettingOutlined />} />
                            </Link>
                        </Space>
                    </div>
                    {LOGISTIC_MENU.map((menu) =>
                        menu.sub ? (
                            <Menu.SubMenu key={menu.key} title={menu.label} icon={<menu.icon />}>
                                {menu.children.map((child) => (
                                    <Menu.Item key={child.key}>
                                        <Link href={child.href}>
                                            <Button
                                                type='link'
                                                style={{
                                                    width: '100%',
                                                    textAlign: 'left',
                                                    padding: '4px 0',
                                                    height: '100%',
                                                }}
                                            >
                                                {child.label}
                                            </Button>
                                        </Link>
                                    </Menu.Item>
                                ))}
                            </Menu.SubMenu>
                        ) : (
                            <Menu.Item key={menu.key}>
                                <Link href={menu.href!}>
                                    <Button
                                        type='link'
                                        icon={<menu.icon />}
                                        style={{
                                            width: '100%',
                                            textAlign: 'left',
                                            padding: '4px 0',
                                            height: '100%',
                                        }}
                                    >
                                        {menu.label}
                                    </Button>
                                </Link>
                            </Menu.Item>
                        )
                    )}
                    <Menu.ItemGroup title='Other'>
                        {OTHER_MENU.map((menu) =>
                            menu.sub ? (
                                <Menu.SubMenu
                                    key={menu.key}
                                    title={menu.label}
                                    icon={<menu.icon />}
                                >
                                    {menu.children.map((child) => (
                                        <Menu.Item key={child.key}>
                                            <Link href={child.href}>
                                                <Button
                                                    type='link'
                                                    style={{
                                                        width: '100%',
                                                        textAlign: 'left',
                                                        padding: '4px 0',
                                                        height: '100%',
                                                    }}
                                                >
                                                    {child.label}
                                                </Button>
                                            </Link>
                                        </Menu.Item>
                                    ))}
                                </Menu.SubMenu>
                            ) : (
                                <Menu.Item key={menu.key}>
                                    <Link href={menu.href!}>
                                        <Button
                                            type='link'
                                            icon={<menu.icon />}
                                            style={{
                                                width: '100%',
                                                textAlign: 'left',
                                                padding: '4px 0',
                                                height: '100%',
                                            }}
                                        >
                                            {menu.label}
                                        </Button>
                                    </Link>
                                </Menu.Item>
                            )
                        )}
                    </Menu.ItemGroup>
                </Menu>
            </Layout.Sider>
            <Layout>
                <Layout.Content style={{ background: '#fff' }}>{content}</Layout.Content>
            </Layout>
        </Layout>
    );
};

export default AppLayout;
