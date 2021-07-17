import React from 'react';

import { HomeOutlined } from '@ant-design/icons';

import { history } from 'src/core/navigation/router';

interface BreadcrumbConfig {
    path: string;
    label?: string;
    icon?: string;
}

interface Config {
    breadcrumbs: BreadcrumbConfig[];
}
export default (config: Config) => {
    // const indexedConfig = configs.reduce((index, config) => ({ ...index, [config.path]: config}), {});
    return {
        breadcrumbs: [
            {
                path: '/',
                icon: <HomeOutlined />,
            },
            ...config.breadcrumbs,
        ],
        onBack: config.breadcrumbs.length > 1 ? () => history.goBack() : undefined,
    };
};
