import React, { createContext, useContext, useState } from 'react';

const Context = createContext({
    account: {} as any,
    setAccount: (account: any) => null,
});

const Provider: React.FC<{}> = ({ children }) => {
    const [account, setAccount] = useState({});
    return (
        <Context.Provider value={{ account, setAccount: setAccount as any }}>
            {children}
        </Context.Provider>
    );
};

export const useAccount = () => useContext(Context);

export const AccountProvider = Provider;
