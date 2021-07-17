import React, { useEffect } from 'react';

import { hasAccess } from 'src/core/auth/access';
import { AccountProvider, useAccount } from 'src/core/auth/account';
import { AuthNProvider, useAuthN } from 'src/core/auth/auth-n';
import { Router, history } from 'src/core/navigation/router';
import { Route, Switch } from 'src/core/navigation/lib/route';
import { NetworkProvider, useNetwork } from 'src/core/network';

import { ReactComponent as NoAccess } from './assets/app.no-access.svg';

import AppAccess from './app.access';
import { AppConfig } from './app.interface';
import AppLayout, { LayoutProvider } from './app.layout';
import AppRoute from './app.route';

export const AppContext: React.FC<{ config: AppConfig }> = ({ config, children }) => {
    const onRedirectCallback = (appState: any) => {
        history.push(
            appState && appState.targetUrl ? appState.targetUrl : window.location.pathname
        );
    };
    return (
        <Router history={history}>
            <AuthNProvider
                audience={config.API_DOMAIN_URI}
                domain={config.AUTHN_DOMAIN}
                clientId={config.AUTHN_CLIENT_ID}
                redirectUri={window.location.origin}
                onRedirectCallback={onRedirectCallback}
                roleUrl={config.AUTHN_ROLE_URL}
                permissions={AppAccess}
            >
                <NetworkProvider domain={config.API_DOMAIN_URI} url={config.API_BASE_URL}>
                    <AccountProvider>
                        <LayoutProvider>{children}</LayoutProvider>
                    </AccountProvider>
                </NetworkProvider>
            </AuthNProvider>
        </Router>
    );
};

export const AppContent: React.FC = () => {
    const { isInitiated, isAuthenticated, loginWithRedirect, user, getTokenSilently } = useAuthN();
    const { isReady, setToken } = useNetwork();
    const { setAccount } = useAccount();

    useEffect(() => {
        if (isInitiated && !isAuthenticated) {
            loginWithRedirect();
        }

        const fn = async () => {
            if (isAuthenticated) {
                setAccount(user);
                setToken(await getTokenSilently());
            }
        };

        fn();
    }, [
        isInitiated,
        isAuthenticated,
        user,
        loginWithRedirect,
        getTokenSilently,
        setToken,
        setAccount,
    ]);

    if (isAuthenticated && !hasAccess(user, 'app:access')) {
        return (
            <div
                style={{
                    height: '100vh',
                    width: '100vw',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                }}
            >
                <NoAccess />
            </div>
        );
    }

    return isAuthenticated && isReady ? (
        <Switch>
            <Route render={() => <AppLayout content={<AppRoute />} />} />
        </Switch>
    ) : (
        <div className='app-loader-window'>
            <div>
                <div className='app-loader-container'>
                    <div className='app-loader'>
                        <div></div>
                        <div></div>
                        <div></div>
                    </div>
                </div>
                <div className='app-loader-text'>Validating</div>
            </div>
        </div>
    );
};

export default ({ config }: { config: AppConfig }) => (
    <AppContext config={config}>
        <AppContent />
    </AppContext>
);
