import { createContext } from 'react';

export const AuthContext = createContext({
    url: '',
    accessTokenKey: '',
    expiredAtKey: '',
    redirectKey: '',
});
