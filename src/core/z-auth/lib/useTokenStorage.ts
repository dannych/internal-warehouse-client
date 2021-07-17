import { useEffect, useState } from 'react';

import { useStorage } from 'src/core/storage/lib/useStorage';

const NAMESPACE = '__TOKEN_STORAGE__';

export const useTokenStorage = (initialValue?: { accessToken: string; expiredAt: string }) => {
    const [storedToken, storeToken] = useStorage<{ accessToken: string; expiredAt: string }>(
        NAMESPACE
    );
    const token = initialValue?.accessToken && initialValue?.expiredAt ? initialValue : storedToken;

    const [stateToken] = useState(token);

    const hasValidToken =
        stateToken && !!stateToken.accessToken && new Date() < new Date(stateToken.expiredAt);

    useEffect(() => {
        storeToken({ accessToken: token.accessToken, expiredAt: token.expiredAt });
    }, [storeToken, token.accessToken, token.expiredAt]);

    return {
        hasValidToken,
        token,
    };
};
