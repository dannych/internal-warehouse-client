import React from 'react';

import { Col, PageHeader, Row, Statistic, Tag } from 'antd';

import PageBreadcrumb from 'src/app/component/page-breadcrumb.component';
import dateFormatter, { DATE_FORMAT } from 'src/app/helper/format/date';

import pageheader from './home.pageheader';

const Home = () => {
    return (
        <div>
            <PageBreadcrumb crumbs={pageheader.breadcrumbs} />
            <PageHeader
                onBack={pageheader.onBack}
                title='Primatech Warehouse Console'
                tags={<Tag color='blue'>Admin</Tag>}
            >
                <Row gutter={16}>
                    <Col span={8}>
                        <Statistic
                            title='Today Date'
                            value={dateFormatter().format(DATE_FORMAT['DD MMMM YYYY'])}
                        />
                    </Col>
                    <Col span={16}>
                        <img src='/discount.svg' alt='content' width='100%' />
                    </Col>
                </Row>
            </PageHeader>
        </div>
    );
};

export default Home;
