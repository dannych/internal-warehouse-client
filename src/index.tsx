import React from 'react';
import ReactDOM from 'react-dom';

import { loadEnv } from 'src/core/basic/isomorph';

import App from './app/main/app.module';

import './index.css';
import * as serviceWorker from './serviceWorker';

const BUILD_CONFIG = {
    AUTHN_DOMAIN: process.env.REACT_APP_AUTHN_DOMAIN!,
    AUTHN_CLIENT_ID: process.env.REACT_APP_AUTHN_CLIENT_ID!,
    AUTHN_ROLE_URL: process.env.REACT_APP_AUTHN_ROLE_URL!,
    API_VALIDATE_URL: process.env.REACT_APP_API_VALIDATE_URL!,
    API_BASE_URL: process.env.REACT_APP_API_BASE_URL!,
    API_DOMAIN_URI: process.env.REACT_APP_API_DOMAIN_URI!,
};

const main = async () => {
    const config =
        process.env.NODE_ENV === 'production'
            ? { ...BUILD_CONFIG, ...(await loadEnv('/.poorman-known/env.js')) }
            : BUILD_CONFIG;

    ReactDOM.render(
        <React.StrictMode>
            <App config={config} />
        </React.StrictMode>,
        document.getElementById('root')
    );

    // If you want your app to work offline and load faster, you can change
    // unregister() to register() below. Note this comes with some pitfalls.
    // Learn more about service workers: https://bit.ly/CRA-PWA
    serviceWorker.unregister();
};

main();
