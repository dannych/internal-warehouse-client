import React from 'react';

import { Card, List, PageHeader } from 'antd';

import Link from 'src/core/navigation/lib/link';

import PageBreadcrumb from 'src/app/component/page-breadcrumb.component';

import pageheader from './library.pageheader';

const DATA = [
    {
        title: 'Driver',
        content: 'Primatech driver',
        path: '/library/driver',
    },
];

const LibraryPage = () => (
    <div>
        <PageBreadcrumb crumbs={pageheader.breadcrumbs} />
        <PageHeader onBack={pageheader.onBack} title='Library' />
        <div style={{ padding: '0 24px' }}>
            <List
                grid={{ gutter: 16, column: 4 }}
                dataSource={DATA}
                renderItem={(item) => (
                    <List.Item style={{ height: '100%' }}>
                        <Link href={item.path}>
                            <a>
                                <Card
                                    title={item.title}
                                    style={{ height: '100%' }}
                                    hoverable={true}
                                >
                                    {item.content}
                                </Card>
                            </a>
                        </Link>
                    </List.Item>
                )}
            />
        </div>
    </div>
);

export default LibraryPage;
