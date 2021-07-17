import React, { useState, useEffect, useContext } from 'react';
import createAuth0Client, { Auth0Client } from '@auth0/auth0-spa-js';

const DEFAULT_REDIRECT_CALLBACK = () =>
    window.history.replaceState({}, document.title, window.location.pathname);

export const AuthNContext = React.createContext({} as any);
export const useAuthN = () => useContext(AuthNContext);
export const AuthNProvider: React.FC<{
    onRedirectCallback: (state: any) => void;
    audience: string;
    domain: string;
    clientId: string;
    redirectUri: string;
    roleUrl: string;
    permissions: { [x: string]: string[] };
}> = ({
    children,
    onRedirectCallback = DEFAULT_REDIRECT_CALLBACK,
    roleUrl,
    permissions,
    ...initOptions
}) => {
    const [isInitiated, setIsInitiated] = useState<boolean>();
    const [isAuthenticated, setIsAuthenticated] = useState<boolean>();
    const [user, setUser] = useState();
    const [auth0Client, setAuth0] = useState<Auth0Client>();
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const initAuth0 = async () => {
            const auth0FromHook = await createAuth0Client({
                domain: initOptions.domain,
                audience: initOptions.audience,
                redirect_uri: initOptions.redirectUri,
                client_id: initOptions.clientId,
                useRefreshTokens: true,
                cacheLocation: 'localstorage',
            });
            setAuth0(auth0FromHook);

            if (
                window.location.search.includes('code=') &&
                window.location.search.includes('state=')
            ) {
                const { appState } = await auth0FromHook.handleRedirectCallback();
                onRedirectCallback(appState);
            }

            const isAuthenticated = await auth0FromHook.isAuthenticated();

            setIsAuthenticated(isAuthenticated);

            if (isAuthenticated) {
                setUser(
                    attachUserWithAccess(await auth0FromHook.getUser(), { roleUrl, permissions })
                );
            }

            setLoading(false);
            setIsInitiated(true);
        };
        initAuth0();
        // eslint-disable-next-line
    }, [isAuthenticated, (user as any)?.sub]);

    const handleRedirectCallback = async () => {
        setLoading(true);
        await auth0Client?.handleRedirectCallback();
        setUser(attachUserWithAccess(await auth0Client?.getUser(), { roleUrl, permissions }));
        setLoading(false);
        setIsAuthenticated(true);
    };

    return (
        <AuthNContext.Provider
            value={{
                isInitiated,
                isAuthenticated,
                user,
                loading,
                handleRedirectCallback,
                getIdTokenClaims: (...p: any) => auth0Client?.getIdTokenClaims(...p),
                loginWithRedirect: (...p: any) => auth0Client?.loginWithRedirect(...p),
                getTokenSilently: (...p: any) => auth0Client?.getTokenSilently(...p),
                getTokenWithPopup: (...p: any) => auth0Client?.getTokenWithPopup(...p),
                logout: (...p: any) =>
                    auth0Client?.logout({ returnTo: initOptions.redirectUri, ...p }),
            }}
        >
            {children}
        </AuthNContext.Provider>
    );
};

const attachUserWithAccess = (
    user: any,
    config: { roleUrl: string; permissions: { [x: string]: string[] } }
) => ({
    ...user,
    roles: user && user[config.roleUrl],
    permissions: ((user && user[config.roleUrl]) || []).reduce(
        (x: any, role: string) =>
            (config.permissions[role] || []).reduce((y, permit) => ({ ...y, [permit]: 1 }), x),
        {}
    ),
});
