import { useContext } from 'react';

import { useHistory } from 'src/core/navigation/lib/useHistory';

import { AuthContext } from '../context';
import { useTokenStorage } from './useTokenStorage';

export const useAuth = () => {
    const { search, replace, location } = useHistory();
    const { accessTokenKey, expiredAtKey, url } = useContext(AuthContext);
    const { hasValidToken } = useTokenStorage({
        accessToken: search[accessTokenKey] as string,
        expiredAt: search[expiredAtKey] as string,
    });

    return {
        isAuth: hasValidToken,
        auth: () => (window.location.href = url + `?continue=${window.location.href}`),
        cleanse: () => replace(location.pathname),
    };
};
