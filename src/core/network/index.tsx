import React, { createContext, useContext, useState } from 'react';
import { Provider as HttpProvider } from 'use-http';

const Context = createContext({
    domain: '',
    url: '',
    token: '',
    setToken: (_: string) => null,
    isReady: false,
});

const Provider: React.FC<{ domain: string; url: string }> = ({ domain, url, children }) => {
    const [token, setToken] = useState('');
    return (
        <Context.Provider
            value={{ domain, url, token, setToken: setToken as any, isReady: !!token }}
        >
            <HttpProvider
                url={url}
                options={{
                    interceptors: {
                        request: async ({ options, url }) => {
                            if (url?.startsWith(domain)) {
                                (options.headers as any).Authorization = `Bearer ${token}`;
                            }
                            return options;
                        },
                    },
                }}
            >
                {children}
            </HttpProvider>
        </Context.Provider>
    );
};

export const useNetwork = () => useContext(Context);

export const NetworkProvider = Provider;
